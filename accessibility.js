let accessibilitySettings = {
  enabled: false,
  fontSize: 100,
  lineHeight: 150,
  colorTheme: 'normal',
  showMagnifier: false
};

const createAccessibilityStyles = () => {
  if (document.getElementById('ptf-accessibility-styles')) return;

  const style = document.createElement('style');
  style.id = 'ptf-accessibility-styles';
  style.innerHTML = `
    .ptf-accessibility-enabled [data-testid="tweetText"] {
      display: block !important;
      visibility: visible !important;
      font-size: var(--acc-font-size, 100%) !important;
      line-height: var(--acc-line-height, 1.5) !important;
    }
    .ptf-theme-dark {
      background-color: #121212 !important;
      color: #ffffff !important;
      padding: 10px !important;
      margin: 5px -10px !important;
      border-radius: 8px !important;
    }
    .ptf-theme-yellow {
      background-color: #fdf6e3 !important;
      color: #4d4b44 !important;
      padding: 10px !important;
      margin: 5px -10px !important;
      border-radius: 8px !important;
    }
    .ptf-theme-blue {
      background-color: #eef5fa !important;
      color: #1c2c3e !important;
      padding: 10px !important;
      margin: 5px -10px !important;
      border-radius: 8px !important;
    }
    .ptf-magnifier-container {
      display: flex !important;
      align-items: center !important;
      margin-left: 4px !important;
      margin-right: 4px !important;
    }
    .ptf-magnifier-btn {
      background: transparent !important;
      border: none !important;
      color: rgb(83, 100, 113) !important;
      padding: 8px !important;
      cursor: pointer !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: background-color 0.2s, color 0.2s !important;
    }
    .ptf-magnifier-btn svg {
      width: 18px !important;
      height: 18px !important;
    }
    .ptf-magnifier-btn:hover {
      background-color: rgba(29, 155, 240, 0.1) !important;
      color: rgb(29, 155, 240) !important;
    }
    .ptf-magnified-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: rgba(0, 0, 0, 0.8) !important;
      z-index: 10000 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      animation: fadeIn 0.3s ease !important;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .ptf-magnified-content {
      position: relative !important;
      max-width: 600px !important;
      width: 90% !important;
      max-height: 80% !important;
      background-color: var(--magnified-bg-color, #ffffff) !important;
      color: var(--text-color, #0f1419) !important;
      border-radius: 16px !important;
      padding: 20px !important;
      overflow-y: auto !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
      animation: slideUp 0.4s ease !important;
    }
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .ptf-magnified-content [data-testid="tweetText"] {
      font-size: 130% !important;
      line-height: 1.8 !important;
      letter-spacing: 0.02em !important;
    }
    .ptf-magnified-content img,
    .ptf-magnified-content video {
      max-width: 100% !important;
      height: auto !important;
      margin: 15px 0 !important;
      border-radius: 12px !important;
    }
    .ptf-magnified-close {
      position: absolute !important;
      top: 15px !important;
      right: 15px !important;
      width: 40px !important;
      height: 40px !important;
      border: none !important;
      background: rgba(255, 255, 255, 0.1) !important;
      color: #fff !important;
      font-size: 24px !important;
      border-radius: 50% !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.2s ease !important;
      backdrop-filter: blur(10px) !important;
    }
    .ptf-magnified-close:hover {
      background: rgba(255, 255, 255, 0.2) !important;
      transform: scale(1.1) !important;
    }
    body.has-magnified-tweet {
      overflow: hidden;
    }
    article {
      contain: layout style paint;
    }
  `;
  document.head.appendChild(style);
};

const createMagnifierButton = (tweet) => {
  if (tweet.querySelector('.ptf-magnifier-container')) return;

  const actionGroup = tweet.querySelector('div[role="group"]');
  if (!actionGroup) return;

  const container = document.createElement('div');
  container.className = 'ptf-magnifier-container';

  const button = document.createElement('button');
  button.className = 'ptf-magnifier-btn';
  button.title = 'بزرگنمایی توییت';
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="r-1nao33i r-4qtqp9 r-yyyyoo r-16y2uox r-8kz0gk r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp"><g><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.83-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.432 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path></g></svg>';

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    createMagnifiedView(tweet);
  });

  container.appendChild(button);
  actionGroup.appendChild(container);
};

const createMagnifiedView = (tweet) => {
  const scrollPosition = window.pageYOffset;

  const tweetId = tweet.getAttribute('data-tweet-id') ||
                  tweet.querySelector('[data-tweet-id]')?.getAttribute('data-tweet-id') ||
                  tweet.getAttribute('aria-labelledby') ||
                  `tweet-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const tweetText = tweet.querySelector('[data-testid="tweetText"]')?.textContent?.trim();
  const tweetAuthor = tweet.querySelector('[data-testid="User-Name"]')?.textContent?.trim();

  const tweetRect = tweet.getBoundingClientRect();
  const viewportOffset = {
    fromTop: tweetRect.top,
    fromCenter: tweetRect.top + (tweetRect.height / 2) - (window.innerHeight / 2)
  };

  tweet.setAttribute('data-ptf-magnify-id', tweetId);

  const overlay = document.createElement('div');
  overlay.className = 'ptf-magnified-overlay';

  const content = document.createElement('div');
  content.className = 'ptf-magnified-content';

  const clonedTweet = tweet.cloneNode(true);
  
  clonedTweet.querySelectorAll('.ptf-translate-container, .ptf-magnifier-container, .ptf-translated-text').forEach(el => el.remove());

  const isDarkMode = document.documentElement.classList.contains('dark') || 
                     window.getComputedStyle(document.body).backgroundColor.includes('0, 0, 0');
  
  if (isDarkMode) {
    content.style.setProperty('--magnified-bg-color', '#1a1a1a');
    content.style.setProperty('--text-color', '#e8e8e8');
  } else {
    content.style.setProperty('--magnified-bg-color', '#ffffff');
    content.style.setProperty('--text-color', '#0f1419');
  }

  content.appendChild(clonedTweet);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'ptf-magnified-close';
  closeBtn.innerHTML = '✕';
  closeBtn.onclick = () => {
    overlay.remove();
    document.body.classList.remove('has-magnified-tweet');
    
    const targetPosition = window.pageYOffset + viewportOffset.fromCenter;
    const currentPosition = window.pageYOffset;
    const distance = Math.abs(targetPosition - currentPosition);
    
    if (distance > 100) {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        const originalTweet = document.querySelector(`[data-ptf-magnify-id="${tweetId}"]`);
        if (originalTweet) {
          if (!document.getElementById('ptf-highlight-style')) {
            const highlightStyle = document.createElement('style');
            highlightStyle.id = 'ptf-highlight-style';
            highlightStyle.innerHTML = `
              @keyframes ptf-highlight {
                0%, 100% { outline: 2px solid transparent; }
                25%, 75% { outline: 2px solid #1d9bf0; }
                50% { outline: 4px solid #1d9bf0; }
              }
              .ptf-highlight {
                animation: ptf-highlight 2s ease-in-out;
                outline-offset: 4px;
                border-radius: 16px;
              }
            `;
            document.head.appendChild(highlightStyle);
          }
          
          originalTweet.classList.add('ptf-highlight');
          setTimeout(() => {
            originalTweet.classList.remove('ptf-highlight');
            originalTweet.removeAttribute('data-ptf-magnify-id');
          }, 2000);
        }
      }, 600);
    }
  };

  content.appendChild(closeBtn);
  overlay.appendChild(content);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeBtn.click();
    }
  });

  document.addEventListener('keydown', function handleEsc(e) {
    if (e.key === 'Escape' && document.querySelector('.ptf-magnified-overlay')) {
      closeBtn.click();
      document.removeEventListener('keydown', handleEsc);
    }
  });

  document.body.appendChild(overlay);
  document.body.classList.add('has-magnified-tweet');
};

const applyAccessibilitySettings = (settings) => {
  if (!settings) return;

  const body = document.body;

  if (settings.enabled || settings.accessibilityMode) {
    body.classList.add('ptf-accessibility-enabled');
    body.style.setProperty('--acc-font-size', `${settings.fontSize || settings.textSize || 100}%`);
    body.style.setProperty('--acc-line-height', (settings.lineHeight || settings.lineSpacing || 150) / 100);

    body.classList.remove('ptf-theme-dark', 'ptf-theme-yellow', 'ptf-theme-blue');
    if (settings.colorTheme !== 'normal') {
      body.classList.add(`ptf-theme-${settings.colorTheme}`);
    }
  } else {
    body.classList.remove('ptf-accessibility-enabled', 'ptf-theme-dark', 'ptf-theme-yellow', 'ptf-theme-blue');
    body.style.removeProperty('--acc-font-size');
    body.style.removeProperty('--acc-line-height');
  }

  accessibilitySettings = {
    ...accessibilitySettings,
    ...settings
  };
};
