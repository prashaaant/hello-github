// Content script to analyze page content
class ContentAnalyzer {
  constructor() {
    this.pageLoadTime = Date.now();
    this.init();
  }

  init() {
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.analyzePage());
    } else {
      this.analyzePage();
    }

    // Track scroll behavior
    this.trackScrollBehavior();
    
    // Track time spent on page
    this.trackTimeOnPage();
  }

  analyzePage() {
    const pageData = {
      title: document.title,
      url: window.location.href,
      domain: window.location.hostname,
      wordCount: this.getWordCount(),
      hasVideo: this.hasVideoContent(),
      hasImages: this.getImageCount(),
      contentType: this.detectContentType(),
      readingTime: this.estimateReadingTime()
    };

    // Send page data to background script
    chrome.runtime.sendMessage({
      action: 'pageAnalyzed',
      data: pageData
    });
  }

  getWordCount() {
    const text = document.body.innerText || '';
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  hasVideoContent() {
    const videos = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
    return videos.length > 0;
  }

  getImageCount() {
    const images = document.querySelectorAll('img');
    return images.length;
  }

  detectContentType() {
    const url = window.location.href.toLowerCase();
    const title = document.title.toLowerCase();
    const content = document.body.innerText.toLowerCase();

    // Detect based on page structure and content
    if (document.querySelectorAll('article, .article, .post').length > 0) {
      return 'article';
    }
    
    if (document.querySelectorAll('video, .video-player').length > 0) {
      return 'video';
    }
    
    if (document.querySelectorAll('.product, .item, .listing').length > 0) {
      return 'shopping';
    }
    
    if (document.querySelectorAll('form[action*="search"], .search-results').length > 0) {
      return 'search';
    }
    
    return 'webpage';
  }

  estimateReadingTime() {
    const wordCount = this.getWordCount();
    const wordsPerMinute = 200; // Average reading speed
    return Math.ceil(wordCount / wordsPerMinute);
  }

  trackScrollBehavior() {
    let maxScroll = 0;
    let scrollEvents = 0;

    const handleScroll = () => {
      scrollEvents++;
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      maxScroll = Math.max(maxScroll, scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Send scroll data when user leaves page
    window.addEventListener('beforeunload', () => {
      chrome.runtime.sendMessage({
        action: 'scrollTracked',
        data: {
          maxScroll: Math.round(maxScroll),
          scrollEvents,
          url: window.location.href
        }
      });
    });
  }

  trackTimeOnPage() {
    let isVisible = !document.hidden;
    let visibleTime = 0;
    let lastVisibilityChange = Date.now();

    const updateVisibleTime = () => {
      if (isVisible) {
        visibleTime += Date.now() - lastVisibilityChange;
      }
      lastVisibilityChange = Date.now();
    };

    document.addEventListener('visibilitychange', () => {
      updateVisibleTime();
      isVisible = !document.hidden;
    });

    window.addEventListener('beforeunload', () => {
      updateVisibleTime();
      chrome.runtime.sendMessage({
        action: 'timeTracked',
        data: {
          totalTime: Date.now() - this.pageLoadTime,
          visibleTime,
          url: window.location.href
        }
      });
    });
  }
}

// Initialize content analyzer
if (window.location.href && !window.location.href.startsWith('chrome://')) {
  new ContentAnalyzer();
}