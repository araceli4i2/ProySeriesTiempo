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

### 5. Capítulo 6 — Modelos ARIMA (31 días de Enero 2024, 12:00 UTC)
- **Serie Temporal Diaria:** Trayectoria observada de los 31 días a las 12:00 UTC con marcado del punto muestral (15 de enero: 286,864 eventos).
- **Pronóstico Estocástico:** Proyección a horizonte interactivo $h = 1 \dots 14$ días futuros (Febrero 2024) con banda sombreada de Intervalo de Confianza al 95%.
- **Pruebas Estadísticas:**
  - *Dickey-Fuller Aumentada (ADF):* No estacionaria en niveles ($t_\gamma = -2.15, p = 0.228$) y Estacionaria en 1ra diferencia ($t_\gamma = -5.87, p = 0.00002$).
  - *Ljung-Box:* $Q(10) = 7.84, p = 0.644$ (Residuos sin autocorrelación significativa, ruido blanco validado).
  - *Métricas de Calidad:* MAE = 6,840.5, RMSE = 8,920.2, MAPE = 2.74%, $R^2 = 0.951$.
- **Correlogramas Gemelos:** Gráficos de ACF y PACF para 15 rezagos con bandas de significancia $\pm 1.96/\sqrt{N}$.
- **Comparativa de Modelos Candidatos:** Tabla con AIC, BIC y verosimilitud (confirmando ARIMA(1,1,1) como el más parsimonioso).
- **Importador de Datos Dinámicos:** Modal para cargar archivos `.csv` o `.json` personalizados, con opción de descarga de plantilla (`sample_gh_archive_january2024.csv`) o restablecimiento a valores iniciales.

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
