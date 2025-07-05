// Initialize popup without Chart.js first
document.addEventListener('DOMContentLoaded', function() {
  // Setup event listeners immediately
  setupEventListeners();
  
  // Load theme preference
  loadThemePreference();
  
  // Load statistics
  loadStatistics();
  
  // Load recent activities
  loadRecentActivities();
});

// Setup event listeners
function setupEventListeners() {
  // دکمه تنظیمات - مستقیماً و بدون تاخیر
  const settingsBtn = document.getElementById('openSettings');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // افکت ripple اگر نیاز بود
      const ripple = this.querySelector('.ripple');
      if (ripple) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // حذف و اضافه کردن کلاس برای ریست انیمیشن
        ripple.classList.remove('animate');
        void ripple.offsetWidth; // trigger reflow
        ripple.classList.add('animate');
      }
      
      // باز کردن صفحه تنظیمات
      chrome.runtime.openOptionsPage();
    });
  }

  // Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      chrome.storage.local.set({ theme: isLight ? 'light' : 'dark' });
      
      // Update icon
      const icon = this.querySelector('i');
      if (icon) {
        icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
      }
    });
  }

  // Stat cards click events
  document.querySelectorAll('.stat-card').forEach((card, index) => {
    card.addEventListener('click', function() {
      // می‌توانید اینجا جزئیات آمار را نمایش دهید
      console.log('Stat card clicked:', index);
    });
  });
}

// Load statistics from storage
async function loadStatistics() {
  try {
    const stats = await chrome.storage.local.get(['statistics']);
    const statistics = stats.statistics || {
      fixedTweets: 0,
      translatedItems: 0,
      checkedLinks: 0
    };

    // Set values directly without animation for now
    document.getElementById('fixedTweets').textContent = 
      new Intl.NumberFormat('fa-IR').format(statistics.fixedTweets);
    document.getElementById('translatedItems').textContent = 
      new Intl.NumberFormat('fa-IR').format(statistics.translatedItems);
    document.getElementById('checkedLinks').textContent = 
      new Intl.NumberFormat('fa-IR').format(statistics.checkedLinks);
  } catch (error) {
    console.error('Error loading statistics:', error);
    // Set default values
    document.getElementById('fixedTweets').textContent = '۰';
    document.getElementById('translatedItems').textContent = '۰';
    document.getElementById('checkedLinks').textContent = '۰';
  }
}

// Load recent activities
function loadRecentActivities() {
  try {
    chrome.storage.local.get(['recentActivities'], (result) => {
      const activities = result.recentActivities || [];
      const timeline = document.getElementById('activityTimeline');
      
      if (!timeline) return;
      
      if (activities.length === 0) {
        timeline.innerHTML = `
          <div class="activity-item">
            <div class="activity-icon">
              <i class="fas fa-info-circle"></i>
            </div>
            <div class="activity-content">
              <p class="activity-text">هنوز فعالیتی ثبت نشده است</p>
              <time class="activity-time">همین الان</time>
            </div>
          </div>
        `;
        return;
      }
      
      timeline.innerHTML = activities.slice(0, 3).map(activity => `
        <div class="activity-item">
          <div class="activity-icon">
            <i class="${getActivityIcon(activity.type)}"></i>
          </div>
          <div class="activity-content">
            <p class="activity-text">${activity.message}</p>
            <time class="activity-time">${formatTime(activity.timestamp)}</time>
          </div>
        </div>
      `).join('');
    });
  } catch (error) {
    console.error('Error loading activities:', error);
  }
}

// Get activity icon based on type
function getActivityIcon(type) {
  const icons = {
    'fix': 'fas fa-check-circle',
    'translate': 'fas fa-language',
    'link': 'fas fa-shield-alt',
    'error': 'fas fa-exclamation-circle',
    'info': 'fas fa-info-circle'
  };
  return icons[type] || icons.info;
}

// Format timestamp to relative time
function formatTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'همین الان';
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  if (hours < 24) return `${hours} ساعت پیش`;
  if (days < 7) return `${days} روز پیش`;
  
  return new Date(timestamp).toLocaleDateString('fa-IR');
}

// Load theme preference
function loadThemePreference() {
  chrome.storage.local.get(['theme'], (result) => {
    if (result.theme === 'light') {
      document.body.classList.add('light-theme');
      const icon = document.querySelector('#themeToggle i');
      if (icon) {
        icon.className = 'fas fa-sun';
      }
    }
  });
}

// Listen for statistics updates
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStatistics') {
    loadStatistics();
  } else if (request.action === 'newActivity') {
    loadRecentActivities();
  }
});
