// build.test.js
const ejs = require('ejs');
const { getTranslation } = require('./build'); // Import the function to test

// Mock data mimicking your locale structure
const mockTranslations = {
  en: {
    ui: {
      undoButtonLabel: "Undo",
      flagButtonLabel: "Flag",
      nonExistentKey: undefined, // Explicitly undefined
      emptyValueKey: "",         // Explicitly empty
    },
    ankiFields: {
      Question: "Question",
      Answer: "Answer",
      "Source (optional)": "Source (optional)", // Key with special chars
    }
  },
  ja: {
    ui: {
      undoButtonLabel: "戻す",
      flagButtonLabel: "フラグ",
    },
    ankiFields: {
      Question: "質問",
      Answer: "答え",
      "Source (optional)": "出典 (任意)",
    }
  },
  // Add more languages or edge cases if needed
};

// --- Unit Tests for getTranslation ---
describe('getTranslation function', () => {
  const lang = 'en';
  const templatePath = 'dummy/path.ejs'; // Context for warnings

  // --- Tests that SHOULD NOT warn ---
  it('should return the correct translation for a valid nested UI key', () => {
    const result = getTranslation('ui.undoButtonLabel', mockTranslations[lang], lang, templatePath);
    expect(result).toBe('Undo');
  });

  it('should return the correct translation for a valid nested ankiFields key', () => {
    const result = getTranslation('ankiFields.Question', mockTranslations[lang], lang, templatePath);
    expect(result).toBe('Question');
  });

  it('should return the correct translation for a key with special characters', () => {
    const result = getTranslation('ankiFields.Source (optional)', mockTranslations[lang], lang, templatePath);
    expect(result).toBe('Source (optional)');
  });

  it('should return an empty string if the translation value is an empty string', () => {
    const result = getTranslation('ui.emptyValueKey', mockTranslations[lang], lang, templatePath);
    expect(result).toBe('');
  });

  it('should handle different languages correctly (Japanese example)', () => {
    const langJa = 'ja';
    const result = getTranslation('ankiFields.Question', mockTranslations[langJa], langJa, templatePath);
    expect(result).toBe('質問');
  });

  // --- Tests that ARE EXPECTED to warn (Wrap them) ---
  it('should return the key in brackets for a missing key', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress
    const result = getTranslation('ui.missingKey', mockTranslations[lang], lang, templatePath);
    expect(result).toBe('[ui.missingKey]');
    consoleWarnSpy.mockRestore(); // Restore
  });

   it('should return the key in brackets for an invalid path', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress
    const result = getTranslation('ui.undoButtonLabel.invalid', mockTranslations[lang], lang, templatePath);
    expect(result).toBe('[ui.undoButtonLabel.invalid]');
    consoleWarnSpy.mockRestore(); // Restore
  });

  it('should return the key in brackets if the translation value is explicitly undefined', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress
    const result = getTranslation('ui.nonExistentKey', mockTranslations[lang], lang, templatePath);
    expect(result).toBe('[ui.nonExistentKey]');
    consoleWarnSpy.mockRestore(); // Restore
  });

   it('should return key in brackets if language itself is missing', () => {
     const langMissing = 'fr';
     const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress
     // Pass an empty object or undefined if the language doesn't exist in mockTranslations
     const result = getTranslation('ui.undoButtonLabel', mockTranslations[langMissing] || {}, langMissing, templatePath);
     expect(result).toBe('[ui.undoButtonLabel]');
     consoleWarnSpy.mockRestore(); // Restore
   });
});


// --- Snapshot Tests for EJS Rendering (Example) ---
describe('EJS Template Rendering', () => {
  // Define a minimal template string for testing specific features
  const templateString = `
    <span id="undo" data-i18n-key="ui.undoButtonLabel"><%= i18n('ui.undoButtonLabel') %></span>
    <span id="question-label" data-field-name="Question"><%= "{{" %>^<%= i18n('ankiFields.Question') %><%="}}" + "{{"%>/<%= i18n('ankiFields.Question') %><%="}}" + "{{" + i18n('ankiFields.Question') + "}}" _%></span>
    <div class="missing-key"><%= i18n('ui.missing') %></div>
  `; // Includes a missing key 'ui.missing'

  // Mock other data needed by EJS
  const mockSvgs = { undo: '<svg>undo</svg>' };
  const mockScripts = {}; // Assuming scripts aren't vital for this test
  const mockHeadScriptNames = ['config'];
  const mockFooterScriptNames = ['init_desktop'];

  // Use beforeEach/afterEach to suppress warnings for ALL tests in this block
  let consoleWarnSpy;
  beforeEach(() => {
    // Suppress console.warn before each test in this describe block
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    // Restore console.warn after each test
    consoleWarnSpy.mockRestore();
  });

  it('should render EN template correctly', () => {
    const lang = 'en';
    // Note: i18n function now uses the mocked console.warn via the closure
    const i18n = (key) => getTranslation(key, mockTranslations[lang], lang, 'snapshot-test.ejs');
    const ejsData = {
      i18n,
      svgs: mockSvgs,
      scripts: mockScripts,
      headScriptNames: mockHeadScriptNames,
      footerScriptNames: mockFooterScriptNames,
    };
    const renderedHtml = ejs.render(templateString, ejsData);
    expect(renderedHtml).toMatchSnapshot(); // Expects '[ui.missing]' in the output
  });

  it('should render JA template correctly', () => {
    const lang = 'ja';
    const i18n = (key) => getTranslation(key, mockTranslations[lang], lang, 'snapshot-test.ejs');
     const ejsData = {
      i18n,
      svgs: mockSvgs,
      scripts: mockScripts,
      headScriptNames: mockHeadScriptNames,
      footerScriptNames: mockFooterScriptNames,
    };
    const renderedHtml = ejs.render(templateString, ejsData);
    expect(renderedHtml).toMatchSnapshot(); // Expects '[ui.missing]' in the output
  });

});