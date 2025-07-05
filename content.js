let translationEnabled = false;
const translatedElements = new WeakSet();

const translations = {
  'Home': 'خانه',
  'Explore': 'کاوش',
  'Notifications': 'اعلان‌ها',
  'Messages': 'پیام‌ها',
  'Lists': 'فهرست‌ها',
  'Communities': 'انجمن‌ها',
  'Premium': 'پرمیوم',
  'Profile': 'نمایه',
  'More': 'بیشتر',
  'Verified': 'تأییدشده',
  'Post': 'ارسال',
  'Reply': 'پاسخ',
  'Repost': 'بازنشر',
  'Like': 'پسندیدن',
  'View': 'نمایش',
  'Views': 'بازدید',
  'Bookmark': 'ذخیره',
  'Bookmarks': 'ذخیره‌ها',
  'Share': 'اشتراک‌گذاری',
  'Search': 'جستجو',
  'Who to follow': 'پیشنهاد دنبال کردن',
  'Trending': 'موضوعات داغ',
  'Show more': 'نمایش بیشتر',
  'Show more replies': 'نمایش پاسخ‌های بیشتر',
  'What is happening': 'چه خبر است',
  'For you': 'برای شما',
  'Following': 'دنبال‌شده‌ها',
  'Try Premium': 'پرمیوم را امتحان کنید',
  'Settings': 'تنظیمات',
  'Search Twitter': 'جستجو در توییتر',
  'Search X': 'جستجو در X',
};

const translateUIElements = () => {
  const selectors = [
    'span.css-1qaijid',
    'span.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0',
    'a[aria-label="Search"] span',
    'a[role="tab"] span',
    'a[href="/explore"] span',
    'a[href="/notifications"] span',
    'span.r-1qd0xha.r-adyw6z.r-1vr29t4.r-135wba7.r-bcqeeo',
    'h2.css-4rbku5.css-1dbjc4n span',
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      if (translatedElements.has(element)) return;

      const originalText = element.textContent.trim();
      if (translations[originalText]) {
        element.textContent = translations[originalText];
        element.style.fontFamily = 'Vazir, tahoma, sans-serif';
        translatedElements.add(element);
      }
    });
  });
};

const injectAnimationStyles = () => {
  if (document.getElementById('ptf-animation-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'ptf-animation-styles';
  style.innerHTML = `
    @keyframes ptf-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .ptf-spin {
      animation: ptf-spin 1s linear infinite;
    }
    @keyframes fadeInWord {
      to {
        opacity: 1;
      }
    }
    .ptf-toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      border-radius: 24px;
      z-index: 10000;
      font-family: Vazir, Tahoma, sans-serif;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.3s;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
  `;
  document.head.appendChild(style);
};

const processArticle = (article) => {
  if (translationEnabled) {
    createTranslateButton(article);
  }
  if (accessibilitySettings.showMagnifier) {
    createMagnifierButton(article);
  }
};

const improveTwitter = () => {
  chrome.storage.sync.get(['fontWeight', 'justifyText', 'linkCheck', 'translateUI', 'enableTranslation', 'accessibility'], function(result) {
    const fontWeight = result.fontWeight || '400';
    const justifyText = result.justifyText !== false;
    const linkCheck = result.linkCheck !== false;
    const translateUI = result.translateUI === true;
    translationEnabled = result.enableTranslation !== false;

    applyJustifySetting(justifyText);
    fixPersianText(fontWeight, linkCheck);
    fixPersianTweetLikeText(fontWeight);

    if (translateUI) {
      translateUIElements();
    }

    if (result.accessibility) {
      createAccessibilityStyles();
      applyAccessibilitySettings({
        enabled: result.accessibility.accessibilityMode || false,
        fontSize: result.accessibility.textSize || 100,
        lineHeight: result.accessibility.lineSpacing || 150,
        colorTheme: result.accessibility.colorTheme || 'normal',
        boldLinks: result.accessibility.boldLinks || false,
        showMagnifier: result.accessibility.showZoomButton || false,
        simpleUI: result.accessibility.simplifiedUI || false
      });

      if (result.accessibility.showZoomButton) {
        document.querySelectorAll('article').forEach(processArticle);
      }
    }

    if (translationEnabled) {
      document.querySelectorAll('article').forEach(processArticle);
    }
  });
};

const safeImproveTwitter = () => {
  try {
    improveTwitter();
  } catch (error) {
    handleError(error, 'improveTwitter');
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    injectAnimationStyles();
    createAccessibilityStyles();
    setTimeout(safeImproveTwitter, 100);
  });
} else {
  injectAnimationStyles();
  createAccessibilityStyles();
  setTimeout(safeImproveTwitter, 100);
}

setInterval(() => {
  handleTwitterModals();
  debouncedImproveTwitter();
}, 5000);

const debouncedImproveTwitter = debounce(improveTwitter, 300);

observeDOM(safeImproveTwitter);
observeURLChanges(safeImproveTwitter);
observeScroll(safeImproveTwitter);

setInterval(() => {
  const cacheSize = Object.keys(linkCache).length;
  if (cacheSize > 1000) {
    const entries = Object.entries(linkCache);
    const keep = entries.slice(-500);
    Object.keys(linkCache).forEach(key => delete linkCache[key]);
    keep.forEach(([key, value]) => linkCache[key] = value);
    console.log(`Cleaned link cache. Reduced from ${cacheSize} to 500 entries.`);
  }
}, 30 * 60 * 1000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateFontSettings") {
    if (request.settings && request.settings.justifyText !== undefined) {
      applyJustifySetting(request.settings.justifyText);
    }
  }
  
  if (request.action === "updateAccessibility") {
    if (request.settings) {
      applyAccessibilitySettings({
        enabled: request.settings.accessibilityMode || false,
        fontSize: request.settings.textSize || 100,
        lineHeight: request.settings.lineSpacing || 150,
        colorTheme: request.settings.colorTheme || 'normal',
        boldLinks: request.settings.boldLinks || false,
        showMagnifier: request.settings.showZoomButton || false,
        simpleUI: request.settings.simplifiedUI || false
      });
      safeImproveTwitter();
    }
  }

  if (request.action === "updateTranslationSettings") {
    translationEnabled = request.settings.enableTranslation;
    if (translationEnabled) {
      document.querySelectorAll('article').forEach(article => {
        createTranslateButton(article);
      });
    } else {
      document.querySelectorAll('.ptf-translate-container').forEach(container => {
        container.remove();
      });
      document.querySelectorAll('.ptf-translation').forEach(translation => {
        translation.remove();
      });
      translatedTweets = new WeakMap();
    }
  }
});

console.log('Persian Text Fixer for Twitter - Successfully loaded and running');
chrome.runtime.sendMessage({
  action: 'contentScriptReady',
  url: window.location.href
});