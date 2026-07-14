---
name: Academic Modernist
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#3e4a3e'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#6e7a6d'
  outline-variant: '#bdcabb'
  surface-tint: '#006d33'
  primary: '#006b31'
  on-primary: '#ffffff'
  primary-container: '#008740'
  on-primary-container: '#f7fff3'
  inverse-primary: '#62de85'
  secondary: '#405f91'
  on-secondary: '#ffffff'
  secondary-container: '#a6c5fe'
  on-secondary-container: '#315182'
  tertiary: '#4b41e1'
  on-tertiary: '#ffffff'
  tertiary-container: '#645efb'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#7ffb9f'
  primary-fixed-dim: '#62de85'
  on-primary-fixed: '#00210b'
  on-primary-fixed-variant: '#005225'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#a9c7ff'
  on-secondary-fixed: '#001b3d'
  on-secondary-fixed-variant: '#264778'
  tertiary-fixed: '#e2dfff'
  tertiary-fixed-dim: '#c3c0ff'
  on-tertiary-fixed: '#0f0069'
  on-tertiary-fixed-variant: '#3323cc'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  stack-sm: 0.5rem
  stack-md: 1.5rem
  stack-lg: 2.5rem
---

## Brand & Style

This design system embodies a **Modern Corporate** aesthetic tailored for the education sector. It balances professional reliability with an approachable, clean interface. The brand personality is studious, organized, and encouraging, focusing on high legibility and clear user pathways.

The visual style utilizes a "Split-Screen" narrative for high-impact entry points, pairing lifestyle imagery with a functional, white-space-heavy interaction area. It prioritizes clarity over decorative elements, using purposeful color accents and soft geometry to reduce cognitive load for students and educators alike.

## Colors

The color palette is anchored by a vibrant **Success Green** as the primary action color, symbolizing growth and progress. 

- **Primary (#12A150):** Reserved for main call-to-action buttons, active tab indicators, and positive feedback states.
- **Secondary (#002B5B):** Used for headlines and high-level navigation to provide a grounded, academic feel.
- **Tertiary (#4F46E5):** An accent for text links (e.g., "Forgot Password") to distinguish interactive text from static labels.
- **Neutral Palette:** Utilizes a range of cool grays for borders (#D1D5DB) and subtle backgrounds (#F3F4F6) to maintain a crisp, airy environment.

## Typography

The system uses a pairing of **Plus Jakarta Sans** for display roles and **Inter** for functional/body text. 

Headlines are bold and dark to establish immediate hierarchy. Body copy uses generous line height (1.5x) to ensure readability during long study sessions. Labels for form fields are consistently sized at 14px with semi-bold weights to remain distinct from user-inputted data. Interactive labels (links) use the tertiary color to signal clickability without needing an underline.

## Layout & Spacing

The design system employs a **50/50 Split-Screen** model for primary entry pages (Login/Sign-up). On desktop, the left side is reserved for immersive media, while the right side houses a centered, high-density form container.

- **Breakpoints:** Transitions from a side-by-side split to a single-column vertical stack at 1024px.
- **Form Layout:** Components follow a strict vertical rhythm. Inputs are stacked with 1.5rem (24px) spacing. Labels are pinned to the top of the input with a 0.5rem (8px) gap.
- **Grids:** Inside the form container, a simple 1-column grid is used for mobile, occasionally shifting to a 2-column grid for short, related inputs on desktop.

## Elevation & Depth

This system favors **Flat Layering** and **Low-Contrast Outlines** over heavy shadows. 

- **Surface 0:** The main background is pure white (#FFFFFF).
- **Surface 1:** Form inputs and containers use a 1px solid border (#D1D5DB).
- **Active State:** Focused inputs use a 2px primary green border or a subtle outer glow to indicate activity.
- **Tonal Depth:** Role switchers (e.g., Student/Teacher) use a subtle neutral background tint to create a "recessed" well effect for the toggle.

## Shapes

The shape language is consistently **Rounded**, creating a soft and approachable interface. 

- **Standard Elements:** Buttons, input fields, and cards use a 0.5rem (8px) corner radius.
- **Selection Components:** Role switchers and small chips use a more pronounced 0.75rem (12px) radius to differentiate them from functional inputs.
- **Icons:** Enclosed within circular or soft-square containers to maintain the friendly visual metaphor.

## Components

### Buttons
- **Primary:** Solid green background with white text. High contrast, full-width on mobile.
- **Secondary/Social:** White background with a 1px neutral border. Used for third-party auth (e.g., Google).
- **Ghost:** No border or background, using tertiary color text for low-priority actions like "Forgot Password."

### Form Inputs
- **Text Fields:** 1px gray border, 12px internal padding. Icons (e.g., lock, mail) are placed on the left, set in a light neutral color.
- **Selection Toggles:** A segmented control style for high-level role switching, using a white "pill" on a gray track.

### Navigation Elements
- **Tabs:** Underlined style with the primary green indicating the active state. Labels use semi-bold weight for clarity.

### Feedback
- **Checkboxes:** Standard rounded-square with a green fill when checked. Always paired with a 14px label.