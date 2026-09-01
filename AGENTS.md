# Lihyara: Math Quest of Bicol — Web App Build Spec

## 0. How to hand this to Antigravity

Open Antigravity, create/open the workspace folder, and paste this entire
file as your first task in the Agent Manager. Ask the agent to review the
plan and confirm before executing — Antigravity will propose a plan you
can approve or adjust before it starts writing code.

If you want these conventions to persist across future sessions in this
workspace (not just this one task), save the contents of section 2 (Tech
Stack) and section 6 (Notes for the agent) into an `AGENTS.md` file at the
project root — Antigravity reads that automatically on every task in this
workspace, so you won't need to repeat those constraints each time.

Attach `lihyara_all_cards.json` and `lihyara_qr_codes.zip` (both provided
separately) alongside this spec — the agent needs the actual data file,
not just this description of its shape.

---

## 1. Overview

Build a companion **website** for **Lihyara: Math Quest of Bicol**, a
physical board game that grounds core math competencies in the history
and geography of the Bicol Region. Cards in the game each have a printed
QR code. Players open the site on their phone, scan a card's QR code
using the browser camera, and the site displays a math problem with
multiple-choice answers and instant feedback with a worked solution.

**Goal for this pass:** a working static site covering the full scan →
answer → feedback loop, using the real question bank already provided.
No backend server, no user accounts, no login — everything runs
client-side and works offline after first load.

---

## 2. Tech Stack (required)

- **Framework:** React (Vite as the build tool — fast, minimal config)
- **Language:** TypeScript
- **Styling:** Plain CSS or Tailwind CSS — either is fine, state which one you use
- **QR Scanning:** `html5-qrcode` (npm package) using the browser's `getUserMedia` camera API — no native SDK
- **Routing:** React Router, or simple state-based view switching if you prefer to keep it minimal (4 screens total, see section 4)
- **Data:** Static JSON loaded at runtime (`fetch` from `/public/lihyara_all_cards.json` or bundled as a static import) — no database, no backend
- **Persistence:** `localStorage` for session stats (correct/incorrect counts) — nothing else needs to persist
- **Hosting target:** Static site, deployable to Vercel/Netlify/GitHub Pages — build output should be a plain static bundle with no server-side requirements

Do not add a backend, database server, or authentication system. This is
a fully static, client-only app for this pass.

---

## 3. Data

Use the provided `lihyara_all_cards.json` as-is. Shape:

```json
{
  "cards": [
    {
      "qrId": "g7e01",
      "grade": 7,
      "category": "polygons-angles",
      "difficulty": 1,
      "problemText": "...",
      "imageRes": null,
      "answers": [
        { "text": "...", "isCorrect": true },
        { "text": "...", "isCorrect": false },
        { "text": "...", "isCorrect": false },
        { "text": "...", "isCorrect": false }
      ],
      "solution": "..."
    }
  ]
}
```

- `difficulty` is 1 (easy), 3 (average), or 5 (difficult) — not a 1-5 scale with every value used.
- `imageRes` is always `null` in the current dataset — every card is fully answerable from `problemText` alone. Don't build image-rendering logic for this pass; leave a clear extension point (a conditional that currently always skips) instead.
- `location` does not exist on these cards yet (they're tagged by `grade`/`category` only) — don't invent location names or UI for it.

### QR payload format

QR codes encode a short ID string:

```
LIHYARA:<qrId>
```

On scan, strip the `LIHYARA:` prefix and look up the remaining ID against
the `qrId` field in the loaded JSON. If not found, show a clear "Card not
recognized" state — don't crash, don't silently fail.

The actual QR code images for all 129 cards are provided in
`lihyara_qr_codes.zip` for print-testing the scan flow against real
printed (or on-screen) codes.

---

## 4. Screens / User Flow

Same 4-screen flow as the original app concept, adapted for a browser:

1. **Home** — "Scan Location Card" button, session stats (correct/incorrect counts from `localStorage`)
2. **Scanner** — full-screen camera view via `html5-qrcode`, targeting overlay, back button. On successful scan, auto-navigate to Problem.
3. **Problem** — shows the category/grade badge, `problemText`, 4 shuffled answer buttons
4. **Feedback** — highlights the selected answer (correct/incorrect), reveals the right answer if wrong, shows the `solution` text, "Scan Next Card" button back to Scanner

Refer to `UI_SPEC.md` (provided separately, from the original Figma
mockups) for exact colors, typography, spacing, and copy style — it's
platform-agnostic and applies here with no changes needed.

### Error / edge states to handle
- Unrecognized QR code
- Camera permission denied (browsers vary in how they prompt — handle the denial gracefully with a retry button)
- No camera available (desktop without a webcam, etc.) — show a clear message rather than a blank screen
- iOS Safari in particular has stricter camera/autoplay behavior — test there specifically, not just Chrome desktop

---

## 5. Task Breakdown (execute in order)

### Phase 1 — Project setup & scan loop
- [ ] Scaffold: Vite + React + TypeScript
- [ ] Add `html5-qrcode`, set up camera permission flow with a clear denied/retry state
- [ ] Build the Scanner screen: camera preview, QR detection, parse `LIHYARA:<id>` payload
- [ ] On successful scan, navigate to Problem screen with the parsed ID

### Phase 2 — Data layer
- [ ] Load `lihyara_all_cards.json` (place in `/public`, fetch at app start, or import as a static module — either is fine)
- [ ] Build a simple data-access layer: `getCardById(id)`, returning the full card object or `undefined`
- [ ] Handle the "card not found" case cleanly in the UI

### Phase 3 — Problem & feedback UI
- [ ] Problem screen: display `problemText`, shuffle and render the 4 answers
- [ ] Answer selection → correct/incorrect visual feedback → show `solution` text
- [ ] "Scan Next Card" → back to Scanner
- [ ] Home screen: stats pulled from `localStorage`, updated after each answer

### Phase 4 — Polish
- [ ] Responsive layout — this will primarily be used on phones at the table, so mobile-first, not desktop-first
- [ ] Basic accessibility: readable font sizes, color-blind-safe correct/incorrect indicators (icon + color, not color alone)
- [ ] Test the camera/scan flow specifically on a real phone browser (not just desktop dev tools) before considering this done

**Explicitly out of scope for this pass:** backend, accounts, multiplayer, remote content sync, image/diagram rendering (no card currently needs it). Leave clear extension points, don't build them now.

---

## 6. Notes for the agent

- Favor simple, readable code over cleverness — this is a small hobby/team project.
- Must work fully offline after first page load (all 129 cards are bundled locally, no network calls needed at runtime).
- If you deviate from anything here (e.g. styling approach, routing method), note the deviation and why in a comment at the top of the relevant file.
- Confirm the plan with the user before executing, and pause for review after each phase rather than running straight through all four.
