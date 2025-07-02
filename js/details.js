// --- Reveal Flashcard Details ---

// Helper function to check if an element has meaningful content
function hasContent(element) {
  if (!element) return false;
  
  // Check for text content
  if (element.textContent.trim() !== '') return true;
  
  // Check for content elements like images, audio, video, etc.
  const contentSelectors = 'img, audio, video, canvas, svg, iframe, object, embed';
  return !!element.querySelector(contentSelectors);
}

function showDetails() {
  detailsText = document.querySelector('#details-text');
  detailsContainer = document.querySelector('#details');

  if (hasContent(detailsText)) {
    detailsContainer.classList.remove('hidden');
  }

  // Check if #sentence-text has content
  sentenceText = document.querySelector('#sentence-text');
  if (hasContent(sentenceText)) {
    document.querySelector('#sentence')?.classList.remove('hidden');
  }

  // Check if #pitch-accent has content
  pitchAccent = document.querySelector('#pitch-accent');
  const hasPitchAccent = hasContent(pitchAccent);

  if (hasPitchAccent) {
    pitchAccent.classList.remove('hidden');
  }

  // Check if #pitch-accent-graph has content
  pitchAccentGraph = document.querySelector('#pitch-accent-graph');
  const hasPitchAccentGraph = hasContent(pitchAccentGraph);

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