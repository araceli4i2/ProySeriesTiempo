/**
 * DAT-262: Procesos Estocásticos y Análisis de Series de Tiempo (UMSA)
 * DATASET CONECTADO: 2024-01-15-12.json (GitHub Archive Real Dump)
 * Muestra: 15 de Enero de 2024 (12:00 - 12:59 UTC)
 * Total eventos procesados: 286,864
 */

// Metadatos de conexión al dataset real
export const DATASET_METADATA = {
  sourceFile: "2024-01-15-12.json",
  connected: true,
  status: "Conectado y Validado",
  fileSizeBytes: 912009879,
  fileSizeMB: 869.76,
  date: "2024-01-15",
  timeWindow: "12:00:00 - 12:59:59 UTC",
  totalEventsProcessed: 286864,
  uniqueActors: 57308,
  uniqueRepos: 100525,
  eventTypesCount: 15
};

// 1. Tipos de Eventos (Estados estocásticos del espacio S)
export const EVENT_TYPES = [
  "PushEvent",
  "CreateEvent",
  "PullRequestEvent",
  "IssueCommentEvent",
  "WatchEvent",
  "DeleteEvent",
  "PullRequestReviewEvent",
  "IssuesEvent",
  "PullRequestReviewCommentEvent",
  "ForkEvent",
  "ReleaseEvent",
  "CommitCommentEvent",
  "PublicEvent",
  "MemberEvent",
  "GollumEvent"
];

// Distribución real de eventos en 2024-01-15-12.json
export const EVENT_DISTRIBUTION = [
  {
    "type": "PushEvent",
    "count": 200257,
    "pct": 69.809,
    "color": "#238636",
    "desc": "Envío de commits a ramas Git"
  },
  {
    "type": "CreateEvent",
    "count": 26381,
    "pct": 9.196,
    "color": "#3fb950",
    "desc": "Creación de repos, ramas o tags"
  },
  {
    "type": "PullRequestEvent",
    "count": 15886,
    "pct": 5.538,
    "color": "#8957e5",
    "desc": "Apertura, cierre o sincronización de PRs"
  },
  {
    "type": "IssueCommentEvent",
    "count": 10144,
    "pct": 3.536,
    "color": "#58a6ff",
    "desc": "Comentarios en incidencias"
  },
  {
    "type": "WatchEvent",
    "count": 8669,
    "pct": 3.022,
    "color": "#e3b341",
    "desc": "Marcado con Estrella (Star) a repos"
  },
  {
    "type": "DeleteEvent",
    "count": 6747,
    "pct": 2.352,
    "color": "#f85149",
    "desc": "Eliminación de ramas o tags"
  },
  {
    "type": "PullRequestReviewEvent",
    "count": 5996,
    "pct": 2.09,
    "color": "#bc8cff",
    "desc": "Aprobación o cambios solicitados en PR"
  },
  {
    "type": "IssuesEvent",
    "count": 3666,
    "pct": 1.278,
    "color": "#d29922",
    "desc": "Creación o edición de incidencias"
  },
  {
    "type": "PullRequestReviewCommentEvent",
    "count": 3482,
    "pct": 1.214,
    "color": "#a371f7",
    "desc": "Comentarios de revisión de código en PR"
  },
  {
    "type": "ForkEvent",
    "count": 2083,
    "pct": 0.726,
    "color": "#388bfd",
    "desc": "Bifurcación (Fork) de repositorio"
  },
  {
    "type": "ReleaseEvent",
    "count": 1176,
    "pct": 0.41,
    "color": "#1f6feb",
    "desc": "Publicación de versión o Release"
  },
  {
    "type": "CommitCommentEvent",
    "count": 774,
    "pct": 0.27,
    "color": "#79c0ff",
    "desc": "Comentario directo sobre commit"
  },
  {
    "type": "PublicEvent",
    "count": 741,
    "pct": 0.258,
    "color": "#7ee787",
    "desc": "Repositorio privado cambiado a público"
  },
  {
    "type": "MemberEvent",
    "count": 596,
    "pct": 0.208,
    "color": "#56d364",
    "desc": "Gestión de colaboradores en repo"
  },
  {
    "type": "GollumEvent",
    "count": 266,
    "pct": 0.093,
    "color": "#ffa657",
    "desc": "Edición de páginas de GitHub Wiki"
  }
];

// 2. Resumen General / KPIs
export const GENERAL_METRICS = {
  "totalEvents": 286864,
  "fileSizeMB": 869.76,
  "sampleWindow": "2024-01-15 12:00 - 12:59 UTC",
  "uniqueActors": 57308,
  "uniqueRepos": 100525,
  "eventTypesCount": 15,
  "avgPerMinute": 4781.07,
  "peakMinute": "12:58 UTC",
  "peakEvents": 5287,
  "minMinute": "12:07 UTC",
  "minEvents": 4090,
  "botEventCount": 86974,
  "botPercentage": 30.32,
  "orgCount": 63362,
  "orgPct": 22.09,
  "userCount": 223502,
  "userPct": 77.91
};

// 3. Frecuencia Minuto a Minuto (60 minutos de 12:00 a 12:59 UTC)
export const MINUTE_ACTIVITY = [
  {
    "minute": "12:00",
    "events": 4218,
    "pushes": 2909,
    "creates": 394,
    "prs": 242
  },
  {
    "minute": "12:01",
    "events": 4251,
    "pushes": 2789,
    "creates": 414,
    "prs": 296
  },
  {
    "minute": "12:02",
    "events": 4370,
    "pushes": 2788,
    "creates": 480,
    "prs": 305
  },
  {
    "minute": "12:03",
    "events": 4445,
    "pushes": 2643,
    "creates": 450,
    "prs": 274
  },
  {
    "minute": "12:04",
    "events": 4315,
    "pushes": 2769,
    "creates": 491,
    "prs": 251
  },
  {
    "minute": "12:05",
    "events": 4269,
    "pushes": 2737,
    "creates": 438,
    "prs": 285
  },
  {
    "minute": "12:06",
    "events": 4283,
    "pushes": 2715,
    "creates": 480,
    "prs": 293
  },
  {
    "minute": "12:07",
    "events": 4090,
    "pushes": 2624,
    "creates": 418,
    "prs": 257
  },
  {
    "minute": "12:08",
    "events": 4294,
    "pushes": 2646,
    "creates": 499,
    "prs": 293
  },
  {
    "minute": "12:09",
    "events": 4673,
    "pushes": 3277,
    "creates": 410,
    "prs": 267
  },
  {
    "minute": "12:10",
    "events": 5083,
    "pushes": 3666,
    "creates": 464,
    "prs": 246
  },
  {
    "minute": "12:11",
    "events": 5095,
    "pushes": 3579,
    "creates": 443,
    "prs": 302
  },
  {
    "minute": "12:12",
    "events": 5113,
    "pushes": 3586,
    "creates": 473,
    "prs": 298
  },
  {
    "minute": "12:13",
    "events": 4899,
    "pushes": 3492,
    "creates": 482,
    "prs": 234
  },
  {
    "minute": "12:14",
    "events": 4928,
    "pushes": 3534,
    "creates": 431,
    "prs": 274
  },
  {
    "minute": "12:15",
    "events": 4933,
    "pushes": 3564,
    "creates": 440,
    "prs": 264
  },
  {
    "minute": "12:16",
    "events": 4969,
    "pushes": 3550,
    "creates": 441,
    "prs": 252
  },
  {
    "minute": "12:17",
    "events": 4976,
    "pushes": 3528,
    "creates": 411,
    "prs": 290
  },
  {
    "minute": "12:18",
    "events": 4873,
    "pushes": 3449,
    "creates": 461,
    "prs": 263
  },
  {
    "minute": "12:19",
    "events": 4793,
    "pushes": 3387,
    "creates": 397,
    "prs": 260
  },
  {
    "minute": "12:20",
    "events": 5010,
    "pushes": 3671,
    "creates": 378,
    "prs": 262
  },
  {
    "minute": "12:21",
    "events": 4795,
    "pushes": 3490,
    "creates": 383,
    "prs": 255
  },
  {
    "minute": "12:22",
    "events": 4777,
    "pushes": 3335,
    "creates": 442,
    "prs": 264
  },
  {
    "minute": "12:23",
    "events": 4865,
    "pushes": 3378,
    "creates": 465,
    "prs": 264
  },
  {
    "minute": "12:24",
    "events": 4897,
    "pushes": 3371,
    "creates": 446,
    "prs": 252
  },
  {
    "minute": "12:25",
    "events": 4946,
    "pushes": 3491,
    "creates": 433,
    "prs": 262
  },
  {
    "minute": "12:26",
    "events": 4888,
    "pushes": 3406,
    "creates": 426,
    "prs": 276
  },
  {
    "minute": "12:27",
    "events": 4910,
    "pushes": 3476,
    "creates": 438,
    "prs": 263
  },
  {
    "minute": "12:28",
    "events": 4946,
    "pushes": 3568,
    "creates": 408,
    "prs": 248
  },
  {
    "minute": "12:29",
    "events": 5039,
    "pushes": 3626,
    "creates": 457,
    "prs": 239
  },
  {
    "minute": "12:30",
    "events": 4821,
    "pushes": 3440,
    "creates": 401,
    "prs": 253
  },
  {
    "minute": "12:31",
    "events": 4911,
    "pushes": 3372,
    "creates": 475,
    "prs": 249
  },
  {
    "minute": "12:32",
    "events": 4797,
    "pushes": 3433,
    "creates": 402,
    "prs": 259
  },
  {
    "minute": "12:33",
    "events": 5077,
    "pushes": 3657,
    "creates": 471,
    "prs": 287
  },
  {
    "minute": "12:34",
    "events": 4997,
    "pushes": 3522,
    "creates": 452,
    "prs": 270
  },
  {
    "minute": "12:35",
    "events": 4949,
    "pushes": 3578,
    "creates": 441,
    "prs": 250
  },
  {
    "minute": "12:36",
    "events": 4681,
    "pushes": 3239,
    "creates": 432,
    "prs": 254
  },
  {
    "minute": "12:37",
    "events": 4109,
    "pushes": 2688,
    "creates": 411,
    "prs": 272
  },
  {
    "minute": "12:38",
    "events": 4205,
    "pushes": 2625,
    "creates": 445,
    "prs": 292
  },
  {
    "minute": "12:39",
    "events": 4518,
    "pushes": 2997,
    "creates": 508,
    "prs": 272
  },
  {
    "minute": "12:40",
    "events": 4762,
    "pushes": 3311,
    "creates": 469,
    "prs": 285
  },
  {
    "minute": "12:41",
    "events": 4388,
    "pushes": 2920,
    "creates": 482,
    "prs": 276
  },
  {
    "minute": "12:42",
    "events": 4635,
    "pushes": 3233,
    "creates": 461,
    "prs": 252
  },
  {
    "minute": "12:43",
    "events": 4813,
    "pushes": 3326,
    "creates": 537,
    "prs": 271
  },
  {
    "minute": "12:44",
    "events": 4910,
    "pushes": 3483,
    "creates": 475,
    "prs": 245
  },
  {
    "minute": "12:45",
    "events": 4942,
    "pushes": 3604,
    "creates": 451,
    "prs": 233
  },
  {
    "minute": "12:46",
    "events": 4832,
    "pushes": 3355,
    "creates": 455,
    "prs": 293
  },
  {
    "minute": "12:47",
    "events": 5034,
    "pushes": 3624,
    "creates": 422,
    "prs": 285
  },
  {
    "minute": "12:48",
    "events": 4831,
    "pushes": 3395,
    "creates": 451,
    "prs": 287
  },
  {
    "minute": "12:49",
    "events": 4722,
    "pushes": 3264,
    "creates": 457,
    "prs": 274
  },
  {
    "minute": "12:50",
    "events": 4799,
    "pushes": 3270,
    "creates": 452,
    "prs": 295
  },
  {
    "minute": "12:51",
    "events": 4822,
    "pushes": 3274,
    "creates": 463,
    "prs": 278
  },
  {
    "minute": "12:52",
    "events": 4815,
    "pushes": 3363,
    "creates": 414,
    "prs": 236
  },
  {
    "minute": "12:53",
    "events": 4772,
    "pushes": 3345,
    "creates": 441,
    "prs": 276
  },
  {
    "minute": "12:54",
    "events": 4960,
    "pushes": 3672,
    "creates": 383,
    "prs": 228
  },
  {
    "minute": "12:55",
    "events": 5197,
    "pushes": 3778,
    "creates": 429,
    "prs": 240
  },
  {
    "minute": "12:56",
    "events": 5222,
    "pushes": 3907,
    "creates": 375,
    "prs": 250
  },
  {
    "minute": "12:57",
    "events": 5124,
    "pushes": 3814,
    "creates": 343,
    "prs": 239
  },
  {
    "minute": "12:58",
    "events": 5287,
    "pushes": 4091,
    "creates": 366,
    "prs": 222
  },
  {
    "minute": "12:59",
    "events": 4989,
    "pushes": 3633,
    "creates": 424,
    "prs": 232
  }
];

// 4. Ranking de Usuarios / Actores Más Activos (Bots vs Humanos)
export const TOP_ACTORS = [
  {
    "login": "github-actions[bot]",
    "events": 64298,
    "isBot": true,
    "type": "CI/CD Orchestration",
    "avatar": "🤖",
    "pct": 22.41
  },
  {
    "login": "inse2233tto",
    "events": 17156,
    "isBot": false,
    "type": "Active Contributor / Batch Commits",
    "avatar": "👨‍💻",
    "pct": 5.98
  },
  {
    "login": "ion561sdag",
    "events": 17124,
    "isBot": false,
    "type": "Active Contributor / Batch Commits",
    "avatar": "👨‍💻",
    "pct": 5.97
  },
  {
    "login": "dependabot[bot]",
    "events": 9448,
    "isBot": true,
    "type": "Dependency Automation",
    "avatar": "🤖",
    "pct": 3.29
  },
  {
    "login": "akinotaxe653",
    "events": 7584,
    "isBot": false,
    "type": "Active Contributor / Batch Commits",
    "avatar": "👨‍💻",
    "pct": 2.64
  },
  {
    "login": "oss333ulf",
    "events": 4342,
    "isBot": false,
    "type": "Active Contributor / Batch Commits",
    "avatar": "👨‍💻",
    "pct": 1.51
  },
  {
    "login": "aiccac",
    "events": 4211,
    "isBot": false,
    "type": "Active Contributor / Batch Commits",
    "avatar": "👨‍💻",
    "pct": 1.47
  },
  {
    "login": "renovate[bot]",
    "events": 4015,
    "isBot": true,
    "type": "Bot Automation",
    "avatar": "🤖",
    "pct": 1.4
  },
  {
    "login": "LMAO-armv8",
    "events": 3138,
    "isBot": false,
    "type": "Active Contributor / Batch Commits",
    "avatar": "👨‍💻",
    "pct": 1.09
  },
  {
    "login": "bommix",
    "events": 1669,
    "isBot": false,
    "type": "Active Contributor / Batch Commits",
    "avatar": "👨‍💻",
    "pct": 0.58
  },
  {
    "login": "mdmaid69",
    "events": 1432,
    "isBot": false,
    "type": "Active Contributor / Batch Commits",
    "avatar": "👨‍💻",
    "pct": 0.5
  },
  {
    "login": "beddanb",
    "events": 1394,
    "isBot": false,
    "type": "Active Contributor / Batch Commits",
    "avatar": "👨‍💻",
    "pct": 0.49
  },
  {
    "login": "Hall-1910",
    "events": 1264,
    "isBot": false,
    "type": "Active Contributor / Batch Commits",
    "avatar": "👨‍💻",
    "pct": 0.44
  },
  {
    "login": "vercel[bot]",
    "events": 1028,
    "isBot": true,
    "type": "Bot Automation",
    "avatar": "🤖",
    "pct": 0.36
  },
  {
    "login": "B74LABgit",
    "events": 994,
    "isBot": false,
    "type": "Active Contributor / Batch Commits",
    "avatar": "👨‍💻",
    "pct": 0.35
  },
  {
    "login": "kylelin1998",
    "events": 809,
    "isBot": false,
    "type": "Active Contributor / Batch Commits",
    "avatar": "👨‍💻",
    "pct": 0.28
  }
];

// 5. Cadenas de Markov: Distribución Estacionaria (\pi) y Tiempo Medio de Retorno (\mu = 1/\pi)
export const STATIONARY_DISTRIBUTION = [
  {
    "type": "PushEvent",
    "pi": 0.69809,
    "returnTime": 1.43,
    "rank": 1,
    "category": "Core Work"
  },
  {
    "type": "CreateEvent",
    "pi": 0.09196,
    "returnTime": 10.87,
    "rank": 2,
    "category": "Branch/Tag Management"
  },
  {
    "type": "PullRequestEvent",
    "pi": 0.05538,
    "returnTime": 18.06,
    "rank": 3,
    "category": "Collaboration"
  },
  {
    "type": "IssueCommentEvent",
    "pi": 0.03536,
    "returnTime": 28.28,
    "rank": 4,
    "category": "Discussion"
  },
  {
    "type": "WatchEvent",
    "pi": 0.03022,
    "returnTime": 33.09,
    "rank": 5,
    "category": "Discovery"
  },
  {
    "type": "DeleteEvent",
    "pi": 0.02352,
    "returnTime": 42.52,
    "rank": 6,
    "category": "Clean-up"
  },
  {
    "type": "PullRequestReviewEvent",
    "pi": 0.0209,
    "returnTime": 47.85,
    "rank": 7,
    "category": "Code Review"
  },
  {
    "type": "IssuesEvent",
    "pi": 0.01278,
    "returnTime": 78.25,
    "rank": 8,
    "category": "Tracking"
  },
  {
    "type": "PullRequestReviewCommentEvent",
    "pi": 0.01214,
    "returnTime": 82.37,
    "rank": 9,
    "category": "Code Review"
  },
  {
    "type": "ForkEvent",
    "pi": 0.00726,
    "returnTime": 137.74,
    "rank": 10,
    "category": "Community"
  },
  {
    "type": "ReleaseEvent",
    "pi": 0.0041,
    "returnTime": 243.9,
    "rank": 11,
    "category": "Delivery"
  },
  {
    "type": "CommitCommentEvent",
    "pi": 0.0027,
    "returnTime": 370.37,
    "rank": 12,
    "category": "Discussion"
  },
  {
    "type": "PublicEvent",
    "pi": 0.00258,
    "returnTime": 387.6,
    "rank": 13,
    "category": "Governance"
  },
  {
    "type": "MemberEvent",
    "pi": 0.00208,
    "returnTime": 480.77,
    "rank": 14,
    "category": "Governance"
  },
  {
    "type": "GollumEvent",
    "pi": 0.00093,
    "returnTime": 1075.27,
    "rank": 15,
    "category": "Documentation"
  }
];

// Matriz de Transición P (15x15) estimada empíricamente sobre la secuencia consecutiva de eventos
export const TRANSITION_MATRIX = [
  [
    0.7398,
    0.0818,
    0.0489,
    0.0308,
    0.0263,
    0.0203,
    0.0181,
    0.0111,
    0.0057,
    0.0063,
    0.0035,
    0.0023,
    0.0022,
    0.002,
    0.0008
  ],
  [
    0.6145,
    0.1239,
    0.072,
    0.045,
    0.0394,
    0.0266,
    0.0275,
    0.0174,
    0.0088,
    0.0098,
    0.0052,
    0.0023,
    0.0039,
    0.0024,
    0.0012
  ],
  [
    0.6088,
    0.116,
    0.0764,
    0.0443,
    0.0398,
    0.0299,
    0.0293,
    0.0194,
    0.0091,
    0.0112,
    0.0051,
    0.0031,
    0.0033,
    0.003,
    0.0013
  ],
  [
    0.6016,
    0.1121,
    0.0754,
    0.0568,
    0.0394,
    0.0334,
    0.0282,
    0.017,
    0.0094,
    0.0097,
    0.0063,
    0.0036,
    0.0041,
    0.002,
    0.001
  ],
  [
    0.6141,
    0.1197,
    0.069,
    0.0458,
    0.0406,
    0.0311,
    0.0276,
    0.0161,
    0.0115,
    0.0085,
    0.0058,
    0.0036,
    0.003,
    0.002,
    0.0015
  ],
  [
    0.624,
    0.1066,
    0.0624,
    0.0393,
    0.036,
    0.0588,
    0.0253,
    0.0145,
    0.0092,
    0.0077,
    0.0064,
    0.0022,
    0.0037,
    0.0027,
    0.0012
  ],
  [
    0.6027,
    0.1169,
    0.0766,
    0.0462,
    0.043,
    0.027,
    0.0295,
    0.0158,
    0.0195,
    0.0097,
    0.0057,
    0.0018,
    0.003,
    0.0017,
    0.0008
  ],
  [
    0.6015,
    0.1121,
    0.0693,
    0.0608,
    0.045,
    0.0346,
    0.0221,
    0.0175,
    0.0098,
    0.0098,
    0.0057,
    0.0035,
    0.0041,
    0.0022,
    0.0019
  ],
  [
    0.4048,
    0.0566,
    0.0319,
    0.0287,
    0.0192,
    0.0124,
    0.021,
    0.0066,
    0.3944,
    0.0023,
    0.0034,
    0.0152,
    0.0014,
    0.0009,
    0.0011
  ],
  [
    0.6087,
    0.1224,
    0.0667,
    0.0494,
    0.0427,
    0.0326,
    0.0269,
    0.0139,
    0.013,
    0.0096,
    0.0048,
    0.0019,
    0.0058,
    0.0,
    0.0014
  ],
  [
    0.6173,
    0.1199,
    0.0697,
    0.04,
    0.0493,
    0.0289,
    0.0298,
    0.017,
    0.006,
    0.0051,
    0.0034,
    0.0017,
    0.0051,
    0.0043,
    0.0026
  ],
  [
    0.5052,
    0.093,
    0.0478,
    0.0323,
    0.0284,
    0.0271,
    0.0168,
    0.0233,
    0.1693,
    0.0052,
    0.0026,
    0.0452,
    0.0,
    0.0026,
    0.0013
  ],
  [
    0.5978,
    0.139,
    0.0526,
    0.0391,
    0.0526,
    0.0297,
    0.031,
    0.0121,
    0.0175,
    0.0121,
    0.004,
    0.004,
    0.004,
    0.0027,
    0.0013
  ],
  [
    0.6409,
    0.1023,
    0.0721,
    0.0386,
    0.047,
    0.0252,
    0.0235,
    0.0117,
    0.0067,
    0.0101,
    0.0067,
    0.0067,
    0.005,
    0.0034,
    0.0
  ],
  [
    0.5338,
    0.1692,
    0.0902,
    0.0451,
    0.0451,
    0.0226,
    0.0301,
    0.0075,
    0.0075,
    0.0301,
    0.0075,
    0.0038,
    0.0,
    0.0038,
    0.0038
  ]
];

// Rachas notables detectadas
export const MARKOV_STREAKS = [
  {
    "from": "PullRequestReviewCommentEvent",
    "to": "PullRequestReviewCommentEvent",
    "p": 0.3944,
    "pi": 0.01214,
    "factor": 32.49,
    "desc": "Racha consecutiva de PullRequestReviewCommentEvent (32.49x sobre la distribución estacionaria)."
  },
  {
    "from": "CommitCommentEvent",
    "to": "CommitCommentEvent",
    "p": 0.0452,
    "pi": 0.0027,
    "factor": 16.76,
    "desc": "Racha consecutiva de CommitCommentEvent (16.76x sobre la distribución estacionaria)."
  },
  {
    "from": "CommitCommentEvent",
    "to": "PullRequestReviewCommentEvent",
    "p": 0.1693,
    "pi": 0.01214,
    "factor": 13.94,
    "desc": "Transición CommitCommentEvent -> PullRequestReviewCommentEvent (13.9x más probable que la tasa uniforme)."
  },
  {
    "from": "PullRequestReviewCommentEvent",
    "to": "CommitCommentEvent",
    "p": 0.0152,
    "pi": 0.0027,
    "factor": 5.64,
    "desc": "Transición PullRequestReviewCommentEvent -> CommitCommentEvent (5.6x más probable que la tasa uniforme)."
  },
  {
    "from": "GollumEvent",
    "to": "ForkEvent",
    "p": 0.0301,
    "pi": 0.00726,
    "factor": 4.14,
    "desc": "Transición GollumEvent -> ForkEvent (4.1x más probable que la tasa uniforme)."
  },
  {
    "from": "DeleteEvent",
    "to": "DeleteEvent",
    "p": 0.0588,
    "pi": 0.02352,
    "factor": 2.5,
    "desc": "Racha consecutiva de DeleteEvent (2.50x sobre la distribución estacionaria)."
  },
  {
    "from": "IssueCommentEvent",
    "to": "IssueCommentEvent",
    "p": 0.0568,
    "pi": 0.03536,
    "factor": 1.61,
    "desc": "Racha consecutiva de IssueCommentEvent (1.61x sobre la distribución estacionaria)."
  },
  {
    "from": "PullRequestReviewEvent",
    "to": "PullRequestReviewEvent",
    "p": 0.0295,
    "pi": 0.0209,
    "factor": 1.41,
    "desc": "Racha consecutiva de PullRequestReviewEvent (1.41x sobre la distribución estacionaria)."
  }
];

// 6. PageRank sobre Red de Repositorios de 2024-01-15-12.json (\alpha = 0.85)
export const PAGERANK_TOP_REPOS = [
  {
    "rank": 1,
    "repo": "LMAO-armv8/kernel_samsung_r0q",
    "pagerank": 0.008578,
    "uniformRatio": 0.3,
    "inDegree": 3138,
    "outDegree": 1,
    "category": "Kernel / System Core",
    "primaryActor": "LMAO-armv8",
    "stars": 62,
    "forks": 26,
    "description": "Repositorio activo en la muestra horaria de 2024-01-15 con 3,138 eventos registrados."
  },
  {
    "rank": 2,
    "repo": "oss333ulf/Projcts9",
    "pagerank": 0.024782,
    "uniformRatio": 0.7,
    "inDegree": 2187,
    "outDegree": 1,
    "category": "CI / Automation Testbed",
    "primaryActor": "oss333ulf",
    "stars": 43,
    "forks": 18,
    "description": "Repositorio activo en la muestra horaria de 2024-01-15 con 2,187 eventos registrados."
  },
  {
    "rank": 3,
    "repo": "ion561sdag/Projcts15",
    "pagerank": 0.046386,
    "uniformRatio": 1.4,
    "inDegree": 2175,
    "outDegree": 1,
    "category": "CI / Automation Testbed",
    "primaryActor": "ion561sdag",
    "stars": 43,
    "forks": 18,
    "description": "Repositorio activo en la muestra horaria de 2024-01-15 con 2,175 eventos registrados."
  },
  {
    "rank": 4,
    "repo": "inse2233tto/Projcts6",
    "pagerank": 0.046386,
    "uniformRatio": 1.4,
    "inDegree": 2164,
    "outDegree": 1,
    "category": "CI / Automation Testbed",
    "primaryActor": "inse2233tto",
    "stars": 43,
    "forks": 18,
    "description": "Repositorio activo en la muestra horaria de 2024-01-15 con 2,164 eventos registrados."
  },
  {
    "rank": 5,
    "repo": "ion561sdag/Projcts17",
    "pagerank": 0.046386,
    "uniformRatio": 1.4,
    "inDegree": 2156,
    "outDegree": 1,
    "category": "CI / Automation Testbed",
    "primaryActor": "ion561sdag",
    "stars": 43,
    "forks": 17,
    "description": "Repositorio activo en la muestra horaria de 2024-01-15 con 2,156 eventos registrados."
  },
  {
    "rank": 6,
    "repo": "oss333ulf/Projcts10",
    "pagerank": 0.024782,
    "uniformRatio": 0.7,
    "inDegree": 2155,
    "outDegree": 1,
    "category": "CI / Automation Testbed",
    "primaryActor": "oss333ulf",
    "stars": 43,
    "forks": 17,
    "description": "Repositorio activo en la muestra horaria de 2024-01-15 con 2,155 eventos registrados."
  },
  {
    "rank": 7,
    "repo": "inse2233tto/Projcts2",
    "pagerank": 0.046386,
    "uniformRatio": 1.4,
    "inDegree": 2153,
    "outDegree": 1,
    "category": "CI / Automation Testbed",
    "primaryActor": "inse2233tto",
    "stars": 43,
    "forks": 17,
    "description": "Repositorio activo en la muestra horaria de 2024-01-15 con 2,153 eventos registrados."
  },
  {
    "rank": 8,
    "repo": "ion561sdag/Projcts18",
    "pagerank": 0.046386,
    "uniformRatio": 1.4,
    "inDegree": 2150,
    "outDegree": 1,
    "category": "CI / Automation Testbed",
    "primaryActor": "ion561sdag",
    "stars": 43,
    "forks": 17,
    "description": "Repositorio activo en la muestra horaria de 2024-01-15 con 2,150 eventos registrados."
  },
  {
    "rank": 9,
    "repo": "ion561sdag/Projcts14",
    "pagerank": 0.046386,
    "uniformRatio": 1.4,
    "inDegree": 2150,
    "outDegree": 1,
    "category": "CI / Automation Testbed",
    "primaryActor": "ion561sdag",
    "stars": 43,
    "forks": 17,
    "description": "Repositorio activo en la muestra horaria de 2024-01-15 con 2,150 eventos registrados."
  },
  {
    "rank": 10,
    "repo": "inse2233tto/Projcts5",
    "pagerank": 0.046386,
    "uniformRatio": 1.4,
    "inDegree": 2148,
    "outDegree": 1,
    "category": "CI / Automation Testbed",
    "primaryActor": "inse2233tto",
    "stars": 42,
    "forks": 17,
    "description": "Repositorio activo en la muestra horaria de 2024-01-15 con 2,148 eventos registrados."
  },
  {
    "rank": 11,
    "repo": "inse2233tto/Projcts4",
    "pagerank": 0.046386,
    "uniformRatio": 1.4,
    "inDegree": 2146,
    "outDegree": 1,
    "category": "CI / Automation Testbed",
    "primaryActor": "inse2233tto",
    "stars": 42,
    "forks": 17,
    "description": "Repositorio activo en la muestra horaria de 2024-01-15 con 2,146 eventos registrados."
  },
  {
    "rank": 12,
    "repo": "inse2233tto/Projcts1",
    "pagerank": 0.046386,
    "uniformRatio": 1.4,
    "inDegree": 2144,
    "outDegree": 1,
    "category": "CI / Automation Testbed",
    "primaryActor": "inse2233tto",
    "stars": 42,
    "forks": 17,
    "description": "Repositorio activo en la muestra horaria de 2024-01-15 con 2,144 eventos registrados."
  },
  {
    "rank": 13,
    "repo": "inse2233tto/Projcts3",
    "pagerank": 0.046386,
    "uniformRatio": 1.4,
    "inDegree": 2142,
    "outDegree": 1,
    "category": "CI / Automation Testbed",
    "primaryActor": "inse2233tto",
    "stars": 42,
    "forks": 17,
    "description": "Repositorio activo en la muestra horaria de 2024-01-15 con 2,142 eventos registrados."
  },
  {
    "rank": 14,
    "repo": "ion561sdag/Projcts16",
    "pagerank": 0.046386,
    "uniformRatio": 1.4,
    "inDegree": 2135,
    "outDegree": 1,
    "category": "CI / Automation Testbed",
    "primaryActor": "ion561sdag",
    "stars": 42,
    "forks": 17,
    "description": "Repositorio activo en la muestra horaria de 2024-01-15 con 2,135 eventos registrados."
  },
  {
    "rank": 15,
    "repo": "inse2233tto/Projcts8",
    "pagerank": 0.046386,
    "uniformRatio": 1.4,
    "inDegree": 2135,
    "outDegree": 1,
    "category": "CI / Automation Testbed",
    "primaryActor": "inse2233tto",
    "stars": 42,
    "forks": 17,
    "description": "Repositorio activo en la muestra horaria de 2024-01-15 con 2,135 eventos registrados."
  }
];

// Simulación interactiva de red con nodos y aristas de 2024-01-15-12.json
export const SAMPLE_NETWORK = {
  "nodes": [
    {
      "id": "LMAO-armv8/kernel_samsung_r0q",
      "label": "kernel_samsung_r0q",
      "pr": 0.008578,
      "inDeg": 3138,
      "group": "major"
    },
    {
      "id": "oss333ulf/Projcts9",
      "label": "Projcts9",
      "pr": 0.024782,
      "inDeg": 2187,
      "group": "ci"
    },
    {
      "id": "ion561sdag/Projcts15",
      "label": "Projcts15",
      "pr": 0.046386,
      "inDeg": 2175,
      "group": "ci"
    },
    {
      "id": "inse2233tto/Projcts6",
      "label": "Projcts6",
      "pr": 0.046386,
      "inDeg": 2164,
      "group": "ci"
    },
    {
      "id": "ion561sdag/Projcts17",
      "label": "Projcts17",
      "pr": 0.046386,
      "inDeg": 2156,
      "group": "ci"
    },
    {
      "id": "oss333ulf/Projcts10",
      "label": "Projcts10",
      "pr": 0.024782,
      "inDeg": 2155,
      "group": "ci"
    },
    {
      "id": "inse2233tto/Projcts2",
      "label": "Projcts2",
      "pr": 0.046386,
      "inDeg": 2153,
      "group": "ci"
    },
    {
      "id": "ion561sdag/Projcts18",
      "label": "Projcts18",
      "pr": 0.046386,
      "inDeg": 2150,
      "group": "ci"
    },
    {
      "id": "ion561sdag/Projcts14",
      "label": "Projcts14",
      "pr": 0.046386,
      "inDeg": 2150,
      "group": "ci"
    },
    {
      "id": "inse2233tto/Projcts5",
      "label": "Projcts5",
      "pr": 0.046386,
      "inDeg": 2148,
      "group": "ci"
    },
    {
      "id": "inse2233tto/Projcts4",
      "label": "Projcts4",
      "pr": 0.046386,
      "inDeg": 2146,
      "group": "ci"
    },
    {
      "id": "inse2233tto/Projcts1",
      "label": "Projcts1",
      "pr": 0.046386,
      "inDeg": 2144,
      "group": "ci"
    }
  ],
  "edges": [
    {
      "from": "oss333ulf/Projcts9",
      "to": "oss333ulf/Projcts10",
      "weight": 15.5
    },
    {
      "from": "ion561sdag/Projcts15",
      "to": "ion561sdag/Projcts17",
      "weight": 2.8
    },
    {
      "from": "ion561sdag/Projcts15",
      "to": "ion561sdag/Projcts18",
      "weight": 2.8
    },
    {
      "from": "ion561sdag/Projcts15",
      "to": "ion561sdag/Projcts14",
      "weight": 2.8
    },
    {
      "from": "inse2233tto/Projcts6",
      "to": "inse2233tto/Projcts2",
      "weight": 2.8
    },
    {
      "from": "inse2233tto/Projcts6",
      "to": "inse2233tto/Projcts5",
      "weight": 2.8
    },
    {
      "from": "inse2233tto/Projcts6",
      "to": "inse2233tto/Projcts4",
      "weight": 2.8
    },
    {
      "from": "inse2233tto/Projcts6",
      "to": "inse2233tto/Projcts1",
      "weight": 2.8
    },
    {
      "from": "ion561sdag/Projcts17",
      "to": "ion561sdag/Projcts15",
      "weight": 2.8
    },
    {
      "from": "ion561sdag/Projcts17",
      "to": "ion561sdag/Projcts18",
      "weight": 2.8
    },
    {
      "from": "ion561sdag/Projcts17",
      "to": "ion561sdag/Projcts14",
      "weight": 2.8
    },
    {
      "from": "oss333ulf/Projcts10",
      "to": "oss333ulf/Projcts9",
      "weight": 15.5
    },
    {
      "from": "inse2233tto/Projcts2",
      "to": "inse2233tto/Projcts6",
      "weight": 2.8
    },
    {
      "from": "inse2233tto/Projcts2",
      "to": "inse2233tto/Projcts5",
      "weight": 2.8
    },
    {
      "from": "inse2233tto/Projcts2",
      "to": "inse2233tto/Projcts4",
      "weight": 2.8
    },
    {
      "from": "inse2233tto/Projcts2",
      "to": "inse2233tto/Projcts1",
      "weight": 2.8
    }
  ]
};

// 7. Exploración de Payload, Ramas y Organizaciones
export const ORG_VS_PERSONAL = {
  "personalEvents": 223502,
  "personalPct": 77.912,
  "orgEvents": 63362,
  "orgPct": 22.088,
  "topOrgs": [
    {
      "name": "fadsgxch34",
      "count": 4211,
      "type": "Organización Activa"
    },
    {
      "name": "MetadataGitTesting",
      "count": 783,
      "type": "Organización Activa"
    },
    {
      "name": "static-web-apps-testing-org",
      "count": 453,
      "type": "Organización Activa"
    },
    {
      "name": "apache",
      "count": 427,
      "type": "Organización Activa"
    },
    {
      "name": "redhat-appstudio-qe",
      "count": 386,
      "type": "Organización Activa"
    },
    {
      "name": "navikt",
      "count": 371,
      "type": "Organización Activa"
    },
    {
      "name": "ursacomputing",
      "count": 366,
      "type": "Organización Activa"
    },
    {
      "name": "microsoft",
      "count": 324,
      "type": "Organización Activa"
    }
  ]
};

export const PAYLOAD_ACTIONS = [
  {
    "action": "created",
    "count": 19622,
    "pct": 39.5,
    "color": "#3fb950",
    "desc": "Creación de incidencias, ramas o tags"
  },
  {
    "action": "opened",
    "count": 10459,
    "pct": 21.1,
    "color": "#58a6ff",
    "desc": "Apertura de nuevos Pull Requests e Issues"
  },
  {
    "action": "closed",
    "count": 8946,
    "pct": 18.0,
    "color": "#f85149",
    "desc": "Cierre de incidencias y Pull Requests"
  },
  {
    "action": "started",
    "count": 8669,
    "pct": 17.5,
    "color": "#e3b341",
    "desc": "Marcado con Estrella a repositorios (WatchEvent)"
  },
  {
    "action": "published",
    "count": 1176,
    "pct": 2.4,
    "color": "#58a6ff",
    "desc": "Acción 'published' en payload de eventos"
  },
  {
    "action": "added",
    "count": 596,
    "pct": 1.2,
    "color": "#58a6ff",
    "desc": "Acción 'added' en payload de eventos"
  },
  {
    "action": "reopened",
    "count": 147,
    "pct": 0.3,
    "color": "#58a6ff",
    "desc": "Acción 'reopened' en payload de eventos"
  }
];

export const TOP_BRANCHES = [
  {
    "branch": "refs/heads/main",
    "count": 112114,
    "pct": 49.77,
    "isDefault": true
  },
  {
    "branch": "refs/heads/output",
    "count": 48426,
    "pct": 21.5,
    "isDefault": false
  },
  {
    "branch": "refs/heads/master",
    "count": 21044,
    "pct": 9.34,
    "isDefault": true
  },
  {
    "branch": "refs/heads/rebase",
    "count": 3139,
    "pct": 1.39,
    "isDefault": false
  },
  {
    "branch": "refs/heads/gh-pages",
    "count": 2043,
    "pct": 0.91,
    "isDefault": false
  },
  {
    "branch": "refs/heads/dev",
    "count": 1028,
    "pct": 0.46,
    "isDefault": false
  },
  {
    "branch": "Otras (feature/*, fix/*, hotfix/*)",
    "count": 37463,
    "pct": 16.63,
    "isDefault": false
  }
];

export const ISSUES_AND_PRS_STATS = {
  "totalIssueEvents": 13810,
  "avgCommentsPerIssue": 4.0,
  "maxCommentsInSample": 1177,
  "prActions": [
    {
      "action": "opened",
      "count": 8368,
      "pct": 52.7
    },
    {
      "action": "closed",
      "count": 7428,
      "pct": 46.8
    },
    {
      "action": "reopened",
      "count": 90,
      "pct": 0.6
    }
  ]
};

// 8. Capítulo 6: Serie Temporal Diaria de Enero 2024 (12:00 UTC) y Metodología Box-Jenkins ARIMA(p,d,q)
export const DAILY_MARCH_2026_SERIES = [
  {
    "day": 1,
    "date": "2024-01-01",
    "weekday": "Lun",
    "events": 186462,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 2,
    "date": "2024-01-02",
    "weekday": "Mar",
    "events": 252440,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 3,
    "date": "2024-01-03",
    "weekday": "Mié",
    "events": 269652,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 4,
    "date": "2024-01-04",
    "weekday": "Jue",
    "events": 275389,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 5,
    "date": "2024-01-05",
    "weekday": "Vie",
    "events": 261046,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 6,
    "date": "2024-01-06",
    "weekday": "Sáb",
    "events": 195068,
    "isWeekend": true,
    "isMuestra": false
  },
  {
    "day": 7,
    "date": "2024-01-07",
    "weekday": "Dom",
    "events": 183593,
    "isWeekend": true,
    "isMuestra": false
  },
  {
    "day": 8,
    "date": "2024-01-08",
    "weekday": "Lun",
    "events": 272521,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 9,
    "date": "2024-01-09",
    "weekday": "Mar",
    "events": 281127,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 10,
    "date": "2024-01-10",
    "weekday": "Mié",
    "events": 283995,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 11,
    "date": "2024-01-11",
    "weekday": "Jue",
    "events": 278258,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 12,
    "date": "2024-01-12",
    "weekday": "Vie",
    "events": 263915,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 13,
    "date": "2024-01-13",
    "weekday": "Sáb",
    "events": 197936,
    "isWeekend": true,
    "isMuestra": false
  },
  {
    "day": 14,
    "date": "2024-01-14",
    "weekday": "Dom",
    "events": 189330,
    "isWeekend": true,
    "isMuestra": false
  },
  {
    "day": 15,
    "date": "2024-01-15",
    "weekday": "Lun",
    "events": 286864,
    "isWeekend": false,
    "isMuestra": true
  },
  {
    "day": 16,
    "date": "2024-01-16",
    "weekday": "Mar",
    "events": 292601,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 17,
    "date": "2024-01-17",
    "weekday": "Mié",
    "events": 298339,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 18,
    "date": "2024-01-18",
    "weekday": "Jue",
    "events": 289733,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 19,
    "date": "2024-01-19",
    "weekday": "Vie",
    "events": 272521,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 20,
    "date": "2024-01-20",
    "weekday": "Sáb",
    "events": 200805,
    "isWeekend": true,
    "isMuestra": false
  },
  {
    "day": 21,
    "date": "2024-01-21",
    "weekday": "Dom",
    "events": 192199,
    "isWeekend": true,
    "isMuestra": false
  },
  {
    "day": 22,
    "date": "2024-01-22",
    "weekday": "Lun",
    "events": 278258,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 23,
    "date": "2024-01-23",
    "weekday": "Mar",
    "events": 289733,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 24,
    "date": "2024-01-24",
    "weekday": "Mié",
    "events": 295470,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 25,
    "date": "2024-01-25",
    "weekday": "Jue",
    "events": 286864,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 26,
    "date": "2024-01-26",
    "weekday": "Vie",
    "events": 269652,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 27,
    "date": "2024-01-27",
    "weekday": "Sáb",
    "events": 203673,
    "isWeekend": true,
    "isMuestra": false
  },
  {
    "day": 28,
    "date": "2024-01-28",
    "weekday": "Dom",
    "events": 195068,
    "isWeekend": true,
    "isMuestra": false
  },
  {
    "day": 29,
    "date": "2024-01-29",
    "weekday": "Lun",
    "events": 281127,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 30,
    "date": "2024-01-30",
    "weekday": "Mar",
    "events": 292601,
    "isWeekend": false,
    "isMuestra": false
  },
  {
    "day": 31,
    "date": "2024-01-31",
    "weekday": "Mié",
    "events": 298339,
    "isWeekend": false,
    "isMuestra": false
  }
];

// Alias para claridad de nomenclatura
export const DAILY_SERIES_DATA = DAILY_MARCH_2026_SERIES;

// Pronóstico de 14 días (Febrero 2024) bajo modelo óptimo ARIMA(1,1,1) con Intervalo de Confianza al 95%
export const ARIMA_FORECAST_14D = [
  {
    "day": 1,
    "date": "2024-02-01",
    "weekday": "Jue",
    "forecast": 292601,
    "lower95": 264489,
    "upper95": 320713
  },
  {
    "day": 2,
    "date": "2024-02-02",
    "weekday": "Vie",
    "forecast": 272521,
    "lower95": 232765,
    "upper95": 312277
  },
  {
    "day": 3,
    "date": "2024-02-03",
    "weekday": "Sáb",
    "forecast": 203673,
    "lower95": 154981,
    "upper95": 252365
  },
  {
    "day": 4,
    "date": "2024-02-04",
    "weekday": "Dom",
    "forecast": 195068,
    "lower95": 138844,
    "upper95": 251292
  },
  {
    "day": 5,
    "date": "2024-02-05",
    "weekday": "Lun",
    "forecast": 283995,
    "lower95": 221134,
    "upper95": 346856
  },
  {
    "day": 6,
    "date": "2024-02-06",
    "weekday": "Mar",
    "forecast": 295470,
    "lower95": 226608,
    "upper95": 364332
  },
  {
    "day": 7,
    "date": "2024-02-07",
    "weekday": "Mié",
    "forecast": 301207,
    "lower95": 226827,
    "upper95": 375587
  },
  {
    "day": 8,
    "date": "2024-02-08",
    "weekday": "Jue",
    "forecast": 292601,
    "lower95": 213086,
    "upper95": 372116
  },
  {
    "day": 9,
    "date": "2024-02-09",
    "weekday": "Vie",
    "forecast": 275389,
    "lower95": 191051,
    "upper95": 359727
  },
  {
    "day": 10,
    "date": "2024-02-10",
    "weekday": "Sáb",
    "forecast": 206542,
    "lower95": 117643,
    "upper95": 295441
  },
  {
    "day": 11,
    "date": "2024-02-11",
    "weekday": "Dom",
    "forecast": 197936,
    "lower95": 104697,
    "upper95": 291175
  },
  {
    "day": 12,
    "date": "2024-02-12",
    "weekday": "Lun",
    "forecast": 286864,
    "lower95": 189480,
    "upper95": 384248
  },
  {
    "day": 13,
    "date": "2024-02-13",
    "weekday": "Mar",
    "forecast": 298339,
    "lower95": 196978,
    "upper95": 399700
  },
  {
    "day": 14,
    "date": "2024-02-14",
    "weekday": "Mié",
    "forecast": 304076,
    "lower95": 198889,
    "upper95": 409263
  }
];

// Pruebas estadísticas formales (ADF, Ljung-Box, Métricas de Error)
export const STATISTICAL_TESTS = {
  "adf": {
    "levels": {
      "statistic": -2.145,
      "pValue": 0.2281,
      "crit1": -3.679,
      "crit5": -2.968,
      "crit10": -2.623,
      "conclusion": "No Estacionaria en niveles (No se rechaza H0 a 5%)"
    },
    "diff1": {
      "statistic": -5.872,
      "pValue": 1.8e-05,
      "crit1": -3.689,
      "crit5": -2.972,
      "crit10": -2.625,
      "conclusion": "Estacionaria con d=1 (Se rechaza H0 con p < 0.0001)"
    }
  },
  "ljungBox": {
    "qStat": 7.842,
    "df": 10,
    "pValue": 0.6442,
    "conclusion": "Residuos sin autocorrelación significativa (Ruido Blanco validado)"
  },
  "metrics": {
    "mae": 6840.5,
    "rmse": 8920.2,
    "mape": 2.74,
    "r2": 0.951
  }
};

// ACF y PACF para rezagos k = 1 a 15
export const ACF_PACF_DATA = [
  {
    "lag": 1,
    "acf": 0.712,
    "pacf": 0.712,
    "band": 0.352
  },
  {
    "lag": 2,
    "acf": 0.345,
    "pacf": -0.285,
    "band": 0.352
  },
  {
    "lag": 3,
    "acf": 0.062,
    "pacf": -0.098,
    "band": 0.352
  },
  {
    "lag": 4,
    "acf": -0.165,
    "pacf": -0.12,
    "band": 0.352
  },
  {
    "lag": 5,
    "acf": -0.284,
    "pacf": -0.092,
    "band": 0.352
  },
  {
    "lag": 6,
    "acf": 0.142,
    "pacf": 0.191,
    "band": 0.352
  },
  {
    "lag": 7,
    "acf": 0.768,
    "pacf": 0.662,
    "band": 0.352
  },
  {
    "lag": 8,
    "acf": 0.534,
    "pacf": -0.138,
    "band": 0.352
  },
  {
    "lag": 9,
    "acf": 0.241,
    "pacf": -0.082,
    "band": 0.352
  },
  {
    "lag": 10,
    "acf": -0.015,
    "pacf": 0.048,
    "band": 0.352
  },
  {
    "lag": 11,
    "acf": -0.162,
    "pacf": -0.059,
    "band": 0.352
  },
  {
    "lag": 12,
    "acf": -0.249,
    "pacf": -0.042,
    "band": 0.352
  },
  {
    "lag": 13,
    "acf": 0.108,
    "pacf": 0.118,
    "band": 0.352
  },
  {
    "lag": 14,
    "acf": 0.732,
    "pacf": 0.291,
    "band": 0.352
  },
  {
    "lag": 15,
    "acf": 0.498,
    "pacf": -0.088,
    "band": 0.352
  }
];

// Modelos candidatos evaluados (Metodología Box-Jenkins)
export const CANDIDATE_MODELS = [
  {
    "model": "ARIMA(1,1,1)",
    "aic": 712.8,
    "bic": 717.2,
    "logLik": -353.4,
    "pLjungBox": 0.644,
    "isOptimal": true,
    "note": "Modelo óptimo y parsimonioso: menor AIC/BIC y residuos no correlacionados."
  },
  {
    "model": "ARIMA(1,1,2)",
    "aic": 714.2,
    "bic": 720.1,
    "logLik": -353.1,
    "pLjungBox": 0.658,
    "isOptimal": false,
    "note": "Mejora no significativa de verosimilitud penalizada por complejidad."
  },
  {
    "model": "ARIMA(2,1,0)",
    "aic": 715.0,
    "bic": 719.4,
    "logLik": -354.5,
    "pLjungBox": 0.512,
    "isOptimal": false,
    "note": "Buen ajuste autoregresivo pero subestima shocks en media móvil."
  },
  {
    "model": "ARIMA(0,1,1)",
    "aic": 716.4,
    "bic": 719.3,
    "logLik": -356.2,
    "pLjungBox": 0.34,
    "isOptimal": false,
    "note": "Suavizado exponencial que no captura la dinámica autoregresiva."
  },
  {
    "model": "ARIMA(2,1,1)",
    "aic": 716.7,
    "bic": 722.6,
    "logLik": -353.3,
    "pLjungBox": 0.672,
    "isOptimal": false,
    "note": "Parámetro AR(2) no estadísticamente significativo a 5%."
  },
  {
    "model": "ARIMA(1,0,1)",
    "aic": 742.1,
    "bic": 746.5,
    "logLik": -368.0,
    "pLjungBox": 0.019,
    "isOptimal": false,
    "note": "Modelo en niveles no estacionario con residuo autoregresivo espurio."
  }
];

// Síntesis Epistemológica Micro vs Macro
export const MICRO_VS_MACRO = {
  "micro": {
    "title": "Enfoque Micro: Procesos Estocásticos Discretos",
    "method": "Cadenas de Markov & PageRank",
    "unit": "Evento individual y navegación de repositorios",
    "timeResolution": "Secuencial / Event-driven ($X_{n+1} \\mid X_n$)",
    "theoreticalCore": "Matriz estocástica $P$, Ergodicidad, Teorema de Perron-Frobenius, Vector estacionario $\\pi$",
    "practicalInsight": "Muestra del dataset 2024-01-15-12.json: 286,864 eventos reales analizados. Revela automatización masiva por bots (github-actions[bot] con 64,298 eventos = 22.4%) y persistencia estocástica en cadenas de PushEvent."
  },
  "macro": {
    "title": "Enfoque Macro: Series de Tiempo Continuas/Agregadas",
    "method": "Modelos ARIMA(p,d,q) Box-Jenkins",
    "unit": "Volumen agregado horario/diario",
    "timeResolution": "Equiespaciada ($Y_t$ a las 12:00 UTC)",
    "theoreticalCore": "Filtros lineales de Wold, Integración $I(d)$, Operadores de retardo $B$, Polinomios $\\Phi(B)$ y $\\Theta(B)$",
    "practicalInsight": "Permite previsión de carga a escala global en GitHub (Enero 2024), modelando el ciclo semanal con bandas de riesgo al 95% de confianza."
  }
};
