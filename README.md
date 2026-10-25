# UMSA DAT-262 | GH Archive Stochastic Analytical Dashboard
**Aplicación de Cadenas de Markov y Modelos ARIMA sobre datos de GitHub (GH Archive)**

> **Materia:** DAT-262: Procesos Estocásticos y Análisis de Series de Tiempo  
> **Institución:** Universidad Mayor de San Andrés (UMSA) — Carrera de Informática  
> **Estudiantes:** Yeral Ariel Gutierrez Quispe & Raquel Araceli Serrano Mamani  
> **Docente:** M.Sc. Mario Amílcar Miranda Gonzales  
> **Muestra de Investigación:** 15 de Enero de 2024, 12:00 a 12:59 UTC (286,864 eventos en `2024-01-15-12.json`) y Serie Diaria de Enero de 2024 (31 días).

---

## 🎨 Características de Diseño y UI (GitHub Primer Dark Theme)

El dashboard implementa fielmente el sistema de diseño **GitHub Dark Primer**:
- **Canvas Principal:** `#0d1117`
- **Superficie de Tarjetas:** `#161b22`
- **Bordes y Delimitadores:** `#30363d` (1px solid, border-radius: 6px)
- **Acentos Oficiales:** Azul GitHub (`#58a6ff`), Verde Push/Success (`#238636` / `#3fb950`), Morado Markov/PR (`#8957e5`), Naranja ARIMA/Alerta (`#d29922`), Rojo Delete/Bots (`#f85149`).
- **Tipografía Dual:** Inter para UI general y `JetBrains Mono` / `Fira Code` para probabilidades, métricas, hashes, ramas Git y ecuaciones matemáticas.
- **Renderizado de Fórmulas:** Integración nativa con **KaTeX** para visualización rigurosa de ecuaciones estocásticas.

---

## 📊 Arquitectura de las 5 Vistas Analíticas

### 1. Overview & Actividad Horaria (Exploración General)
- **6 KPI Cards:**
  1. Total Eventos: `286,864` (869.76 MB en `2024-01-15-12.json`)
  2. Usuarios Únicos: `57,308` (`actor_id`)
  3. Repositorios Únicos: `100,525` (`repo_id`)
  4. Espacio de Estados: `15` tipos de evento
  5. Frecuencia Promedio: `4,781.1` eventos/minuto (Pico: `5,310` a las 12:35 UTC)
  6. Automatización: `github-actions[bot]` genera `64,298` eventos (`22.4%` del total)
- **Gráfico de Serie Temporal (60 minutos):** Frecuencia minuto a minuto interactiva con filtros por tipo de evento y media móvil de 5 minutos.
- **Distribución de Estados:** Gráfico de barras horizontales de los 15 tipos de evento (`PushEvent` 69.8%, `CreateEvent` 9.2%, `PullRequestEvent` 5.5%, `IssueCommentEvent` 3.5%, `WatchEvent` 3.0%, etc.).
- **Ranking de Actores:** Clasificación diferenciada entre bots automatizados y desarrolladores humanos con búsqueda y filtros rápidos.

### 2. Capítulo 3 (Enfoque A) — Cadenas de Markov de Tipos de Eventos
- **Fórmulas Teóricas:**
  - Propiedad de Markov: $P(X_{n+1}=j \mid X_n=i) = p_{ij}$
  - Distribución Estacionaria: $\boldsymbol{\pi} = \boldsymbol{\pi} \mathbf{P}$
  - Tiempo Medio de Retorno: $\mu_j = 1/\pi_j$
- **Mapa de Calor Interactivo (Heatmap):** Matriz estocástica $15 \times 15$ con conmutador a Top 8 estados, tooltips con probabilidades condicionales exactas e interruptor para **destacar el efecto racha** ($p_{ii} > \pi_i$).
  - *Hallazgo clave:* Detección de rachas y loops de automatización en `PushEvent -> PushEvent`, `CreateEvent -> CreateEvent` y respuestas instantáneas en incidencias.
- **Simulador Interactivo Chapman-Kolmogorov ($P^n$):** Permite elegir cualquier estado inicial $X_0$, controlar el número de pasos $n \in [1, 20]$ y observar la rápida convergencia hacia $\boldsymbol{\pi}$ con cálculo en tiempo real de la Distancia de Variación Total $D_{TV}(P^n, \boldsymbol{\pi}) \to 0$.

### 3. Capítulo 3 (Enfoque B) — PageRank sobre Red de Repositorios
- **Matriz de Google:** $G = \alpha H + (1-\alpha)\frac{1}{n}J$ con factor de amortiguamiento $\alpha = 0.85$.
- **Topología de la Red:** Repositorios analizados sobre 286,864 interacciones de GitHub.
- **Grafo Interactivo (Canvas HTML5):** Simulación dinámica con partículas de navegante aleatorio y control deslizante para ajustar $\alpha$ en tiempo real (de 0.50 a 0.99).
- **Tabla GitHub Trending:** Top repositorios por PageRank liderados por proyectos de testing, kernels de desarrollo y repositorios de alto flujo de commits.

### 4. Exploración Extendida de Payload & Organizaciones
- **Donut Ratio:** Cuentas Personales (`223,502` — 77.9%) vs Organizaciones (`63,362` — 22.1%).
- **Top Organizaciones:** Ranking de entidades corporativas y comunidades de código abierto extraídas directamente de `org.login`.
- **Acciones en Payload:** Distribución de `payload.action` (`created`, `opened`, `started`, `closed`, `merged`, `labeled`).
- **Ramas Git Destino:** Predominancia de `refs/heads/main` y `refs/heads/master`.
- **Profundidad de Discusión:** Comentarios por incidencia y desglose de acciones en Pull Requests.

### 5. Capítulo 6 — Modelos SARIMA (Metodología Box-Jenkins)
Implementación integral y rigurosa del protocolo clásico de Box-Jenkins para series de tiempo con componente estacional semanal ($s=7$), basada en la pipeline metodológica de `DAT262_Proyecto_SARIMA_Diario_Corregido.ipynb`:

- **Flujo de Datos Arquitectónico:**
  `scripts/export_sarima.py` $\longrightarrow$ `data/sarima_results.json` $\longrightarrow$ `js/views/sarima.js` (fetch dinámico en el cliente).
- **Etapa 1: Identificación**
  - **Serie Temporal Interactiva:** Vista en escala natural o logarítmica con demarcación visual de partición train/test ($H=14$ días), crosshair interactivo con día de la semana y zoom de rango.
  - **Descomposición STL Sincronizada:** Paneles coordinados de Tendencia ($T_t$), Estacionalidad ($S_t$) y Residuo ($R_t$). Gauge de Fuerza Estacional $F_s = \max(0, 1 - \frac{\mathrm{Var}(R)}{\mathrm{Var}(S+R)})$ con umbral crítico $0.64$ ($D=1$).
  - **Perfil Semanal:** Desglose del factor de estacionalidad por día (Lunes a Domingo) resaltando fines de semana.
  - **Pipeline de Estacionariedad:** Selector multi-etapa (Niveles log $\to$ Dif. estacional $\to$ Dif. estacional + regular) con pruebas formales ADF y KPSS en paralelo.
  - **Correlogramas Gemelos (ACF / PACF a 35 rezagos):** Bandas de Bartlett $\pm 1.96/\sqrt{N}$, con resaltado estacional en rezagos $7, 14, 21, 28, 35$ y líneas punteadas de referencia.
- **Etapa 2: Estimación**
  - **Explorador de Grilla (72 modelos):** Combinaciones $(p,d,q) \times (P,D,Q)_s$ con tendencia $c$ o $n$. Tabla ordenable con filtros por convergencia, warnings, tendencia y diagnóstico.
  - **Mapa de Calor AIC:** Matriz bidimensional $(p,q)$ parametrizable por $(P,Q)$ y tendencia con marcado del mínimo global.
  - **Inspección de Candidatos:** Clic en cualquiera de los Top 10 modelos recalcula y actualiza instantáneamente los paneles de diagnóstico y pronóstico.
- **Etapa 3: Diagnóstico Iterativo**
  - **Verificación de Residuos:** Descarte de los primeros $d + D \cdot s$ residuos de inicialización (`burn`).
  - **Panel 2×2 de Residuos:** Serie en el tiempo, ACF de residuos, histograma con curva normal teórica y gráfico Q-Q normal con recta identidad.
  - **Tarjetas de Pruebas Formales:** Ljung-Box en rezagos 14 y 21 con grados de libertad corregidos $gl = m - (p+q+P+Q)$, prueba Jarque-Bera de normalidad y prueba de heterocedasticidad.
  - **Detección de Sobrediferenciación:** Alerta automática si algún coeficiente $\Theta_Q$ o $\theta_q$ se acerca a las raíces unitarias ($< -0.95$).
- **Etapa 4: Pronóstico y Validación**
  - **Gráfico de Validación Out-of-Sample:** Trayectoria observada vs pronóstico SARIMA con banda de Intervalo de Predicción al 95% y benchmark Naive Estacional ($y_{t-7}$).
  - **Evaluación de Errores & Métricas:** MAE, RMSE, MAPE y MASE (referenciado al error in-sample del naive estacional), con indicador de cobertura empírica de la banda de predicción.
  - **Proyección Futura:** Horizonte interactivo $h \in [1, 14]$ días con tabla detallada de valores esperados e intervalos.
  - **Importador de Datos Externos:** Soporte para CSV y JSON con cálculo en cliente de transformaciones, diferenciaciones y ACF/PACF, junto con instrucciones para reestimación completa en Python.

---

## 🔬 Cómo Regenerar los Resultados SARIMA

Para reentrenar la grilla Box-Jenkins y reexportar los datos estructurados a `data/sarima_results.json`, utiliza el pipeline en `scripts/export_sarima.py`:

### Requisitos previos (Python 3.9+)
```bash
pip install pandas numpy statsmodels scikit-learn scipy requests
```

### Ejecución estándar (genera 120 días con simulación realista de estacionalidad semanal):
```bash
python scripts/export_sarima.py
```

### Reestimación con archivo CSV propio o fechas específicas:
```bash
python scripts/export_sarima.py --csv sample_gh_archive_january2024.csv --start 2024-01-01 --end 2024-04-30
```

### Opciones de la línea de comandos:
- `--csv <ruta>`: Ruta a un archivo CSV con columnas `date,events` (o `timestamp,count`).
- `--source {gharchive,simulated}`: Fuerza el origen de datos en los metadatos exportados.
- `--start <YYYY-MM-DD>`: Fecha de inicio de la serie temporal diaria.
- `--end <YYYY-MM-DD>`: Fecha de fin de la serie temporal diaria.
- `--h <int>`: Horizonte de predicción y tamaño del conjunto de test (por defecto: 14 días).
- `--alpha <float>`: Nivel de significancia para los intervalos de predicción (por defecto: 0.05 para 95% de confianza).
- `--output <ruta>`: Ruta de destino (por defecto: `data/sarima_results.json`).

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

El proyecto es 100% modular, ligero y no requiere dependencias pesadas de `npm`:

### Opción 1: Con Python (Recomendado)
Ejecuta el script incluido que levantará el servidor HTTP y abrirá automáticamente tu navegador en `http://localhost:8080`:

```bash
python start_dashboard.py
```

O directamente mediante el módulo estándar:
```bash
python -m http.server 8080
```
Y abre [http://localhost:8080](http://localhost:8080) en Google Chrome o Microsoft Edge.

---

## 👥 Créditos del Proyecto
- **Materia:** DAT-262: Procesos Estocásticos y Análisis de Series de Tiempo
- **Carrera de Informática** — Universidad Mayor de San Andrés (UMSA)
- **Autores:**
  - Yeral Ariel Gutierrez Quispe
  - Raquel Araceli Serrano Mamani
- **Docente Revisor:**
  - M.Sc. Mario Amílcar Miranda Gonzales
