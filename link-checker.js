const linkCache = {};

const applyLinkStatus = (link, status, error) => {
  link.classList.remove('unsafe-link', 'suspicious-link', 'safe-link', 'failed-link');

  switch (status) {
    case 'unsafe':
      link.classList.add('unsafe-link');
      link.title = 'لینک خطرناک: این لینک توسط Google Safe Browsing مخرب شناخته شده است.';
      break;
    case 'suspicious':
      link.classList.add('suspicious-link');
      link.title = 'لینک مشکوک: این لینک ممکن است امن نباشد.';
      break;
    case 'safe':
      link.classList.add('safe-link');
      link.title = 'لینک امن: این لینک توسط Google Safe Browsing بررسی شده است.';
      break;
    case 'failed':
      link.classList.add('failed-link');
      link.title = `خطا در بررسی لینک: ${error || 'دلیل نامشخص'}`;
      break;
  }

  link.addEventListener('mouseenter', () => {
    link.style.pointerEvents = 'auto';
  });
};

const getRedirectedUrl = (url, callback) => {
  chrome.runtime.sendMessage({ action: 'resolveUrl', url: url }, (response) => {
    callback(response);
  });
};

const checkLinkSafety = (link) => {
  const url = link.href;

  if (linkCache[url]) {
    const { status, error } = linkCache[url];
    applyLinkStatus(link, status, error);
    return;
  }

  if (url.startsWith('https://t.co/')) {
    getRedirectedUrl(url, (response) => {
      if (response && response.finalUrl) {
        chrome.runtime.sendMessage({ action: 'checkUrl', url: response.finalUrl }, (apiResponse) => {
          linkCache[url] = { status: apiResponse.status, error: apiResponse.error };
          applyLinkStatus(link, apiResponse.status, apiResponse.error);
        });
      } else {
        linkCache[url] = { status: 'failed', error: 'Could not resolve t.co link' };
        applyLinkStatus(link, 'failed', 'Could not resolve t.co link');
      }
    });
  } else {
    chrome.runtime.sendMessage({ action: 'checkUrl', url: url }, (response) => {
      linkCache[url] = { status: response.status, error: response.error };
      applyLinkStatus(link, response.status, response.error);
    });
  }
};