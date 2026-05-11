---
name: Rideio Core
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
  on-surface-variant: '#47464f'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#787680'
  outline-variant: '#c8c5d0'
  surface-tint: '#5b598c'
  primary: '#070235'
  on-primary: '#ffffff'
  primary-container: '#1e1b4b'
  on-primary-container: '#8683ba'
  inverse-primary: '#c4c1fb'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#6df5e1'
  on-secondary-container: '#006f64'
  tertiary: '#000b1b'
  on-tertiary: '#ffffff'
  tertiary-container: '#142234'
  on-tertiary-container: '#7b8aa0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c4c1fb'
  on-primary-fixed: '#181445'
  on-primary-fixed-variant: '#444173'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#d5e3fc'
  tertiary-fixed-dim: '#b9c7df'
  on-tertiary-fixed: '#0d1c2e'
  on-tertiary-fixed-variant: '#3a485b'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
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
  xl: 32px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style

The brand personality is anchored in the concept of "Guided Reliability." For the Bangladeshi market, where ride-sharing requires high levels of trust and safety, this design system adopts a **Corporate / Modern** style with **Minimalist** influences. 

The visual language balances the authority of a financial institution with the accessibility of a community tool. It avoids unnecessary decorative elements, focusing instead on high-contrast utility and clear hierarchy. The goal is to evoke a sense of calm and order in the often chaotic urban transit environment of Bangladesh. The interface should feel "quiet" yet "capable," utilizing purposeful whitespace to reduce cognitive load for users navigating busy streets.

## Colors

This design system utilizes a high-contrast palette to ensure legibility and accessibility across various mobile screen qualities. 

- **Primary (Deep Indigo):** Reserved for core branding, navigation headers, and primary typography. It establishes a foundation of security and professionalism.
- **Accent (Electric Teal):** Used exclusively for interactive elements, successful states, and "Call to Action" (CTA) buttons. This color serves as the "pathfinder" throughout the application.
- **Background & Neutrals:** The off-white background (#F8FAFC) minimizes glare, while Slate Gray (#475569) is utilized for secondary text to maintain a soft but readable contrast ratio.
- **Semantic Colors:** Error states should utilize a muted red, and warnings a warm amber, ensuring they do not clash with the Electric Teal accent.

## Typography

The design system relies on **Inter** for all typographic needs. Chosen for its exceptional tall x-height and readability on small screens, it provides the "utilitarian" feel necessary for a service-based platform.

- **Headlines:** Use Deep Indigo with Bold (700) or Semi-Bold (600) weights to create a strong information hierarchy.
- **Body Text:** Use Slate Gray with Regular (400) weight for long-form content to prevent visual fatigue.
- **Labels:** Uppercase styles should be used sparingly for secondary metadata or section headers in the settings panel to create distinction without increasing font size.

## Layout & Spacing

This design system employs an **8px linear grid** to maintain a consistent rhythmic scale. 

- **Grid System:** On mobile, a 4-column fluid grid is used with 20px outer margins. On desktop/tablet, a 12-column fixed grid is used with a maximum content width of 1200px.
- **Rhythm:** Vertical spacing between unrelated sections should use `xl` (32px), while spacing between elements within a card or group should use `sm` (8px) or `md` (16px).
- **Safe Areas:** Special attention must be paid to bottom-sheet interactions and thumb-zones, ensuring that Electric Teal CTAs are always within easy reach.

## Elevation & Depth

To convey a sense of organization and "layered" information, the design system uses **Tonal Layers** combined with **Ambient Shadows**.

- **Level 0 (Base):** Off-white (#F8FAFC) background.
- **Level 1 (Cards/Sheets):** Pure white (#FFFFFF) surfaces with a subtle, low-opacity shadow (Color: #1E1B4B at 4%, Blur: 8px, Y: 4px).
- **Level 2 (Popovers/Modals):** Pure white surfaces with a more pronounced shadow (Color: #1E1B4B at 10%, Blur: 16px, Y: 8px).

Depth is used functionally: anything the user can interact with or slide (like a booking sheet) should sit at Level 1 or 2. Map-based backgrounds always sit at Level 0.

## Shapes

The shape language is **Rounded**, reflecting the "community-focused" personality of the brand.

- **Standard Elements:** Buttons, input fields, and cards use a 0.5rem (8px) radius.
- **Large Containers:** Bottom sheets and prominent promotional banners use a 1rem (16px) radius on top corners to create a friendly, approachable feel.
- **Small Elements:** Tooltips and tags use a 0.25rem (4px) radius to maintain clarity at small scales.

## Components

### Buttons
- **Primary:** Electric Teal background with white text. High-contrast, 0.5rem radius, used for "Confirm Ride" or "Payment."
- **Secondary:** Deep Indigo outline with Deep Indigo text. Used for "Cancel" or "View History."

### Input Fields
- **Default:** Light gray border (#E2E8F0) with a 0.5rem radius.
- **Focused:** Electric Teal border (2px width) to provide clear feedback.
- **Payment Integration:** SSLCommerz-specific inputs should maintain the brand’s typography while including the SSLCommerz logo lockup for trust.

### Cards
- Used for "Trip Summaries" and "Ride Offers." They must feature a white background and Level 1 elevation. Information should be grouped using 16px internal padding.

### Chips & Status Tags
- **Verified User:** A small tag with a Deep Indigo background and a white checkmark icon to signify community trust.
- **Active Trip:** A light Teal tint background with Electric Teal text.

### Payment Section
- Dedicated module for SSLCommerz. Ensure that the "Pay Now" button is the most prominent element on the screen, utilizing the Electric Teal accent to drive conversion.

This is my design system for rideio. can you recreate the logo with this color system compatibality?