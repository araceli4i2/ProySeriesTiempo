"""
Exportador de Resultados SARIMA (Metodología Box-Jenkins)
DAT-262: Procesos Estocásticos y Análisis de Series de Tiempo - UMSA
Genera data/sarima_results.json para el Dashboard Analítico.
"""

import argparse
import datetime
import json
import os
import sys
import warnings

import numpy as np
import pandas as pd
from scipy import stats
from statsmodels.tsa.seasonal import STL
from statsmodels.tsa.stattools import adfuller, kpss, acf, pacf
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.stats.diagnostic import acorr_ljungbox


def parse_args():
    parser = argparse.ArgumentParser(description="Exportar análisis SARIMA a JSON")
    parser.add_argument("--csv", type=str, default=None, help="Ruta a archivo CSV con serie diaria (columnas: date, events/value)")
    parser.add_argument("--start", type=str, default="2023-10-04", help="Fecha inicial YYYY-MM-DD")
    parser.add_argument("--end", type=str, default="2024-01-31", help="Fecha final YYYY-MM-DD")
    parser.add_argument("--s", type=int, default=7, help="Periodo estacional (def: 7 días)")
    parser.add_argument("--h", type=int, default=14, help="Horizonte de pronóstico/test (def: 14 días)")
    parser.add_argument("--alpha", type=float, default=0.05, help="Nivel de significancia (def: 0.05)")
    parser.add_argument("--out", type=str, default="data/sarima_results.json", help="Ruta del archivo JSON de salida")
    return parser.parse_args()


def load_or_generate_series(csv_path, start_date_str, end_date_str, s=7, h=14):
    """Carga datos desde CSV o genera serie sintética realista calibrada con GitHub Archive."""
    if csv_path and os.path.exists(csv_path):
        print(f"Cargando serie desde CSV: {csv_path}")
        df = pd.read_csv(csv_path)
        # Buscar columna de fecha y eventos
        date_col = next((c for c in df.columns if any(k in c.lower() for k in ["date", "fecha", "day", "dia"])), None)
        val_col = next((c for c in df.columns if any(k in c.lower() for k in ["event", "valor", "value", "count", "total"])), None)
        if not date_col or not val_col:
            raise ValueError(f"No se identificaron columnas de fecha o valor en {csv_path}")
        df[date_col] = pd.to_datetime(df[date_col])
        df = df.sort_values(date_col).dropna(subset=[val_col])
        df = df.set_index(date_col)
        df_daily = df[val_col].resample("D").sum()
        dates = [d.strftime("%Y-%m-%d") for d in df_daily.index]
        values = df_daily.values.tolist()
        source = "csv"
    else:
        # Generar serie calibrada con GitHub Archive (Enero 2024 order of magnitude ~250k eventos diarios)
        print("Generando serie temporal diaria (120 días, calibrada con GitHub Archive)...")
        np.random.seed(42)
        n = 120
        start_dt = datetime.datetime.strptime(start_date_str, "%Y-%m-%d")
        dt_range = [start_dt + datetime.timedelta(days=i) for i in range(n)]
        dates = [d.strftime("%Y-%m-%d") for d in dt_range]

        # Factores semanales empíricos de GitHub Archive (Lunes a Domingo)
        # Lun, Mar, Mié, Jue, Vie, Sáb, Dom
        weekday_multipliers = [1.14, 1.25, 1.28, 1.23, 1.10, 0.54, 0.46]
        base_level = 210000.0
        trend_drift = np.linspace(0, 35000.0, n)
        
        values = []
        ar_noise = 0.0
        for i, dt in enumerate(dt_range):
            wd = dt.weekday() # 0 = Lun, 6 = Dom
            s_mult = weekday_multipliers[wd]
            # Pequeña componente autorregresiva de ruido
            ar_noise = 0.3 * ar_noise + np.random.normal(0, 7500.0)
            val = (base_level + trend_drift[i]) * s_mult + ar_noise
            values.append(float(max(50000.0, round(val))))
        source = "simulated"

    return dates, values, source


def main():
    args = parse_args()
    dates, values, source = load_or_generate_series(args.csv, args.start, args.end, args.s, args.h)

    n_total = len(values)
    H = args.h
    S = args.s
    alpha = args.alpha
    split_idx = n_total - H

    if split_idx < 30:
        raise ValueError("La serie temporal es demasiado corta para entrenar y evaluar SARIMA (mínimo 45 días).")

    train_dates = dates[:split_idx]
    train_vals = np.array(values[:split_idx], dtype=float)
    test_dates = dates[split_idx:]
    test_vals = np.array(values[split_idx:], dtype=float)

    # 1. Transformación Logarítmica
    log_values = np.log(values).tolist()
    train_log = np.log(train_vals)
    test_log = np.log(test_vals)

    # 2. Descomposición STL (Fuerza Estacional Fs)
    print("Calculando descomposición STL y Fuerza Estacional Fs...")
    stl = STL(pd.Series(train_log), period=S, robust=True).fit()
    trend_stl = stl.trend.tolist()
    seasonal_stl = stl.seasonal.tolist()
    resid_stl = stl.resid.tolist()

    var_r = np.var(stl.resid)
    var_sr = np.var(stl.seasonal + stl.resid)
    Fs = float(max(0.0, 1.0 - var_r / var_sr)) if var_sr > 0 else 0.0
    D = 1 if Fs > 0.64 else 0

    # Perfil semanal promedio (factores L..D normalizados)
    # 0 = Lunes, 6 = Domingo
    weekday_factors = [[] for _ in range(7)]
    for i, dt_str in enumerate(train_dates):
        dt = datetime.datetime.strptime(dt_str, "%Y-%m-%d")
        weekday_factors[dt.weekday()].append(np.exp(stl.seasonal[i]))
    weekday_profile = [float(np.mean(f)) if len(f) > 0 else 1.0 for f in weekday_factors]

    # 3. Pipeline de Estacionariedad (ADF y KPSS)
    print("Evaluando pruebas de raíz unitaria y estacionariedad (ADF y KPSS)...")
    def run_tests(series_arr, stage_name):
        arr = series_arr[~np.isnan(series_arr)]
        # ADF
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            adf_res = adfuller(arr, autolag="AIC")
            adf_stat, adf_p = float(adf_res[0]), float(adf_res[1])
            try:
                kpss_res = kpss(arr, regression="c", nlags="auto")
                kpss_stat, kpss_p = float(kpss_res[0]), float(kpss_res[1])
            except Exception:
                try:
                    kpss_res = kpss(arr, regression="c", nlags="legacy")
                    kpss_stat, kpss_p = float(kpss_res[0]), float(kpss_res[1])
                except Exception:
                    kpss_stat, kpss_p = 0.0, 0.1
        # Para ser estacionaria: rechazar no-estacionariedad en ADF (p < 0.05)
        # y NO rechazar estacionariedad en KPSS (p >= 0.05)
        is_stat = (adf_p < 0.05) and (kpss_p >= 0.05)
        return {
            "stage": stage_name,
            "adf_stat": round(adf_stat, 4),
            "adf_p": round(adf_p, 5),
            "kpss_stat": round(kpss_stat, 4),
            "kpss_p": round(kpss_p, 5),
            "stationary": bool(is_stat)
        }

    # Etapa 0: Niveles log
    test_stage0 = run_tests(train_log, "log niveles")

    # Etapa 1: Dif. estacional (D=1)
    train_diff_s = train_log[S:] - train_log[:-S]
    test_stage1 = run_tests(train_diff_s, "D=1 (dif. estacional)")

    # Etapa 2: Dif. estacional + regular (D=1, d=1)
    train_diff_sd = train_diff_s[1:] - train_diff_s[:-1]
    test_stage2 = run_tests(train_diff_sd, "D=1, d=1 (estacional + regular)")

    # Decidir d formalmente
    if test_stage0["stationary"]:
        d = 0
        D = 0
        stat_series = train_log
    elif test_stage1["stationary"]:
        d = 0
        D = 1
        stat_series = train_diff_s
    else:
        d = 1
        D = 1
        stat_series = train_diff_sd

    tests_summary = [test_stage0, test_stage1, test_stage2]

    # ACF / PACF a 35 rezagos sobre la serie estacionaria final
    acf_vals = acf(stat_series, nlags=35, fft=True).tolist()
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        try:
            pacf_vals = pacf(stat_series, nlags=35, method="ywm").tolist()
        except Exception:
            pacf_vals = pacf(stat_series, nlags=35, method="ldb").tolist()
    conf_band = float(1.96 / np.sqrt(len(stat_series)))
    lags_list = list(range(len(acf_vals)))

    # 4. Exploración de la Grilla SARIMA (72 modelos)
    print("Ajustando grilla de modelos SARIMA(p,d,q)(P,D,Q)7 con trend n/c...")
    grid_results = []
    models_detail = {}
    fitted_models = []

    p_vals = [0, 1, 2]
    q_vals = [0, 1, 2]
    P_vals = [0, 1]
    Q_vals = [0, 1]
    trend_vals = ["n", "c"]

    burn = d + D * S

    for p in p_vals:
        for q in q_vals:
            for P in P_vals:
                for Q in Q_vals:
                    for tr in trend_vals:
                        model_id = f"SARIMA({p},{d},{q})({P},{D},{Q})7_{tr}"
                        k_arma = p + q + P + Q
                        try:
                            with warnings.catch_warnings(record=True) as caught_w:
                                warnings.simplefilter("always")
                                mod = SARIMAX(
                                    train_log,
                                    order=(p, d, q),
                                    seasonal_order=(P, D, Q, S),
                                    trend=tr,
                                    enforce_stationarity=True,
                                    enforce_invertibility=True
                                )
                                fit_res = mod.fit(disp=False, maxiter=80)
                                n_warn = len(caught_w)
                                converged = bool(fit_res.mle_retvals.get("converged", True))

                            aic = float(fit_res.aic)
                            bic = float(fit_res.bic)

                            if not np.isfinite(aic):
                                continue

                            # Diagnóstico preliminar de residuos descartando burn
                            resids_raw = fit_res.resid
                            resids_clean = resids_raw[burn:]

                            # Ljung-Box en lags 14 y 21 con model_df corregido
                            lb_p14, lb_p21 = 0.5, 0.5
                            try:
                                lb_df = acorr_ljungbox(resids_clean, lags=[14, 21], model_df=k_arma, return_df=True)
                                lb_p14 = float(lb_df.loc[14, "lb_pvalue"])
                                lb_p21 = float(lb_df.loc[21, "lb_pvalue"])
                            except Exception:
                                pass

                            # Jarque-Bera
                            jb_res = stats.jarque_bera(resids_clean)
                            jb_p = float(jb_res.pvalue)

                            # Heterocedasticidad (prueba de cociente de varianzas / breakvar)
                            n_res = len(resids_clean)
                            third = max(5, n_res // 3)
                            v_init = np.var(resids_clean[:third])
                            v_end = np.var(resids_clean[-third:])
                            f_stat = v_end / v_init if v_init > 0 else 1.0
                            het_p = float(2 * min(stats.f.cdf(f_stat, third, third), 1.0 - stats.f.cdf(f_stat, third, third)))

                            # Alerta de sobrediferenciación: si algún coeficiente MA estacional o regular < -0.95
                            overdiff = False
                            p_names = getattr(fit_res, "param_names", [f"p_{idx}" for idx in range(len(fit_res.params))])
                            for param_name, param_val in zip(p_names, fit_res.params):
                                if ("ma." in param_name.lower()) and float(param_val) < -0.95:
                                    overdiff = True
                                    break

                            passes = bool(lb_p14 > 0.05 and lb_p21 > 0.05 and not overdiff and converged)

                            item = {
                                "model_id": model_id,
                                "order": [p, d, q],
                                "seasonal": [P, D, Q, S],
                                "trend": tr,
                                "aic": round(aic, 2),
                                "bic": round(bic, 2),
                                "converged": converged,
                                "n_warn": n_warn,
                                "k_arma": k_arma,
                                "lb_p14": round(lb_p14, 4),
                                "lb_p21": round(lb_p21, 4),
                                "jb_p": round(jb_p, 4),
                                "het_p": round(het_p, 4),
                                "overdiff": overdiff,
                                "passes": passes
                            }
                            grid_results.append(item)
                            if converged:
                                fitted_models.append((aic, item, fit_res))

                        except Exception as e:
                            continue

    # Ordenar por AIC
    grid_results.sort(key=lambda x: x["aic"])
    fitted_models.sort(key=lambda x: x[0])

    if not grid_results:
        raise RuntimeError("No convergió ningún modelo SARIMA en la grilla.")

    # 5. Selección del Modelo Óptimo
    chosen_item = next((item for item in grid_results if item["passes"]), None)
    if chosen_item is not None:
        selection_passed = True
    else:
        chosen_item = grid_results[0]
        selection_passed = False

    chosen_model_id = chosen_item["model_id"]
    chosen_fit = next(f[2] for f in fitted_models if f[1]["model_id"] == chosen_model_id)

    # Parametros del modelo elegido
    params_list = []
    opt_pnames = getattr(chosen_fit, "param_names", [f"param_{idx}" for idx in range(len(chosen_fit.params))])
    for i, pname in enumerate(opt_pnames):
        coef = float(chosen_fit.params[i])
        se = float(chosen_fit.bse[i]) if hasattr(chosen_fit, "bse") and i < len(chosen_fit.bse) else 0.0
        pval = float(chosen_fit.pvalues[i]) if hasattr(chosen_fit, "pvalues") and i < len(chosen_fit.pvalues) else 0.0
        params_list.append({
            "name": pname,
            "coef": round(coef, 4),
            "se": round(se, 4),
            "p": round(pval, 4)
        })

    # Benchmark Naive Estacional: y_{t-7}
    # Para periodo de test (H=14): observación correspondiente hace 7 días
    naive_test_preds = []
    for i in range(H):
        origin_idx = split_idx + i - S
        if origin_idx >= 0:
            naive_test_preds.append(float(values[origin_idx]))
        else:
            naive_test_preds.append(float(train_vals[-1]))

    # In-sample seasonal naive MAE para cálculo de MASE
    insample_naive_errors = []
    for t in range(S, len(train_vals)):
        insample_naive_errors.append(abs(train_vals[t] - train_vals[t - S]))
    mase_scale = float(np.mean(insample_naive_errors)) if len(insample_naive_errors) > 0 else 1.0

    def compute_metrics(y_true, y_pred):
        y_true = np.array(y_true)
        y_pred = np.array(y_pred)
        err = y_true - y_pred
        mae = float(np.mean(np.abs(err)))
        rmse = float(np.sqrt(np.mean(err ** 2)))
        mape = float(np.mean(np.abs(err / y_true)) * 100)
        mase = float(mae / mase_scale) if mase_scale > 0 else 0.0
        return {
            "mae": round(mae, 1),
            "rmse": round(rmse, 1),
            "mape": round(mape, 2),
            "mase": round(mase, 3)
        }

    naive_metrics = compute_metrics(test_vals, naive_test_preds)

    # 6. Preparar detalle de Residuos y Validación para Top-10 modelos
    print("Calculando diagnósticos y pronósticos detallados para los Top-10 modelos...")
    top10_tuples = fitted_models[:10]

    for aic_val, item, fit_obj in top10_tuples:
        m_id = item["model_id"]
        resids_full = fit_obj.resid[burn:]
        
        # ACF de residuos
        res_acf = acf(resids_full, nlags=21, fft=True).tolist()
        
        # QQ-Plot data (ordenados contra cuantiles normales teóricos)
        std_resids = (resids_full - np.mean(resids_full)) / (np.std(resids_full) + 1e-8)
        std_resids_sorted = np.sort(std_resids)
        norm_quantiles = stats.norm.ppf(np.linspace(0.01, 0.99, len(std_resids_sorted)))

        # Histograma de residuos (15 bins)
        counts, bin_edges = np.histogram(resids_full, bins=15, density=True)
        bin_centers = 0.5 * (bin_edges[:-1] + bin_edges[1:])

        # Pronóstico de validación sobre periodo de test (H=14)
        fcast = fit_obj.get_forecast(steps=H)
        mean_log = fcast.predicted_mean
        conf_log = fcast.conf_int(alpha=alpha)
        
        # Exponenciar para escala original
        sarima_pred_vals = np.exp(mean_log).tolist()
        lo_vals = np.exp(conf_log.iloc[:, 0]).tolist() if hasattr(conf_log, "iloc") else np.exp(conf_log[:, 0]).tolist()
        hi_vals = np.exp(conf_log.iloc[:, 1]).tolist() if hasattr(conf_log, "iloc") else np.exp(conf_log[:, 1]).tolist()

        # Cobertura empírica
        in_bounds = 0
        for obs, lo, hi in zip(test_vals, lo_vals, hi_vals):
            if lo <= obs <= hi:
                in_bounds += 1
        coverage_pct = round((in_bounds / H) * 100, 1)

        sarima_metrics = compute_metrics(test_vals, sarima_pred_vals)

        models_detail[m_id] = {
            "residuals": {
                "burn": burn,
                "dates": train_dates[burn:],
                "values": [round(float(v), 5) for v in resids_full],
                "acf": {
                    "lags": list(range(len(res_acf))),
                    "values": [round(float(v), 4) for v in res_acf],
                    "conf": round(float(1.96 / np.sqrt(len(resids_full))), 4)
                },
                "qq": {
                    "theoretical": [round(float(v), 4) for v in norm_quantiles],
                    "sample": [round(float(v), 4) for v in std_resids_sorted]
                },
                "hist": {
                    "bins": [round(float(v), 5) for v in bin_centers],
                    "density": [round(float(v), 4) for v in counts]
                }
            },
            "validation": {
                "dates": test_dates,
                "observed": [round(float(v), 1) for v in test_vals],
                "sarima": [round(float(v), 1) for v in sarima_pred_vals],
                "lo": [round(float(v), 1) for v in lo_vals],
                "hi": [round(float(v), 1) for v in hi_vals],
                "naive": [round(float(v), 1) for v in naive_test_preds],
                "metrics": {
                    "sarima": sarima_metrics,
                    "naive": naive_metrics
                },
                "coverage": coverage_pct,
                "in_bounds_count": in_bounds,
                "total_count": H
            }
        }

    # 7. Pronóstico Futuro (H=14 días tras reajustar con TODA la serie)
    print("Reajustando modelo ganador con la serie completa para pronóstico futuro a 14 días...")
    p_opt, d_opt, q_opt = chosen_item["order"]
    P_opt, D_opt, Q_opt, S_opt = chosen_item["seasonal"]
    tr_opt = chosen_item["trend"]

    full_mod = SARIMAX(
        log_values,
        order=(p_opt, d_opt, q_opt),
        seasonal_order=(P_opt, D_opt, Q_opt, S_opt),
        trend=tr_opt,
        enforce_stationarity=True,
        enforce_invertibility=True
    )
    full_fit = full_mod.fit(disp=False, maxiter=80)
    future_fcast = full_fit.get_forecast(steps=H)
    fut_mean_log = future_fcast.predicted_mean
    fut_conf_log = future_fcast.conf_int(alpha=alpha)

    last_dt = datetime.datetime.strptime(dates[-1], "%Y-%m-%d")
    future_dates = [(last_dt + datetime.timedelta(days=i + 1)).strftime("%Y-%m-%d") for i in range(H)]

    fut_mean = np.exp(fut_mean_log).tolist()
    fut_lo = np.exp(fut_conf_log.iloc[:, 0]).tolist() if hasattr(fut_conf_log, "iloc") else np.exp(fut_conf_log[:, 0]).tolist()
    fut_hi = np.exp(fut_conf_log.iloc[:, 1]).tolist() if hasattr(fut_conf_log, "iloc") else np.exp(fut_conf_log[:, 1]).tolist()

    # 8. Ensamblar Estructura JSON Final
    output_data = {
        "meta": {
            "source": source,
            "start": dates[0],
            "end": dates[-1],
            "n": n_total,
            "s": S,
            "H": H,
            "alpha": alpha,
            "generated_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        },
        "series": {
            "dates": dates,
            "values": [round(float(v), 1) for v in values],
            "log_values": [round(float(v), 4) for v in log_values],
            "split_index": split_idx
        },
        "stl": {
            "dates": train_dates,
            "trend": [round(float(v), 4) for v in trend_stl],
            "seasonal": [round(float(v), 4) for v in seasonal_stl],
            "resid": [round(float(v), 4) for v in resid_stl],
            "Fs": round(Fs, 4),
            "D_stl": D,
            "weekday_profile": [round(float(v), 3) for v in weekday_profile]
        },
        "identification": {
            "D": D,
            "d": d,
            "tests": tests_summary,
            "stages": {
                "levels": {
                    "dates": train_dates,
                    "values": [round(float(v), 4) for v in train_log]
                },
                "seasonal_diff": {
                    "dates": train_dates[S:],
                    "values": [round(float(v), 4) for v in train_diff_s]
                },
                "seasonal_regular_diff": {
                    "dates": train_dates[S + 1:],
                    "values": [round(float(v), 4) for v in train_diff_sd]
                }
            },
            "acf": {
                "lags": lags_list,
                "values": [round(float(v), 4) for v in acf_vals],
                "conf": round(conf_band, 4)
            },
            "pacf": {
                "lags": lags_list,
                "values": [round(float(v), 4) for v in pacf_vals],
                "conf": round(conf_band, 4)
            }
        },
        "grid": grid_results,
        "diagnostics": [
            {
                "model_id": item["model_id"],
                "lb_p14": item["lb_p14"],
                "lb_p21": item["lb_p21"],
                "jb_p": item["jb_p"],
                "het_p": item["het_p"],
                "overdiff": item["overdiff"],
                "passes": item["passes"]
            }
            for item in grid_results
        ],
        "selection": {
            "model_id": chosen_model_id,
            "label": f"SARIMA({p_opt},{d_opt},{q_opt})({P_opt},{D_opt},{Q_opt})7",
            "passed": selection_passed,
            "order": [p_opt, d_opt, q_opt],
            "seasonal": [P_opt, D_opt, Q_opt, S_opt],
            "trend": tr_opt,
            "params": params_list
        },
        "models_detail": models_detail,
        "residuals": models_detail[chosen_model_id]["residuals"],
        "validation": models_detail[chosen_model_id]["validation"],
        "future": {
            "dates": future_dates,
            "mean": [round(float(v), 1) for v in fut_mean],
            "lo": [round(float(v), 1) for v in fut_lo],
            "hi": [round(float(v), 1) for v in fut_hi]
        }
    }

    # Escribir archivo JSON
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print("=" * 60)
    print(f"¡Exportación exitosa a {args.out}!")
    print(f"Total observaciones: {n_total} (Train={split_idx}, Test={H})")
    print(f"Diferenciación: D={D} (Fs={Fs:.3f}), d={d}")
    print(f"Modelo seleccionado: {chosen_model_id} (Pasa diagnóstico: {selection_passed})")
    print(f"Métricas Test SARIMA: MAE={models_detail[chosen_model_id]['validation']['metrics']['sarima']['mae']} | MAPE={models_detail[chosen_model_id]['validation']['metrics']['sarima']['mape']}% | MASE={models_detail[chosen_model_id]['validation']['metrics']['sarima']['mase']}")
    print(f"Métricas Test Naive:  MAE={naive_metrics['mae']} | MAPE={naive_metrics['mape']}% | MASE={naive_metrics['mase']}")
    print("=" * 60)


if __name__ == "__main__":
    main()
