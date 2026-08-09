(function () {  
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d", { alpha: true });
  const gameShell = document.getElementById("gameShell");
  const mainMenuOverlay = document.getElementById("mainMenuOverlay");
  const profileOverlay = document.getElementById("profileOverlay");
  const settingsOverlay = document.getElementById("settingsOverlay");
  const customizeOverlay = document.getElementById("customizeOverlay");
  const themeOverlay = document.getElementById("themeOverlay");
  const pauseOverlay = document.getElementById("pauseOverlay");
  const gameOverOverlay = document.getElementById("gameOverOverlay");
  const retryOverlay = document.getElementById("retryOverlay");
  const hud = document.getElementById("hud");
  const themeColor = document.getElementById("themeColor");
  const startButton = document.getElementById("startButton");
  const profileButton = document.getElementById("profileButton");
  const customizeButton = document.getElementById("customizeButton");
  const customizeThemeButton = document.getElementById("customizeThemeButton");
  const settingsButton = document.getElementById("settingsButton");
  const settingsSoundButton = document.getElementById("settingsSoundButton");
  const settingsDarkModeButton = document.getElementById("settingsDarkModeButton");
  const languageButton = document.getElementById("languageButton");
  const settingsBackButton = document.getElementById("settingsBackButton");
  const profileBackButton = document.getElementById("profileBackButton");
  const customizeBackButton = document.getElementById("customizeBackButton");
  const themeBackButton = document.getElementById("themeBackButton");
  const pauseContinueButton = document.getElementById("pauseContinueButton");
  const pauseMainMenuButton = document.getElementById("pauseMainMenuButton");
  const pauseSettingsButton = document.getElementById("pauseSettingsButton");
  const customizeBallPreview = document.getElementById("customizeBallPreview");
  const customizeBallName = document.getElementById("customizeBallName");
  const ballSkinList = document.getElementById("ballSkinList");
  const themeList = document.getElementById("themeList");
  const ballCoinBalance = document.getElementById("ballCoinBalance");
  const ballCoinBalanceValue = document.getElementById("ballCoinBalanceValue");
  const ballEconomyStatus = document.getElementById("ballEconomyStatus");
  const ballRewardedCoinButton = document.getElementById("ballRewardedCoinButton");
  const themeCoinBalance = document.getElementById("themeCoinBalance");
  const themeCoinBalanceValue = document.getElementById("themeCoinBalanceValue");
  const themeEconomyStatus = document.getElementById("themeEconomyStatus");
  const themeRewardedCoinButton = document.getElementById("themeRewardedCoinButton");
  const restartButton = document.getElementById("restartButton");
  const gameOverMenuButton = document.getElementById("gameOverMenuButton");
  const retryButton = document.getElementById("retryButton");
  const retryMenuButton = document.getElementById("retryMenuButton");
  const menuButton = document.getElementById("menuButton");
  const scoreValue = document.getElementById("scoreValue");
  const bestValue = document.getElementById("bestValue");
  const finalScore = document.getElementById("finalScore");
  const coinHud = document.getElementById("coinHud");
  const coinHudValue = document.getElementById("coinHudValue");
  const timedShotHud = document.getElementById("timedShotHud");
  const timedShotValue = document.getElementById("timedShotValue");
  const activePlayTimeValue = document.getElementById("activePlayTimeValue");
  const perfectBasketsValue = document.getElementById("perfectBasketsValue");
  const bounceBasketsValue = document.getElementById("bounceBasketsValue");
  const lifetimeScoreValue = document.getElementById("lifetimeScoreValue");
  const worldCoinsCollectedValue = document.getElementById("worldCoinsCollectedValue");
  const reviveOfferOverlay = document.getElementById("reviveOfferOverlay");
  const reviveOfferCountdown = document.getElementById("reviveOfferCountdown");
  const reviveOfferStatus = document.getElementById("reviveOfferStatus");
  const reviveRewardButton = document.getElementById("reviveRewardButton");
  const reviveFinishButton = document.getElementById("reviveFinishButton");

  const STORAGE_KEY = "hoop-flick-best";
  const DARK_MODE_KEY = "hoop-flick-dark-mode";
  const MUTED_KEY = "hoop-flick-muted";
  const LANGUAGE_KEY = "hoop-flick-language";
  const BALL_SKIN_KEY = "hoop-flick-ball-skin";
  const THEME_KEY = "hoop-flick-theme";
  const LOCAL_SAVE_KEY = "hoop-flick-save-v4";
  const SAVE_VERSION = 5;
  const ECONOMY_SAVE_VERSION = 4;
  const STATS_SAVE_VERSION = 5;
  const WORLD_W = 420;
  const WORLD_H = 746;
  const START_HOOP_BOTTOM_OFFSET = 183;
  const HOOP_WIDTH = 72;
  const HOOP_SPRITE_CONFIG = Object.freeze({
    sourceSize: 1024,
    anchorX: 515,
    anchorY: 358,
    referenceWidth: 533,
    layerFiles: Object.freeze({
      netBack: "net-back.png",
      rimBack: "rim-back.png",
      netFront: "net-front.png",
      rimFront: "rim-front.png"
    }),
    layerSourceOffsets: Object.freeze({
      "assets/hoop/minimal/dark": Object.freeze({
        rimFront: Object.freeze({ x: 0, y: 123 })
      })
    })
  });
  const GRAVITY = 1420;
  const AIR_DRAG = 0.998;

  // MANUAL SHOT TUNING
  // Lower LAUNCH_POWER_SCALE for a slower/shorter real shot; raise it for more reach.
  // TRAJECTORY_POWER_SCALE changes only the preview spacing (1 = same launch scale).
  // PULL_CURVE_EXPONENT changes how quickly power builds while dragging.
  const LAUNCH_POWER_SCALE = 7.48;
  const TRAJECTORY_POWER_SCALE = 1;
  const PULL_CURVE_EXPONENT = 1;

  const MAX_PULL = 140;
  const MIN_SHOT_PULL = 12;
  const MAX_POWER_BOOST = 1.12;

  const WALL_INSET = 30;
  const HOOP_WALL_CLEARANCE = 94;
  const MIN_HOOP_HORIZONTAL_GAP = 74;
  const MAX_HOOP_HORIZONTAL_GAP = 154;
  const MIN_HOOP_VERTICAL_GAP = 152;
  const MAX_HOOP_VERTICAL_GAP = 208;
  const AIRBORNE_RETRY_DELAY = 7.5;
  const RIM_RADIUS = 7;
  const BALL_RADIUS = 12.95;
  const NET_REST_Y = 30;
  const BALL_SETTLE_DURATION = 0.24;
  const BALL_SETTLE_INPUT_DELAY = 0.1;
  const TIMED_SHOT_START_SCORE = 100;
  const TIMED_SHOT_MAX_SECONDS = 12;
  const TIMED_SHOT_MIN_SECONDS = 3;
  const TIMED_SHOT_SCORE_STEP = 40;
  const TIMED_SHOT_INTERVAL_MIN = 4;
  const TIMED_SHOT_INTERVAL_MAX = 6;
  const TIMED_SHOT_TICK_THRESHOLDS = Object.freeze([5, 4, 3, 2, 1]);
  const NET_ANIMATION_DURATION = 0.56;
  const HOOP_RELEASE_DURATION = 0.34;
  const HOOP_SPAWN_DURATION = 0.36;
  const HOOP_AIM_MAX_OFFSET = 9;
  const SHOT_RING_DURATION = 0.3;
  const NEW_HIGH_SCORE_DURATION = 1.35;
  const NEW_HIGH_SCORE_CONFETTI_COUNT = 22;
  const COIN_RADIUS = 9;
  const COIN_LOCAL_Y = -32;
  const COIN_INTERVAL_MIN = 4;
  const COIN_INTERVAL_MAX = 7;
  const COIN_FEEDBACK_DURATION = 0.72;
  const COIN_COLLECT_PARTICLE_COUNT = 8;
  const MAX_PARTICLES = 160;
  const MAX_SHOT_RINGS = 12;
  const COIN_REWARD_ID = "hoop-flick-coins-25-v1";
  const CONTINUE_REWARD_ID = "hoop-flick-continue-once-v1";
  const REWARDED_COIN_AMOUNT = 25;
  const REVIVE_OFFER_DURATION = 6;
  const SPAWN_ATTEMPTS = 14;
  const MIN_HOOP_TILT = 2.5 * (Math.PI / 180);
  const MAX_HOOP_TILT = 7 * (Math.PI / 180);

  const TUTORIAL_LAST_TARGET_ID = 4;
  const VARIETY_CHANCE_FULL_SCORE = 50;
  const MAX_HARD_TRANSITION_STREAK = 1;
  const LONG_SHOT_COOLDOWN_TRANSITIONS = 1;
  const WIDE_GAP_UNLOCK_SCORE = 8;
  const WIDE_GAP_BASE_CHANCE = 0.22;
  const WIDE_GAP_MAX_CHANCE = 0.38;
  const LONG_SHOT_UNLOCK_SCORE = 8;
  const LONG_SHOT_BASE_CHANCE = 0.08;
  const LONG_SHOT_MAX_CHANCE = 0.22;
  const LONG_SHOT_MIN_CENTER_DISTANCE = 248;
  const NORMAL_NEAR_MAX_SHARE = 0.22;
  const MAX_CONSECUTIVE_NEAR_TRANSITIONS = 1;
  const NORMAL_NEAR_MIN_CENTER_DISTANCE = 190;
  const EDGE_TRANSITION_UNLOCK_SCORE = 8;
  const EDGE_TRANSITION_BASE_CHANCE = 0.12;
  const EDGE_TRANSITION_MAX_CHANCE = 0.20;
  const EDGE_TRANSITION_COOLDOWN = 1;
  const EDGE_HOOP_WALL_GAP = 10;
  const EDGE_HOOP_INWARD_JITTER = 4;
  const FALLBACK_HORIZONTAL_GAP = 92;
  const FALLBACK_VERTICAL_GAP = 166;
  const CHALLENGED_MAX_VERTICAL_GAP = 190;
  const REACHABILITY_PULL_RATIOS = [0.6, 0.72, 0.82, 0.92, 1];
  const REACHABILITY_ELEVATION_DEGREES = [48, 56, 64, 72, 78, 84];
  const REACHABILITY_STEP = 1 / 60;
  const REACHABILITY_MAX_TIME = 1.65;

  const CHALLENGE_COSTS = {
    wide: 1,
    edge: 1,
    longShot: 1,
    moving: 1,
    board: 1,
    tilt: 1
  };

  const DIFFICULTY_TIERS = [
    { name: "start", minScore: 0, maxScore: 7, maxBudget: 0, weights: { easy: 1, medium: 0, hard: 0 } },
    { name: "light", minScore: 8, maxScore: 14, maxBudget: 1, weights: { easy: 0.6, medium: 0.4, hard: 0 } },
    { name: "medium", minScore: 15, maxScore: 29, maxBudget: 2, weights: { easy: 0.4, medium: 0.5, hard: 0.1 } },
    { name: "advanced", minScore: 30, maxScore: 49, maxBudget: 2, weights: { easy: 0.3, medium: 0.5, hard: 0.2 } },
    { name: "mastery", minScore: 50, maxScore: Infinity, maxBudget: 3, weights: { easy: 0.25, medium: 0.45, hard: 0.3 } }
  ];

  const DIFFICULTY_BUDGET_CAPS = {
    easy: 0,
    medium: 1,
    hard: 3
  };

  const SPAWN_GAP_PROFILES = {
    tutorial: { minX: 98, maxX: 130, minY: 166, maxY: 188 },
    normalNear: { minX: 96, maxX: 122, minY: 166, maxY: 188 },
    normalFar: { minX: 118, maxX: 148, minY: 180, maxY: 204 },
    wideHorizontal: { minX: 155, maxX: 166, minY: 158, maxY: 190 },
    wideVertical: { minX: 88, maxX: 130, minY: 209, maxY: 226 },
    wideBalanced: { minX: 132, maxX: 154, minY: 190, maxY: 214 },
    longShot: { minX: 132, maxX: 172, minY: 210, maxY: 242 },
    edge: { minX: 120, maxX: 260, minY: 170, maxY: 205 },
    fallback: {
      minX: MIN_HOOP_HORIZONTAL_GAP,
      maxX: MAX_HOOP_HORIZONTAL_GAP,
      minY: MIN_HOOP_VERTICAL_GAP,
      maxY: MAX_HOOP_VERTICAL_GAP
    }
  };

  const ECONOMY_PRICES = Object.freeze({
    ball: Object.freeze({
      classic: 0,
      inverted: 50,
      neon: 60,
      watermelon: 75,
      magma: 90,
      gold: 100,
      ghost: 100,
      toxic: 120,
      matrix: 100,
      earth: 130,
      cyberpunk: 150,
      bloodMoon: 175,
      zebra: 200,
      sun: 100
    }),
    theme: Object.freeze({
      gym: 0,
      sunset: 150,
      neon: 300,
      rooftop: 175,
      minimal: 200,
    })
  });

  const BALL_SKIN_DISPLAY_ORDER = Object.freeze([
    "classic",
    "inverted",
    "watermelon",
    "magma",
    "toxic",
    "bloodMoon",
    "zebra",
    "earth",
    "cyberpunk",
    "neon",
    "gold",
    "ghost",
    "matrix",
    "sun"
  ]);
  const THEME_DISPLAY_ORDER = Object.freeze([
    "gym",
    "sunset",
    "rooftop",
    "minimal",
    "neon"
  ]);

  const BALL_EFFECT_PRESETS = {
    classic: {
      perfectStyle: "starBurst",
      perfectFlameColors: ["#fff0a6", "#ff8a2e", "#c4702c"],
      perfectFlameIntensity: 1,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.34,
      perfectFlameShape: "flame",
      comboThreshold: 3,
      trailInterval: 0.045,
      trailColors: ["#ffb347", "#f47b20", "#e95f1a"]
    },
    ice: {
      perfectStyle: "halo",
      perfectFlameColors: ["#ffffff", "#bcecff", "#62c7ff"],
      perfectFlameIntensity: 0.85,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.32,
      perfectFlameShape: "frost",
      comboThreshold: 2,
      trailInterval: 0.05,
      trailColors: ["#ffffff", "#bcecff", "#62c7ff"]
    },
    neon: {
      perfectStyle: "digitalRings",
      perfectFlameColors: ["#2cacf7", "#2cacf7", "#2cacf7"],
      perfectFlameIntensity: 1.08,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.34,
      perfectFlameShape: "energy",
      comboThreshold: 2,
      trailInterval: 0.04,
      trailColors: ["#2cacf7", "#2cacf7", "#2cacf7"]
    },
    gold: {
      perfectStyle: "starBurst",
      perfectFlameColors: ["#eed4d4", "#ffeb73", "#ffd900"],
      perfectFlameIntensity: 1.12,
      perfectFlameSize: 24,
      perfectFlameLifetime: 0.36,
      perfectFlameShape: "flame",
      trailColors: ["#ffd700", "#ffeb73", "#ffffff"],
      gravityModifier: 50,
      shrinkRate: 15
    },
    toxic: {
      perfectStyle: "splash",
      perfectFlameColors: ["#adff2f", "#39ff14", "#0a6f12"],
      perfectFlameIntensity: 1.13,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.38,
      perfectFlameShape: "acid",
      trailColors: ["#39ff14", "#adff2f", "#000000"],
      gravityModifier: -100,
      shrinkRate: 8
    },
    ghost: {
      perfectStyle: "halo",
      perfectFlameColors: ["#ffffff", "#e0e0e0", "#9fd7ff"],
      perfectFlameIntensity: 1.13,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.4,
      perfectFlameShape: "spirit",
      trailColors: ["#e0e0e0", "#ffffff", "#cccccc"],
      gravityModifier: -20,
      shrinkRate: 6
    },
    water: {
      perfectStyle: "splash",
      perfectFlameColors: ["#add8e6", "#1e90ff", "#00bfff"],
      perfectFlameIntensity: 0.95,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.36,
      perfectFlameShape: "splash",
      trailColors: ["#00bfff", "#1e90ff", "#add8e6"],
      gravityModifier: 300,
      shrinkRate: 10
    },
    plasma: {
      perfectStyle: "digitalRings",
      perfectFlameColors: ["#00ffff", "#ff00ff", "#8a2be2"],
      perfectFlameIntensity: 1.16,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.34,
      perfectFlameShape: "energy",
      trailColors: ["#8a2be2", "#ff00ff", "#00ffff"],
      gravityModifier: 0,
      shrinkRate: 20
    },
    inverted: {
      perfectStyle: "halo",
      perfectFlameColors: ["#000000", "#333333", "#666666"],
      perfectFlameIntensity: 0.9,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.4,
      perfectFlameShape: "spirit",
      trailColors: ["#333333", "#000000", "#666666"],
      gravityModifier: -20,
      shrinkRate: 6
    },
    magma: {
      perfectStyle: "splash",
      perfectFlameColors: ["#ff4500", "#c72828", "#ff0000"],
      perfectFlameIntensity: 1.2,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.36,
      perfectFlameShape: "lava",
      trailColors: ["#ff8c00", "#ff4500", "#ff0000"],
      gravityModifier: 100,
      shrinkRate: 12
    },
    watermelon: {
      perfectStyle: "starBurst",
      perfectFlameColors: ["#ff4d4d", "#e60000", "#006600"],
      perfectFlameIntensity: 1.1,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.36,
      perfectFlameShape: "splash",
      trailColors: ["#e60000", "#ff4d4d", "#006600"],
      gravityModifier: 50,
      shrinkRate: 10
    },
    earth: {
      perfectStyle: "splash",
      perfectFlameColors: ["#00bfff", "#228b22", "#8b4513"],
      perfectFlameIntensity: 1.0,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.36,
      perfectFlameShape: "splash",
      trailColors: ["#228b22", "#00bfff", "#8b4513"],
      gravityModifier: 50,
      shrinkRate: 10
    },
    bloodMoon: {
      perfectStyle: "splash",
      perfectFlameColors: ["#ff3333", "#990000", "#4d0000"],
      perfectFlameIntensity: 1.0,
      perfectFlameSize: 20,
      perfectFlameLifetime: 0.36,
      perfectFlameShape: "splash",
      trailColors: ["#990000", "#ff3333", "#4d0000"],
      gravityModifier: 50,
      shrinkRate: 10
    },
    zebra: {
      perfectStyle: "halo",
      perfectFlameColors: ["#ffffff", "#e6e6e6", "#b3b3b3"],
      perfectFlameIntensity: 1.0,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.36,
      perfectFlameShape: "spirit",
      trailColors: ["#e6e6e6", "#ffffff", "#b3b3b3"],
      gravityModifier: 50,
      shrinkRate: 10
    }
  };
  const BALL_SKINS = {
    classic: {
      id: "classic",
      nameKey: "classicBall",
      descriptionKey: "selectedSkin",
      effectPreset: "classic",
      assetPath: "",
      colors: {
        light: "#ffb24a",
        mid: "#f28a27",
        dark: "#d96a1b",
        seam: "#2f2923",
        outline: "#b95a18"
      }
    },
    inverted: {
      id: "inverted",
      nameKey: "invertedBall",
      descriptionKey: "selectSkin",
      effectPreset: "inverted",
      assetPath: "",
      colors: {
        light: "#5c5c5c",
        mid: "#2b2b2b",
        dark: "#141414",
        seam: "#ffffff",
        outline: "#0a0a0a"
      }
    },
    neon: {
      id: "neon",
      nameKey: "neonBall",
      descriptionKey: "selectSkin",
      effectPreset: "neon",
      assetPath: "",
      noSeams: true,
      colors: {
        light: "#38f2ff",
        mid: "#00bfff",
        dark: "#0056b3",
        seam: "transparent",
        outline: "#00264d"
      }
    },
    magma: {
      id: "magma",
      nameKey: "magmaBall",
      descriptionKey: "selectSkin",
      effectPreset: "magma",
      assetPath: "",
      colors: {
        light: "#fffa65",
        mid: "#ff6c00",
        dark: "#cc0000",
        seam: "#330000",
        outline: "#660000"
      }
    },
    watermelon: {
      id: "watermelon",
      nameKey: "watermelonBall",
      descriptionKey: "selectSkin",
      effectPreset: "watermelon",
      assetPath: "",
      colors: {
        light: "#ff4d4d",
        mid: "#e60000",
        dark: "#990000",
        seam: "#006600",
        outline: "#003300"
      }
    },
    gold: {
      id: "gold",
      nameKey: "goldBall",
      descriptionKey: "selectSkin",
      effectPreset: "gold",
      assetPath: "",
      noSeams: true,
      colors: {
        light: "#ffef96",
        mid: "#ffcc00",
        dark: "#b38f00",
        seam: "transparent",
        outline: "#806600"
      }
    },
    ghost: {
      id: "ghost",
      nameKey: "ghostBall",
      descriptionKey: "selectSkin",
      effectPreset: "ghost",
      assetPath: "",
      noSeams: true,
      colors: {
        light: "#ffffff",
        mid: "#f2f2f2",
        dark: "#cccccc",
        seam: "transparent",
        outline: "#a6a6a6"
      }
    },
    toxic: {
      id: "toxic",
      nameKey: "toxicBall",
      descriptionKey: "selectSkin",
      effectPreset: "toxic",
      assetPath: "",
      colors: {
        light: "#b3ff66",
        mid: "#39ff14",
        dark: "#006600",
        seam: "#000000",
        outline: "#001a00"
      }
    },
    matrix: {
      id: "matrix",
      nameKey: "matrixBall",
      descriptionKey: "selectSkin",
      effectPreset: "toxic",
      assetPath: "",
      noSeams: true,
      colors: {
        light: "#00ff00",
        mid: "#009900",
        dark: "#003300",
        seam: "transparent",
        outline: "#000000"
      }
    },
    earth: {
      id: "earth",
      nameKey: "earthBall",
      descriptionKey: "selectSkin",
      effectPreset: "earth",
      assetPath: "",
      colors: {
        light: "#66ccff",
        mid: "#0073e6",
        dark: "#004080",
        seam: "#33cc33",
        outline: "#006600"
      }
    },
    cyberpunk: {
      id: "cyberpunk",
      nameKey: "cyberpunkBall",
      descriptionKey: "selectSkin",
      effectPreset: "plasma",
      assetPath: "",
      colors: {
        light: "#ffff00",
        mid: "#ff00ff",
        dark: "#800080",
        seam: "#00ffff",
        outline: "#008080"
      }
    },
    bloodMoon: {
      id: "bloodMoon",
      nameKey: "bloodMoonBall",
      descriptionKey: "selectSkin",
      effectPreset: "bloodMoon",
      assetPath: "",
      colors: {
        light: "#ff3333",
        mid: "#990000",
        dark: "#4d0000",
        seam: "#000000",
        outline: "#1a0000"
      }
    },
    zebra: {
      id: "zebra",
      nameKey: "zebraBall",
      descriptionKey: "selectSkin",
      effectPreset: "zebra",
      assetPath: "",
      colors: {
        light: "#ffffff",
        mid: "#e6e6e6",
        dark: "#b3b3b3",
        seam: "#000000",
        outline: "#000000"
      }
    },
    sun: {
      id: "sun",
      nameKey: "sunBall",
      descriptionKey: "selectSkin",
      effectPreset: "gold",
      assetPath: "",
      noSeams: true,
      colors: {
        light: "#ffffff",
        mid: "#ffff00",
        dark: "#ff9900",
        seam: "transparent",
        outline: "#cc3300"
      }
    }
  };
  const THEMES = {
    gym: {
      id: "gym",
      nameKey: "themeGym",
      bgStyle: "classic",
      motif: "none",
      colors: {
        light: {
          backgroundTop: "#fbf7ee",
          backgroundBottom: "#f0eadf",
          backgroundAccent: "rgba(255, 255, 255, 0.1)",
          geometryLine: "rgba(255, 255, 255, 0)",
          geometryGlow: "rgba(255, 255, 255, 0)",
          ink: "#263044",
          ambient: "#fbf7ee",
          wallFill: "rgba(38, 48, 68, 0.08)",
          wallEdge: "rgba(38, 48, 68, 0.58)",
          trajectory: "rgba(38, 48, 68, 0.38)",
          trajectoryHot: "rgba(201, 42, 35, 0.58)",
          shotRing: "rgba(244, 123, 32, 0.82)",
          hint: "rgba(38, 48, 68, 0.28)",
          hintStrong: "rgba(38, 48, 68, 0.62)",
          hoopShadow: "rgba(38, 48, 68, 0.12)",
          boardShadow: "rgba(38, 48, 68, 0.13)",
          boardFill: "#ffffff",
          boardStroke: "#596477",
          netFill: "rgba(255, 255, 255, 0.14)",
          netEdge: "rgba(98, 111, 126, 0.24)",
          netOutline: "rgba(74, 87, 103, 0.2)",
          netLine: "rgba(255, 255, 255, 0.92)",
          netFront: "rgba(255, 255, 255, 0.98)",
          rimInner: "rgba(255, 246, 229, 0.42)",
          rimShadow: "#9f241f",
          rim: "#e43a31",
          rimHighlight: "rgba(255, 145, 119, 0.92)",
          motionPath: "rgba(64, 128, 151, 0.68)"
        },
        dark: {
          backgroundTop: "#111820",
          backgroundBottom: "#17202a",
          backgroundAccent: "rgba(255, 255, 255, 0.04)",
          geometryLine: "rgba(255, 210, 255, 0)",
          geometryGlow: "rgba(210, 120, 255, 0)",
          ink: "#e7e0ea",
          ambient: "#000000",
          wallFill: "rgba(2, 0, 0, 0.07)",
          wallEdge: "rgba(0, 0, 0, 0.42)",
          trajectory: "rgba(255, 156, 76, 0.9)",
          trajectoryHot: "rgba(255, 156, 76, 0.9)",
          shotRing: "rgba(255, 156, 76, 0.9)",
          hint: "rgba(225, 238, 247, 0.34)",
          hintStrong: "rgba(225, 238, 247, 0.72)",
          hoopShadow: "rgba(0, 0, 0, 0.24)",
          boardShadow: "rgba(0, 0, 0, 0.24)",
          boardFill: "#e9f0f2",
          boardStroke: "#758795",
          netFill: "rgba(218, 233, 240, 0.08)",
          netEdge: "rgba(221, 235, 241, 0.42)",
          netOutline: "rgba(7, 15, 23, 0.28)",
          netLine: "rgba(236, 246, 250, 0.82)",
          netFront: "rgba(250, 253, 255, 0.92)",
          rimInner: "rgba(7, 14, 21, 0.34)",
          rimShadow: "#8b241f",
          rim: "#f04a3f",
          rimHighlight: "rgba(255, 160, 135, 0.9)",
          motionPath: "rgba(122, 207, 225, 0.76)"
        }
      }
    },
    sunset: {
      id: "sunset",
      nameKey: "themeSunset",
      bgStyle: "sunset",
      motif: "sun",
      colors: {
        light: {
          backgroundTop: "#fff1df",
          backgroundBottom: "#ffe0bd",
          backgroundAccent: "rgba(255, 111, 46, 0.1)",
          geometryLine: "rgba(255, 255, 255, 0.52)",
          geometryGlow: "rgba(255, 190, 219, 0.44)",
          ink: "#5a2a20",
          ambient: "#fff1df",
          wallFill: "rgba(177, 71, 42, 0.11)",
          wallEdge: "rgba(151, 54, 32, 0.72)",
          trajectory: "rgba(109, 47, 36, 0.46)",
          trajectoryHot: "rgba(255, 111, 46, 0.72)",
          shotRing: "rgba(255, 135, 51, 0.88)",
          hint: "rgba(109, 47, 36, 0.3)",
          hintStrong: "rgba(109, 47, 36, 0.68)",
          hoopShadow: "rgba(111, 48, 32, 0.14)",
          boardShadow: "rgba(111, 48, 32, 0.15)",
          boardFill: "#fff8ee",
          boardStroke: "#9b5b45",
          netFill: "rgba(255, 247, 232, 0.18)",
          netEdge: "rgba(147, 80, 55, 0.28)",
          netOutline: "rgba(106, 53, 38, 0.22)",
          netLine: "rgba(255, 252, 243, 0.94)",
          netFront: "rgba(255, 255, 250, 0.98)",
          rimInner: "rgba(255, 235, 207, 0.5)",
          rimShadow: "#9a3279",
          rim: "#e29339",
          rimHighlight: "rgba(255, 185, 238, 0.94)",
          motionPath: "rgba(188, 88, 53, 0.68)"
        },
        dark: {
          backgroundTop: "#2d1724",
          backgroundBottom: "#180d17",
          backgroundAccent: "rgba(255, 124, 211, 0.09)",
          geometryLine: "rgba(255, 205, 239, 0.2)",
          geometryGlow: "rgba(255, 124, 211, 0.2)",
          ink: "#f4ebff",
          ambient: "#6d4d89",
          wallFill: "rgba(226, 206, 255, 0.08)",
          wallEdge: "rgba(222, 198, 255, 0.64)",
          trajectory: "rgba(233, 216, 255, 0.56)",
          trajectoryHot: "rgba(255, 124, 211, 0.82)",
          shotRing: "rgba(255, 143, 225, 0.9)",
          hint: "rgba(230, 210, 255, 0.32)",
          hintStrong: "rgba(238, 224, 255, 0.74)",
          hoopShadow: "rgba(0, 0, 0, 0.3)",
          boardShadow: "rgba(0, 0, 0, 0.3)",
          boardFill: "#eee5f7",
          boardStroke: "#8b6ca3",
          netFill: "rgba(225, 210, 239, 0.08)",
          netEdge: "rgba(226, 207, 241, 0.4)",
          netOutline: "rgba(13, 6, 21, 0.34)",
          netLine: "rgba(246, 237, 252, 0.84)",
          netFront: "rgba(255, 249, 255, 0.94)",
          rimInner: "rgba(28, 8, 36, 0.42)",
          rimShadow: "#862a67",
          rim: "#f043bc",
          rimHighlight: "rgba(255, 172, 232, 0.92)",
          motionPath: "rgba(190, 132, 232, 0.78)"
        }
      }
    },
    neon: {
      id: "neon",
      nameKey: "themeNeon",
      bgStyle: "neon",
      motif: "geometry",
      colors: {
        light: {
          backgroundTop: "#f0fbff",
          backgroundBottom: "#e7fff9",
          backgroundAccent: "rgba(0, 191, 255, 0.11)",
          geometryLine: "rgba(255, 255, 255, 0.54)",
          geometryGlow: "rgba(150, 242, 255, 0.4)",
          ink: "#184250",
          ambient: "#effff5",
          wallFill: "rgba(24, 103, 78, 0.1)",
          wallEdge: "rgba(24, 103, 78, 0.7)",
          trajectory: "rgb(12, 139, 170)",
          trajectoryHot: "rgb(12, 139, 170)",
          shotRing: "rgb(12, 139, 170)",
          hint: "rgba(25, 88, 72, 0.28)",
          hintStrong: "rgba(25, 88, 72, 0.64)",
          hoopShadow: "rgba(20, 88, 69, 0.13)",
          boardShadow: "rgba(20, 88, 69, 0.14)",
          boardFill: "#f8fff9",
          boardStroke: "#4b7e70",
          netFill: "rgba(247, 255, 250, 0.16)",
          netEdge: "rgba(56, 122, 101, 0.26)",
          netOutline: "rgba(33, 91, 75, 0.21)",
          netLine: "rgba(252, 255, 253, 0.94)",
          netFront: "rgba(255, 255, 255, 0.98)",
          rimInner: "rgba(12, 31, 209, 0.46)",
          rimShadow: "#0671eb",
          rim: "#08a6f0",
          rimHighlight: "rgba(0, 255, 234, 0.92)",
          motionPath: "rgba(49, 139, 111, 0.7)"
        },
        dark: {
          backgroundTop: "#091923",
          backgroundBottom: "#050910",
          backgroundAccent: "rgba(56, 242, 255, 0.1)",
          geometryLine: "rgba(160, 250, 255, 0.2)",
          geometryGlow: "rgba(56, 242, 255, 0.2)",
          ink: "#e8fbff",
          ambient: "#173d4d",
          wallFill: "rgba(94, 241, 255, 0.08)",
          wallEdge: "rgba(152, 245, 255, 0.6)",
          trajectory: "rgba(176, 250, 255, 0.56)",
          trajectoryHot: "rgba(26, 219, 161, 0.78)",
          shotRing: "rgba(56, 242, 255, 0.9)",
          hint: "rgba(150, 242, 255, 0.28)",
          hintStrong: "rgba(200, 255, 255, 0.7)",
          hoopShadow: "rgba(0, 0, 0, 0.34)",
          boardShadow: "rgba(0, 0, 0, 0.32)",
          boardFill: "#dff8ff",
          boardStroke: "#4f8ba0",
          netFill: "rgba(210, 252, 255, 0.08)",
          netEdge: "rgba(200, 250, 255, 0.4)",
          netOutline: "rgba(2, 19, 24, 0.36)",
          netLine: "rgba(236, 255, 255, 0.86)",
          netFront: "rgba(248, 255, 255, 0.94)",
          rimInner: "rgba(0, 25, 30, 0.36)",
          rimShadow: "#245b9c",
          rim: "#0ddac8",
          rimHighlight: "rgba(220, 206, 255, 0.92)",
          motionPath: "rgba(156, 255, 87, 0.72)"
        }
      }
    },
    rooftop: {
      id: "rooftop",
      nameKey: "themeRooftop",
      bgStyle: "court",
      motif: "court",
      colors: {
        light: {
          backgroundTop: "#eef5ff",
          backgroundBottom: "#dde8f2",
          backgroundAccent: "rgba(64, 128, 151, 0.08)",
          geometryLine: "rgba(255, 255, 255, 0.48)",
          geometryGlow: "rgba(193, 223, 255, 0.38)",
          ink: "#27364a",
          ambient: "#eef5ff",
          wallFill: "rgba(39, 54, 74, 0.1)",
          wallEdge: "rgba(39, 54, 74, 0.7)",
          trajectory: "rgba(223, 20, 212, 0.84)",
          trajectoryHot: "rgba(223, 20, 212, 0.84)",
          shotRing: "rgba(223, 20, 212, 0.84)",
          hint: "rgba(39, 54, 74, 0.28)",
          hintStrong: "rgba(39, 54, 74, 0.62)",
          hoopShadow: "rgba(39, 54, 74, 0.13)",
          boardShadow: "rgba(39, 54, 74, 0.14)",
          boardFill: "#f8fbff",
          boardStroke: "#65768e",
          netFill: "rgba(248, 251, 255, 0.14)",
          netEdge: "rgba(89, 104, 124, 0.27)",
          netOutline: "rgba(58, 72, 91, 0.2)",
          netLine: "rgba(255, 255, 255, 0.92)",
          netFront: "rgba(255, 255, 255, 0.98)",
          rimInner: "rgba(255, 246, 229, 0.44)",
          rimShadow: "#ffffff",
          rim: "#e161ec",
          rimHighlight: "rgba(255, 255, 255, 0.88)",
          motionPath: "rgba(64, 128, 151, 0.68)"
        },
        dark: {
          backgroundTop: "#202936",
          backgroundBottom: "#101720",
          backgroundAccent: "rgba(255, 123, 84, 0.08)",
          geometryLine: "rgba(255, 215, 226, 0.18)",
          geometryGlow: "rgba(255, 123, 154, 0.18)",
          ink: "#ffe8e8",
          ambient: "#7d3038",
          wallFill: "rgba(255, 211, 211, 0.08)",
          wallEdge: "rgba(255, 205, 205, 0.62)",
          trajectory: "rgba(235, 95, 228, 0.88)",
          trajectoryHot: "rgba(235, 95, 228, 0.88)",
          shotRing: "rgba(235, 95, 228, 0.88)",
          hint: "rgba(255, 218, 218, 0.3)",
          hintStrong: "rgba(255, 230, 230, 0.72)",
          hoopShadow: "rgba(0, 0, 0, 0.32)",
          boardShadow: "rgba(0, 0, 0, 0.32)",
          boardFill: "#f3e7e7",
          boardStroke: "#9b696d",
          netFill: "rgba(244, 218, 218, 0.08)",
          netEdge: "rgba(247, 216, 216, 0.4)",
          netOutline: "rgba(24, 5, 7, 0.34)",
          netLine: "rgba(255, 238, 238, 0.84)",
          netFront: "rgba(255, 249, 249, 0.94)",
          rimInner: "rgba(34, 5, 8, 0.42)",
          rimShadow: "#7a2a66",
          rim: "#f077c3",
          rimHighlight: "rgba(255, 170, 226, 0.92)",
          motionPath: "rgba(221, 105, 112, 0.78)"
        }
      }
    },
    minimal: {
      id: "minimal",
      nameKey: "themeMinimal",
      bgStyle: "minimal",
      motif: "vignette",
      colors: {
        light: {
          backgroundTop: "#fbfaf7",
          backgroundBottom: "#ece8df",
          backgroundAccent: "rgba(38, 48, 68, 0.05)",
          geometryLine: "rgba(255, 255, 255, 0.42)",
          geometryGlow: "rgba(244, 241, 234, 0.38)",
          ink: "#2c3038",
          ambient: "#fbfaf7",
          wallFill: "rgba(44, 48, 56, 0.08)",
          wallEdge: "rgba(44, 48, 56, 0.64)",
          trajectory: "rgb(0, 0, 0)",
          trajectoryHot: "rgb(0, 0, 0)",
          shotRing: "rgb(0, 0, 0)",
          hint: "rgba(44, 48, 56, 0.24)",
          hintStrong: "rgba(44, 48, 56, 0.58)",
          hoopShadow: "rgba(44, 48, 56, 0.1)",
          boardShadow: "rgba(44, 48, 56, 0.12)",
          boardFill: "#fffdf9",
          boardStroke: "#74706a",
          netFill: "rgba(255, 255, 255, 0.12)",
          netEdge: "rgba(85, 84, 82, 0.23)",
          netOutline: "rgba(67, 66, 64, 0.18)",
          netLine: "rgba(255, 255, 255, 0.9)",
          netFront: "rgba(255, 255, 255, 0.98)",
          rimInner: "rgba(255, 246, 229, 0.4)",
          rimShadow: "#ffffff",
          rim: "#5a5353",
          rimHighlight: "rgb(255, 255, 255)",
          motionPath: "rgba(95, 103, 111, 0.58)"
        },
        dark: {
          backgroundTop: "#181a20",
          backgroundBottom: "#0d0f13",
          backgroundAccent: "rgba(255, 255, 255, 0.04)",
          geometryLine: "rgba(244, 241, 234, 0.16)",
          geometryGlow: "rgba(244, 241, 234, 0.14)",
          ink: "#f4f1ea",
          ambient: "#3d4149",
          wallFill: "rgba(244, 241, 234, 0.07)",
          wallEdge: "rgba(244, 241, 234, 0.56)",
          trajectory: "rgb(255, 255, 255)",
          trajectoryHot: "rgb(255, 255, 255)",
          shotRing: "rgb(255, 255, 255)",
          hint: "rgba(244, 241, 234, 0.28)",
          hintStrong: "rgba(244, 241, 234, 0.66)",
          hoopShadow: "rgba(0, 0, 0, 0.3)",
          boardShadow: "rgba(0, 0, 0, 0.28)",
          boardFill: "#e9e5dd",
          boardStroke: "#7c7a75",
          netFill: "rgba(233, 229, 221, 0.07)",
          netEdge: "rgba(233, 229, 221, 0.36)",
          netOutline: "rgba(8, 9, 11, 0.32)",
          netLine: "rgba(248, 245, 238, 0.82)",
          netFront: "rgba(255, 252, 245, 0.92)",
          rimInner: "rgba(11, 12, 15, 0.34)",
          rimShadow: "#e6d7e2",
          rim: "#3f303b",
          rimHighlight: "rgba(243, 237, 241, 0.88)",
          motionPath: "rgba(190, 196, 200, 0.6)"
        }
      }
    }
  };
  const ballSkinImages = Object.create(null);
  const hoopSpriteImages = Object.create(null);
  const hoopSpriteState = {
    setId: null,
    generation: 0,
    started: false,
    loadedCount: 0,
    ready: false,
    failed: false,
    warningSent: false
  };
  const TRANSLATIONS = {
    tr: {
      arcadeEyebrow: "ARCADE BASKETBOL",
      tagline: "Çek, bırak ve yükselmeye devam et.",
      play: "Oyna",
      profile: "Profil",
      activePlayTime: "Aktif Oynama Süresi",
      perfectBaskets: "Deliksiz Atışlar",
      bounceBaskets: "Duvardan Atışlar",
      lifetimeScore: "Toplam Skor",
      worldCoinsCollected: "Toplanan Dünya Coinleri",
      customize: "Topu Özelleştir",
      customizeTheme: "Temayı Özelleştir",
      settings: "Ayarlar",
      back: "Geri",
      collectionEyebrow: "TOP KOLEKSİYONU",
      chooseBall: "Topunu Seç",
      ballCollectionHint: "Yeni top stilleri için hazır koleksiyon.",
      backgroundTheme: "Arka Plan Teması",
      coins: "Coin",
      coinBalance: "Coin bakiyesi",
      locked: "Kilitli",
      owned: "Sahip",
      insufficientCoins: "Yetersiz coin",
      purchased: "Satın alındı",
      watchAdCoins: "Reklam İzle · +25 Coin",
      rewardedUnavailable: "Reklam şu anda kullanılamıyor",
      rewardedPending: "Reklam açılıyor…",
      rewardedCoinsGranted: "+25 coin kazandın",
      rewardedNotEarned: "Ödül alınamadı",
      chooseTheme: "Tema seç",
      selectedTheme: "Seçili tema",
      themeGym: "Klasik",
      themeSunset: "Gün Batımı",
      themeNeon: "Neon Gece",
      themeRooftop: "Çatı Sahası",
      themeMinimal: "Minimal Premium",
      classicBall: "Klasik Turuncu",
      invertedBall: "Karanlık Ters",
      neonBall: "Siber Neon",
      magmaBall: "Erimiş Magma",
      watermelonBall: "Karpuz",
      goldBall: "Saf Altın",
      ghostBall: "Hayalet",
      toxicBall: "Toksik Atık",
      matrixBall: "Matrix",
      earthBall: "Dünya",
      cyberpunkBall: "Siberpunk",
      bloodMoonBall: "Kanlı Ay",
      zebraBall: "Zebra",
      sunBall: "Güneş",
      selectedSkin: "Seçili top",
      selectSkin: "Seç",
      comingSoon: "Yakında",
      comingSoonText: "Yeni toplar ve efektler sonraki güncellemede burada olacak.",
      gameOver: "Oyun Bitti",
      lastChance: "SON ŞANS",
      continueRun: "Oyuna Devam Et",
      continueRunHint: "Reklam izleyerek bu run'a kaldığın yerden devam et.",
      decisionTime: "Karar süresi",
      watchAdContinue: "Reklam İzle ve Devam Et",
      finishRun: "Bitir",
      restart: "Yeniden Başlat",
      mainMenu: "Ana Menü",
      returnMainMenu: "Ana Menüye Dön",
      paused: "Duraklatıldı",
      pauseEyebrow: "OYUN DURAKLATILDI",
      pauseHint: "Oyuna dönmek için Devam Et düğmesine bas.",
      continue: "Devam Et",
      ballStuck: "Top Sıkıştı mı?",
      retryText: "Son hoop'a dön ve oynamaya devam et.",
      retry: "Tekrar Dene",
      score: "Skor",
      best: "En İyi",
      menu: "Menü",
      shot: "ATIŞ",
      shotTimeRemaining: "Atış için {seconds} saniye kaldı",
      sound: "Ses",
      darkMode: "Karanlık Mod",
      language: "Dil",
      turkish: "Türkçe",
      english: "İngilizce",
      on: "Açık",
      off: "Kapalı",
      swish: "Deliksiz",
      wall: "Duvar",
      perfect: "Deliksiz",
      bounce: "Duvardan",
      nice: "Güzel",
      newHighScore: "YENİ REKOR!"
    },
    en: {
      arcadeEyebrow: "ARCADE BASKETBALL",
      tagline: "Drag, release, and keep climbing.",
      play: "Play",
      profile: "Profile",
      activePlayTime: "Active Play Time",
      perfectBaskets: "Perfect Baskets",
      bounceBaskets: "Bounce Baskets",
      lifetimeScore: "Lifetime Score",
      worldCoinsCollected: "World Coins Collected",
      customize: "Customize Ball",
      customizeTheme: "Customize Theme",
      settings: "Settings",
      back: "Back",
      collectionEyebrow: "BALL COLLECTION",
      chooseBall: "Choose Your Ball",
      ballCollectionHint: "A collection ready for future ball styles.",
      backgroundTheme: "Background Theme",
      coins: "Coins",
      coinBalance: "Coin balance",
      locked: "Locked",
      owned: "Owned",
      insufficientCoins: "Not enough coins",
      purchased: "Purchased",
      watchAdCoins: "Watch Ad · +25 Coins",
      rewardedUnavailable: "Ad currently unavailable",
      rewardedPending: "Opening ad…",
      rewardedCoinsGranted: "+25 coins earned",
      rewardedNotEarned: "Reward not earned",
      chooseTheme: "Choose theme",
      selectedTheme: "Selected theme",
      themeGym: "Classic",
      themeSunset: "Sunset",
      themeNeon: "Neon Night",
      themeRooftop: "Rooftop Court",
      themeMinimal: "Minimal Premium",
      classicBall: "Classic Orange",
      invertedBall: "Dark Inverted",
      neonBall: "Neon",
      magmaBall: "Molten Magma",
      watermelonBall: "Watermelon",
      goldBall: "Pure Gold",
      ghostBall: "Phantom",
      toxicBall: "Toxic Waste",
      matrixBall: "Matrix",
      earthBall: "Earth",
      cyberpunkBall: "Cyberpunk",
      bloodMoonBall: "Blood Moon",
      zebraBall: "Zebra",
      sunBall: "Sun",
      selectedSkin: "Selected ball",
      selectSkin: "Select",
      comingSoon: "Coming Soon",
      comingSoonText: "New balls and effects will arrive here in a future update.",
      gameOver: "Game Over",
      lastChance: "LAST CHANCE",
      continueRun: "Continue Your Run",
      continueRunHint: "Watch an ad to continue this run from where you left off.",
      decisionTime: "Decision time",
      watchAdContinue: "Watch Ad and Continue",
      finishRun: "Finish",
      restart: "Restart",
      mainMenu: "Main Menu",
      returnMainMenu: "Return to Main Menu",
      paused: "Paused",
      pauseEyebrow: "GAME PAUSED",
      pauseHint: "Press Continue to return to the game.",
      continue: "Continue",
      ballStuck: "Ball Stuck?",
      retryText: "Return to your last hoop and keep playing.",
      retry: "Retry",
      score: "Score",
      best: "Best",
      menu: "Menu",
      shot: "SHOT",
      shotTimeRemaining: "{seconds} seconds remaining to shoot",
      sound: "Sound",
      darkMode: "Dark Mode",
      language: "Language",
      turkish: "Turkish",
      english: "English",
      on: "On",
      off: "Off",
      swish: "Swish",
      wall: "Wall",
      perfect: "Perfect",
      bounce: "Bounce",
      nice: "Nice",
      newHighScore: "NEW HIGH SCORE!"
    }
  };
  const HOOP_ROLE = {
    INACTIVE: "inactive",
    CURRENT: "current",
    TARGET: "target"
  };

  let dpr = 1;
  let viewW = 1;
  let viewH = 1;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let lastTime = 0;
  let audioContext = null;
  const playablesBridge = window.PlayablesBridge || null;
  let isPlayablesEnv = Boolean(playablesBridge && playablesBridge.isInPlayablesEnv());
  let platformAudioEnabled = true;
  let platformPaused = false;
  let userPaused = false;
  let platformReady = false;
  let platformBootComplete = false;
  let animationFrameId = null;
  let animationLoopGeneration = 0;
  let cloudSaveTimer = null;
  let persistenceReady = false;
  let saveDirty = false;
  let saveRevision = 0;
  let savedRevision = 0;
  let saveInFlight = false;
  let saveDrainQueued = false;
  let scoreSubmitTimer = null;
  let pendingHighScore = null;
  let settingsOrigin = "menu";
  let muted = readBooleanPreference(MUTED_KEY, false);
  let darkMode = readBooleanPreference(DARK_MODE_KEY, false);
  let language = readLanguagePreference();
  let state = "menu";
  let stats = createDefaultStats();
  let activePlaySegmentStartedAt = null;
  let score = 0;
  let best = readBestScore();
  let runStartBestScore = best;
  let cameraY = 0;
  let targetCameraY = 0;
  let simulationTime = 0;
  let shake = 0;
  let comboText = 0;
  let perfectChain = 0;
  let swishStreak = 0;
  let lastScoreGain = 1;
  let scoreFeedbackText = t("nice") + " +1";
  let lastWasPerfect = false;
  let lastWasBounce = false;
  let lastHoopSide = 1;
  let activePointer = null;
  let drag = null;
  let particles = [];
  let shotRings = [];
  let activeCoin = null;
  let coinTargetsRemaining = COIN_INTERVAL_MIN;
  let coinSpawnDue = false;
  let coinFeedback = null;
  let timedShotOpportunitiesRemaining = TIMED_SHOT_INTERVAL_MIN;
  let timedShotOpportunityProcessed = true;
  let timedShotFirstChallengeStarted = false;
  let timedShotActive = false;
  let timedShotAwaitingShotResult = false;
  let timedShotRemainingSeconds = 0;
  let timedShotInitialSeconds = 0;
  let timedShotTickMask = 0;
  let timedShotLastDisplayedSecond = null;
  let rewardedRequest = null;
  let rewardedRequestSequence = 0;
  let reviveUsed = false;
  let gameOverFinalized = false;
  let reviveOfferRemaining = 0;
  let reviveOfferActive = false;
  let hoops = [];
  let currentHoopId = 0;
  let targetHoopId = 1;
  let airborneTime = 0;
  let hasReachedSecondHoop = false;
  const transitionHistory = {
    lastDifficulty: "easy",
    hardStreak: 0,
    lastWasLongShot: false,
    lastWasNear: false,
    lastWasEdge: false
  };
  const highScoreCelebration = {
    eligibleThisRun: best > 0,
    hasCelebratedThisRun: false,
    elapsed: 0,
    active: false,
    confetti: []
  };
  let selectedBallSkinId = readBallSkinPreference();
  let selectedThemeId = readThemePreference();
  let coins = 0;
  let ownedBallSkins = new Set(["classic"]);
  let ownedThemes = new Set(["gym"]);
  const economyStatusTimers = { ball: null, theme: null };
  const ballEffects = {
    selectedPreset: BALL_SKINS[selectedBallSkinId]?.effectPreset || "classic",
    trailCooldown: 0
  };

  const ball = {
    x: WORLD_W * 0.5,
    y: WORLD_H - 172,
    prevX: WORLD_W * 0.5,
    prevY: WORLD_H - 172,
    vx: 0,
    vy: 0,
    r: BALL_RADIUS,
    held: true,
    touchedHoop: false,
    touchedWall: false,
    scoredHoopId: -1,
    rotation: 0,
    angularVelocity: 0,
    settle: null,
    launchHoopId: -1
  };

  bestValue.textContent = String(best);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    viewW = Math.max(1, rect.width);
    viewH = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(viewW * dpr);
    canvas.height = Math.round(viewH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scale = Math.min(viewW / WORLD_W, viewH / WORLD_H);
    offsetX = (viewW - WORLD_W * scale) * 0.5;
    offsetY = (viewH - WORLD_H * scale) * 0.5;
    if (userPaused) draw();
  }

  function canAccumulateActivePlayTime() {
    return platformReady && !platformPaused && !userPaused && state === "playing";
  }

  function startActivePlayClock(now) {
    if (activePlaySegmentStartedAt !== null || !canAccumulateActivePlayTime()) return false;
    const timestamp = Number.isFinite(now) ? now : performance.now();
    activePlaySegmentStartedAt = timestamp;
    return true;
  }

  function commitActivePlaySegment(options) {
    if (activePlaySegmentStartedAt === null) return false;
    const config = options || {};
    const timestamp = Number.isFinite(config.now) ? config.now : performance.now();
    const elapsedMs = Math.max(0, Math.floor(timestamp - activePlaySegmentStartedAt));
    const keepRunning = Boolean(config.keepRunning) && canAccumulateActivePlayTime();
    activePlaySegmentStartedAt = keepRunning ? timestamp : null;
    if (elapsedMs <= 0) return false;
    stats.activePlayTimeMs = addSafeStat(stats.activePlayTimeMs, elapsedMs);
    return true;
  }

  function stopActivePlayClock(now) {
    return commitActivePlaySegment({ now, keepRunning: false });
  }

  function setGameState(nextState) {
    if (state === nextState) {
      startActivePlayClock();
      return false;
    }
    const activeTimeChanged = state === "playing" ? stopActivePlayClock() : false;
    state = nextState;
    startActivePlayClock();
    return activeTimeChanged;
  }

  function resetGame(toMenu) {
    userPaused = false;
    settingsOrigin = "menu";
    score = 0;
    runStartBestScore = best;
    highScoreCelebration.eligibleThisRun = runStartBestScore > 0;
    highScoreCelebration.hasCelebratedThisRun = false;
    highScoreCelebration.elapsed = 0;
    highScoreCelebration.active = false;
    highScoreCelebration.confetti = [];
    cameraY = 0;
    targetCameraY = 0;
    simulationTime = 0;
    shake = 0;
    comboText = 0;
    perfectChain = 0;
    swishStreak = 0;
    lastScoreGain = 1;
    scoreFeedbackText = t("nice") + " +1";
    lastWasPerfect = false;
    lastWasBounce = false;
    lastHoopSide = 1;
    hasReachedSecondHoop = false;
    transitionHistory.lastDifficulty = "easy";
    transitionHistory.hardStreak = 0;
    transitionHistory.lastWasLongShot = false;
    transitionHistory.lastWasNear = false;
    transitionHistory.lastWasEdge = false;
    particles = [];
    shotRings = [];
    resetCoinRun();
    resetTimedShotRun();
    reviveUsed = false;
    gameOverFinalized = false;
    reviveOfferRemaining = 0;
    reviveOfferActive = false;
    if (reviveOfferStatus) reviveOfferStatus.textContent = "";
    if (activePointer !== null && canvas.hasPointerCapture(activePointer)) {
      canvas.releasePointerCapture(activePointer);
    }
    activePointer = null;
    drag = null;
    airborneTime = 0;
    const startHoop = makeStartHoop();
    const firstTarget = makeFirstTargetHoop(startHoop);
    hoops = [startHoop, firstTarget];
    lastHoopSide = firstTarget.x >= startHoop.x ? 1 : -1;
    currentHoopId = hoops[0].id;
    targetHoopId = hoops[1].id;
    setHoopRoles(currentHoopId, targetHoopId);
    placeBallInHoop(hoops[0]);
    ball.scoredHoopId = hoops[0].id;
    updateScore();
    setGameState(toMenu ? "menu" : "playing");
    mainMenuOverlay.classList.toggle("active", state === "menu");
    profileOverlay.classList.remove("active");
    settingsOverlay.classList.remove("active");
    customizeOverlay.classList.remove("active");
    themeOverlay?.classList.remove("active");
    pauseOverlay.classList.remove("active");
    reviveOfferOverlay?.classList.remove("active");
    gameOverOverlay.classList.remove("active");
    retryOverlay.classList.remove("active");
    retryButton.blur();
    syncUiState();
    syncRewardedUi();
  }

  function makeStartHoop() {
    const startOnLeft = Math.random() < 0.5;
    const x = startOnLeft ? random(128, 154) : random(WORLD_W - 154, WORLD_W - 128);
    return makeHoop(x, WORLD_H - START_HOOP_BOTTOM_OFFSET, 0, null);
  }

  function makeFirstTargetHoop(startHoop) {
    const startOnLeft = startHoop.x < WORLD_W * 0.5;
    const x = startOnLeft ? random(252, 292) : random(128, 168);
    const y = startHoop.y - random(174, 192);
    return makeHoop(x, y, 1, startHoop);
  }

  function makeHoop(x, y, id, sourceHoop, transitionPlan) {
    const difficulty = clamp(score / 30, 0, 1);
    const features = transitionPlan?.features || { moving: false, board: false, tilt: false };
    const moving = Boolean(features.moving);
    const board = Boolean(features.board) && !moving;
    return {
      id,
      x,
      y,
      baseX: x,
      baseY: y,
      w: HOOP_WIDTH,
      boardW: 74,
      boardH: 52,
      role: HOOP_ROLE.INACTIVE,
      moving,
      board,
      sourceX: sourceHoop ? sourceHoop.x : null,
      movementType: moving && id % 8 === 0 ? "vertical" : "horizontal",
      moveAmplitude: moving ? random(22, 34) : 0,
      movePhase: Math.random() * Math.PI * 2,
      rotation: getDirectionalHoopRotation(x, id, sourceHoop, difficulty, moving || board, features.tilt),
      spawnProgress: 0,
      entranceTimer: 0,
      netAnimation: 0,
      releaseAnimation: 0,
      releaseDirectionX: 0,
      releaseDirectionY: -1,
      releaseStrength: 0
    };
  }

  function getDirectionalHoopRotation(targetX, id, sourceHoop, difficulty, hasOtherChallenge, tiltEnabled) {
    if (!tiltEnabled || id < 2 || !sourceHoop || hasOtherChallenge || !shouldTiltHoop(id, difficulty)) return 0;
    const deltaX = sourceHoop.x - targetX;
    if (Math.abs(deltaX) < 1) return 0;
    const distanceRatio = clamp(Math.abs(deltaX) / 150, 0, 1);
    const allowedMax = MIN_HOOP_TILT + (MAX_HOOP_TILT - MIN_HOOP_TILT) * difficulty;
    const magnitude = MIN_HOOP_TILT + (allowedMax - MIN_HOOP_TILT) * distanceRatio;
    return Math.sign(deltaX) * magnitude;
  }

  function shouldTiltHoop(id, difficulty) {
    if (id < 2 || difficulty < 0.2) return false;
    return id % 3 === 2 || (difficulty >= 0.7 && id % 5 === 4);
  }

  function placeBallInHoop(hoop) {
    const restingPoint = hoopToWorld(hoop, 0, NET_REST_Y);
    ball.x = restingPoint.x;
    ball.y = restingPoint.y;
    ball.prevX = ball.x;
    ball.prevY = ball.y;
    ball.vx = 0;
    ball.vy = 0;
    ball.held = true;
    ball.touchedHoop = false;
    ball.touchedWall = false;
    ball.rotation = 0;
    ball.angularVelocity = 0;
    ball.settle = null;
    ball.launchHoopId = -1;
    ballEffects.trailCooldown = 0;
    airborneTime = 0;
  }

  function startGame() {
    if (!platformReady || platformPaused || rewardedRequest) return;
    ensureAudio();
    resetGame(false);
    playGameSound("start");
  }

  function beginGameOver() {
    if (gameOverFinalized || state === "revive-offer") return false;
    consumeTimedShotChallenge();
    airborneTime = 0;
    ball.angularVelocity = 0;
    drag = null;
    if (activePointer !== null && canvas.hasPointerCapture(activePointer)) {
      canvas.releasePointerCapture(activePointer);
    }
    activePointer = null;
    if (score > 0 && !reviveUsed && !rewardedRequest && hasRewardedCapability()) {
      return beginReviveOffer();
    }
    return finalizeGameOver();
  }

  function beginReviveOffer() {
    if (score <= 0 || gameOverFinalized || reviveUsed || rewardedRequest || !hasRewardedCapability()) {
      return finalizeGameOver();
    }
    if (setGameState("revive-offer")) markSaveDirty();
    reviveOfferActive = true;
    reviveOfferRemaining = REVIVE_OFFER_DURATION;
    if (reviveOfferCountdown) reviveOfferCountdown.textContent = reviveOfferRemaining.toFixed(1);
    if (reviveOfferStatus) reviveOfferStatus.textContent = "";
    retryOverlay.classList.remove("active");
    gameOverOverlay.classList.remove("active");
    reviveOfferOverlay?.classList.add("active");
    syncUiState();
    syncRewardedUi();
    return true;
  }

  function finalizeGameOver() {
    if (gameOverFinalized) return false;
    gameOverFinalized = true;
    reviveOfferActive = false;
    reviveOfferRemaining = 0;
    const activeTimeChanged = setGameState("gameover");
    if (activeTimeChanged) markSaveDirty();
    airborneTime = 0;
    ball.angularVelocity = 0;
    const previousBest = best;
    best = Math.max(best, score);
    writeBestScore(best, best > previousBest);
    flushScoreSubmission();
    void flushPlatformSave();
    bestValue.textContent = String(best);
    finalScore.textContent = t("score") + " " + score;
    reviveOfferOverlay?.classList.remove("active");
    retryOverlay.classList.remove("active");
    gameOverOverlay.classList.add("active");
    syncUiState();
    syncRewardedUi();
    playGameSound("gameover");
    return true;
  }

  function resumeFromRewardedContinue(restartLoop) {
    if (gameOverFinalized || reviveUsed || state !== "revive-offer") return false;
    const currentHoop = getHoopById(currentHoopId);
    if (!currentHoop) return finalizeGameOver();
    reviveUsed = true;
    reviveOfferActive = false;
    reviveOfferRemaining = 0;
    swishStreak = 0;
    perfectChain = 0;
    comboText = 0;
    lastScoreGain = 1;
    scoreFeedbackText = t("nice") + " +1";
    lastWasPerfect = false;
    lastWasBounce = false;
    shake = 0;
    particles = [];
    shotRings = [];
    coinFeedback = null;
    highScoreCelebration.elapsed = 0;
    highScoreCelebration.active = false;
    highScoreCelebration.confetti = [];
    drag = null;
    if (activePointer !== null && canvas.hasPointerCapture(activePointer)) {
      canvas.releasePointerCapture(activePointer);
    }
    activePointer = null;
    placeBallInHoop(currentHoop);
    ball.scoredHoopId = currentHoopId;
    setHoopRoles(currentHoopId, targetHoopId);
    setGameState("playing");
    reviveOfferOverlay?.classList.remove("active");
    retryOverlay.classList.remove("active");
    gameOverOverlay.classList.remove("active");
    syncUiState();
    syncRewardedUi();
    if (restartLoop !== false && !platformPaused) restartAnimationLoop();
    return true;
  }

  function recoverFirstTransition() {
    const startHoop = getHoopById(0);
    if (!startHoop) {
      resetGame(false);
      return;
    }
    swishStreak = 0;
    perfectChain = 0;
    comboText = 0;
    shake = 0;
    particles = [];
    shotRings = [];
    drag = null;
    if (activePointer !== null && canvas.hasPointerCapture(activePointer)) {
      canvas.releasePointerCapture(activePointer);
    }
    activePointer = null;
    cameraY = 0;
    targetCameraY = 0;
    placeBallInHoop(startHoop);
    ball.scoredHoopId = startHoop.id;
    setHoopRoles(currentHoopId, targetHoopId);
    setGameState("playing");
    gameOverOverlay.classList.remove("active");
    retryOverlay.classList.remove("active");
    playGameSound("retry");
  }

  function updateScore() {
    scoreValue.textContent = String(score);
    bestValue.textContent = String(Math.max(best, score));
  }

  function getHoopWidth() {
    return HOOP_WIDTH;
  }

  function getDifficultyTier(scoreValue, targetId) {
    if (targetId <= TUTORIAL_LAST_TARGET_ID) {
      return {
        ...DIFFICULTY_TIERS[0],
        name: "tutorial",
        tutorial: true
      };
    }
    const tier = DIFFICULTY_TIERS.find((entry) => scoreValue >= entry.minScore && scoreValue <= entry.maxScore)
      || DIFFICULTY_TIERS[DIFFICULTY_TIERS.length - 1];
    return { ...tier, tutorial: false };
  }

  function chooseTransitionDifficulty(tier) {
    if (tier.tutorial || tier.maxBudget === 0) return "easy";
    const weights = { ...tier.weights };
    if (
      transitionHistory.lastDifficulty === "hard"
      || transitionHistory.hardStreak >= MAX_HARD_TRANSITION_STREAK
    ) {
      weights.hard = 0;
    }
    const total = weights.easy + weights.medium + weights.hard;
    if (total <= 0) return "easy";
    const roll = Math.random() * total;
    if (roll < weights.easy) return "easy";
    if (roll < weights.easy + weights.medium) return "medium";
    return "hard";
  }

  function getVarietyChance(baseChance, maxChance, unlockScore) {
    const progress = clamp(
      (score - unlockScore) / Math.max(1, VARIETY_CHANCE_FULL_SCORE - unlockScore),
      0,
      1
    );
    return baseChance + (maxChance - baseChance) * progress;
  }

  function getSpawnDirection(source) {
    return source.x < WORLD_W * 0.5 ? 1 : -1;
  }

  function getAvailableHorizontalGap(source, direction) {
    const minX = WALL_INSET + HOOP_WALL_CLEARANCE;
    const maxX = WORLD_W - WALL_INSET - HOOP_WALL_CLEARANCE;
    return direction > 0 ? maxX - source.x : source.x - minX;
  }

  function chooseWideGeometry(availableHorizontalGap) {
    const choices = [];
    if (availableHorizontalGap >= SPAWN_GAP_PROFILES.wideHorizontal.minX) choices.push("wideHorizontal");
    if (availableHorizontalGap >= SPAWN_GAP_PROFILES.wideVertical.minX) choices.push("wideVertical");
    if (availableHorizontalGap >= SPAWN_GAP_PROFILES.wideBalanced.minX) choices.push("wideBalanced");
    if (!choices.length) return null;
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function chooseNormalGeometry() {
    const nearOffCooldown = MAX_CONSECUTIVE_NEAR_TRANSITIONS > 0 && !transitionHistory.lastWasNear;
    return nearOffCooldown && Math.random() < NORMAL_NEAR_MAX_SHARE ? "normalNear" : "normalFar";
  }

  function chooseTargetChallenge(targetId, geometryName, remainingBudget) {
    const features = { moving: false, board: false, tilt: false };
    if (
      remainingBudget < 1
      || geometryName === "longShot"
      || geometryName === "edge"
    ) return features;

    const difficulty = clamp(score / 30, 0, 1);
    const movingEligible = score >= 9 && targetId % 4 === 0;
    const boardEligible = score >= 7 && targetId % 3 === 0 && !movingEligible;
    const tiltEligible = shouldTiltHoop(targetId, difficulty);

    if (geometryName === "wideVertical" || geometryName === "wideBalanced") return features;
    if (geometryName === "wideHorizontal") {
      if (boardEligible) features.board = true;
      else if (tiltEligible) features.tilt = true;
      return features;
    }

    if (movingEligible) features.moving = true;
    else if (boardEligible) features.board = true;
    else if (tiltEligible) features.tilt = true;
    return features;
  }

  function getTransitionBudgetCost(plan) {
    return Number(plan.wide) * CHALLENGE_COSTS.wide
      + Number(plan.edge) * CHALLENGE_COSTS.edge
      + Number(plan.longShot) * CHALLENGE_COSTS.longShot
      + Number(plan.features.moving) * CHALLENGE_COSTS.moving
      + Number(plan.features.board) * CHALLENGE_COSTS.board
      + Number(plan.features.tilt) * CHALLENGE_COSTS.tilt;
  }

  function createTransitionPlan(source, targetId) {
    const tier = getDifficultyTier(score, targetId);
    const difficulty = chooseTransitionDifficulty(tier);
    const budgetLimit = Math.min(tier.maxBudget, DIFFICULTY_BUDGET_CAPS[difficulty]);
    const direction = getSpawnDirection(source);
    const availableHorizontalGap = getAvailableHorizontalGap(source, direction);
    let geometryName = tier.tutorial ? "tutorial" : chooseNormalGeometry();
    let longShot = false;
    let wide = false;
    let edge = false;

    if (
      !tier.tutorial
      && !hasBoard(source)
      && score >= EDGE_TRANSITION_UNLOCK_SCORE
      && budgetLimit >= CHALLENGE_COSTS.edge
      && (EDGE_TRANSITION_COOLDOWN <= 0 || !transitionHistory.lastWasEdge)
      && Math.random() < getVarietyChance(EDGE_TRANSITION_BASE_CHANCE, EDGE_TRANSITION_MAX_CHANCE, EDGE_TRANSITION_UNLOCK_SCORE)
    ) {
      geometryName = "edge";
      edge = true;
    }

    if (!edge && !tier.tutorial && budgetLimit >= CHALLENGE_COSTS.longShot) {
      const longShotAvailable = availableHorizontalGap >= SPAWN_GAP_PROFILES.longShot.minX;
      const longShotOffCooldown = LONG_SHOT_COOLDOWN_TRANSITIONS <= 0 || !transitionHistory.lastWasLongShot;
      if (
        score >= LONG_SHOT_UNLOCK_SCORE
        && longShotAvailable
        && longShotOffCooldown
        && Math.random() < getVarietyChance(LONG_SHOT_BASE_CHANCE, LONG_SHOT_MAX_CHANCE, LONG_SHOT_UNLOCK_SCORE)
      ) {
        geometryName = "longShot";
        longShot = true;
      }
    }

    if (!edge && !longShot && !tier.tutorial && budgetLimit >= CHALLENGE_COSTS.wide && score >= WIDE_GAP_UNLOCK_SCORE) {
      if (Math.random() < getVarietyChance(WIDE_GAP_BASE_CHANCE, WIDE_GAP_MAX_CHANCE, WIDE_GAP_UNLOCK_SCORE)) {
        const wideGeometry = chooseWideGeometry(availableHorizontalGap);
        if (wideGeometry) {
          geometryName = wideGeometry;
          wide = true;
        }
      }
    }

    const geometryCost = Number(wide) * CHALLENGE_COSTS.wide
      + Number(edge) * CHALLENGE_COSTS.edge
      + Number(longShot) * CHALLENGE_COSTS.longShot;
    const features = chooseTargetChallenge(targetId, geometryName, budgetLimit - geometryCost);
    const plan = {
      tier: tier.name,
      difficulty,
      budgetLimit,
      budget: 0,
      geometryName,
      profile: SPAWN_GAP_PROFILES[geometryName],
      direction,
      wide,
      edge,
      longShot,
      fallback: false,
      features
    };
    plan.budget = getTransitionBudgetCost(plan);
    return plan;
  }

  function createFallbackTransitionPlan(source) {
    return {
      tier: getDifficultyTier(score, source.id + 1).name,
      difficulty: "easy",
      budgetLimit: 0,
      budget: 0,
      geometryName: "fallback",
      profile: SPAWN_GAP_PROFILES.fallback,
      direction: getSpawnDirection(source),
      wide: false,
      edge: false,
      longShot: false,
      fallback: true,
      features: { moving: false, board: false, tilt: false }
    };
  }

  function sampleHoopCandidate(source, targetId, plan) {
    if (plan.edge) {
      const edgeCenterInset = WALL_INSET + HOOP_WIDTH * 0.5 + RIM_RADIUS + EDGE_HOOP_WALL_GAP;
      const inwardJitter = random(0, EDGE_HOOP_INWARD_JITTER);
      const x = plan.direction > 0
        ? WORLD_W - edgeCenterInset - inwardJitter
        : edgeCenterInset + inwardJitter;
      const yLift = random(plan.profile.minY, plan.profile.maxY);
      return makeHoop(x, source.y - yLift, targetId, source, plan);
    }
    const minX = WALL_INSET + HOOP_WALL_CLEARANCE;
    const maxX = WORLD_W - WALL_INSET - HOOP_WALL_CLEARANCE;
    const xDrift = random(plan.profile.minX, plan.profile.maxX);
    const yLift = random(plan.profile.minY, plan.profile.maxY);
    const x = clamp(source.x + plan.direction * xDrift, minX, maxX);
    return makeHoop(x, source.y - yLift, targetId, source, plan);
  }

  function isReachableTransition(source, target) {
    const targetPositions = [{ x: target.baseX, y: target.baseY }];
    if (target.moving && target.movementType === "horizontal") {
      targetPositions.push(
        { x: target.baseX - target.moveAmplitude, y: target.baseY },
        { x: target.baseX + target.moveAmplitude, y: target.baseY }
      );
    } else if (target.moving && target.movementType === "vertical") {
      targetPositions.push(
        { x: target.baseX, y: target.baseY - target.moveAmplitude },
        { x: target.baseX, y: target.baseY + target.moveAmplitude }
      );
    }
    return targetPositions.every((position) => isReachableTargetPosition(source, target, position));
  }

  function isReachableTargetPosition(source, target, position) {
    const start = hoopToWorld(source, 0, NET_REST_Y);
    const targetAtPosition = { ...target, x: position.x, y: position.y };
    const direction = position.x >= start.x ? 1 : -1;
    const mouthY = 4;
    const insideLimit = target.w * 0.35;

    for (const pullRatio of REACHABILITY_PULL_RATIOS) {
      const pullLength = MAX_PULL * pullRatio;
      const speed = pullLength * LAUNCH_POWER_SCALE * getShotPowerBoost(pullRatio);
      for (const elevationDegrees of REACHABILITY_ELEVATION_DEGREES) {
        const elevation = elevationDegrees * (Math.PI / 180);
        let x = start.x;
        let y = start.y;
        let vx = direction * Math.cos(elevation) * speed;
        let vy = -Math.sin(elevation) * speed;

        for (let elapsed = 0; elapsed < REACHABILITY_MAX_TIME; elapsed += REACHABILITY_STEP) {
          const previousX = x;
          const previousY = y;
          vy += GRAVITY * REACHABILITY_STEP;
          vx *= Math.pow(AIR_DRAG, REACHABILITY_STEP * 60);
          vy *= Math.pow(AIR_DRAG, REACHABILITY_STEP * 60);
          x += vx * REACHABILITY_STEP;
          y += vy * REACHABILITY_STEP;

          const previousLocal = worldToHoop(targetAtPosition, previousX, previousY);
          const local = worldToHoop(targetAtPosition, x, y);
          if (local.y <= previousLocal.y || previousLocal.y > mouthY || local.y < mouthY) continue;
          const localDeltaY = local.y - previousLocal.y;
          const ratio = localDeltaY < 0.001 ? 1 : clamp((mouthY - previousLocal.y) / localDeltaY, 0, 1);
          const xAtMouth = previousLocal.x + (local.x - previousLocal.x) * ratio;
          if (Math.abs(xAtMouth) < insideLimit) return true;
        }
      }
    }
    return false;
  }

  function nextHoop() {
    const last = hoops[hoops.length - 1];
    const targetId = last.id + 1;
    let transitionPlan = createTransitionPlan(last, targetId);
    lastHoopSide = transitionPlan.direction;
    let hoop = null;

    for (let attempt = 0; attempt < SPAWN_ATTEMPTS; attempt += 1) {
      const candidate = sampleHoopCandidate(last, targetId, transitionPlan);
      if (isFairSpawn(last, candidate, transitionPlan)) {
        hoop = candidate;
        break;
      }
    }

    if (!hoop) {
      transitionPlan = createFallbackTransitionPlan(last);
      const minX = WALL_INSET + HOOP_WALL_CLEARANCE;
      const maxX = WORLD_W - WALL_INSET - HOOP_WALL_CLEARANCE;
      const fallbackX = clamp(last.x + transitionPlan.direction * FALLBACK_HORIZONTAL_GAP, minX, maxX);
      hoop = makeHoop(fallbackX, last.y - FALLBACK_VERTICAL_GAP, targetId, last, transitionPlan);
    }

    commitTransitionHistory(transitionPlan);
    hoops.push(hoop);
    if (hoops.length > 5) hoops.shift();
    return hoop;
  }

  function rollCoinInterval() {
    return Math.floor(random(COIN_INTERVAL_MIN, COIN_INTERVAL_MAX + 1));
  }

  function resetCoinRun() {
    activeCoin = null;
    coinTargetsRemaining = rollCoinInterval();
    coinSpawnDue = false;
    coinFeedback = null;
  }

  function scheduleNextCoin() {
    coinTargetsRemaining = rollCoinInterval();
    coinSpawnDue = false;
  }

  function isCoinEligibleTarget(hoop) {
    return Boolean(
      hoop
      && hoop.id > TUTORIAL_LAST_TARGET_ID
      && !hoop.moving
      && !hoop.board
      && Math.abs(hoop.rotation) < 0.001
    );
  }

  function spawnCoinForTarget(hoop) {
    if (activeCoin || !isCoinEligibleTarget(hoop)) return false;
    activeCoin = {
      targetHoopId: hoop.id,
      localX: 0,
      localY: COIN_LOCAL_Y,
      r: COIN_RADIUS
    };
    coinTargetsRemaining = 0;
    coinSpawnDue = false;
    return true;
  }

  function expireCoinForCompletedTarget(targetId) {
    if (!activeCoin || activeCoin.targetHoopId !== targetId) return false;
    activeCoin = null;
    scheduleNextCoin();
    return true;
  }

  function advanceCoinSchedule(completedTarget, nextTarget, intervalJustReset) {
    if (intervalJustReset || activeCoin || !completedTarget || completedTarget.id <= TUTORIAL_LAST_TARGET_ID) return;
    if (!coinSpawnDue) {
      coinTargetsRemaining = Math.max(0, coinTargetsRemaining - 1);
      if (coinTargetsRemaining === 0) coinSpawnDue = true;
    }
    if (coinSpawnDue) spawnCoinForTarget(nextTarget);
  }

  function getActiveCoinWorldPosition() {
    if (!activeCoin) return null;
    const target = getHoopById(activeCoin.targetHoopId);
    if (!target) return null;
    const position = hoopToWorld(target, activeCoin.localX, activeCoin.localY);
    return { x: position.x, y: position.y, r: activeCoin.r };
  }

  function segmentIntersectsCircle(x1, y1, x2, y2, cx, cy, radius) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
    const ratio = lengthSquared > 0
      ? clamp(((cx - x1) * dx + (cy - y1) * dy) / lengthSquared, 0, 1)
      : 0;
    const closestX = x1 + dx * ratio;
    const closestY = y1 + dy * ratio;
    const distanceX = closestX - cx;
    const distanceY = closestY - cy;
    return distanceX * distanceX + distanceY * distanceY <= radius * radius;
  }

  function detectActiveCoinCollection() {
    if (!activeCoin || activeCoin.targetHoopId !== targetHoopId) return;
    const position = getActiveCoinWorldPosition();
    if (!position) return;
    if (!segmentIntersectsCircle(
      ball.prevX,
      ball.prevY,
      ball.x,
      ball.y,
      position.x,
      position.y,
      ball.r + position.r
    )) return;
    collectActiveCoin(position);
  }

  function collectActiveCoin(position) {
    if (!activeCoin) return false;
    activeCoin = null;
    coins = Math.min(Number.MAX_SAFE_INTEGER, normalizeCoins(coins) + 1);
    stats.worldCoinsCollected = addSafeStat(stats.worldCoinsCollected, 1);
    scheduleNextCoin();
    coinFeedback = {
      x: position.x,
      y: position.y,
      life: COIN_FEEDBACK_DURATION,
      maxLife: COIN_FEEDBACK_DURATION
    };
    emitCoinCollectEffect(position.x, position.y);
    syncEconomyBalances();
    schedulePlatformSave();
    return true;
  }

  function emitCoinCollectEffect(x, y) {
    const colors = ["#ffe48a", "#f6bd2f", "#d78b12"];
    for (let i = 0; i < COIN_COLLECT_PARTICLE_COUNT; i += 1) {
      const angle = (Math.PI * 2 * i) / COIN_COLLECT_PARTICLE_COUNT;
      const speed = 42 + (i % 3) * 8;
      pushParticle({
        type: "coinSpark",
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 24,
        gravity: 100,
        life: 0.38,
        maxLife: 0.38,
        size: 2.8,
        shrinkRate: 6,
        color: colors[i % colors.length]
      });
    }
  }

  function pushParticle(particle) {
    if (particles.length >= MAX_PARTICLES) {
      particles.splice(0, particles.length - MAX_PARTICLES + 1);
    }
    particles.push(particle);
  }

  function pushShotRing(ring) {
    if (shotRings.length >= MAX_SHOT_RINGS) {
      shotRings.splice(0, shotRings.length - MAX_SHOT_RINGS + 1);
    }
    shotRings.push(ring);
  }

  function commitTransitionHistory(plan) {
    transitionHistory.lastDifficulty = plan.difficulty;
    transitionHistory.hardStreak = plan.difficulty === "hard" ? transitionHistory.hardStreak + 1 : 0;
    transitionHistory.lastWasLongShot = LONG_SHOT_COOLDOWN_TRANSITIONS > 0 && plan.longShot;
    transitionHistory.lastWasNear = plan.geometryName === "normalNear";
    transitionHistory.lastWasEdge = EDGE_TRANSITION_COOLDOWN > 0 && plan.edge;
  }

  function isFairSpawn(source, target, plan) {
    const horizontalGap = Math.abs(target.x - source.x);
    const verticalGap = source.y - target.y;
    if (horizontalGap < plan.profile.minX || horizontalGap > plan.profile.maxX) return false;
    if (verticalGap < plan.profile.minY || verticalGap > plan.profile.maxY) return false;

    const targetChallengeCost = Number(target.moving) * CHALLENGE_COSTS.moving
      + Number(target.board) * CHALLENGE_COSTS.board
      + Number(Math.abs(target.rotation) > 0.001) * CHALLENGE_COSTS.tilt;
    const totalBudget = Number(plan.wide) * CHALLENGE_COSTS.wide
      + Number(plan.edge) * CHALLENGE_COSTS.edge
      + Number(plan.longShot) * CHALLENGE_COSTS.longShot
      + targetChallengeCost;
    if (totalBudget > plan.budgetLimit || totalBudget !== plan.budget) return false;
    if (plan.longShot && targetChallengeCost > 0) return false;
    if (plan.longShot && Math.hypot(horizontalGap, verticalGap) < LONG_SHOT_MIN_CENTER_DISTANCE) return false;
    if (plan.wide && targetChallengeCost > 1) return false;
    if (plan.edge && (hasBoard(source) || hasBoard(target))) return false;
    if (plan.edge && (plan.wide || plan.longShot || targetChallengeCost > 0)) return false;
    if (plan.geometryName === "normalNear" && Math.hypot(horizontalGap, verticalGap) < NORMAL_NEAR_MIN_CENTER_DISTANCE) return false;
    if (targetChallengeCost && verticalGap > CHALLENGED_MAX_VERTICAL_GAP) return false;

    if (target.moving && (target.board || Math.abs(target.rotation) > 0.001)) return false;
    if (target.board && Math.abs(target.rotation) > 0.001) return false;

    if (target.moving && target.movementType === "horizontal") {
      if (target.baseX - target.moveAmplitude < WALL_INSET + HOOP_WALL_CLEARANCE) return false;
      if (target.baseX + target.moveAmplitude > WORLD_W - WALL_INSET - HOOP_WALL_CLEARANCE) return false;
    }
    if (target.moving && target.movementType === "vertical") {
      if (verticalGap - target.moveAmplitude < 142 || verticalGap + target.moveAmplitude > 210) return false;
    }
    if (!plan.wide && !plan.edge && !plan.longShot && !target.moving) return true;
    return isReachableTransition(source, target);
  }

  function screenToWorld(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left - offsetX) / scale,
      y: (clientY - rect.top - offsetY) / scale + cameraY
    };
  }

  function clearPointerDrag(pointerId) {
    if (pointerId !== null && canvas.hasPointerCapture(pointerId)) {
      canvas.releasePointerCapture(pointerId);
    }
    drag = null;
    activePointer = null;
  }

  function onPointerDown(event) {
    if (!platformReady || platformPaused || userPaused || rewardedRequest || state !== "playing" || activePointer !== null) return;
    const settleCanBeSkipped = ball.settle && ball.settle.elapsed >= BALL_SETTLE_INPUT_DELAY;
    if (!ball.held && !settleCanBeSkipped) return;
    const p = screenToWorld(event.clientX, event.clientY);
    if (settleCanBeSkipped) finishBallSettle();
    event.preventDefault();
    activePointer = event.pointerId;
    canvas.setPointerCapture(activePointer);
    drag = {
      pointerStartX: p.x,
      pointerStartY: p.y,
      pointerCurrentX: p.x,
      pointerCurrentY: p.y
    };
  }

  function onPointerMove(event) {
    if (event.pointerId !== activePointer || !drag) return;
    event.preventDefault();
    const p = screenToWorld(event.clientX, event.clientY);
    drag.pointerCurrentX = p.x;
    drag.pointerCurrentY = p.y;
  }

  function onPointerUp(event) {
    if (event.pointerId !== activePointer) return;
    event.preventDefault();
    const pull = drag ? getPullVector() : null;
    if (pull && pull.len > MIN_SHOT_PULL) {
      const impulse = LAUNCH_POWER_SCALE * getShotPowerBoost(pull.ratio);
      ball.vx = pull.x * pull.power * impulse;
      ball.vy = pull.y * pull.power * impulse;
      ball.held = false;
      ball.touchedHoop = false;
      ball.touchedWall = false;
      ball.launchHoopId = currentHoopId;
      const spinDirection = Math.sign(ball.vx) || 1;
      ball.angularVelocity = spinDirection * clamp(Math.abs(ball.vx) * 0.012, 5, 12);
      airborneTime = 0;
      const currentHoop = getHoopById(currentHoopId);
      if (currentHoop) playHoopReleaseAnimation(currentHoop, pull);
      emitShotRings(pull);
      playGameSound("shot");
    }
    clearPointerDrag(event.pointerId);
  }

  function onPointerCancel(event) {
    if (event.pointerId !== activePointer) return;
    event.preventDefault();
    clearPointerDrag(event.pointerId);
  }

  function getPullVector() {
    if (!drag) return { x: 0, y: 0, len: 0, ratio: 0, power: 0 };
    const rawX = drag.pointerStartX - drag.pointerCurrentX;
    const rawY = drag.pointerStartY - drag.pointerCurrentY;
    const len = Math.min(Math.hypot(rawX, rawY), MAX_PULL);
    const angle = Math.atan2(rawY, rawX);
    const ratio = len / MAX_PULL;
    const easedLen = MAX_PULL * Math.pow(ratio, PULL_CURVE_EXPONENT);
    return {
      x: Math.cos(angle) * easedLen,
      y: Math.sin(angle) * easedLen,
      len,
      ratio,
      power: 1
    };
  }

  function rollTimedShotOpportunityInterval() {
    return Math.floor(random(TIMED_SHOT_INTERVAL_MIN, TIMED_SHOT_INTERVAL_MAX + 1));
  }

  function getTimedShotDuration(scoreValue) {
    const scoreSteps = Math.floor((Math.max(TIMED_SHOT_START_SCORE, scoreValue) - TIMED_SHOT_START_SCORE) / TIMED_SHOT_SCORE_STEP);
    return clamp(TIMED_SHOT_MAX_SECONDS - scoreSteps, TIMED_SHOT_MIN_SECONDS, TIMED_SHOT_MAX_SECONDS);
  }

  function hideTimedShotHud() {
    timedShotLastDisplayedSecond = null;
    if (!timedShotHud) return;
    timedShotHud.hidden = true;
    timedShotHud.classList.remove("warning", "critical");
    timedShotHud.removeAttribute("aria-label");
  }

  function syncTimedShotHud(force) {
    if (!timedShotHud || !timedShotValue) return;
    if (!timedShotActive) {
      hideTimedShotHud();
      return;
    }

    const displaySeconds = Math.max(0, Math.ceil(timedShotRemainingSeconds));
    timedShotHud.hidden = false;
    if (!force && displaySeconds === timedShotLastDisplayedSecond) return;

    timedShotLastDisplayedSecond = displaySeconds;
    timedShotHud.classList.toggle("warning", displaySeconds <= 5 && displaySeconds > 3);
    timedShotHud.classList.toggle("critical", displaySeconds <= 3);
    timedShotValue.textContent = String(displaySeconds);
    timedShotHud.setAttribute(
      "aria-label",
      t("shotTimeRemaining").replace("{seconds}", String(displaySeconds))
    );
  }

  function resetTimedShotRun() {
    timedShotOpportunitiesRemaining = rollTimedShotOpportunityInterval();
    timedShotOpportunityProcessed = true;
    timedShotFirstChallengeStarted = false;
    timedShotActive = false;
    timedShotAwaitingShotResult = false;
    timedShotRemainingSeconds = 0;
    timedShotInitialSeconds = 0;
    timedShotTickMask = 0;
    hideTimedShotHud();
  }

  function startTimedShotChallenge() {
    if (timedShotActive || state !== "playing" || score < TIMED_SHOT_START_SCORE) return false;
    timedShotInitialSeconds = getTimedShotDuration(score);
    timedShotRemainingSeconds = timedShotInitialSeconds;
    timedShotTickMask = 0;
    timedShotLastDisplayedSecond = null;
    timedShotActive = true;
    timedShotAwaitingShotResult = false;
    syncTimedShotHud(true);
    return true;
  }

  function processTimedShotOpportunity() {
    if (timedShotOpportunityProcessed) return false;
    timedShotOpportunityProcessed = true;
    if (timedShotActive || score < TIMED_SHOT_START_SCORE) return false;

    if (!timedShotFirstChallengeStarted) {
      const started = startTimedShotChallenge();
      if (started) timedShotFirstChallengeStarted = true;
      return started;
    }

    timedShotOpportunitiesRemaining = Math.max(0, timedShotOpportunitiesRemaining - 1);
    if (timedShotOpportunitiesRemaining > 0) return false;
    return startTimedShotChallenge();
  }

  function consumeTimedShotChallenge() {
    if (!timedShotActive) return false;
    timedShotActive = false;
    timedShotAwaitingShotResult = false;
    timedShotRemainingSeconds = 0;
    timedShotInitialSeconds = 0;
    timedShotTickMask = 0;
    timedShotOpportunitiesRemaining = rollTimedShotOpportunityInterval();
    hideTimedShotHud();
    return true;
  }

  function playTimedShotTick(seconds) {
    try {
      playGameSound("countdownTick", { seconds });
    } catch (error) {
      // Procedural audio is optional and must never block the countdown.
    }
  }

  function consumeCrossedTimedShotTicks(previousSeconds, nextSeconds) {
    let lowestCrossedThreshold = null;
    for (let index = 0; index < TIMED_SHOT_TICK_THRESHOLDS.length; index += 1) {
      const threshold = TIMED_SHOT_TICK_THRESHOLDS[index];
      const bit = 1 << index;
      if ((timedShotTickMask & bit) !== 0) continue;
      if (previousSeconds > threshold && nextSeconds <= threshold) {
        timedShotTickMask |= bit;
        lowestCrossedThreshold = threshold;
      }
    }
    if (lowestCrossedThreshold !== null) playTimedShotTick(lowestCrossedThreshold);
  }

  function updateTimedShotCountdown(dt) {
    if (!timedShotActive || timedShotAwaitingShotResult) return false;
    const previousSeconds = timedShotRemainingSeconds;
    const elapsedSeconds = Number.isFinite(dt) ? Math.max(0, dt) : 0;
    timedShotRemainingSeconds = Math.max(0, previousSeconds - elapsedSeconds);
    consumeCrossedTimedShotTicks(previousSeconds, timedShotRemainingSeconds);
    syncTimedShotHud(false);
    if (timedShotRemainingSeconds > 0) return false;

    if (!ball.held && !ball.settle) {
      timedShotAwaitingShotResult = true;
      return false;
    }

    consumeTimedShotChallenge();
    clearPointerDrag(activePointer);
    beginGameOver();
    return true;
  }

  function update(dt) {
    if (state === "revive-offer") {
      updateReviveOffer(dt);
      return;
    }
    if (rewardedRequest) return;

    for (const hoop of hoops) {
      hoop.entranceTimer = Math.min(1, (hoop.entranceTimer ?? hoop.spawnProgress ?? 1) + dt / HOOP_SPAWN_DURATION);
      hoop.spawnProgress = hoop.entranceTimer;
      hoop.netAnimation = Math.max(0, hoop.netAnimation - dt);
      hoop.releaseAnimation = Math.max(0, hoop.releaseAnimation - dt);
    }

    if (state === "playing") {
      if (updateTimedShotCountdown(dt)) return;
      simulationTime += dt;
      for (const hoop of hoops) {
        if (hoop.role !== HOOP_ROLE.INACTIVE && hoop.moving) {
          const wave = Math.sin(simulationTime * 1.8 + hoop.movePhase) * hoop.moveAmplitude;
          if (hoop.movementType === "vertical") {
            hoop.x = hoop.baseX;
            hoop.y = hoop.baseY + wave;
          } else {
            hoop.x = clamp(
              hoop.baseX + wave,
              WALL_INSET + HOOP_WALL_CLEARANCE,
              WORLD_W - WALL_INSET - HOOP_WALL_CLEARANCE
            );
            hoop.y = hoop.baseY;
          }
        }
      }

      if (ball.settle) {
        updateBallSettle(dt);
      } else if (!ball.held) {
        updateAirborneBall(dt);
      }

      if (state === "revive-offer") return;

      const targetHoop = getHoopById(targetHoopId) || hoops[hoops.length - 1];
      const leadY = ball.held || ball.settle
        ? ball.y - WORLD_H * 0.62
        : Math.min(ball.y - WORLD_H * 0.54, targetHoop.y - WORLD_H * 0.38);
      targetCameraY = Math.min(0, leadY);
      cameraY += (targetCameraY - cameraY) * Math.min(1, dt * 4.2);
    }

    particles = particles.filter((p) => p.life > 0);
    for (const p of particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += (p.gravity ?? 520) * dt;
      if (p.type !== "ring") p.size = Math.max(0, p.size - (p.shrinkRate ?? 12) * dt);
    }
    for (const ring of shotRings) {
      if (ring.delay > 0) {
        ring.delay -= dt;
        continue;
      }
      ring.life -= dt;
      ring.x += ring.vx * dt;
      ring.y += ring.vy * dt;
    }
    shotRings = shotRings.filter((ring) => ring.life > 0);
    updateHighScoreCelebration(dt);
    shake = Math.max(0, shake - dt * 26);
    comboText = Math.max(0, comboText - dt);
    if (coinFeedback) {
      coinFeedback.life -= dt;
      if (coinFeedback.life <= 0) coinFeedback = null;
    }
  }

  function updateAirborneBall(dt) {
    airborneTime += dt;
    updateBallEffects(dt);
    ball.prevX = ball.x;
    ball.prevY = ball.y;
    ball.vy += GRAVITY * dt;
    ball.vx *= Math.pow(AIR_DRAG, dt * 60);
    ball.vy *= Math.pow(AIR_DRAG, dt * 60);
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    detectActiveCoinCollection();

    if (ball.x - ball.r < WALL_INSET) {
      ball.x = WALL_INSET + ball.r;
      ball.vx = Math.abs(ball.vx) * 0.66;
      registerWallTouch();
    } else if (ball.x + ball.r > WORLD_W - WALL_INSET) {
      ball.x = WORLD_W - WALL_INSET - ball.r;
      ball.vx = -Math.abs(ball.vx) * 0.66;
      registerWallTouch();
    }

    updateLaunchHoopSafety();
    detectHoopState();
    if (state !== "playing") return;
    if (!ball.held && !ball.settle) collideHoops();

    if (!ball.settle && ball.y - cameraY > WORLD_H + 90) {
      if (!hasReachedSecondHoop && currentHoopId === 0) recoverFirstTransition();
      else beginGameOver();
    } else if (!ball.settle && !ball.held && airborneTime >= AIRBORNE_RETRY_DELAY) {
      if (timedShotAwaitingShotResult) beginGameOver();
      else showRetry();
    }
  }

  function playHoopReleaseAnimation(hoop, pull) {
    const directionLength = Math.hypot(pull.x, pull.y) || 1;
    hoop.netAnimation = 0;
    hoop.releaseAnimation = HOOP_RELEASE_DURATION;
    hoop.releaseDirectionX = pull.x / directionLength;
    hoop.releaseDirectionY = pull.y / directionLength;
    hoop.releaseStrength = clamp(pull.ratio, 0.35, 1);
  }

  function emitShotRings(pull) {
    const length = Math.hypot(pull.x, pull.y) || 1;
    const directionX = pull.x / length;
    const directionY = pull.y / length;
    for (let i = 0; i < 3; i += 1) {
      pushShotRing({
        x: ball.x - directionX * (5 + i * 7),
        y: ball.y - directionY * (5 + i * 7),
        vx: -directionX * (22 + i * 8),
        vy: -directionY * (22 + i * 8),
        delay: i * 0.045,
        life: SHOT_RING_DURATION,
        maxLife: SHOT_RING_DURATION,
        startRadius: 7 + i * 1.5,
        growth: 30 + i * 5
      });
    }
  }

  function beginBallSettle(hoop) {
    const localBall = worldToHoop(hoop, ball.x, ball.y);
    ball.vx = 0;
    ball.vy = 0;
    ball.angularVelocity = 0;
    ball.held = false;
    timedShotOpportunityProcessed = false;
    ball.settle = {
      hoopId: hoop.id,
      elapsed: 0,
      startX: localBall.x,
      startY: clamp(localBall.y, 3, 40),
      startRotation: ball.rotation
    };
    airborneTime = 0;
  }

  function updateBallSettle(dt) {
    const settle = ball.settle;
    const hoop = settle ? getHoopById(settle.hoopId) : null;
    if (!settle || !hoop) {
      ball.settle = null;
      return;
    }

    const wasAimReady = settle.elapsed >= BALL_SETTLE_INPUT_DELAY;
    settle.elapsed += dt;
    if (!wasAimReady && settle.elapsed >= BALL_SETTLE_INPUT_DELAY) processTimedShotOpportunity();
    const progress = clamp(settle.elapsed / BALL_SETTLE_DURATION, 0, 1);
    const eased = progress * progress * (3 - 2 * progress);
    const localX = settle.startX * (1 - eased);
    const localY = settle.startY + (NET_REST_Y - settle.startY) * eased;
    const point = hoopToWorld(hoop, localX, localY);
    ball.prevX = ball.x;
    ball.prevY = ball.y;
    ball.x = point.x;
    ball.y = point.y;
    ball.rotation = settle.startRotation * (1 - eased);

    if (progress >= 1) finishBallSettle();
  }

  function finishBallSettle() {
    const hoop = ball.settle ? getHoopById(ball.settle.hoopId) : null;
    if (hoop) placeBallInHoop(hoop);
  }

  function updateLaunchHoopSafety() {
    if (ball.launchHoopId < 0) return;
    const launchHoop = getHoopById(ball.launchHoopId);
    if (!launchHoop) {
      ball.launchHoopId = -1;
      return;
    }

    const localBall = worldToHoop(launchHoop, ball.x, ball.y);
    const safeMargin = ball.r + RIM_RADIUS + 5;
    const clearedAbove = localBall.y < -safeMargin;
    const clearedSide = Math.abs(localBall.x) > launchHoop.w * 0.5 + safeMargin;
    const clearedBelow = localBall.y > 62 + safeMargin;
    if (clearedAbove || clearedSide || clearedBelow) ball.launchHoopId = -1;
  }

  function updateBallEffects(dt) {
    ball.rotation += ball.angularVelocity * dt;
    const preset = BALL_EFFECT_PRESETS[ballEffects.selectedPreset];
    const comboThreshold = preset?.comboThreshold ?? 2;
    if (!preset || perfectChain < comboThreshold) return;

    ballEffects.trailCooldown -= dt;
    if (ballEffects.trailCooldown > 0) return;
    ballEffects.trailCooldown = preset.trailInterval ?? 0.045;
    emitPerfectFlameTrail(preset);
  }

  function emitPerfectFlameTrail(preset) {
    const velocityLength = Math.hypot(ball.vx, ball.vy) || 1;
    const backX = -ball.vx / velocityLength;
    const backY = -ball.vy / velocityLength;
    const sideX = -backY;
    const sideY = backX;
    const colors = preset.perfectFlameColors || preset.trailColors;
    const intensity = preset.perfectFlameIntensity || 1;
    const count = Math.max(2, Math.round(2 + intensity * 2));
    for (let i = 0; i < count; i += 1) {
      const spread = random(-ball.r * 0.42, ball.r * 0.42);
      const trailDistance = random(ball.r * 0.5, ball.r * (1.4 + intensity * 0.5));
      const speed = random(28, 88) * intensity;
      const life = random((preset.perfectFlameLifetime || 0.34) * 0.72, preset.perfectFlameLifetime || 0.34);
      pushParticle({
        type: "flame",
        shape: preset.perfectFlameShape || "flame",
        x: ball.x + backX * trailDistance + sideX * spread,
        y: ball.y + backY * trailDistance + sideY * spread,
        vx: backX * speed + sideX * random(-18, 18),
        vy: backY * speed + sideY * random(-18, 18),
        gravity: preset.gravityModifier !== undefined ? preset.gravityModifier * 0.28 : 24,
        shrinkRate: (preset.shrinkRate || 12) * 0.45,
        life,
        maxLife: life,
        size: random((preset.perfectFlameSize || 9) * 0.55, preset.perfectFlameSize || 9),
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.atan2(backY, backX)
      });
    }
  }

  function showRetry() {
    if (state !== "playing" || ball.held) return;
    if (setGameState("retry")) markSaveDirty();
    drag = null;
    if (activePointer !== null && canvas.hasPointerCapture(activePointer)) {
      canvas.releasePointerCapture(activePointer);
    }
    activePointer = null;
    retryOverlay.classList.add("active");
    retryButton.focus();
  }

  function retryShot() {
    if (state !== "retry") return;
    const currentHoop = getHoopById(currentHoopId);
    if (!currentHoop) {
      resetGame(false);
      return;
    }
    swishStreak = 0;
    perfectChain = 0;
    placeBallInHoop(currentHoop);
    setGameState("playing");
    retryOverlay.classList.remove("active");
    retryButton.blur();
  }

  function collideHoops() {
    for (const hoop of hoops) {
      if (!canHoopAffectBall(hoop)) continue;
      if (hoop.id === ball.launchHoopId) continue;
      const leftRim = hoopToWorld(hoop, -hoop.w * 0.5, 0);
      const rightRim = hoopToWorld(hoop, hoop.w * 0.5, 0);
      collideCircle(leftRim.x, leftRim.y, RIM_RADIUS, 0.74);
      collideCircle(rightRim.x, rightRim.y, RIM_RADIUS, 0.74);
      collideNet(hoop);

      if (!hasBoard(hoop)) continue;
      const boardGeometry = getBoardLocalGeometry(hoop);
      const boardTop = hoopToWorld(hoop, boardGeometry.x, boardGeometry.top);
      const boardBottom = hoopToWorld(hoop, boardGeometry.x, boardGeometry.bottom);
      collideSegment(boardTop.x, boardTop.y, boardBottom.x, boardBottom.y, 0.64, "wall");
    }
  }

  function collideNet(hoop) {
    if (ball.scoredHoopId === hoop.id) return;
    const leftTop = hoopToWorld(hoop, -hoop.w * 0.5 + 8, 7);
    const rightTop = hoopToWorld(hoop, hoop.w * 0.5 - 8, 7);
    const leftBottom = hoopToWorld(hoop, -14, 52);
    const rightBottom = hoopToWorld(hoop, 14, 52);
    const localBall = worldToHoop(hoop, ball.x, ball.y);
    const localPrevious = worldToHoop(hoop, ball.prevX, ball.prevY);
    const localVelocity = worldVectorToHoop(hoop, ball.vx, ball.vy);

    const enteredFromTop = localPrevious.y <= 22 && localVelocity.y > 0 && Math.abs(localBall.x) < hoop.w * 0.39;
    if (enteredFromTop) return;

    collideSegment(leftTop.x, leftTop.y, leftBottom.x, leftBottom.y, 0.54);
    collideSegment(rightTop.x, rightTop.y, rightBottom.x, rightBottom.y, 0.54);

    if (localVelocity.y < 0 && localBall.y - ball.r < 52 && localBall.y + ball.r > 36) {
      const lowerWidth = 34;
      if (Math.abs(localBall.x) < lowerWidth) {
        const correctedPosition = hoopToWorld(hoop, localBall.x, 52 + ball.r);
        const correctedVelocity = hoopVectorToWorld(
          hoop,
          localVelocity.x + (localBall.x < 0 ? -70 : 70),
          Math.abs(localVelocity.y) * 0.58
        );
        ball.x = correctedPosition.x;
        ball.y = correctedPosition.y;
        ball.vx = correctedVelocity.x;
        ball.vy = correctedVelocity.y;
        ball.touchedHoop = true;
        playGameSound("rim");
      }
    }
  }

  function collideSegment(x1, y1, x2, y2, bounce, contactType) {
    const vx = x2 - x1;
    const vy = y2 - y1;
    const lenSq = vx * vx + vy * vy || 1;
    const t = clamp(((ball.x - x1) * vx + (ball.y - y1) * vy) / lenSq, 0, 1);
    const px = x1 + vx * t;
    const py = y1 + vy * t;
    const dx = ball.x - px;
    const dy = ball.y - py;
    const minDist = ball.r + 2.5;
    const dist = Math.hypot(dx, dy) || 0.001;
    if (dist >= minDist) return;

    const nx = dx / dist;
    const ny = dy / dist;
    ball.x += nx * (minDist - dist);
    ball.y += ny * (minDist - dist);
    const dot = ball.vx * nx + ball.vy * ny;
    if (dot < 0) {
      ball.vx -= (1 + bounce) * dot * nx;
      ball.vy -= (1 + bounce) * dot * ny;
    }
    ball.vx *= 0.96;
    ball.vy *= 0.96;
    if (contactType === "wall") {
      registerWallTouch();
    } else {
      ball.touchedHoop = true;
    }
  }

  function collideCircle(cx, cy, radius, bounce) {
    const dx = ball.x - cx;
    const dy = ball.y - cy;
    const minDist = ball.r + radius;
    const dist = Math.hypot(dx, dy) || 0.001;
    if (dist >= minDist) return;
    const nx = dx / dist;
    const ny = dy / dist;
    const overlap = minDist - dist;
    ball.x += nx * overlap;
    ball.y += ny * overlap;
    const dot = ball.vx * nx + ball.vy * ny;
    if (dot < 0) {
      ball.vx -= (1 + bounce) * dot * nx;
      ball.vy -= (1 + bounce) * dot * ny;
      ball.touchedHoop = true;
      playGameSound("rim");
    }
  }

  function registerWallTouch() {
    if (!ball.touchedWall) playGameSound("wall");
    ball.touchedWall = true;
  }

  function detectHoopState() {
    const targetHoop = getHoopById(targetHoopId);
    const currentHoop = getHoopById(currentHoopId);

    // Hoop state rule: only the target hoop can score; only the current
    // possession hoop can catch a failed shot. Inactive hoops are visual only.
    if (targetHoop && targetHoop.role === HOOP_ROLE.TARGET && didEnterHoopFromAbove(targetHoop)) {
      scoreTargetHoop(targetHoop);
      return;
    }

    if (currentHoop && currentHoop.role === HOOP_ROLE.CURRENT && didEnterHoopFromAbove(currentHoop)) {
      if (timedShotAwaitingShotResult) {
        beginGameOver();
        return;
      }
      swishStreak = 0;
      perfectChain = 0;
      placeBallInHoop(currentHoop);
    }
  }

  function didEnterHoopFromAbove(hoop) {
    const localBall = worldToHoop(hoop, ball.x, ball.y);
    const localPrevious = worldToHoop(hoop, ball.prevX, ball.prevY);
    const localVelocity = worldVectorToHoop(hoop, ball.vx, ball.vy);
    const mouth = 4;
    const catchDepth = 58;
    const insideLimit = hoop.w * 0.35;
    const sideGrace = hoop.w * 0.46;
    if (localVelocity.y <= 0) return false;
    if (localPrevious.y > catchDepth || localBall.y < mouth) return false;
    const crossedMouth = localPrevious.y <= mouth && localBall.y >= mouth;
    const crossedCatchBand = localPrevious.y <= catchDepth && localBall.y >= mouth;
    if (!crossedMouth && !crossedCatchBand) return false;
    const dy = localBall.y - localPrevious.y;
    const crossRatio = Math.abs(dy) < 0.001 ? 1 : clamp((mouth - localPrevious.y) / dy, 0, 1);
    const xAtMouth = localPrevious.x + (localBall.x - localPrevious.x) * crossRatio;
    const previousNearby = Math.abs(localPrevious.x) < sideGrace;
    const currentNearby = Math.abs(localBall.x) < sideGrace;
    return Math.abs(xAtMouth) < insideLimit && previousNearby && currentNearby && localBall.y < catchDepth + ball.r;
  }

  function scoreTargetHoop(hoop) {
    consumeTimedShotChallenge();
    ball.scoredHoopId = hoop.id;
    const wasPerfect = !ball.touchedHoop;
    const usedWall = ball.touchedWall;
    swishStreak = wasPerfect ? swishStreak + 1 : 0;
    perfectChain = swishStreak;
    const perfectGain = wasPerfect ? Math.min(swishStreak + 1, 10) : 1;
    const wallMultiplier = usedWall ? 2 : 1;
    lastScoreGain = perfectGain * wallMultiplier;
    lastWasPerfect = wasPerfect;
    lastWasBounce = usedWall;
    score += lastScoreGain;
    recordBasketStats(wasPerfect, usedWall, lastScoreGain);
    schedulePlatformSave();
    if (
      highScoreCelebration.eligibleThisRun
      && !highScoreCelebration.hasCelebratedThisRun
      && score > runStartBestScore
    ) {
      triggerHighScoreCelebration();
    }
    if (score > best) {
      best = score;
      writeBestScore(best, true);
    }
    updateScore();
    shake = 5;
    comboText = usedWall || wasPerfect ? 1.5 : 1.0;
    scoreFeedbackText = buildScoreFeedback(wasPerfect, usedWall, lastScoreGain);
    playGameSound(wasPerfect ? "swish" : "basket");
    if (usedWall) playGameSound("wallBonus");
    if (wasPerfect && swishStreak > 1) playGameSound("combo", { streak: swishStreak });
    burst(hoop.x, hoop.y);
    triggerHoopScoreEffect(hoop, { swish: wasPerfect, wall: usedWall });
    hoop.moving = false;
    hoop.baseX = hoop.x;
    hoop.baseY = hoop.y;
    currentHoopId = hoop.id;
    if (hoop.id === 1) hasReachedSecondHoop = true;
    const coinIntervalReset = expireCoinForCompletedTarget(hoop.id);
    const nextTarget = nextHoop();
    targetHoopId = nextTarget.id;
    setHoopRoles(currentHoopId, targetHoopId);
    advanceCoinSchedule(hoop, nextTarget, coinIntervalReset);
    beginBallSettle(hoop);
  }

  function buildScoreFeedback(wasPerfect, usedWall, gained) {
    const parts = [];
    if (wasPerfect) parts.push(t("perfect"));
    if (usedWall) parts.push(t("bounce"));
    if (!wasPerfect && !usedWall) parts.push(t("nice"));
    parts.push("+" + gained);
    return parts.join(" · ");
  }

  function hoopToWorld(hoop, localX, localY) {
    const cos = Math.cos(hoop.rotation);
    const sin = Math.sin(hoop.rotation);
    return {
      x: hoop.x + localX * cos - localY * sin,
      y: hoop.y + localX * sin + localY * cos
    };
  }

  function worldToHoop(hoop, worldX, worldY) {
    const cos = Math.cos(hoop.rotation);
    const sin = Math.sin(hoop.rotation);
    const dx = worldX - hoop.x;
    const dy = worldY - hoop.y;
    return {
      x: dx * cos + dy * sin,
      y: -dx * sin + dy * cos
    };
  }

  function worldVectorToHoop(hoop, vx, vy) {
    const cos = Math.cos(hoop.rotation);
    const sin = Math.sin(hoop.rotation);
    return { x: vx * cos + vy * sin, y: -vx * sin + vy * cos };
  }

  function hoopVectorToWorld(hoop, vx, vy) {
    const cos = Math.cos(hoop.rotation);
    const sin = Math.sin(hoop.rotation);
    return { x: vx * cos - vy * sin, y: vx * sin + vy * cos };
  }

  function triggerHoopScoreEffect(hoop, result) {
    playNetAnimation(hoop);
    if (result.swish) triggerSwishEffect(hoop);
  }

  function playNetAnimation(hoop) {
    hoop.netAnimation = NET_ANIMATION_DURATION;
  }

  function triggerSwishEffect(hoop) {
    const preset = BALL_EFFECT_PRESETS[ballEffects.selectedPreset] || BALL_EFFECT_PRESETS.classic;
    const colors = preset.trailColors || BALL_EFFECT_PRESETS.classic.trailColors;
    const style = preset.perfectStyle || "starBurst";
    if (style === "digitalRings") {
      emitPerfectRings(hoop, colors);
    } else if (style === "splash") {
      emitPerfectSplash(hoop, colors);
    } else if (style === "halo") {
      emitPerfectHalo(hoop, colors);
    } else {
      emitPerfectStars(hoop, colors);
    }
  }

  function emitPerfectStars(hoop, colors) {
    for (let i = 0; i < 9; i += 1) {
      const angle = -Math.PI * 0.5 + random(-1.25, 1.25);
      const speed = random(42, 118);
      pushParticle({
        type: i % 3 === 0 ? "star" : "spark",
        x: hoop.x + random(-18, 18),
        y: hoop.y + random(-4, 15),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        gravity: 180,
        life: random(0.36, 0.58),
        maxLife: 0.58,
        size: random(2.4, 5.2),
        shrinkRate: 7,
        color: colors[i % colors.length] || "#ffd27a"
      });
    }
    emitPerfectRings(hoop, ["rgba(255, 240, 170, 0.9)", "rgba(255, 255, 255, 0.9)"], 2);
  }

  function emitPerfectRings(hoop, colors, count) {
    const ringCount = count || 3;
    for (let i = 0; i < ringCount; i += 1) {
      pushParticle({
        type: "ring",
        x: hoop.x,
        y: hoop.y + 4,
        vx: 0,
        vy: -8 - i * 3,
        gravity: 0,
        life: 0.42 + i * 0.08,
        maxLife: 0.42 + i * 0.08,
        size: 13 + i * 5,
        growth: 24 + i * 7,
        lineWidth: Math.max(1.2, 2.8 - i * 0.45),
        color: colors[i % colors.length] || "#ffffff"
      });
    }
  }

  function emitPerfectSplash(hoop, colors) {
    for (let i = 0; i < 13; i += 1) {
      const angle = random(Math.PI * 1.02, Math.PI * 1.98);
      const speed = random(36, 128);
      pushParticle({
        type: "splash",
        x: hoop.x + random(-18, 18),
        y: hoop.y + 12,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 220,
        life: random(0.34, 0.62),
        maxLife: 0.62,
        size: random(2.2, 5.6),
        shrinkRate: 9,
        color: colors[i % colors.length] || "#7dfcff"
      });
    }
    emitPerfectRings(hoop, colors, 1);
  }

  function emitPerfectHalo(hoop, colors) {
    emitPerfectRings(hoop, colors, 3);
    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      pushParticle({
        type: "spark",
        x: hoop.x + Math.cos(angle) * 18,
        y: hoop.y + 5 + Math.sin(angle) * 7,
        vx: Math.cos(angle) * random(18, 42),
        vy: Math.sin(angle) * random(12, 36) - 24,
        gravity: 70,
        life: random(0.28, 0.44),
        maxLife: 0.44,
        size: random(1.8, 3.4),
        shrinkRate: 6,
        color: colors[i % colors.length] || "#ffffff"
      });
    }
  }

  function getHoopById(id) {
    return hoops.find((hoop) => hoop.id === id);
  }

  function setHoopRoles(currentId, targetId) {
    for (const hoop of hoops) {
      if (hoop.id === currentId) {
        hoop.role = HOOP_ROLE.CURRENT;
      } else if (hoop.id === targetId) {
        hoop.role = HOOP_ROLE.TARGET;
      } else {
        hoop.role = HOOP_ROLE.INACTIVE;
      }
    }
  }

  function canHoopAffectBall(hoop) {
    return hoop.role === HOOP_ROLE.CURRENT || hoop.role === HOOP_ROLE.TARGET;
  }

  function getShotPowerBoost(ratio) {
    return 1 + (MAX_POWER_BOOST - 1) * Math.pow(ratio, 4);
  }

  function hasBoard(hoop) {
    return Boolean(hoop.board);
  }

  function getBoardLocalX(hoop) {
    if (Number.isFinite(hoop.sourceX) && Math.abs(hoop.sourceX - hoop.x) > 1) {
      return hoop.sourceX < hoop.x ? hoop.w * 0.5 + 18 : -hoop.w * 0.5 - 26;
    }
    const roomRight = WORLD_W - (hoop.x + hoop.w * 0.5);
    const roomLeft = hoop.x - hoop.w * 0.5;
    return roomRight >= roomLeft ? hoop.w * 0.5 + 18 : -hoop.w * 0.5 - 26;
  }

  function getBoardLocalGeometry(hoop) {
    const top = -62;
    const baseX = getBoardLocalX(hoop) + 4;
    const inwardOffset = 10;
    const bottomExtension = 20;
    return {
      x: baseX - Math.sign(baseX) * inwardOffset,
      top,
      bottom: top + hoop.boardH + bottomExtension
    };
  }

  function burst(x, y) {
    for (let i = 0; i < 18; i += 1) {
      const a = (Math.PI * 2 * i) / 18 + random(-0.2, 0.2);
      const s = random(70, 190);
      pushParticle({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 80,
        life: random(0.35, 0.7),
        size: random(2, 4),
        color: i % 2 ? "#f47b20" : "#ffffff"
      });
    }
  }

  function triggerHighScoreCelebration() {
    const colors = ["#ffcf33", "#ff7a33", "#30d9c4", "#5aa7ff", "#f36ac3", "#ffffff"];
    highScoreCelebration.hasCelebratedThisRun = true;
    highScoreCelebration.elapsed = 0;
    highScoreCelebration.active = true;
    highScoreCelebration.confetti = [];

    for (let i = 0; i < NEW_HIGH_SCORE_CONFETTI_COUNT; i += 1) {
      const angle = random(-Math.PI * 0.88, -Math.PI * 0.12);
      const speed = random(90, 190);
      const life = random(0.78, 1.18);
      highScoreCelebration.confetti.push({
        x: WORLD_W * 0.5 + random(-68, 68),
        y: 150 + random(-10, 12),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: random(180, 260),
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-8, 8),
        width: random(4, 7),
        height: random(7, 12),
        life,
        maxLife: life,
        color: colors[i % colors.length]
      });
    }
  }

  function updateHighScoreCelebration(dt) {
    if (!highScoreCelebration.active) return;
    highScoreCelebration.elapsed += dt;
    for (const piece of highScoreCelebration.confetti) {
      piece.life -= dt;
      piece.x += piece.vx * dt;
      piece.y += piece.vy * dt;
      piece.vy += piece.gravity * dt;
      piece.rotation += piece.rotationSpeed * dt;
    }
    highScoreCelebration.confetti = highScoreCelebration.confetti.filter((piece) => piece.life > 0);
    if (highScoreCelebration.elapsed >= NEW_HIGH_SCORE_DURATION && highScoreCelebration.confetti.length === 0) {
      highScoreCelebration.active = false;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, viewW, viewH);
    const sx = offsetX + (shake ? random(-shake, shake) : 0);
    const sy = offsetY + (shake ? random(-shake, shake) : 0);
    const hoopSpritesReady = isHoopSpriteSetReady();
    ctx.save();
    ctx.translate(sx, sy);
    ctx.scale(scale, scale);
    ctx.translate(0, -cameraY);

    drawAmbient();
    drawWalls();
    drawCurrentScore();
    for (const hoop of hoops) drawHoopMotionPath(hoop);
    for (const hoop of hoops) drawHoop(hoop, hoopSpritesReady);
    drawActiveCoin();
    drawShotRings();
    drawParticles();
    if (drag && ball.held) drawTrajectory();
    drawBall();
    if (hoopSpritesReady) {
      for (const hoop of hoops) drawHoopFront(hoop, true);
    } else if (ball.held || ball.settle) {
      const currentHoop = getHoopById(currentHoopId);
      if (currentHoop) drawHoopFront(currentHoop);
    }
    if (state === "menu") drawHint();
    if (comboText > 0) drawCombo();
    drawCoinFeedback();

    ctx.restore();
    drawHighScoreCelebration();
  }

  function drawActiveCoin() {
    const coin = getActiveCoinWorldPosition();
    if (!coin) return;
    ctx.save();
    ctx.translate(coin.x, coin.y);
    ctx.fillStyle = "rgba(38, 34, 24, 0.18)";
    ctx.beginPath();
    ctx.ellipse(1.5, 3, coin.r + 2, coin.r * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f6bd2f";
    ctx.strokeStyle = "#7a4c0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, coin.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(139, 82, 8, 0.72)";
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    ctx.arc(0, 0, coin.r * 0.57, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
    ctx.beginPath();
    ctx.arc(-coin.r * 0.31, -coin.r * 0.34, coin.r * 0.17, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawCoinFeedback() {
    if (!coinFeedback) return;
    const remaining = clamp(coinFeedback.life / coinFeedback.maxLife, 0, 1);
    const progress = 1 - remaining;
    ctx.save();
    ctx.globalAlpha = Math.min(1, remaining * 2.4);
    ctx.translate(coinFeedback.x, coinFeedback.y - 14 - progress * 22);
    ctx.font = "700 18px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(88, 53, 8, 0.72)";
    ctx.strokeText("+1", 0, 0);
    ctx.fillStyle = "#ffe06a";
    ctx.fillText("+1", 0, 0);
    ctx.restore();
  }

  function drawAmbient() {
    const colors = getCanvasTheme();
    const top = cameraY - 90;
    const height = WORLD_H + 180;
    const gradient = ctx.createLinearGradient(0, top, 0, top + height);
    gradient.addColorStop(0, colors.backgroundTop);
    gradient.addColorStop(1, colors.backgroundBottom);

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, top, WORLD_W, height);
    ctx.fillStyle = colors.backgroundAccent;
    ctx.beginPath();
    ctx.arc(WORLD_W * 0.82, top + height * 0.16, 118, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(WORLD_W * 0.16, top + height * 0.76, 86, 0, Math.PI * 2);
    ctx.fill();
    if (colors.motif === "none") {
      ctx.restore();
      return;
    }
    ctx.strokeStyle = colors.geometryLine || (darkMode ? "rgba(255, 214, 255, 0.18)" : "rgba(255, 255, 255, 0.46)");
    ctx.lineWidth = 2.1;
    ctx.shadowColor = colors.geometryGlow || (darkMode ? "rgba(215, 120, 255, 0.18)" : "rgba(255, 255, 255, 0.46)");
    ctx.shadowBlur = darkMode ? 6 : 9;
    if (colors.motif === "geometry") {
      drawAmbientRing(WORLD_W * 0.26, top + 118, 46, 0.58);
      drawAmbientRing(WORLD_W * 0.22, top + 478, 36, 0.42);
      drawAmbientTriangle(WORLD_W * 0.74, top + 214, 78, -0.22 + simulationTime * 0.012, 0.42);
      drawAmbientTriangle(WORLD_W * 0.68, top + 520, 84, 0.18 - simulationTime * 0.01, 0.34);
      drawAmbientTriangle(WORLD_W * 0.58, top + 654, 70, -0.4, 0.3);
    } else if (colors.motif === "sun") {
      drawAmbientSun(WORLD_W * 0.78, top + 172, 72, 0.28);
      drawAmbientRing(WORLD_W * 0.22, top + 506, 42, 0.22);
    } else if (colors.motif === "court") {
      drawAmbientCourtLines(top, height, 0.26);
    } else if (colors.motif === "vignette") {
      drawAmbientRing(WORLD_W * 0.5, top + height * 0.48, 118, 0.14);
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawAmbientRing(x, y, radius, alpha) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawAmbientTriangle(x, y, size, rotation, alpha) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let i = 0; i < 3; i += 1) {
      const angle = -Math.PI * 0.5 + i * Math.PI * 2 / 3;
      const px = Math.cos(angle) * size;
      const py = Math.sin(angle) * size * 0.62;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.translate(size * 0.18, size * 0.12);
    ctx.beginPath();
    for (let i = 0; i < 3; i += 1) {
      const angle = -Math.PI * 0.5 + i * Math.PI * 2 / 3;
      const px = Math.cos(angle) * size * 0.88;
      const py = Math.sin(angle) * size * 0.54;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  function drawAmbientSun(x, y, radius, alpha) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * (radius + 10), y + Math.sin(angle) * (radius + 10));
      ctx.lineTo(x + Math.cos(angle) * (radius + 34), y + Math.sin(angle) * (radius + 34));
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawAmbientCourtLines(top, height, alpha) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.beginPath();
    ctx.moveTo(WORLD_W * 0.5, top + 60);
    ctx.lineTo(WORLD_W * 0.5, top + height - 60);
    ctx.moveTo(WORLD_W * 0.16, top + height * 0.28);
    ctx.lineTo(WORLD_W * 0.84, top + height * 0.28);
    ctx.moveTo(WORLD_W * 0.16, top + height * 0.72);
    ctx.lineTo(WORLD_W * 0.84, top + height * 0.72);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(WORLD_W * 0.5, top + height * 0.5, 58, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawWalls() {
    const top = cameraY - 90;
    const height = WORLD_H + 180;
    const colors = getCanvasTheme();

    ctx.save();
    ctx.fillStyle = colors.wallFill;
    ctx.fillRect(0, top, WALL_INSET, height);
    ctx.fillRect(WORLD_W - WALL_INSET, top, WALL_INSET, height);

    ctx.strokeStyle = colors.wallEdge;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(WALL_INSET, top);
    ctx.lineTo(WALL_INSET, top + height);
    ctx.moveTo(WORLD_W - WALL_INSET, top);
    ctx.lineTo(WORLD_W - WALL_INSET, top + height);
    ctx.stroke();

    ctx.strokeStyle = colors.rimHighlight;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(WALL_INSET - 4, top);
    ctx.lineTo(WALL_INSET - 4, top + height);
    ctx.moveTo(WORLD_W - WALL_INSET + 4, top);
    ctx.lineTo(WORLD_W - WALL_INSET + 4, top + height);
    ctx.stroke();
    ctx.restore();
  }

  function drawCurrentScore() {
    if (state !== "playing" && state !== "paused" && state !== "pause-settings" && state !== "retry" && state !== "revive-offer" && state !== "gameover") return;
    const colors = getCanvasTheme();
    ctx.save();
    ctx.globalAlpha = 0.11;
    ctx.fillStyle = colors.ink;
    ctx.font = "900 156px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(score), WORLD_W * 0.5, cameraY + WORLD_H * 0.28);
    ctx.restore();
  }

  function drawShotRings() {
    const colors = getCanvasTheme();
    ctx.save();
    ctx.strokeStyle = colors.shotRing;
    for (const ring of shotRings) {
      if (ring.delay > 0) continue;
      const progress = 1 - clamp(ring.life / ring.maxLife, 0, 1);
      ctx.globalAlpha = (1 - progress) * 0.72;
      ctx.lineWidth = Math.max(1.2, 3.2 - progress * 2);
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.startRadius + ring.growth * progress, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawHoopMotionPath(hoop) {
    if (!hoop.moving || hoop.role === HOOP_ROLE.INACTIVE) return;
    const colors = getCanvasTheme();
    const horizontal = hoop.movementType === "horizontal";
    const minX = WALL_INSET + HOOP_WALL_CLEARANCE;
    const maxX = WORLD_W - WALL_INSET - HOOP_WALL_CLEARANCE;
    const startX = horizontal ? clamp(hoop.baseX - hoop.moveAmplitude, minX, maxX) : hoop.baseX;
    const endX = horizontal ? clamp(hoop.baseX + hoop.moveAmplitude, minX, maxX) : hoop.baseX;
    const startY = horizontal ? hoop.baseY : hoop.baseY - hoop.moveAmplitude;
    const endY = horizontal ? hoop.baseY : hoop.baseY + hoop.moveAmplitude;

    ctx.save();
    ctx.fillStyle = colors.motionPath;
    for (let i = 0; i <= 6; i += 1) {
      const ratio = i / 6;
      const x = startX + (endX - startX) * ratio;
      const y = startY + (endY - startY) * ratio;
      ctx.globalAlpha = i === 0 || i === 6 ? 0.72 : 0.38;
      ctx.beginPath();
      ctx.arc(x, y, i === 0 || i === 6 ? 2.8 : 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function getHoopDeformation(hoop) {
    const scoreProgress = clamp(hoop.netAnimation / NET_ANIMATION_DURATION, 0, 1);
    const scorePhase = 1 - scoreProgress;
    const scoreSwing = Math.sin(scorePhase * Math.PI * 4) * scoreProgress * 3.6;
    const scoreStretch = Math.sin(scorePhase * Math.PI) * 2.8;

    const releaseProgress = clamp(hoop.releaseAnimation / HOOP_RELEASE_DURATION, 0, 1);
    const releasePhase = 1 - releaseProgress;
    const releaseKick = Math.sin(releasePhase * Math.PI * 1.5) * releaseProgress;
    const releaseAmount = releaseKick * hoop.releaseStrength;
    const releaseShiftX = -hoop.releaseDirectionX * 5 * releaseAmount;
    const releaseLift = -Math.abs(hoop.releaseDirectionY) * 3.5 * releaseAmount;
    const aim = getHoopAimDeformation(hoop);

    return {
      offsetX: aim.offsetX,
      offsetY: aim.offsetY,
      netSwing: scoreSwing + releaseShiftX + aim.netSwing,
      netStretch: scoreStretch + releaseLift + aim.netLift,
      visualTilt: -hoop.releaseDirectionX * 0.018 * releaseAmount + aim.visualTilt,
      launcherAngle: aim.launcherAngle,
      launcherIntensity: aim.launcherIntensity,
      rimScaleX: 1 + Math.abs(releaseAmount) * 0.012,
      rimScaleY: 1 - Math.abs(releaseAmount) * 0.025
    };
  }

  function getHoopAimDeformation(hoop) {
    const visual = getHoopPullVisualState(hoop);
    if (!visual.active) return visual;
    return {
      ...visual,
      offsetX: visual.directionX * HOOP_AIM_MAX_OFFSET * 0.22 * visual.ratio,
      offsetY: visual.directionY * HOOP_AIM_MAX_OFFSET * 0.16 * visual.ratio,
      netSwing: visual.directionX * 5.2 * visual.ratio,
      netLift: visual.directionY * 3.2 * visual.ratio,
      visualTilt: clamp(visual.directionX * 0.032 + Math.sin(visual.launcherAngle) * 0.018, -0.055, 0.055) * visual.ratio
    };
  }

  function getHoopPullVisualState(hoop) {
    const empty = {
      active: false,
      offsetX: 0,
      offsetY: 0,
      netSwing: 0,
      netLift: 0,
      visualTilt: 0,
      launcherAngle: 0,
      launcherIntensity: 0,
      directionX: 0,
      directionY: 0,
      ratio: 0
    };
    if (!drag || !ball.held || hoop.id !== currentHoopId) return empty;
    const pull = getPullVector();
    if (pull.len < 0.01) return empty;
    const length = Math.hypot(pull.x, pull.y) || 1;
    const directionX = pull.x / length;
    const directionY = pull.y / length;
    const ratio = clamp(pull.len / MAX_PULL, 0, 1);
    return {
      active: true,
      offsetX: 0,
      offsetY: 0,
      netSwing: 0,
      netLift: 0,
      visualTilt: 0,
      launcherAngle: getLauncherAngleFromPull(pull),
      launcherIntensity: ratio,
      directionX,
      directionY,
      ratio
    };
  }

  function getLauncherAngleFromPull(pull) {
    return Math.atan2(pull.y, pull.x);
  }

  function applyHoopSpawnTransform(hoop) {
    const progress = clamp(hoop.entranceTimer ?? hoop.spawnProgress ?? 1, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const pop = Math.sin(progress * Math.PI) * 0.075;
    const scale = 0.78 + eased * 0.22 + pop;
    ctx.globalAlpha *= 0.12 + eased * 0.88;
    ctx.translate(0, (1 - eased) * 13);
    ctx.scale(scale, scale);
  }

  function drawHoopSpriteLayer(layerName, hoop) {
    const image = hoopSpriteImages[layerName];
    const sourceSize = HOOP_SPRITE_CONFIG.sourceSize;
    const spriteScale = hoop.w / HOOP_SPRITE_CONFIG.referenceWidth;
    const destinationSize = sourceSize * spriteScale;
    const sourceOffset = HOOP_SPRITE_CONFIG.layerSourceOffsets[hoopSpriteState.setId]?.[layerName];
    const offsetX = sourceOffset?.x || 0;
    const offsetY = sourceOffset?.y || 0;
    ctx.drawImage(
      image,
      0,
      0,
      sourceSize,
      sourceSize,
      (-HOOP_SPRITE_CONFIG.anchorX + offsetX) * spriteScale,
      (-HOOP_SPRITE_CONFIG.anchorY + offsetY) * spriteScale,
      destinationSize,
      destinationSize
    );
  }

  function drawHoop(hoop, useHoopSprites) {
    const colors = getCanvasTheme();
    const rimY = 0;
    const left = -hoop.w * 0.5;
    const right = hoop.w * 0.5;
    const advanced = hasBoard(hoop);
    const boardGeometry = advanced ? getBoardLocalGeometry(hoop) : null;
    const deformation = getHoopDeformation(hoop);
    const netSwing = deformation.netSwing;
    const netStretch = deformation.netStretch;

    ctx.save();
    if (hoop.role === HOOP_ROLE.INACTIVE) ctx.globalAlpha = 0.42;
    ctx.translate(hoop.x + deformation.offsetX, hoop.y + deformation.offsetY);
    applyHoopSpawnTransform(hoop);
    ctx.rotate(hoop.rotation + deformation.visualTilt);

    ctx.fillStyle = colors.hoopShadow;
    ctx.beginPath();
    ctx.ellipse(2, rimY + 48 + netStretch * 0.55, hoop.w * 0.27, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();

    if (advanced) {
      ctx.save();
      ctx.strokeStyle = colors.rim;
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(boardGeometry.x, boardGeometry.top);
      ctx.lineTo(boardGeometry.x, boardGeometry.bottom);
      ctx.stroke();
      ctx.restore();
    }

    if (useHoopSprites) {
      drawHoopSpriteLayer("netBack", hoop);
      drawHoopSpriteLayer("rimBack", hoop);
      ctx.restore();
      return;
    }

    // Thin premium net: short, bright, and airy like the soft arcade references.
    ctx.fillStyle = colors.netFill;
    ctx.strokeStyle = colors.netEdge;
    ctx.lineWidth = 1.55;
    ctx.beginPath();
    ctx.moveTo(left + 6, rimY + 4);
    ctx.bezierCurveTo(-29, 18, -22 + netSwing * 0.25, 41 + netStretch * 0.9, -10 + netSwing, 49 + netStretch);
    ctx.quadraticCurveTo(netSwing, 54 + netStretch, 10 + netSwing, 49 + netStretch);
    ctx.bezierCurveTo(22 + netSwing * 0.25, 41 + netStretch * 0.9, 29, 18, right - 6, rimY + 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // One combined mesh path gets a subtle glow and a crisp inner thread.
    ctx.beginPath();
    for (let i = 0; i < 4; i += 1) {
      const topX = -24 + i * 16;
      const leftBottomX = topX * 0.28 - 7 + netSwing;
      const rightBottomX = topX * 0.28 + 7 + netSwing;
      ctx.moveTo(topX, rimY + 6);
      ctx.bezierCurveTo(topX * 0.64 - 4, 20, leftBottomX - 2, 36 + netStretch * 0.55, leftBottomX, 49 + netStretch);
      ctx.moveTo(topX, rimY + 6);
      ctx.bezierCurveTo(topX * 0.64 + 4, 20, rightBottomX + 2, 36 + netStretch * 0.55, rightBottomX, 49 + netStretch);
    }
    drawNetCrossCurve(27, 17, 2.4, netSwing * 0.45, netStretch * 0.3);
    drawNetCrossCurve(21, 31, 3, netSwing * 0.72, netStretch * 0.58);
    drawNetCrossCurve(14, 44, 2.2, netSwing, netStretch);
    ctx.strokeStyle = colors.netOutline;
    ctx.lineWidth = 2.6;
    ctx.stroke();
    ctx.strokeStyle = colors.netLine;
    ctx.lineWidth = 1.35;
    ctx.stroke();

    // A thin, glossy rim: smaller silhouette, strong contrast, premium arcade feel.
    ctx.strokeStyle = colors.rim;
    ctx.lineWidth = 6.2;
    ctx.beginPath();
    ctx.ellipse(0, rimY, hoop.w * 0.5 * deformation.rimScaleX, 7.2 * deformation.rimScaleY, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = colors.rimShadow;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(0, rimY + 0.45, hoop.w * 0.47 * deformation.rimScaleX, 6 * deformation.rimScaleY, 0, Math.PI * 0.08, Math.PI * 0.92);
    ctx.stroke();

    ctx.strokeStyle = colors.rimHighlight;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, rimY - 0.85, hoop.w * 0.45 * deformation.rimScaleX, 5.8 * deformation.rimScaleY, 0, Math.PI * 1.08, Math.PI * 1.92);
    ctx.stroke();
    ctx.restore();
  }

  function drawNetCrossCurve(halfWidth, y, sag, offsetX, offsetY) {
    ctx.moveTo(-halfWidth + offsetX * 0.25, y + offsetY * 0.4);
    ctx.quadraticCurveTo(offsetX, y + sag + offsetY, halfWidth + offsetX * 0.25, y + offsetY * 0.4);
  }

  function drawHoopFront(hoop, useHoopSprites) {
    const deformation = getHoopDeformation(hoop);

    if (useHoopSprites) {
      ctx.save();
      if (hoop.role === HOOP_ROLE.INACTIVE) ctx.globalAlpha = 0.42;
      ctx.translate(hoop.x + deformation.offsetX, hoop.y + deformation.offsetY);
      applyHoopSpawnTransform(hoop);
      ctx.rotate(hoop.rotation + deformation.visualTilt);
      drawHoopSpriteLayer("netFront", hoop);
      drawHoopSpriteLayer("rimFront", hoop);
      ctx.restore();
      return;
    }

    const colors = getCanvasTheme();
    const netSwing = deformation.netSwing;
    const netStretch = deformation.netStretch;

    ctx.save();
    ctx.translate(hoop.x + deformation.offsetX, hoop.y + deformation.offsetY);
    applyHoopSpawnTransform(hoop);
    ctx.rotate(hoop.rotation + deformation.visualTilt);
    ctx.beginPath();
    drawNetCrossCurve(21, 31, 3, netSwing * 0.7, netStretch * 0.55);
    drawNetCrossCurve(14, 44, 2.2, netSwing, netStretch);
    ctx.strokeStyle = colors.netOutline;
    ctx.lineWidth = 2.7;
    ctx.stroke();
    ctx.strokeStyle = colors.netFront;
    ctx.lineWidth = 1.45;
    ctx.stroke();
    ctx.restore();
  }

  function drawBall() {
    const skin = getSelectedBallSkin();
    const colors = skin.colors;
    const skinImage = getBallSkinImage(skin);
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.rotation);

    if (skinImage && skinImage.complete && skinImage.naturalWidth > 0) {
      const assetScale = ball.r / 27;
      const assetSize = 64 * assetScale;
      ctx.drawImage(skinImage, -assetSize * 0.5, -assetSize * 0.5, assetSize, assetSize);
      ctx.restore();
      return;
    }

    const grad = ctx.createRadialGradient(-ball.r * 0.42, -ball.r * 0.48, 1, 1, 2, ball.r * 1.42);
    grad.addColorStop(0, colors.light);
    grad.addColorStop(0.34, colors.mid);
    grad.addColorStop(0.86, colors.dark);
    grad.addColorStop(1, colors.outline);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
    ctx.fill();

    if (!skin.noSeams) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, ball.r - 0.8, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = colors.seam;
      ctx.lineWidth = 1.75;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-ball.r, 0);
      ctx.lineTo(ball.r, 0);
      ctx.moveTo(0, -ball.r);
      ctx.lineTo(0, ball.r);
      ctx.moveTo(-ball.r * 0.55, -ball.r * 0.85);
      ctx.quadraticCurveTo(ball.r * 0.2, 0, -ball.r * 0.55, ball.r * 0.85);
      ctx.moveTo(ball.r * 0.55, -ball.r * 0.85);
      ctx.quadraticCurveTo(-ball.r * 0.2, 0, ball.r * 0.55, ball.r * 0.85);
      ctx.stroke();
      ctx.restore();
    }

    ctx.strokeStyle = colors.outline;
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.arc(0, 0, ball.r - 0.65, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
    ctx.beginPath();
    ctx.ellipse(-5.8, -7.2, 4.4, 2.1, -0.58, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function getBallSkinImage(skin) {
    if (!skin.assetPath || typeof Image === "undefined") return null;
    if (!ballSkinImages[skin.id]) {
      const image = new Image();
      image.decoding = "async";
      image.src = skin.assetPath;
      ballSkinImages[skin.id] = image;
    }
    return ballSkinImages[skin.id];
  }

  function getActiveHoopSpriteSet() {
    const themeId = THEMES[selectedThemeId] ? selectedThemeId : "gym";
    const directory = themeId === "gym"
      ? "assets/hoop/classic"
      : `assets/hoop/${themeId}/${darkMode ? "dark" : "light"}`;
    const layers = Object.fromEntries(
      Object.entries(HOOP_SPRITE_CONFIG.layerFiles).map(([layerName, fileName]) => [
        layerName,
        `${directory}/${fileName}`
      ])
    );
    return { id: directory, layers };
  }

  function failHoopSpriteSet(message, generation = hoopSpriteState.generation) {
    if (generation !== hoopSpriteState.generation) return;
    hoopSpriteState.failed = true;
    hoopSpriteState.ready = false;
    if (hoopSpriteState.warningSent) return;
    hoopSpriteState.warningSent = true;
    console.warn("[Hoop Flick] Hoop sprite set unavailable; procedural fallback is active. " + message);
  }

  function preloadHoopSpriteSet() {
    const spriteSet = getActiveHoopSpriteSet();
    if (hoopSpriteState.started && hoopSpriteState.setId === spriteSet.id) return;
    hoopSpriteState.setId = spriteSet.id;
    hoopSpriteState.generation += 1;
    hoopSpriteState.started = true;
    hoopSpriteState.loadedCount = 0;
    hoopSpriteState.ready = false;
    hoopSpriteState.failed = false;
    hoopSpriteState.warningSent = false;
    const generation = hoopSpriteState.generation;
    if (typeof Image === "undefined") {
      failHoopSpriteSet("Image loading is unsupported.", generation);
      return;
    }

    const layers = Object.entries(spriteSet.layers);
    for (const [layerName, assetPath] of layers) {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (generation !== hoopSpriteState.generation) return;
        if (
          image.naturalWidth !== HOOP_SPRITE_CONFIG.sourceSize
          || image.naturalHeight !== HOOP_SPRITE_CONFIG.sourceSize
        ) {
          failHoopSpriteSet(layerName + " has unexpected dimensions.", generation);
          return;
        }
        hoopSpriteState.loadedCount += 1;
        if (!hoopSpriteState.failed && hoopSpriteState.loadedCount === layers.length) {
          hoopSpriteState.ready = true;
          draw();
        }
      };
      image.onerror = () => failHoopSpriteSet(layerName + " failed to load.", generation);
      image.src = assetPath;
      hoopSpriteImages[layerName] = image;
    }
  }

  function isHoopSpriteSetReady() {
    return hoopSpriteState.ready && !hoopSpriteState.failed;
  }

  function drawTrajectory() {
    const colors = getCanvasTheme();
    const pull = getPullVector();
    const impulse = LAUNCH_POWER_SCALE * TRAJECTORY_POWER_SCALE * getShotPowerBoost(pull.ratio);
    const vx = pull.x * pull.power * impulse;
    const vy = pull.y * pull.power * impulse;
    let x = ball.x;
    let y = ball.y;
    let tx = vx;
    let ty = vy;
    ctx.save();
    let points = Math.round(7 + pull.ratio * 6);
    const step = 0.045;
    let bounceExtended = false;
    ctx.fillStyle = pull.ratio > 0.72 ? colors.trajectoryHot : colors.trajectory;
    for (let i = 0; i < points; i += 1) {
      tx *= 0.996;
      ty += GRAVITY * step;
      x += tx * step;
      y += ty * step;
      let bounced = false;
      if (x - ball.r < WALL_INSET) {
        x = WALL_INSET + ball.r;
        tx = Math.abs(tx) * 0.66;
        bounced = true;
      } else if (x + ball.r > WORLD_W - WALL_INSET) {
        x = WORLD_W - WALL_INSET - ball.r;
        tx = -Math.abs(tx) * 0.66;
        bounced = true;
      }
      if (bounced && !bounceExtended) {
        points = Math.min(15, Math.max(points, i + 4));
        bounceExtended = true;
      }
      ctx.globalAlpha = 0.76 - i * (0.52 / points);
      ctx.beginPath();
      ctx.arc(x, y, Math.max(2.1, 4.2 - i * 0.16), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.trajectoryHot;
    ctx.lineWidth = 4 + pull.ratio * 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(ball.x - pull.x * 0.55, ball.y - pull.y * 0.55);
    ctx.stroke();

    ctx.strokeStyle = "rgba(38, 48, 68, 0.16)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r + 11, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * pull.ratio);
    ctx.stroke();
    ctx.restore();
  }

  function drawParticles() {
    ctx.save();
    for (const p of particles) {
      const progress = 1 - clamp(p.life / (p.maxLife || 0.6), 0, 1);
      ctx.globalAlpha = clamp(p.life * 2, 0, 1);
      if (p.type === "ring") {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(0.8, (p.lineWidth || 2) * (1 - progress * 0.65));
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size + (p.growth || 18) * progress, (p.size * 0.34) + (p.growth || 18) * 0.22 * progress, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === "star") {
        ctx.fillStyle = p.color;
        drawParticleStar(p.x, p.y, Math.max(1, p.size), progress * Math.PI * 0.6);
        ctx.fill();
      } else if (p.type === "splash") {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, Math.max(1, p.size * 1.2), Math.max(1, p.size * 0.72), Math.atan2(p.vy, p.vx), 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === "flame") {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle || Math.atan2(p.vy, p.vx));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        const length = Math.max(3, p.size * (1.65 - progress * 0.45));
        const width = Math.max(2, p.size * (0.78 - progress * 0.18));
        if (p.shape === "splash") {
          ctx.ellipse(0, 0, length * 0.82, width * 0.72, 0, 0, Math.PI * 2);
        } else {
          ctx.moveTo(length * 0.72, 0);
          ctx.bezierCurveTo(length * 0.25, -width, -length * 0.45, -width * 0.72, -length * 0.8, 0);
          ctx.bezierCurveTo(-length * 0.3, width * 0.78, length * 0.22, width * 0.72, length * 0.72, 0);
        }
        ctx.fill();
        ctx.globalAlpha *= 0.55;
        ctx.fillStyle = "rgba(255, 255, 255, 0.62)";
        ctx.beginPath();
        ctx.ellipse(length * 0.12, 0, Math.max(1, width * 0.28), Math.max(1, width * 0.18), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawParticleStar(x, y, radius, rotation) {
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const pointRadius = i % 2 === 0 ? radius : radius * 0.45;
      const angle = rotation - Math.PI * 0.5 + i * Math.PI / 5;
      const px = x + Math.cos(angle) * pointRadius;
      const py = y + Math.sin(angle) * pointRadius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function drawHint() {
    const hoop = hoops[0];
    const target = hoops[1];
    const dragDirection = target && target.x < hoop.x ? 1 : -1;
    const hintX = hoop.x + dragDirection * 62;
    const colors = getCanvasTheme();
    ctx.save();
    ctx.strokeStyle = colors.hint;
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 8]);
    ctx.beginPath();
    ctx.moveTo(hoop.x, hoop.y - 18);
    ctx.lineTo(hintX, hoop.y + 54);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = colors.hintStrong;
    ctx.beginPath();
    ctx.moveTo(hintX, hoop.y + 54);
    ctx.lineTo(hintX - dragDirection * 18, hoop.y + 48);
    ctx.lineTo(hintX - dragDirection * 6, hoop.y + 36);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawCombo() {
    const colors = getCanvasTheme();
    const duration = lastWasPerfect || lastWasBounce ? 1.5 : 1;
    const progress = 1 - clamp(comboText / duration, 0, 1);
    const pop = Math.sin(clamp(progress * 1.8, 0, 1) * Math.PI);
    const streakEmphasis = lastWasPerfect ? Math.min(swishStreak, 8) * 0.8 : 0;
    ctx.save();
    ctx.translate(WORLD_W * 0.5, cameraY + 112);
    ctx.globalAlpha = Math.min(1, comboText * 1.4);
    ctx.fillStyle = lastWasBounce ? "#f47b20" : colors.ink;
    ctx.shadowColor = lastWasPerfect ? "rgba(255, 158, 75, 0.48)" : "transparent";
    ctx.shadowBlur = lastWasPerfect ? 8 + streakEmphasis : 0;
    ctx.font = "850 " + (24 + streakEmphasis + pop * 4) + "px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(scoreFeedbackText, 0, -comboText * 10);
    ctx.restore();
  }

  function drawHighScoreCelebration() {
    if (!highScoreCelebration.active) return;
    const elapsed = highScoreCelebration.elapsed;
    const remaining = Math.max(0, NEW_HIGH_SCORE_DURATION - elapsed);
    const progress = 1 - clamp(remaining / NEW_HIGH_SCORE_DURATION, 0, 1);
    const pop = Math.sin(clamp(progress * 1.8, 0, 1) * Math.PI);
    const colors = getCanvasTheme();

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    for (const piece of highScoreCelebration.confetti) {
      const lifeAlpha = clamp(piece.life / Math.min(0.3, piece.maxLife), 0, 1);
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.globalAlpha = lifeAlpha;
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.width * 0.5, -piece.height * 0.5, piece.width, piece.height);
      ctx.restore();
    }

    if (elapsed < NEW_HIGH_SCORE_DURATION) {
      ctx.save();
      ctx.translate(WORLD_W * 0.5, 164);
      ctx.globalAlpha = Math.min(1, remaining * 1.4);
      ctx.fillStyle = colors.ink;
      ctx.shadowColor = darkMode ? "rgba(0, 0, 0, 0.48)" : "rgba(255, 255, 255, 0.7)";
      ctx.shadowBlur = 7;
      ctx.font = "850 " + (24 + pop * 4) + "px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(t("newHighScore"), 0, -remaining * 8);
      ctx.restore();
    }

    ctx.restore();
  }

  function getCanvasTheme() {
    const theme = THEMES[selectedThemeId] || THEMES.gym;
    return {
      ...(darkMode ? theme.colors.dark : theme.colors.light),
      themeId: theme.id,
      bgStyle: theme.bgStyle,
      motif: theme.motif
    };
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function ensureAudio() {
    if (muted || !platformAudioEnabled || platformPaused || userPaused) return;
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
  }

  function playGameSound(name, context) {
    if (muted || !platformAudioEnabled || platformPaused || userPaused) return;
    const detail = context || {};
    if (name === "button") {
      playTone(360, 0.045, "sine", 0.018, 0, 460);
    } else if (name === "start") {
      playTone(260, 0.09, "triangle", 0.03, 0, 420);
      playTone(520, 0.12, "sine", 0.026, 0.07, 720);
    } else if (name === "shot") {
      playTone(520, 0.07, "triangle", 0.025, 0, 290);
    } else if (name === "rim") {
      playTone(230, 0.045, "triangle", 0.015, 0, 170);
    } else if (name === "wall") {
      playTone(170, 0.055, "square", 0.012, 0, 120);
    } else if (name === "basket") {
      playTone(480, 0.09, "sine", 0.03, 0, 560);
      playTone(720, 0.12, "sine", 0.022, 0.055, 820);
    } else if (name === "swish") {
      playTone(620, 0.1, "sine", 0.032, 0, 760);
      playTone(930, 0.14, "sine", 0.024, 0.045, 1120);
    } else if (name === "wallBonus") {
      playTone(340, 0.08, "triangle", 0.022, 0, 510);
      playTone(680, 0.12, "sine", 0.02, 0.065, 880);
    } else if (name === "combo") {
      const comboPitch = 720 + Math.min(detail.streak || 1, 10) * 28;
      playTone(comboPitch, 0.1, "sine", 0.018, 0.1, comboPitch + 110);
    } else if (name === "countdownTick") {
      const remainingSeconds = clamp(Math.floor(Number(detail.seconds) || 1), 1, 5);
      const tickPitch = 520 + (5 - remainingSeconds) * 55;
      playTone(tickPitch, 0.045, "triangle", 0.018, 0, tickPitch + 70);
    } else if (name === "retry") {
      playTone(280, 0.08, "triangle", 0.022, 0, 390);
      playTone(440, 0.09, "sine", 0.018, 0.06, 520);
    } else if (name === "gameover") {
      playTone(220, 0.18, "sawtooth", 0.026, 0, 105);
      playTone(150, 0.22, "triangle", 0.018, 0.11, 80);
    }
  }

  function readBestScore() {
    if (isPlayablesEnv) return 0;
    try {
      const value = Number(localStorage.getItem(STORAGE_KEY) || 0);
      return Number.isSafeInteger(value) && value >= 0 ? value : 0;
    } catch (error) {
      return 0;
    }
  }

  function writeBestScore(value, isNewRecord) {
    if (!Number.isSafeInteger(value) || value < 0) return;
    if (!persistenceReady) return;
    if (!isPlayablesEnv) {
      try {
        localStorage.setItem(STORAGE_KEY, String(value));
      } catch (error) {
        // Storage can be unavailable in some embedded/browser privacy modes.
      }
    }
    schedulePlatformSave();
    if (isPlayablesEnv && isNewRecord) scheduleScoreSubmission(value);
  }

  function readBooleanPreference(key, fallback) {
    if (isPlayablesEnv) return fallback;
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value === "true";
    } catch (error) {
      return fallback;
    }
  }

  function readLanguagePreference() {
    if (isPlayablesEnv) return "tr";
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
      return savedLanguage === "en" ? "en" : "tr";
    } catch (error) {
      return "tr";
    }
  }

  function normalizeBallSkinId(skinId) {
    return BALL_SKINS[skinId] ? skinId : "classic";
  }

  function readBallSkinPreference() {
    if (isPlayablesEnv) return "classic";
    try {
      const savedSkin = localStorage.getItem(BALL_SKIN_KEY);
      return normalizeBallSkinId(savedSkin);
    } catch (error) {
      return "classic";
    }
  }

  function readThemePreference() {
    if (isPlayablesEnv) return "gym";
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      return THEMES[savedTheme] ? savedTheme : "gym";
    } catch (error) {
      return "gym";
    }
  }

  function t(key) {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.tr[key] || key;
  }

  function createDefaultStats() {
    return {
      activePlayTimeMs: 0,
      lifetimeScore: 0,
      perfectBaskets: 0,
      bounceBaskets: 0,
      worldCoinsCollected: 0
    };
  }

  function normalizeStatValue(value) {
    return Number.isSafeInteger(value) && value >= 0 ? value : 0;
  }

  function normalizeStats(value) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    return {
      activePlayTimeMs: normalizeStatValue(source.activePlayTimeMs),
      lifetimeScore: normalizeStatValue(source.lifetimeScore),
      perfectBaskets: normalizeStatValue(source.perfectBaskets),
      bounceBaskets: normalizeStatValue(source.bounceBaskets),
      worldCoinsCollected: normalizeStatValue(source.worldCoinsCollected)
    };
  }

  function hasCanonicalStats(value, normalized) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const keys = Object.keys(createDefaultStats());
    return Object.keys(value).length === keys.length
      && keys.every((key) => value[key] === normalized[key]);
  }

  function addSafeStat(current, increment) {
    const normalizedCurrent = normalizeStatValue(current);
    const normalizedIncrement = normalizeStatValue(increment);
    return Math.min(Number.MAX_SAFE_INTEGER, normalizedCurrent + normalizedIncrement);
  }

  function recordBasketStats(wasPerfect, usedWall, scoreGain) {
    stats.lifetimeScore = addSafeStat(stats.lifetimeScore, scoreGain);
    if (wasPerfect) stats.perfectBaskets = addSafeStat(stats.perfectBaskets, 1);
    if (usedWall) stats.bounceBaskets = addSafeStat(stats.bounceBaskets, 1);
  }

  function normalizeCoins(value) {
    return Number.isSafeInteger(value) && value >= 0 ? value : 0;
  }

  function normalizeOwnedIds(value, catalog, defaultId) {
    const owned = new Set([defaultId]);
    if (!Array.isArray(value)) return owned;
    for (const id of value) {
      if (typeof id === "string" && catalog[id]) owned.add(id);
    }
    return owned;
  }

  function hasCanonicalOwnedIds(value, owned, catalog) {
    if (!Array.isArray(value)) return false;
    const canonical = Object.keys(catalog).filter((id) => owned.has(id));
    return value.length === canonical.length && value.every((id, index) => id === canonical[index]);
  }

  function migrateSaveData(save, platformLocale, allowSavedLanguage) {
    const source = save && typeof save === "object" && !Array.isArray(save) ? save : null;
    const version = source && Number.isSafeInteger(source.version) ? source.version : 0;
    const settings = source && source.settings && typeof source.settings === "object"
      ? source.settings
      : source || {};
    const savedScore = source ? Number(source.highScore) : 0;
    const highScore = Number.isSafeInteger(savedScore) && savedScore >= 0 ? savedScore : 0;
    const normalizedCoins = version >= ECONOMY_SAVE_VERSION ? normalizeCoins(source?.coins) : 0;
    const normalizedStats = version >= STATS_SAVE_VERSION
      ? normalizeStats(source?.stats)
      : createDefaultStats();
    let ballSkin = normalizeBallSkinId(settings.ballSkin);
    let theme = THEMES[settings.theme] ? settings.theme : "gym";
    const balls = version >= ECONOMY_SAVE_VERSION
      ? normalizeOwnedIds(source?.ownedBallSkins, BALL_SKINS, "classic")
      : new Set(["classic", ballSkin]);
    const themes = version >= ECONOMY_SAVE_VERSION
      ? normalizeOwnedIds(source?.ownedThemes, THEMES, "gym")
      : new Set(["gym", theme]);

    if (!balls.has(ballSkin)) ballSkin = "classic";
    if (!themes.has(theme)) theme = "gym";

    let migratedLanguage = language;
    if (allowSavedLanguage && (settings.language === "tr" || settings.language === "en")) {
      migratedLanguage = settings.language;
    } else if (typeof platformLocale === "string" && platformLocale) {
      migratedLanguage = platformLocale.toLowerCase().startsWith("tr") ? "tr" : "en";
    }

    const needsMigration = Boolean(source) && (
      version !== SAVE_VERSION
      || highScore !== source.highScore
      || normalizedCoins !== source.coins
      || !hasCanonicalStats(source.stats, normalizedStats)
      || !hasCanonicalOwnedIds(source.ownedBallSkins, balls, BALL_SKINS)
      || !hasCanonicalOwnedIds(source.ownedThemes, themes, THEMES)
      || settings.ballSkin !== ballSkin
      || settings.theme !== theme
      || typeof settings.darkMode !== "boolean"
      || typeof settings.muted !== "boolean"
    );

    return {
      highScore,
      coins: normalizedCoins,
      stats: normalizedStats,
      ownedBallSkins: balls,
      ownedThemes: themes,
      darkMode: typeof settings.darkMode === "boolean" ? settings.darkMode : false,
      muted: typeof settings.muted === "boolean" ? settings.muted : false,
      ballSkin,
      theme,
      language: migratedLanguage,
      needsMigration
    };
  }

  function applyMigratedSave(migrated) {
    best = migrated.highScore;
    coins = migrated.coins;
    stats = migrated.stats;
    ownedBallSkins = migrated.ownedBallSkins;
    ownedThemes = migrated.ownedThemes;
    darkMode = migrated.darkMode;
    muted = migrated.muted;
    selectedBallSkinId = migrated.ballSkin;
    selectedThemeId = migrated.theme;
    language = migrated.language;
    ballEffects.selectedPreset = BALL_SKINS[selectedBallSkinId].effectPreset;
  }

  function readLocalSaveRecord() {
    let rawData = null;
    let parsed = null;
    let invalidUnifiedSave = false;
    try {
      rawData = localStorage.getItem(LOCAL_SAVE_KEY);
      if (rawData && rawData.trim()) {
        const candidate = JSON.parse(rawData);
        if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) parsed = candidate;
        else invalidUnifiedSave = true;
      }
    } catch (error) {
      invalidUnifiedSave = Boolean(rawData);
    }
    if (parsed) return { save: parsed, shouldPersist: false };

    let hasLegacyData = false;
    try {
      hasLegacyData = [STORAGE_KEY, DARK_MODE_KEY, MUTED_KEY, LANGUAGE_KEY, BALL_SKIN_KEY, THEME_KEY]
        .some((key) => localStorage.getItem(key) !== null);
    } catch (error) {
      hasLegacyData = false;
    }
    if (!hasLegacyData) return { save: null, shouldPersist: invalidUnifiedSave };
    return {
      save: {
        version: 3,
        highScore: readBestScore(),
        settings: {
          language: readLanguagePreference(),
          darkMode: readBooleanPreference(DARK_MODE_KEY, false),
          muted: readBooleanPreference(MUTED_KEY, false),
          ballSkin: readBallSkinPreference(),
          theme: readThemePreference()
        }
      },
      shouldPersist: true
    };
  }

  function writeBooleanPreference(key, value, immediate) {
    if (!persistenceReady) return;
    if (!isPlayablesEnv) {
      try {
        localStorage.setItem(key, String(value));
      } catch (error) {
        // Preferences can be unavailable in embedded/browser privacy modes.
      }
    }
    requestSave(Boolean(immediate));
  }

  function writeLanguagePreference(value, immediate) {
    if (!persistenceReady) return;
    if (!isPlayablesEnv) {
      try {
        localStorage.setItem(LANGUAGE_KEY, value);
      } catch (error) {
        // Language preferences can be unavailable in privacy modes.
      }
    }
    requestSave(Boolean(immediate));
  }

  function writeBallSkinPreference(value, immediate) {
    if (!persistenceReady) return;
    if (!isPlayablesEnv) {
      try {
        localStorage.setItem(BALL_SKIN_KEY, value);
      } catch (error) {
        // Ball selection can be unavailable in privacy modes.
      }
    }
    requestSave(Boolean(immediate));
  }

  function writeThemePreference(value, immediate) {
    if (!persistenceReady) return;
    if (!isPlayablesEnv) {
      try {
        localStorage.setItem(THEME_KEY, value);
      } catch (error) {
        // Theme selection can be unavailable in privacy modes.
      }
    }
    requestSave(Boolean(immediate));
  }

  function makeSaveObject(forPlayables) {
    commitActivePlaySegment({ keepRunning: canAccumulateActivePlayTime() });
    const settings = {
      darkMode: Boolean(darkMode),
      muted: Boolean(muted),
      ballSkin: ownedBallSkins.has(selectedBallSkinId) ? selectedBallSkinId : "classic",
      theme: ownedThemes.has(selectedThemeId) ? selectedThemeId : "gym"
    };
    if (!forPlayables) settings.language = language;
    return {
      version: SAVE_VERSION,
      highScore: Number.isSafeInteger(best) && best >= 0 ? best : 0,
      coins: normalizeCoins(coins),
      stats: normalizeStats(stats),
      ownedBallSkins: Object.keys(BALL_SKINS).filter((id) => ownedBallSkins.has(id)),
      ownedThemes: Object.keys(THEMES).filter((id) => ownedThemes.has(id)),
      settings
    };
  }

  function makePlatformSaveData() {
    return JSON.stringify(makeSaveObject(isPlayablesEnv));
  }

  function markSaveDirty() {
    if (!persistenceReady) return;
    saveRevision += 1;
    saveDirty = true;
  }

  function requestSave(immediate) {
    if (!persistenceReady) return;
    markSaveDirty();
    if (immediate) {
      if (cloudSaveTimer !== null) window.clearTimeout(cloudSaveTimer);
      cloudSaveTimer = null;
      void drainSaveQueue();
      return;
    }
    if (cloudSaveTimer !== null) window.clearTimeout(cloudSaveTimer);
    cloudSaveTimer = window.setTimeout(() => {
      cloudSaveTimer = null;
      void drainSaveQueue();
    }, 350);
  }

  function schedulePlatformSave() {
    requestSave(false);
  }

  async function persistSaveData(data) {
    if (isPlayablesEnv) {
      if (!platformBootComplete || !playablesBridge) return false;
      return playablesBridge.saveData(data);
    }
    try {
      localStorage.setItem(LOCAL_SAVE_KEY, data);
      return true;
    } catch (error) {
      console.warn("[Hoop Flick] Local save failed; it will be retried later.", error);
      return false;
    }
  }

  async function drainSaveQueue() {
    if (!persistenceReady || !saveDirty) return true;
    if (saveInFlight) {
      saveDrainQueued = true;
      return false;
    }
    saveInFlight = true;
    let succeeded = true;
    try {
      do {
        saveDrainQueued = false;
        const revision = saveRevision;
        const data = makePlatformSaveData();
        const saved = await persistSaveData(data);
        if (!saved) {
          succeeded = false;
          break;
        }
        savedRevision = revision;
        if (saveRevision === revision) saveDirty = false;
      } while (saveDrainQueued || saveRevision > savedRevision);
    } catch (error) {
      succeeded = false;
      console.warn("[Hoop Flick] Save failed; it will be retried later.", error);
    } finally {
      saveInFlight = false;
    }
    return succeeded;
  }

  function flushPlatformSave() {
    if (!persistenceReady) return Promise.resolve(false);
    if (commitActivePlaySegment({ keepRunning: canAccumulateActivePlayTime() })) markSaveDirty();
    if (cloudSaveTimer !== null) {
      window.clearTimeout(cloudSaveTimer);
      cloudSaveTimer = null;
    }
    return drainSaveQueue();
  }

  function scheduleScoreSubmission(value) {
    if (!isPlayablesEnv || !playablesBridge || !Number.isSafeInteger(value) || value < 0) return;
    pendingHighScore = Math.max(pendingHighScore ?? 0, value);
    if (scoreSubmitTimer !== null) window.clearTimeout(scoreSubmitTimer);
    scoreSubmitTimer = window.setTimeout(flushScoreSubmission, 650);
  }

  function flushScoreSubmission() {
    if (scoreSubmitTimer !== null) {
      window.clearTimeout(scoreSubmitTimer);
      scoreSubmitTimer = null;
    }
    if (pendingHighScore === null || !playablesBridge) return;
    const value = pendingHighScore;
    pendingHighScore = null;
    playablesBridge.sendScore(value);
  }

  function applyPlatformSave(rawData, platformLocale) {
    let save = null;
    let invalidSave = false;
    if (typeof rawData === "string" && rawData.trim()) {
      try {
        const parsed = JSON.parse(rawData);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) save = parsed;
        else invalidSave = true;
      } catch (error) {
        invalidSave = true;
        console.warn("[Hoop Flick] Invalid cloud save; defaults will be used.", error);
      }
    }
    const migrated = migrateSaveData(save, platformLocale, true);
    applyMigratedSave(migrated);
    return invalidSave || migrated.needsMigration;
  }

  function formatActivePlayTime(value) {
    const totalSeconds = Math.floor(normalizeStatValue(value) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
  }

  function renderProfile() {
    if (!activePlayTimeValue) return;
    const normalized = normalizeStats(stats);
    activePlayTimeValue.textContent = formatActivePlayTime(normalized.activePlayTimeMs);
    perfectBasketsValue.textContent = String(normalized.perfectBaskets);
    bounceBasketsValue.textContent = String(normalized.bounceBaskets);
    lifetimeScoreValue.textContent = String(normalized.lifetimeScore);
    worldCoinsCollectedValue.textContent = String(normalized.worldCoinsCollected);
  }

  function applyDarkMode() {
    document.body.classList.toggle("dark-mode", darkMode);
    themeColor.setAttribute("content", darkMode ? "#101923" : "#f7f3e8");
    writeBooleanPreference(DARK_MODE_KEY, darkMode);
    preloadHoopSpriteSet();
    if (userPaused) draw();
    renderThemeCustomizer();
    syncControlLabels();
  }

  function applyLanguage() {
    document.documentElement.lang = language;
    for (const element of document.querySelectorAll("[data-i18n]")) {
      element.textContent = t(element.dataset.i18n);
    }
    for (const element of document.querySelectorAll("[data-i18n-aria-label]")) {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    }
    writeLanguagePreference(language);
    if (state === "gameover") finalScore.textContent = t("score") + " " + score;
    clearEconomyStatus("ball");
    clearEconomyStatus("theme");
    renderProfile();
    syncEconomyBalances();
    renderBallCustomizer();
    renderThemeCustomizer();
    syncControlLabels();
    syncRewardedUi();
    syncTimedShotHud(true);
  }

  function getSelectedBallSkin() {
    return BALL_SKINS[selectedBallSkinId] || BALL_SKINS.classic;
  }

  function getCosmeticStateLabel(isSelected, isOwned, price) {
    if (isSelected) return t("selectedSkin");
    if (isOwned) return t("owned");
    return t("locked") + " · " + price + " " + t("coins");
  }

  function syncEconomyBalances() {
    const value = String(normalizeCoins(coins));
    if (coinHudValue) coinHudValue.textContent = value;
    if (ballCoinBalanceValue) ballCoinBalanceValue.textContent = value;
    if (themeCoinBalanceValue) themeCoinBalanceValue.textContent = value;
    const label = t("coinBalance") + ": " + value;
    if (coinHud) coinHud.setAttribute("aria-label", label);
    if (ballCoinBalance) ballCoinBalance.setAttribute("aria-label", label);
    if (themeCoinBalance) themeCoinBalance.setAttribute("aria-label", label);
  }

  function hasRewardedCapability() {
    if (!playablesBridge || typeof playablesBridge.isRewardedAdAvailable !== "function") return false;
    try {
      return playablesBridge.isRewardedAdAvailable() === true;
    } catch (error) {
      return false;
    }
  }

  function syncRewardedUi() {
    const available = hasRewardedCapability();
    const busy = Boolean(rewardedRequest);
    const coinLabel = busy
      ? t("rewardedPending")
      : available
        ? t("watchAdCoins")
        : t("rewardedUnavailable");
    for (const button of [ballRewardedCoinButton, themeRewardedCoinButton]) {
      if (!button) continue;
      const label = button.querySelector("span:last-child");
      if (label) label.textContent = coinLabel;
      button.disabled = !platformReady || platformPaused || !available || busy;
      button.setAttribute("aria-busy", String(busy));
      button.setAttribute("aria-label", coinLabel);
      button.title = available ? "" : t("rewardedUnavailable");
    }

    const continuePending = rewardedRequest?.kind === "continue";
    if (reviveRewardButton) {
      reviveRewardButton.disabled = state !== "revive-offer" || platformPaused || !available || busy;
      reviveRewardButton.setAttribute("aria-busy", String(continuePending));
      reviveRewardButton.textContent = continuePending ? t("rewardedPending") : t("watchAdContinue");
    }
    if (reviveFinishButton) {
      reviveFinishButton.disabled = state !== "revive-offer" || platformPaused || continuePending;
    }
  }

  function requestRewardedCoins(origin) {
    if (!platformReady || platformPaused || rewardedRequest || !hasRewardedCapability()) {
      syncRewardedUi();
      return false;
    }
    clearEconomyStatus(origin);
    return startRewardedRequest("coins", COIN_REWARD_ID, origin);
  }

  function requestRewardedContinue() {
    if (
      state !== "revive-offer"
      || !reviveOfferActive
      || gameOverFinalized
      || reviveUsed
      || platformPaused
      || rewardedRequest
      || !hasRewardedCapability()
    ) {
      if (state === "revive-offer" && !rewardedRequest) finalizeGameOver();
      return false;
    }
    if (reviveOfferStatus) reviveOfferStatus.textContent = t("rewardedPending");
    return startRewardedRequest("continue", CONTINUE_REWARD_ID, "revive");
  }

  function startRewardedRequest(kind, rewardId, origin) {
    if (rewardedRequest || !playablesBridge || typeof playablesBridge.requestRewardedAd !== "function") return false;
    const request = {
      id: rewardedRequestSequence += 1,
      kind,
      origin,
      settled: false,
      earned: false
    };
    rewardedRequest = request;
    syncRewardedUi();
    let result;
    try {
      result = playablesBridge.requestRewardedAd(rewardId);
    } catch (error) {
      settleRewardedRequest(request, false);
      return true;
    }
    Promise.resolve(result).then(
      (earned) => settleRewardedRequest(request, earned === true),
      () => settleRewardedRequest(request, false)
    );
    return true;
  }

  function settleRewardedRequest(request, earned) {
    if (rewardedRequest !== request || request.settled) return;
    request.settled = true;
    request.earned = earned === true;
    if (platformPaused) {
      syncRewardedUi();
      return;
    }
    completeRewardedRequest(request);
  }

  function completeRewardedRequest(request, restartLoop) {
    if (rewardedRequest !== request || !request.settled || platformPaused) return false;
    rewardedRequest = null;
    if (request.kind === "coins") {
      if (request.earned === true) {
        coins = Math.min(Number.MAX_SAFE_INTEGER, normalizeCoins(coins) + REWARDED_COIN_AMOUNT);
        syncEconomyBalances();
        showEconomyStatus(request.origin, t("rewardedCoinsGranted"));
        requestSave(true);
      } else {
        showEconomyStatus(request.origin, t("rewardedNotEarned"));
      }
      syncRewardedUi();
      return true;
    }
    if (request.kind === "continue" && state === "revive-offer" && !gameOverFinalized) {
      if (reviveOfferStatus) reviveOfferStatus.textContent = request.earned === true ? "" : t("rewardedNotEarned");
      if (request.earned === true) {
        resumeFromRewardedContinue(restartLoop);
      } else {
        finalizeGameOver();
      }
    }
    syncRewardedUi();
    return true;
  }

  function processDeferredRewardedRequest() {
    if (!rewardedRequest?.settled || platformPaused) return false;
    return completeRewardedRequest(rewardedRequest, false);
  }

  function declineReviveOffer() {
    if (state !== "revive-offer" || rewardedRequest?.kind === "continue") return false;
    return finalizeGameOver();
  }

  function updateReviveOffer(dt) {
    if (!reviveOfferActive || state !== "revive-offer" || rewardedRequest?.kind === "continue") return;
    reviveOfferRemaining = Math.max(0, reviveOfferRemaining - dt);
    if (reviveOfferCountdown) reviveOfferCountdown.textContent = reviveOfferRemaining.toFixed(1);
    if (reviveOfferRemaining <= 0) finalizeGameOver();
  }

  function clearEconomyStatus(kind) {
    const status = kind === "ball" ? ballEconomyStatus : themeEconomyStatus;
    if (economyStatusTimers[kind] !== null) {
      window.clearTimeout(economyStatusTimers[kind]);
      economyStatusTimers[kind] = null;
    }
    if (status) status.textContent = "";
  }

  function showEconomyStatus(kind, message) {
    const status = kind === "ball" ? ballEconomyStatus : themeEconomyStatus;
    clearEconomyStatus(kind);
    if (!status) return;
    status.textContent = message;
    economyStatusTimers[kind] = window.setTimeout(() => {
      economyStatusTimers[kind] = null;
      status.textContent = "";
    }, 2200);
  }

  function createBallPreviewElement(sizeClass, skin) {
    const previewSkin = skin || getSelectedBallSkin();
    const preview = document.createElement("span");
    preview.className = "ballPreviewGraphic" + (sizeClass ? " " + sizeClass : "");
    preview.setAttribute("aria-hidden", "true");
    if (previewSkin.assetPath) {
      const image = document.createElement("img");
      preview.classList.add("hasAsset");
      image.className = "ballPreviewImage";
      image.src = previewSkin.assetPath;
      image.alt = "";
      preview.appendChild(image);
      return preview;
    }
    preview.style.setProperty("--ball-light", previewSkin.colors.light);
    preview.style.setProperty("--ball-mid", previewSkin.colors.mid);
    preview.style.setProperty("--ball-dark", previewSkin.colors.dark);
    preview.style.setProperty("--ball-seam", previewSkin.colors.seam);
    preview.style.setProperty("--ball-outline", previewSkin.colors.outline);
    if (!previewSkin.noSeams) {
      for (const seamName of ["horizontal", "vertical", "leftArc", "rightArc"]) {
        const seam = document.createElement("span");
        seam.className = "ballSeam " + seamName;
        preview.appendChild(seam);
      }
    } else {
      preview.classList.add("noSeams");
    }
    return preview;
  }

  function renderBallCustomizer() {
    if (!customizeBallPreview || !customizeBallName || !ballSkinList) return;
    syncEconomyBalances();
    const selectedSkin = getSelectedBallSkin();
    customizeBallPreview.replaceChildren(createBallPreviewElement("large"));
    customizeBallName.textContent = t(selectedSkin.nameKey);
    ballSkinList.replaceChildren();

    for (const skinId of BALL_SKIN_DISPLAY_ORDER) {
      const skin = BALL_SKINS[skinId];
      if (!skin) continue;
      const option = document.createElement("button");
      const isSelected = skin.id === selectedBallSkinId;
      const isOwned = ownedBallSkins.has(skin.id);
      const price = ECONOMY_PRICES.ball[skin.id] ?? 0;
      const stateLabel = isSelected ? t("selectedSkin") : getCosmeticStateLabel(false, isOwned, price);
      option.type = "button";
      option.className = "ballSkinOption" + (isOwned ? "" : " locked");
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(isSelected));
      option.setAttribute("aria-label", t(skin.nameKey) + ", " + stateLabel);
      option.appendChild(createBallPreviewElement("", skin));

      const copy = document.createElement("span");
      const name = document.createElement("strong");
      const description = document.createElement("small");
      name.textContent = t(skin.nameKey);
      description.textContent = stateLabel;
      copy.append(name, description);
      option.appendChild(copy);

      const check = document.createElement("span");
      check.className = "ballSkinCheck" + (isOwned ? "" : " locked");
      check.setAttribute("aria-hidden", "true");
      check.textContent = isSelected ? "✓" : "";
      option.appendChild(check);
      option.addEventListener("click", () => selectBallSkin(skin.id));
      ballSkinList.appendChild(option);
    }
  }

  function renderThemeCustomizer() {
    if (!themeList) return;
    syncEconomyBalances();
    themeList.replaceChildren();

    for (const themeId of THEME_DISPLAY_ORDER) {
      const theme = THEMES[themeId];
      if (!theme) continue;
      const option = document.createElement("button");
      const isSelected = theme.id === selectedThemeId;
      const isOwned = ownedThemes.has(theme.id);
      const price = ECONOMY_PRICES.theme[theme.id] ?? 0;
      const stateLabel = isSelected ? t("selectedTheme") : getCosmeticStateLabel(false, isOwned, price);
      const colors = darkMode ? theme.colors.dark : theme.colors.light;
      option.type = "button";
      option.className = "themeOption" + (isOwned ? "" : " locked");
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(isSelected));
      option.setAttribute("aria-label", t(theme.nameKey) + ", " + stateLabel);
      option.style.setProperty("--theme-bg-top", colors.backgroundTop);
      option.style.setProperty("--theme-bg-bottom", colors.backgroundBottom);
      option.style.setProperty("--theme-rim", colors.rim);
      option.style.setProperty("--theme-wall", colors.wallEdge);

      const swatch = document.createElement("span");
      swatch.className = "themeSwatch";
      swatch.setAttribute("aria-hidden", "true");

      const copy = document.createElement("span");
      const name = document.createElement("strong");
      const description = document.createElement("small");
      name.textContent = t(theme.nameKey);
      description.textContent = stateLabel;
      copy.append(name, description);

      const check = document.createElement("span");
      check.className = "ballSkinCheck" + (isOwned ? "" : " locked");
      check.setAttribute("aria-hidden", "true");
      check.textContent = isSelected ? "✓" : "";
      option.append(swatch, copy, check);
      option.addEventListener("click", () => selectTheme(theme.id));
      themeList.appendChild(option);
    }
  }

  function selectBallSkin(skinId) {
    if (!BALL_SKINS[skinId] || platformPaused || rewardedRequest) return;
    const price = ECONOMY_PRICES.ball[skinId] ?? 0;
    const isOwned = ownedBallSkins.has(skinId);
    if (!isOwned && coins < price) {
      showEconomyStatus("ball", t("insufficientCoins") + " · " + price + " " + t("coins"));
      ensureAudio();
      playGameSound("button");
      return;
    }
    if (!isOwned) {
      coins -= price;
      ownedBallSkins.add(skinId);
    }
    selectedBallSkinId = skinId;
    ballEffects.selectedPreset = BALL_SKINS[skinId].effectPreset;
    writeBallSkinPreference(skinId, !isOwned);
    syncEconomyBalances();
    renderBallCustomizer();
    if (!isOwned) showEconomyStatus("ball", t("purchased") + ": " + t(BALL_SKINS[skinId].nameKey));
    ensureAudio();
    playGameSound("button");
  }

  function selectTheme(themeId) {
    if (!THEMES[themeId] || platformPaused || rewardedRequest) return;
    const price = ECONOMY_PRICES.theme[themeId] ?? 0;
    const isOwned = ownedThemes.has(themeId);
    if (!isOwned && coins < price) {
      showEconomyStatus("theme", t("insufficientCoins") + " · " + price + " " + t("coins"));
      ensureAudio();
      playGameSound("button");
      return;
    }
    if (!isOwned) {
      coins -= price;
      ownedThemes.add(themeId);
    }
    selectedThemeId = themeId;
    preloadHoopSpriteSet();
    writeThemePreference(themeId, !isOwned);
    syncEconomyBalances();
    renderThemeCustomizer();
    if (!isOwned) showEconomyStatus("theme", t("purchased") + ": " + t(THEMES[themeId].nameKey));
    draw();
    ensureAudio();
    playGameSound("button");
  }

  function toggleLanguage() {
    if (!platformReady || platformPaused) return;
    ensureAudio();
    language = language === "tr" ? "en" : "tr";
    applyLanguage();
    playGameSound("button");
  }

  function toggleDarkMode() {
    if (!platformReady || platformPaused) return;
    ensureAudio();
    darkMode = !darkMode;
    applyDarkMode();
    playGameSound("button");
  }

  function toggleSound() {
    if (!platformReady || platformPaused) return;
    muted = !muted;
    writeBooleanPreference(MUTED_KEY, muted);
    syncControlLabels();
    if (!muted) {
      ensureAudio();
      playGameSound("button");
    }
  }

  function syncControlLabels() {
    const soundEnabled = !muted && platformAudioEnabled;
    const enabledLabel = darkMode ? t("on") : t("off");
    const darkLabel = t("darkMode") + ": " + enabledLabel;
    settingsSoundButton.setAttribute("aria-pressed", String(soundEnabled));
    settingsSoundButton.textContent = t("sound") + ": " + (soundEnabled ? t("on") : t("off"));
    settingsDarkModeButton.setAttribute("aria-pressed", String(darkMode));
    settingsDarkModeButton.textContent = darkLabel;
    languageButton.textContent = t("language") + ": " + (language === "tr" ? t("turkish") : t("english"));
    menuButton.textContent = t("menu");
    menuButton.setAttribute("aria-label", menuButton.textContent);
  }

  function syncUiState() {
    const hideHud = state === "menu" || state === "profile" || state === "settings" || state === "customize" || state === "theme" || state === "pause-settings";
    hud.classList.toggle("hidden", hideHud);
    hud.classList.toggle("pauseActive", state === "paused");
    syncControlLabels();
  }

  function openMenuPanel(panelName) {
    if (!platformReady || platformPaused) return;
    ensureAudio();
    playGameSound("button");
    setGameState(panelName);
    settingsOrigin = "menu";
    if (panelName === "customize") {
      renderBallCustomizer();
    } else if (panelName === "theme") {
      renderThemeCustomizer();
    } else if (panelName === "profile") {
      renderProfile();
    }
    mainMenuOverlay.classList.remove("active");
    profileOverlay.classList.toggle("active", panelName === "profile");
    settingsOverlay.classList.toggle("active", panelName === "settings");
    customizeOverlay.classList.toggle("active", panelName === "customize");
    themeOverlay?.classList.toggle("active", panelName === "theme");
    syncUiState();
  }

  function returnToMainMenu() {
    if (!platformReady || platformPaused) return;
    ensureAudio();
    playGameSound("button");
    setGameState("menu");
    profileOverlay.classList.remove("active");
    settingsOverlay.classList.remove("active");
    customizeOverlay.classList.remove("active");
    themeOverlay?.classList.remove("active");
    mainMenuOverlay.classList.add("active");
    syncUiState();
  }

  function pauseGameplay() {
    if (!platformReady || platformPaused || userPaused || state !== "playing") return;
    ensureAudio();
    playGameSound("button");
    userPaused = true;
    settingsOrigin = "pause";
    const activeTimeChanged = setGameState("paused");
    drag = null;
    if (activePointer !== null && canvas.hasPointerCapture(activePointer)) {
      canvas.releasePointerCapture(activePointer);
    }
    activePointer = null;
    stopAnimationLoop();
    if (audioContext && audioContext.state === "running") audioContext.suspend().catch(() => {});
    pauseOverlay.classList.add("active");
    settingsOverlay.classList.remove("active");
    syncUiState();
    if (activeTimeChanged) schedulePlatformSave();
  }

  function resumePausedGame() {
    if (!platformReady || platformPaused || !userPaused || state !== "paused") return;
    userPaused = false;
    setGameState("playing");
    pauseOverlay.classList.remove("active");
    syncUiState();
    if (platformAudioEnabled && !muted && audioContext) audioContext.resume().catch(() => {});
    restartAnimationLoop();
  }

  function handlePauseOverlayClick(event) {
    if (event.target !== pauseOverlay) return;
    resumePausedGame();
  }

  function openPauseSettings() {
    if (!userPaused || state !== "paused" || platformPaused) return;
    setGameState("pause-settings");
    settingsOrigin = "pause";
    pauseOverlay.classList.remove("active");
    settingsOverlay.classList.add("active");
    syncUiState();
  }

  function closeSettings() {
    if (!platformReady || platformPaused) return;
    if (settingsOrigin === "pause" && userPaused) {
      setGameState("paused");
      settingsOverlay.classList.remove("active");
      pauseOverlay.classList.add("active");
      syncUiState();
      return;
    }
    returnToMainMenu();
  }

  function exitGameplayToMainMenu() {
    if (!platformReady || platformPaused) return;
    ensureAudio();
    playGameSound("button");
    flushScoreSubmission();
    if (stopActivePlayClock()) markSaveDirty();
    userPaused = false;
    pauseOverlay.classList.remove("active");
    settingsOverlay.classList.remove("active");
    themeOverlay?.classList.remove("active");
    resetGame(true);
    void flushPlatformSave();
    restartAnimationLoop();
  }

  function canRunAnimationLoop() {
    return platformReady && !platformPaused && !userPaused;
  }

  function stopAnimationLoop() {
    animationLoopGeneration += 1;
    if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    lastTime = 0;
  }

  function restartAnimationLoop() {
    stopAnimationLoop();
    if (!canRunAnimationLoop()) return;

    const generation = animationLoopGeneration;
    animationFrameId = window.requestAnimationFrame((now) => {
      if (generation !== animationLoopGeneration) return;
      if (!canRunAnimationLoop()) {
        stopAnimationLoop();
        return;
      }

      // Align with the browser's current paint cadence before physics begins.
      lastTime = now;
      animationFrameId = window.requestAnimationFrame((nextNow) => loop(nextNow, generation, true));
    });
  }

  function handlePlatformAudioChange(enabled) {
    platformAudioEnabled = Boolean(enabled);
    if (!platformAudioEnabled && audioContext && audioContext.state === "running") {
      audioContext.suspend().catch(() => {});
    } else if (platformAudioEnabled && !muted && !platformPaused && !userPaused && audioContext) {
      audioContext.resume().catch(() => {});
    }
    syncControlLabels();
  }

  function handlePlatformPause() {
    if (platformPaused) return;
    if (stopActivePlayClock()) markSaveDirty();
    platformPaused = true;
    gameShell.inert = true;
    drag = null;
    if (activePointer !== null && canvas.hasPointerCapture(activePointer)) {
      canvas.releasePointerCapture(activePointer);
    }
    activePointer = null;
    stopAnimationLoop();
    syncRewardedUi();
    if (audioContext && audioContext.state === "running") audioContext.suspend().catch(() => {});
    flushScoreSubmission();
    flushPlatformSave();
  }

  function handlePlatformResume() {
    if (!platformPaused) return;
    platformPaused = false;
    gameShell.inert = false;
    startActivePlayClock();
    if (platformAudioEnabled && !muted && !userPaused && audioContext) audioContext.resume().catch(() => {});
    processDeferredRewardedRequest();
    syncRewardedUi();
    restartAnimationLoop();
  }

  function playTone(freq, duration, type, gain, delay, endFreq) {
    if (muted || !platformAudioEnabled || platformPaused || userPaused || !audioContext) return;
    const now = audioContext.currentTime + (delay || 0);
    const osc = audioContext.createOscillator();
    const amp = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), now + duration);
    amp.gain.setValueAtTime(0, now);
    amp.gain.linearRampToValueAtTime(gain, now + 0.01);
    amp.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(amp);
    amp.connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function loop(now, generation, firstPhysicsFrame) {
    if (generation !== animationLoopGeneration) return;
    if (!canRunAnimationLoop()) {
      stopAnimationLoop();
      return;
    }
    const dt = firstPhysicsFrame ? 0 : Math.min(0.033, (now - lastTime) / 1000 || 0);
    lastTime = now;
    update(dt);
    draw();
    if (generation !== animationLoopGeneration || !canRunAnimationLoop()) return;
    animationFrameId = window.requestAnimationFrame((nextNow) => loop(nextNow, generation, false));
  }

  async function bootGame() {
    resize();
    applyLanguage();
    applyDarkMode();
    resetGame(true);
    draw();
    if (playablesBridge) playablesBridge.firstFrameReady();

    let platformState = {
      data: null,
      audioEnabled: true,
      language: null,
      inPlayablesEnv: false
    };
    if (playablesBridge) {
      try {
        platformState = await playablesBridge.initialize({
          onAudioEnabledChange: handlePlatformAudioChange,
          onPause: handlePlatformPause,
          onResume: handlePlatformResume
        });
      } catch (error) {
        console.warn("[Hoop Flick] Playables initialization failed; local fallback is active.", error);
      }
    }

    isPlayablesEnv = Boolean(platformState.inPlayablesEnv);
    platformAudioEnabled = platformState.audioEnabled !== false;
    let shouldPersistMigratedSave = false;
    if (isPlayablesEnv) {
      shouldPersistMigratedSave = applyPlatformSave(platformState.data, platformState.language);
    } else {
      const localRecord = readLocalSaveRecord();
      const migrated = migrateSaveData(localRecord.save, null, true);
      applyMigratedSave(migrated);
      shouldPersistMigratedSave = localRecord.shouldPersist || migrated.needsMigration;
    }
    applyLanguage();
    applyDarkMode();
    resetGame(true);
    platformBootComplete = true;
    persistenceReady = true;
    platformReady = true;
    gameShell.inert = platformPaused;
    syncRewardedUi();
    if (shouldPersistMigratedSave) requestSave(true);
    if (playablesBridge) playablesBridge.gameReady();
    restartAnimationLoop();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("orientationchange", resize, { passive: true });
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);

  startButton.addEventListener("click", startGame);
  profileButton.addEventListener("click", () => openMenuPanel("profile"));
  customizeButton.addEventListener("click", () => openMenuPanel("customize"));
  if (customizeThemeButton) customizeThemeButton.addEventListener("click", () => openMenuPanel("theme"));
  settingsButton.addEventListener("click", () => openMenuPanel("settings"));
  settingsSoundButton.addEventListener("click", toggleSound);
  settingsDarkModeButton.addEventListener("click", toggleDarkMode);
  languageButton.addEventListener("click", toggleLanguage);
  settingsBackButton.addEventListener("click", closeSettings);
  profileBackButton.addEventListener("click", returnToMainMenu);
  customizeBackButton.addEventListener("click", returnToMainMenu);
  if (themeBackButton) themeBackButton.addEventListener("click", returnToMainMenu);
  ballRewardedCoinButton?.addEventListener("click", () => requestRewardedCoins("ball"));
  themeRewardedCoinButton?.addEventListener("click", () => requestRewardedCoins("theme"));
  reviveRewardButton?.addEventListener("click", requestRewardedContinue);
  reviveFinishButton?.addEventListener("click", declineReviveOffer);
  menuButton.addEventListener("click", pauseGameplay);
  pauseContinueButton.addEventListener("click", resumePausedGame);
  pauseOverlay.addEventListener("click", handlePauseOverlayClick);
  pauseMainMenuButton.addEventListener("click", exitGameplayToMainMenu);
  pauseSettingsButton.addEventListener("click", openPauseSettings);
  gameOverMenuButton.addEventListener("click", exitGameplayToMainMenu);
  retryMenuButton.addEventListener("click", exitGameplayToMainMenu);
  restartButton.addEventListener("click", () => {
    if (!platformReady || platformPaused) return;
    ensureAudio();
    resetGame(false);
    playGameSound("start");
  });
  retryButton.addEventListener("click", () => {
    if (!platformReady || platformPaused) return;
    ensureAudio();
    retryShot();
    playGameSound("retry");
  });
  window.addEventListener("keydown", (event) => {
    if (!platformReady || platformPaused) return;
    if (event.key === "Escape") {
      if (event.repeat) return;
      if (state === "playing") {
        event.preventDefault();
        pauseGameplay();
        return;
      }
      if (state === "paused") {
        event.preventDefault();
        resumePausedGame();
        return;
      }
      if (state === "pause-settings" || state === "settings") {
        event.preventDefault();
        closeSettings();
        return;
      }
      if (state === "profile" || state === "customize" || state === "theme") {
        event.preventDefault();
        returnToMainMenu();
        return;
      }
    }
    if (event.key === " " && state === "menu") startGame();
    if ((event.key === "r" || event.key === "R") && state === "gameover") {
      resetGame(false);
      playGameSound("start");
    }
    if ((event.key === "r" || event.key === "R") && state === "retry") {
      retryShot();
      playGameSound("retry");
    }
  });

  preloadHoopSpriteSet();
  bootGame();
})();
