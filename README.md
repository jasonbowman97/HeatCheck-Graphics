# HeatCheck HQ — Graphic Builder

Generate viral sports stats graphics for Twitter/X from HeatCheck HQ dashboards.

## Features

- 13 preset dashboards across MLB, NBA, and NFL
- 5 color themes (Fire, Ice, Neon, Emerald, Gold)
- Badge system for highlighting picks
- Conditional cell coloring (high/low good modes)
- Smart paste import (tab, comma, or multi-space separated)
- Auto-generated tweet captions with templates
- localStorage persistence with auto-save
- Undo/Redo (Ctrl+Z / Ctrl+Shift+Z)
- PNG export at 2x resolution with font preloading
- Responsive layout for smaller screens

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start building graphics.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Ctrl+D | Download PNG |

## Tech Stack

- Next.js 14 (App Router)
- React 18
- html-to-image (PNG export)
- Oswald font (Google Fonts)
