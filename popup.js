class PopupManager {
  constructor() {
    this.currentTab = 'today';
    this.data = null;
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadData();
    this.hideLoading();
    this.displayData();
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Control buttons
    document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
    document.getElementById('clearBtn').addEventListener('click', () => this.clearData());
    document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
  }

  async loadData() {
    try {
      const result = await chrome.storage.local.get(null);
      this.data = result;
    } catch (error) {
      console.error('Error loading data:', error);
      this.data = {};
    }
  }

  hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
  }

  switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    this.currentTab = tabName;
    this.displayData();
  }

  displayData() {
    const container = document.getElementById('stats-container');
    const chartContainer = document.getElementById('chart-container');
    
    if (this.currentTab === 'chart') {
      container.style.display = 'none';
      chartContainer.style.display = 'block';
      this.displayChart();
    } else {
      container.style.display = 'block';
      chartContainer.style.display = 'none';
      this.displayStats();
    }
  }

  displayStats() {
    const container = document.getElementById('stats-container');
    const data = this.getDataForPeriod();
    
    if (!data || Object.keys(data).length === 0) {
      container.innerHTML = '<div style="text-align: center; opacity: 0.7;">No browsing data available</div>';
      return;
    }

    // Aggregate and sort data
    const aggregated = this.aggregateData(data);
    const sorted = Object.entries(aggregated).sort((a, b) => b[1].count - a[1].count);

    let html = '';
    let totalSites = 0;
    let totalTime = 0;

    sorted.forEach(([category, stats]) => {
      totalSites += stats.count;
      totalTime += stats.totalTime;
      
      const timeStr = this.formatTime(stats.totalTime);
      html += `
        <div class="stat-item">
          <div>
            <div class="category-name">${category}</div>
            <div class="time-display">${timeStr}</div>
          </div>
          <div class="category-count">${stats.count}</div>
        </div>
      `;
    });

    container.innerHTML = html;
    
    // Update summary
    const summaryEl = document.getElementById('summary');
    summaryEl.innerHTML = `
      <strong>${totalSites}</strong> sites visited<br>
      <strong>${this.formatTime(totalTime)}</strong> total time
    `;
  }

  displayChart() {
    const chartContent = document.getElementById('chart-content');
    const data = this.getDataForPeriod();
    
    if (!data || Object.keys(data).length === 0) {
      chartContent.innerHTML = '<div style="text-align: center; opacity: 0.7;">No data to chart</div>';
      return;
    }

    const aggregated = this.aggregateData(data);
    const sorted = Object.entries(aggregated).sort((a, b) => b[1].count - a[1].count);
    const maxCount = sorted[0] ? sorted[0][1].count : 1;

    let html = '';
    sorted.forEach(([category, stats]) => {
      const width = (stats.count / maxCount) * 100;
      html += `
        <div style="margin: 8px 0;">
          <div style="font-size: 11px; margin-bottom: 2px;">${category} (${stats.count})</div>
          <div class="bar" style="width: ${width}%;">
            <div class="bar-label">${this.formatTime(stats.totalTime)}</div>
          </div>
        </div>
      `;
    });

    chartContent.innerHTML = html;
  }

  getDataForPeriod() {
    if (this.currentTab === 'today') {
      const today = new Date().toDateString();
      return { [today]: this.data[today] || {} };
    } else if (this.currentTab === 'week') {
      const weekData = {};
      const now = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        if (this.data[dateStr]) {
          weekData[dateStr] = this.data[dateStr];
        }
      }
      
      return weekData;
    }
    
    return this.data;
  }

  aggregateData(data) {
    const aggregated = {};
    
    Object.values(data).forEach(dayData => {
      Object.entries(dayData).forEach(([category, stats]) => {
        if (!aggregated[category]) {
          aggregated[category] = {
            count: 0,
            totalTime: 0,
            sites: []
          };
        }
        
        aggregated[category].count += stats.count;
        aggregated[category].totalTime += stats.totalTime;
        aggregated[category].sites.push(...stats.sites);
      });
    });
    
    return aggregated;
  }

  formatTime(milliseconds) {
    if (milliseconds < 60000) {
      return `${Math.round(milliseconds / 1000)}s`;
    } else if (milliseconds < 3600000) {
      return `${Math.round(milliseconds / 60000)}m`;
    } else {
      const hours = Math.floor(milliseconds / 3600000);
      const minutes = Math.round((milliseconds % 3600000) / 60000);
      return `${hours}h ${minutes}m`;
    }
  }

  async exportData() {
    try {
      const dataStr = JSON.stringify(this.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `content-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data');
    }
  }

  async clearData() {
    if (confirm('Are you sure you want to clear all browsing data? This cannot be undone.')) {
      try {
        await chrome.storage.local.clear();
        this.data = {};
        this.displayData();
        alert('Data cleared successfully');
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Error clearing data');
      }
    }
  }

  openSettings() {
    // Open options page or settings modal
    chrome.runtime.openOptionsPage?.() || 
    alert('Settings feature coming soon! You can customize categories and tracking preferences.');
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});