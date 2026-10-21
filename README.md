# MUSAFIR — Islamic Lifestyle E-commerce

> **Faith • Remembrance • Purpose**
> Premium Islamic Lifestyle Products & Modern Deen Essentials.

[![Live Demo](https://img.shields.io/badge/Status-Active-gold.svg)](https://musafir-a3772.firebaseapp.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📖 Overview

**MUSAFIR** is a modern, responsive, dual-language (Bangla & English) Islamic lifestyle e-commerce platform. Designed with an aesthetic of Midnight Navy (`#081018`), Warm Parchment (`#FCFBF7`), and Antique Gold (`#D6A63A`), it delivers a serene and spiritually inspiring shopping experience.

---

## ✨ Features

- **Dual Language Support (বাংলা & English)**: One-click instant toggle across all product titles, categories, descriptions, specifications, cart, and notifications.
- **Dynamic Catalog & Category Filtering**: Browse Quran & Tafsir, Prayer Essentials, Islamic Home Decor, Books & Learning, Gifts & Hampers, and Accessories.
- **Interactive Multi-Image Gallery**: Product details page with dynamic thumbnail switching, zoom hover, and full responsive preview.
- **Inventory & Stock Management**:
  - Stock quantity tracking.
  - Real-time stock badge (`স্টকে আছে` / `স্টক শেষ`).
  - Out-of-stock overlay, cart lock, and automatic transition to WhatsApp Pre-order.
- **One-Click WhatsApp Ordering**: Form-assisted direct WhatsApp order generation with delivery calculations (Inside/Outside Dhaka).
- **Admin Management Panel (`admin.html`)**:
  - Complete product CRUD with multi-image gallery uploaders (5, 6, 10+ photos).
  - Category manager with custom image & icon editing.
  - Instant 1-click popular status & stock status toggling.
  - Key product highlights/bullet points input with gold checkmarks on storefront.
  - **1-Click Firebase Cloud Sync**: Push all local catalog data into Cloud Firestore.
- **Firebase Authentication & Firestore Ready**:
  - Google Sign-In with popup (`signInWithPopup`).
  - Email & Password Sign-In & Registration (`createUserWithEmailAndPassword`).
  - Password Reset (`sendPasswordResetEmail`).
  - Cloud Firestore integration with zero-latency LocalStorage fallback.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+ Modules & Compat)
- **Styling**: Tailwind CSS via CDN + Custom Typography (`Cormorant Garamond`, `Inter`, `Hind Siliguri`)
- **Backend / Cloud Services**: Firebase (Authentication, Cloud Firestore, Analytics)
- **Offline / Local Cache**: LocalStorage Abstraction (`MusafirDB`)
- **Direct Checkout**: WhatsApp Business API Integration

---

## 🚀 Getting Started

### Local Development
Open any of the HTML files directly in your browser or run a lightweight local server:

```bash
# Using Python
python -m http.server 8080

# Or using Node.js (npx)
npx serve .
```

Visit `http://localhost:8080` in your web browser.

---

## 🌐 Official Links

- **Facebook**: [facebook.com/profile.php?id=61564925019564](https://www.facebook.com/profile.php?id=61564925019564)
- **Instagram**: [@musafir.zh](https://www.instagram.com/musafir.zh)

---

## 📄 License

Developed with Barakah by **MD. Ziaul Hasan**. All rights reserved © 2025–2026.
