<div align="center">

# 🧰 UseKit
### *Everyday Tools. All in One Place.*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=github-actions)](https://usekit-daily.vercel.app)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-purple?style=for-the-badge)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

**[Explore Live Demo](https://usekit-daily.vercel.app)** • **[Browse All 90 Tools](#-all-90-built-in-tools)** • **[Architecture](#%EF%B8%8F-architecture--project-structure)** • **[Quick Start](#-quick-start)** • **[Deployment](#-deployment-guide)** • **[Contributing Guide](#-contributing)**

<p align="center">
  <img src="https://usekit-daily.vercel.app/api/og?title=UseKit&subtitle=All%20Your%20Everyday%20Tools%20in%20One%20Place" alt="UseKit Banner" width="800" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" />
</p>

</div>

---

## 📖 Overview

**UseKit** is a professional, open-source All-in-One Utility Tools web platform featuring **90 browser-based tools** across 10 distinct categories. 

Unlike conventional utility websites that send confidential PDF documents, company financial numbers, or personal photos to remote cloud servers for conversion, UseKit performs all heavy data transformations **100% locally on the client device** using modern Web APIs (HTML5 Canvas, WebAssembly, Web Crypto, and Web Workers).

Whether you need to calculate loan EMIs, convert photos to an exact `50KB` limit for government job portals, merge confidential legal contracts, format minified JSON payloads, or inspect time zones across global teams, UseKit provides a distraction-free, zero-latency experience with zero account sign-up requirements.

---

## ✨ Key Features

- **🔒 100% Client-Side Privacy**: Image compression, PDF splitting/merging, and cryptographic password generation execute entirely inside your browser tab via HTML5 Canvas, Web Crypto, and WebAssembly (`pdf-lib`, `pdfjs-dist`). **Your files and calculations never leave your device.**
- **🚀 90 Production-Grade Tools**: A complete suite of financial calculators, document utilities, developer formatters, security tools, and everyday converters.
- **🎯 Image KB Converter**: Convert and compress images to **exact target file sizes** (e.g. under `20KB`, `50KB`, `100KB`, `200KB`, `500KB`) using an intelligent binary search quality optimization engine tailored for government, university, and job upload portals.
- **🌐 Advanced Technical SEO**:
  - Full server-side rendering of `<title>`, `<meta description>`, canonical links, and OpenGraph/Twitter social cards.
  - Dynamic `sitemap.xml` with automatic `lastmod` timestamps for all 90 tools, 10 categories, and legal pages.
  - Programmatic OpenGraph card generation via `/api/og`.
  - Rich Schema.org JSON-LD microdata (`WebApplication`, `FAQPage`, `BreadcrumbList`, `WebSite`, `Organization`).
  - Native `/robots.txt` and first-party `/api/ip` header inspection without third-party tracking cookies.
- **📱 Progressive Web App (PWA)**: Compliant with PWA standards—installable on mobile and desktop devices with complete offline readiness via Workbox service worker caching.
- **⚡ Keyboard Command Palette**: Global fuzzy search across all 90 tools accessible instantly via `⌘K` (Mac) or `Ctrl+K` (Windows/Linux).
- **🌗 Dark / Light Mode**: High-contrast, accessibility-tested theme switcher with automatic system preference detection and local storage persistence.
- **🔗 Social Sharing & Persistence**: One-click Copy Link, WhatsApp, and Telegram share actions with URL query state persistence (`syncQueryParams`).

---

## 📂 All 90 Built-in Tools

<details open>
<summary><b>1. Calculators (19 Tools)</b></summary>
<br>

| Tool Name | Route | Highlights |
| :--- | :--- | :--- |
| **Age Calculator** | `/age-calculator` | Exact chronological age in years, months, days, hours, and next birthday countdown |
| **BMI Calculator** | `/bmi-calculator` | Metric & Imperial BMI, WHO classifications, ideal healthy weight range, BMI Prime |
| **Percentage Calculator** | `/percentage-calculator` | 4 modes: % of a number, percentage increase/decrease, what % is X of Y, add/sub % |
| **Discount Calculator** | `/discount-calculator` | Single & stacked double discounts (e.g. 30% + 15% off) with sales tax calculations |
| **GST Calculator** | `/gst-calculator` | Add GST (Exclusive) or remove GST (Inclusive) with CGST, SGST, and IGST breakdowns |
| **EMI Calculator** | `/emi-calculator` | Reducing balance loan EMI with interactive principal vs. interest amortization table |
| **Loan Calculator** | `/loan-calculator` | Loan affordability solver and extra monthly prepayment interest-savings engine |
| **Simple Interest Calculator** | `/simple-interest-calculator` | Linear `I = P × R × T / 100` calculator supporting days, months, and fractional years |
| **Compound Interest Calculator** | `/compound-interest-calculator` | Daily/Monthly/Quarterly/Annual compounding with recurring monthly contributions |
| **Profit & Loss Calculator** | `/profit-and-loss-calculator` | Cost price, selling price, gross profit, margin %, and markup % calculations |
| **Salary Calculator** | `/salary-calculator` | Annual, monthly, bi-weekly, weekly, and hourly pay conversions with tax deductions |
| **Tip Calculator** | `/tip-calculator` | Bill tip calculator with instant bill splitting by number of people |
| **Date Difference Calculator** | `/date-difference-calculator` | Exact calendar interval in total days, weeks, months, weekdays, and weekend days |
| **Time Calculator** | `/time-calculator` | Add, subtract, and sum hours, minutes, and seconds for timesheets and logs |
| **Unit Converter** | `/unit-converter` | 7 physical & digital domains: Length, Weight, Temp, Area, Volume, Speed, Data |
| **SIP Calculator** | `/sip-calculator` | Systematic Investment Plan future wealth gain and annuity-due maturity projector |
| **FD Calculator** | `/fd-calculator` | Bank Fixed Deposit maturity value with quarterly compounding |
| **RD Calculator** | `/rd-calculator` | Recurring monthly bank deposit interest and total maturity returns |
| **Income Tax Estimator** | `/income-tax-estimator` | India New/Old tax slabs and US Federal brackets with take-home pay analysis |

</details>

<details>
<summary><b>2. Image Tools (10 Tools)</b></summary>
<br>

| Tool Name | Route | Highlights |
| :--- | :--- | :--- |
| **Image Compressor & KB Converter** | `/image-compressor` | Target exact KB size (20KB, 50KB, 100KB, 200KB presets) with binary search auto-tune |
| **Image Resizer** | `/image-resizer` | Resize to exact pixel dimensions with aspect ratio lock and Bicubic canvas smoothing |
| **Image Cropper** | `/image-cropper` | 1:1 Square, 16:9 Widescreen, 4:3 presets and coordinate sliders with lossless PNG export |
| **JPG to PNG** | `/jpg-to-png` | Convert lossy JPEG photos to lossless PNG format in browser memory |
| **PNG to JPG** | `/png-to-jpg` | Flatten PNGs onto a clean white background and compress to standard JPEG |
| **PNG to WebP** | `/png-to-webp` | Modern next-gen WebP converter preserving alpha channel transparency |
| **WebP to JPG** | `/webp-to-jpg` | Convert downloaded `.webp` images to universally compatible `.jpg` files |
| **Image to PDF** | `/image-to-pdf` | Reorder multiple JPG/PNG/WebP images and combine them into a single PDF |
| **Image Rotator** | `/image-rotator` | Rotate photos 90° clockwise, 180°, or 270° and permanently re-encode orientation |
| **Image Flipper** | `/image-flipper` | Mirror images horizontally or vertically to fix reversed selfie text |

</details>

<details>
<summary><b>3. PDF Tools (7 Tools)</b></summary>
<br>

| Tool Name | Route | Highlights |
| :--- | :--- | :--- |
| **PDF Merger** | `/pdf-merger` | Combine multiple PDF documents locally via `pdf-lib` with zero server uploads |
| **PDF Splitter** | `/pdf-splitter` | Extract and split custom page ranges (e.g., `1-3, 5, 8-10`) into a new PDF |
| **PDF Compressor** | `/pdf-compressor` | Optimize cross-reference tables into compressed object streams and strip metadata |
| **PDF to JPG** | `/pdf-to-jpg` | High-DPI rasterization of PDF pages into downloadable JPEG images |
| **PDF Page Rotator** | `/pdf-page-rotator` | Update PDF page rotation flags permanently by 90°, 180°, or 270° |
| **PDF Page Extractor** | `/pdf-page-extractor` | Interactive visual grid to click and extract specific pages |
| **PDF Metadata Viewer** | `/pdf-metadata-viewer` | Inspect hidden Author, Creator, Producer, and timestamps |

</details>

<details>
<summary><b>4. Text Tools (9 Tools)</b></summary>
<br>

| Tool Name | Route | Highlights |
| :--- | :--- | :--- |
| **Word Counter** | `/word-counter` | Words, characters, sentences, paragraphs, reading time (225 WPM), speaking time (130 WPM) |
| **Character Counter** | `/character-counter` | Live length gauges for X/Twitter (280), SMS (160), and SEO Titles (60 chars) |
| **Case Converter** | `/case-converter` | UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case |
| **Text Reverser** | `/text-reverser` | Reverse string characters, reverse word order, or flip letters within each word |
| **Remove Duplicate Lines** | `/remove-duplicate-lines` | O(n) list deduplication with case-sensitivity and whitespace trimming toggles |
| **Text Cleaner** | `/text-cleaner` | Strip HTML tags, collapse multiple spaces, and remove empty lines |
| **Text to Slug** | `/text-to-slug` | Unicode NFKD transliteration for clean, hyphen-separated SEO permalinks |
| **Lorem Ipsum Generator** | `/lorem-ipsum-generator` | Custom dummy placeholder copy by paragraphs, sentences, or exact word counts |
| **Text Sorter** | `/text-sorter` | Alphabetical (A–Z, Z–A), numerical value, line length, or random shuffle |

</details>

<details>
<summary><b>5. Developer Tools (9 Tools)</b></summary>
<br>

| Tool Name | Route | Highlights |
| :--- | :--- | :--- |
| **JSON Formatter + Validator** | `/json-formatter` | Beautify (2 or 4 spaces), minify, and detect exact syntax error line numbers |
| **HTML Formatter** | `/html-formatter` | Pretty-print and indent messy or minified HTML markup cleanly |
| **CSS Minifier** | `/css-minifier` | Strip comments and whitespace to optimize stylesheet delivery |
| **JavaScript Minifier** | `/javascript-minifier` | Compact JS code and mangle local identifiers for production snippets |
| **Base64 Encoder/Decoder** | `/base64-encoder-decoder` | UTF-8 byte stream conversion supporting international characters and emojis |
| **URL Encoder/Decoder** | `/url-encoder-decoder` | `encodeURIComponent` / `decodeURIComponent` for safe query parameter handling |
| **HTML Entity Encoder/Decoder** | `/html-entity-encoder-decoder` | Escape `<`, `>`, `&`, `"`, `'` to prevent XSS in documentation snippets |
| **UUID Generator** | `/uuid-generator` | Cryptographically uniform RFC 4122 v4 UUIDs via `crypto.randomUUID()` |
| **Regex Tester** | `/regex-tester` | Real-time JavaScript `RegExp` matching with capture group breakdown |

</details>

<details>
<summary><b>6. Security & Internet (8 Tools)</b></summary>
<br>

| Tool Name | Route | Highlights |
| :--- | :--- | :--- |
| **Password Generator** | `/password-generator` | Hardware-backed Web Crypto RNG with live Shannon entropy calculation |
| **Password Strength Checker** | `/password-strength-checker` | Entropy auditing and offline GPU brute-force crack time estimation |
| **QR Code Generator** | `/qr-code-generator` | High-res customizable QR codes for links, text, and Wi-Fi credentials |
| **QR Code Reader** | `/qr-code-reader` | Decode QR codes directly from image uploads/screenshots via `jsQR` |
| **Barcode Generator** | `/barcode-generator` | Vector SVG barcodes (CODE128, EAN-13, UPC-A, CODE39) with print scaling |
| **URL Parser** | `/url-parser` | Decompose URL protocols, hosts, ports, paths, hashes, and query tables |
| **IP Address Info** | `/ip-address-info` | First-party edge header inspector (`x-forwarded-for`, country, city, timezone) |
| **User Agent Viewer** | `/user-agent-viewer` | Browser engine, OS platform, screen resolution, viewport, and CPU cores |

</details>

<details>
<summary><b>7. Color & Design (6 Tools)</b></summary>
<br>

| Tool Name | Route | Highlights |
| :--- | :--- | :--- |
| **Color Picker** | `/color-picker` | HEX, RGB, HSL conversions plus automatic 9-step tint and shade ramp generator |
| **HEX to RGB** | `/hex-to-rgb` | 3-digit and 6-digit hex converter with live opacity slider for `rgba()` |
| **RGB to HEX** | `/rgb-to-hex` | Slider-based channel mixer exporting uppercase `#RRGGBB` strings |
| **Gradient Generator** | `/gradient-generator` | Linear and radial CSS gradient builder with live angle and stop controls |
| **Box Shadow Generator** | `/box-shadow-generator` | Visual elevation builder: offsets, blur, spread, opacity, and inset mode |
| **CSS Border Radius Generator** | `/border-radius-generator` | 4-corner interactive radius designer with clean shorthand CSS output |

</details>

<details>
<summary><b>8. Date & Time (6 Tools)</b></summary>
<br>

| Tool Name | Route | Highlights |
| :--- | :--- | :--- |
| **Stopwatch** | `/stopwatch` | High-precision millisecond stopwatch with split lap recording |
| **Online Timer** | `/online-timer` | Pomodoro focus presets (`5m`, `15m`, `25m`) with Web Audio chime |
| **World Clock** | `/world-clock` | Synchronized digital clocks across 8 major international time zones |
| **Time Zone Converter** | `/time-zone-converter` | Convert meeting dates and hours across IANA worldwide time zones |
| **Countdown Timer** | `/countdown-timer` | Real-time countdown in Days, Hours, Minutes, and Seconds to any deadline |
| **Business Days Calculator** | `/business-days-calculator` | Count Monday–Friday working days between dates, excluding weekends and holidays |

</details>

<details>
<summary><b>9. SEO & Social (9 Tools)</b></summary>
<br>

| Tool Name | Route | Highlights |
| :--- | :--- | :--- |
| **Meta Tag Generator** | `/meta-tag-generator` | HTML title, description, canonical, robots directives with SERP preview |
| **Meta Tag Analyzer** | `/meta-tag-analyzer` | Parse pasted `<head>` markup and audit title/description lengths |
| **Open Graph Generator** | `/open-graph-generator` | Complete `og:*` and Twitter Card meta tag builder for social sharing |
| **Robots.txt Generator** | `/robots-txt-generator` | Crawl-delay, Allow/Disallow path rules, and XML sitemap declaration |
| **XML Sitemap Generator** | `/xml-sitemap-generator` | Format URL lists into valid sitemaps.org XML with priority and changefreq |
| **Hashtag Generator** | `/hashtag-generator` | Accessible `#CamelCase` topic stems combined with curated category tags |
| **YouTube Title Generator** | `/youtube-title-generator` | High-CTR editorial title frameworks with 70-character mobile truncation flags |
| **YouTube Description Generator** | `/youtube-description-generator` | Structured description template with `00:00` chapter timestamps and links |
| **Social Bio Generator** | `/social-bio-generator` | Formatted bio layouts for X (160), Instagram (150), and LinkedIn |

</details>

<details>
<summary><b>10. Random & Everyday (7 Tools)</b></summary>
<br>

| Tool Name | Route | Highlights |
| :--- | :--- | :--- |
| **Random Number Generator** | `/random-number-generator` | Cryptographic hardware-seeded RNG with duplicate exclusion toggle |
| **Random Name Picker** | `/random-name-picker` | Fair giveaway winner selection using cryptographic Fisher-Yates shuffle |
| **Coin Flip** | `/coin-flip` | 50/50 virtual coin toss with cumulative Heads and Tails tally counters |
| **Dice Roller** | `/dice-roller` | Roll 1 to 20 polyhedral dice (`D4`, `D6`, `D8`, `D10`, `D12`, `D20`) with sum and average |
| **Text to Binary** | `/text-to-binary` | Convert UTF-8 strings into space-separated 8-bit binary byte sequences |
| **Binary to Text** | `/binary-to-text` | Decode space-separated binary strings back to readable UTF-8 text |
| **Number to Words** | `/number-to-words` | International English, Indian Lakh/Crore, Bengali (বাংলা), and Hindi (हिन्दी) |

</details>

---

## 🏗️ Architecture & Project Structure

UseKit is structured as a modular TypeScript monorepo with strict separation of concerns:

```
usekit/
├── index.html                   # HTML entry point with SSR injection placeholders
├── server.ts                    # Express SSR head injection, /sitemap.xml, /robots.txt & /api/*
├── vite.config.ts               # Vite configuration with @tailwindcss/vite & PWA integration
├── src/
│   ├── App.tsx                  # Core router with history sync & metadata updates
│   ├── main.tsx                 # Client application hydration entry
│   ├── index.css                # Tailwind CSS v4 styling rules
│   ├── components/
│   │   ├── layout/              # Navbar, Footer, CommandPalette (⌘K)
│   │   ├── tools/               # Modular tool components (Calculators, ImageTools, PdfTools, etc.)
│   │   └── ui/                  # Reusable UI primitives (Button, Input, ToolCard, AdSlot, etc.)
│   ├── hooks/                   # useUserPreferences, usePWAInstall, useHistory
│   ├── lib/
│   │   ├── tools.ts             # Central Tool & Category Registry (90 tools)
│   │   ├── toolLoaders.ts       # Code-split dynamic React.lazy component loaders
│   │   ├── seo.ts               # Metadata generators, JSON-LD builders & head injectors
│   │   ├── siteConfig.ts        # Environment & domain configuration (NEXT_PUBLIC_SITE_URL)
│   │   └── querySync.ts         # Bidirectional URL parameter synchronization
│   └── pages/                   # HomePage, ToolPage, CategoryPage, LegalPages, NotFoundPage
└── public/                      # Static assets, PWA icons, web app manifest
```

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | [React 19](https://react.dev/) | Component rendering, concurrent UI transitions |
| **Language** | [TypeScript 5.8](https://www.typescriptlang.org/) | Strict type safety, clean interfaces, 0 lint warnings |
| **Bundler & Build Tool** | [Vite 8](https://vitejs.dev/) | Lightning-fast HMR and optimized production code-splitting |
| **Styling & Icons** | [Tailwind CSS v4](https://tailwindcss.com/) • [Lucide](https://lucide.dev/) | Modern utility styling and accessible SVG icons |
| **PDF Processing** | [pdf-lib](https://pdf-lib.js.org/) • [PDF.js](https://mozilla.github.io/pdf.js/) | 100% in-browser PDF creation, modification, and rasterization |
| **Barcode & QR** | [JsBarcode](https://lindell.me/JsBarcode/) • [jsQR](https://github.com/cozmo/jsQR) • [qrcode](https://github.com/soldair/node-qrcode) | 1D & 2D optical code synthesis and image decoding |
| **Server & SSR** | [Express](https://expressjs.com/) • [tsx](https://github.com/privatenumber/tsx) | Dynamic SSR head injection, OpenGraph image renderer, edge routes |
| **PWA & Offline** | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) • [Workbox](https://developer.chrome.com/docs/workbox/) | Service workers, offline caching, installable web app manifests |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** (or **pnpm** / **yarn**)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/usekit.git
cd usekit

# 2. Install all dependencies
npm install

# 3. Configure local environment variables
cp .env.example .env

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Runs Express + Vite dev server with SSR metadata injection on port 3000 |
| **Build** | `npm run build` | Compiles production bundle into `/dist` and generates PWA service workers |
| **Production Start**| `npm run start` | Boots the production server serving optimized static assets |
| **Type Check** | `npm run lint` | Runs strict TypeScript compiler check (`tsc --noEmit`) |
| **Preview** | `npm run preview` | Locally serves the compiled production build |

---

## 🌐 Deployment Guide

### Deploying to Vercel

UseKit is pre-configured to deploy on **Vercel** with zero extra setup:

1. Import your GitHub repository into your [Vercel Dashboard](https://vercel.com).
2. Under **Environment Variables**, define your public domain:
   ```env
   NEXT_PUBLIC_SITE_URL="https://your-custom-domain.com"
   ```
3. Click **Deploy**. Vercel will run `npm install` and `npm run build` automatically.

The platform automatically binds `NEXT_PUBLIC_SITE_URL` to all canonical links, OpenGraph cards, JSON-LD microdata, and the dynamic XML sitemap.

### Deploying to Docker / Cloud Run

To build and run UseKit in any containerized environment:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## 🤝 Contributing

We welcome community contributions, bug reports, and new utility tool ideas!

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/usekit.git
   ```
3. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/new-conversion-tool
   ```
4. **Make your changes** adhering to our client-side privacy guidelines (no external file uploads, full TypeScript typing).
5. **Verify the build**:
   ```bash
   npm run lint
   npm run build
   ```
6. **Commit and push**:
   ```bash
   git commit -m "feat: add new unit conversion tool"
   git push origin feature/new-conversion-tool
   ```
7. Open a **Pull Request** detailing your additions and testing steps.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Designed & engineered with precision for maximum privacy, speed, and utility.</sub>
</div>
