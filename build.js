// build.js
const fs = require('fs').promises;
const path = require('path');
const ejs = require('ejs');

// --- Configuration ---
const config = {
  localesDir: path.join(__dirname, 'locales'),
  templatesBaseDir: path.join(__dirname, 'templates'),
  iconsDir: path.join(__dirname, 'icons'),
  scriptsDir: path.join(__dirname, 'js'),
  outputBaseDir: path.join(__dirname, 'build'),
  languages: ['en', 'ja'], // Add languages here
  headScriptNames: ['config', 'anki_api', 'flag'],
  footerScriptNamesBase: [
    'remaining_cards',
    'smart_label',
    'syntax_highlight',
    'init_desktop',
  ],
};
// Derive back template scripts and all unique scripts
config.footerScriptNamesBack = ['details', ...config.footerScriptNamesBase];
config.allScriptNames = [
  ...new Set([
    ...config.headScriptNames,
    ...config.footerScriptNamesBase,
    ...config.footerScriptNamesBack,
  ]),
];

// --- Logging Helper ---
const log = console.log;
const warn = console.warn;
const error = console.error;

// --- Helper: Load SVGs ---
async function loadSvgs(dir) {
  const svgCache = {};
  const loadedNames = [];
  try {
    const files = await fs.readdir(dir);
    await Promise.all(
      files.map(async (file) => {
        if (file.endsWith('.svg')) {
          const svgPath = path.join(dir, file);
          try {
            const svgContent = await fs.readFile(svgPath, 'utf8');
            const iconName = path.basename(file, '.svg');
            svgCache[iconName] = svgContent;
            loadedNames.push(iconName);
          } catch (readErr) {
            warn(
              `  - Warning: Could not read SVG icon ${file}: ${readErr.message}`,
            );
          }
        }
      }),
    );
    if (loadedNames.length > 0) {
      log(`Found ${loadedNames.length} SVG icon(s): ${loadedNames.join(', ')}`);
    } else {
      try {
        await fs.access(dir);
        log('No SVG files found in icons directory.');
      } catch {}
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      log('No icons directory found, skipping SVG loading.');
    } else {
      error(`Error reading icons directory ${dir}:`, err);
    }
  }
  return svgCache;
}

// --- Helper: Load Scripts Content ---
async function loadScripts(dir, scriptNames) {
  const scriptCache = {};
  const uniqueNames = [...new Set(scriptNames)];
  const loadedStatus = {};
  log(
    `Attempting to load ${uniqueNames.length} unique script(s): ${uniqueNames.join(', ')}`,
  );
  await Promise.all(
    uniqueNames.map(async (name) => {
      const scriptPath = path.join(dir, `${name}.js`);
      try {
        const scriptContent = await fs.readFile(scriptPath, 'utf8');
        if (!scriptContent || scriptContent.trim() === '') {
          warn(`  - Warning: Script file ${name}.js appears to be empty.`);
          scriptCache[name] = '';
          loadedStatus[name] = null;
        } else {
          scriptCache[name] = scriptContent;
          loadedStatus[name] = true;
        }
      } catch (readErr) {
        if (readErr.code === 'ENOENT') {
          warn(`  - Warning: Script file not found: ${name}.js`);
        } else {
          error(
            `  - Error: Could not read script ${name}.js: ${readErr.message}`,
          );
        }
        scriptCache[name] =
          `/* ERROR: Script ${name}.js not found or unreadable */`;
        loadedStatus[name] = false;
      }
    }),
  );
  const loadedCount = Object.values(loadedStatus).filter(
    (s) => s === true,
  ).length;
  const emptyCount = Object.values(loadedStatus).filter(
    (s) => s === null,
  ).length;
  const failedCount = Object.values(loadedStatus).filter(
    (s) => s === false,
  ).length;
  log(
    `Script loading summary: ${loadedCount} loaded, ${emptyCount} empty, ${failedCount} failed.`,
  );
  return scriptCache;
}

// --- Helper: Load All Translations ---
async function loadAllTranslations(dir, languages) {
  const translationsCache = {};
  const loadedLangs = [];
  log('Loading translations...');
  let dirExists = true;
  try {
    await fs.access(dir);
  } catch (err) {
    if (err.code === 'ENOENT') {
      warn(
        `Warning: Locales directory not found at ${dir}. No translations will be loaded.`,
      );
      dirExists = false;
    } else {
      error(`Error accessing locales directory ${dir}: ${err.message}`);
    }
  }
  const loadPromises = languages.map(async (lang) => {
    translationsCache[lang] = {};
    if (!dirExists) return;
    const filePath = path.join(dir, `${lang}.json`);
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);
      if (Object.keys(jsonData).length > 0) {
        translationsCache[lang] = jsonData;
        loadedLangs.push(lang);
      } else {
        warn(
          `  - Warning: Translation file for "${lang}" at ${filePath} is empty.`,
        );
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        warn(
          `  - Warning: Translation file not found for "${lang}" at ${filePath}.`,
        );
      } else if (err instanceof SyntaxError) {
        error(
          `  - Error: Failed to parse JSON for "${lang}" at ${filePath}. Error: ${err.message}`,
        );
      } else {
        error(
          `  - Error: Could not read translation file for "${lang}" at ${filePath}. Error: ${err.message}`,
        );
      }
    }
  });
  await Promise.all(loadPromises);
  if (loadedLangs.length > 0) {
    log(`Loaded translations for language(s): ${loadedLangs.join(', ')}`);
  } else if (dirExists) {
    log(
      `No valid translation files found for requested languages: ${languages.join(', ')}`,
    );
  }
  return translationsCache;
}

// --- Helper: Find EJS files recursively ---
async function findEjsFiles(dir, baseDir) {
  let ejsFiles = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          const subFiles = await findEjsFiles(fullPath, baseDir);
          ejsFiles = ejsFiles.concat(subFiles);
        } else if (entry.isFile() && entry.name.endsWith('.ejs')) {
          ejsFiles.push(path.relative(baseDir, fullPath));
        }
      }),
    );
  } catch (err) {
    if (err.code !== 'ENOENT') {
      // Warning logged elsewhere if dir doesn't exist
      error(`Error reading templates directory ${dir}:`, err);
    }
    return [];
  }
  return ejsFiles;
}

// --- Build a Single Template Function ---
async function buildTemplateForLang(lang, relativeTemplatePath, data) {
  const { templatesBaseDir, outputBaseDir } = config;
  const templatePath = path.join(templatesBaseDir, relativeTemplatePath);
  try {
    // --- Improved i18n function ---
    const i18n = (key) => {
      try {
        // Split the key by dots (e.g., "ui.undoButtonLabel" -> ["ui", "undoButtonLabel"])
        const keys = key.split('.');
        // Start with the full translations object for the current language
        let result = data.translations;
        // Traverse the object using the keys
        for (const k of keys) {
          // Move deeper into the object
          result = result[k];
          // If at any point we find undefined, the key path doesn't exist
          if (result === undefined) {
            break;
          }
        }

        // If after traversing, the result is still undefined, the key is missing
        if (typeof result === 'undefined') {
          warn(
            `  - Missing translation key "${key}" for lang "${lang}" in "${relativeTemplatePath}"`,
          );
          return `[${key}]`;
        }
        // Return the found translated string
        return String(result); // Ensure it's a string
      } catch (e) {
        // Catch potential errors during traversal (e.g., trying to access property of non-object)
        warn(
          `  - Error accessing translation key "${key}" for lang "${lang}" in "${relativeTemplatePath}". Error: ${e.message}`,
        );
        return `[${key}]`;
      }
    };
    // --- End of improved i18n function ---

    const templateContent = await fs.readFile(templatePath, 'utf8');
    const isBackTemplate = path
      .basename(relativeTemplatePath)
      .toLowerCase()
      .includes('back');
    const footerScriptsToUse = isBackTemplate
      ? config.footerScriptNamesBack
      : config.footerScriptNamesBase;
    const ejsData = {
      i18n,
      svgs: data.svgs,
      scripts: data.scripts,
      headScriptNames: config.headScriptNames,
      footerScriptNames: footerScriptsToUse,
    };
    const renderedHtml = ejs.render(templateContent, ejsData, {
      filename: templatePath,
    });
    const outputRelativePath = relativeTemplatePath.replace(/\.ejs$/i, '.html');
    const outputPath = path.join(outputBaseDir, lang, outputRelativePath);
    const outputDirPath = path.dirname(outputPath);
    await fs.mkdir(outputDirPath, { recursive: true });
    await fs.writeFile(outputPath, renderedHtml);
    process.stdout.write(`Done.\n`); // Writes status WITH newline now handled correctly by sequential loop
  } catch (err) {
    process.stdout.write(`Failed.\n`); // Writes status WITH newline
    error(`\n--- Error building template ---`);
    error(`  File:     ${relativeTemplatePath}`);
    error(`  Language: ${lang}`);
    if (err.lineNumber) {
      error(`  Line:     ${err.lineNumber}`);
    }
    error(`  Message:  ${err.message}`);
    error(`-----------------------------\n`);
  }
}

// --- Main Build Function ---
async function runBuild() {
  log(`Starting Anki Template Build...`);
  log(`Output directory: ${config.outputBaseDir}`);
  try {
    await fs.rm(config.outputBaseDir, { recursive: true, force: true });
    log('Cleaned build/ directory.');
    await fs.mkdir(config.outputBaseDir, { recursive: true });

    log('\nFinding templates...');
    const templateFiles = await findEjsFiles(
      config.templatesBaseDir,
      config.templatesBaseDir,
    );
    if (!templateFiles || templateFiles.length === 0) {
      warn('Warning: No .ejs templates found. Skipping template processing.');
    } else {
      log(`Found ${templateFiles.length} template file(s):`);
      templateFiles.forEach((f) => log(`  - ${f}`));

      log('\nLoading required assets...');
      const [scriptsContentCache, loadedSvgs, translationsCache] =
        await Promise.all([
          loadScripts(config.scriptsDir, config.allScriptNames),
          loadSvgs(config.iconsDir),
          loadAllTranslations(config.localesDir, config.languages),
        ]);

      log('\nBuilding templates...');
      for (const lang of config.languages) {
        log(`\nBuilding for language: ${lang}...`);
        const currentLangTranslations = translationsCache[lang] || {};
        const langBuildData = {
          translations: currentLangTranslations,
          svgs: loadedSvgs,
          scripts: scriptsContentCache,
        };

        // --- Use sequential loop instead of Promise.all ---
        for (const relativeTemplatePath of templateFiles) {
          process.stdout.write(`  - Building ${relativeTemplatePath}... `); // Write start message (NO newline)
          await buildTemplateForLang(lang, relativeTemplatePath, langBuildData);
        }
      }
    }

    log(`\n-----------------------------------------------------`);
    log(`Build finished. Check ${config.outputBaseDir}/ for results.`);
    log(`Review any warnings/errors above.`);
    log(`-----------------------------------------------------`);
  } catch (err) {
    error('\n--- FATAL BUILD ERROR ---');
    error(err);
    error('-------------------------');
    process.exitCode = 1;
  }
}

// --- Execute the Build ---
runBuild();