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

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native select when OS popup is acceptable | `OnboardingFields` | native | keyboard + mobile |
| Date | Native date input | `MealEditor` | native | locale + keyboard |
| Form | Zod schema plus shared fields | feature schemas | create / edit / wizard | unit + browser |
| Scrollbar | Global inherited theme | `app/globals.css` | stable-gutter exception | computed style |
| Toast | Sonner provider | root layout | success / error | live-region inspection |
| CRUD | Feature server action/service/repository | meal feature | create / replace / soft-delete | unit + action flow |
| Loading | `Skeleton` + `LoadingRegion` | shared UI primitives and feature skeletons | page / session shell / food lookup | accessibility + slow-response browser checks |

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

Initial page/session reads and onboarding draft restoration use skeletons shaped to the pending content. Route `loading.tsx` files cover authenticated pages and Login/Register; onboarding keeps its header visible with a local Suspense fallback. Food search and serving-size reads use local skeletons while preserving the query and selected food. Loading shapes are decorative, non-interactive, theme-aware, and static under reduced motion, with one screen-reader status per region. Date and reporting-period changes retain existing data until the new response arrives; mutations retain their inputs and busy buttons. Static public pages render directly without an artificial loading delay.

## Validation

Zod owns boundary validation. Forms use `noValidate`, retain values, expose associated inline errors, and focus the first invalid field where supported. Users may choose weight-change goals up to 2 kg/week; goals above 1 kg/week display a persistent safety warning without overriding the selected pace.

## Verification

Run lint, TypeScript, unit tests, production build, premium static audit, keyboard checks, narrow and desktop browser checks, dark/theme checks, and empty/error/staged states. The Add meal workflow is the canonical sibling for Update meal.
