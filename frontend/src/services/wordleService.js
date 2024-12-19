const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/server/api`;

// get random word
export async function getRandomWord() {
  const response = await fetch(`${API_URL}/words.php?action=get_random`);
  return await response.json();
}

// validate word
export async function validateWord(
  currentWord,
  solution,
  currentKeyboardStatus,
  currentRow,
  maxAttempts
) {
  const url = new URL(`${API_URL}/words.php`);

  // Create a new URLSearchParams object
  const params = new URLSearchParams({
    action: 'validate',
    word: currentWord,
    solution: solution,
    currentRow: currentRow,
    maxAttempts: maxAttempts,
    keyboardStatus: JSON.stringify(currentKeyboardStatus),
    playerId: 1
  });

  // Append the search parameters to the URL
  url.search = params.toString();

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Internal server error');
    }

    return await response.json();
  } catch (error) {
    console.error('Error validating word:', error);
    return { error: error.message };
  }
}

export async function getStats() {
  const response = await fetch(`${API_URL}/words.php?action=get_stats&playerId=1`);
  return await response.json();
}