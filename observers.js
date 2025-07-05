const observeDOM = (callback) => {
  const observer = new MutationObserver((mutations) => {
    let shouldImprove = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.querySelector && (
                node.querySelector('[data-testid="tweetText"]') ||
                node.querySelector('article') ||
                node.matches('[data-testid="tweetText"]'))) {
              shouldImprove = true;
            }
          }
        });
      }
    });

    if (shouldImprove) {
      callback();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

const observeURLChanges = (callback) => {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(() => {
        callback();
      }, 1000);
    }
  }).observe(document, { subtree: true, childList: true });
};

const observeScroll = (callback) => {
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      callback();
    }, 500);
  }, { passive: true });
};

const handleTwitterModals = () => {
  const modals = document.querySelectorAll('[role="dialog"]');
  modals.forEach(modal => {
    const tweets = modal.querySelectorAll('article');
    tweets.forEach(processArticle);
  });
};