# MarqueX Project Guidelines

## Design & Visual Implementation

### ⚠️ Images & Assets - Think Holistically First
**Rule:** Before adding images or visual assets, understand the full design context and how they fit into the overall visual strategy.

**Why:** Adding standalone images without considering opacity, positioning, layering, and background blending can:
- Create visual clutter or distraction
- Break the design's atmospheric consistency
- Require complete rework instead of incremental refinement
- Introduce accessibility/readability issues

**How to apply:**
- Always ask: "How will this blend into the existing design?"
- Consider: opacity, z-index, background colors, and positioning
- Suggest: low-opacity background elements, silhouettes, or subtler integration
- Don't: add full-opacity stock photos as standalone elements without design context
- If you're adding images, propose the full styling/placement approach upfront, not just the HTML

### Silhouettes & Background Elements
- Use SVG-based silhouettes for crisp, background-free shapes
- Apply 3-8% opacity for atmospheric effect without distraction
- Position at varying depths (z-index) to create visual hierarchy
- Use `pointer-events: none; user-select: none` to prevent interaction
- Scatter at different sizes and positions for natural, organic feel

### z-index Hierarchy for this site
- **z-index: 0** — Background silhouettes (fixed, behind all content)
- **z-index: 1** — Main sections (hero, about, signup)
- **z-index: 101** — Fixed header (always on top)

---

## File Locations & Assets
- **Images:**
  - SVG silhouettes embedded in HTML (background elements)
  - Car images stored in `/images/` folder: `car-hero.webp` (hero) and `car-subscribe.jpg` (signup)
  - Images use `mix-blend-mode: screen` for glowing effect against dark backgrounds
- **Styling:** All CSS in `<style>` tag within HTML head

### ⚠️ CRITICAL: HTML Files Deployment
**Two files must be kept in sync:**
- `MarqueXWaitlist.html` — The working/development file
- `index.html` — The file Netlify actually serves (due to redirect in netlify.toml)

**Rule:** Whenever updates are made to `MarqueXWaitlist.html`, they MUST ALSO be applied to `index.html` before pushing to GitHub, or the changes won't appear on the live site.

**How to apply:**
- Make changes to both files simultaneously, OR
- After editing MarqueXWaitlist.html, copy it to index.html: `cp MarqueXWaitlist.html index.html`
- Commit and push both files to GitHub
- Netlify will deploy the updated index.html

### Car Image Implementation
- **car-hero.webp** (hero section): Front-facing supercar with headlights
  - File path: `/images/car-hero.webp`
  - Referenced in HTML as: `<img src="images/car-hero.webp" alt="...">`
  - Positioned centered behind hero text content
  - Responsive scaling: 90% on desktop → 100% tablet → 95% mobile

- **car-subscribe.jpg** (signup section): Side-profile supercar outline
  - File path: `/images/car-subscribe.jpg`
  - Referenced in HTML as: `<img src="images/car-subscribe.jpg" alt="...">`
  - Positioned on right side of form on desktop, centered on mobile
  - Enhanced with CSS filters: `brightness(1.2) contrast(1.4)` to darken background
  - Responsive scaling: 50% desktop → 60% tablet → 100% mobile (centered)

- Both images use `mix-blend-mode: screen` to make black backgrounds invisible
- Dark section backgrounds (#0f0f0f) required for blend mode effect to work
- All images have `pointer-events: none; user-select: none` to prevent interaction

### ⚠️ Netlify Deployment — Image Loading Issues
**Problem:** Images not displaying on Netlify (while working locally)

**Root Causes (Fixed):**
1. **Content Security Policy (CSP) too restrictive** — CSP header in `netlify.toml` didn't allow blob images; only allowed `data:` URIs
2. **Missing cache headers for `/images/` path** — `netlify.toml` only configured headers for `/assets/images/*`, not `/images/*`

**Solution Applied (netlify.toml):**
- ✅ Updated CSP to include `blob:` in img-src: `img-src 'self' data: blob:`
- ✅ Added cache headers for `/images/*` path (in addition to existing `/assets/images/*`)

**Deployment Steps:**
1. Commit updated `netlify.toml`
2. Push to main branch (or deploy branch)
3. Netlify automatically redeploys with new config
4. Clear browser cache with hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows/Linux)

---

## Color Palette Reference
- Black: `#090909`
- Dark gray (body bg): `#3a3a3a`
- Medium gray: `#4a4a4a`
- Accent red: `#D42B16`
