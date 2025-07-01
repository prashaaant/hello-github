// Content categories with keywords for classification
const contentCategories = {
  'News': ['news', 'reuters', 'cnn', 'bbc', 'nytimes', 'guardian', 'article', 'breaking'],
  'Social Media': ['facebook', 'twitter', 'instagram', 'linkedin', 'reddit', 'tiktok', 'snapchat'],
  'Entertainment': ['youtube', 'netflix', 'spotify', 'twitch', 'entertainment', 'movie', 'music', 'game'],
  'Shopping': ['amazon', 'ebay', 'shop', 'store', 'buy', 'cart', 'product', 'price'],
  'Education': ['wikipedia', 'coursera', 'udemy', 'khan', 'edu', 'learn', 'course', 'tutorial'],
  'Work/Professional': ['slack', 'zoom', 'teams', 'office', 'work', 'meeting', 'email', 'professional'],
  'Technology': ['github', 'stackoverflow', 'tech', 'programming', 'developer', 'code', 'software'],
  'Finance': ['bank', 'finance', 'investment', 'stock', 'crypto', 'trading', 'money'],
  'Health': ['health', 'medical', 'doctor', 'fitness', 'nutrition', 'exercise'],
  'Travel': ['booking', 'travel', 'hotel', 'flight', 'trip', 'vacation'],
  'Other': []
};

// Function to categorize content based on URL and title
function categorizeContent(url, title) {
  const combinedText = (url + ' ' + title).toLowerCase();
  
  for (const [category, keywords] of Object.entries(contentCategories)) {
    if (category === 'Other') continue;
    
    for (const keyword of keywords) {
      if (combinedText.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'Other';
}

// Function to save browsing data
async function saveBrowsingData(url, title, category, timeSpent = 0) {
  const today = new Date().toDateString();
  
  try {
    const result = await chrome.storage.local.get([today]);
    const todayData = result[today] || {};
    
    if (!todayData[category]) {
      todayData[category] = {
        count: 0,
        totalTime: 0,
        sites: []
      };
    }
    
    todayData[category].count += 1;
    todayData[category].totalTime += timeSpent;
    
    // Add site to the list if not already present
    const siteInfo = { url, title, timestamp: Date.now() };
    todayData[category].sites.push(siteInfo);
    
    // Keep only last 10 sites per category to avoid storage bloat
    if (todayData[category].sites.length > 10) {
      todayData[category].sites = todayData[category].sites.slice(-10);
    }
    
    await chrome.storage.local.set({ [today]: todayData });
  } catch (error) {
    console.error('Error saving browsing data:', error);
  }
}

// Track active tab changes
let activeTabId = null;
let tabStartTime = null;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // Save time spent on previous tab
  if (activeTabId && tabStartTime) {
    try {
      const tab = await chrome.tabs.get(activeTabId);
      const timeSpent = Date.now() - tabStartTime;
      const category = categorizeContent(tab.url, tab.title);
      await saveBrowsingData(tab.url, tab.title, category, timeSpent);
    } catch (error) {
      // Tab might have been closed
    }
  }
  
  activeTabId = activeInfo.tabId;
  tabStartTime = Date.now();
});

// Track tab updates (URL changes)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    const category = categorizeContent(tab.url, tab.title);
    await saveBrowsingData(tab.url, tab.title, category);
    
    // Update active tab tracking
    if (tabId === activeTabId) {
      tabStartTime = Date.now();
    }
  }
});

// Track when tabs are closed
chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (tabId === activeTabId && tabStartTime) {
    try {
      const timeSpent = Date.now() - tabStartTime;
      // We can't get tab info after it's closed, so we'll just reset
      activeTabId = null;
      tabStartTime = null;
    } catch (error) {
      console.error('Error handling tab removal:', error);
    }
  }
});

// Initialize extension
chrome.runtime.onStartup.addListener(() => {
  console.log('Content Tracker extension started');
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Content Tracker extension installed');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'pageAnalyzed') {
    // Store additional page analysis data
    const pageData = message.data;
    console.log('Page analyzed:', pageData);
  } else if (message.action === 'scrollTracked') {
    // Store scroll behavior data
    console.log('Scroll tracked:', message.data);
  } else if (message.action === 'timeTracked') {
    // Store time tracking data
    console.log('Time tracked:', message.data);
  }
});