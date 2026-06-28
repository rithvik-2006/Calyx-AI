---
name: Obsidian Health
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#cfc4c5'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#988e90'
  outline-variant: '#4c4546'
  surface-tint: '#c6c6c6'
  primary: '#c6c6c6'
  on-primary: '#303030'
  primary-container: '#000000'
  on-primary-container: '#757575'
  inverse-primary: '#5e5e5e'
  secondary: '#c9c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#000000'
  on-tertiary-container: '#767575'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-data:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.06em
  label-muted:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 720px
  gutter: 16px
---

## Brand & Style

This design system is built on the principles of **high-end technical minimalism**. It prioritizes clarity, focus, and a sense of "digital craftsmanship." The aesthetic draws from the utility of developer tools (Linear) and the atmospheric polish of modern browsers (Arc), while maintaining the health-centric intimacy of Apple Health.

The target audience consists of data-conscious individuals who value quiet software. The UI stays out of the way, allowing the user's health metrics to take center stage. The emotional response is one of **composed control**—calm, expensive, and profoundly reliable.

The design style is **Modern Minimalist with Tonal Depth**, utilizing a monochromatic palette to reduce cognitive load while employing precise borders and subtle layering to establish hierarchy.

## Colors

The palette is strictly monochrome, utilizing deep blacks and varying shades of charcoal to create a sophisticated, low-light environment. 

- **Backgrounds:** Use pure `#000000` for the main canvas to create an "infinite" depth effect on OLED screens.
- **Surfaces:** Cards and containers use `#0B0B0B` or `#111111` to create subtle separation.
- **Accents:** Functional accents (e.g., progress bars, success states) must be desaturated and muted. Avoid vibrant hues; use high-contrast white against black to indicate importance.
- **Borders:** All structural separation is handled by 1px strokes of `#242424`.

## Typography

Typography is the primary tool for information architecture. This system uses **Inter** for its neutral, systematic clarity.

- **Data Presentation:** Use the `display-data` role for primary metrics (e.g., calorie counts, weight). The tight letter spacing and heavy weight evoke a premium, "instrument-cluster" feel.
- **Variation:** Contrast is achieved through weight (Regular to Semibold) rather than color shifts.
- **Labels:** Use `label-caps` for secondary metadata and `label-muted` for tertiary descriptions. Muted text should use the `text_tertiary` color to recede into the background.

## Layout & Spacing

This design system follows a **Strict 8px Grid**. All dimensions, padding, and margins must be multiples of 8.

- **Mobile Layout:** Single-column fluid layout with `16px` or `24px` horizontal margins. Content should feel native, filling the width of the device.
- **Desktop Layout:** To maintain the "personal tracker" feel, desktop views are not full-width. Content is centered within a maximum container width of `720px`, mirroring the focused experience of mobile while utilizing the extra whitespace for a "gallery" effect.
- **Rhythm:** Use `40px` (xl) spacing between major sections to emphasize the spacious, luxurious aesthetic.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Precision Outlines** rather than traditional shadows.

- **Level 0 (Base):** `#000000` — The main background.
- **Level 1 (Card/Surface):** `#0B0B0B` — Used for content modules. These must feature a `1px` solid border of `#242424`.
- **Level 2 (Interaction/Popovers):** `#111111` — Used for active states or floating elements. 
- **Shadows:** Only use shadows for elevated modal components. When used, shadows should be extremely diffused: `0px 10px 40px rgba(0, 0, 0, 0.5)`. 
- **Interaction:** On hover or tap, cards may transition from a `#242424` border to a `#F7F7F7` (15% opacity) border to indicate focus.

## Shapes

The shape language is defined by large, sweeping curves that contrast with the sharp, technical typography.

- **Primary Containers:** Cards and main UI blocks use a consistent radius of `24px` (`rounded-lg`).
- **Interactive Elements:** Buttons and input fields use `12px` to appear more precise.
- **Progress Indicators:** Use fully rounded ends (capsule shape) for all bar-based data visualizations.

## Components

### Buttons
- **Primary:** Pure white background with black text. No border. High visibility.
- **Secondary:** Transparent background with a `1px` border (`#242424`) and white text.
- **Tertiary/Ghost:** No background or border. Muted gray text, turning white on hover.

### Cards
Cards are the core unit of the design system. 
- Background: `#0B0B0B`.
- Border: `1px solid #242424`.
- Internal Padding: `24px`.
- Content should be vertically stacked with `label-caps` at the top and `display-data` in the center.

### Input Fields
- Inputs should be minimalist under-bars or subtly filled containers (`#111111`) with no side borders, emphasizing a "form-fill" feel. 
- Focus state: The bottom border transitions to white.

### Progress Indicators
- Track: `#1A1A1A`.
- Indicator: Desaturated tones (e.g., a muted silver or deep charcoal-blue). For nutrition, use a subtle high-contrast white bar to indicate progress against a goal.

### Lists
- Standard list items should be separated by `1px` horizontal lines (`#242424`) with `16px` vertical padding. Avoid chevrons; use weight and typography to imply navigability.