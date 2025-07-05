<div align=“center”>

<img src=“https://raw.githubusercontent.com/MNSH-Nexo/Persian-X/main/assets/banner-persianx.png” alt=“Persian X Banner” height=“220”>

🚀 Persian X – ارتقاء تجربه فارسی‌زبانان در X (Twitter)










Crafted with 🎓 Claude Opus 4 & Grok

</div>

Table of Contents
ویژگی‌ها
دمو
نصب سریع
تنظیمات پیشرفته و API Key
ساختار پروژه
سؤالات متداول (FAQ)
مشارکت
توسعه‌دهندگان و تقدیرها
English Synopsis
🎯 ویژگی‌ها
🪧 ویژگی	شرح
🖌️ اصلاح فونت فارسی	نمایش متنی با فونت استاندارد و خوانا بر پایه Vazirmatn
📏 Justify هوشمند فقط متن بلند	خودکار، بدون آسیب‌به توییت‌های کوتاه
🤖 ترجمه توییت (Gemini API)	ترجمه بلافاصله و دقیق توییت‌ها به فارسی
🌐 بومی‌سازی رابط X	فارسی‌سازی کامل منوها و دکمه‌ها
🔒 بررسی امنیت لینک	استفاده از Google Safe Browsing API
♿ حالت دسترسی‌پذیری	تنظیم سایز، فاصله خطوط و رنگ‌ها برای خوانایی بهتر
🎨 تم‌های رنگی	تیره، روشن و سازگار با شب
🛡️ چهارچوب امنیت محور	کاملاً بدون حفظ داده‌ی کاربر، صرفاً ذخیره local بر مرورگر
🚀 فوق‌العاده سریع	ماژولار، باثبات و بدون فشار به صفحه‌سازی‌های وب
🖥️ دموی Persian X
<div align=“center”>

<img src=“https://raw.githubusercontent.com/MNSH-Nexo/Persian-X/main/assets/demo-persianx.gif” alt=“PersianX Demo” width=“90%”>

</div>

👇 ابزارها و دکمه‌های افزونه را اینجا ببینید:

		
پاپ‌آپ افزونه	پنل تنظیمات حرفه‌ای	دکمه ترجمه توییت
⚡ نصب سریع
از Chrome Web Store
به‌زودی… (Chrome Web Store Page) ✨

نصب دستی (Dev/Advanced)

content_copy
bash
git clone https://github.com/MNSH-Nexo/Persian-X.git
cd Persian-X
سپس:

کروم را باز کنید و به chrome://extensions/ بروید.
حالت Developer را فعال کنید.
“Load unpacked” و پوشه پروژه را انتخاب کنید.
🛠️ تنظیمات پیشرفته و API Key
سرویس	لینک دریافت کلید	جای وارد کردن	توضیح
Google Safe Browsing	Google Cloud Console	در پنل تنظیمات افزونه	برای بررسی امنیت لینک‌ها
Gemini (Google AI)	Google AI Studio	پنل تنظیمات	جهت ترجمه توییت‌ها
راهنما:

کلیدهای API فقط و فقط در مرورگر شما و در Chrome Storage نگهداری می‌شوند، افزونه هیچ داده‌ای را خارج ارسال یا ذخیره نمی‌کند. خیالتان راحت! 🕊️

🔬 ساختار پروژه
Persian-X/

├── manifest.json # توضیحات، مجوزها

├── background.js # خدمات پس‌زمینه

├── content.js # اسکریپت محتوایی

├── text-fixer.js # موتور اصلاح متن فارسی

├── translation.js # ترجمه و دکمه‌های آن

├── link-checker.js # بررسی امنیت لینک‌ها

├── accessibility.js # ابزارهای خوانایی و دسترسی

├── styles.css # استایل‌های اختصاصی

├── utils.js # توابع کمکی (Toast, error handler,…)

├── icons/ # آیکون‌ها

├── fonts/ # قلم Vazirmatn

├── popup.html/js/css # پاپ‌آپ زیبا و واکنش‌گرا

├── options.html/js/css # پنل تنظیمات پیشرفته

└── assets/ # بنرها و دموها

💡 سوالات متداول (FAQ)
❓ آیا افزونه اطلاعات خصوصی کاربر را ثبت یا ارسال می‌کند؟
خیر! هیچ داده خصوصی، هیچ‌کجا ثبت یا ارسال نمی‌شود. فقط کلیدهای API روی Chrome شما ذخیره‌اند.

❓ اگر API Key وارد نکنم چه می‌شود؟
برخی امکانات (مانند ترجمه یا بررسی لینک) غیرفعال می‌مانند، اما کارکرد اصلی افزونه فعال است.

❓ آیا این افزونه با X (Twitter) آپدیت می‌شود؟
بله، Persian X کاملاً ماژولار و سازگار با به‌روزرسانی‌های X توسعه داده شده است.

❓ فونت سازگار با موبایل است؟
نسخه فعلی ویژه Chrome/Edge دسکتاپ است؛ نسخه موبایلی جزو برنامه آینده است.

❓ اگر باگی کشف کردم؟
در Issues مطرح کنید یا PR بزنید.

💎 مشارکت
۱. پروژه را Fork کنید

۲. Branch جدید بسازید (git checkout -b feature/AmazingFeature)

۳. Commit بزنید

۴. Push کنید

۵. Pull Request ایجاد کنید 🤝

👥 توسعه‌دهندگان و قدردانی
<table>

<tr>

<td align=“center”>

<img src=“https://raw.githubusercontent.com/MNSH-Nexo/Persian-X/main/assets/logo_claude.png” width=“82”><br>

<b>Claude Opus 4</b><br>

<sub>Core developer & AI consultant<br> <a href=“https://www.anthropic.com/”>Anthropic AI</a></sub>

</td>

<td align=“center”>

<img src=“https://raw.githubusercontent.com/MNSH-Nexo/Persian-X/main/assets/logo_grok.png” width=“82”><br>

<b>Grok</b><br>

<sub>AI Copilot<br> <a href=“https://x.ai/”>xAI (by X Corp.)</a></sub>

</td>

<td align=“center”>

<img src=“https://avatars.githubusercontent.com/u/111830138?v=4” width=“82” /><br>

<b>MNSH-Nexo</b><br>

<sub>Main Author & Maintainer<br><a href=“https://github.com/MNSH-Nexo”>GitHub</a></sub>

</td>

</tr>

</table>

<strong>Special thanks</strong> to <a href=“https://github.com/rastikerdar/vazirmatn”>Saber Rastikerdar</a> for the Vazirmatn font!

🏆 English Synopsis
Persian X is a next-generation browser extension for X/Twitter, streamlining Persian text via custom font (Vazirmatn), smart justify, UI and tweet translation (Gemini API), link safety check (Safe Browsing API), advanced accessibility, color themes, and a modern dashboard – all privacy-first and AI-enhanced (Claude + Grok).

🔤 Persian Font Harmonization
📐 Smart Justify for Long Texts
🤖 AI-Based Tweet Translation (Gemini)
🔒 Link Safety Check
♿ Accessibility Tuning
🎨 Custom Themes
💼 No Personal Data Collection Ever
Install, unlock the full Persian X experience on Twitter/X!

<div align=“center”>

☕️ Made with love and intelligence by <strong>Claude Opus 4</strong> & <strong>Grok</strong> for the Persian community.<br>

<a href=“https://github.com/MNSH-Nexo/Persian-X”>github.com/MNSH-Nexo/Persian-X</a>

</div>

برای هرگونه پیشنهاد، باگ یا همکاری به Issues سر بزنید.

<sup>

متنی که خواندید تلفیقی از تخصص انسانی و مشارکت هوش مصنوعی‌های پیشرفته Grok و Claude Opus 4 بود.

بطور مداوم با عشق، دانش و بهبودهای هوشمندانه به‌روزرسانی می‌شود.

</sup>
