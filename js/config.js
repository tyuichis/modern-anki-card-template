// --- Global Variables & Initial Checks ---
var isMobile;
if (typeof isMobile === 'undefined') {
  // Check if already defined (e.g., by front template)
  isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
}

// --- High Contrast Mode Detection ---
function isHighContrastMode() {
  // Check for prefers-contrast: more (modern browsers)
  if (window.matchMedia('(prefers-contrast: more)').matches) {
    return true;
  }
  // Check for forced-colors: active (Windows High Contrast Mode)
  if (window.matchMedia('(forced-colors: active)').matches) {
    return true;
  }
  // Check for legacy msHighContrast (older Edge/IE)
  if (window.matchMedia('(ms-high-contrast: active)').matches) {
    return true;
  }
  return false;
}

// --- Color Palettes ---
if (!globalThis.labelColors) {
  const useHighContrast = isHighContrastMode();
  globalThis.labelColors = useHighContrast
    ? {
        // --- High Contrast Colors ---
        yellow: {
          dark: { fontColor: '#ffe78a', backgroundColor: '#301d00' },
          light: { fontColor: '#5c4800', backgroundColor: '#FFF8E1' },
        },
        red: {
          dark: { fontColor: '#ffe3e3', backgroundColor: '#4f0000' },
          light: { fontColor: '#8c1111', backgroundColor: '#FFEBEE' },
        },
        blue: {
          dark: { fontColor: '#d7ebf7', backgroundColor: '#03214f' },
          light: { fontColor: '#184272', backgroundColor: '#E3F2FD' },
        },
        green: {
          dark: { fontColor: '#bcf5d8', backgroundColor: '#17291c' },
          light: { fontColor: '#235415', backgroundColor: '#E8F5E9' },
        },
        orange: {
          dark: { fontColor: '#ffe4b3', backgroundColor: '#381000' },
          light: { fontColor: '#913800', backgroundColor: '#FFF3E0' },
        },
        pink: {
          dark: { fontColor: '#ffdef5', backgroundColor: '#3b1220' },
          light: { fontColor: '#871a48', backgroundColor: '#fceaf1' },
        },
        turquoise: {
          dark: { fontColor: '#b0f5e7', backgroundColor: '#0a243b' },
          light: { fontColor: '#004C4C', backgroundColor: '#E0F7FA' },
        },
        purple: {
          dark: { fontColor: '#ede3ff', backgroundColor: '#24194a' },
          light: { fontColor: '#5d00ba', backgroundColor: '#F6EEF9' },
        },
        default: {
          dark: { fontColor: '#E6E6E6', backgroundColor: '#333333' },
          light: { fontColor: '#222222', backgroundColor: '#dedede' },
        },
      }
    : {
        // --- Normal Colors ---
        yellow: {
          dark: {
            fontColor: '#ffc533',
            backgroundColor: 'rgba(255, 197, 51, 0.15)',
          },
          light: {
            fontColor: '#996200',
            backgroundColor: 'rgba(255, 221, 112, 0.3)',
          },
        },
        red: {
          dark: {
            fontColor: '#ff6161',
            backgroundColor: 'rgba(255, 97, 97, 0.15)',
          },
          light: {
            fontColor: '#c01f2f',
            backgroundColor: 'rgba(255, 153, 153, 0.3)',
          },
        },
        blue: {
          dark: {
            fontColor: '#7eb8de',
            backgroundColor: 'rgba(87, 193, 255, 0.15)',
          },
          light: {
            fontColor: '#0055cc',
            backgroundColor: 'rgba(173, 216, 230, 0.3)',
          },
        },
        green: {
          dark: {
            fontColor: '#59d499',
            backgroundColor: 'rgba(89, 212, 153, 0.15)',
          },
          light: {
            fontColor: '#2c651c',
            backgroundColor: 'rgba(172, 224, 172, 0.3)',
          },
        },
        orange: {
          dark: {
            fontColor: '#ff9f0b',
            backgroundColor: 'rgba(255, 159, 11, 0.15)',
          },
          light: {
            fontColor: '#c24e00',
            backgroundColor: 'rgba(255, 200, 130, 0.3)',
          },
        },
        pink: {
          dark: {
            fontColor: '#ff86b5',
            backgroundColor: 'rgba(255, 134, 181, 0.15)',
          },
          light: {
            fontColor: '#bd255a',
            backgroundColor: 'rgba(255, 182, 193, 0.3)',
          },
        },
        turquoise: {
          dark: {
            fontColor: '#40e0d0',
            backgroundColor: 'rgba(64, 224, 208, 0.15)',
          },
          light: {
            fontColor: '#007575',
            backgroundColor: 'rgba(176, 224, 230, 0.3)',
          },
        },
        purple: {
          dark: {
            fontColor: '#b19cd9',
            backgroundColor: 'rgba(177, 156, 217, 0.15)',
          },
          light: {
            fontColor: '#6633cc',
            backgroundColor: 'rgba(216, 191, 216, 0.3)',
          },
        },
        default: {
          dark: {
            fontColor: '#cccccc',
            backgroundColor: 'rgba(60, 60, 60, 0.5)',
          },
          light: {
            fontColor: '#222222',
            backgroundColor: 'rgba(220, 220, 220, 0.5)',
          },
        },
      };
}

// --- Flag Color Definitions ---
if (!globalThis.FLAG_COLORS) {
  globalThis.FLAG_COLORS = {
    red: 1,
    orange: 2,
    green: 3,
    blue: 4,
    pink: 5,
    turquoise: 6,
    purple: 7,
  };
}

// --- Cache DOM elements ---
var mainElement = null;
var subjectElement = null;
var detailsText = null;
var detailsBlock = null;
var totalRemainingProgressElement = null;
var remainingCards = null;
var undoButton = null;
var flagButton = null;
var dropdownMenu = null;
var dropdownButtons = null;

// Cache Japanese DOM elements
var sentenceText = null;
var pitchAccent = null;
var pitchAccentGraph = null;
var audio = null;
var pitch = null;
