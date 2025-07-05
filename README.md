<div align="center">

# 🌟 Persian Text Fixer for X (Twitter)

### بهبود نمایش متن فارسی در ایکس

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](https://github.com/yourusername/persian-text-fixer)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-brightgreen.svg)](https://chrome.google.com/webstore/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yourusername/persian-text-fixer/pulls)

[English](#english) | [فارسی](#persian)

<img src="screenshots/banner.png" alt="Persian Text Fixer Banner" width="800">

</div>

---

<div dir="rtl">

## <a name="persian"></a>🇮🇷 فارسی

### 📖 درباره افزونه

Persian Text Fixer یک افزونه قدرتمند برای مرورگر Chrome است که تجربه کاربری فارسی‌زبانان در X (Twitter) را بهبود می‌بخشد. این افزونه مشکلات نمایش متن فارسی را حل کرده و امکانات جدیدی اضافه می‌کند.

### ✨ ویژگی‌ها

- 🔤 **نمایش صحیح فونت فارسی** - با قابلیت تنظیم وزن فونت
- 📐 **Justify هوشمند** - تراز کردن متن‌های فارسی بدون تغییر اندازه متن‌های کوتاه
- 🌐 **ترجمه رابط کاربری** - ترجمه کامل منوها و دکمه‌ها به فارسی
- 🔒 **بررسی امنیت لینک‌ها** - با Google Safe Browsing API
- 🤖 **ترجمه توییت‌ها** - با استفاده از Gemini AI
- ♿ **حالت دسترسی‌پذیری** - تنظیم اندازه متن و فاصله خطوط
- 🎨 **تم‌های رنگی** - برای راحتی چشم در مطالعه طولانی

### 🚀 نصب

#### نصب از Chrome Web Store
1. به [صفحه افزونه در Chrome Web Store](#) بروید
2. روی "Add to Chrome" کلیک کنید
3. تأیید کنید و لذت ببرید!

#### نصب محلی (برای توسعه‌دهندگان)
```bash
# کلون کردن مخزن
git clone https://github.com/yourusername/persian-text-fixer.git

# وارد پوشه پروژه شوید
cd persian-text-fixer

1. Chrome را باز کنید و به `chrome://extensions` بروید
2. "Developer mode" را فعال کنید
3. "Load unpacked" را کلیک کنید
4. پوشه پروژه را انتخاب کنید

### ⚙️ تنظیمات

#### 🔑 API Keys مورد نیاز

برای استفاده کامل از امکانات افزونه، به API Key های زیر نیاز دارید:

1. **Google Safe Browsing API**
   - به [Google Cloud Console](https://console.cloud.google.com/) بروید
   - پروژه جدید بسازید
   - Safe Browsing API را فعال کنید
   - API Key بسازید

2. **Gemini API**
   - به [Google AI Studio](https://makersuite.google.com/app/apikey) بروید
   - API Key رایگان دریافت کنید

### 📱 نحوه استفاده

1. **تنظیمات فونت**: از منوی افزونه وزن فونت را تنظیم کنید
2. **ترجمه توییت**: روی دکمه ترجمه زیر هر توییت کلیک کنید
3. **بررسی لینک**: لینک‌های مشکوک با رنگ قرمز نمایش داده می‌شوند
4. **Justify متن**: به صورت خودکار برای متن‌های بلند فارسی اعمال می‌شود

### 🤝 مشارکت

مشارکت شما باعث بهبود این پروژه می‌شود! لطفاً:

1. پروژه را Fork کنید
2. Branch جدید بسازید (`git checkout -b feature/AmazingFeature`)
3. تغییرات را Commit کنید (`git commit -m 'Add some AmazingFeature'`)
4. Push کنید (`git push origin feature/AmazingFeature`)
5. Pull Request بسازید

### 🐛 گزارش باگ

اگر مشکلی پیدا کردید، لطفاً [Issue جدید](https://github.com/yourusername/persian-text-fixer/issues) بسازید.

</div>

---

## <a name="english"></a>🇬🇧 English

### 📖 About

Persian Text Fixer is a powerful Chrome extension that enhances the Persian-speaking user experience on X (Twitter). It fixes Persian text display issues and adds new features.

### ✨ Features

- 🔤 **Proper Persian Font Display** - With adjustable font weight
- 📐 **Smart Justify** - Aligns Persian texts without resizing short texts
- 🌐 **UI Translation** - Complete translation of menus and buttons to Persian
- 🔒 **Link Security Check** - Using Google Safe Browsing API
- 🤖 **Tweet Translation** - Using Gemini AI
- ♿ **Accessibility Mode** - Adjust text size and line spacing
- 🎨 **Color Themes** - For comfortable long reading sessions

### 🚀 Installation

#### Install from Chrome Web Store
1. Visit the [extension page on Chrome Web Store](#)
2. Click "Add to Chrome"
3. Confirm and enjoy!

#### Local Installation (for developers)
bash
# Clone the repository
git clone https://github.com/yourusername/persian-text-fixer.git

# Navigate to project directory
cd persian-text-fixer

1. Open Chrome and go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the project folder

### ⚙️ Configuration

#### 🔑 Required API Keys

To use all features, you need these API keys:

1. **Google Safe Browsing API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Safe Browsing API
   - Create an API Key

2. **Gemini API**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Get a free API Key

### 📱 Usage

1. **Font Settings**: Adjust font weight from the extension menu
2. **Tweet Translation**: Click the translate button under any tweet
3. **Link Check**: Suspicious links are displayed in red
4. **Text Justify**: Automatically applied to long Persian texts

### 🛠️ Technical Details


persian-text-fixer/
├── manifest.json         # Extension manifest
├── background.js         # Background script
├── content.js           # Main content script
├── text-fixer.js        # Persian text processing
├── translation.js       # Translation functionality
├── link-checker.js      # Security checking
├── accessibility.js     # Accessibility features
├── styles.css          # Main styles
├── popup.html          # Popup interface
├── options.html        # Settings page
└── icons/              # Extension icons

### 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

### 🙏 Acknowledgments

- Font: [Vazirmatn](https://github.com/rastikerdar/vazirmatn) by Saber Rastikerdar
- Icons: Custom designed for this extension
- Thanks to all contributors!

### 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/persian-text-fixer?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/persian-text-fixer?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/persian-text-fixer?style=social)

---

<div align="center">
Made with ❤️ for
