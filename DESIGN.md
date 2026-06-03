---
name: Antecessum Core
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#4d556b'
  on-tertiary: '#ffffff'
  tertiary-container: '#656d84'
  on-tertiary-container: '#eef0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code:
    fontFamily: jetbrainsMono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  max-width: 1440px
---

## Brand & Style

The design system is engineered for **Antecessum**, a civic engineering platform where precision, reliability, and clarity are paramount. The brand personality is authoritative yet modern, evoking the feeling of a high-end technical instrument. 

The aesthetic draws heavily from **Modern Minimalism** with a **Stripe/Linear-inspired** execution. It emphasizes structural integrity through subtle grid lines, generous whitespace, and a sophisticated layering of information. The goal is to instill confidence in professional users through a "technical luxury" lens—where every pixel feels intentional and every interaction feels crisp.

## Colors

The color palette is anchored in a soft, architectural off-white (`#f8fafc`) to reduce eye strain during long engineering sessions. 

- **Primary & Secondary:** A pairing of Royal Blue and Indigo provides a professional, high-contrast accent system for primary actions and brand moments.
- **Surface Strategy:** The design system utilizes "Paper on Slate" logic. Pure white (`#ffffff`) is reserved for interactive cards and modals to make them pop against the off-white background.
- **Functional Grays:** A strictly neutral scale of Slate grays is used for typography and borders to maintain a clean, monochromatic foundation that allows the blue accents to signal importance effectively.

## Typography

The typography system relies exclusively on **Inter** to ensure maximum legibility for complex data. 

- **Weight Strategy:** Headlines use Semi-Bold (`600`) to create a clear hierarchy without the "heaviness" of Extra-Bold weights. 
- **Display Type:** Large titles use tighter letter-spacing (`-0.02em`) to mimic high-end editorial and technical journals.
- **Labels:** Small labels use a slightly heavier weight and uppercase styling for "meta" information like status badges or table headers.
- **Technical Data:** For coordinate data, serial numbers, or engineering specs, JetBrains Mono is used as a secondary utility font to ensure character distinction.

## Layout & Spacing

This design system employs a **Fixed-Fluid Hybrid Grid**. Content is housed within a maximum width container of 1440px to ensure readability on ultra-wide monitors.

- **The Grid:** A 12-column system is used for desktop, 8-column for tablet, and 4-column for mobile.
- **Visual Dividers:** Instead of heavy margins, use subtle 1px lines (`#f1f5f9`) to define sections, emulating a blueprint or technical drawing.
- **Rhythm:** An 8px linear scale governs all padding and margins. Use `24px` (lg) for standard component spacing and `64px` (2xl) to separate major content sections.

## Elevation & Depth

Depth in the design system is communicated through **Ambient Shadows** and **Tonal Layering** rather than heavy skeuomorphism.

- **Level 0 (Background):** `#f8fafc` — The base canvas.
- **Level 1 (Cards/Surfaces):** Pure white background with a very soft, multi-layered shadow: `0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)`.
- **Level 2 (Hover/Active States):** Elevated cards use a "Linear" style shadow: `0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)`.
- **Intersections:** Use thin, low-contrast borders (`1px solid #e2e8f0`) to define edges even when shadows are present. This ensures the UI remains "sharp" and professional.

## Shapes

The design system uses a **Soft** shape language (`0.25rem` / `4px` base radius). 

This choice reflects "Precision Engineering"—it is more approachable than sharp 0px corners but significantly more disciplined and professional than rounded, "bubbly" consumer apps. 

- **Small Components:** Buttons, Inputs, and Checkboxes use the base `4px` radius.
- **Large Components:** Cards and Modals use the `8px` (lg) radius to feel substantial.
- **Special Cases:** Status "Pills" or Chips may use a fully rounded (pill) radius to distinguish them from interactive buttons.

## Components

- **Buttons:** Primary buttons use a solid `#2563eb` fill with white text. Secondary buttons use a white background with a subtle border and `#0f172a` text. All buttons have a subtle 1px "inner highlight" on the top edge to create a professional, tactile feel.
- **Input Fields:** Use a white background with a 1px Slate-200 border. On focus, the border transitions to Primary Blue with a soft 3px blue glow (`rgba(37, 99, 235, 0.1)`).
- **Cards:** White surfaces, 8px radius, and the Level 1 ambient shadow. For dashboard layouts, cards should have a subtle 1px border.
- **Data Tables:** Headers use `label-sm` (uppercase) with a Slate-50 background. Rows are separated by 1px horizontal lines only—no vertical lines—to maintain a modern, airy feel.
- **Status Indicators:** Use small, high-saturation dots (Green for Active, Amber for Pending, Slate for Archived) accompanied by `body-sm` text.
- **Grid Lines:** In complex views, use a background pattern of subtle 24px grid lines in `#f1f5f9` to reinforce the engineering narrative.