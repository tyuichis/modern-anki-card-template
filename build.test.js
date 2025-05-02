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
  // Add mock data for future languages here
  // fr: { ... }
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

  // --- Tests that ARE EXPECTED to warn (Wrap them to suppress console output) ---
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


// --- Snapshot Tests for EJS Rendering (Refactored for Scalability) ---
describe('EJS Template Rendering', () => {
  // Define a minimal template string for testing specific features
  const templateString = `
    <span id="undo" data-i18n-key="ui.undoButtonLabel"><%= i18n('ui.undoButtonLabel') %></span>
    <span id="question-label" data-field-name="Question"><%= "{{" %>^<%= i18n('ankiFields.Question') %><%="}}" + "{{"%>/<%= i18n('ankiFields.Question') %><%="}}" + "{{" + i18n('ankiFields.Question') + "}}" _%></span>
    <div class="missing-key"><%= i18n('ui.missing') %></div>
  `; // Includes a missing key 'ui.missing' which will trigger a warning internally

  // Mock other static data needed by EJS
  const mockSvgs = { undo: '<svg>undo</svg>' };
  const mockScripts = {}; // Assuming scripts aren't vital for this test
  const mockHeadScriptNames = ['config'];
  const mockFooterScriptNames = ['init_desktop'];

  // Use beforeEach/afterEach to suppress expected warnings for ALL snapshot tests
  let consoleWarnSpy;
  beforeEach(() => {
    // Suppress console.warn before each test in this describe block
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    // Restore console.warn after each test
    consoleWarnSpy.mockRestore();
  });

  // Define the data for each language case
  const languageCases = [
    { lang: 'en', translations: mockTranslations.en, description: 'English' },
    { lang: 'ja', translations: mockTranslations.ja, description: 'Japanese' },
    // Add new languages here by adding their mock data above and an object here:
    // { lang: 'fr', translations: mockTranslations.fr, description: 'French' },
  ];

  // Use it.each to run the same test logic for each language case
  it.each(languageCases)('should render template correctly for $description ($lang)', ({ lang, translations }) => {
    // The i18n function is created specifically for this test case's language
    const i18n = (key) => getTranslation(key, translations, lang, 'snapshot-test.ejs');

    // Assemble the EJS data for this specific language case
    const ejsData = {
      i18n,
      svgs: mockSvgs,
      scripts: mockScripts,
      headScriptNames: mockHeadScriptNames,
      footerScriptNames: mockFooterScriptNames,
    };

    // Render and assert against snapshot
    const renderedHtml = ejs.render(templateString, ejsData);
    // Jest automatically manages separate snapshots based on the test name/parameters
    expect(renderedHtml).toMatchSnapshot();
  });
});