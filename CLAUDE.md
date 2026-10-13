# Quote Builder — rules for agents

@AGENTS.md

A mobile-first quoting tool for finish carpentry and deck work. A contractor stands on a job site, enters a few measurements, and gets a price with labor, materials, fees, and client-selectable options (e.g. wood vs. glass handrail).

## Architecture (do not blur these lines)

- `src/domain/` — all pricing logic. Pure TypeScript functions, no React, no I/O.
  - `types.ts` — Quote, Section, LineItem, OptionGroup.
  - `money.ts` — cents helpers and hour rounding.
  - `totals.ts` — the ONLY place line costs and totals are calculated.
  - `priceBook.ts` — the ONLY place prices and production rates live.
  - `assemblies/` — one file per job type. An assembly turns measurements into a `Section` (fixed scope) or an `OptionGroup` (client choices).
- `src/components/` — React UI. Components call domain functions; they never do pricing math themselves.
- `src/app/` — Next.js routes only. Keep pages thin.

## Money rules (non-negotiable)

- Money is integer cents (`Cents`). Never store or add dollars as floats. Use `dollars()` to convert input.
- Labor hours are rounded up to the quarter hour with `roundHours()`.
- Material markup is applied in `lineCost()` only. Never apply it twice.
- Never hard-code a price or rate outside `priceBook.ts`.

## Adding a new job type

1. Add any new prices/rates to `PriceBook` and `DEFAULT_PRICE_BOOK` (mark placeholders clearly).
2. Create `src/domain/assemblies/<jobType>.ts` exporting one function that returns a `Section` or `OptionGroup`.
3. Add unit tests in `src/domain/*.test.ts` for the measurement math (counts, rounding, edge cases like zero).
4. Wire it into the UI and add one Playwright test in `e2e/` proving the total moves the right direction.

## Testing

- Unit tests (Vitest) are ONLY for domain math. Do not write unit tests for React components.
- Behavior is proven with Playwright end-to-end tests in `e2e/`, run on a phone viewport. Use `data-testid` selectors.
- When you change UI, save a screenshot in your e2e test to `test-results/screens/<name>.png`.
- Never change an expected value in an existing test to make it pass. If a test is wrong, say why in the PR.

## Before you open a pull request

Run `npm run quality` and fix everything it reports. Then run `npm run test:e2e`.
The pipeline enforces: ESLint (complexity <= 10, functions <= 80 lines, files <= 250 lines), strict TypeScript, no duplicated code (jscpd), no unused exports or files (knip).
If a limit is in your way, split the code; do not disable the rule.

## Style

- Small files, small functions, named exports.
- No comments that restate the code or the issue title. Comment only *why* something non-obvious is done.
- Delete code you replace. Do not leave unused exports, files, or dependencies.
- Labels in the UI use field language a contractor would say ("Sister / reframe joists", "Dump fee"), not developer words.

## Pull request description

Keep it short: what changed, the blast radius (small / medium / large, see `.github/workflows/agent-review.yml`), and screenshots for any UI change.
