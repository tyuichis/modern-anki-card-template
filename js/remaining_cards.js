// --- Remaining Card Logic ---
// fetchCardCount, updateRemainingCards are called within the Desktop init only.

async function fetchCardCount() {
  var newCards = 0;
  var learningCards = 0;
  var reviewCards = 0;

  try {
    newCards = await ankiCall('ankiGetNewCardCount');
    learningCards = await ankiCall('ankiGetLrnCardCount');
    reviewCards = await ankiCall('ankiGetRevCardCount');

    // console.log(
    //   'API Results - New:',
    //   newCards,
    //   ' Learning:',
    //   learningCards,
    //   ' Review:',
    //   reviewCards,
    // );
  } catch (e) {
    console.error('Error fetching card counts:', e);
  }

  return { new: newCards, learn: learningCards, review: reviewCards };
}

function updateRemainingCards(remainingCardCount) {
  remainingCards = document.querySelector('#remainingCards');
  if (remainingCards) {
    remainingCards.textContent = remainingCardCount;
  } else {
    console.warn('Element #remainingCards not found in the DOM.');
  }
}
