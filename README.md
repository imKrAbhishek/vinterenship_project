# Vi-Notes

**Authenticity verification platform** — ensures genuine human writing through real-time keyboard activity monitoring and statistical signature analysis.

---

## Features

| Feature | Description |
|---|---|
| ✍ Writing Editor | Distraction-free textarea with live word/char/keystroke counters |
| ⌨ Keystroke Timing | Captures timing between keystrokes (not characters) to build a behavioural profile |
| 📋 Paste Detection | Flags and records paste events with timestamp and character count |
| 💾 Session Storage | Saves sessions to `localStorage` — no backend required |
| 📊 Authenticity Report | Score (0–100) with behavioral metrics and detection flags |
| 🔐 Auth | Email/password registration and login (client-side, localStorage) |

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

---

## Build for production

```bash
npm run build
# Output in /dist — ready to deploy to Vercel, Netlify, GitHub Pages, etc.
```

---

## Project structure

```
vi-notes/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AuthScreen.jsx / .module.css
│   │   ├── Dashboard.jsx  / .module.css
│   │   ├── Editor.jsx     / .module.css
│   │   ├── Navbar.jsx     / .module.css
│   │   ├── ScoreRing.jsx
│   │   ├── SessionReport.jsx / .module.css
│   │   └── ui.css                  ← shared utility classes
│   ├── constants/
│   │   └── colors.js
│   ├── utils/
│   │   ├── analysis.js             ← scoring engine
│   │   ├── auth.js                 ← register / login helpers
│   │   ├── sessions.js             ← session CRUD
│   │   └── storage.js              ← localStorage wrapper
│   ├── App.jsx                     ← root router
│   ├── main.jsx
│   └── index.css                   ← CSS variables + reset
├── index.html
├── vite.config.js
├── package.json
└── .gitignore
```

---

## Detection methodology

The authenticity score (0–100) is computed from:

- **Typing rhythm variability** — human typing has natural variance; AI-pasted text has none
- **Correction rate** — genuine writers backspace and rethink; AI output has none
- **Paste ratio** — proportion of final text that arrived via paste events
- **Thinking pauses** — intervals > 2 seconds between keystrokes
- **Estimated WPM** — plausible range check (20–120 WPM is human-normal)

> ⚠ This is an MVP. For production use, replace the client-side password hashing with a proper backend + bcrypt, and host the ML models server-side.

---

## Tech stack

- **React 18** + **Vite 5**
- **CSS Modules** for component-scoped styles
- **localStorage** for persistence (no backend)
- **Google Fonts** — Syne, JetBrains Mono, Inter
