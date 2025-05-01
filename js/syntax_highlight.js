// --- Code Syntax Highlighting Logic ---
// requires highlight.js, code themes. See config.js

var syntaxHighlighting = false; // Default is off; set to syntaxHighlighting = true; to turn on. Be sure to import _highlight_min.js and the language pack.
var hljs; // cache hljs
var loadedLanguages = {}; // cache loaded languages

async function loadHighlightJS() {
  if (!syntaxHighlighting) {
    return false; // syntaxHighlighting is off. Don't load.
  }

  if (hljs) {
    // console.log('Highlight.js is already loaded.');
    return true; // hljs already loaded
  }

  try {
    // load highlight.js core
    const hljsModule = await import('/_highlight.min.js');
    hljs = hljsModule.default || hljsModule; // cache hljs

    // console.log('Highlight.js loaded:', hljs);

    // languages to load
    const languages = [
      'bash',
      'java',
      'perl',
      'scss',
      'c',
      'javascript',
      'php',
      'shell',
      'cpp',
      'json',
      'python',
      'csharp',
      'kotlin',
      'plaintext',
      'swift',
      'css',
      'less',
      'typescript',
      'diff',
      'lua',
      'vbnet',
      'go',
      'makefile',
      'r',
      'wasm',
      'graphql',
      'markdown',
      'ruby',
      'xml',
      'ini',
      'objectivec',
      'rust',
      'yaml',
    ];

    // load and register languages
    const loadPromises = languages.map(async (lang) => {
      if (loadedLanguages[lang]) {
        // console.log(`Language ${lang} is already loaded.`);
        return; // skip if already loaded
      }

      try {
        const module = await import(`/_${lang}.min.js`);
        hljs.registerLanguage(lang, module.default || module); // register language
        loadedLanguages[lang] = true; // cache loaded language
        // console.log(`Language ${lang} loaded.`);
      } catch (error) {
        console.warn(`Failed to load language: ${lang}`, error);
      }
    });

    // wait for all languages to load
    await Promise.allSettled(loadPromises);

    // console.log('All languages attempted to load:', languages);

    return true; // all loaded successfully
  } catch (error) {
    console.error('Failed to load Highlight.js:', error);
    return false; // error loading
  }
}

async function applyHighlighting() {
  if (!syntaxHighlighting) {
    return; // syntaxHighlighting is off. Don't run.
  }

  const isLoaded = await loadHighlightJS(); // wait for hljs to load

  if (!isLoaded) {
    console.error('Highlight.js was not loaded successfully.');
    return; // stop if hljs failed to load
  }

  // highlight code blocks
  document.querySelectorAll('pre code').forEach((block) => {
    // console.log('Highlighting block:', block);
    hljs.highlightElement(block); // highlight block
  });

  // NOTE:
  // Inline code highlighting is disabled for better readability.
  // highlight.js cannot detect the correct language for inline code
  // without backend support, which adds unnecessary overhead.
  // This approach aligns with best practices seen in Ghostty docs, MDN, etc.

  // document.querySelectorAll('code:not(pre code)').forEach((block) => {
  //   hljs.highlightElement(block); // Previously highlighted inline code
  // });

  // console.log('Highlighting applied successfully.');
}

// apply highlighting
applyHighlighting();
