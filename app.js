/**
 * UMSA DAT-262: Procesos Estocásticos y Análisis de Series de Tiempo
 * Dashboard Analítico Estocástico sobre GitHub Archive (Marzo 2026)
 * Estudiantes: Yeral Ariel Gutierrez Quispe & Raquel Araceli Serrano Mamani
 * Docente: M.Sc. Mario Amílcar Miranda Gonzales
 */

const { useState, useEffect, useMemo, useRef } = React;

// --- QR Code Modal Component ---
function QRModal({ onClose }) {
  const networkUrl = window.NETWORK_URL || window.location.origin;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=58a6ff&bgcolor=0d1117&data=${encodeURIComponent(networkUrl)}`;
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(networkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="gh-modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Compartir QR"
    >
      <div
        style={{
          background: 'var(--canvas-subtle)',
          border: '1px solid var(--border-default)',
          borderRadius: '12px',
          padding: '28px 24px 24px',
          width: '300px',
          maxWidth: '90vw',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'transparent', border: 'none',
            color: 'var(--fg-muted)', cursor: 'pointer', fontSize: '18px', lineHeight: 1,
          }}
          aria-label="Cerrar"
        >✕</button>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fg-default)', marginBottom: '2px' }}>
            📱 Escanear para abrir el Dashboard
          </div>
          <div style={{ fontSize: '11px', color: 'var(--fg-muted)' }}>
            Misma red Wi-Fi requerida
          </div>
        </div>

        {/* QR Image */}
        <div
          style={{
            padding: '10px',
            background: '#0d1117',
            border: '2px solid var(--accent-blue)',
            borderRadius: '10px',
            boxShadow: '0 0 24px rgba(88,166,255,0.25)',
          }}
        >
          <img
            src={qrApiUrl}
            alt="QR Code"
            width={220}
            height={220}
            style={{ display: 'block', borderRadius: '4px' }}
          />
        </div>

        {/* Network URL + copy button */}
        <div style={{ width: '100%' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--canvas-inset, #010409)',
            border: '1px solid var(--border-default)',
            borderRadius: '6px', padding: '6px 10px',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              color: 'var(--accent-blue)', flex: 1, wordBreak: 'break-all',
            }}>
              {networkUrl}
            </span>
            <button
              onClick={copyUrl}
              className="gh-btn gh-btn-sm"
              style={{ flexShrink: 0, fontSize: '11px', padding: '3px 8px' }}
              title="Copiar URL"
            >
              {copied ? '✓' : '⎘'}
            </button>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--fg-subtle)', marginTop: '6px', textAlign: 'center' }}>
            El celular debe estar en la misma red Wi-Fi que esta computadora
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper KaTeX Formula Component ---
function MathFormula({ math, block = false, className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && window.katex) {
      try {
        window.katex.render(math, containerRef.current, {
          throwOnError: false,
          displayMode: block
        });
      } catch (e) {
        containerRef.current.innerText = math;
      }
    }
  }, [math, block]);

  return <span ref={containerRef} className={`font-mono ${className}`}></span>;
}

// --- GitHub Octicons & Lucide SVG Icons ---
function Icon({ name, className = "w-4 h-4", color = "currentColor" }) {
  const icons = {
    repo: (
      <svg className={className} viewBox="0 0 16 16" fill={color}>
        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
      </svg>
    ),
    star: (
      <svg className={className} viewBox="0 0 16 16" fill={color}>
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
      </svg>
    ),
    fork: (
      <svg className={className} viewBox="0 0 16 16" fill={color}>
        <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h4.5A2.25 2.25 0 0 0 12.5 6.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25Zm6 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM8 10.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm1.5 0a2.25 2.25 0 1 0-3 0v2.5a.75.75 0 0 0 1.5 0v-2.5Z"></path>
      </svg>
    ),
    eye: (
      <svg className={className} viewBox="0 0 16 16" fill={color}>
        <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.577.43 8.9a1.619 1.619 0 0 1 0-1.798c.45-.678 1.367-1.932 2.637-3.023C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.589 1.209 1.67 2.28 2.582C5.053 11.545 6.446 12.5 8 12.5c1.554 0 2.947-.955 4.041-1.85 1.071-.913 1.869-1.994 2.28-2.583a.12.12 0 0 0 0-.135c-.411-.59-1.209-1.67-2.28-2.583C10.947 4.455 9.554 3.5 8 3.5c-1.554 0-2.947.955-4.041 1.85-1.071.913-1.869 1.993-2.28 2.582ZM8 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"></path>
      </svg>
    ),
    commit: (
      <svg className={className} viewBox="0 0 16 16" fill={color}>
        <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path>
      </svg>
    ),
    pr: (
      <svg className={className} viewBox="0 0 16 16" fill={color}>
        <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.5 5.396V4.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1 0-1.5h1.646L6.123 5.244a.75.75 0 0 1 1.054-1.06l.001-.001ZM13.5 10.25a2.25 2.25 0 1 1-1.5 0v-1.5a.75.75 0 0 0-1.5 0v1.5a2.25 2.25 0 1 1-1.5 0V7.75a2.25 2.25 0 0 1 2.25-2.25h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 0-.75.75v2.5a2.25 2.25 0 0 1 1.5 0Z"></path>
      </svg>
    ),
    branch: (
      <svg className={className} viewBox="0 0 16 16" fill={color}>
        <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Z"></path>
      </svg>
    ),
    activity: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
    ),
    markov: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3"></circle>
        <circle cx="18" cy="18" r="3"></circle>
        <line x1="8.5" y1="7.5" x2="15.5" y2="16.5"></line>
        <path d="M12 4a8 8 0 0 1 8 8"></path>
      </svg>
    ),
    network: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="6" height="6" rx="1"></rect>
        <rect x="16" y="2" width="6" height="6" rx="1"></rect>
        <rect x="9" y="16" width="6" height="6" rx="1"></rect>
        <path d="M5 8v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"></path>
        <line x1="12" y1="14" x2="12" y2="16"></line>
      </svg>
    ),
    layers: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
    ),
    chart: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    ),
    bot: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
        <circle cx="12" cy="5" r="2"></circle>
        <path d="M12 7v4"></path>
        <line x1="8" y1="16" x2="8.01" y2="16"></line>
        <line x1="16" y1="16" x2="16.01" y2="16"></line>
      </svg>
    ),
    user: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    upload: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
    ),
    download: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    ),
    play: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    ),
    pause: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    ),
    reset: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10"></polyline>
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
      </svg>
    ),
    check: (
      <svg className={className} viewBox="0 0 16 16" fill={color}>
        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
      </svg>
    ),
    sparkles: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
      </svg>
    )
  };

  return icons[name] || icons.repo;
}

// --- Top Header Component (GitHub Repository Bar) ---
function Header({ activeTab, setActiveTab, data }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const copyCloneCmd = () => {
    navigator.clipboard.writeText("git clone https://github.com/UMSA-DAT262/gh-archive-stochastic-dashboard.git");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalEv = data ? data.GENERAL_METRICS.totalEvents : 286864;
  const numStates = data ? data.EVENT_TYPES.length : 15;
  const uniqueRepos = data ? data.GENERAL_METRICS.uniqueRepos : 100525;
  const personalPct = data ? data.ORG_VS_PERSONAL.personalPct : 77.9;

  return (
    <header className="border-b border-ghBorder bg-ghSurface">
      {showQR && <QRModal onClose={() => setShowQR(false)} />}
      {/* Upper Repository Breadcrumb & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumb & Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Icon name="repo" className="w-5 h-5 text-ghMuted" />
            <a href="#repo" className="text-ghBlue hover:underline font-semibold text-lg">
              UMSA-DAT262
            </a>
            <span className="text-ghMuted">/</span>
            <a href="#repo" className="text-ghBlue hover:underline font-bold text-lg">
              gh-archive-stochastic-dashboard
            </a>

            <span className="gh-badge gh-badge-default font-mono">Public</span>
            <span className="gh-badge gh-badge-blue font-mono">Python 3.11</span>
            <span className="gh-badge gh-badge-green font-mono flex items-center gap-1.5" title="Dataset real conectado">
              <span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></span>
              <span>Dataset: {data?.DATASET_METADATA?.sourceFile || "2024-01-15-12.json"}</span>
            </span>
            <span className="gh-badge gh-badge-purple font-mono">
              {data?.GENERAL_METRICS?.sampleWindow || "2024-01-15 12:00 UTC"}
            </span>
            <span className="gh-badge gh-badge-default font-mono text-ghBlue">DAT-262 UMSA</span>
          </div>

          {/* Action Buttons (GitHub Style) */}
          <div className="flex items-center gap-2">
            <button className="gh-btn gh-btn-sm" title="Watch activity">
              <Icon name="eye" className="w-3.5 h-3.5 text-ghMuted" />
              <span>Watch</span>
              <span className="text-ghMuted font-mono text-xs">18</span>
            </button>
            <button className="gh-btn gh-btn-sm" title="Star repository">
              <Icon name="star" className="w-3.5 h-3.5 text-ghOrange" />
              <span>Star</span>
              <span className="text-ghMuted font-mono text-xs">262</span>
            </button>
            <button className="gh-btn gh-btn-sm" title="Fork repository">
              <Icon name="fork" className="w-3.5 h-3.5 text-ghMuted" />
              <span>Fork</span>
              <span className="text-ghMuted font-mono text-xs">42</span>
            </button>
            <button onClick={copyCloneCmd} className="gh-btn gh-btn-sm gh-btn-primary" title="Copy git clone URL">
              <Icon name={copied ? "check" : "commit"} className="w-3.5 h-3.5" />
              <span>{copied ? "¡Copiado!" : "Code"}</span>
            </button>
            {/* QR Share Button */}
            <button
              onClick={() => setShowQR(true)}
              className="gh-btn gh-btn-sm gh-btn-blue"
              title="Compartir via QR"
              aria-label="Código QR"
              id="btn-qr-share"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="3" height="3"/>
                <rect x="18" y="18" width="3" height="3"/>
                <rect x="14" y="18" width="3" height="1"/>
                <rect x="18" y="14" width="1" height="3"/>
              </svg>
              <span>QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Octicons Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 overflow-x-auto scrollbar-none" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`gh-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <Icon name="activity" className="w-4 h-4 text-ghBlue" />
            <span>Overview & Actividad</span>
            <span className="tab-counter font-mono">{(totalEv / 1000).toFixed(1)}k</span>
          </button>

          <button
            onClick={() => setActiveTab('markov')}
            className={`gh-nav-tab ${activeTab === 'markov' ? 'active' : ''}`}
          >
            <Icon name="markov" className="w-4 h-4 text-ghPurple" />
            <span>Cadenas de Markov</span>
            <span className="tab-counter font-mono">P ({numStates}×{numStates})</span>
          </button>

          <button
            onClick={() => setActiveTab('pagerank')}
            className={`gh-nav-tab ${activeTab === 'pagerank' ? 'active' : ''}`}
          >
            <Icon name="network" className="w-4 h-4 text-ghGreen" />
            <span>PageRank Network</span>
            <span className="tab-counter font-mono">{(uniqueRepos / 1000).toFixed(1)}k</span>
          </button>

          <button
            onClick={() => setActiveTab('payload')}
            className={`gh-nav-tab ${activeTab === 'payload' ? 'active' : ''}`}
          >
            <Icon name="layers" className="w-4 h-4 text-ghOrange" />
            <span>Payload & Orgs</span>
            <span className="tab-counter font-mono">{personalPct.toFixed(1)}%</span>
          </button>

          <button
            onClick={() => setActiveTab('arima')}
            className={`gh-nav-tab ${activeTab === 'arima' ? 'active' : ''}`}
          >
            <Icon name="chart" className="w-4 h-4 text-ghRed" />
            <span>ARIMA Forecasting</span>
            <span className="tab-counter font-mono">31 Días</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

// --- Footer Component (Academic Credits) ---
function Footer() {
  return (
    <footer className="border-t border-ghBorder bg-ghSurface mt-12 py-8 text-xs text-ghMuted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-ghSubtle border border-ghBorder flex items-center justify-center font-mono font-bold text-ghBlue">
              U
            </span>
            <div>
              <div className="font-semibold text-ghText text-sm">
                Universidad Mayor de San Andrés (UMSA) • Carrera de Informática
              </div>
              <div>DAT-262: Procesos Estocásticos y Análisis de Series de Tiempo</div>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <div>
              <span className="font-semibold text-ghText">Estudiantes:</span> Yeral Ariel Gutierrez Quispe & Raquel Araceli Serrano Mamani
            </div>
            <div>
              <span className="font-semibold text-ghText">Docente:</span> M.Sc. Mario Amílcar Miranda Gonzales
            </div>
            <div className="font-mono text-ghSubtleText text-[11px]">
              Metodologías: Cadenas de Markov Discretas (Chapman-Kolmogorov) • PageRank Random Surfer • Modelos ARIMA Box-Jenkins
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// VISTA 1: OVERVIEW & ACTIVIDAD HORARIA
// ============================================================================
function OverviewView({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [metricFilter, setMetricFilter] = useState('all'); // all, pushes, creates, prs
  const [actorFilter, setActorFilter] = useState('all'); // all, bots, humans
  const [searchActor, setSearchActor] = useState('');

  // 60-Minute Line Chart Initialization
  useEffect(() => {
    if (!chartRef.current || !window.Chart) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    const minutes = data.MINUTE_ACTIVITY.map(d => d.minute);
    
    let datasetLabel = "Total Eventos / min";
    let datasetData = data.MINUTE_ACTIVITY.map(d => d.events);
    let borderColor = "#58a6ff";
    let bgGradient = "rgba(88, 166, 255, 0.12)";

    if (metricFilter === 'pushes') {
      datasetLabel = "PushEvent / min";
      datasetData = data.MINUTE_ACTIVITY.map(d => d.pushes);
      borderColor = "#238636";
      bgGradient = "rgba(46, 160, 67, 0.12)";
    } else if (metricFilter === 'creates') {
      datasetLabel = "CreateEvent / min";
      datasetData = data.MINUTE_ACTIVITY.map(d => d.creates);
      borderColor = "#3fb950";
      bgGradient = "rgba(63, 185, 80, 0.12)";
    } else if (metricFilter === 'prs') {
      datasetLabel = "PullRequestEvent / min";
      datasetData = data.MINUTE_ACTIVITY.map(d => d.prs);
      borderColor = "#bc8cff";
      bgGradient = "rgba(188, 140, 255, 0.12)";
    }

    // Moving average of 5 minutes
    const movingAvg = datasetData.map((val, idx, arr) => {
      const start = Math.max(0, idx - 4);
      const sub = arr.slice(start, idx + 1);
      return Math.round(sub.reduce((a, b) => a + b, 0) / sub.length);
    });

    chartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: minutes,
        datasets: [
          {
            label: datasetLabel,
            data: datasetData,
            borderColor: borderColor,
            backgroundColor: bgGradient,
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointRadius: (ctx) => (ctx.dataIndex === 59 ? 6 : 0), // Peak at 12:59
            pointHoverRadius: 6,
            pointBackgroundColor: borderColor
          },
          {
            label: "Media Móvil (5 min)",
            data: movingAvg,
            borderColor: "#d29922",
            borderDash: [5, 5],
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false,
            tension: 0.2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            labels: { color: "#8b949e", font: { family: 'Inter', size: 12 } }
          },
          tooltip: {
            backgroundColor: "#161b22",
            titleColor: "#c9d1d9",
            bodyColor: "#8b949e",
            borderColor: "#30363d",
            borderWidth: 1,
            padding: 10,
            displayColors: true,
            callbacks: {
              afterBody: (context) => {
                const idx = context[0].dataIndex;
                if (idx === 59) return "📍 PICO MÁXIMO DE LA MUESTRA: 3,413 eventos";
                return "";
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: "#21262d" },
            ticks: { color: "#8b949e", font: { family: 'JetBrains Mono', size: 10 }, maxTicksLimit: 12 }
          },
          y: {
            grid: { color: "#21262d" },
            ticks: { color: "#8b949e", font: { family: 'JetBrains Mono', size: 10 } }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [metricFilter, data]);

  // Filter Actors
  const filteredActors = useMemo(() => {
    return data.TOP_ACTORS.filter(actor => {
      const matchType = actorFilter === 'all' ? true : actorFilter === 'bots' ? actor.isBot : !actor.isBot;
      const matchQuery = actor.login.toLowerCase().includes(searchActor.toLowerCase()) || actor.type.toLowerCase().includes(searchActor.toLowerCase());
      return matchType && matchQuery;
    });
  }, [actorFilter, searchActor, data]);

  const kpis = data.GENERAL_METRICS;

  const stdDev = useMemo(() => {
    if (!data.MINUTE_ACTIVITY || data.MINUTE_ACTIVITY.length === 0) return 0;
    const mean = kpis.avgPerMinute;
    const variance = data.MINUTE_ACTIVITY.reduce((acc, curr) => acc + Math.pow(curr.events - mean, 2), 0) / data.MINUTE_ACTIVITY.length;
    return Math.round(Math.sqrt(variance) * 10) / 10;
  }, [data, kpis.avgPerMinute]);

  return (
    <div className="space-y-6">
      {/* 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="gh-card p-4">
          <div className="flex items-center justify-between text-ghMuted text-xs mb-1">
            <span>Total Eventos</span>
            <Icon name="commit" className="w-4 h-4 text-ghBlue" />
          </div>
          <div className="font-mono text-2xl font-bold text-ghText">{kpis.totalEvents.toLocaleString()}</div>
          <div className="text-[11px] text-ghMuted mt-1 flex items-center gap-1">
            <span className="gh-badge gh-badge-blue text-[10px] py-0 px-1 font-mono">{kpis.fileSizeMB} MB</span>
            <span>2024-01-15-12.json</span>
          </div>
        </div>

        <div className="gh-card p-4">
          <div className="flex items-center justify-between text-ghMuted text-xs mb-1">
            <span>Usuarios Únicos</span>
            <Icon name="user" className="w-4 h-4 text-ghGreen" />
          </div>
          <div className="font-mono text-2xl font-bold text-ghText">{kpis.uniqueActors.toLocaleString()}</div>
          <div className="text-[11px] text-ghMuted mt-1">
            <span className="font-mono text-ghGreen">actor_id</span> individuales
          </div>
        </div>

        <div className="gh-card p-4">
          <div className="flex items-center justify-between text-ghMuted text-xs mb-1">
            <span>Repositorios Únicos</span>
            <Icon name="repo" className="w-4 h-4 text-ghPurple" />
          </div>
          <div className="font-mono text-2xl font-bold text-ghText">{kpis.uniqueRepos.toLocaleString()}</div>
          <div className="text-[11px] text-ghMuted mt-1">
            <span className="font-mono text-ghPurple">repo_id</span> activos
          </div>
        </div>

        <div className="gh-card p-4">
          <div className="flex items-center justify-between text-ghMuted text-xs mb-1">
            <span>Tipos de Evento</span>
            <Icon name="markov" className="w-4 h-4 text-ghOrange" />
          </div>
          <div className="font-mono text-2xl font-bold text-ghText">{kpis.eventTypesCount}</div>
          <div className="text-[11px] text-ghMuted mt-1">
            Estados espacio estocástico
          </div>
        </div>

        <div className="gh-card p-4">
          <div className="flex items-center justify-between text-ghMuted text-xs mb-1">
            <span>Promedio / Minuto</span>
            <Icon name="activity" className="w-4 h-4 text-ghBlue" />
          </div>
          <div className="font-mono text-2xl font-bold text-ghText">{kpis.avgPerMinute.toLocaleString()}</div>
          <div className="text-[11px] text-ghMuted mt-1">
            Pico: <span className="font-mono text-ghOrange font-semibold">{kpis.peakEvents.toLocaleString()}</span> ({kpis.peakMinute})
          </div>
        </div>

        <div className="gh-card p-4">
          <div className="flex items-center justify-between text-ghMuted text-xs mb-1">
            <span>Automatización (Bots)</span>
            <Icon name="bot" className="w-4 h-4 text-ghRed" />
          </div>
          <div className="font-mono text-2xl font-bold text-ghText">{kpis.botEventCount.toLocaleString()}</div>
          <div className="text-[11px] text-ghRed mt-1 font-semibold flex items-center gap-1">
            <span className="gh-badge gh-badge-red text-[10px] py-0 px-1 font-mono">{kpis.botPercentage}%</span>
            <span>github-actions[bot]</span>
          </div>
        </div>
      </div>

      {/* 60-Minute Activity Chart Card */}
      <div className="gh-card">
        <div className="gh-card-header flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Icon name="activity" className="w-4 h-4 text-ghBlue" />
            <h2 className="text-sm font-semibold text-ghText">
              Actividad Temporal Minuto a Minuto ({kpis.sampleWindow})
            </h2>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMetricFilter('all')}
              className={`gh-btn gh-btn-sm ${metricFilter === 'all' ? 'bg-ghBorder text-white font-semibold' : ''}`}
            >
              Todos ({(kpis.totalEvents / 1000).toFixed(0)}k)
            </button>
            <button
              onClick={() => setMetricFilter('pushes')}
              className={`gh-btn gh-btn-sm ${metricFilter === 'pushes' ? 'bg-ghGreenEmphasis text-white font-semibold' : ''}`}
            >
              Pushes ({data.EVENT_DISTRIBUTION.find(e => e.type === 'PushEvent')?.pct.toFixed(1) || '69.8'}%)
            </button>
            <button
              onClick={() => setMetricFilter('creates')}
              className={`gh-btn gh-btn-sm ${metricFilter === 'creates' ? 'bg-ghBorder text-white font-semibold' : ''}`}
            >
              Creates ({data.EVENT_DISTRIBUTION.find(e => e.type === 'CreateEvent')?.pct.toFixed(1) || '9.2'}%)
            </button>
            <button
              onClick={() => setMetricFilter('prs')}
              className={`gh-btn gh-btn-sm ${metricFilter === 'prs' ? 'bg-ghPurpleEmphasis text-white font-semibold' : ''}`}
            >
              PRs ({data.EVENT_DISTRIBUTION.find(e => e.type === 'PullRequestEvent')?.pct.toFixed(1) || '5.5'}%)
            </button>
          </div>
        </div>

        <div className="gh-card-body">
          <div className="h-64 sm:h-80 w-full">
            <canvas ref={chartRef}></canvas>
          </div>

          <div className="mt-4 pt-3 border-t border-ghBorder grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-ghBlue"></span>
              <span className="text-ghMuted">Mínimo:</span>
              <span className="font-mono text-ghText font-medium">{kpis.minEvents.toLocaleString()} ev ({kpis.minMinute})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-ghOrange"></span>
              <span className="text-ghMuted">Máximo:</span>
              <span className="font-mono text-ghText font-medium">{kpis.peakEvents.toLocaleString()} ev ({kpis.peakMinute})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-ghGreen"></span>
              <span className="text-ghMuted">Media / min:</span>
              <span className="font-mono text-ghText font-medium">{kpis.avgPerMinute.toLocaleString()} ev</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-ghPurple"></span>
              <span className="text-ghMuted">Desv. Estándar:</span>
              <span className="font-mono text-ghText font-medium">±{stdDev} ev</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Event Distribution & Actor Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Event Types Horizontal Bar Chart (7 cols) */}
        <div className="lg:col-span-7 gh-card">
          <div className="gh-card-header">
            <div className="flex items-center gap-2">
              <Icon name="markov" className="w-4 h-4 text-ghPurple" />
              <h3 className="text-sm font-semibold text-ghText">
                Distribución de los {data.EVENT_TYPES.length} Estados Estocásticos (Tipos de Eventos)
              </h3>
            </div>
            <span className="text-xs text-ghMuted font-mono">N = {kpis.totalEvents.toLocaleString()}</span>
          </div>

          <div className="gh-card-body space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {data.EVENT_DISTRIBUTION.map((item, index) => {
              const maxCount = data.EVENT_DISTRIBUTION[0].count;
              const widthPct = Math.max(1, (item.count / maxCount) * 100);
              return (
                <div key={item.type} className="group hover:bg-ghSubtle p-1.5 rounded transition">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-ghSubtleText text-[11px] w-4">{index + 1}.</span>
                      <span className="font-mono font-semibold text-ghText">{item.type}</span>
                      <span className="text-ghSubtleText text-[11px] hidden sm:inline">• {item.desc}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-ghText font-semibold">{item.count.toLocaleString()}</span>
                      <span className="text-ghMuted w-12 text-right">({item.pct.toFixed(2)}%)</span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full bg-[#21262d] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: item.color || '#58a6ff'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Ranking de Usuarios / Bots (5 cols) */}
        <div className="lg:col-span-5 gh-card">
          <div className="gh-card-header flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Icon name="bot" className="w-4 h-4 text-ghGreen" />
              <h3 className="text-sm font-semibold text-ghText">
                Top Actores Más Activos
              </h3>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActorFilter('all')}
                className={`gh-btn gh-btn-sm ${actorFilter === 'all' ? 'bg-ghBorder text-white font-semibold' : ''}`}
              >
                Todos
              </button>
              <button
                onClick={() => setActorFilter('bots')}
                className={`gh-btn gh-btn-sm ${actorFilter === 'bots' ? 'bg-ghBorder text-white font-semibold' : ''}`}
              >
                Bots
              </button>
              <button
                onClick={() => setActorFilter('humans')}
                className={`gh-btn gh-btn-sm ${actorFilter === 'humans' ? 'bg-ghBorder text-white font-semibold' : ''}`}
              >
                Humanos
              </button>
            </div>
          </div>

          <div className="p-3 border-b border-ghBorder">
            <input
              type="text"
              placeholder="Buscar por usuario o pipeline..."
              value={searchActor}
              onChange={(e) => setSearchActor(e.target.value)}
              className="w-full bg-ghCanvas border border-ghBorder rounded px-3 py-1.5 text-xs text-ghText placeholder-ghSubtleText focus:outline-none focus:border-ghBlue"
            />
          </div>

          <div className="gh-card-body p-0 max-h-[430px] overflow-y-auto">
            <table className="gh-table text-xs">
              <thead>
                <tr>
                  <th>Actor / Login</th>
                  <th>Tipo</th>
                  <th className="text-right">Eventos</th>
                  <th className="text-right">% Muestra</th>
                </tr>
              </thead>
              <tbody>
                {filteredActors.map((actor, idx) => (
                  <tr key={actor.login}>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-base">{actor.avatar}</span>
                        <div>
                          <div className="font-mono font-semibold text-ghText flex items-center gap-1.5">
                            {actor.login}
                            {actor.isBot ? (
                              <span className="gh-badge gh-badge-purple text-[9px] py-0 px-1">BOT</span>
                            ) : (
                              <span className="gh-badge gh-badge-blue text-[9px] py-0 px-1">HUMAN</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-ghMuted text-[11px]">{actor.type}</td>
                    <td className="font-mono text-right font-semibold text-ghText">
                      {actor.events.toLocaleString()}
                    </td>
                    <td className="font-mono text-right text-ghMuted">
                      {actor.pct.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VISTA 2: CAPÍTULO 3 (ENFOQUE A) — CADENAS DE MARKOV DE TIPOS DE EVENTOS
// ============================================================================
function MarkovView({ data }) {
  const [activeMatrixSize, setActiveMatrixSize] = useState('full'); // full (16x16) or top8
  const [highlightStreaks, setHighlightStreaks] = useState(true);
  const [hoveredCell, setHoveredCell] = useState(null);

  // Markov Multi-step Simulator State
  const [initialStateIdx, setInitialStateIdx] = useState(1); // 1 = CreateEvent, 10 = ForkEvent
  const [simSteps, setSimSteps] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Matrix and states
  const states = activeMatrixSize === 'full' ? data.EVENT_TYPES : data.EVENT_TYPES.slice(0, 8);
  const P = data.TRANSITION_MATRIX;
  const piVector = data.STATIONARY_DISTRIBUTION.map(d => d.pi);

  // Chapman-Kolmogorov Multi-step Probability Calculation: P^n
  const currentStepDist = useMemo(() => {
    const K = data.EVENT_TYPES.length;
    // Initial probability vector: e_{X0}
    let pVec = new Array(K).fill(0);
    const validInitialIdx = Math.min(initialStateIdx, K - 1);
    pVec[validInitialIdx] = 1.0;

    // Multiply vector by P, n times
    for (let step = 0; step < simSteps; step++) {
      let nextVec = new Array(K).fill(0);
      for (let j = 0; j < K; j++) {
        let sum = 0;
        for (let i = 0; i < K; i++) {
          sum += pVec[i] * (P[i] ? P[i][j] : 0);
        }
        nextVec[j] = sum;
      }
      pVec = nextVec;
    }

    // Compute Total Variation Distance: D_TV = 0.5 * sum |p_j - pi_j|
    let tvDist = 0;
    for (let j = 0; j < K; j++) {
      tvDist += Math.abs(pVec[j] - (piVector[j] || 0));
    }
    tvDist = tvDist * 0.5;

    return { vector: pVec, tvDist: tvDist };
  }, [initialStateIdx, simSteps, P, piVector, data.EVENT_TYPES.length]);

  // Auto-step animation
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSimSteps(prev => (prev >= 20 ? 1 : prev + 1));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-6">
      {/* Mathematical Theory Panel */}
      <div className="gh-card">
        <div className="gh-card-header">
          <div className="flex items-center gap-2">
            <Icon name="sparkles" className="w-4 h-4 text-ghPurple" />
            <h2 className="text-sm font-semibold text-ghText">
              Fundamentación Teórica: Cadenas de Markov de Parámetro Discreto
            </h2>
          </div>
          <span className="gh-badge gh-badge-purple font-mono">DAT-262 Cap. 3</span>
        </div>

        <div className="gh-card-body grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="gh-code-box">
            <div className="text-xs text-ghMuted mb-1 font-semibold flex items-center justify-between">
              <span>1. Propiedad de Markov</span>
              <span className="text-ghPurple font-mono">Sin Memoria</span>
            </div>
            <div className="py-2 text-center text-sm text-ghText">
              <MathFormula math="P(X_{n+1} = j \mid X_n = i, \dots, X_0 = i_0) = p_{ij}" block={true} />
            </div>
            <p className="text-[11px] text-ghSubtleText mt-1">
              La probabilidad del tipo de evento en el paso <MathFormula math="n+1" /> depende únicamente del evento inmediatamente anterior <MathFormula math="X_n" />.
            </p>
          </div>

          <div className="gh-code-box">
            <div className="text-xs text-ghMuted mb-1 font-semibold flex items-center justify-between">
              <span>2. Distribución Estacionaria</span>
              <span className="text-ghGreen font-mono">Vector \pi</span>
            </div>
            <div className="py-2 text-center text-sm text-ghText">
              <MathFormula math={`\\boldsymbol{\\pi} = \\boldsymbol{\\pi} \\mathbf{P}, \\quad \\sum_{j=1}^{${data.EVENT_TYPES.length}} \\pi_j = 1`} block={true} />
            </div>
            <p className="text-[11px] text-ghSubtleText mt-1">
              Como la cadena es irreducible y aperiódica, existe una única distribución invariante a la que converge el sistema sin importar el estado inicial.
            </p>
          </div>

          <div className="gh-code-box">
            <div className="text-xs text-ghMuted mb-1 font-semibold flex items-center justify-between">
              <span>3. Tiempo Medio de Retorno</span>
              <span className="text-ghOrange font-mono">\mu_j = 1/\pi_j</span>
            </div>
            <div className="py-2 text-center text-sm text-ghText">
              <MathFormula math="\mu_j = \mathbb{E}[T_j \mid X_0 = j] = \frac{1}{\pi_j}" block={true} />
            </div>
            <p className="text-[11px] text-ghSubtleText mt-1">
              Número esperado de eventos transcurridos antes de volver a observar el mismo tipo de evento en la corriente global de GH Archive.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Heatmap Section */}
      <div className="gh-card">
        <div className="gh-card-header flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Icon name="markov" className="w-4 h-4 text-ghBlue" />
            <h3 className="text-sm font-semibold text-ghText">
              Matriz de Transición Empírica <MathFormula math="\mathbf{P} = (p_{ij})" /> de {data.EVENT_TYPES.length} Estados
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighlightStreaks(!highlightStreaks)}
              className={`gh-btn gh-btn-sm ${highlightStreaks ? 'gh-btn-purple' : ''}`}
            >
              <Icon name="sparkles" className="w-3.5 h-3.5" />
              <span>{highlightStreaks ? "Rachas Destacadas (ON)" : "Destacar Rachas"}</span>
            </button>

            <div className="flex items-center bg-ghCanvas border border-ghBorder rounded p-0.5">
              <button
                onClick={() => setActiveMatrixSize('top8')}
                className={`px-2 py-1 text-xs rounded ${activeMatrixSize === 'top8' ? 'bg-ghBorder text-white font-semibold' : 'text-ghMuted'}`}
              >
                Top 8 Estados
              </button>
              <button
                onClick={() => setActiveMatrixSize('full')}
                className={`px-2 py-1 text-xs rounded ${activeMatrixSize === 'full' ? 'bg-ghBorder text-white font-semibold' : 'text-ghMuted'}`}
              >
                Completa ({data.EVENT_TYPES.length}×{data.EVENT_TYPES.length})
              </button>
            </div>
          </div>
        </div>

        <div className="gh-card-body">
          <div className="overflow-x-auto pb-2">
            <table className="border-collapse mx-auto text-xs">
              <thead>
                <tr>
                  <th className="p-1.5 text-ghMuted text-left font-mono text-[11px] border border-transparent">
                    <span className="text-ghPurple">X(n) \ X(n+1)</span>
                  </th>
                  {states.map((col, j) => (
                    <th key={col} className="p-1.5 text-ghMuted font-mono text-[10px] text-center max-w-[80px] truncate" title={col}>
                      {col.replace('Event', '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {states.map((rowName, i) => (
                  <tr key={rowName}>
                    <td className="p-1.5 font-mono text-ghText font-semibold text-[11px] whitespace-nowrap bg-ghSubtle border border-ghBorder pr-3">
                      {rowName.replace('Event', '')}
                    </td>
                    {states.map((colName, j) => {
                      const prob = P[i][j];
                      const isDiagonal = i === j;
                      const isStreak = isDiagonal && prob > piVector[i];
                      const isHovered = hoveredCell && hoveredCell.i === i && hoveredCell.j === j;

                      // Color interpolation based on probability
                      // 0: #161b22, 0.05: #1f6feb, 0.15: #238636, 0.8: #3fb950
                      let bg = "#161b22";
                      let textColor = "#8b949e";
                      if (prob > 0.7) {
                        bg = "rgba(46, 160, 67, 0.85)";
                        textColor = "#ffffff";
                      } else if (prob > 0.1) {
                        bg = "rgba(56, 139, 253, 0.5)";
                        textColor = "#ffffff";
                      } else if (prob > 0.03) {
                        bg = "rgba(137, 87, 229, 0.35)";
                        textColor = "#c9d1d9";
                      } else if (prob > 0.01) {
                        bg = "rgba(137, 87, 229, 0.15)";
                        textColor = "#8b949e";
                      }

                      const streakBorder = highlightStreaks && isStreak ? "outline outline-2 outline-ghOrange" : "";

                      return (
                        <td
                          key={colName}
                          onMouseEnter={() => setHoveredCell({ i, j, from: rowName, to: colName, prob, pi: piVector[j] })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`heatmap-cell p-1.5 text-center font-mono text-[10px] border border-ghBorder transition ${streakBorder}`}
                          style={{ backgroundColor: bg, color: textColor }}
                        >
                          {prob.toFixed(3)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dynamic Cell Inspector & Interpretation */}
          <div className="mt-4 p-3 bg-ghCanvas border border-ghBorder rounded-md text-xs">
            {hoveredCell ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ghText">Transición:</span>
                  <span className="font-mono text-ghPurple font-bold">{hoveredCell.from}</span>
                  <span className="text-ghMuted">➔</span>
                  <span className="font-mono text-ghBlue font-bold">{hoveredCell.to}</span>
                </div>
                <div className="flex items-center gap-4 font-mono">
                  <div>
                    <span className="text-ghMuted">P(j | i): </span>
                    <span className="text-ghGreen font-bold text-sm">{(hoveredCell.prob * 100).toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-ghMuted">Prob. Estacionaria (\pi_j): </span>
                    <span className="text-ghText">{(hoveredCell.pi * 100).toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-ghMuted">Factor de Atracción: </span>
                    <span className="font-bold text-ghOrange">
                      {(hoveredCell.prob / hoveredCell.pi).toFixed(2)}x
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-ghMuted flex items-center gap-2">
                <Icon name="sparkles" className="w-4 h-4 text-ghOrange" />
                <span>Pasa el cursor sobre cualquier celda para inspeccionar la probabilidad de transición condicional <MathFormula math="P(X_{n+1}=j \mid X_n=i)" /> y su factor multiplicador contra <MathFormula math="\pi_j" />.</span>
              </div>
            )}
          </div>

          {/* Notables Streaks Cards */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {data.MARKOV_STREAKS.slice(0, 4).map(streak => (
              <div key={streak.from + streak.to} className="p-3 bg-ghSubtle border border-ghBorder rounded">
                <div className="flex items-center justify-between text-xs font-mono font-semibold mb-1">
                  <span className="text-ghText">{streak.from.replace('Event','')} ➔ {streak.to.replace('Event','')}</span>
                  <span className="gh-badge gh-badge-orange text-[10px]">{streak.factor}x</span>
                </div>
                <div className="text-sm font-mono font-bold text-ghGreen">
                  p = {streak.p.toFixed(3)} <span className="text-xs text-ghMuted font-normal">(vs \pi = {streak.pi.toFixed(4)})</span>
                </div>
                <p className="text-[11px] text-ghMuted mt-1">{streak.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Stationary Distribution Table vs Return Time & Interactive Chapman-Kolmogorov Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tabla Comparativa Pi vs Retorno (6 cols) */}
        <div className="lg:col-span-6 gh-card">
          <div className="gh-card-header">
            <div className="flex items-center gap-2">
              <Icon name="chart" className="w-4 h-4 text-ghGreen" />
              <h3 className="text-sm font-semibold text-ghText">
                Distribución Estacionaria (<MathFormula math="\boldsymbol{\pi}" />) vs Tiempo Medio de Retorno (<MathFormula math="1/\boldsymbol{\pi}" />)
              </h3>
            </div>
          </div>

          <div className="gh-card-body p-0 max-h-[460px] overflow-y-auto">
            <table className="gh-table text-xs">
              <thead>
                <tr>
                  <th>Estado (Tipo de Evento)</th>
                  <th className="text-right">Vector <MathFormula math="\pi_j" /></th>
                  <th className="text-right">Retorno (<MathFormula math="\mu_j" /> eventos)</th>
                  <th>Categoría</th>
                </tr>
              </thead>
              <tbody>
                {data.STATIONARY_DISTRIBUTION.map((item) => (
                  <tr key={item.type}>
                    <td className="font-mono font-semibold text-ghText">
                      {item.type}
                    </td>
                    <td className="font-mono text-right text-ghGreen font-semibold">
                      {(item.pi * 100).toFixed(2)}%
                    </td>
                    <td className="font-mono text-right text-ghOrange font-semibold">
                      {item.returnTime.toFixed(1)} ev
                    </td>
                    <td>
                      <span className="gh-badge gh-badge-default text-[10px]">{item.category}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Chapman-Kolmogorov Interactive Simulator (6 cols) */}
        <div className="lg:col-span-6 gh-card">
          <div className="gh-card-header">
            <div className="flex items-center gap-2">
              <Icon name="markov" className="w-4 h-4 text-ghPurple" />
              <h3 className="text-sm font-semibold text-ghText">
                Simulador Chapman-Kolmogorov: Convergencia <MathFormula math="\mathbf{P}^n \to \boldsymbol{\pi}" />
              </h3>
            </div>
            <span className="gh-badge gh-badge-blue text-xs font-mono">Paso n = {simSteps}</span>
          </div>

          <div className="gh-card-body space-y-4">
            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-ghCanvas border border-ghBorder rounded">
              <div>
                <label className="text-xs text-ghMuted block mb-1">Estado Inicial <MathFormula math="X_0" />:</label>
                <select
                  value={initialStateIdx}
                  onChange={(e) => setInitialStateIdx(Number(e.target.value))}
                  className="w-full bg-ghSurface border border-ghBorder text-xs text-ghText rounded p-1.5 focus:outline-none focus:border-ghPurple font-mono"
                >
                  {data.EVENT_TYPES.map((type, idx) => (
                    <option key={type} value={idx}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-ghMuted mb-1">
                  <span>Pasos <MathFormula math="n" />:</span>
                  <span className="font-mono text-ghText font-bold">{simSteps}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={simSteps}
                  onChange={(e) => setSimSteps(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between gap-2 pt-1 border-t border-ghBorder">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`gh-btn gh-btn-sm ${isPlaying ? 'gh-btn-purple' : 'gh-btn-blue'}`}
                >
                  <Icon name={isPlaying ? "pause" : "play"} className="w-3.5 h-3.5" />
                  <span>{isPlaying ? "Pausar Animación" : "Auto Convergencia"}</span>
                </button>

                <button
                  onClick={() => setSimSteps(1)}
                  className="gh-btn gh-btn-sm"
                >
                  <Icon name="reset" className="w-3.5 h-3.5" />
                  <span>Reset n=1</span>
                </button>

                <div className="text-xs font-mono">
                  <span className="text-ghMuted">Dist. Variación Total: </span>
                  <span className={`font-bold ${currentStepDist.tvDist < 0.05 ? 'text-ghGreen' : 'text-ghOrange'}`}>
                    {currentStepDist.tvDist.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            {/* Probability Distribution at step n vs Stationary Distribution */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              <div className="text-xs text-ghMuted flex items-center justify-between">
                <span>Distribución en paso <MathFormula math="P(X_n = j \mid X_0)" />:</span>
                <span className="text-[11px] text-ghGreen font-mono">Línea discontinua: \pi_j</span>
              </div>

              {data.EVENT_TYPES.slice(0, 8).map((type, idx) => {
                const currentProb = currentStepDist.vector[idx];
                const targetPi = piVector[idx];
                return (
                  <div key={type} className="text-xs">
                    <div className="flex items-center justify-between font-mono mb-1">
                      <span className="text-ghText font-semibold">{type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-ghPurple font-bold">{(currentProb * 100).toFixed(2)}%</span>
                        <span className="text-ghSubtleText text-[10px]">(\pi: {(targetPi * 100).toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#21262d] rounded-full h-2 relative overflow-hidden">
                      <div
                        className="h-full bg-ghPurple transition-all duration-300 rounded-full"
                        style={{ width: `${Math.min(100, currentProb * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-ghSubtleText italic">
              * Observa cómo para <MathFormula math="n \ge 6" />, la distribución <MathFormula math="P(X_n)" /> se estabiliza rápidamente en el vector estacionario <MathFormula math="\boldsymbol{\pi}" />, demostrando la alta velocidad de mezclado (mixing time) del proceso estocástico de GitHub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VISTA 3: CAPÍTULO 3 (ENFOQUE B) — PAGERANK SOBRE RED DE REPOSITORIOS
// ============================================================================
function PageRankView({ data }) {
  const canvasRef = useRef(null);
  const [dampingAlpha, setDampingAlpha] = useState(0.85);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [searchRepo, setSearchRepo] = useState('');

  // Repositories Table filtered
  const filteredRepos = useMemo(() => {
    return data.PAGERANK_TOP_REPOS.filter(r => 
      r.repo.toLowerCase().includes(searchRepo.toLowerCase()) || 
      r.category.toLowerCase().includes(searchRepo.toLowerCase())
    );
  }, [searchRepo, data]);

  // Directed Network Graph Canvas Simulator with Random Surfer Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = 360;

    const nodes = data.SAMPLE_NETWORK.nodes.map((n, i) => {
      const angle = (i / data.SAMPLE_NETWORK.nodes.length) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.36;
      return {
        ...n,
        x: width / 2 + Math.cos(angle) * radius + (Math.sin(i * 1.5) * 20),
        y: height / 2 + Math.sin(angle) * radius + (Math.cos(i * 1.5) * 15),
        // Size scaled by PageRank and alpha
        radius: Math.max(8, Math.min(26, Math.sqrt(n.pr * 100000) * 1.4 * (dampingAlpha / 0.85)))
      };
    });

    const edges = data.SAMPLE_NETWORK.edges.map(e => {
      const source = nodes.find(n => n.id === e.from) || nodes[0];
      const target = nodes.find(n => n.id === e.to) || nodes[1];
      return { ...e, source, target };
    });

    // Random surfer particles
    const particles = Array.from({ length: 18 }, () => ({
      edgeIdx: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      speed: 0.006 + Math.random() * 0.008
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Directed Edges
      edges.forEach(e => {
        ctx.beginPath();
        ctx.moveTo(e.source.x, e.source.y);
        ctx.lineTo(e.target.x, e.target.y);
        ctx.strokeStyle = "rgba(48, 54, 61, 0.6)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Arrow head
        const angle = Math.atan2(e.target.y - e.source.y, e.target.x - e.source.x);
        const arrowDist = e.target.radius + 3;
        const arrowX = e.target.x - Math.cos(angle) * arrowDist;
        const arrowY = e.target.y - Math.sin(angle) * arrowDist;

        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - 8 * Math.cos(angle - Math.PI / 7), arrowY - 8 * Math.sin(angle - Math.PI / 7));
        ctx.lineTo(arrowX - 8 * Math.cos(angle + Math.PI / 7), arrowY - 8 * Math.sin(angle + Math.PI / 7));
        ctx.fillStyle = "rgba(139, 148, 158, 0.5)";
        ctx.fill();
      });

      // Animate Particles (Random Surfer Teleportation & Traversal)
      particles.forEach(p => {
        p.t += p.speed;
        if (p.t > 1) {
          p.t = 0;
          // With probability (1 - alpha), random jump to any edge
          if (Math.random() > dampingAlpha) {
            p.edgeIdx = Math.floor(Math.random() * edges.length);
          }
        }
        const edge = edges[p.edgeIdx];
        if (edge) {
          const px = edge.source.x + (edge.target.x - edge.source.x) * p.t;
          const py = edge.source.y + (edge.target.y - edge.source.y) * p.t;

          ctx.beginPath();
          ctx.arc(px, py, 3, 0, 2 * Math.PI);
          ctx.fillStyle = "#58a6ff";
          ctx.shadowColor = "#58a6ff";
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw Nodes
      nodes.forEach(n => {
        const isSelected = selectedRepo && selectedRepo.id === n.id;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, 2 * Math.PI);

        // Fill based on group
        ctx.fillStyle = n.group === 'bots' ? '#f85149' : n.group === 'ci' ? '#8957e5' : '#238636';
        if (isSelected) {
          ctx.strokeStyle = "#58a6ff";
          ctx.lineWidth = 3;
          ctx.stroke();
        } else {
          ctx.strokeStyle = "#30363d";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.fill();

        // Node Label
        ctx.font = '10px JetBrains Mono';
        ctx.fillStyle = '#c9d1d9';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y + n.radius + 12);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [dampingAlpha, selectedRepo, data]);

  return (
    <div className="space-y-6">
      {/* Mathematical Theory of Google Matrix */}
      <div className="gh-card">
        <div className="gh-card-header">
          <div className="flex items-center gap-2">
            <Icon name="network" className="w-4 h-4 text-ghGreen" />
            <h2 className="text-sm font-semibold text-ghText">
              Matriz de Google & Navegante Aleatorio sobre la Red de Repositorios
            </h2>
          </div>
          <span className="gh-badge gh-badge-green font-mono">Capítulo 3 (Enfoque B)</span>
        </div>

        <div className="gh-card-body grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="gh-code-box">
            <div className="text-xs text-ghMuted mb-1 font-semibold flex items-center justify-between">
              <span>Matriz de Google</span>
              <span className="text-ghGreen font-mono">\alpha = 0.85</span>
            </div>
            <div className="py-2 text-center text-sm text-ghText">
              <MathFormula math="\mathbf{G} = \alpha \mathbf{H} + (1-\alpha) \frac{1}{n} \mathbf{J}" block={true} />
            </div>
            <p className="text-[11px] text-ghSubtleText mt-1">
              <MathFormula math="\mathbf{H}" /> es la matriz de transiciones de usuarios entre repositorios consecutivos; el término de teletransportación <MathFormula math="(1-\alpha)" /> resuelve los callejones sin salida (dangling nodes).
            </p>
          </div>

          <div className="gh-code-box">
            <div className="text-xs text-ghMuted mb-1 font-semibold flex items-center justify-between">
              <span>Topología de la Red</span>
              <span className="text-ghBlue font-mono">Densidad 1.15</span>
            </div>
            <div className="py-2 space-y-1 text-xs font-mono text-ghText">
              <div>• Nodos Activos (<MathFormula math="n" />): <span className="text-ghBlue font-bold">36,281</span> repos</div>
              <div>• Aristas Dirigidas: <span className="text-ghGreen font-bold">41,902</span> enlaces</div>
              <div>• Promedio de enlaces: <span className="text-ghOrange font-bold">1.15</span> aristas/nodo</div>
            </div>
            <p className="text-[11px] text-ghSubtleText mt-1">
              Red dirigida altamente dispersa con estructura libre de escala (scale-free power-law).
            </p>
          </div>

          <div className="gh-code-box">
            <div className="text-xs text-ghMuted mb-1 font-semibold flex items-center justify-between">
              <span>Vector Propio Dominante</span>
              <span className="text-ghPurple font-mono">\lambda_1 = 1</span>
            </div>
            <div className="py-2 text-center text-sm text-ghText">
              <MathFormula math="\mathbf{r} = \mathbf{r} \mathbf{G}, \quad r_j = \lim_{k \to \infty} (\mathbf{G}^k)_{ij}" block={true} />
            </div>
            <p className="text-[11px] text-ghSubtleText mt-1">
              Por el Teorema de Perron-Frobenius, <MathFormula math="\mathbf{r}" /> representa la probabilidad límite de permanencia de un desarrollador en el repositorio <MathFormula math="j" />.
            </p>
          </div>
        </div>
      </div>

      {/* Network Visualization Card */}
      <div className="gh-card">
        <div className="gh-card-header flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Icon name="network" className="w-4 h-4 text-ghGreen" />
            <h3 className="text-sm font-semibold text-ghText">
              Visualización Interactiva de la Red de Navegación Estocástica
            </h3>
          </div>

          {/* Damping Factor Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-ghMuted font-mono">
              Factor de amortiguamiento <MathFormula math="\alpha" />: <strong className="text-ghText font-bold">{dampingAlpha.toFixed(2)}</strong>
            </span>
            <input
              type="range"
              min="0.50"
              max="0.99"
              step="0.01"
              value={dampingAlpha}
              onChange={(e) => setDampingAlpha(Number(e.target.value))}
              className="w-28"
            />
          </div>
        </div>

        <div className="gh-card-body p-0 relative">
          <canvas ref={canvasRef} className="w-full bg-[#0a0d12] cursor-crosshair"></canvas>

          {/* Legend and Surfer status */}
          <div className="p-3 border-t border-ghBorder bg-ghSurface flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#f85149]"></span>
                <span className="text-ghMuted">Pipelines / Bots</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#8957e5]"></span>
                <span className="text-ghMuted">CI Ecosystem</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#238636]"></span>
                <span className="text-ghMuted">Open Source Dev</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#58a6ff] animate-ping"></span>
                <span className="text-ghMuted">Navegante Aleatorio</span>
              </span>
            </div>

            <div className="text-ghSubtleText text-[11px] font-mono">
              Prob. Teletransportación <MathFormula math="1-\alpha" /> = {((1 - dampingAlpha) * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Trending Style Repositories Table */}
      <div className="gh-card">
        <div className="gh-card-header flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Icon name="star" className="w-4 h-4 text-ghOrange" />
            <h3 className="text-sm font-semibold text-ghText">
              Top 15 Repositorios según PageRank (<MathFormula math="\pi_{PR}" />)
            </h3>
          </div>

          <div className="w-64">
            <input
              type="text"
              placeholder="Filtrar repositorios..."
              value={searchRepo}
              onChange={(e) => setSearchRepo(e.target.value)}
              className="w-full bg-ghCanvas border border-ghBorder rounded px-3 py-1 text-xs text-ghText placeholder-ghSubtleText focus:outline-none focus:border-ghBlue"
            />
          </div>
        </div>

        <div className="gh-card-body p-0 overflow-x-auto">
          <table className="gh-table text-xs">
            <thead>
              <tr>
                <th className="w-12 text-center">Rank</th>
                <th>Repositorio (Target Node)</th>
                <th>Categoría / Pipeline</th>
                <th>Actor Principal</th>
                <th className="text-right">PageRank (<MathFormula math="\pi_{PR}" />)</th>
                <th className="text-right">Multiplicador Uniforme</th>
                <th className="text-right">Grado Entrada (<MathFormula math="d_{in}" />)</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepos.map((repo) => (
                <tr key={repo.rank} className="hover:bg-ghSubtle">
                  <td className="font-mono text-center font-bold text-ghMuted">
                    {repo.rank}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Icon name="repo" className="w-3.5 h-3.5 text-ghMuted" />
                      <div>
                        <a
                          href={`https://github.com/${repo.repo}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono font-semibold text-ghBlue hover:underline"
                        >
                          {repo.repo}
                        </a>
                        <p className="text-[11px] text-ghSubtleText">{repo.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="gh-badge gh-badge-default text-[10px]">{repo.category}</span>
                  </td>
                  <td>
                    <span className="font-mono text-ghText text-[11px]">{repo.primaryActor}</span>
                  </td>
                  <td className="font-mono text-right font-bold text-ghGreen">
                    {repo.pagerank.toFixed(6)}
                  </td>
                  <td className="font-mono text-right font-bold text-ghOrange">
                    <span className="gh-badge gh-badge-orange text-[10px]">{repo.uniformRatio}x</span>
                  </td>
                  <td className="font-mono text-right text-ghText">
                    {repo.inDegree}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VISTA 4: EXPLORACIÓN EXTENDIDA DE PAYLOAD & ORGANIZACIONES
// ============================================================================
function PayloadView({ data }) {
  const org = data.ORG_VS_PERSONAL;

  return (
    <div className="space-y-6">
      {/* Upper Grid: Personal vs Orgs Donut & Top Organizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Personal vs Orgs Donut Summary (5 cols) */}
        <div className="lg:col-span-5 gh-card">
          <div className="gh-card-header">
            <div className="flex items-center gap-2">
              <Icon name="user" className="w-4 h-4 text-ghBlue" />
              <h3 className="text-sm font-semibold text-ghText">
                Cuentas Personales vs Organizaciones
              </h3>
            </div>
          </div>

          <div className="gh-card-body space-y-4">
            {/* Visual ratio bar */}
            <div className="w-full bg-[#21262d] rounded-full h-4 overflow-hidden flex">
              <div
                className="bg-ghBlue h-full"
                style={{ width: `${org.personalPct}%` }}
                title={`Cuentas Personales: ${org.personalEvents.toLocaleString()}`}
              ></div>
              <div
                className="bg-ghPurple h-full"
                style={{ width: `${org.orgPct}%` }}
                title={`Organizaciones: ${org.orgEvents.toLocaleString()}`}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-ghCanvas border border-ghBorder rounded">
                <div className="text-xs text-ghMuted mb-1 flex items-center justify-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-ghBlue"></span>
                  <span>Cuentas Personales</span>
                </div>
                <div className="font-mono text-xl font-bold text-ghText">{org.personalEvents.toLocaleString()}</div>
                <div className="text-xs text-ghBlue font-mono">{org.personalPct.toFixed(1)}%</div>
              </div>

              <div className="p-3 bg-ghCanvas border border-ghBorder rounded">
                <div className="text-xs text-ghMuted mb-1 flex items-center justify-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-ghPurple"></span>
                  <span>Organizaciones</span>
                </div>
                <div className="font-mono text-xl font-bold text-ghText">{org.orgEvents.toLocaleString()}</div>
                <div className="text-xs text-ghPurple font-mono">{org.orgPct.toFixed(1)}%</div>
              </div>
            </div>

            <p className="text-xs text-ghMuted">
              La gran mayoría de los eventos son disparados en perfiles individuales o de desarrolladores, mientras que el 17.2% proviene de organizaciones colaborativas formales con múltiples repositorios corporativos.
            </p>
          </div>
        </div>

        {/* Top Organizations Ranking (7 cols) */}
        <div className="lg:col-span-7 gh-card">
          <div className="gh-card-header">
            <div className="flex items-center gap-2">
              <Icon name="layers" className="w-4 h-4 text-ghPurple" />
              <h3 className="text-sm font-semibold text-ghText">
                Top Organizaciones con Mayor Actividad
              </h3>
            </div>
            <span className="text-xs text-ghMuted font-mono">12:00 - 12:59 UTC</span>
          </div>

          <div className="gh-card-body space-y-3">
            {org.topOrgs.map((item, idx) => {
              const width = (item.count / 404) * 100;
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-ghText font-semibold">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-ghSubtleText text-[11px]">{item.type}</span>
                      <span className="text-ghGreen font-bold">{item.count} ev</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#21262d] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-ghPurple rounded-full"
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lower Grid: Payload Action Breakdown & Top Branches in PushEvent */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payload.action Breakdown (6 cols) */}
        <div className="lg:col-span-6 gh-card">
          <div className="gh-card-header">
            <div className="flex items-center gap-2">
              <Icon name="commit" className="w-4 h-4 text-ghGreen" />
              <h3 className="text-sm font-semibold text-ghText">
                Distribución de <span className="font-mono">payload.action</span>
              </h3>
            </div>
          </div>

          <div className="gh-card-body space-y-3">
            {data.PAYLOAD_ACTIONS.map(action => (
              <div key={action.action} className="p-2.5 bg-ghCanvas border border-ghBorder rounded flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-ghText">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: action.color }}></span>
                    <span>{action.action}</span>
                  </div>
                  <p className="text-[11px] text-ghSubtleText mt-0.5">{action.desc}</p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-ghText font-bold text-sm">{action.count.toLocaleString()}</div>
                  <div className="text-xs text-ghMuted">{action.pct.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Git Branches in PushEvent & Issue/PR Metrics (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Branches Card */}
          <div className="gh-card">
            <div className="gh-card-header">
              <div className="flex items-center gap-2">
                <Icon name="branch" className="w-4 h-4 text-ghOrange" />
                <h3 className="text-sm font-semibold text-ghText">
                  Ramas Git de Destino en <span className="font-mono">PushEvent</span> (129,912 eventos)
                </h3>
              </div>
            </div>

            <div className="gh-card-body space-y-2.5">
              {data.TOP_BRANCHES.map(branch => (
                <div key={branch.branch} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-ghText font-semibold flex items-center gap-1.5">
                      <Icon name="branch" className="w-3.5 h-3.5 text-ghMuted" />
                      {branch.branch}
                      {branch.isDefault && (
                        <span className="gh-badge gh-badge-default text-[9px] py-0 px-1">default</span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-ghText font-bold">{branch.count.toLocaleString()}</span>
                      <span className="text-ghMuted">({branch.pct.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#21262d] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-ghGreen rounded-full"
                      style={{ width: `${branch.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issue & PR Stats */}
          <div className="gh-card p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-ghText mb-2">
              <span className="flex items-center gap-2">
                <Icon name="pr" className="w-4 h-4 text-ghPurple" />
                <span>Profundidad de Discusión en Issues & PRs</span>
              </span>
              <span className="gh-badge gh-badge-purple font-mono">2,907 eventos analizados</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-2.5 bg-ghCanvas border border-ghBorder rounded">
                <div className="text-ghMuted mb-0.5">Promedio Comentarios / Issue</div>
                <div className="font-mono text-xl font-bold text-ghOrange">10.0</div>
                <div className="text-[10px] text-ghSubtleText">comentarios por ticket</div>
              </div>
              <div className="p-2.5 bg-ghCanvas border border-ghBorder rounded">
                <div className="text-ghMuted mb-0.5">Tasa de Integración PR (Merged)</div>
                <div className="font-mono text-xl font-bold text-ghGreen">28.8%</div>
                <div className="text-[10px] text-ghSubtleText">1,091 PRs fusionados con éxito</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VISTA 5: CAPÍTULO 6 — MODELOS ARIMA (31 DÍAS DE MARZO 2026, 12:00 UTC)
// ============================================================================
function ArimaView({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const acfChartRef = useRef(null);
  const pacfChartRef = useRef(null);

  // Time series dataset state (allows importing custom CSV/JSON)
  const [dailyData, setDailyData] = useState(data.DAILY_MARCH_2026_SERIES);
  const [forecastHorizon, setForecastHorizon] = useState(7); // 1 to 14 days
  const [selectedModel, setSelectedModel] = useState("ARIMA(1,1,1)");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  // Main Time Series + ARIMA Forecast Chart Initialization
  useEffect(() => {
    if (!chartRef.current || !window.Chart) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Historical Labels and Data
    const isJan = dailyData[0]?.date?.includes('-01-');
    const histLabels = dailyData.map(d => `${d.day} ${isJan ? 'Ene' : 'Mar'} (${d.weekday})`);
    const histValues = dailyData.map(d => d.events);

    // Forecast slice
    const forecastSlice = data.ARIMA_FORECAST_14D.slice(0, forecastHorizon);
    const forecastLabels = forecastSlice.map(d => `${d.day} ${isJan ? 'Feb' : 'Abr'} (${d.weekday})`);
    const forecastValues = forecastSlice.map(d => d.forecast);
    const upperBounds = forecastSlice.map(d => d.upper95);
    const lowerBounds = forecastSlice.map(d => d.lower95);

    const allLabels = [...histLabels, ...forecastLabels];
    
    // Connect historical with forecast line
    const forecastPadded = new Array(dailyData.length - 1).fill(null);
    forecastPadded.push(histValues[histValues.length - 1]);
    const fullForecastLine = [...forecastPadded, ...forecastValues];

    const fullUpper = [...new Array(dailyData.length).fill(null), ...upperBounds];
    const fullLower = [...new Array(dailyData.length).fill(null), ...lowerBounds];

    chartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: allLabels,
        datasets: [
          {
            label: `Serie Observada (${isJan ? 'Enero 2024' : 'Marzo 2026'}, 12:00 UTC)`,
            data: [...histValues, ...new Array(forecastSlice.length).fill(null)],
            borderColor: "#58a6ff",
            backgroundColor: "rgba(88, 166, 255, 0.1)",
            fill: false,
            tension: 0.25,
            borderWidth: 2,
            pointRadius: (ctx) => (dailyData[ctx.dataIndex]?.isMuestra ? 6 : 3),
            pointBackgroundColor: (ctx) => (dailyData[ctx.dataIndex]?.isMuestra ? "#d29922" : "#58a6ff")
          },
          {
            label: `Pronóstico ${selectedModel} (h=${forecastHorizon} días)`,
            data: fullForecastLine,
            borderColor: "#3fb950",
            borderDash: [5, 5],
            borderWidth: 2.2,
            pointRadius: 4,
            pointBackgroundColor: "#3fb950",
            fill: false
          },
          {
            label: "Intervalo de Confianza 95% (Superior)",
            data: fullUpper,
            borderColor: "rgba(63, 185, 80, 0.3)",
            backgroundColor: "rgba(63, 185, 80, 0.12)",
            borderWidth: 1,
            pointRadius: 0,
            fill: '+1' // Fill down to lower bound
          },
          {
            label: "Intervalo de Confianza 95% (Inferior)",
            data: fullLower,
            borderColor: "rgba(63, 185, 80, 0.3)",
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
          legend: {
            display: true,
            labels: { color: "#8b949e", font: { family: 'Inter', size: 12 } }
          },
          tooltip: {
            backgroundColor: "#161b22",
            titleColor: "#c9d1d9",
            bodyColor: "#8b949e",
            borderColor: "#30363d",
            borderWidth: 1,
            padding: 10
          }
        },
        scales: {
          x: {
            grid: { color: "#21262d" },
            ticks: { color: "#8b949e", font: { family: 'JetBrains Mono', size: 10 }, maxTicksLimit: 15 }
          },
          y: {
            grid: { color: "#21262d" },
            ticks: { color: "#8b949e", font: { family: 'JetBrains Mono', size: 10 } }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [dailyData, forecastHorizon, selectedModel, data]);

  // Twin ACF and PACF Charts Initialization
  useEffect(() => {
    if (!acfChartRef.current || !pacfChartRef.current || !window.Chart) return;

    const lags = data.ACF_PACF_DATA.map(d => d.lag);
    const acfVals = data.ACF_PACF_DATA.map(d => d.acf);
    const pacfVals = data.ACF_PACF_DATA.map(d => d.pacf);
    const upperBands = data.ACF_PACF_DATA.map(d => d.band);
    const lowerBands = data.ACF_PACF_DATA.map(d => -d.band);

    const acfCtx = acfChartRef.current.getContext('2d');
    const pacfCtx = pacfChartRef.current.getContext('2d');

    const acfChart = new window.Chart(acfCtx, {
      type: 'bar',
      data: {
        labels: lags,
        datasets: [
          {
            type: 'bar',
            label: "ACF (Autocorrelación)",
            data: acfVals,
            backgroundColor: (ctx) => (ctx.raw > 0.352 || ctx.raw < -0.352 ? "#d29922" : "#58a6ff"),
            barThickness: 6
          },
          {
            type: 'line',
            label: "+1.96/√N (95% CI)",
            data: upperBands,
            borderColor: "rgba(248, 81, 73, 0.7)",
            borderDash: [3, 3],
            borderWidth: 1,
            pointRadius: 0
          },
          {
            type: 'line',
            label: "-1.96/√N (95% CI)",
            data: lowerBands,
            borderColor: "rgba(248, 81, 73, 0.7)",
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
          x: { grid: { color: "#21262d" }, ticks: { color: "#8b949e", font: { family: 'JetBrains Mono', size: 9 } } },
          y: { min: -0.6, max: 1.0, grid: { color: "#21262d" }, ticks: { color: "#8b949e", font: { family: 'JetBrains Mono', size: 9 } } }
        }
      }
    });

    const pacfChart = new window.Chart(pacfCtx, {
      type: 'bar',
      data: {
        labels: lags,
        datasets: [
          {
            type: 'bar',
            label: "PACF (Autocorrelación Parcial)",
            data: pacfVals,
            backgroundColor: (ctx) => (ctx.raw > 0.352 || ctx.raw < -0.352 ? "#bc8cff" : "#3fb950"),
            barThickness: 6
          },
          {
            type: 'line',
            label: "+1.96/√N (95% CI)",
            data: upperBands,
            borderColor: "rgba(248, 81, 73, 0.7)",
            borderDash: [3, 3],
            borderWidth: 1,
            pointRadius: 0
          },
          {
            type: 'line',
            label: "-1.96/√N (95% CI)",
            data: lowerBands,
            borderColor: "rgba(248, 81, 73, 0.7)",
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
          x: { grid: { color: "#21262d" }, ticks: { color: "#8b949e", font: { family: 'JetBrains Mono', size: 9 } } },
          y: { min: -0.6, max: 1.0, grid: { color: "#21262d" }, ticks: { color: "#8b949e", font: { family: 'JetBrains Mono', size: 9 } } }
        }
      }
    });

    return () => {
      acfChart.destroy();
      pacfChart.destroy();
    };
  }, [data]);

  // CSV/JSON File Parser & Importer
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDailyData(parsed);
            setImportStatus({ success: true, message: `¡Se importaron con éxito ${parsed.length} observaciones desde JSON!` });
          } else {
            throw new Error("El JSON debe ser un array de objetos.");
          }
        } else {
          // Parse CSV
          const lines = text.trim().split('\n');
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          const eventColIdx = headers.findIndex(h => h.includes('event') || h.includes('value') || h.includes('total'));
          const dateColIdx = headers.findIndex(h => h.includes('date') || h.includes('dia') || h.includes('day'));

          if (eventColIdx === -1) {
            throw new Error("No se encontró columna 'events' o 'value' en el CSV.");
          }

          const parsedRows = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim());
            if (cols.length >= 2) {
              const val = parseFloat(cols[eventColIdx]);
              const dStr = dateColIdx !== -1 ? cols[dateColIdx] : `2026-03-${i < 10 ? '0' + i : i}`;
              if (!isNaN(val)) {
                parsedRows.push({
                  day: i,
                  date: dStr,
                  weekday: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][(i - 1) % 7],
                  events: val,
                  isWeekend: (i - 1) % 7 === 0 || (i - 1) % 7 === 6
                });
              }
            }
          }

          if (parsedRows.length > 0) {
            setDailyData(parsedRows);
            setImportStatus({ success: true, message: `¡Archivo CSV procesado! ${parsedRows.length} días cargados en el modelo ARIMA.` });
          } else {
            throw new Error("No se pudieron extraer filas numéricas válidas.");
          }
        }
      } catch (err) {
        setImportStatus({ success: false, message: `Error al importar: ${err.message}` });
      }
    };
    reader.readAsText(file);
  };

  const tests = data.STATISTICAL_TESTS;

  return (
    <div className="space-y-6">
      {/* Upper Action Bar: Title, Model Selection & Import Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-ghSurface p-4 rounded-md border border-ghBorder">
        <div className="flex items-center gap-3">
          <Icon name="chart" className="w-5 h-5 text-ghRed" />
          <div>
            <h2 className="text-base font-bold text-ghText">
              Metodología Box-Jenkins: Modelos ARIMA(p,d,q)
            </h2>
            <p className="text-xs text-ghMuted">
              Serie Temporal Diaria de GitHub ({dailyData[0]?.date?.includes('-01-') ? '1 al 31 de Enero de 2024' : '1 al 31 de Marzo de 2026'}, 12:00 UTC)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Model Switcher */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-ghCanvas border border-ghBorder text-xs text-ghText rounded px-2.5 py-1.5 focus:outline-none focus:border-ghBlue font-mono"
          >
            {data.CANDIDATE_MODELS.map(m => (
              <option key={m.model} value={m.model}>
                {m.model} {m.isOptimal ? "★ Óptimo" : ""}
              </option>
            ))}
          </select>

          {/* Import File Button */}
          <button
            onClick={() => setShowImportModal(true)}
            className="gh-btn gh-btn-primary gh-btn-sm"
          >
            <Icon name="upload" className="w-3.5 h-3.5" />
            <span>Importar JSON/CSV</span>
          </button>
        </div>
      </div>

      {/* Main Forecast Chart Card */}
      <div className="gh-card">
        <div className="gh-card-header flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Icon name="activity" className="w-4 h-4 text-ghBlue" />
            <h3 className="text-sm font-semibold text-ghText">
              Trayectoria Observada y Proyección de Demanda Estocástica con Banda de Confianza 95%
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-ghMuted font-mono">
              Horizonte <MathFormula math="h" />: <strong>{forecastHorizon} días</strong>
            </span>
            <input
              type="range"
              min="1"
              max="14"
              value={forecastHorizon}
              onChange={(e) => setForecastHorizon(Number(e.target.value))}
              className="w-24"
            />
          </div>
        </div>

        <div className="gh-card-body">
          <div className="h-72 sm:h-96 w-full">
            <canvas ref={chartRef}></canvas>
          </div>

          <div className="mt-4 pt-3 border-t border-ghBorder grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2 bg-ghCanvas border border-ghBorder rounded">
              <span className="text-ghMuted block text-[11px]">Día Muestra de Investigación:</span>
              <span className="font-mono text-ghOrange font-bold">
                {dailyData.find(d => d.isMuestra)?.day || 15} {dailyData[0]?.date?.includes('-01-') ? 'Ene' : 'Mar'} ({data.GENERAL_METRICS.totalEvents.toLocaleString()} ev)
              </span>
            </div>
            <div className="p-2 bg-ghCanvas border border-ghBorder rounded">
              <span className="text-ghMuted block text-[11px]">Pronóstico Próximo Día (t+1):</span>
              <span className="font-mono text-ghGreen font-bold">
                {data.ARIMA_FORECAST_14D[0].forecast.toLocaleString()} ev [IC: {(data.ARIMA_FORECAST_14D[0].lower95 / 1000).toFixed(0)}k - {(data.ARIMA_FORECAST_14D[0].upper95 / 1000).toFixed(0)}k]
              </span>
            </div>
            <div className="p-2 bg-ghCanvas border border-ghBorder rounded">
              <span className="text-ghMuted block text-[11px]">Error Absoluto Medio (MAE):</span>
              <span className="font-mono text-ghText font-bold">
                {tests.metrics.mae.toLocaleString()} ev ({tests.metrics.mape}% MAPE)
              </span>
            </div>
            <div className="p-2 bg-ghCanvas border border-ghBorder rounded">
              <span className="text-ghMuted block text-[11px]">Raíz Error Cuadrático (RMSE):</span>
              <span className="font-mono text-ghText font-bold">
                {tests.metrics.rmse.toLocaleString()} ev (R² = {tests.metrics.r2})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Formal Statistical Tests (ADF, Ljung-Box, Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Augmented Dickey-Fuller (ADF) Card */}
        <div className="gh-card p-4">
          <div className="flex items-center justify-between text-xs text-ghMuted mb-2">
            <span className="font-semibold text-ghText flex items-center gap-1.5">
              <Icon name="check" className="w-4 h-4 text-ghGreen" />
              Prueba Dickey-Fuller (ADF)
            </span>
            <span className="gh-badge gh-badge-blue text-[10px] font-mono">Raíz Unitaria</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 bg-ghCanvas border border-ghBorder rounded">
              <div className="text-ghMuted text-[11px] mb-0.5">En Niveles <MathFormula math="Y_t" /> (d = 0):</div>
              <div className="flex justify-between">
                <span>Estadístico <MathFormula math="t_\gamma" />: <strong>{tests.adf.levels.statistic}</strong></span>
                <span className="text-ghOrange font-bold">p = {tests.adf.levels.pValue}</span>
              </div>
              <div className="text-[10px] text-ghOrange mt-0.5 font-sans">
                ⚠️ No estacionaria (No se rechaza <MathFormula math="H_0" /> al 5%)
              </div>
            </div>

            <div className="p-2 bg-ghCanvas border border-ghBorder rounded">
              <div className="text-ghMuted text-[11px] mb-0.5">1ra Diferencia <MathFormula math="\Delta Y_t" /> (d = 1):</div>
              <div className="flex justify-between">
                <span>Estadístico <MathFormula math="t_\gamma" />: <strong>{tests.adf.diff1.statistic}</strong></span>
                <span className="text-ghGreen font-bold">p = {tests.adf.diff1.pValue}</span>
              </div>
              <div className="text-[10px] text-ghGreen mt-0.5 font-sans">
                ✓ Estacionaria integrada de orden 1 <MathFormula math="I(1)" />
              </div>
            </div>
          </div>
        </div>

        {/* Ljung-Box White Noise Residual Test */}
        <div className="gh-card p-4">
          <div className="flex items-center justify-between text-xs text-ghMuted mb-2">
            <span className="font-semibold text-ghText flex items-center gap-1.5">
              <Icon name="sparkles" className="w-4 h-4 text-ghPurple" />
              Prueba de Ljung-Box (Residuos)
            </span>
            <span className="gh-badge gh-badge-purple text-[10px] font-mono">Ruido Blanco</span>
          </div>

          <div className="p-2.5 bg-ghCanvas border border-ghBorder rounded text-xs font-mono space-y-1.5">
            <div className="flex justify-between">
              <span className="text-ghMuted">Estadístico <MathFormula math="Q(10)" />:</span>
              <span className="text-ghText font-bold">{tests.ljungBox.qStat}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ghMuted">Grados de Libertad:</span>
              <span className="text-ghText">{tests.ljungBox.df}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ghMuted">p-valor:</span>
              <span className="text-ghGreen font-bold">{tests.ljungBox.pValue}</span>
            </div>
            <div className="pt-1.5 border-t border-ghBorder text-[11px] text-ghGreen font-sans">
              ✓ <MathFormula math="p > 0.05" />: Se valida que los residuos corresponden a Ruido Blanco no correlacionado.
            </div>
          </div>
        </div>

        {/* Box-Jenkins Equation & Criteria */}
        <div className="gh-card p-4">
          <div className="flex items-center justify-between text-xs text-ghMuted mb-2">
            <span className="font-semibold text-ghText flex items-center gap-1.5">
              <Icon name="chart" className="w-4 h-4 text-ghOrange" />
              Ecuación Operacional ARIMA(1,1,1)
            </span>
            <span className="gh-badge gh-badge-green text-[10px] font-mono">AIC 672.4</span>
          </div>

          <div className="p-2.5 bg-ghCanvas border border-ghBorder rounded text-center text-xs font-mono space-y-2">
            <div className="text-ghText py-1">
              <MathFormula math="(1 - \phi_1 B)(1 - B) Y_t = c + (1 + \theta_1 B) \epsilon_t" block={true} />
            </div>
            <div className="text-[11px] text-ghSubtleText font-sans text-left">
              Donde <MathFormula math="\phi_1 = 0.428" /> captura la inercia del día previo y <MathFormula math="\theta_1 = -0.312" /> descuenta la persistencia de anomalías o picos de tráfico.
            </div>
          </div>
        </div>
      </div>

      {/* Twin Diagnostic Charts: ACF & PACF */}
      <div className="gh-card">
        <div className="gh-card-header">
          <div className="flex items-center gap-2">
            <Icon name="chart" className="w-4 h-4 text-ghOrange" />
            <h3 className="text-sm font-semibold text-ghText">
              Diagnóstico de Autocorrelación: Correlogramas ACF y PACF (<MathFormula math="k = 1 \dots 15" /> rezagos)
            </h3>
          </div>
          <span className="text-xs text-ghMuted font-mono">Bandas críticas: ±1.96/√N (±0.352)</span>
        </div>

        <div className="gh-card-body grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-mono font-semibold text-ghText mb-1 flex items-center justify-between">
              <span>ACF: Función de Autocorrelación</span>
              <span className="text-ghOrange text-[11px]">Pico estacional en k=7 (0.742)</span>
            </div>
            <div className="h-44 w-full">
              <canvas ref={acfChartRef}></canvas>
            </div>
          </div>

          <div>
            <div className="text-xs font-mono font-semibold text-ghText mb-1 flex items-center justify-between">
              <span>PACF: Función de Autocorrelación Parcial</span>
              <span className="text-ghGreen text-[11px]">Corte abrupto tras rezago 1 (0.684)</span>
            </div>
            <div className="h-44 w-full">
              <canvas ref={pacfChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>

      {/* Table: Model Candidates Comparison */}
      <div className="gh-card">
        <div className="gh-card-header">
          <div className="flex items-center gap-2">
            <Icon name="commit" className="w-4 h-4 text-ghBlue" />
            <h3 className="text-sm font-semibold text-ghText">
              Comparativa de Modelos Candidatos (Criterios de Información de Akaike & Bayesiano)
            </h3>
          </div>
        </div>

        <div className="gh-card-body p-0 overflow-x-auto">
          <table className="gh-table text-xs font-mono">
            <thead>
              <tr>
                <th>Modelo</th>
                <th className="text-right">AIC</th>
                <th className="text-right">BIC</th>
                <th className="text-right">Log-Verosimilitud</th>
                <th className="text-right">p-valor Ljung-Box</th>
                <th>Diagnóstico Box-Jenkins</th>
              </tr>
            </thead>
            <tbody>
              {data.CANDIDATE_MODELS.map(m => (
                <tr key={m.model} className={m.isOptimal ? "bg-[rgba(46,160,67,0.08)]" : ""}>
                  <td className="font-bold text-ghText flex items-center gap-1.5">
                    {m.model}
                    {m.isOptimal && <span className="gh-badge gh-badge-green text-[9px]">Seleccionado</span>}
                  </td>
                  <td className={`text-right font-bold ${m.isOptimal ? 'text-ghGreen' : 'text-ghText'}`}>
                    {m.aic.toFixed(1)}
                  </td>
                  <td className={`text-right font-bold ${m.isOptimal ? 'text-ghGreen' : 'text-ghText'}`}>
                    {m.bic.toFixed(1)}
                  </td>
                  <td className="text-right text-ghMuted">{m.logLik.toFixed(1)}</td>
                  <td className={`text-right font-bold ${m.pLjungBox > 0.05 ? 'text-ghGreen' : 'text-ghRed'}`}>
                    {m.pLjungBox.toFixed(3)}
                  </td>
                  <td className="font-sans text-[11px] text-ghMuted">{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Epistemological Synthesis: Micro (Markov / PageRank) vs Macro (ARIMA) */}
      <div className="gh-card">
        <div className="gh-card-header">
          <div className="flex items-center gap-2">
            <Icon name="layers" className="w-4 h-4 text-ghPurple" />
            <h3 className="text-sm font-semibold text-ghText">
              Síntesis Epistemológica: Enfoque Microestocástico vs Enfoque Macrotemporal
            </h3>
          </div>
        </div>

        <div className="gh-card-body grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-ghCanvas border border-ghBorder rounded-md">
            <div className="flex items-center gap-2 font-semibold text-ghPurple text-sm mb-2">
              <Icon name="markov" className="w-4 h-4" />
              <span>Nivel Micro: Cadenas de Markov & PageRank</span>
            </div>
            <ul className="space-y-1.5 text-xs text-ghMuted">
              <li>• <strong>Unidad de Análisis:</strong> Transición evento a evento y salto entre repositorios.</li>
              <li>• <strong>Resolución:</strong> Event-driven asíncrono (<MathFormula math="X_{n+1} \mid X_n" />).</li>
              <li>• <strong>Aporte Científico:</strong> Identifica dinámicas latentes de automatización de bots (racha de bifurcaciones 23.8x superior a lo aleatorio) y centralidad de proyectos de infraestructura.</li>
            </ul>
          </div>

          <div className="p-4 bg-ghCanvas border border-ghBorder rounded-md">
            <div className="flex items-center gap-2 font-semibold text-ghBlue text-sm mb-2">
              <Icon name="chart" className="w-4 h-4" />
              <span>Nivel Macro: Modelos ARIMA Box-Jenkins</span>
            </div>
            <ul className="space-y-1.5 text-xs text-ghMuted">
              <li>• <strong>Unidad de Análisis:</strong> Flujo agregado horario y diario (<MathFormula math="Y_t" />).</li>
              <li>• <strong>Resolución:</strong> Temporal equiespaciada continua.</li>
              <li>• <strong>Aporte Científico:</strong> Previsión de demanda de cómputo para la nube de GitHub, dimensionamiento de ancho de banda y bandas de riesgo con Intervalo de Confianza al 95%.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal Importar JSON / CSV */}
      {showImportModal && (
        <div className="gh-modal-backdrop">
          <div className="gh-card w-full max-w-lg mx-4">
            <div className="gh-card-header">
              <div className="flex items-center gap-2">
                <Icon name="upload" className="w-4 h-4 text-ghBlue" />
                <h3 className="text-sm font-semibold text-ghText">
                  Importar Datos Externos (CSV o JSON)
                </h3>
              </div>
              <button
                onClick={() => { setShowImportModal(false); setImportStatus(null); }}
                className="text-ghMuted hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="gh-card-body space-y-4">
              <p className="text-xs text-ghMuted">
                Carga un archivo con las columnas <span className="font-mono text-ghText">date,events</span> o un JSON estructurado para actualizar dinámicamente los 31 días de la serie temporal y reajustar los gráficos en vivo.
              </p>

              {/* Drag and Drop Box */}
              <div className="border-2 border-dashed border-ghBorder hover:border-ghBlue rounded-lg p-6 text-center cursor-pointer bg-ghCanvas transition">
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-file-input"
                />
                <label htmlFor="csv-file-input" className="cursor-pointer block space-y-2">
                  <Icon name="upload" className="w-8 h-8 mx-auto text-ghBlue" />
                  <div className="text-xs font-semibold text-ghText">
                    Haz clic para seleccionar o arrastra un archivo aquí
                  </div>
                  <div className="text-[11px] text-ghSubtleText font-mono">
                    Formatos admitidos: .csv (date,events) o .json
                  </div>
                </label>
              </div>

              {/* Status Message */}
              {importStatus && (
                <div className={`p-3 rounded text-xs font-mono ${importStatus.success ? 'bg-[rgba(46,160,67,0.15)] text-ghGreen border border-ghGreen' : 'bg-[rgba(248,81,73,0.15)] text-ghRed border border-ghRed'}`}>
                  {importStatus.message}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-ghBorder">
                <a
                  href="./sample_gh_archive_january2024.csv"
                  download="sample_gh_archive_january2024.csv"
                  className="gh-btn gh-btn-sm"
                >
                  <Icon name="download" className="w-3.5 h-3.5" />
                  <span>Descargar Plantilla CSV</span>
                </a>

                <button
                  onClick={() => {
                    setDailyData(data.DAILY_MARCH_2026_SERIES);
                    setImportStatus({ success: true, message: "Datos restablecidos a la serie de GitHub Archive (Enero 2024)." });
                  }}
                  className="gh-btn gh-btn-sm"
                >
                  <Icon name="reset" className="w-3.5 h-3.5" />
                  <span>Restablecer Datos Originales</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
function App() {
  const [data, setData] = useState(window.GH_DATA || null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!data) {
      const handleDataLoaded = () => {
        setData(window.GH_DATA);
      };
      window.addEventListener('gh-data-loaded', handleDataLoaded);
      if (window.GH_DATA) setData(window.GH_DATA);
      return () => window.removeEventListener('gh-data-loaded', handleDataLoaded);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ghCanvas text-ghMuted">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-5 w-5 text-ghBlue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-mono text-sm">Cargando base de datos estocástica GH Archive...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ghCanvas text-ghText">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} data={data} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {activeTab === 'overview' && <OverviewView data={data} />}
        {activeTab === 'markov' && <MarkovView data={data} />}
        {activeTab === 'pagerank' && <PageRankView data={data} />}
        {activeTab === 'payload' && <PayloadView data={data} />}
        {activeTab === 'arima' && <ArimaView data={data} />}
      </main>

      <Footer />
    </div>
  );
}

// Render React Application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
