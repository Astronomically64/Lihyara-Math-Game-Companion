# Lihyara — UI Spec (from Figma mockups)

## 0. How to use this document

This spec covers **visual design only** — screen layout, copy, colors,
typography, component states. It does not cover data models, navigation
architecture, or business logic; for that, see `PROJECT_SPEC.md` in this
same project. Use both documents together: `PROJECT_SPEC.md` for what the
app does, this file for what it looks like.

**Attach the four mockup images alongside this file when handing work to
the agent.** The color/type values below are read off the mockups by eye,
not pulled from Figma's Dev Mode inspector, so treat them as close
approximations and defer to the images themselves for anything ambiguous
(exact spacing, corner radius, shadow softness). If pixel-perfect accuracy
matters, re-check the flagged values against Figma's Dev Mode panel before
locking them in.

Four mockups, four screens, one flow:
`Home → Scanner → Problem → Feedback → (back to Scanner)`

---

## 1. Design tokens

### 1.1 Color palette

| Token | Approx. hex | Used for |
|---|---|---|
| `background` | `#F1ECE0` | Screen background (Home, Problem, Feedback base) |
| `surfaceCard` | `#FAF7F1` | White-ish rounded cards: stat card, problem text card, answer option cards (unselected), solution card |
| `primaryTeal` | `#1E5452` | Compass icon outline, "MATH QUEST OF BICOL" label, correct stat number, primary CTA button ("Explore Next Location"), selected-correct answer fill |
| `headerTealGradient` | `#173F3E` → `#2C6660` | Problem/Feedback header banner background (dark teal photo overlay, darker at top-left fading lighter toward bottom-right) |
| `accentTerracotta` | `#C15A3C` | Home CTA button ("Scan Location Card"), "INCORRECT" stat number |
| `accentGold` | `#C9A227` | "Level 4 Explorer" badge icon/text, scanner frame corner brackets, "FRACTIONS" badge, checkmark circle fill on Feedback screen |
| `textPrimary` | `#2A2420` | Headings, problem body text, answer option text |
| `textMuted` | `#8C8579` | Small caps labels ("CORRECT", "INCORRECT"), divider line color |
| `textOnDark` | `#FBF8F2` | Text/icons sitting on the teal header banner or the dark scanner overlay card |
| `dimmedOption` | `#D8D2C4` text on `surfaceCard` | Unselected answer options on the Feedback screen (de-emphasized after answering) |

### 1.2 Typography

- **Display/heading font:** a classic serif (mockups read close to *Lora*
  or *Playfair Display*). Used for: "Lihyara" wordmark, screen titles
  ("The Pili Harvest", "Brilliant!"), stat numbers ("12", "3"), answer
  option text ("1/4", "1/2", etc).
- **Body/UI font:** a clean geometric sans (mockups read close to *Inter*
  or *Poppins*). Used for: badges, small-caps labels, body/problem text,
  button labels, hint text.
- **Small-caps labels** (`"CORRECT"`, `"FRACTIONS"`, `"SOLUTION"`,
  `"MATH QUEST OF BICOL"`): sans font, uppercase, letter-spacing wide,
  small size (~11-12sp), medium/semibold weight.
- Confirm exact font families against Figma before final implementation —
  substitute the closest Google Font if the original isn't licensed for
  Android bundling.

### 1.3 Shape & spacing

- Corner radius: large and consistent — cards, buttons, and the header
  banner all use a generously rounded radius (~20-24dp). The header
  banner rounds only its **bottom** corners (top corners square against
  the device edge).
- Cards float on the background with soft, low-opacity drop shadows (not
  hard borders) — see stat card and answer option cards.
- Consistent horizontal screen padding (~20-24dp) on all screens.
- Answer options render as a **2×2 grid** with even gutters, square-ish
  aspect ratio per cell.

---

## 2. Component inventory

Reusable pieces to build once and share across screens:

1. **Pill badge** — rounded-full, small icon + label, used 2 ways:
   - Light variant (Home: "✨ Level 4 Explorer") — cream background, dark text, gold icon.
   - Dark variant (Problem: "◎ FRACTIONS") — semi-transparent dark/teal background, gold text + icon, sits on top of the header banner.
2. **Primary button (full-width, filled)** — two color variants seen: terracotta (Home CTA) and primaryTeal (Feedback CTA). Rounded-full or large radius, white bold label, optional leading/trailing icon.
3. **Stat card** — rounded card, two columns separated by a thin vertical divider, each column a small-caps label over a large serif number.
4. **Header banner (Problem/Feedback)** — full-width, rounded-bottom, dark teal photo-backed panel. Contains badge + title + subtitle (Problem) or icon + title + subtitle (Feedback success state).
5. **Answer option card** — rounded card, centered serif text, three visual states (detailed in section 4.4):
   - Default (unanswered)
   - Selected + correct (filled teal, white text)
   - Unselected after answering (dimmed/muted text, same card background)
6. **Solution card** — rounded card, small icon + "SOLUTION" label row, body text below in sans font.
7. **Circular icon button** — used for the back button on the Scanner screen: semi-transparent dark circle, white chevron icon.
8. **QR targeting frame** — four independent corner brackets (not a solid box) in `accentGold`, forming a square scan target over the camera feed.

---

## 3. Assets needed

- **Compass icon** (outlined, teal) — Home screen, app icon.
- **Scan/frame icon** — small icon inside the "Scan Location Card" button.
- **Sparkle icon** — inside the "Level 4 Explorer" badge.
- **Back chevron icon** — Scanner screen back button.
- **Pin/location icon** — small icon before the location line on the Problem header ("Sibulan Fractal Grove — Naga City").
- **Category icon** — small circular target-style icon inside the category badge (e.g. "◎ FRACTIONS"); likely swaps per competency (fractions/integers/algebra) — flag this as a place to define one icon per category later.
- **Checkmark icon** — Feedback screen success state, sits inside a filled gold circle.
- **Open book icon** — small icon before "SOLUTION" label.
- **Forward chevron icon** — trailing icon in the "Explore Next Location" button.
- **Header background photography** — desaturated/duotone landscape images used behind the Scanner viewfinder and the Problem/Feedback header banner. These appear to be location-specific (a mountain/grove scene for this Sibulan Fractal Grove example) — plan for one background image per in-game location (see the competency map in `PROJECT_SPEC.md`), not a single static image.

If any of these aren't available as exported assets from Figma, use a
standard icon set (e.g. Material Symbols / Feather-style outline icons) as
a close substitute and flag it for design review rather than guessing at
a custom icon shape.

---

## 4. Screen-by-screen breakdown

### 4.1 Home

Top to bottom:
1. Pill badge, top-left aligned: sparkle icon + `"Level 4 Explorer"` (light variant).
2. Centered circular icon frame (teal outline circle) containing the compass icon, generous vertical space above and below.
3. `"Lihyara"` — large serif wordmark, centered, dark text.
4. `"MATH QUEST OF BICOL"` — small-caps sans subtitle directly below, centered, primaryTeal color, letter-spaced.
5. Large flexible vertical space pushing the next two elements toward the bottom of the screen (not centered in the middle — the mockup leaves the mid-screen empty).
6. Stat card: `"CORRECT" / 12` (teal number) | divider | `"INCORRECT" / 3` (terracotta number).
7. Primary button, full-width, terracotta: scan icon + `"Scan Location Card"`.

Note: `12` and `3` are session stat placeholders (matches the
`GameSessionEntity` counts in `PROJECT_SPEC.md`) — wire to real state, not
static text. `"Level 4 Explorer"` implies some kind of player level/XP
concept not yet defined in the functional spec — flag this as an open
question rather than inventing leveling logic.

### 4.2 Scanner

Full-bleed camera preview (background photo in the mockup stands in for
the live camera feed) with UI layered on top:
1. Top-left: circular semi-transparent back button with a white chevron.
2. Centered scan target: four corner brackets in gold, forming a square, positioned roughly center-screen (slightly above vertical center).
3. Bottom-anchored dark card (semi-transparent black/near-black, rounded): bold white `"Target QR Code"` heading, then smaller lighter-weight body text `"Point your camera at the location card to reveal the challenge."`

No visible bottom nav or extra chrome — this screen is intentionally
minimal so the camera feed dominates.

### 4.3 Problem

Top to bottom:
1. Header banner (rounded bottom corners only, dark teal photo-backed):
   - Dark pill badge: category icon + `"FRACTIONS"` (uppercase, gold).
   - Large serif title, white: `"The Pili Harvest"` (this is the card's flavor-text title — a separate field from the raw math problem; flag as a new field not yet in the `CardEntity` schema in `PROJECT_SPEC.md`, see section 5 below).
   - Location line, smaller white/cream text: pin icon + `"Sibulan Fractal Grove — Naga City"`.
2. Problem text card, overlapping the bottom edge of the header banner (the card starts before the banner's rounded corner ends, creating a layered look): body text in sans font, dark, left-aligned, comfortable line height. Example content: `"If a farmer in the fractal grove harvests 3/4 of a basket of pili nuts, and gives 1/3 of that harvest to a neighbor, what fraction of the full basket does the farmer have left?"`
3. Flexible empty space.
4. 2×2 answer grid, bottom-anchored: four cards, each centered serif text (e.g. `1/4`, `1/2`, `5/12`, `1/3`), all in the default/unanswered visual state (cream card, dark text, no selection).

### 4.4 Feedback (shown here in the "correct" state)

Top to bottom:
1. Header banner (same shape/position as Problem screen, same dark teal treatment):
   - Centered gold filled circle containing a white checkmark icon.
   - Large serif heading, white, centered: `"Brilliant!"`
   - Smaller subtitle, white/cream, centered: `"You solved the challenge."`
2. Same 2×2 answer grid as the Problem screen, now in **answered state**:
   - The option the player selected, if correct: filled `primaryTeal` background, white bold text, subtle highlight border.
   - All other options: dimmed — muted gray text (`dimmedOption` token) on the same cream card background, clearly de-emphasized versus the selected one.
   - *(Incorrect-answer state is not shown in these mockups — design it as: the player's wrong pick filled in terracotta/red with white text, AND the actual correct option separately highlighted in teal, so the player can see both what they picked and what was right. Flag this as inferred, not shown, and confirm against Figma if a fifth mockup exists for it.)*
3. Solution card: open-book icon + small-caps `"SOLUTION"` label (teal) on one row, body text below in sans font, dark, left-aligned. Example content: `"First, find how much was given away: 1/3 of 3/4 is 1/4. Then subtract that from the initial amount: 3/4 − 1/4 = 2/4, which simplifies to 1/2."`
4. Primary button, full-width, primaryTeal: `"Explore Next Location"` + trailing forward chevron.

---

## 5. Open questions / gaps for the agent to flag, not guess at

- **Card title field:** the Problem screen shows a flavor-text title
  (`"The Pili Harvest"`) distinct from the raw problem text. This isn't
  currently in `CardEntity` in `PROJECT_SPEC.md` — add a `title: String`
  field there before wiring real data, rather than inventing one from the
  problem text.
- **"Level 4 Explorer" / player leveling:** implies XP or progression
  beyond the simple correct/incorrect session counter currently in the
  spec. Treat as a static placeholder label for now — do not build
  leveling logic that isn't specified.
- **Incorrect-answer visual state:** not present in the provided mockups;
  section 4.4 gives a reasonable inferred design, but confirm with the
  actual design source before finalizing.
- **Per-location header photography:** only one location's imagery
  (Sibulan Fractal Grove) is shown. Confirm whether Salinor Integer Shores
  and Sidlakan Algebrae Peak get their own distinct photo treatments or
  share a single generic background.
