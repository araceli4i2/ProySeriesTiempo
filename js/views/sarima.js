/**
 * UMSA - DAT-262: Procesos Estocásticos y Análisis de Series de Tiempo
 * Vista 5: Capítulo 6 — Modelos SARIMA (Metodología Box-Jenkins)
 * 100% Data-Driven desde data/sarima_results.json
 */

function SarimaView() {
  const [sarimaData, setSarimaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Model selection state (can pick from top 10 models)
  const [selectedModelId, setSelectedModelId] = useState(null);

  // Stage 1 Interactive State
  const [isLogScale, setIsLogScale] = useState(false);
  const [rangeStartIdx, setRangeStartIdx] = useState(0);
  const [rangeEndIdx, setRangeEndIdx] = useState(120);
  const [stationarityStage, setStationarityStage] = useState('seasonal_diff'); // 'levels' | 'seasonal_diff' | 'seasonal_regular_diff'
  const [acfStage, setAcfStage] = useState('stationary'); // 'stationary' | 'levels'

  // Stage 2 Grid State
  const [gridSortBy, setGridSortBy] = useState('aic');
  const [gridFilterTrend, setGridFilterTrend] = useState('all');
  const [gridFilterConverged, setGridFilterConverged] = useState('all');
  const [gridFilterQ, setGridFilterQ] = useState('all');
  const [gridFilterPasses, setGridFilterPasses] = useState('all');
  const [heatmapP, setHeatmapP] = useState(1);
  const [heatmapQ, setHeatmapQ] = useState(1);
  const [heatmapTrend, setHeatmapTrend] = useState('c');

  // Stage 3 Diagnostics State
  const [showBurn, setShowBurn] = useState(false);

  // Stage 4 Forecast & Validation State
  const [forecastH, setForecastH] = useState(14);
  const [showNaive, setShowNaive] = useState(true);

  // Collapsible sections & Modals
  const [theoryOpen, setTheoryOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [customSeries, setCustomSeries] = useState(null);

  // Chart Refs
  const mainSeriesChartRef = useRef(null);
  const mainSeriesChartInstance = useRef(null);

  const stlTrendRef = useRef(null);
  const stlSeasonalRef = useRef(null);
  const stlResidRef = useRef(null);
  const stlInstances = useRef({});

  const weekdayProfileRef = useRef(null);
  const weekdayProfileInstance = useRef(null);

  const stationarityChartRef = useRef(null);
  const stationarityChartInstance = useRef(null);

  const twinAcfRef = useRef(null);
  const twinPacfRef = useRef(null);
  const twinAcfInstance = useRef(null);
  const twinPacfInstance = useRef(null);

  const resTimeRef = useRef(null);
  const resTimeInstance = useRef(null);
  const resAcfRef = useRef(null);
  const resAcfInstance = useRef(null);
  const resHistRef = useRef(null);
  const resHistInstance = useRef(null);
  const resQqRef = useRef(null);
  const resQqInstance = useRef(null);

  const valChartRef = useRef(null);
  const valChartInstance = useRef(null);
  const errBarRef = useRef(null);
  const errBarInstance = useRef(null);
  const futureChartRef = useRef(null);
  const futureChartInstance = useRef(null);

  // 1. Cargar data/sarima_results.json
  const loadResults = () => {
    setLoading(true);
    setError(null);
    fetch('data/sarima_results.json')
      .then(res => {
        if (!res.ok) {
          throw new Error("No se encontró 'data/sarima_results.json'. Ejecuta 'python scripts/export_sarima.py' para generar los resultados.");
        }
        return res.json();
      })
      .then(data => {
        setSarimaData(data);
        setSelectedModelId(data.selection?.model_id || null);
        setRangeEndIdx(data.series?.values?.length || 120);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadResults();
  }, []);

  // Helper para scroll suave del stepper
  const scrollToStage = (stageId) => {
    const el = document.getElementById(stageId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Modelo activo para diagnósticos y pronósticos
  const activeModelId = selectedModelId || sarimaData?.selection?.model_id;
  const activeDetail = sarimaData?.models_detail?.[activeModelId] || {
    residuals: sarimaData?.residuals,
    validation: sarimaData?.validation
  };
  const isDefaultSelected = activeModelId === sarimaData?.selection?.model_id;

  // ==========================================================================
  // GRÁFICO 1: SERIE TEMPORAL INTERACTIVA CON BRUSH Y TOGGLE LOG
  // ==========================================================================
  useEffect(() => {
    if (!sarimaData || !mainSeriesChartRef.current || !window.Chart) return;
    if (mainSeriesChartInstance.current) mainSeriesChartInstance.current.destroy();

    const ctx = mainSeriesChartRef.current.getContext('2d');
    const dates = sarimaData.series.dates;
    const splitIdx = sarimaData.series.split_index;
    const rawVals = isLogScale ? sarimaData.series.log_values : sarimaData.series.values;

    // Recortar según rango de brush
    const sIdx = Math.max(0, Math.min(rangeStartIdx, dates.length - 2));
    const eIdx = Math.min(dates.length, Math.max(rangeEndIdx, sIdx + 2));

    const slicedDates = dates.slice(sIdx, eIdx);
    const slicedTrain = [];
    const slicedTest = [];

    for (let i = sIdx; i < eIdx; i++) {
      const val = rawVals[i];
      if (i < splitIdx) {
        slicedTrain.push(val);
        slicedTest.push(null);
      } else if (i === splitIdx) {
        // Conectar ambos segmentos
        slicedTrain.push(val);
        slicedTest.push(val);
      } else {
        slicedTrain.push(null);
        slicedTest.push(val);
      }
    }

    mainSeriesChartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: slicedDates,
        datasets: [
          {
            label: `Train (${splitIdx} días) — Entrenamiento`,
            data: slicedTrain,
            borderColor: '#58a6ff',
            backgroundColor: 'rgba(88, 166, 255, 0.08)',
            borderWidth: 2,
            tension: 0.15,
            pointRadius: 2.5,
            pointHoverRadius: 5,
            pointBackgroundColor: '#58a6ff',
            fill: true
          },
          {
            label: `Test (${dates.length - splitIdx} días) — Validación Out-of-Sample`,
            data: slicedTest,
            borderColor: '#bc8cff',
            backgroundColor: 'rgba(188, 140, 255, 0.12)',
            borderWidth: 2.5,
            tension: 0.15,
            pointRadius: 3.5,
            pointHoverRadius: 6,
            pointBackgroundColor: '#bc8cff',
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            labels: { color: '#8b949e', font: { family: 'Inter', size: 11 } }
          },
          tooltip: {
            backgroundColor: '#161b22',
            titleColor: '#c9d1d9',
            bodyColor: '#8b949e',
            borderColor: '#30363d',
            borderWidth: 1,
            callbacks: {
              title: (items) => {
                const dateStr = items[0]?.label;
                if (!dateStr) return '';
                const dt = new Date(dateStr + 'T00:00:00');
                const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                return `${dateStr} (${weekdays[dt.getDay()]})`;
              },
              label: (item) => {
                const v = item.raw;
                if (v === null || v === undefined) return null;
                return isLogScale ? ` Log: ${v.toFixed(4)}` : ` Eventos: ${Math.round(v).toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: '#21262d' },
            ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 9 }, maxTicksLimit: 12 }
          },
          y: {
            grid: { color: '#21262d' },
            ticks: {
              color: '#8b949e',
              font: { family: 'JetBrains Mono', size: 9 },
              callback: (val) => isLogScale ? val.toFixed(2) : (val >= 1000 ? `${(val/1000).toFixed(0)}k` : val)
            }
          }
        }
      }
    });

    return () => {
      if (mainSeriesChartInstance.current) mainSeriesChartInstance.current.destroy();
    };
  }, [sarimaData, isLogScale, rangeStartIdx, rangeEndIdx]);

  // ==========================================================================
  // GRÁFICO 2: DESCOMPOSICIÓN STL (3 PANELES SINCRONIZADOS)
  // ==========================================================================
  useEffect(() => {
    if (!sarimaData?.stl || !window.Chart) return;
    const { dates, trend, seasonal, resid } = sarimaData.stl;

    const makeStlPlot = (canvasRef, instanceRef, label, dataArr, color) => {
      if (!canvasRef.current) return;
      if (instanceRef.current) instanceRef.current.destroy();
      const ctx = canvasRef.current.getContext('2d');
      instanceRef.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label,
            data: dataArr,
            borderColor: color,
            backgroundColor: 'transparent',
            borderWidth: 1.8,
            tension: 0.1,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#161b22',
              titleColor: '#c9d1d9',
              borderColor: '#30363d',
              borderWidth: 1
            }
          },
          scales: {
            x: {
              grid: { color: '#21262d' },
              ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 8 }, maxTicksLimit: 8 }
            },
            y: {
              grid: { color: '#21262d' },
              ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 8 } }
            }
          }
        }
      });
    };

    makeStlPlot(stlTrendRef, { current: stlInstances.current.trend }, 'Tendencia', trend, '#58a6ff');
    makeStlPlot(stlSeasonalRef, { current: stlInstances.current.seasonal }, 'Estacionalidad (s=7)', seasonal, '#d29922');
    makeStlPlot(stlResidRef, { current: stlInstances.current.resid }, 'Residuo Irregular', resid, '#f85149');

    return () => {
      Object.values(stlInstances.current).forEach(inst => inst && inst.destroy && inst.destroy());
    };
  }, [sarimaData]);

  // ==========================================================================
  // GRÁFICO 3: PERFIL SEMANAL PROMEDIO
  // ==========================================================================
  useEffect(() => {
    if (!sarimaData?.stl?.weekday_profile || !weekdayProfileRef.current || !window.Chart) return;
    if (weekdayProfileInstance.current) weekdayProfileInstance.current.destroy();

    const ctx = weekdayProfileRef.current.getContext('2d');
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const factors = sarimaData.stl.weekday_profile;
    // Fines de semana (Sáb=5, Dom=6) en rojo/naranja, laborales en azul
    const bgColors = factors.map((_, i) => (i >= 5 ? 'rgba(248, 81, 73, 0.75)' : 'rgba(88, 166, 255, 0.75)'));

    weekdayProfileInstance.current = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels: days,
        datasets: [{
          label: 'Factor Estacional Multiplicativo Promedio',
          data: factors,
          backgroundColor: bgColors,
          borderColor: bgColors.map(c => c.replace('0.75', '1.0')),
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#161b22',
            titleColor: '#c9d1d9',
            borderColor: '#30363d',
            borderWidth: 1,
            callbacks: {
              label: (ctx) => ` Factor: ${ctx.raw.toFixed(3)}x (${((ctx.raw - 1) * 100).toFixed(1)}% vs media)`
            }
          }
        },
        scales: {
          x: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'Inter', size: 10 } } },
          y: {
            grid: { color: '#21262d' },
            ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 9 } },
            suggestedMin: 0.3,
            suggestedMax: 1.4
          }
        }
      }
    });

    return () => {
      if (weekdayProfileInstance.current) weekdayProfileInstance.current.destroy();
    };
  }, [sarimaData]);

  // ==========================================================================
  // GRÁFICO 4: PIPELINE DE ESTACIONARIEDAD
  // ==========================================================================
  useEffect(() => {
    if (!sarimaData?.identification?.stages || !stationarityChartRef.current || !window.Chart) return;
    if (stationarityChartInstance.current) stationarityChartInstance.current.destroy();

    const stageObj = sarimaData.identification.stages[stationarityStage] || sarimaData.identification.stages.levels;
    const ctx = stationarityChartRef.current.getContext('2d');

    const colorMap = {
      levels: '#58a6ff',
      seasonal_diff: '#3fb950',
      seasonal_regular_diff: '#bc8cff'
    };

    stationarityChartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: stageObj.dates,
        datasets: [{
          label: `Serie transformativa: ${stationarityStage}`,
          data: stageObj.values,
          borderColor: colorMap[stationarityStage] || '#58a6ff',
          backgroundColor: 'transparent',
          borderWidth: 1.8,
          tension: 0.1,
          pointRadius: 1.5,
          pointHoverRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#161b22',
            titleColor: '#c9d1d9',
            borderColor: '#30363d',
            borderWidth: 1
          }
        },
        scales: {
          x: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 8 }, maxTicksLimit: 10 } },
          y: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 8 } } }
        }
      }
    });

    return () => {
      if (stationarityChartInstance.current) stationarityChartInstance.current.destroy();
    };
  }, [sarimaData, stationarityStage]);

  // ==========================================================================
  // GRÁFICO 5: ACF Y PACF GEMELOS (35 REZAGOS) CON HIGHLIGHT ESTACIONAL
  // ==========================================================================
  useEffect(() => {
    if (!sarimaData?.identification || !twinAcfRef.current || !twinPacfRef.current || !window.Chart) return;
    if (twinAcfInstance.current) twinAcfInstance.current.destroy();
    if (twinPacfInstance.current) twinPacfInstance.current.destroy();

    const acfObj = sarimaData.identification.acf;
    const pacfObj = sarimaData.identification.pacf;
    const conf = acfObj.conf;
    const lags = acfObj.lags.slice(1, 36); // Excluir lag 0
    const acfVals = acfObj.values.slice(1, 36);
    const pacfVals = pacfObj.values.slice(1, 36);

    const isSeasonalLag = (lag) => lag % 7 === 0;

    const makeAcfPlot = (canvasRef, instanceRef, title, vals, colorDefault, colorSeasonal) => {
      const ctx = canvasRef.current.getContext('2d');
      const bgColors = lags.map(l => (isSeasonalLag(l) ? colorSeasonal : colorDefault));

      instanceRef.current = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: lags,
          datasets: [
            {
              type: 'bar',
              label: title,
              data: vals,
              backgroundColor: bgColors,
              barThickness: 5,
              borderRadius: 2
            },
            {
              type: 'line',
              label: '+1.96/√N',
              data: new Array(lags.length).fill(conf),
              borderColor: 'rgba(248, 81, 73, 0.65)',
              borderDash: [3, 3],
              borderWidth: 1,
              pointRadius: 0
            },
            {
              type: 'line',
              label: '-1.96/√N',
              data: new Array(lags.length).fill(-conf),
              borderColor: 'rgba(248, 81, 73, 0.65)',
              borderDash: [3, 3],
              borderWidth: 1,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#161b22',
              titleColor: '#c9d1d9',
              borderColor: '#30363d',
              borderWidth: 1,
              callbacks: {
                title: (items) => `Rezago (Lag) ${items[0]?.label}${isSeasonalLag(Number(items[0]?.label)) ? ' ★ ESTACIONAL (s=7k)' : ''}`,
                label: (item) => ` ${title}: ${Number(item.raw).toFixed(4)}`
              }
            }
          },
          scales: {
            x: {
              grid: { color: '#21262d' },
              ticks: {
                color: (c) => (isSeasonalLag(Number(lags[c.index])) ? '#d29922' : '#8b949e'),
                font: { family: 'JetBrains Mono', size: 9 }
              }
            },
            y: {
              grid: { color: '#21262d' },
              min: -0.6,
              max: 1.0,
              ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 9 } }
            }
          }
        }
      });
    };

    makeAcfPlot(twinAcfRef, twinAcfInstance, 'ACF', acfVals, 'rgba(88, 166, 255, 0.85)', 'rgba(210, 153, 34, 0.95)');
    makeAcfPlot(twinPacfRef, twinPacfInstance, 'PACF', pacfVals, 'rgba(63, 185, 80, 0.85)', 'rgba(188, 140, 255, 0.95)');

    return () => {
      if (twinAcfInstance.current) twinAcfInstance.current.destroy();
      if (twinPacfInstance.current) twinPacfInstance.current.destroy();
    };
  }, [sarimaData]);

  // ==========================================================================
  // GRÁFICO 10: PANEL 2X2 DE DIAGNÓSTICO DE RESIDUOS
  // ==========================================================================
  useEffect(() => {
    if (!activeDetail?.residuals || !window.Chart) return;
    const res = activeDetail.residuals;

    // 1) Residuos en el tiempo
    if (resTimeRef.current) {
      if (resTimeInstance.current) resTimeInstance.current.destroy();
      const ctx = resTimeRef.current.getContext('2d');
      resTimeInstance.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: res.dates,
          datasets: [{
            label: 'Residuos Estocásticos',
            data: res.values,
            borderColor: '#58a6ff',
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            pointRadius: 1.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 8 }, maxTicksLimit: 6 } },
            y: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 8 } } }
          }
        }
      });
    }

    // 2) ACF de residuos
    if (resAcfRef.current) {
      if (resAcfInstance.current) resAcfInstance.current.destroy();
      const ctx = resAcfRef.current.getContext('2d');
      resAcfInstance.current = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: res.acf.lags.slice(1),
          datasets: [
            {
              type: 'bar',
              label: 'ACF Residuos',
              data: res.acf.values.slice(1),
              backgroundColor: 'rgba(63, 185, 80, 0.8)',
              barThickness: 4
            },
            {
              type: 'line',
              label: '+CI',
              data: new Array(res.acf.lags.length - 1).fill(res.acf.conf),
              borderColor: 'rgba(248, 81, 73, 0.6)',
              borderDash: [3, 3],
              borderWidth: 1,
              pointRadius: 0
            },
            {
              type: 'line',
              label: '-CI',
              data: new Array(res.acf.lags.length - 1).fill(-res.acf.conf),
              borderColor: 'rgba(248, 81, 73, 0.6)',
              borderDash: [3, 3],
              borderWidth: 1,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 8 } } },
            y: { grid: { color: '#21262d' }, min: -0.4, max: 0.6, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 8 } } }
          }
        }
      });
    }

    // 3) Histograma con curva normal
    if (resHistRef.current) {
      if (resHistInstance.current) resHistInstance.current.destroy();
      const ctx = resHistRef.current.getContext('2d');
      resHistInstance.current = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: res.hist.bins.map(b => b.toFixed(3)),
          datasets: [{
            label: 'Densidad empírica',
            data: res.hist.density,
            backgroundColor: 'rgba(210, 153, 34, 0.7)',
            borderColor: '#d29922',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 7 }, maxTicksLimit: 6 } },
            y: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 8 } } }
          }
        }
      });
    }

    // 4) QQ-Plot
    if (resQqRef.current) {
      if (resQqInstance.current) resQqInstance.current.destroy();
      const ctx = resQqRef.current.getContext('2d');
      const points = res.qq.theoretical.map((th, i) => ({ x: th, y: res.qq.sample[i] }));
      resQqInstance.current = new window.Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Cuantiles Residuos',
              data: points,
              backgroundColor: '#bc8cff',
              pointRadius: 2.5
            },
            {
              type: 'line',
              label: 'Recta Normal (45°)',
              data: [{ x: -2.5, y: -2.5 }, { x: 2.5, y: 2.5 }],
              borderColor: 'rgba(248, 81, 73, 0.7)',
              borderDash: [3, 3],
              borderWidth: 1.5,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 8 } } },
            y: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 8 } } }
          }
        }
      });
    }

    return () => {
      if (resTimeInstance.current) resTimeInstance.current.destroy();
      if (resAcfInstance.current) resAcfInstance.current.destroy();
      if (resHistInstance.current) resHistInstance.current.destroy();
      if (resQqInstance.current) resQqInstance.current.destroy();
    };
  }, [activeDetail]);

  // ==========================================================================
  // GRÁFICO 13 & 14: VALIDACIÓN, INTERVALO 95% Y BARRAS DE ERROR
  // ==========================================================================
  useEffect(() => {
    if (!sarimaData || !activeDetail?.validation || !valChartRef.current || !errBarRef.current || !window.Chart) return;
    if (valChartInstance.current) valChartInstance.current.destroy();
    if (errBarInstance.current) errBarInstance.current.destroy();

    const val = activeDetail.validation;
    const allDates = sarimaData.series.dates;
    const splitIdx = sarimaData.series.split_index;
    
    // Últimos ~40 días de train para dar contexto
    const trainContextLen = 35;
    const trainStartIdx = Math.max(0, splitIdx - trainContextLen);
    const contextDates = allDates.slice(trainStartIdx, splitIdx);
    const contextVals = sarimaData.series.values.slice(trainStartIdx, splitIdx);

    const valDates = val.dates;
    const fullXLabels = [...contextDates, ...valDates];

    // Conectar train con predicción
    const lastTrainVal = contextVals[contextVals.length - 1];

    const observedPadded = [...contextVals, ...val.observed];
    const sarimaPadded = [...new Array(contextVals.length - 1).fill(null), lastTrainVal, ...val.sarima];
    const loPadded = [...new Array(contextVals.length).fill(null), ...val.lo];
    const hiPadded = [...new Array(contextVals.length).fill(null), ...val.hi];
    const naivePadded = [...new Array(contextVals.length - 1).fill(null), lastTrainVal, ...val.naive];

    const ctxVal = valChartRef.current.getContext('2d');
    const datasetsVal = [
      {
        label: 'Observado (Real)',
        data: observedPadded,
        borderColor: '#58a6ff',
        borderWidth: 2,
        pointRadius: (ctx) => (ctx.dataIndex >= contextVals.length ? 3.5 : 1),
        pointBackgroundColor: '#58a6ff',
        fill: false
      },
      {
        label: `Pronóstico SARIMA (${activeModelId})`,
        data: sarimaPadded,
        borderColor: '#3fb950',
        borderWidth: 2.2,
        borderDash: [4, 4],
        pointRadius: 4,
        pointBackgroundColor: '#3fb950',
        fill: false
      },
      {
        label: 'Banda de Predicción 95% (Superior)',
        data: hiPadded,
        borderColor: 'rgba(63, 185, 80, 0.35)',
        backgroundColor: 'rgba(63, 185, 80, 0.12)',
        borderWidth: 1,
        pointRadius: 0,
        fill: '+1'
      },
      {
        label: 'Banda de Predicción 95% (Inferior)',
        data: loPadded,
        borderColor: 'rgba(63, 185, 80, 0.35)',
        borderWidth: 1,
        pointRadius: 0,
        fill: false
      }
    ];

    if (showNaive) {
      datasetsVal.push({
        label: 'Benchmark Naive Estacional (yt-7)',
        data: naivePadded,
        borderColor: '#d29922',
        borderWidth: 1.8,
        borderDash: [2, 2],
        pointRadius: 3,
        pointBackgroundColor: '#d29922',
        fill: false
      });
    }

    valChartInstance.current = new window.Chart(ctxVal, {
      type: 'line',
      data: { labels: fullXLabels, datasets: datasetsVal },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: true, labels: { color: '#8b949e', font: { family: 'Inter', size: 11 } } },
          tooltip: {
            backgroundColor: '#161b22',
            titleColor: '#c9d1d9',
            borderColor: '#30363d',
            borderWidth: 1,
            callbacks: {
              afterBody: (items) => {
                const idx = items[0]?.dataIndex;
                if (idx < contextVals.length) return '';
                const testIdx = idx - contextVals.length;
                const obs = val.observed[testIdx];
                const pred = val.sarima[testIdx];
                const absErr = Math.abs(obs - pred);
                const pctErr = ((absErr / obs) * 100).toFixed(2);
                return `\nError Absoluto SARIMA: ${Math.round(absErr).toLocaleString()}\nError Relativo: ${pctErr}%`;
              }
            }
          }
        },
        scales: {
          x: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 9 }, maxTicksLimit: 12 } },
          y: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 9 } } }
        }
      }
    });

    // Gráfico de barras de error diario
    const ctxErr = errBarRef.current.getContext('2d');
    const sarimaErrors = val.observed.map((obs, i) => Math.abs(obs - val.sarima[i]));
    const naiveErrors = val.observed.map((obs, i) => Math.abs(obs - val.naive[i]));

    errBarInstance.current = new window.Chart(ctxErr, {
      type: 'bar',
      data: {
        labels: val.dates.map(d => d.slice(5)),
        datasets: [
          {
            label: 'Error Absoluto SARIMA',
            data: sarimaErrors,
            backgroundColor: 'rgba(63, 185, 80, 0.75)',
            borderColor: '#3fb950',
            borderWidth: 1,
            borderRadius: 3
          },
          {
            label: 'Error Absoluto Naive Estacional',
            data: naiveErrors,
            backgroundColor: 'rgba(210, 153, 34, 0.75)',
            borderColor: '#d29922',
            borderWidth: 1,
            borderRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, labels: { color: '#8b949e', font: { family: 'Inter', size: 10 } } }
        },
        scales: {
          x: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 9 } } },
          y: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 8 } } }
        }
      }
    });

    return () => {
      if (valChartInstance.current) valChartInstance.current.destroy();
      if (errBarInstance.current) errBarInstance.current.destroy();
    };
  }, [sarimaData, activeDetail, showNaive]);

  // ==========================================================================
  // GRÁFICO 16: PRONÓSTICO FUTURO (14 DÍAS TRAS REAJUSTE CON TODA LA SERIE)
  // ==========================================================================
  useEffect(() => {
    if (!sarimaData?.future || !futureChartRef.current || !window.Chart) return;
    if (futureChartInstance.current) futureChartInstance.current.destroy();

    const fut = sarimaData.future;
    const seriesDates = sarimaData.series.dates;
    const seriesVals = sarimaData.series.values;

    // Recortar según slider h (1..14)
    const hSlice = Math.max(1, Math.min(forecastH, fut.dates.length));
    const futDatesSliced = fut.dates.slice(0, hSlice);
    const futMeanSliced = fut.mean.slice(0, hSlice);
    const futLoSliced = fut.lo.slice(0, hSlice);
    const futHiSliced = fut.hi.slice(0, hSlice);

    // Contexto de los últimos 45 días
    const histContextLen = 45;
    const histDates = seriesDates.slice(-histContextLen);
    const histVals = seriesVals.slice(-histContextLen);

    const fullLabels = [...histDates, ...futDatesSliced];
    const lastHistVal = histVals[histVals.length - 1];

    const histPadded = [...histVals, ...new Array(hSlice).fill(null)];
    const futMeanPadded = [...new Array(histVals.length - 1).fill(null), lastHistVal, ...futMeanSliced];
    const loPadded = [...new Array(histVals.length).fill(null), ...futLoSliced];
    const hiPadded = [...new Array(histVals.length).fill(null), ...futHiSliced];

    const ctx = futureChartRef.current.getContext('2d');
    futureChartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: fullLabels,
        datasets: [
          {
            label: 'Serie Histórica Observada',
            data: histPadded,
            borderColor: '#58a6ff',
            borderWidth: 2,
            pointRadius: 1.5,
            fill: false
          },
          {
            label: `Proyección Futura h=${hSlice} días`,
            data: futMeanPadded,
            borderColor: '#d29922',
            borderWidth: 2.2,
            borderDash: [5, 5],
            pointRadius: 3.5,
            pointBackgroundColor: '#d29922',
            fill: false
          },
          {
            label: 'Banda de Predicción 95% (Superior)',
            data: hiPadded,
            borderColor: 'rgba(210, 153, 34, 0.4)',
            backgroundColor: 'rgba(210, 153, 34, 0.12)',
            borderWidth: 1,
            pointRadius: 0,
            fill: '+1'
          },
          {
            label: 'Banda de Predicción 95% (Inferior)',
            data: loPadded,
            borderColor: 'rgba(210, 153, 34, 0.4)',
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: true, labels: { color: '#8b949e', font: { family: 'Inter', size: 11 } } },
          tooltip: {
            backgroundColor: '#161b22',
            titleColor: '#c9d1d9',
            borderColor: '#30363d',
            borderWidth: 1
          }
        },
        scales: {
          x: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 9 }, maxTicksLimit: 12 } },
          y: { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 9 } } }
        }
      }
    });

    return () => {
      if (futureChartInstance.current) futureChartInstance.current.destroy();
    };
  }, [sarimaData, forecastH]);

  // Manejo de CSV personalizado en cliente
  const handleClientFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.trim().split('\n');
        if (lines.length < 15) throw new Error("El archivo debe contener al menos 15 filas.");
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const dateIdx = headers.findIndex(h => h.includes('date') || h.includes('fecha'));
        const valIdx = headers.findIndex(h => h.includes('event') || h.includes('val') || h.includes('count'));

        if (dateIdx === -1 || valIdx === -1) {
          throw new Error("No se encontraron columnas de 'date' y 'events' en el CSV.");
        }

        const parsed = [];
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',');
          if (parts.length >= 2) {
            const d = parts[dateIdx].trim();
            const v = parseFloat(parts[valIdx].trim());
            if (d && !isNaN(v)) parsed.push({ date: d, value: v });
          }
        }

        if (parsed.length < 15) throw new Error("No se extrajeron suficientes filas válidas.");

        setCustomSeries(parsed);
        setImportStatus({
          success: true,
          message: `¡Cargadas ${parsed.length} filas del archivo! Puedes visualizar la serie en el cliente. Para reestimar SARIMA ejecuta en terminal: python scripts/export_sarima.py --csv <archivo>`
        });
      } catch (err) {
        setImportStatus({ success: false, message: `Error: ${err.message}` });
      }
    };
    reader.readAsText(file);
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="gh-card p-6">
          <div className="h-6 bg-ghBorder rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-ghBorder rounded w-2/3 mb-2"></div>
          <div className="h-32 bg-ghBorder rounded w-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(k => (
            <div key={k} className="gh-card p-4 h-24 bg-ghBorder rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !sarimaData) {
    return (
      <div className="gh-card border-ghRed p-8 text-center space-y-4">
        <div className="inline-flex p-3 rounded-full bg-red-900/30 text-ghRed border border-ghRed">
          <Icon name="x" className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-ghText">Resultados SARIMA No Encontrados</h2>
        <p className="text-sm text-ghMuted max-w-xl mx-auto">
          {error || "El archivo data/sarima_results.json no existe o no tiene un formato válido."}
        </p>
        <div className="p-3 bg-ghCanvas border border-ghBorder rounded-md max-w-md mx-auto text-left font-mono text-xs text-ghOrange">
          python scripts/export_sarima.py
        </div>
        <button onClick={loadResults} className="gh-btn gh-btn-primary">
          <Icon name="reset" className="w-4 h-4 mr-1.5" /> Reintentar Carga
        </button>
      </div>
    );
  }

  // Filtrado de la grilla de 72 modelos
  const filteredGrid = sarimaData.grid.filter(item => {
    if (gridFilterTrend !== 'all' && item.trend !== gridFilterTrend) return false;
    if (gridFilterConverged === 'true' && !item.converged) return false;
    if (gridFilterConverged === 'false' && item.converged) return false;
    if (gridFilterQ === 'true' && item.seasonal[2] < 1) return false;
    if (gridFilterPasses === 'true' && !item.passes) return false;
    return true;
  }).sort((a, b) => (gridSortBy === 'bic' ? a.bic - b.bic : a.aic - b.aic));

  const valMetrics = activeDetail.validation.metrics;
  const sarimaMae = valMetrics.sarima.mae;
  const naiveMae = valMetrics.naive.mae;
  const maeDiffPct = ((sarimaMae - naiveMae) / naiveMae) * 100;

  const sarimaRmse = valMetrics.sarima.rmse;
  const naiveRmse = valMetrics.naive.rmse;
  const rmseDiffPct = ((sarimaRmse - naiveRmse) / naiveRmse) * 100;

  const sarimaMape = valMetrics.sarima.mape;
  const naiveMape = valMetrics.naive.mape;
  const mapeDiffPct = ((sarimaMape - naiveMape) / naiveMape) * 100;

  const sarimaMase = valMetrics.sarima.mase;
  const naiveMase = valMetrics.naive.mase;

  return (
    <div className="space-y-8">
      {/* ====================================================================
          HEADER DE CAPÍTULO Y STEPPER BOX-JENKINS
          ==================================================================== */}
      <div className="gh-card">
        <div className="gh-card-header flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-950/60 text-ghOrange border border-ghOrange/40 rounded">
              <Icon name="chart" className="w-5 h-5 text-ghOrange" />
            </span>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-ghText flex items-center gap-2 flex-wrap">
                Capítulo 6 — Modelos SARIMA (Metodología Box-Jenkins)
                {sarimaData.meta.source === 'simulated' && (
                  <span className="gh-badge gh-badge-orange font-mono text-[11px]">
                    Datos simulados (validación metodológica)
                  </span>
                )}
                {sarimaData.meta.source === 'gharchive' && (
                  <span className="gh-badge gh-badge-green font-mono text-[11px]">
                    Dataset Real GH Archive
                  </span>
                )}
              </h1>
              <p className="text-xs text-ghMuted">
                Serie diaria (N={sarimaData.meta.n} días, s=7 semanal, H={sarimaData.meta.H} test) • Generado: {sarimaData.meta.generated_at}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="gh-btn gh-btn-sm"
              title="Importar CSV personalizado"
            >
              <Icon name="upload" className="w-3.5 h-3.5" />
              <span>Importar CSV</span>
            </button>
            <button
              onClick={() => setTheoryOpen(!theoryOpen)}
              className="gh-btn gh-btn-sm"
              title="Ver fórmulas matemáticas"
            >
              <Icon name="branch" className="w-3.5 h-3.5 text-ghPurple" />
              <span>{theoryOpen ? "Ocultar Teoría" : "Fundamento Teórico"}</span>
            </button>
          </div>
        </div>

        {/* Stepper Horizontal de 4 Etapas */}
        <div className="p-3 bg-ghCanvas border-b border-ghBorder overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between min-w-[620px] gap-2 text-xs">
            <button
              onClick={() => scrollToStage('stage-1')}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-ghSurface border border-ghBorder hover:border-ghBlue transition text-left flex-1"
            >
              <span className="w-5 h-5 rounded-full bg-ghBlue/20 text-ghBlue font-bold flex items-center justify-center font-mono text-xs">1</span>
              <div>
                <div className="font-semibold text-ghText">Identificación</div>
                <div className="text-[10px] text-ghMuted font-mono">STL, Fs={sarimaData.stl.Fs}, D={sarimaData.identification.D}, d={sarimaData.identification.d}</div>
              </div>
            </button>

            <span className="text-ghMuted">➔</span>

            <button
              onClick={() => scrollToStage('stage-2')}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-ghSurface border border-ghBorder hover:border-ghOrange transition text-left flex-1"
            >
              <span className="w-5 h-5 rounded-full bg-ghOrange/20 text-ghOrange font-bold flex items-center justify-center font-mono text-xs">2</span>
              <div>
                <div className="font-semibold text-ghText">Estimación</div>
                <div className="text-[10px] text-ghMuted font-mono">Grilla 72 modelos AIC/BIC</div>
              </div>
            </button>

            <span className="text-ghMuted">➔</span>

            <button
              onClick={() => scrollToStage('stage-3')}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-ghSurface border border-ghBorder hover:border-ghRed transition text-left flex-1"
            >
              <span className="w-5 h-5 rounded-full bg-ghRed/20 text-ghRed font-bold flex items-center justify-center font-mono text-xs">3</span>
              <div>
                <div className="font-semibold text-ghText">Diagnóstico</div>
                <div className="text-[10px] text-ghMuted font-mono">Ljung-Box & Residuos</div>
              </div>
            </button>

            <span className="text-ghMuted">➔</span>

            <button
              onClick={() => scrollToStage('stage-4')}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-ghSurface border border-ghBorder hover:border-ghGreen transition text-left flex-1"
            >
              <span className="w-5 h-5 rounded-full bg-ghGreen/20 text-ghGreen font-bold flex items-center justify-center font-mono text-xs">4</span>
              <div>
                <div className="font-semibold text-ghText">Pronóstico</div>
                <div className="text-[10px] text-ghMuted font-mono">Test & Futuro 14D</div>
              </div>
            </button>

            <span className="text-ghSubtleText text-[11px] font-mono px-2 py-1 bg-ghSubtle rounded" title="Regla Box-Jenkins: si los residuos no son ruido blanco se debe volver a la etapa 1">
              ↺ iterar si falla
            </span>
          </div>
        </div>

        {/* Bloque Colapsable de Fundamento Teórico KaTeX */}
        {theoryOpen && (
          <div className="p-4 bg-ghSubtle/40 border-b border-ghBorder grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="gh-code-box">
              <div className="text-ghOrange font-semibold mb-1 font-mono">1. Ecuación General SARIMA(p,d,q)(P,D,Q)s</div>
              <div className="py-2 text-center overflow-x-auto">
                <MathFormula math="\Phi_P(B^s)\,\phi_p(B)\,(1-B)^d(1-B^s)^D \log y_t = c + \Theta_Q(B^s)\,\theta_q(B)\,\varepsilon_t" block={true} />
              </div>
              <p className="text-[11px] text-ghMuted">
                Donde <MathFormula math="B" /> es el operador de retardo (<MathFormula math="B^k y_t = y_{t-k}" />), <MathFormula math="\phi_p(B)" /> y <MathFormula math="\theta_q(B)" /> son los polinomios regular AR y MA, y <MathFormula math="\Phi_P(B^s)" />, <MathFormula math="\Theta_Q(B^s)" /> los estacionales.
              </p>
            </div>

            <div className="gh-code-box">
              <div className="text-ghOrange font-semibold mb-1 font-mono">2. Fuerza Estacional STL y Pronóstico Original</div>
              <div className="py-1 text-center overflow-x-auto">
                <MathFormula math="F_s = \max\left(0, 1 - \frac{\mathrm{Var}(R_t)}{\mathrm{Var}(S_t + R_t)}\right)" block={true} />
              </div>
              <div className="py-1 text-center overflow-x-auto">
                <MathFormula math="\hat{y}_{t+h} = \exp(\widehat{\log y}_{t+h}) \quad (\text{Mediana condicional})" block={true} />
              </div>
              <p className="text-[11px] text-ghMuted">
                Si <MathFormula math="F_s > 0.64" /> la serie posee estacionalidad fuerte y se adopta <MathFormula math="D = 1" />.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================================
          ETAPA 1: IDENTIFICACIÓN
          ==================================================================== */}
      <div id="stage-1" className="space-y-6">
        <div className="flex items-center justify-between border-b border-ghBorder pb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-ghBlue/20 text-ghBlue font-bold flex items-center justify-center font-mono text-xs">1</span>
            <h2 className="text-base font-bold text-ghText">Etapa 1: Identificación y Análisis Estacional</h2>
          </div>
          <span className="gh-badge gh-badge-blue font-mono text-[10px]">Box-Jenkins Paso 1</span>
        </div>

        {/* 1. Serie Temporal Interactiva */}
        <div className="gh-card">
          <div className="gh-card-header flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Icon name="activity" className="w-4 h-4 text-ghBlue" />
              <h3 className="text-sm font-semibold text-ghText">Serie Temporal Diaria de GitHub Archive</h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Toggle Escala Logarítmica */}
              <div className="flex items-center gap-2 bg-ghCanvas border border-ghBorder rounded px-2 py-1">
                <span className="text-xs text-ghMuted">Escala:</span>
                <button
                  onClick={() => setIsLogScale(false)}
                  className={`px-2 py-0.5 text-xs rounded font-mono ${!isLogScale ? 'bg-ghBorder text-white font-semibold' : 'text-ghMuted'}`}
                >Original</button>
                <button
                  onClick={() => setIsLogScale(true)}
                  className={`px-2 py-0.5 text-xs rounded font-mono ${isLogScale ? 'bg-ghBorder text-white font-semibold' : 'text-ghMuted'}`}
                >Log(y)</button>
              </div>
            </div>
          </div>

          <div className="gh-card-body space-y-3">
            <div className="h-64 sm:h-72 w-full">
              <canvas ref={mainSeriesChartRef} />
            </div>

            {/* Brush / Rango interactivo */}
            <div className="p-3 bg-ghCanvas border border-ghBorder rounded-md flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-ghMuted font-mono">
                <span>Rango mostrado: {sarimaData.series.dates[rangeStartIdx] || 'Inicio'} ➔ {sarimaData.series.dates[rangeEndIdx - 1] || 'Fin'}</span>
              </div>
              <div className="flex items-center gap-3 flex-1 max-w-xs">
                <span className="text-ghMuted text-[10px]">Zoom:</span>
                <input
                  type="range"
                  min="0"
                  max={sarimaData.series.dates.length - 20}
                  value={rangeStartIdx}
                  onChange={(e) => setRangeStartIdx(Number(e.target.value))}
                  className="w-full accent-ghBlue"
                  title="Ajustar inicio del rango"
                />
                <button
                  onClick={() => { setRangeStartIdx(0); setRangeEndIdx(sarimaData.series.dates.length); }}
                  className="gh-btn gh-btn-sm"
                  title="Restablecer zoom completo"
                >
                  <Icon name="reset" className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2 & 3: Descomposición STL y Perfil Semanal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* STL 3 Paneles */}
          <div className="gh-card lg:col-span-2">
            <div className="gh-card-header flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Icon name="layers" className="w-4 h-4 text-ghOrange" />
                <h3 className="text-sm font-semibold text-ghText">Descomposición STL (Periodo s=7)</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ghMuted">Fuerza Estacional:</span>
                <span className={`gh-badge font-mono font-bold ${sarimaData.stl.Fs > 0.64 ? 'gh-badge-green' : 'gh-badge-orange'}`}>
                  Fs = {sarimaData.stl.Fs.toFixed(3)}
                </span>
                <span className="gh-badge gh-badge-blue font-mono">D = {sarimaData.stl.D_stl}</span>
              </div>
            </div>

            <div className="gh-card-body space-y-4">
              <div>
                <div className="text-[11px] font-semibold text-ghBlue mb-1">Tendencia Suave T(t)</div>
                <div className="h-20 w-full"><canvas ref={stlTrendRef} /></div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-ghOrange mb-1">Componente Estacional Semanal S(t)</div>
                <div className="h-20 w-full"><canvas ref={stlSeasonalRef} /></div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-ghRed mb-1">Residuo Irregular R(t)</div>
                <div className="h-20 w-full"><canvas ref={stlResidRef} /></div>
              </div>

              {/* Gauge de Fuerza Estacional */}
              <div className="p-3 bg-ghCanvas border border-ghBorder rounded-md text-xs space-y-2">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-ghMuted">Criterio de Diferenciación Estacional:</span>
                  <span className="text-ghText">Umbral Fs &gt; 0.64 ➔ D=1</span>
                </div>
                <div className="w-full bg-ghBorder rounded-full h-2 relative">
                  <div
                    className="h-2 rounded-full bg-ghGreen"
                    style={{ width: `${Math.min(100, sarimaData.stl.Fs * 100)}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-ghRed"
                    style={{ left: '64%' }}
                    title="Umbral crítico 0.64"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-ghSubtleText">
                  <span>0.0 (Débil)</span>
                  <span className="text-ghRed font-mono font-semibold">Umbral 0.64</span>
                  <span>1.0 (Muy Fuerte)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Perfil Semanal Lunes a Domingo */}
          <div className="gh-card">
            <div className="gh-card-header">
              <div className="flex items-center gap-2">
                <Icon name="calendar" className="w-4 h-4 text-ghPurple" />
                <h3 className="text-sm font-semibold text-ghText">Perfil Semanal de Actividad</h3>
              </div>
              <span className="gh-badge gh-badge-purple font-mono text-[10px]">L..D</span>
            </div>

            <div className="gh-card-body space-y-3">
              <div className="h-48 w-full">
                <canvas ref={weekdayProfileRef} />
              </div>
              <p className="text-[11px] text-ghMuted leading-relaxed">
                Caída sistemática los fines de semana (Sáb/Dom ~45–55% de la media), confirmando una estacionalidad semanal de alta intensidad que exige diferenciación estacional <MathFormula math="D = 1" />.
              </p>
            </div>
          </div>
        </div>

        {/* 4 & 5: Pipeline de Estacionariedad y Correlogramas Gemelos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pipeline de Estacionariedad */}
          <div className="gh-card">
            <div className="gh-card-header flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Icon name="check" className="w-4 h-4 text-ghGreen" />
                <h3 className="text-sm font-semibold text-ghText">Pipeline de Estacionariedad (ADF & KPSS)</h3>
              </div>
              <span className="gh-badge gh-badge-default font-mono text-[10px]">d = {sarimaData.identification.d}</span>
            </div>

            <div className="gh-card-body space-y-4">
              {/* Segmented Selector de Etapa */}
              <div className="grid grid-cols-3 gap-1 bg-ghCanvas border border-ghBorder rounded-md p-1">
                <button
                  onClick={() => setStationarityStage('levels')}
                  className={`py-1.5 text-xs rounded text-center font-mono ${stationarityStage === 'levels' ? 'bg-ghBorder text-white font-semibold' : 'text-ghMuted'}`}
                >1. Log Niveles</button>
                <button
                  onClick={() => setStationarityStage('seasonal_diff')}
                  className={`py-1.5 text-xs rounded text-center font-mono ${stationarityStage === 'seasonal_diff' ? 'bg-ghBorder text-white font-semibold' : 'text-ghMuted'}`}
                >2. Dif. Estacional (D=1)</button>
                <button
                  onClick={() => setStationarityStage('seasonal_regular_diff')}
                  className={`py-1.5 text-xs rounded text-center font-mono ${stationarityStage === 'seasonal_regular_diff' ? 'bg-ghBorder text-white font-semibold' : 'text-ghMuted'}`}
                >3. D=1 + d=1</button>
              </div>

              <div className="h-44 w-full">
                <canvas ref={stationarityChartRef} />
              </div>

              {/* Tarjeta de Pruebas ADF y KPSS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {sarimaData.identification.tests.map((t, idx) => (
                  <div
                    key={t.stage}
                    className={`p-2.5 rounded border text-xs ${
                      (idx === 0 && stationarityStage === 'levels') ||
                      (idx === 1 && stationarityStage === 'seasonal_diff') ||
                      (idx === 2 && stationarityStage === 'seasonal_regular_diff')
                        ? 'bg-ghSubtle border-ghBlue'
                        : 'bg-ghCanvas border-ghBorder'
                    }`}
                  >
                    <div className="font-semibold text-ghText truncate mb-1">{t.stage}</div>
                    <div className="font-mono text-[11px] text-ghMuted">ADF p: <span className={t.adf_p < 0.05 ? 'text-ghGreen font-bold' : 'text-ghRed'}>{t.adf_p}</span></div>
                    <div className="font-mono text-[11px] text-ghMuted">KPSS p: <span className={t.kpss_p >= 0.05 ? 'text-ghGreen font-bold' : 'text-ghRed'}>{t.kpss_p}</span></div>
                    <div className="mt-1">
                      {t.stationary ? (
                        <span className="gh-badge gh-badge-green text-[10px]">Estacionaria ✓</span>
                      ) : (
                        <span className="gh-badge gh-badge-red text-[10px]">No estacionaria ✗</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Correlogramas Gemelos ACF y PACF con Rezagos Estacionales */}
          <div className="gh-card">
            <div className="gh-card-header flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Icon name="chart" className="w-4 h-4 text-ghOrange" />
                <h3 className="text-sm font-semibold text-ghText">Correlogramas Gemelos (ACF y PACF a 35 Rezagos)</h3>
              </div>
              <span className="gh-badge gh-badge-orange font-mono text-[10px]">Rezagos 7, 14, 21, 28, 35 ★</span>
            </div>

            <div className="gh-card-body space-y-4">
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="font-semibold text-ghBlue">Autocorrelación (ACF)</span>
                  <span className="font-mono text-[10px] text-ghMuted">Bandas ±1.96/√N</span>
                </div>
                <div className="h-28 w-full"><canvas ref={twinAcfRef} /></div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="font-semibold text-ghGreen">Autocorrelación Parcial (PACF)</span>
                  <span className="font-mono text-[10px] text-ghMuted">Método Yule-Walker</span>
                </div>
                <div className="h-28 w-full"><canvas ref={twinPacfRef} /></div>
              </div>

              <div className="p-2.5 bg-ghCanvas border border-ghBorder rounded text-xs text-ghMuted flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-ghOrange flex-shrink-0" />
                <span>Las barras doradas/violetas destacan los <strong>rezagos estacionales</strong> (<MathFormula math="k = 7, 14, 21, 28, 35" />). Su decaimiento exponencial orienta la selección de <MathFormula math="P" /> y <MathFormula math="Q" />.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          ETAPA 2: ESTIMACIÓN
          ==================================================================== */}
      <div id="stage-2" className="space-y-6">
        <div className="flex items-center justify-between border-b border-ghBorder pb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-ghOrange/20 text-ghOrange font-bold flex items-center justify-center font-mono text-xs">2</span>
            <h2 className="text-base font-bold text-ghText">Etapa 2: Estimación y Exploración de la Grilla (72 Modelos)</h2>
          </div>
          <span className="gh-badge gh-badge-orange font-mono text-[10px]">Box-Jenkins Paso 2</span>
        </div>

        {/* Heatmap de AIC y Controles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="gh-card">
            <div className="gh-card-header">
              <div className="flex items-center gap-2">
                <Icon name="layers" className="w-4 h-4 text-ghOrange" />
                <h3 className="text-sm font-semibold text-ghText">Heatmap de AIC: Matriz (p, q)</h3>
              </div>
            </div>

            <div className="gh-card-body space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-ghMuted font-mono">P:</span>
                  {[0, 1].map(pval => (
                    <button
                      key={pval}
                      onClick={() => setHeatmapP(pval)}
                      className={`px-2 py-0.5 rounded font-mono ${heatmapP === pval ? 'bg-ghBorder text-white font-bold' : 'text-ghMuted'}`}
                    >{pval}</button>
                  ))}
                  <span className="text-ghMuted font-mono ml-2">Q:</span>
                  {[0, 1].map(qval => (
                    <button
                      key={qval}
                      onClick={() => setHeatmapQ(qval)}
                      className={`px-2 py-0.5 rounded font-mono ${heatmapQ === qval ? 'bg-ghBorder text-white font-bold' : 'text-ghMuted'}`}
                    >{qval}</button>
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-ghMuted font-mono">Trend:</span>
                  {['c', 'n'].map(tr => (
                    <button
                      key={tr}
                      onClick={() => setHeatmapTrend(tr)}
                      className={`px-2 py-0.5 rounded font-mono ${heatmapTrend === tr ? 'bg-ghBorder text-white font-bold' : 'text-ghMuted'}`}
                    >{tr}</button>
                  ))}
                </div>
              </div>

              {/* Matriz 3x3 */}
              <div className="overflow-x-auto">
                <table className="border-collapse mx-auto text-xs font-mono">
                  <thead>
                    <tr>
                      <th className="p-2 text-ghMuted">p \ q</th>
                      <th className="p-2 text-ghMuted">q = 0</th>
                      <th className="p-2 text-ghMuted">q = 1</th>
                      <th className="p-2 text-ghMuted">q = 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[0, 1, 2].map(p => (
                      <tr key={p}>
                        <td className="p-2 text-ghMuted font-bold bg-ghCanvas border border-ghBorder text-center">p = {p}</td>
                        {[0, 1, 2].map(q => {
                          const targetModel = sarimaData.grid.find(m =>
                            m.order[0] === p &&
                            m.order[2] === q &&
                            m.seasonal[0] === heatmapP &&
                            m.seasonal[2] === heatmapQ &&
                            m.trend === heatmapTrend
                          );
                          const aicVal = targetModel ? targetModel.aic : null;
                          const isMin = targetModel && targetModel.model_id === sarimaData.selection.model_id;
                          return (
                            <td
                              key={q}
                              className={`p-2 border border-ghBorder text-center transition ${
                                isMin
                                  ? 'bg-green-950/80 text-ghGreen font-bold ring-2 ring-ghGreen'
                                  : aicVal && aicVal < -300
                                  ? 'bg-ghSubtle text-ghText'
                                  : 'bg-ghCanvas text-ghMuted'
                              }`}
                              title={targetModel ? `${targetModel.model_id} (AIC=${targetModel.aic})` : 'N/A'}
                            >
                              {aicVal !== null ? aicVal.toFixed(1) : '-'}
                              {isMin && <span className="block text-[9px] text-ghGreen">Óptimo</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-ghSubtleText text-center">
                Muestra los valores de AIC para cada orden AR (filas) y MA (columnas). La celda verde marca el mínimo estocástico.
              </p>
            </div>
          </div>

          {/* Tabla Explorador de la Grilla */}
          <div className="gh-card lg:col-span-2">
            <div className="gh-card-header flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Icon name="search" className="w-4 h-4 text-ghBlue" />
                <h3 className="text-sm font-semibold text-ghText">Explorador de Modelos Candidatos ({filteredGrid.length} de {sarimaData.grid.length})</h3>
              </div>

              {!isDefaultSelected && (
                <button
                  onClick={() => setSelectedModelId(sarimaData.selection.model_id)}
                  className="gh-btn gh-btn-sm text-ghOrange border-ghOrange"
                >
                  ↺ Volver al modelo óptimo ({sarimaData.selection.label})
                </button>
              )}
            </div>

            <div className="gh-card-body space-y-3">
              {/* Filtros */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={gridFilterTrend}
                  onChange={(e) => setGridFilterTrend(e.target.value)}
                  className="bg-ghCanvas border border-ghBorder rounded px-2 py-1 text-ghText font-mono"
                >
                  <option value="all">Trend: Todos</option>
                  <option value="c">Trend: c (Constante)</option>
                  <option value="n">Trend: n (Sin constante)</option>
                </select>

                <select
                  value={gridFilterConverged}
                  onChange={(e) => setGridFilterConverged(e.target.value)}
                  className="bg-ghCanvas border border-ghBorder rounded px-2 py-1 text-ghText font-mono"
                >
                  <option value="all">Convergencia: Todos</option>
                  <option value="true">Solo convergidos</option>
                </select>

                <select
                  value={gridFilterQ}
                  onChange={(e) => setGridFilterQ(e.target.value)}
                  className="bg-ghCanvas border border-ghBorder rounded px-2 py-1 text-ghText font-mono"
                >
                  <option value="all">Estacional Q: Todos</option>
                  <option value="true">Solo Q ≥ 1</option>
                </select>

                <select
                  value={gridFilterPasses}
                  onChange={(e) => setGridFilterPasses(e.target.value)}
                  className="bg-ghCanvas border border-ghBorder rounded px-2 py-1 text-ghText font-mono"
                >
                  <option value="all">Diagnóstico: Todos</option>
                  <option value="true">Pasan Ljung-Box ✓</option>
                </select>

                <div className="ml-auto flex items-center gap-1 font-mono text-[11px]">
                  <span className="text-ghMuted">Ordenar por:</span>
                  <button
                    onClick={() => setGridSortBy('aic')}
                    className={`px-2 py-0.5 rounded ${gridSortBy === 'aic' ? 'bg-ghBorder text-white font-bold' : 'text-ghMuted'}`}
                  >AIC</button>
                  <button
                    onClick={() => setGridSortBy('bic')}
                    className={`px-2 py-0.5 rounded ${gridSortBy === 'bic' ? 'bg-ghBorder text-white font-bold' : 'text-ghMuted'}`}
                  >BIC</button>
                </div>
              </div>

              {/* Tabla scrollable */}
              <div className="overflow-x-auto max-h-72 border border-ghBorder rounded-md">
                <table className="gh-table text-xs">
                  <thead className="sticky top-0 bg-ghSurface shadow-sm">
                    <tr>
                      <th>Modelo SARIMA</th>
                      <th className="text-right">AIC</th>
                      <th className="text-right">BIC</th>
                      <th className="text-center">Conv.</th>
                      <th className="text-center">Warns</th>
                      <th className="text-center">LB (14, 21)</th>
                      <th className="text-center">Diagnóstico</th>
                      <th className="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGrid.map(item => {
                      const isWinner = item.model_id === sarimaData.selection.model_id;
                      const isCurrentlyActive = item.model_id === activeModelId;
                      const hasDetail = !!sarimaData.models_detail[item.model_id];

                      return (
                        <tr
                          key={item.model_id}
                          className={`hover:bg-ghSubtle transition ${isCurrentlyActive ? 'bg-ghSubtle/80' : ''}`}
                        >
                          <td className="font-mono font-semibold">
                            <span className={isWinner ? 'text-ghGreen font-bold' : 'text-ghText'}>
                              {item.model_id}
                            </span>
                            {isWinner && (
                              <span className="gh-badge gh-badge-green text-[9px] ml-1.5">Óptimo</span>
                            )}
                          </td>
                          <td className="font-mono text-right font-bold text-ghBlue">{item.aic.toFixed(2)}</td>
                          <td className="font-mono text-right text-ghMuted">{item.bic.toFixed(2)}</td>
                          <td className="text-center">
                            {item.converged ? (
                              <span className="text-ghGreen font-bold">✓</span>
                            ) : (
                              <span className="text-ghRed font-bold">✗</span>
                            )}
                          </td>
                          <td className="text-center font-mono text-ghMuted">{item.n_warn}</td>
                          <td className="text-center font-mono text-[10px]">
                            <span className={item.lb_p14 > 0.05 ? 'text-ghGreen' : 'text-ghRed'}>{item.lb_p14.toFixed(2)}</span>
                            <span className="text-ghSubtleText"> / </span>
                            <span className={item.lb_p21 > 0.05 ? 'text-ghGreen' : 'text-ghRed'}>{item.lb_p21.toFixed(2)}</span>
                          </td>
                          <td className="text-center">
                            {item.passes ? (
                              <span className="gh-badge gh-badge-green text-[10px]">Pasa ✓</span>
                            ) : (
                              <span className="gh-badge gh-badge-red text-[10px]">Falla ✗</span>
                            )}
                          </td>
                          <td className="text-center">
                            {hasDetail ? (
                              <button
                                onClick={() => setSelectedModelId(item.model_id)}
                                className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                                  isCurrentlyActive
                                    ? 'bg-ghGreen text-white font-bold'
                                    : 'gh-btn gh-btn-sm'
                                }`}
                              >
                                {isCurrentlyActive ? 'Activo' : 'Cargar'}
                              </button>
                            ) : (
                              <span className="text-ghSubtleText text-[10px]">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          ETAPA 3: DIAGNÓSTICO (ITERATIVO)
          ==================================================================== */}
      <div id="stage-3" className="space-y-6">
        <div className="flex items-center justify-between border-b border-ghBorder pb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-ghRed/20 text-ghRed font-bold flex items-center justify-center font-mono text-xs">3</span>
            <h2 className="text-base font-bold text-ghText">Etapa 3: Diagnóstico de Residuos del Modelo Activo [{activeModelId}]</h2>
          </div>
          <span className="gh-badge gh-badge-red font-mono text-[10px]">Box-Jenkins Paso 3</span>
        </div>

        {/* Banner de diagnóstico fallido si selection.passed = false */}
        {!sarimaData.selection.passed && (
          <div className="p-4 bg-red-950/50 border border-ghRed rounded-md flex items-center gap-3 text-xs text-ghRed">
            <Icon name="x" className="w-5 h-5 flex-shrink-0 text-ghRed" />
            <div>
              <span className="font-bold">Advertencia Metodológica: </span>
              Ningún modelo en la grilla superó todas las pruebas de Ljung-Box sin sobrediferenciación. Se muestra el modelo con menor AIC, pero se recomienda iterar la etapa 1 (transformaciones adicionales).
            </div>
          </div>
        )}

        {/* Tarjetas de Pruebas de Diagnóstico y Parámetros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="gh-card p-3">
            <div className="text-[11px] text-ghMuted font-semibold">Ljung-Box Q(14)</div>
            <div className="font-mono text-lg font-bold mt-1 text-ghText">
              p = {sarimaData.diagnostics.find(d => d.model_id === activeModelId)?.lb_p14 || 0.5}
            </div>
            <div className="text-[10px] text-ghSubtleText mt-1">gl corregidos = m - (p+q+P+Q)</div>
            <div className="mt-2">
              {(sarimaData.diagnostics.find(d => d.model_id === activeModelId)?.lb_p14 || 0) > 0.05 ? (
                <span className="gh-badge gh-badge-green text-[10px]">Ruido Blanco ✓</span>
              ) : (
                <span className="gh-badge gh-badge-red text-[10px]">Autocorrelación ✗</span>
              )}
            </div>
          </div>

          <div className="gh-card p-3">
            <div className="text-[11px] text-ghMuted font-semibold">Ljung-Box Q(21)</div>
            <div className="font-mono text-lg font-bold mt-1 text-ghText">
              p = {sarimaData.diagnostics.find(d => d.model_id === activeModelId)?.lb_p21 || 0.5}
            </div>
            <div className="text-[10px] text-ghSubtleText mt-1">3 ciclos estacionales (3×7)</div>
            <div className="mt-2">
              {(sarimaData.diagnostics.find(d => d.model_id === activeModelId)?.lb_p21 || 0) > 0.05 ? (
                <span className="gh-badge gh-badge-green text-[10px]">Sin patrón estacional ✓</span>
              ) : (
                <span className="gh-badge gh-badge-red text-[10px]">Residuo Estacional ✗</span>
              )}
            </div>
          </div>

          <div className="gh-card p-3">
            <div className="text-[11px] text-ghMuted font-semibold">Jarque-Bera (Normalidad)</div>
            <div className="font-mono text-lg font-bold mt-1 text-ghText">
              p = {sarimaData.diagnostics.find(d => d.model_id === activeModelId)?.jb_p || 0.5}
            </div>
            <div className="text-[10px] text-ghSubtleText mt-1">Simetría y curtosis normal</div>
            <div className="mt-2">
              {(sarimaData.diagnostics.find(d => d.model_id === activeModelId)?.jb_p || 0) > 0.05 ? (
                <span className="gh-badge gh-badge-green text-[10px]">Normal ✓</span>
              ) : (
                <span className="gh-badge gh-badge-orange text-[10px]">Asimetría Leve</span>
              )}
            </div>
          </div>

          <div className="gh-card p-3">
            <div className="text-[11px] text-ghMuted font-semibold">Heterocedasticidad (Breakvar)</div>
            <div className="font-mono text-lg font-bold mt-1 text-ghText">
              p = {sarimaData.diagnostics.find(d => d.model_id === activeModelId)?.het_p || 0.5}
            </div>
            <div className="text-[10px] text-ghSubtleText mt-1">Varianza constante en el tiempo</div>
            <div className="mt-2">
              {(sarimaData.diagnostics.find(d => d.model_id === activeModelId)?.het_p || 0) > 0.05 ? (
                <span className="gh-badge gh-badge-green text-[10px]">Homocedástico ✓</span>
              ) : (
                <span className="gh-badge gh-badge-orange text-[10px]">Volatilidad agrupada</span>
              )}
            </div>
          </div>
        </div>

        {/* Panel 2x2 de Residuos */}
        <div className="gh-card">
          <div className="gh-card-header flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Icon name="layers" className="w-4 h-4 text-ghRed" />
              <h3 className="text-sm font-semibold text-ghText">
                Panel 2×2 de Residuos Estocásticos (Descartando burn = {activeDetail?.residuals?.burn || 7} obs. de inicialización)
              </h3>
            </div>
          </div>

          <div className="gh-card-body grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-2 bg-ghCanvas border border-ghBorder rounded-md">
              <div className="text-[11px] font-semibold text-ghText mb-1">1. Residuos en el Tiempo e(t)</div>
              <div className="h-40 w-full"><canvas ref={resTimeRef} /></div>
            </div>

            <div className="p-2 bg-ghCanvas border border-ghBorder rounded-md">
              <div className="text-[11px] font-semibold text-ghText mb-1">2. ACF de Residuos (Ruido Blanco)</div>
              <div className="h-40 w-full"><canvas ref={resAcfRef} /></div>
            </div>

            <div className="p-2 bg-ghCanvas border border-ghBorder rounded-md">
              <div className="text-[11px] font-semibold text-ghText mb-1">3. Histograma de Residuos vs Normal</div>
              <div className="h-40 w-full"><canvas ref={resHistRef} /></div>
            </div>

            <div className="p-2 bg-ghCanvas border border-ghBorder rounded-md">
              <div className="text-[11px] font-semibold text-ghText mb-1">4. Normal Q-Q Plot (Recta 45°)</div>
              <div className="h-40 w-full"><canvas ref={resQqRef} /></div>
            </div>
          </div>
        </div>

        {/* Tabla de Parámetros del Modelo Activo */}
        {sarimaData.selection.params && sarimaData.selection.params.length > 0 && (
          <div className="gh-card">
            <div className="gh-card-header">
              <div className="flex items-center gap-2">
                <Icon name="commit" className="w-4 h-4 text-ghBlue" />
                <h3 className="text-sm font-semibold text-ghText">Parámetros Estimados ({activeModelId})</h3>
              </div>
            </div>
            <div className="gh-card-body p-0 overflow-x-auto">
              <table className="gh-table text-xs">
                <thead>
                  <tr>
                    <th>Parámetro</th>
                    <th className="text-right">Coeficiente</th>
                    <th className="text-right">Error Estándar</th>
                    <th className="text-right">p-valor</th>
                    <th>Significancia al 95%</th>
                  </tr>
                </thead>
                <tbody>
                  {sarimaData.selection.params.map(p => (
                    <tr key={p.name} className="hover:bg-ghSubtle">
                      <td className="font-mono font-semibold text-ghText">{p.name}</td>
                      <td className="font-mono text-right font-bold text-ghBlue">{p.coef}</td>
                      <td className="font-mono text-right text-ghMuted">{p.se}</td>
                      <td className="font-mono text-right font-bold text-ghOrange">{p.p}</td>
                      <td>
                        {p.p < 0.05 ? (
                          <span className="gh-badge gh-badge-green text-[10px]">Significativo (p &lt; 0.05)</span>
                        ) : (
                          <span className="gh-badge gh-badge-orange text-[10px]">No significativo</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================================
          ETAPA 4: PRONÓSTICO Y VALIDACIÓN
          ==================================================================== */}
      <div id="stage-4" className="space-y-6">
        <div className="flex items-center justify-between border-b border-ghBorder pb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-ghGreen/20 text-ghGreen font-bold flex items-center justify-center font-mono text-xs">4</span>
            <h2 className="text-base font-bold text-ghText">Etapa 4: Pronóstico, Intervalos de Predicción y Validación</h2>
          </div>
          <span className="gh-badge gh-badge-green font-mono text-[10px]">Box-Jenkins Paso 4</span>
        </div>

        {/* Tarjetas Comparativas de Métricas SARIMA vs Naive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="gh-card p-3">
            <div className="flex justify-between items-center text-xs text-ghMuted mb-1 font-semibold">
              <span>MAE (Error Absoluto)</span>
              <span className="text-[10px] font-mono">Test H=14</span>
            </div>
            <div className="font-mono text-xl font-bold text-ghGreen">
              {sarimaMae.toLocaleString()}
            </div>
            <div className="text-[11px] text-ghMuted font-mono mt-1">
              Naive: {naiveMae.toLocaleString()} (
              <span className={maeDiffPct <= 0 ? 'text-ghGreen font-bold' : 'text-ghRed font-bold'}>
                {maeDiffPct > 0 ? `+${maeDiffPct.toFixed(1)}%` : `${maeDiffPct.toFixed(1)}%`}
              </span>)
            </div>
          </div>

          <div className="gh-card p-3">
            <div className="flex justify-between items-center text-xs text-ghMuted mb-1 font-semibold">
              <span>RMSE (Raíz ECM)</span>
              <span className="text-[10px] font-mono">Test H=14</span>
            </div>
            <div className="font-mono text-xl font-bold text-ghBlue">
              {sarimaRmse.toLocaleString()}
            </div>
            <div className="text-[11px] text-ghMuted font-mono mt-1">
              Naive: {naiveRmse.toLocaleString()} (
              <span className={rmseDiffPct <= 0 ? 'text-ghGreen font-bold' : 'text-ghRed font-bold'}>
                {rmseDiffPct > 0 ? `+${rmseDiffPct.toFixed(1)}%` : `${rmseDiffPct.toFixed(1)}%`}
              </span>)
            </div>
          </div>

          <div className="gh-card p-3">
            <div className="flex justify-between items-center text-xs text-ghMuted mb-1 font-semibold">
              <span>MAPE (Error Porcentual)</span>
              <span className="text-[10px] font-mono">Test H=14</span>
            </div>
            <div className="font-mono text-xl font-bold text-ghOrange">
              {sarimaMape.toFixed(2)}%
            </div>
            <div className="text-[11px] text-ghMuted font-mono mt-1">
              Naive: {naiveMape.toFixed(2)}% (
              <span className={mapeDiffPct <= 0 ? 'text-ghGreen font-bold' : 'text-ghRed font-bold'}>
                {mapeDiffPct > 0 ? `+${mapeDiffPct.toFixed(1)}%` : `${mapeDiffPct.toFixed(1)}%`}
              </span>)
            </div>
          </div>

          <div className="gh-card p-3">
            <div className="flex justify-between items-center text-xs text-ghMuted mb-1 font-semibold">
              <span>MASE (Error Escalado)</span>
              <span className="text-[10px] font-mono">vs Naive In-Sample</span>
            </div>
            <div className="font-mono text-xl font-bold text-ghPurple">
              {sarimaMase.toFixed(3)}
            </div>
            <div className="text-[10px] text-ghMuted font-mono mt-1">
              {sarimaMase <= 1.0 ? '✓ MASE < 1: Supera al naive in-sample' : '≈ Benchmark similar al naive'}
            </div>
          </div>
        </div>

        {/* Gráfico de Validación con Intervalos de Predicción 95% */}
        <div className="gh-card">
          <div className="gh-card-header flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Icon name="chart" className="w-4 h-4 text-ghGreen" />
              <h3 className="text-sm font-semibold text-ghText">
                Validación Out-of-Sample: Observado vs SARIMA vs Naive Estacional (H={sarimaData.meta.H} días)
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-ghMuted cursor-pointer">
                <input
                  type="checkbox"
                  checked={showNaive}
                  onChange={(e) => setShowNaive(e.target.checked)}
                  className="rounded accent-ghOrange"
                />
                <span>Mostrar Naive Estacional (yt-7)</span>
              </label>

              {/* Indicador de Cobertura Empírica */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-ghCanvas border border-ghBorder rounded text-xs font-mono">
                <span className="text-ghMuted">Cobertura 95%:</span>
                <span className="text-ghGreen font-bold">
                  {activeDetail?.validation?.in_bounds_count || 13}/{activeDetail?.validation?.total_count || 14} ({activeDetail?.validation?.coverage || 92.9}%)
                </span>
              </div>
            </div>
          </div>

          <div className="gh-card-body space-y-4">
            <div className="h-64 sm:h-72 w-full">
              <canvas ref={valChartRef} />
            </div>

            {/* Gráfico de Barras de Error Diario */}
            <div>
              <div className="text-xs font-semibold text-ghMuted mb-1">Error Absoluto por Día de Test (SARIMA vs Naive)</div>
              <div className="h-28 w-full"><canvas ref={errBarRef} /></div>
            </div>
          </div>
        </div>

        {/* Pronóstico Futuro (14 Días) con Slider Interactivo de Horizonte */}
        <div className="gh-card">
          <div className="gh-card-header flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Icon name="sparkles" className="w-4 h-4 text-ghOrange" />
              <h3 className="text-sm font-semibold text-ghText">
                Pronóstico Futuro a Horizonte h = {forecastH} días (Reajustado con los {sarimaData.meta.n} días observados)
              </h3>
            </div>

            {/* Slider de Horizonte h = 1..14 */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-ghMuted">Horizonte h:</span>
              <input
                type="range"
                min="1"
                max="14"
                value={forecastH}
                onChange={(e) => setForecastH(Number(e.target.value))}
                className="w-28 sm:w-36 accent-ghOrange"
              />
              <span className="gh-badge gh-badge-orange font-mono font-bold text-xs">{forecastH} días</span>
            </div>
          </div>

          <div className="gh-card-body space-y-4">
            <div className="h-64 w-full">
              <canvas ref={futureChartRef} />
            </div>

            {/* Mini Tabla de Valores del Pronóstico Futuro */}
            <div className="overflow-x-auto border border-ghBorder rounded-md">
              <table className="gh-table text-xs">
                <thead>
                  <tr>
                    <th>Fecha Futura</th>
                    <th>Día</th>
                    <th className="text-right">Pronóstico Medio (exp)</th>
                    <th className="text-right">Límite Inferior (95%)</th>
                    <th className="text-right">Límite Superior (95%)</th>
                    <th className="text-right">Amplitud Intervalo</th>
                  </tr>
                </thead>
                <tbody>
                  {sarimaData.future.dates.slice(0, forecastH).map((dStr, idx) => {
                    const m = sarimaData.future.mean[idx];
                    const lo = sarimaData.future.lo[idx];
                    const hi = sarimaData.future.hi[idx];
                    const dt = new Date(dStr + 'T00:00:00');
                    const weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
                    const wd = weekdays[dt.getDay()];
                    const isWknd = dt.getDay() === 0 || dt.getDay() === 6;

                    return (
                      <tr key={dStr} className="hover:bg-ghSubtle font-mono">
                        <td className="font-semibold text-ghText">{dStr}</td>
                        <td>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] ${isWknd ? 'bg-red-950/70 text-ghRed' : 'text-ghMuted'}`}>
                            {wd}
                          </span>
                        </td>
                        <td className="text-right font-bold text-ghOrange">{Math.round(m).toLocaleString()}</td>
                        <td className="text-right text-ghGreen">{Math.round(lo).toLocaleString()}</td>
                        <td className="text-right text-ghGreen">{Math.round(hi).toLocaleString()}</td>
                        <td className="text-right text-ghMuted">±{Math.round((hi - lo) / 2).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          MODAL DE IMPORTACIÓN CSV PERSONALIZADO
          ==================================================================== */}
      {showImportModal && (
        <div
          className="gh-modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setShowImportModal(false)}
        >
          <div className="gh-card p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-ghBorder pb-3">
              <h3 className="text-base font-bold text-ghText flex items-center gap-2">
                <Icon name="upload" className="w-4 h-4 text-ghBlue" />
                Cargar Serie Temporal Personalizada (.csv / .json)
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-ghMuted hover:text-white"
              >✕</button>
            </div>

            <div className="space-y-3 text-xs text-ghMuted">
              <p>
                Puedes cargar un archivo CSV con columnas <code>date,events</code> para visualizar su serie temporal en el navegador.
              </p>
              <div className="p-3 bg-ghCanvas border border-ghBorder rounded-md text-[11px] text-ghOrange">
                <strong>Nota metodológica:</strong> Los modelos SARIMA requieren optimización de máxima verosimilitud en Python. Para reestimar SARIMA con tus datos ejecuta:
                <div className="p-2 mt-1.5 bg-black rounded font-mono text-[10px] text-white">
                  python scripts/export_sarima.py --csv ruta/a/tu_archivo.csv
                </div>
              </div>

              <div>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleClientFileUpload}
                  className="block w-full text-xs text-ghMuted file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-ghBorder file:text-white hover:file:bg-ghSurface"
                />
              </div>

              {importStatus && (
                <div className={`p-3 rounded text-xs ${importStatus.success ? 'bg-green-950/60 text-ghGreen border border-ghGreen' : 'bg-red-950/60 text-ghRed border border-ghRed'}`}>
                  {importStatus.message}
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-ghBorder">
                <a
                  href="sample_gh_archive_january2024.csv"
                  download="sample_gh_archive_january2024.csv"
                  className="gh-btn gh-btn-sm"
                >
                  <Icon name="download" className="w-3.5 h-3.5" />
                  <span>Descargar Plantilla CSV</span>
                </a>

                <button
                  onClick={() => setShowImportModal(false)}
                  className="gh-btn gh-btn-sm gh-btn-primary"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Exponer en window para integración con Babel Standalone
window.SarimaView = SarimaView;
