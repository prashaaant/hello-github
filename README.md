# Content Tracker Chrome Extension

A powerful Chrome extension that automatically tracks and categorizes the types of content you browse, providing insights into your web usage patterns.

## Features

### 🔍 **Automatic Content Classification**
- Categorizes websites into 10+ categories: News, Social Media, Entertainment, Shopping, Education, Work/Professional, Technology, Finance, Health, Travel, and Other
- Uses intelligent keyword matching based on URLs and page titles
- Real-time classification as you browse

### 📊 **Comprehensive Analytics**
- **Daily Stats**: View today's browsing patterns
- **Weekly Overview**: See your browsing trends over the past 7 days
- **Visual Charts**: Interactive bar charts showing time spent per category
- **Time Tracking**: Precise measurement of time spent on each site and category

### 🎯 **Detailed Insights**
- Count of sites visited per category
- Total time spent in each content category
- Recent sites list for each category
- Scroll behavior tracking
- Page engagement metrics

### 💾 **Data Management**
- **Export Data**: Download your browsing data as JSON
- **Clear Data**: Reset all tracking data when needed
- **Local Storage**: All data stored locally on your device for privacy

### 🎨 **Beautiful Interface**
- Modern, gradient-based UI design
- Responsive popup interface
- Tabbed navigation (Today/Week/Chart views)
- Real-time data visualization

## Installation

### Option 1: Load as Unpacked Extension (Recommended for Development)

1. **Download the extension files** to a folder on your computer

2. **Open Chrome** and navigate to `chrome://extensions/`

3. **Enable Developer Mode** by toggling the switch in the top-right corner

4. **Click "Load unpacked"** and select the folder containing the extension files

5. **Pin the extension** to your toolbar for easy access

### Option 2: Manual Installation

1. **Clone or download** this repository
2. **Follow steps 2-5** from Option 1 above

## Usage

### Getting Started

1. **Install the extension** following the instructions above
2. **Start browsing** - the extension automatically begins tracking
3. **Click the extension icon** in your toolbar to view statistics

### Understanding Your Data

- **Today Tab**: Shows your current day's browsing breakdown
- **Week Tab**: Aggregates the last 7 days of browsing data
- **Chart Tab**: Visual representation of your browsing patterns

### Managing Your Data

- **Export**: Click the "📤 Export" button to download your data
- **Clear**: Click the "🗑️ Clear" button to reset all tracking data
- **Settings**: Future customization options (coming soon)

## Content Categories

The extension automatically classifies websites into these categories:

| Category | Examples |
|----------|----------|
| **News** | CNN, BBC, Reuters, NY Times, Guardian |
| **Social Media** | Facebook, Twitter, Instagram, LinkedIn, Reddit |
| **Entertainment** | YouTube, Netflix, Spotify, Twitch |
| **Shopping** | Amazon, eBay, online stores |
| **Education** | Wikipedia, Coursera, Khan Academy |
| **Work/Professional** | Slack, Zoom, Office tools |
| **Technology** | GitHub, Stack Overflow, tech blogs |
| **Finance** | Banking, investment, crypto sites |
| **Health** | Medical, fitness, nutrition sites |
| **Travel** | Booking sites, travel planning |
| **Other** | Everything else |

## Privacy & Security

- ✅ **All data stored locally** on your device
- ✅ **No data sent to external servers**
- ✅ **No personal information collected**
- ✅ **Open source code** for transparency
- ✅ **Minimal permissions** required

## Technical Details

### Files Structure
```
content-tracker/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for tracking
├── content.js            # Page analysis script
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

### Permissions Required
- `activeTab` - Access to current active tab
- `storage` - Local data storage
- `tabs` - Tab management and tracking
- `history` - Browsing history access
- `<all_urls>` - Content script injection

### Browser Compatibility
- ✅ Chrome (Manifest V3)
- ✅ Microsoft Edge (Chromium-based)
- ❌ Firefox (different manifest format)
- ❌ Safari (different extension system)

## Development

### Adding New Categories
Edit the `contentCategories` object in `background.js`:

```javascript
const contentCategories = {
  'Your Category': ['keyword1', 'keyword2', 'keyword3'],
  // ... existing categories
};
```

### Customizing Time Tracking
Modify the time tracking logic in `background.js` and `content.js` to adjust:
- Time calculation methods
- Idle time detection
- Visibility tracking

## Troubleshooting

### Extension Not Tracking
1. Check if Developer Mode is enabled
2. Reload the extension in `chrome://extensions/`
3. Ensure the extension has necessary permissions

### Data Not Showing
1. Browse a few websites first
2. Wait a moment for data to process
3. Refresh the popup by closing and reopening

### Performance Issues
1. Clear old data using the "Clear" button
2. Restart Chrome if needed
3. Check for browser updates

## Contributing

Feel free to contribute improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Future Enhancements

- 🔧 **Custom Categories**: User-defined content categories
- 📱 **Mobile Support**: Cross-device tracking
- 📈 **Advanced Analytics**: Weekly/monthly trends
- 🎯 **Goals & Limits**: Set browsing time goals
- 🔔 **Notifications**: Usage alerts and reminders
- 📊 **Data Visualization**: More chart types and insights

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Create an issue with detailed information about the problem

---

**Happy browsing with insights!** 📊✨
