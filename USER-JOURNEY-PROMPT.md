# PDF User Journey Prompt — Interactive Train Journey Map

Use the prompt below with any AI image/document generator (ChatGPT, Claude, Gemini, Canva AI, Adobe Firefly, etc.) to produce a polished PDF documenting the user journey of this application.

---

## The Prompt

```
Create a professionally designed PDF document titled "User Journey — The Enchanted Line: Interactive Train Journey Map".

The document should follow an art-deco visual style: dark navy backgrounds (#06101c), gold accents (#c9a45a / #e8c97a), serif headings (Playfair Display or similar), and monospace labels (DM Mono or similar). Use diamond (◆) shapes as bullet markers throughout.

---

DOCUMENT STRUCTURE:

---

PAGE 1 — Cover
- Title: "The Enchanted Line"
- Subtitle: "User Journey Documentation"
- Route label: PRETORIA ──────► CAPE TOWN
- Stats: 1,600 km · 9 Chapters · 1 Story
- Tagline: "A Living Museum on Rails"
- Style: Full dark background, large centred gold title, decorative art-deco border frame, compass rose in bottom corner.

---

PAGE 2 — Overview & Entry Point

Section: "What is this application?"
A single-page React web application that guides the user through a heritage train journey from Pretoria to Cape Town, South Africa. Nine stations are revealed progressively as the animated locomotive travels across an SVG map. Each station unlocks a heritage story and three hidden gems. The user collects wax-seal passport stamps as they travel.

Section: "User Goals"
◆ Discover the cultural and historical heritage of South Africa's rail corridor
◆ Progress through 9 self-paced chapters at their own speed
◆ Experience the journey in their preferred language (English, isiZulu, Afrikaans, Sesotho)
◆ Collect all 9 passport stamps by completing the full journey

---

PAGE 3 — User Persona

Name: Thandi M.
Age: 34
Background: South African history teacher, occasional traveller, fluent in English and isiZulu.
Device: Desktop browser (Chrome), occasionally mobile.
Goal: Explore South African heritage interactively with her students.
Pain points: Wants content in multiple languages; needs a clear sense of progress; dislikes interfaces that feel rushed.

---

PAGE 4 — Journey Map (main diagram)

Draw a horizontal swimlane diagram with these columns:
  Stage | User Action | System Response | Emotional State | UI Element Involved

Rows (one per stage):

1. ARRIVAL
   Action: User opens the app URL in their browser.
   System: Intro screen loads with starfield animation, art-deco ticket card fades up.
   Emotion: Curious, intrigued.
   UI: IntroScreen — ticket card, starfield, radiating lines.

2. LANGUAGE SELECTION
   Action: User reads the prompt "Which tongue shall the conductor speak?" and selects isiZulu.
   System: Language state updates; conductor greeting changes to isiZulu at the bottom of the screen.
   Emotion: Welcomed, included.
   UI: 2×2 language picker grid; active language highlighted in gold.

3. BOARDING
   Action: User clicks "Board the Train".
   System: Phase transitions to JourneyView; the SVG map of South Africa appears; the train is positioned at Pretoria (Station I); ChapterPanel slides in from the right.
   Emotion: Excited, ready to explore.
   UI: JourneyView — MapSVG, ChapterPanel, top bar, RouteProgress bar.

4. READING CHAPTER I (PRETORIA)
   Action: User reads the heritage story and hidden gems for Pretoria in the Chapter Panel.
   System: Chapter panel shows localised station name "ePitoli", heritage paragraph, and 3 hidden gem bullets. Wax seal not yet shown (station not yet departed).
   Emotion: Engaged, learning.
   UI: ChapterPanel — heritage section, hidden gems, "Continue Journey →" button.

5. DEPARTURE
   Action: User clicks "Continue Journey →" or the "Depart for eGoli" button on the map.
   System: Animation loop starts; train moves frame-by-frame toward Johannesburg; route line fills gold behind it; chapter panel closes.
   Emotion: Anticipation, motion.
   UI: TrainSprite moving, route segment filling, top bar progress bar advancing.

6. STATION ARRIVAL (repeat for each of the 9 stations)
   Action: Train arrives at the next station automatically; user reads the new chapter.
   System: isMoving clears; new station added to awoken set; "Chapter Unlocked" banner flashes; ChapterPanel slides in; wax seal appears on the previous station in RouteProgress.
   Emotion: Satisfaction, discovery.
   UI: Chapter Unlocked banner, ChapterPanel animation, WaxSeal stamp animation.

7. REVISITING A PAST STATION
   Action: User clicks a previously visited diamond on the map or RouteProgress bar.
   System: ChapterPanel opens for that station showing its content and stamped wax seal.
   Emotion: Reflective, reviewing.
   UI: Diamond marker (clickable when awoken), ChapterPanel with wax seal footer.

8. JOURNEY COMPLETE (CAPE TOWN)
   Action: Train arrives at Cape Town (Station IX — iKapa).
   System: isComplete = true; "Journey Complete — Welcome to iKapa" message appears on the map; ChapterPanel footer shows completion message; all 9 wax seals visible in RouteProgress.
   Emotion: Accomplished, proud.
   UI: Completion message, all RouteProgress stamps filled, final ChapterPanel.

---

PAGE 5 — Screen-by-Screen Walkthrough

For each screen below, include a labelled wireframe sketch (dark background, gold borders) and a short description:

Screen 1: Intro / Splash
- Elements: Starfield, radiating lines, art-deco ticket card (title, route, stats), language picker grid, "Board the Train" button, conductor greeting.
- Key interaction: Language selection and CTA click.

Screen 2: Journey View — Map Focus
- Elements: Top bar (logo, chapter counter, progress bar), SVG map (SA outline, terrain tints, station diamonds, ghost route, active route, train sprite, compass rose, scale bar), "Depart for X" button, "Chapter Unlocked" banner.
- Key interaction: Train movement, station click.

Screen 3: Journey View — Chapter Panel Open
- Elements: All of Screen 2 PLUS the right-hand ChapterPanel (chapter number, terrain, localised name, subtitle, ornament divider, heritage text, hidden gems list, optional wax seal, continue/complete button).
- Key interaction: Read content, continue journey or close panel.

Screen 4: Journey View — Journey Complete
- Elements: All station diamonds filled/stamped in RouteProgress, "Journey Complete" overlay text on map, completion message in ChapterPanel.
- Key interaction: Review any chapter by clicking a stamp.

---

PAGE 6 — Interaction Flow Diagram

Draw a flowchart:

[Open App]
    ↓
[IntroScreen renders]
    ↓
[User selects language]
    ↓
[User clicks "Board the Train"]
    ↓
[JourneyView renders — Station I unlocked]
    ↓
[User reads Chapter I]
    ↓
[User clicks Depart]
    ↓
[Animation loop: isMoving = true]
    ↓
[tProg reaches 1.0 → next station unlocked]
    ↓
[isMoving = false → ChapterPanel opens]
    ↓ ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
[stIdx < 8?] ──YES──→ [Repeat depart loop]
    │
   NO
    ↓
[isComplete = true → Journey Complete screen]

---

PAGE 7 — Accessibility & Language Notes

◆ Language state is global — switching language on the intro screen changes all station names, labels, and the conductor greeting throughout the journey.
◆ All interactive elements (station diamonds, buttons) have pointer cursor and hover states.
◆ The app is fully keyboard-navigable via standard tab/enter flows on buttons.
◆ Colour contrast: gold (#c9a45a) on dark navy (#06101c) meets WCAG AA for large text.
◆ Animation can be visually intense — a future enhancement would add a prefers-reduced-motion media query to disable the train animation loop.

---

PAGE 8 — Back Cover
- Repeat the art-deco ornament and title.
- Text: "Built with React · Vite · Tailwind CSS v4 · TypeScript"
- GitHub: https://github.com/thecodem-dev/interactive-train-journey-map
- Small print: "9 Chapters · 1,600 km · One living story"

---

STYLE NOTES FOR THE DESIGNER:
- Colour palette: #06101c (background), #0c1e35 (card), #c9a45a (gold), #e8c97a (light gold), #ede3cc (body text), #8fa4bc (muted text)
- All section headings in Playfair Display, uppercase, gold
- All labels and stats in DM Mono, small caps, letter-spacing 0.15em
- Body copy in Libre Franklin, 13–14px equivalent, line-height 1.75
- Diamond bullet: ◆ in gold
- Decorative dividers: horizontal line — ◆ — horizontal line, in gold
- Page borders: thin double gold border, corner ornaments
- Total pages: 8
```

---

## Tips for using this prompt

- **ChatGPT / Claude:** Paste the prompt above into a new conversation. Ask it to output the content as structured Markdown first, then use a tool like Pandoc, Notion export, or an online Markdown-to-PDF converter to render it with custom CSS matching the colour palette.
- **Canva AI:** Use the prompt as a brief for the "Magic Design" feature. Provide the colour hex codes and font names explicitly.
- **Adobe Express / Firefly:** Use each page description as a separate generation prompt, then combine pages in a multi-page document.
- **Pandoc (CLI):** Save the AI-generated Markdown output as `user-journey.md` and run:
  ```bash
  pandoc user-journey.md -o user-journey.pdf --pdf-engine=wkhtmltopdf \
    -V geometry:margin=2cm -V colorlinks=true
  ```
- **Figma:** Each screen wireframe description maps directly to a Figma frame. Use the colour tokens above to match the app's visual language.
