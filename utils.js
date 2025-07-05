const showToast = (message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = 'ptf-toast';
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '24px';
  toast.style.zIndex = '10000';
  toast.style.fontFamily = 'Vazir, Tahoma, sans-serif';
  toast.style.fontSize = '14px';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s';

  switch (type) {
    case 'error':
      toast.style.backgroundColor = '#dc2626';
      toast.style.color = 'white';
      break;
    case 'success':
      toast.style.backgroundColor = '#16a34a';
      toast.style.color = 'white';
      break;
    default:
      toast.style.backgroundColor = '#1d9bf0';
      toast.style.color = 'white';
  }

  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const handleError = (error, context) => {
  console.error(`Persian Text Fixer Error in ${context}:`, error);
  chrome.runtime.sendMessage({
    action: 'logError',
    error: {
      message: error.message,
      stack: error.stack,
      context: context
    }
  });
};