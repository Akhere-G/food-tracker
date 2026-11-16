---
version: alpha
name: "FoodTracker"
description: "A warm nutrition ledger that helps people return to sustainable progress without shame."
colors:
  canvas: "oklch(0.985 0.008 60)"
  ink: "oklch(0.22 0.015 25)"
  surface: "oklch(1 0 0)"
  cranberry: "oklch(0.52 0.16 25)"
  sage: "oklch(0.57 0.10 135)"
  amber: "oklch(0.70 0.14 75)"
  danger: "oklch(0.577 0.22 27)"
  border: "oklch(0.91 0.012 35)"
typography:
  sans:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
  display:
    fontFamily: "Lora, Georgia, serif"
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
rounded:
  DEFAULT: "0.75rem"
  sm: "0.45rem"
  md: "0.75rem"
  lg: "1rem"
spacing:
  section-gap: "2rem"
  page-max: "90rem"
components:
  button: {}
  field: {}
  dialog: {}
  ledger: {}
  chart: {}
---

# FoodTracker Design System

## Overview

### Creative North Star

FoodTracker feels like a well-kept kitchen ledger: calm paper-like surfaces, precise rules, useful annotations, and a warm human voice. The interface is for people returning after difficult or inconsistent attempts, so it values continuity over streaks.

### Product context and register

- **Audience and primary job:** London adults aged 20–30 tracking nutrition and sustainable weight goals after previous attempts felt difficult.
- **Target market:** United Kingdom, established by the product brief and approved mockups.
- **Locale:** English (`en-GB`) with user-owned IANA timezone and Monday-first weeks.
- **Usage scene:** Frequent mobile meal logging with deeper progress and settings work on mobile or desktop.
- **Register:** Hybrid. The public home page carries more brand expression; authenticated routes prioritise familiar product behaviour.
- **Memorable signature:** A restrained serif insight paired with the bowl-and-spoon mark.
- **Restraint:** Forms, meal editing, settings, warnings, and destructive actions remain conventional and direct.
- **Anti-references:** No fitness-bro urgency, shame, gamified streak pressure, glass effects, card grids, or decorative gradients.
- **Token ownership:** `app/globals.css` is the canonical runtime source. This file mirrors accepted semantic tokens and intent.

## Colors

Cranberry is the brand and primary-action colour. Sage communicates progress and supportive status; amber distinguishes carbohydrate data. Text and status never depend on hue alone. The five selectable themes remap the primary semantic role while retaining danger and chart meaning. Dark mode uses independently tuned surfaces and contrast.

## Typography

Inter is the body and control face. Lora is reserved for page titles, primary totals, and short supportive insights. Geist Mono supports compact technical values when needed. Data uses tabular numerals, sentence case, and `en-GB` formatting.

## Layout

Authenticated desktop routes use a persistent 15rem navigation rail and a fluid content canvas capped at 90rem. Mobile routes use document scrolling and a fixed bottom navigation with safe-area padding. Dense desktop rows recompose into labelled stacks rather than shrinking. Forms use a main work area plus summary rail above 64rem and a single column below it.

## Elevation & Depth

Hierarchy comes from spacing, tonal surfaces, and fine rules. Static content is flat. Dialogs and mobile sticky controls may use one subtle shadow to communicate layering. Blur and glass are prohibited.

## Shapes

Controls use the shared medium radius. Large panels use the large radius only when containment is necessary. Progress tracks and small status labels may be pill-shaped. Dividers are one-pixel semantic borders.

## Components

### Foundational visual states

Every control provides default, hover, focus-visible, active, disabled, busy, selected, warning, and error treatment as applicable. Focus uses a visible semantic ring. Reduced motion removes non-essential transitions.

### Buttons and actions

Primary cranberry buttons are limited to one per decision region. Secondary actions are outlined or quiet. Destructive actions are separated from safe actions and use explicit verbs. Busy buttons retain their geometry.

### Navigation and data display

Navigation labels remain visible on desktop and pair icons with text on mobile. Nutrition totals use consistent Calories, Protein, Carbohydrate, and Fat order. Charts provide visible labels and adjacent text summaries.

### Forms and overlays

Fields keep persistent labels, 16px mobile text, inline help, and associated errors. Product forms own validation with `noValidate`. Dialogs use the shared Base UI primitive with focus containment and restoration.

### Iconography

Lucide supplies functional icons at a consistent 1.75px stroke. Icons supplement text except in established mobile navigation, where accessible labels remain present.

### Motion

Motion is limited to fast state feedback and dialog transitions. It is interruptible and disabled under `prefers-reduced-motion`.

### Content and data visualization

The voice is practical, specific, and non-judgmental. Missed days are neutral gaps. Progress copy recognises returning rather than perfection. Numeric targets show units and their comparison basis.

## Do's and Don'ts

- **Do:** Keep totals visible in empty and staged states.
- **Do:** Reuse the same meal editor, nutrition summary, and action vocabulary across create and update.
- **Don't:** hide safety guidance or turn health estimates into certainty.
- **Don't:** use uniform card grids, excessive pills, gradients, or shame-based streak language.
