const translatedTweets = new WeakMap();

const createTranslateButton = (tweet) => {
  if (tweet.querySelector('.ptf-translate-container')) {
    return;
  }

  const actionGroup = tweet.querySelector('div[role="group"]');
  if (!actionGroup) return;

  const container = document.createElement('div');
  container.className = 'ptf-translate-container';
  container.style.display = 'inline-flex';
  container.style.alignItems = 'center';
  container.style.marginLeft = '8px';

  const button = document.createElement('button');
  button.className = 'ptf-translate-btn';
  button.title = 'ترجمه به فارسی';
  button.style.background = 'transparent';
  button.style.border = 'none';
  button.style.color = 'rgb(113, 118, 123)';
  button.style.padding = '8px';
  button.style.cursor = 'pointer';
  button.style.borderRadius = '50%';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.transition = 'all 0.2s';

  button.innerHTML = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
    </svg>
  `;

  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = 'rgba(29, 155, 240, 0.1)';
    button.style.color = 'rgb(29, 155, 240)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = 'transparent';
    button.style.color = 'rgb(113, 118, 123)';
  });

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    translateTweet(tweet, button);
  });

  container.appendChild(button);
  actionGroup.appendChild(container);
};

const translateTweet = async (tweet, button) => {
  const tweetText = tweet.querySelector('[data-testid="tweetText"]');
  if (!tweetText) return;

  const existingTranslation = translatedTweets.get(tweet);
  if (existingTranslation) {
    existingTranslation.remove();
    translatedTweets.delete(tweet);
    button.style.color = 'rgb(113, 118, 123)';
    return;
  }

  const originalText = tweetText.textContent.trim();
  if (!originalText) return;

  const originalIcon = button.innerHTML;
  button.innerHTML = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" class="ptf-spin">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0.3"/>
      <path d="M12 4c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8m0-2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
    </svg>
  `;
  button.disabled = true;

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'translate',
      text: originalText,
      targetLang: 'fa',
      customPrompt: ''
    });

    if (response.success) {
      const translationContainer = document.createElement('div');
      translationContainer.className = 'ptf-translation';
      translationContainer.style.marginTop = '12px';
      translationContainer.style.padding = '12px';
      translationContainer.style.backgroundColor = 'rgba(29, 155, 240, 0.1)';
      translationContainer.style.borderRadius = '12px';
      translationContainer.style.border = '1px solid rgba(29, 155, 240, 0.2)';
      translationContainer.style.direction = 'rtl';
      translationContainer.style.fontFamily = 'Vazir, Tahoma, sans-serif';
      translationContainer.style.fontSize = '15px';
      translationContainer.style.lineHeight = '1.6';

      const words = response.translation.split(' ');
      translationContainer.innerHTML = '';
      
      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.opacity = '0';
        span.style.animation = `fadeInWord 0.3s ease ${index * 0.05}s forwards`;
        translationContainer.appendChild(span);
      });

      tweetText.parentElement.appendChild(translationContainer);
      translatedTweets.set(tweet, translationContainer);
      button.style.color = 'rgb(29, 155, 240)';
    } else {
      showToast('خطا در ترجمه: ' + response.error, 'error');
    }
  } catch (error) {
    handleError(error, 'translateTweet');
    showToast('خطا در اتصال به سرویس ترجمه', 'error');
  } finally {
    button.innerHTML = originalIcon;
    button.disabled = false;
  }
};