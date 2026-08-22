# 🌿 Botaniq | Green Directory

A modern, responsive, multi-language web application built with vanilla JavaScript, CSS3 glassmorphism, and dynamic JSON translation loading. Designed as a clean directory for flora, arboriculture, and professional outdoor power equipment.

https://app-test-4c928.web.app/?lang=nl

![Live Deployment](https://img.shields.io/badge/Status-Live%20on%20Firebase-orange?style=flat-square&logo=firebase)
![Languages Supported](https://img.shields.io/badge/Languages-EN%20%7C%20NL%20%7C%20PT%20%7C%20ES-brightgreen?style=flat-square)

---

## ✨ Features

* **Dynamic Multi-Language System (`i18n`)**: Asynchronously fetches modular JSON translation files without requiring full page reloads.
* **Seamless URL Routing**: Updates the browser address bar dynamically using the HTML5 `history.pushState()` API (e.g., `?lang=nl`, `?lang=pt`, `?lang=es`).
* **Glassmorphism UI & Animations**: Built from scratch using modern CSS3 keyframe animations, responsive grid layouts, and interactive UI states.
* **Browser History Support**: Fully supports native browser back and forward navigation using `popstate`.
* **Production-Ready Hosting**: Deployed securely on Firebase Hosting with static global CDN caching optimizations.

---

## 🗂️ Project Structure

```text
public/
├── css/
│   └── home.css             # Main styling, variables, grid layouts, and animations
├── languages/
│   ├── en/
│   │   └── home.json        # English translation dictionary
│   ├── nl/
│   │   └── home.json        # Dutch translation dictionary
│   ├── pt/
│   │   └── home.json        # Portuguese translation dictionary
│   └── es/
│       └── home.json        # Spanish translation dictionary
├── js/
│   └── app.js               # Translation fetcher, DOM renderer, and history state controller
├── index.html               # Main landing page markup with semantic i18n hooks
├── 404.html                 # Custom error fallback page
└── firebase.json            # Firebase hosting configuration
