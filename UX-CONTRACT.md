# UX Contract

## Product context

- Audience: UK adults building sustainable nutrition habits.
- Primary jobs: complete onboarding, log and update meals, understand nutrition totals, review progress, and manage goals.
- Target market: United Kingdom.
- Active locale: `en-GB`.
- Timezone/calendar policy: user-owned IANA timezone; Monday-first weeks.
- Accessibility target: WCAG 2.2 AA.

## Business-context sources

The current user brief is authoritative for onboarding, a 30-day soft-delete recovery period, meal replacement semantics, and goal-pacing warnings. The database schema and authenticated repositories enforce ownership.

## Visual contract

- Project design source: `DESIGN.md`.
- Runtime token owner: `app/globals.css`.
- Supported themes: light/dark with cranberry, ocean, forest, amber, or plum primary colour.

## Canonical UI Map

| Capability | Canonical owner | Allowed variants | Verification |
|---|---|---|---|
| Select/Listbox | Native select when OS popup is acceptable | native | keyboard + mobile |
| Date | Native date input | native | locale + keyboard |
| Form | Zod schema plus shared fields | create / edit / wizard | unit + browser |
| Scrollbar | `app/globals.css` | stable-gutter exception | computed style |
| Toast | Sonner provider | success / error | live-region inspection |
| CRUD | feature action/service/repository or route handler | create / replace / soft-delete | unit + route flow |

## Flow ledger

| Operation | Trigger | Pending | Success destination | Success feedback | Failure recovery |
|---|---|---|---|---|---|
| Add meal | Save meal | Stable busy button | Selected Meals date | Meal added toast | Preserve staged entries |
| Update meal | Save changes | Stable busy button | Selected Meals date | Changes saved toast | Preserve edited entries |
| Delete meal | Delete meal | Confirmed busy action | Selected Meals date | Meal deleted toast | Dialog error and retry |
| Complete onboarding | Save plan / Create account | Stable busy button | Dashboard or registration | Plan saved status | Preserve browser draft |
| Update settings | Changed control | Local pending state | Stay in Settings | Changes saved toast | Revert and explain |
| Soft-delete account | Delete account | Confirmation dialog | Public home | Signed-out acknowledgement | Keep account active on failure |

## Navigation and responsive behavior

Desktop authenticated routes use a persistent sidebar; mobile routes use bottom navigation. Route state stays in search parameters for dates and dashboard period. Add and update recompose from two columns to a single mobile flow with the staged nutrition summary before the food list.

## Overlays and feedback

Use the shared Base UI dialog. Destructive account and meal deletion require explicit app-owned confirmation. Toasts acknowledge server-confirmed success; field and form errors remain inline. Unsaved meal edits require confirmation before an in-app destructive exit when technically available.

## Async and resilience

Mutations are pessimistic and duplicate submission is blocked. Food search ignores stale responses. Client drafts remain in memory for meal editing and local storage for guest onboarding. Failed mutations preserve input and provide retry. Server ownership checks remain authoritative.

## Validation

Zod owns boundary validation. Forms use `noValidate`, retain values, expose associated inline errors, and focus the first invalid field where supported. Goal rates above NHS guidance remain selectable up to 2 kg/week but display a persistent warning; generated energy adjustments remain conservatively capped.

## Verification

Run lint, TypeScript, unit tests, production build, premium static audit, keyboard checks, narrow and desktop browser checks, dark/theme checks, and empty/error/staged states. The Add meal workflow is the canonical sibling for Update meal.
