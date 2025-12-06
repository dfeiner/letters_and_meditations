/**
 * Daily Stoic Quotes - Background Service Worker
 * Handles background tasks and extension lifecycle events
 */

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Daily Stoic Quotes extension installed');

    // Initialize storage with default values if needed
    chrome.storage.sync.get(['currentQuote', 'lastRotation', 'favorites'], (result) => {
      if (!result.favorites) {
        chrome.storage.sync.set({ favorites: [] });
      }
    });
  } else if (details.reason === 'update') {
    console.log('Daily Stoic Quotes extension updated');
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);

  // Handle different message types if needed in the future
  if (request.type === 'GET_QUOTE') {
    // Future: Could implement server-side quote fetching here
    sendResponse({ success: true });
  }

  return true; // Keep the message channel open for async responses
});

// Optional: Set up alarms for daily notifications (future feature)
// chrome.alarms.create('dailyQuoteReminder', {
//   when: Date.now() + 1000,
//   periodInMinutes: 1440 // 24 hours
// });

// chrome.alarms.onAlarm.addListener((alarm) => {
//   if (alarm.name === 'dailyQuoteReminder') {
//     // Future: Could show notifications here
//   }
// });

console.log('Daily Stoic Quotes background service worker loaded');
