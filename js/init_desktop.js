// --- Initialise desktop only features. ---

if (!isMobile) {
  // Fetch and update card counts from API
  fetchCardCount().then((cardCounts) => {
    if (!totalRemainingProgressElement) {
      totalRemainingProgressElement =
        document.getElementById('deck-progress-bar');
    }

    // get the remaining cards from our backend, via JS api.
    // fetchCardCount returns a cardCounts object that includes int: new/learn/review
    totalRemaining = cardCounts.new + cardCounts.learn + cardCounts.review;

    // set the total at the beginning of the session if it wasn't initialised yet.
    if (!globalThis.initialTotalRemaining) {
      globalThis.initialTotalRemaining = totalRemaining;
    }

    // DOM is refreshed after card load, set max again.
    totalRemainingProgressElement.max = globalThis.initialTotalRemaining;

    // update value
    totalRemainingProgressElement.value =
      globalThis.initialTotalRemaining - totalRemaining;

    // continue to update our remaining cards.
    updateRemainingCards(totalRemaining);
  });

  /* status buttons */

  undoButton = document.querySelector('#undo-button');

  undoButton.addEventListener('click', () => {
    // console.log('undo_card called');
    pycmd('undo_card');
  });

  updateFlag(); // update on page reload. updates the visual state of the flag.

  setFlagLabels(); // update on page reload. updates the flag label to the user's custom label set via Anki's Browser screen

  if (!flagButton) flagButton = document.getElementById('flag-button');

  dropdownMenu = document.getElementById('dropdown-menu');
  dropdownButtons = Array.from(
    dropdownMenu.querySelectorAll('.dropdown-button'),
  );

  // Click to Open/Close the Dropdown
  flagButton.addEventListener('click', function (event) {
    dropdownMenu.classList.toggle('show');
  });

  // Close the dropdown when clicking an inner button
  dropdownButtons.forEach(function (button) {
    button.addEventListener('click', async function (event) {
      event.preventDefault();

      await setFlag(button.value);

      updateFlag();
      dropdownMenu.classList.remove('show');
    });
  });

  // Close the dropdown on outside click
  document.addEventListener('click', function (event) {
    if (
      !flagButton.contains(event.target) &&
      !dropdownMenu.contains(event.target)
    ) {
      dropdownMenu.classList.remove('show');
    }
  });
}
