# 🏛️ Daily Stoic Quotes

A Chrome extension that delivers daily wisdom from the great Stoic philosophers: Marcus Aurelius, Epictetus, and Seneca.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- **Daily Quote Rotation** - A new stoic quote every day, automatically rotating at midnight in your local timezone
- **Persistent Quotes** - The same quote stays with you throughout the day
- **Save Favorites** - Mark quotes you love with a heart icon
- **Favorites Library** - View and manage all your saved quotes
- **Clean UI** - Minimal, calm design that embodies stoic philosophy
- **Offline First** - All quotes stored locally, no internet required
- **Privacy Focused** - No tracking, no analytics, no data collection

## 📸 Screenshots

### Daily Quote View
The extension displays one carefully selected quote per day from stoic masters.

### Favorites View
Collect and revisit the wisdom that resonates with you most.

## 🚀 Installation

### From Chrome Web Store (Coming Soon)
*Extension will be submitted to Chrome Web Store*

### Load Unpacked (Developer Mode)

1. **Generate Icons First**
   ```bash
   # Open icon-generator.html in your browser
   # Download the three icon files (icon16.png, icon48.png, icon128.png)
   # Or see ICON_INSTRUCTIONS.md for other methods
   ```

2. **Clone or Download** this repository
   ```bash
   git clone https://github.com/yourusername/daily-stoic-quotes.git
   cd daily-stoic-quotes
   ```

3. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

4. **Load Extension**
   - Click "Load unpacked"
   - Select the extension directory
   - The extension icon should appear in your toolbar

5. **Pin to Toolbar** (Optional)
   - Click the puzzle icon in Chrome toolbar
   - Find "Daily Stoic Quotes"
   - Click the pin icon

## 📖 Usage

### Viewing Daily Quote
1. Click the extension icon in your Chrome toolbar
2. Your daily quote will be displayed
3. The quote rotates automatically at midnight (local time)

### Saving Favorites
1. Click the heart icon below any quote you love
2. The heart will turn solid red when saved
3. Click again to remove from favorites

### Viewing Favorites
1. Click the "Favorites" tab at the top
2. Browse all your saved quotes
3. Hover over any quote and click the heart to remove it

## 🛠️ Technical Details

### Architecture
- **Manifest Version**: 3 (latest Chrome Extension standard)
- **Storage**: Chrome Storage Sync API (syncs across devices)
- **Permissions**: Storage only (minimal permissions)

### File Structure
```
daily-stoic-quotes/
├── manifest.json           # Extension configuration
├── popup.html             # Extension popup UI
├── popup.css              # Styling
├── popup.js               # Quote rotation & favorites logic
├── quotes.js              # 30 stoic quotes
├── background.js          # Service worker
├── icon.svg               # Icon source file
├── icon-generator.html    # Tool to generate PNG icons
├── ICON_INSTRUCTIONS.md   # Icon generation guide
└── README.md              # This file
```

### Storage Schema
```javascript
{
  "currentQuote": {
    "text": "Quote text",
    "author": "Author name",
    "id": "unique-id"
  },
  "lastRotation": 1234567890, // Timestamp
  "favorites": [
    {
      "text": "Quote text",
      "author": "Author name",
      "savedAt": 1234567890
    }
  ]
}
```

### Quote Rotation Logic
- Quotes rotate at midnight (00:00:00) in user's local timezone
- Uses `Date.setHours(0, 0, 0, 0)` to calculate start of day
- Stores rotation timestamp to detect new day
- Random selection ensures variety

## 🎨 Customization

### Adding More Quotes
Edit `quotes.js` and add to the `STOIC_QUOTES` array:

```javascript
{
  text: "Your quote here",
  author: "Philosopher Name"
}
```

### Changing Colors
Edit `popup.css` to customize the color scheme. Key colors:
- Primary: `#3498db` (blue)
- Text: `#2c3e50` (dark blue-gray)
- Accent: `#e74c3c` (red for favorites)
- Background: `#f5f7fa` (light gray)

## 🧪 Development

### Prerequisites
- Google Chrome or Chromium-based browser
- Basic knowledge of HTML/CSS/JavaScript
- Text editor or IDE

### Testing
1. Make your changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

### Debugging
- Right-click the extension popup → "Inspect"
- Check Console for errors
- Use `chrome.storage.sync.get()` in console to inspect storage

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- [ ] Add more stoic quotes
- [ ] Implement quote sharing (Twitter, clipboard)
- [ ] Add keyboard shortcuts
- [ ] Dark mode toggle
- [ ] Export/import favorites
- [ ] Quote search functionality
- [ ] Daily notifications option
- [ ] Multiple quote collections (different philosophies)

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 Quotes Attribution

All quotes are from public domain works:
- **Marcus Aurelius** - *Meditations* (c. 170-180 AD)
- **Epictetus** - *Discourses* and *Enchiridion* (c. 108 AD)
- **Seneca** - *Letters from a Stoic* and other works (c. 65 AD)

## 🙏 Acknowledgments

- Inspired by the timeless wisdom of Stoic philosophy
- Built with modern web standards and Chrome Extension Manifest V3
- Designed with simplicity and focus in mind

## 📝 License

MIT License - Feel free to use, modify, and distribute.

## 🐛 Bug Reports

Found a bug? Please open an issue on GitHub with:
- Chrome version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 💬 Support

- Open an issue for bugs or feature requests
- Star the repo if you find it useful
- Share with others who might benefit from daily stoic wisdom

---

**"The happiness of your life depends upon the quality of your thoughts."** - Marcus Aurelius
