let justifyTextEnabled = true;
let fixedCount = 0;

const applyJustifySetting = (isEnabled) => {
  justifyTextEnabled = isEnabled;
  if (isEnabled) {
    document.body.classList.add('ptf-justify-enabled');
  } else {
    document.body.classList.remove('ptf-justify-enabled');
  }
};

// تشخیص زبان و نوع محتوا
const detectLanguage = (text) => {
  if (!text) return 'unknown';

  const persianPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const englishPattern = /[a-zA-Z]/;

  const cleanText = text.replace(/[\s\d\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u2000-\u206F\u2E00-\u2E7F\u3000-\u303F\uFE10-\uFE1F\uFE30-\uFE4F\uFF00-\uFFEF\u{1F000}-\u{1F9FF}]/gu, '');

  const persianChars = (cleanText.match(persianPattern) || []).length;
  const englishChars = (cleanText.match(englishPattern) || []).length;
  const totalChars = cleanText.length;

  if (totalChars === 0) return 'unknown';

  const persianRatio = persianChars / totalChars;
  const englishRatio = englishChars / totalChars;

  if (persianRatio > 0.6) return 'persian';
  if (englishRatio > 0.8) return 'english';
  if (persianRatio > 0.3 && englishRatio > 0.3) return 'mixed-persian';
  if (englishRatio > persianRatio) return 'mixed-english';

  return 'persian';
};

// تخمین تعداد خطوط متن
const estimateLines = (element) => {
  const text = element.textContent || '';
  const charCount = text.length;
  const elementWidth = element.offsetWidth || 500; // عرض تقریبی
  const avgCharsPerLine = elementWidth / 8; // تخمین میانگین کاراکتر در هر خط
  
  return Math.ceil(charCount / avgCharsPerLine);
};

// بررسی اینکه آیا متن کوتاه است یا نه
const isShortText = (element) => {
  const text = element.textContent || '';
  const wordCount = text.trim().split(/\s+/).length;
  const charCount = text.length;
  const estimatedLines = estimateLines(element);
  
  // متن کوتاه: کمتر از 15 کلمه یا کمتر از 100 کاراکتر یا کمتر از 3 خط
  return wordCount < 15 || charCount < 100 || estimatedLines <= 2;
};

// محاسبه عرض بهینه برای justify
const calculateOptimalWidth = (element) => {
  const text = element.textContent || '';
  const wordCount = text.trim().split(/\s+/).length;
  const charCount = text.length;

  // محاسبه میانگین طول کلمات
  const avgWordLength = charCount / wordCount;

  // عرض فعلی المان
  const currentWidth = element.offsetWidth;

  // محاسبه عرض بهینه بر اساس تعداد کلمات و طول متن
  let optimalWidth;

  if (wordCount <= 10) {
    optimalWidth = Math.min(currentWidth, 320);
  } else if (wordCount <= 20) {
    optimalWidth = Math.min(currentWidth * 0.85, 420);
  } else if (wordCount <= 40) {
    optimalWidth = Math.min(currentWidth * 0.9, 520);
  } else {
    optimalWidth = currentWidth * 0.95;
  }

  // تنظیم دقیق‌تر بر اساس میانگین طول کلمات
  if (avgWordLength > 7) {
    optimalWidth *= 1.1;
  } else if (avgWordLength < 4) {
    optimalWidth *= 0.9;
  }

  return Math.max(280, Math.min(optimalWidth, currentWidth));
};

// تابع هوشمند برای اعمال justify
const shouldApplyJustify = (element, language) => {
  const text = element.textContent || '';
  const wordCount = text.trim().split(/\s+/).length;
  const lineLength = text.length;

  if (language === 'english' || language === 'mixed-english') return false;

  return wordCount > 5 && lineLength > 40;
};

const fixPersianText = (fontWeight, linkCheck) => {
  const postElements = document.querySelectorAll('div[data-testid="tweetText"]');
  let newFixCount = 0;

  postElements.forEach(element => {
    if (!element.dataset.fixed) {
      const language = detectLanguage(element.textContent);

      // پاک کردن استایل‌های قبلی
      element.style.width = '';
      element.style.maxWidth = '';
      element.style.paddingLeft = '';
      element.style.paddingRight = '';
      element.style.marginLeft = '';
      element.style.marginRight = '';

      if (language === 'english') {
        element.classList.add('english-styled');
        element.classList.remove('persian-styled', 'ptf-justify-smart');
        element.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        element.style.direction = 'ltr';
        element.style.textAlign = 'left';
        element.style.lineHeight = '1.5';
        element.style.fontWeight = fontWeight;
      }
      else if (language === 'persian' || language === 'mixed-persian') {
        element.classList.add('persian-styled');
        element.classList.remove('english-styled');

        // اعمال justify هوشمند
        if (justifyTextEnabled && shouldApplyJustify(element, language)) {
          element.classList.add('ptf-justify-smart');

          // فقط برای متن‌های بلند عرض را تنظیم کن
          if (!element.dataset.widthSet && !isShortText(element)) {
            requestAnimationFrame(() => {
              const optimalWidth = calculateOptimalWidth(element);
              element.style.width = optimalWidth + 'px';
              element.style.maxWidth = '100%';
              element.style.marginLeft = 'auto';
              element.style.marginRight = 'auto';
              element.style.paddingLeft = '12px';
              element.style.paddingRight = '12px';
              
              // علامت‌گذاری که عرض تنظیم شده
              element.dataset.widthSet = 'true';
            });
          } else if (isShortText(element)) {
            // برای متن‌های کوتاه، فقط کلاس justify را اضافه کن بدون تغییر عرض
            element.classList.add('ptf-short-text');
          }
        } else {
          element.classList.remove('ptf-justify-smart');
        }

        element.style.fontWeight = fontWeight;
        element.style.fontFamily = 'Vazir, tahoma, sans-serif';
        element.style.lineHeight = '1.75';
        element.style.direction = 'rtl';
        newFixCount++;
      }
      else if (language === 'mixed-english') {
        element.classList.add('mixed-english-styled');
        element.classList.remove('persian-styled', 'english-styled', 'ptf-justify-smart');
        element.style.fontFamily = 'Vazir, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        element.style.direction = 'ltr';
        element.style.textAlign = 'left';
        element.style.lineHeight = '1.6';
        element.style.fontWeight = fontWeight;
      }

      element.style.letterSpacing = 'normal';
      element.style.wordSpacing = 'normal';
      element.style.display = 'block';
      element.style.minHeight = '20px';
      element.style.margin = '0';
      element.style.padding = '0';
      element.dataset.fixed = 'true';
      element.dataset.detectedLanguage = language;

      if (linkCheck) {
        const links = element.getElementsByTagName('a');
        for (let link of links) {
          if (!link.href.startsWith('https://x.com/') &&
              !link.href.startsWith('http://x.com/') &&
              !link.textContent.startsWith('@')) {
            checkLinkSafety(link);
          }
        }
      }
    }
  });

  if (newFixCount > 0) {
    fixedCount += newFixCount;
    chrome.runtime.sendMessage({ action: 'textFixed' }).catch(() => {});
  }
};

const fixPersianTweetLikeText = (fontWeight) => {
  let newFixCount = 0;

  const selectors = [
    'span.r-qvutc0',
    'span[data-testid="UserName"]',
    'div[data-testid="UserName"]',
    'span.css-901oao.css-16my406',
    'div.css-901oao.r-1awozwy'
  ];

  document.querySelectorAll(selectors.join(',')).forEach(element => {
    if (!element.dataset.farsiFixed) {
      const language = detectLanguage(element.textContent);

      if (language === 'persian' || language === 'mixed-persian') {
        element.style.fontFamily = 'Vazir, tahoma, sans-serif';
        element.style.fontWeight = fontWeight;
        element.style.lineHeight = '1.65';
        element.style.direction = 'rtl';
        element.style.letterSpacing = 'normal';
        element.dataset.farsiFixed = 'true';
        element.dataset.detectedLanguage = language;
        newFixCount++;
      } else if (language === 'english') {
        element.style.direction = 'ltr';
        element.style.fontFamily = 'inherit';
        element.dataset.farsiFixed = 'true';
        element.dataset.detectedLanguage = language;
      }
    }
  });

  if (newFixCount > 0) {
    fixedCount += newFixCount;
    chrome.runtime.sendMessage({ action: 'textFixed' }).catch(() => {});
  }
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'updateFontSettings' && msg.settings) {
    applyJustifySetting(msg.settings.justifyText !== false);
    fixPersianText(msg.settings.fontWeight || 400, msg.settings.linkCheck !== false);
    fixPersianTweetLikeText(msg.settings.fontWeight || 400);
  }
});
