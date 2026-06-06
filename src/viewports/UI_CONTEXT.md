# Browser vs phone UI

The frontend renders **two separate UI trees** — not one layout with CSS breakpoints at the page level.

| Viewport | Width | Edit these files |
|----------|-------|------------------|
| **Browser** | > 760px | `*Browser.tsx` + `*Browser.css` |
| **Phone** | ≤ 760px | `*Phone.tsx` + `*Phone.css` |

Breakpoint constant: `src/viewports/constants.ts` (`PHONE_MAX_WIDTH = 760`).

## Screen map

| Step | Browser | Phone |
|------|---------|-------|
| Landing | `src/pages/landing/LandingPageBrowser.*` | `src/pages/landing/LandingPagePhone.*` |
| Setup | `src/pages/setup/ProjectSetupPageBrowser.*` | `src/pages/setup/ProjectSetupPagePhone.*` |
| Beats | `src/pages/beats/ProjectPanelBrowser.*` | `src/pages/beats/ProjectPanelPhone.*` |
| Shell | `src/layouts/StudioLayoutBrowser.*` | `src/layouts/StudioLayoutPhone.*` |

Router: `ResponsiveView` in `src/viewports/ResponsiveView.tsx` picks the tree via `useViewport()`.

## Active development focus

**Primary work happens on the browser UI** (`*Browser.*` files). The product owner designs and reviews on desktop; phone layouts are maintained in parallel in `*Phone.*` files and should stay visually aligned (same content hierarchy, touch-friendly sizing).

When changing a screen, update **browser first** unless the task is explicitly mobile-only. After browser changes, mirror the intent on phone (spacing, typography, CTA size) — do not rely on shared page-level `@media` queries for whole screens.

Shared widgets (`ProjectSettings`, `BeatEditor`, etc.) may still use internal responsive CSS until they are split the same way.

## Preview phone UI on a desktop browser

Because browser and phone are separate components, resizing the window is the normal way to switch. For local/preview builds you can also force a viewport:

- URL: `?viewport=phone` or `?viewport=browser`
- Persist: `localStorage.setItem("studio-viewport-override", "phone")` (dev only; ignored in production)

Example: `http://localhost:5173/?viewport=phone`

Clear override: `localStorage.removeItem("studio-viewport-override")`

## Class naming

- Browser blocks: `landing-browser`, `setup-browser`, `beats-browser`, `studio-browser`
- Phone blocks: `landing-phone`, `setup-phone`, `beats-phone`, `studio-phone`

Keep styles in the matching `*Browser.css` / `*Phone.css` file — avoid cross-importing browser CSS into phone files.
