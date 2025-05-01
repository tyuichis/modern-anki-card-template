// --- Smart Color Label Logic ---

// Function to update CSS root variables based on subject category
function updateLabelColors(subjectCategory) {
  let theme = document.body.classList.contains('nightMode') ? 'dark' : 'light';
  let colorDetails = labelColors[subjectCategory]?.[theme];

  if (colorDetails) {
    document.documentElement.style.setProperty(
      '--label-font-color',
      colorDetails.fontColor,
    );
    document.documentElement.style.setProperty(
      '--label-background-color',
      colorDetails.backgroundColor,
    );
  } else {
    // Set defaults
    document.documentElement.style.setProperty(
      '--label-font-color',
      theme === 'dark' ? '#8E8E93' : '#555',
    );
    document.documentElement.style.setProperty(
      '--label-background-color',
      theme === 'dark' ? 'rgba(44, 44, 46, 0.9)' : 'rgba(200, 200, 200, 0.2)',
    );
    console.error(
      `Color details not found for the subject category: ${subjectCategory}`,
    );
  }
}

mainElement = document.querySelector('#main');

// Apply smart color labeling.

if (mainElement.classList.contains('accent-smart')) {
  console.log(
    'Smart color labels is on. Loading subjects from {subjects}.json.',
  );

  // keep track of failed loads for debugging
  if (!globalThis.loadedSubjects) {
    globalThis.loadedSubjects = {};
  }

  var subjectJSON;

  if (!subjectJSON) {
    subjectJSON = [
      'computer-science',
      'languages',
      'chemistry',
      'biology',
      'math',
      'medicine',
      'physics',
      'custom',
    ];
  }

  function getSubjectFromDOM() {
    subjectElement = document.getElementById('subject');
    return subjectElement
      ? subjectElement.textContent.trim().toLowerCase()
      : null;
  }

  function applySubjectStyling() {
    subjectCategory = getSubjectFromDOM();
    if (!subjectCategory) return;

    matchedCategoryColor = globalThis.subjects[subjectCategory] || 'default';
    updateLabelColors(matchedCategoryColor);
    flagId = getFlagId(matchedCategoryColor);
  }

  async function loadAllSubjectJSON() {
    if (globalThis.subjects) return;
    globalThis.subjects = {};
    await Promise.all(
      subjectJSON.map(async (subjectName) => {
        try {
          const response = await fetch(`/_color-preset-${subjectName}.json`);
          if (!response.ok) {
            globalThis.loadedSubjects[subjectName] = false;
            return;
          }

          const data = await response.json();
          Object.assign(globalThis.subjects, data);
          globalThis.loadedSubjects[subjectName] = true;
        } catch (error) {
          console.error(
            `Error loading /_color-preset-${subjectName}.json:`,
            error,
          );
          globalThis.loadedSubjects[subjectName] = false;
        }
      }),
    );
  }

  (async () => {
    if (!globalThis.subjects) {
      await loadAllSubjectJSON();
    }
    applySubjectStyling();
  })();
}
