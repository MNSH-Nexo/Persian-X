// تابع نمایش وضعیت
function showStatus(message, isError = false) {
  const status = document.getElementById('status');
  if (!status) return;

  status.textContent = message;
  status.className = 'status-message show' + (isError ? ' error' : '');

  setTimeout(() => {
    status.classList.remove('show');
  }, 3000);
}

// Navigation
document.querySelectorAll('.menu-item').forEach(button => {
  button.addEventListener('click', () => {
    // Update active states
    document.querySelectorAll('.menu-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Set new active
    button.classList.add('active');
    const sectionId = button.getAttribute('data-section');
    document.getElementById(sectionId).classList.add('active');
  });
});

// متغیرهای DOM
const elements = {
  // API Keys
  apiKey: document.getElementById('apiKey'),
  saveApiKey: document.getElementById('saveApiKey'),
  geminiApiKey: document.getElementById('geminiApiKey'),
  saveGeminiApiKey: document.getElementById('saveGeminiApiKey'),

  // Font Settings
  fontWeight: document.getElementById('fontWeight'),
  fontWeightValue: document.getElementById('fontWeightValue'),
  fontPreview: document.getElementById('fontPreview'),
  justifyText: document.getElementById('justifyText'),
  saveFontWeight: document.getElementById('saveFontWeight'),

  // Translation
  translateUI: document.getElementById('translateUI'),
  enableTranslation: document.getElementById('enableTranslation'),
  customPrompt: document.getElementById('customPrompt'),
  saveTranslate: document.getElementById('saveTranslate'),

  // Security
  linkCheck: document.getElementById('linkCheck'),
  saveLinkCheck: document.getElementById('saveLinkCheck'),

  // Accessibility
  accessibilityMode: document.getElementById('accessibilityMode'),
  accessibilityOptions: document.getElementById('accessibilityOptions'),
  textSize: document.getElementById('textSize'),
  textSizeValue: document.getElementById('textSizeValue'),
  lineSpacing: document.getElementById('lineSpacing'),
  lineSpacingValue: document.getElementById('lineSpacingValue'),
  showZoomButton: document.getElementById('showZoomButton'),
  saveAccessibility: document.getElementById('saveAccessibility'),
  accessibilityPreview: document.getElementById('accessibilityPreview'),

  // About
  totalFixed: document.getElementById('totalFixed'),
  totalTranslated: document.getElementById('totalTranslated'),
  totalChecked: document.getElementById('totalChecked')
};

// Event Listeners برای API Keys
if (elements.saveApiKey) {
  elements.saveApiKey.addEventListener('click', () => {
    const apiKey = elements.apiKey.value.trim();

    if (!apiKey) {
      showStatus('❌ لطفاً Safe Browsing API Key را وارد کنید', true);
      return;
    }

    chrome.storage.sync.set({ apiKey: apiKey }, () => {
      if (chrome.runtime.lastError) {
        showStatus('❌ خطا در ذخیره: ' + chrome.runtime.lastError.message, true);
      } else {
        showStatus('✅ Safe Browsing API Key ذخیره شد');
        elements.apiKey.value = '';
        elements.apiKey.placeholder = 'API Key ذخیره شده است';
      }
    });
  });
}

if (elements.saveGeminiApiKey) {
  elements.saveGeminiApiKey.addEventListener('click', () => {
    const apiKey = elements.geminiApiKey.value.trim();

    if (!apiKey) {
      showStatus('❌ لطفاً Gemini API Key را وارد کنید', true);
      return;
    }

    if (apiKey.length < 30 || apiKey.length > 50) {
      showStatus('❌ طول API Key نامعتبر است', true);
      return;
    }

    chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
      if (chrome.runtime.lastError) {
        showStatus('❌ خطا در ذخیره: ' + chrome.runtime.lastError.message, true);
      } else {
        showStatus('✅ Gemini API Key ذخیره شد');
        elements.geminiApiKey.value = '';
        elements.geminiApiKey.placeholder = 'API Key ذخیره شده است';
        testGeminiAPI();
      }
    });
  });
}

// تست Gemini API
function testGeminiAPI() {
  chrome.runtime.sendMessage({
    action: 'translate',
    text: 'Hello',
    targetLang: 'fa'
  }, response => {
    if (response && response.success) {
      showStatus('✅ API Key معتبر است و کار می‌کند!');
    } else {
      showStatus('⚠️ API Key ذخیره شد اما تست موفق نبود', true);
    }
  });
}

// Font Settings
if (elements.fontWeight) {
  elements.fontWeight.addEventListener('input', (e) => {
    const value = e.target.value;
    if (elements.fontWeightValue) elements.fontWeightValue.textContent = value;
    if (elements.fontPreview) elements.fontPreview.style.fontWeight = value;
  });
}

if (elements.saveFontWeight) {
  elements.saveFontWeight.addEventListener('click', () => {
    const settings = {
      fontWeight: elements.fontWeight.value,
      justifyText: elements.justifyText.checked
    };

    chrome.storage.sync.set(settings, () => {
      showStatus('✅ تنظیمات فونت ذخیره شد');
      updateAllTabs('updateFontSettings', settings);
    });
  });
}

// Translation Settings
if (elements.saveTranslate) {
  elements.saveTranslate.addEventListener('click', () => {
    const settings = {
      translateUI: elements.translateUI.checked,
      enableTranslation: elements.enableTranslation.checked,
      customPrompt: elements.customPrompt.value.trim()
    };

    chrome.storage.sync.set(settings, () => {
      showStatus('✅ تنظیمات ترجمه ذخیره شد');
      updateAllTabs('updateTranslationSettings', settings);
    });
  });
}

// Link Check Settings
if (elements.saveLinkCheck) {
  elements.saveLinkCheck.addEventListener('click', () => {
    chrome.storage.sync.set({ linkCheck: elements.linkCheck.checked }, () => {
      showStatus('✅ تنظیمات بررسی لینک ذخیره شد');
    });
  });
}

// Accessibility Settings
if (elements.accessibilityMode) {
  elements.accessibilityMode.addEventListener('change', (e) => {
    if (elements.accessibilityOptions) {
      elements.accessibilityOptions.classList.toggle('show', e.target.checked);
    }
  });
}

// Update preview
function updateAccessibilityPreview() {
  if (!elements.accessibilityPreview) return;

  const preview = elements.accessibilityPreview;
  const textSize = elements.textSize?.value || 100;
  const lineSpacing = elements.lineSpacing?.value || 150;

  preview.style.fontSize = `${textSize}%`;
  preview.style.lineHeight = `${lineSpacing / 100}`;

  const selectedTheme = document.querySelector('input[name="colorTheme"]:checked')?.value || 'normal';

  preview.className = 'preview-box';
  switch (selectedTheme) {
    case 'dark':
      preview.style.backgroundColor = '#111827';
      preview.style.color = '#f3f4f6';
      break;
    case 'yellow':
      preview.style.backgroundColor = '#000';
      preview.style.color = '#fbbf24';
      break;
    case 'blue':
      preview.style.backgroundColor = '#fff';
      preview.style.color = '#1d4ed8';
      preview.style.fontWeight = '700';
      break;
    default:
      preview.style.backgroundColor = '';
      preview.style.color = '';
      preview.style.fontWeight = 'normal';
  }
}

// Accessibility event listeners
[elements.textSize, elements.lineSpacing].forEach(el => {
  if (el) {
    el.addEventListener('input', () => {
      if (el === elements.textSize && elements.textSizeValue) {
        elements.textSizeValue.textContent = el.value + '%';
      }
      if (el === elements.lineSpacing && elements.lineSpacingValue) {
        elements.lineSpacingValue.textContent = el.value + '%';
      }
      updateAccessibilityPreview();
    });
  }
});

document.querySelectorAll('input[name="colorTheme"]').forEach(input => {
  input.addEventListener('change', updateAccessibilityPreview);
});

if (elements.saveAccessibility) {
  elements.saveAccessibility.addEventListener('click', () => {
    const settings = {
      accessibilityMode: elements.accessibilityMode.checked,
      textSize: elements.textSize?.value || 100,
      lineSpacing: elements.lineSpacing?.value || 150,
      showZoomButton: elements.showZoomButton?.checked || false,
      colorTheme: document.querySelector('input[name="colorTheme"]:checked')?.value || 'normal'
    };

    chrome.storage.sync.set({ accessibility: settings }, () => {
      showStatus('✅ تنظیمات دسترسی‌پذیری ذخیره شد');
      updateAllTabs('updateAccessibility', settings);
    });
  });
}

// Helper function to update all tabs
function updateAllTabs(action, settings) {
  chrome.tabs.query({ url: ["*://*.x.com/*", "*://*.twitter.com/*"] }, (tabs) => {
    tabs.forEach(tab => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { action, settings })
          .catch(() => {});
      }
    });
  });
}

// Load saved settings on page load
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(null, (result) => {
    // API Keys
    if (result.apiKey && elements.apiKey) {
      elements.apiKey.placeholder = 'API Key ذخیره شده است';
    }
    if (result.geminiApiKey && elements.geminiApiKey) {
      elements.geminiApiKey.placeholder = 'API Key ذخیره شده است';
    }

    // Font Settings
    if (result.fontWeight && elements.fontWeight) {
      elements.fontWeight.value = result.fontWeight;
      if (elements.fontWeightValue) elements.fontWeightValue.textContent = result.fontWeight;
      if (elements.fontPreview) elements.fontPreview.style.fontWeight = result.fontWeight;
    }
    if (elements.justifyText) {
      elements.justifyText.checked = result.justifyText !== false;
    }

    // Translation Settings
    if (elements.translateUI) {
      elements.translateUI.checked = result.translateUI === true;
    }
    if (elements.enableTranslation) {
      elements.enableTranslation.checked = result.enableTranslation === true;
    }
    if (elements.customPrompt) {
      elements.customPrompt.value = result.customPrompt || '';
    }

    // Security Settings
    if (elements.linkCheck) {
      elements.linkCheck.checked = result.linkCheck !== false;
    }

    // Accessibility Settings
    if (result.accessibility) {
      const acc = result.accessibility;
      if (elements.accessibilityMode) {
        elements.accessibilityMode.checked = acc.accessibilityMode || false;
        if (acc.accessibilityMode && elements.accessibilityOptions) {
          elements.accessibilityOptions.classList.add('show');
        }
      }
      if (elements.textSize) {
        elements.textSize.value = acc.textSize || 100;
        if (elements.textSizeValue) elements.textSizeValue.textContent = (acc.textSize || 100) + '%';
      }
      if (elements.lineSpacing) {
        elements.lineSpacing.value = acc.lineSpacing || 150;
        if (elements.lineSpacingValue) elements.lineSpacingValue.textContent = (acc.lineSpacing || 150) + '%';
      }
      if (elements.showZoomButton) elements.showZoomButton.checked = acc.showZoomButton || false;

      if (acc.colorTheme) {
        const themeInput = document.querySelector(`input[name="colorTheme"][value="${acc.colorTheme}"]`);
        if (themeInput) themeInput.checked = true;
      }
    }

    // About Stats
    if (result.stats) {
      if (elements.totalFixed) elements.totalFixed.textContent = result.stats.textsFixed || 0;
      if (elements.totalTranslated) elements.totalTranslated.textContent = result.stats.translationCount || 0;
      if (elements.totalChecked) elements.totalChecked.textContent = result.stats.linksChecked || 0;
    }

    updateAccessibilityPreview();
  });
});
