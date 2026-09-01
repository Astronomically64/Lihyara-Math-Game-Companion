# 🧭 Lihyara: Math Quest of Bicol — Web Companion

A companion web application for **Lihyara: Math Quest of Bicol**, a physical board game that connects core secondary math competencies with the history, culture, and geography of the Bicol Region.

Cards in the game feature printed QR codes. Players open the companion site on their phones or tablets, scan a card's QR code (or browse the card deck), and interactively solve the math problem with instant feedback, dual input/multiple-choice modes, and step-by-step worked solutions.

---

## ✨ Features

- **📱 Offline-First & Client-Only:** Zero server dependencies, databases, or accounts needed. All 129 questions, choices, and solutions are bundled locally.
- **📷 Camera QR Scanner (`html5-qrcode`):** Responsive camera feed with targeting frame, camera flip, photo upload, and manual code entry options.
- **🔗 Direct Page for Every Card:** Scanning a QR code or visiting `/?card=g7e01` opens that question's dedicated quest page.
- **✏️ Dual Answering Modes:**
  - **Typed Input:** Direct text/numeric input with smart validation (tolerates units, degrees, equivalent decimals/fractions).
  - **Multiple Choice Grid:** 2×2 balanced choice grid with seamless mode switching.
- **💡 Step-by-Step Worked Solutions:** Instant visual and color-blind accessible feedback with full mathematical explanations.
- **📚 129-Card Deck Catalog & Search:** Search and filter cards by Grade (7–10) and Difficulty (Easy, Average, Difficult).
- **📊 Session Persistence:** `localStorage` records correct and incorrect answers for the session.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom design tokens matching Bicol theme)
- **QR Scanning:** `html5-qrcode`
- **Icons:** `lucide-react`
- **Celebration:** `canvas-confetti`

---

## 🚀 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd lihyara-web-companion
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000/` in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to Vercel

1. Push your project to **GitHub**.
2. Go to **[vercel.com](https://vercel.com/)** and import your repository.
3. Vercel will automatically detect **Vite**:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**!

`vercel.json` is pre-configured with SPA route rewrites so direct links (e.g. `/?card=g7e01`) work seamlessly.

---

## 📄 License
MIT License. Created for the *Lihyara: Math Quest of Bicol* educational project.
