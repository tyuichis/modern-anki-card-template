// --- Flag Logic ---

if (!globalThis.FLAG_COLORS) {
  globalThis.FLAG_COLORS = {
    // colorName: flagId
    red: 1,
    orange: 2,
    green: 3,
    blue: 4,
    pink: 5,
    turquoise: 6,
    purple: 7,
  };
}

function getFlagId(subjectColor) {
  try {
    const flagId = FLAG_COLORS?.[subjectColor] ?? 0; // i.e. FLAG_COLORS["red"] => 1
    return flagId;
  } catch (error) {
    console.error('Error retrieving flag ID:', error); // More specific message
    return 0; // Return default value on error.  0 makes more sense than null here.
  }
}

// Function to update CSS classes on the flag button
function setFlagDisplay(flagId) {
  flagButton = document.getElementById('flag-button'); // caching

  if (!flagButton) {
    console.warn('Flag button element not found.');
    return;
  }

  const flagColor =
    Object.entries(FLAG_COLORS).find(([color, id]) => id === flagId)?.[0] ||
    null;

  // Reset: Remove all flag color classes
  for (const color of [
    'red',
    'orange',
    'green',
    'blue',
    'pink',
    'turquoise',
    'purple',
  ]) {
    flagButton.classList.remove(`flag-${color}`);
  }

  // Add the appropriate flag color class
  if (flagColor) {
    // Check that flagColor isn't null
    flagButton.classList.add(`flag-${flagColor}`);
  }

  // Toggle the "flagged" class based on whether it's flagged or not
  if (flagId === 0) {
    flagButton.classList.remove('flagged');
  } else {
    flagButton.classList.add('flagged');
  }
}

async function setFlag(value) {
  try {
    return await new Promise((resolve) => pycmd(`set_flag_${value}`, resolve));
  } catch (error) {
    console.error('Some error occurred while setting a flag:', error);
  }
}

// Update the flag color on page load, depending on its status.
async function updateFlag() {
  try {
    const flagNumber = await new Promise((resolve) =>
      pycmd('get_flag_status', resolve),
    );

    // Validate the flagNumber
    if (typeof flagNumber === 'number' && flagNumber >= 0 && flagNumber <= 7) {
      setFlagDisplay(flagNumber);
    } else {
      console.error(`Invalid flag number received: ${flagNumber}`);
      setFlagDisplay(0); // Set to the default unflagged state
    }
  } catch (e) {
    console.error('Error getting flag status:', e);
    setFlagDisplay(0); // Default to unflagged on error
  }
}


async function getFlagLabels() {
  try {
    console.log("Fetching custom flag labels from the backend...");

    const labels = await new Promise((resolve) => 
      pycmd("get_all_flag_labels", resolve)
    );

    if (!labels || typeof labels !== 'object') {
      console.warn("No valid flag labels returned from backend. Using default labels.");
      globalThis.flagLabels = {};
      return;
    }
    
    globalThis.flagLabels = labels;

  } catch (error) {
    console.error("Failed to fetch flag dropdown labels:", error);
    globalThis.flagLabels = {};
  }
}

async function setFlagLabels() {
  // 1. Get labels from backend
  if (!globalThis.flagLabels) {
    await getFlagLabels();
  }

  // 2. Select flag elements in the DOM. Happens on every flip, since DOM references are stale. At least it's fast.
    for (let id = 1; id < 8; id++ ) {
      const element = document.querySelector(
        `.dropdown-button[value="${id}"] .dropdown-text`
      );

      // 3. Set flag labels to our custom label (set via Anki Deck Browser screen)

      // if globalThis.flagLabels[id] exists, then change it. Otherwise, it'll default to the template string
      if (element && globalThis.flagLabels[id]) {
        element.textContent = globalThis.flagLabels[id];
      }
  }
}