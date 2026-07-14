---
name: Lumina Learning System
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
  on-surface-variant: '#43474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#006e2f'
  on-secondary: '#ffffff'
  secondary-container: '#6bff8f'
  on-secondary-container: '#007432'
  tertiary: '#001f4b'
  on-tertiary: '#ffffff'
  tertiary-container: '#003374'
  on-tertiary-container: '#6a9dff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
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
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
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
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is built to balance the rigorous authority of higher education with the delightful, frictionless experience of modern consumer apps. It targets lifelong learners and students who value professional growth but require an interface that feels encouraging rather than clinical.

The aesthetic blends **Modern SaaS** efficiency with **Glassmorphism**. It utilizes soft, layered depth and high-transparency surfaces to create an atmosphere of clarity and openness. Visual metaphors emphasize momentum and achievement, ensuring that every interaction feels like a step forward in a learner's journey.

## Colors

The palette is anchored by **Deep Educational Blue** (#1A365D), providing a sense of stability, institutional trust, and depth. This is contrasted by **Vibrant Progress Green** (#22C55E), reserved strictly for success states, completion markers, and primary "Growth" actions to trigger positive psychological reinforcement.

**Clean Off-Whites** form the foundation of the UI, using a range of cool grays and slates for backgrounds to reduce eye strain during long study sessions. **Accent Blue** (#3B82F6) is used for interactive elements like links and primary buttons to maintain a cohesive, professional SaaS feel.

## Typography

This design system relies exclusively on **Inter** for its exceptional legibility and neutral, modern character. The type scale is generous, prioritizing high contrast between headings and body text to facilitate quick scanning of educational content.

For long-form reading, `body-lg` is preferred to maintain a premium, editorial feel. Labels use slightly tighter tracking and heavier weights to distinguish them from instructional text. Headlines utilize negative letter spacing to feel more "locked-in" and authoritative at larger scales.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a focus on generous whitespace to prevent cognitive overload. We use a 12-column grid for desktop, transitioning to a 4-column grid for mobile.

- **Desktop (1024px+):** 12 columns, 24px gutters, 40px side margins.
- **Tablet (768px - 1023px):** 8 columns, 20px gutters, 32px side margins.
- **Mobile (Up to 767px):** 4 columns, 16px gutters, 16px side margins.

Vertical rhythm is strictly maintained using multiples of 8px. Large sections (e.g., Course Modules) are separated by 64px or 80px to give the content "room to breathe," mimicking the layout of a premium textbook or high-end magazine.

## Elevation & Depth

This design system uses **Glassmorphism** and **Tonal Layers** to establish hierarchy. Surfaces do not just "sit" on the background; they appear to float within a pressurized environment.

- **Level 0 (Background):** Subtle gradients or solid off-whites.
- **Level 1 (Cards):** Semi-transparent white (#FFFFFF at 70-80% opacity) with a `backdrop-filter: blur(12px)`. These feature a thin, 1px white border at 20% opacity to define edges against vibrant backgrounds.
- **Level 2 (Modals/Popovers):** Deeper blurs and soft, multi-layered shadows (0px 10px 30px rgba(0,0,0,0.05)).
- **Level 3 (Active Elements):** High-contrast shadows with a slight tint of the primary blue to indicate focus and interactivity.

## Shapes

The shape language is overtly **Rounded**, signaling approachability and safety.
- **Standard UI elements** (Inputs, Buttons): 0.5rem (8px).
- **Cards and Containers**: 1rem (16px).
- **Feature/Promo Sections**: 1.5rem (24px).

Large corner radii are essential to the "friendly" aesthetic, softening the technical nature of the SaaS platform and aligning with modern EdTech trends.

## Components

### Buttons
Primary buttons use a subtle vertical gradient from the Accent Blue to a slightly darker shade, featuring a "squishy" hover effect (slight scale up and increased shadow). Secondary buttons use the Glassmorphism style—semi-transparent with a border.

### Progress Trackers
Directly inspired by the need for "Duolingo-level friendliness," progress bars are thick (12px+) with fully rounded caps. They use the Vibrant Progress Green for completed sections and a soft pulse animation for active modules.

### Input Fields
Fields feature a solid off-white background that transitions to a white background with a primary blue border on focus. Labels sit permanently above the field in `label-md` for maximum accessibility.

### Cards
All cards must implement the glass backdrop-filter. For "Course Cards," the image occupies the top half with a 16px internal padding for content below. Hovering over a card should trigger a 4px upward translation and a more pronounced backdrop blur.

### Chips
Used for categories and tags. They use a low-saturation version of the primary or tertiary colors with a "pill" radius (32px) to distinguish them from actionable buttons.