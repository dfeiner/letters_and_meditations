/**
 * Daily Stoic Quotes - Popup Logic
 * Handles quote rotation, favorites, and storage
 */

// Storage keys
const STORAGE_KEYS = {
  CURRENT_QUOTE: 'currentQuote',
  LAST_ROTATION: 'lastRotation',
  FAVORITES: 'favorites'
};

// State
let currentQuote = null;
let favorites = [];

/**
 * Initialize the popup
 */
async function init() {
  try {
    // Load data from storage
    await loadFromStorage();

    // Check if we need to rotate the quote
    await checkAndRotateQuote();

    // Display the current quote
    displayDailyQuote();

    // Load favorites
    displayFavorites();

    // Setup event listeners
    setupEventListeners();

  } catch (error) {
    console.error('Error initializing popup:', error);
    showError('Failed to load quotes. Please try again.');
  }
}

/**
 * Load data from Chrome storage
 */
async function loadFromStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([
      STORAGE_KEYS.CURRENT_QUOTE,
      STORAGE_KEYS.LAST_ROTATION,
      STORAGE_KEYS.FAVORITES
    ], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      currentQuote = result[STORAGE_KEYS.CURRENT_QUOTE] || null;
      favorites = result[STORAGE_KEYS.FAVORITES] || [];

      resolve();
    });
  });
}

/**
 * Save data to Chrome storage
 */
async function saveToStorage(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      resolve();
    });
  });
}

/**
 * Check if quote needs to be rotated and rotate if necessary
 */
async function checkAndRotateQuote() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([STORAGE_KEYS.LAST_ROTATION], async (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      const lastRotation = result[STORAGE_KEYS.LAST_ROTATION];
      const today = getStartOfDay();

      // Rotate if no quote exists or if it's a new day
      if (!currentQuote || !lastRotation || lastRotation < today) {
        await rotateQuote();
      }

      resolve();
    });
  });
}

/**
 * Get the start of the current day (midnight) in milliseconds
 */
function getStartOfDay() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

/**
 * Rotate to a new random quote
 */
async function rotateQuote() {
  try {
    // Get a random quote that's different from the current one
    let newQuote;
    const maxAttempts = 10;
    let attempts = 0;

    do {
      const randomIndex = Math.floor(Math.random() * STOIC_QUOTES.length);
      newQuote = {
        ...STOIC_QUOTES[randomIndex],
        id: `${randomIndex}-${Date.now()}` // Unique ID for favoriting
      };
      attempts++;
    } while (
      currentQuote &&
      newQuote.text === currentQuote.text &&
      attempts < maxAttempts
    );

    currentQuote = newQuote;

    // Save to storage
    const today = getStartOfDay();
    await saveToStorage(STORAGE_KEYS.CURRENT_QUOTE, currentQuote);
    await saveToStorage(STORAGE_KEYS.LAST_ROTATION, today);

  } catch (error) {
    console.error('Error rotating quote:', error);
    throw error;
  }
}

/**
 * Display the daily quote
 */
function displayDailyQuote() {
  if (!currentQuote) {
    showError('No quote available');
    return;
  }

  const quoteTextEl = document.getElementById('daily-quote-text');
  const quoteAuthorEl = document.getElementById('daily-quote-author');
  const favoriteBtnEl = document.getElementById('favorite-btn');

  if (quoteTextEl && quoteAuthorEl) {
    quoteTextEl.textContent = currentQuote.text;
    quoteAuthorEl.textContent = currentQuote.author;
  }

  // Update favorite button state
  if (favoriteBtnEl) {
    updateFavoriteButton();
  }

  // Update rotation info
  updateRotationInfo();
}

/**
 * Update the favorite button state
 */
function updateFavoriteButton() {
  const favoriteBtnEl = document.getElementById('favorite-btn');
  if (!favoriteBtnEl) return;

  const isFavorited = favorites.some(fav =>
    fav.text === currentQuote.text && fav.author === currentQuote.author
  );

  if (isFavorited) {
    favoriteBtnEl.classList.add('favorited');
    favoriteBtnEl.setAttribute('aria-label', 'Remove from favorites');
  } else {
    favoriteBtnEl.classList.remove('favorited');
    favoriteBtnEl.setAttribute('aria-label', 'Add to favorites');
  }
}

/**
 * Update rotation info text
 */
function updateRotationInfo() {
  const rotationInfoEl = document.getElementById('rotation-info');
  if (!rotationInfoEl) return;

  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  const hoursUntilMidnight = Math.floor((midnight - now) / (1000 * 60 * 60));
  const minutesUntilMidnight = Math.floor((midnight - now) / (1000 * 60)) % 60;

  if (hoursUntilMidnight > 0) {
    rotationInfoEl.textContent = `New quote in ${hoursUntilMidnight}h ${minutesUntilMidnight}m`;
  } else {
    rotationInfoEl.textContent = `New quote in ${minutesUntilMidnight}m`;
  }
}

/**
 * Toggle favorite status of current quote
 */
async function toggleFavorite() {
  try {
    const existingIndex = favorites.findIndex(fav =>
      fav.text === currentQuote.text && fav.author === currentQuote.author
    );

    if (existingIndex !== -1) {
      // Remove from favorites
      favorites.splice(existingIndex, 1);
    } else {
      // Add to favorites
      favorites.push({
        text: currentQuote.text,
        author: currentQuote.author,
        savedAt: Date.now()
      });
    }

    // Save to storage
    await saveToStorage(STORAGE_KEYS.FAVORITES, favorites);

    // Update UI
    updateFavoriteButton();
    displayFavorites();

  } catch (error) {
    console.error('Error toggling favorite:', error);
    showError('Failed to save favorite. Please try again.');
  }
}

/**
 * Display the list of favorite quotes
 */
function displayFavorites() {
  const favoritesListEl = document.getElementById('favorites-list');
  const favoritesCountEl = document.getElementById('favorites-count');

  if (!favoritesListEl || !favoritesCountEl) return;

  // Update count
  favoritesCountEl.textContent = favorites.length;

  // Clear list
  favoritesListEl.innerHTML = '';

  if (favorites.length === 0) {
    favoritesListEl.innerHTML = '<p class="empty-state">No favorites yet. Click the heart on your daily quote to save it!</p>';
    return;
  }

  // Sort by saved date (most recent first)
  const sortedFavorites = [...favorites].sort((a, b) => b.savedAt - a.savedAt);

  // Create favorite items
  sortedFavorites.forEach((favorite, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'favorite-item';
    itemEl.innerHTML = `
      <p class="favorite-quote-text">${escapeHtml(favorite.text)}</p>
      <p class="favorite-quote-author">${escapeHtml(favorite.author)}</p>
      <button class="unfavorite-btn" data-index="${index}" aria-label="Remove from favorites">♥</button>
    `;

    favoritesListEl.appendChild(itemEl);
  });

  // Add event listeners to unfavorite buttons
  const unfavoriteBtns = favoritesListEl.querySelectorAll('.unfavorite-btn');
  unfavoriteBtns.forEach(btn => {
    btn.addEventListener('click', handleUnfavorite);
  });
}

/**
 * Handle unfavorite button click
 */
async function handleUnfavorite(event) {
  try {
    const index = parseInt(event.target.getAttribute('data-index'));

    // Sort favorites the same way we did in displayFavorites
    const sortedFavorites = [...favorites].sort((a, b) => b.savedAt - a.savedAt);
    const favoriteToRemove = sortedFavorites[index];

    // Find and remove from the original array
    const originalIndex = favorites.findIndex(fav =>
      fav.text === favoriteToRemove.text &&
      fav.author === favoriteToRemove.author &&
      fav.savedAt === favoriteToRemove.savedAt
    );

    if (originalIndex !== -1) {
      favorites.splice(originalIndex, 1);
    }

    // Save to storage
    await saveToStorage(STORAGE_KEYS.FAVORITES, favorites);

    // Update UI
    displayFavorites();
    updateFavoriteButton();

  } catch (error) {
    console.error('Error removing favorite:', error);
    showError('Failed to remove favorite. Please try again.');
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', handleTabSwitch);
  });

  // Favorite button
  const favoriteBtnEl = document.getElementById('favorite-btn');
  if (favoriteBtnEl) {
    favoriteBtnEl.addEventListener('click', toggleFavorite);
  }
}

/**
 * Handle tab switching
 */
function handleTabSwitch(event) {
  const targetTab = event.target.getAttribute('data-tab');

  // Update tab buttons
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Update tab content
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => content.classList.remove('active'));

  const targetContent = document.getElementById(`${targetTab}-tab`);
  if (targetContent) {
    targetContent.classList.add('active');
  }
}

/**
 * Show error message
 */
function showError(message) {
  const quoteTextEl = document.getElementById('daily-quote-text');
  if (quoteTextEl) {
    quoteTextEl.textContent = message;
    quoteTextEl.style.fontStyle = 'normal';
    quoteTextEl.style.color = '#e74c3c';
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
