// ذخیره API Keys
let safeBrowsingApiKey = '';
let geminiApiKey = '';

// آمارهای افزونه
let statistics = {
  fixedTweets: 0,
  translatedItems: 0,
  checkedLinks: 0
};

// تابع ساده برای پردازش API Key
function processApiKey(key) {
  if (!key) return '';
  return key.trim();
}

// بارگذاری اولیه API Keys و آمارها
chrome.storage.sync.get(['apiKey', 'geminiApiKey'], function(result) {
  if (result.apiKey) {
    safeBrowsingApiKey = processApiKey(result.apiKey);
    console.log('Safe Browsing API loaded, length:', safeBrowsingApiKey.length);
  }
  if (result.geminiApiKey) {
    geminiApiKey = processApiKey(result.geminiApiKey);
    console.log('Gemini API loaded, length:', geminiApiKey.length);
  }
});

// بارگذاری آمارها
chrome.storage.local.get(['statistics'], function(result) {
  if (result.statistics) {
    statistics = result.statistics;
  } else {
    chrome.storage.local.set({ statistics: statistics });
  }
});

// تابع آپدیت آمار
function updateStatistics(type) {
  if (type === 'translate') {
    statistics.translatedItems++;
  } else if (type === 'linkCheck') {
    statistics.checkedLinks++;
  } else if (type === 'textFix') {
    statistics.fixedTweets++;
  }
  
  chrome.storage.local.set({ statistics: statistics }, () => {
    chrome.runtime.sendMessage({
      action: 'updateStatistics',
      statistics: statistics
    }).catch(() => {});
    
    addRecentActivity(type);
  });
}

// اضافه کردن فعالیت جدید
function addRecentActivity(type) {
  const messages = {
    translate: 'یک توییت ترجمه شد',
    linkCheck: 'یک لینک بررسی شد',
    textFix: 'متن فارسی اصلاح شد'
  };
  
  chrome.storage.local.get(['recentActivities'], (result) => {
    let activities = result.recentActivities || [];
    
    activities.unshift({
      type: type === 'translate' ? 'translate' : type === 'linkCheck' ? 'link' : 'fix',
      message: messages[type] || 'عملیات انجام شد',
      timestamp: Date.now()
    });
    
    activities = activities.slice(0, 10);
    chrome.storage.local.set({ recentActivities: activities });
  });
}

// بررسی امنیت لینک
async function checkLinkSafety(url) {
  if (!safeBrowsingApiKey) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['apiKey'], function(result) {
        if (result.apiKey) {
          safeBrowsingApiKey = processApiKey(result.apiKey);
          performLinkCheck(url).then(resolve);
        } else {
          resolve({ status: 'failed', error: 'Safe Browsing API Key تنظیم نشده است' });
        }
      });
    });
  }

  return performLinkCheck(url);
}

// انجام بررسی لینک
async function performLinkCheck(url) {
  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${safeBrowsingApiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client: {
          clientId: 'persian-text-fixer',
          clientVersion: '1.3.0'
        },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url: url }]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // آپدیت آمار
    updateStatistics('linkCheck');

    if (data.matches && data.matches.length > 0) {
      const threatType = data.matches[0].threatType;
      return {
        status: ['MALWARE', 'SOCIAL_ENGINEERING'].includes(threatType) ? 'unsafe' : 'suspicious'
      };
    }

    return { status: 'safe' };

  } catch (error) {
    console.error('Link check error:', error);
    return { status: 'failed', error: error.message };
  }
}

// ترجمه با Gemini API - با پرامپت حرفه‌ای
async function translateWithGemini(text, targetLang = 'fa', customPrompt = '') {
  if (!geminiApiKey) {
    const result = await chrome.storage.sync.get(['geminiApiKey']);
    if (result.geminiApiKey) {
      geminiApiKey = processApiKey(result.geminiApiKey);
    } else {
      return { error: 'Gemini API Key تنظیم نشده است', success: false };
    }
  }

  console.log('Translating with Gemini, API key length:', geminiApiKey.length);

  // استفاده از Gemini 2.0 Flash
  const model = 'gemini-2.0-flash';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

  // پرامپت حرفه‌ای برای ترجمه توییت‌ها
  const professionalPrompt = targetLang === 'fa' ? `
You are an expert Twitter/X translator specializing in Persian translations. Your task is to translate tweets while preserving their essence and impact.

**Critical Instructions:**

1. **Tone Detection & Adaptation:**
   - Identify the tone: formal/informal, serious/humorous, professional/casual, emotional/neutral
   - Match the exact tone in Persian. If it's casual, use colloquial Persian. If formal, use professional Persian.

2. **Structure Preservation:**
   - MAINTAIN the exact paragraph structure and line breaks
   - If the original has 3 paragraphs, the translation MUST have 3 paragraphs
   - Preserve spacing between sections
   - Keep bullet points, numbered lists, or special formatting

3. **Twitter-Specific Elements:**
   - Keep hashtags as-is (don't translate them)
   - Keep @mentions unchanged
   - Preserve URLs
   - Maintain emojis in their original positions

4. **Persian Language Excellence:**
   - Use natural, flowing Persian that natives would actually tweet
   - Avoid literal translations - adapt idioms and expressions
   - Use appropriate Persian equivalents for slang/memes
   - Apply correct Persian punctuation and spacing rules
   - Use «» for quotes instead of ""

5. **Cultural Adaptation:**
   - Adapt cultural references when needed for Persian audience
   - Keep technical terms that are commonly used in English by Persian speakers

**Translation Rules:**
- Output ONLY the translated text
- No explanations or additional commentary
- Preserve the original's energy and impact
- Make it sound like a native Persian speaker wrote it

Text to translate:
${text}`
  : `
You are an expert Twitter/X translator specializing in English translations. Your task is to translate Persian tweets into natural, engaging English.

**Critical Instructions:**

1. **Tone Matching:**
   - Identify if the Persian text is formal/informal, serious/playful
   - Use appropriate English register and vocabulary

2. **Structure Preservation:**
   - MAINTAIN exact paragraph structure and line breaks
   - Keep the same visual layout as the original
   - Preserve any lists or special formatting

3. **Natural English:**
   - Create translations that sound like native English tweets
   - Use common Twitter language and expressions
   - Adapt Persian idioms to English equivalents
   - Avoid overly literal translations

4. **Twitter Elements:**
   - Keep hashtags, @mentions, and URLs unchanged
   - Maintain emoji positions

5. **Cultural Bridge:**
   - Explain cultural references briefly if crucial for understanding
   - Keep commonly known Persian terms if they add authenticity

Output ONLY the translation, maintaining the exact structure.

Text to translate:
${text}`;

  // اگر پرامپت سفارشی داده شده، از اون استفاده کن
  const finalPrompt = customPrompt || professionalPrompt;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: finalPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.4, // کمی بالاتر برای ترجمه طبیعی‌تر
          maxOutputTokens: 2048,
          topK: 40,
          topP: 0.95,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      })
    });

    if (!response.ok) {
      let msg = `HTTP error: ${response.status}`;
      if (response.status === 403) {
        msg = 'خطا 403: کلید API نامعتبر است یا دسترسی ندارید';
      } else if (response.status === 404) {
        msg = 'خطا 404: آدرس API یا مدل اشتباه است';
      } else if (response.status === 400) {
        msg = 'خطا 400: درخواست نامعتبر - بررسی کنید API key فعال باشد';
      }
      return { error: msg, success: false };
    }

    const data = await response.json();

    // بررسی دقیق ساختار پاسخ Gemini
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];

      // چک کردن content و parts
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        const translatedText = candidate.content.parts[0].text;
        if (translatedText) {
          // آپدیت آمار
          updateStatistics('translate');
          
          // حذف whitespace اضافی از ابتدا و انتها ولی حفظ ساختار داخلی
          return {
            translation: translatedText.trim(),
            success: true
          };
        }
      }
    }

    // اگر به اینجا رسید یعنی ساختار پاسخ مشکل دارد
    console.error('Invalid Gemini response structure:', data);
    return { error: 'پاسخ نامعتبر از سرور Gemini', success: false };

  } catch (error) {
    console.error('Gemini API error:', error);
    let errorMessage = error.message || 'خطای ناشناخته';

    // بررسی خطاهای رایج
    if (errorMessage.includes('Failed to fetch')) {
      errorMessage = 'خطا در اتصال به سرور Gemini - اتصال اینترنت را بررسی کنید';
    } else if (errorMessage.includes('NetworkError')) {
      errorMessage = 'خطای شبکه - ممکن است فیلتر باشد';
    }

    return { error: errorMessage, success: false };
  }
}

// Listener برای پیام‌ها از content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message.action);

  if (message.action === 'checkLink') {
    checkLinkSafety(message.url)
      .then(result => {
        console.log('Link check result:', result);
        sendResponse(result);
      })
      .catch(error => {
        console.error('Link check error:', error);
        sendResponse({ status: 'failed', error: error.message });
      });
    return true; // مهم برای async response
  }

  if (message.action === 'translate') {
    console.log('Translation request for:', message.text.substring(0, 50) + '...');

    translateWithGemini(message.text, message.targetLang, message.customPrompt)
      .then(result => {
        console.log('Translation result:', result.success ? 'Success' : 'Failed');
        sendResponse(result);
      })
      .catch(error => {
        console.error('Translation error:', error);
        sendResponse({ error: error.message, success: false });
      });
    return true; // مهم برای async response
  }
  
  if (message.action === 'textFixed') {
    updateStatistics('textFix');
    sendResponse({ success: true });
    return false;
  }

  // اگر action ناشناخته بود
  console.warn('Unknown action:', message.action);
  sendResponse({ error: 'Unknown action', success: false });
  return false;
});

// بررسی تغییر مقادیر API Key
chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log('Storage changed in', namespace);

  if (changes.apiKey) {
    safeBrowsingApiKey = processApiKey(changes.apiKey.newValue || '');
    console.log('Safe Browsing API updated');
  }

  if (changes.geminiApiKey) {
    geminiApiKey = processApiKey(changes.geminiApiKey.newValue || '');
    console.log('Gemini API updated');
  }
});

// Log برای debug
console.log('Background script loaded successfully');
