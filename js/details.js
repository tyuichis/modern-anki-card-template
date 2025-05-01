// --- Reveal Flashcard Details ---

function showDetails() {
  detailsText = document.querySelector('#details-text');
  detailsContainer = document.querySelector('#details');

  if (detailsText.textContent.trim()) {
    detailsContainer.classList.remove('hidden');
  }

  // Check if #sentence-text has text content
  sentenceText = document.querySelector('#sentence-text');
  if (sentenceText && sentenceText.textContent.trim() !== '') {
    document.querySelector('#sentence')?.classList.remove('hidden');
  }

  // Check if #pitch-accent has text content or children
  pitchAccent = document.querySelector('#pitch-accent');
  const hasPitchAccent =
    pitchAccent &&
    (pitchAccent.textContent.trim() !== '' || pitchAccent.children.length > 0);

  if (hasPitchAccent) {
    pitchAccent.classList.remove('hidden');
  }

  // Check if #pitch-accent-graph has text content or children
  pitchAccentGraph = document.querySelector('#pitch-accent-graph');
  const hasPitchAccentGraph =
    pitchAccentGraph &&
    (pitchAccentGraph.textContent.trim() !== '' ||
      pitchAccentGraph.children.length > 0);

  if (hasPitchAccentGraph) {
    pitchAccentGraph.classList.remove('hidden');
  }

  // Check if #audio has children (ignore text content)
  audio = document.querySelector('#audio');
  const hasAudio = audio && audio.children.length > 0;

  pitch = document.querySelector('#pitch');

  // add help text if only audio icon is present.
  if (!hasPitchAccent && !hasPitchAccentGraph && hasAudio) {
    const audioHelpText = document.createTextNode('アイコンタップで再生');
    pitch.appendChild(audioHelpText);
  }

  // Hide #pitch only if #pitch-accent, #pitch-accent-graph, AND #audio are all empty
  if (!hasPitchAccent && !hasPitchAccentGraph && !hasAudio) {
    pitch?.classList.add('hidden');
  }
}

showDetails();
