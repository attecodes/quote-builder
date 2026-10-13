# Quote Builder

On-site quoting for finish carpentry and deck work. Enter a few measurements on your phone, get a price broken into labor, materials, and fees, with side-by-side options the client can pick from (wood vs. cable vs. glass handrail).

Built by a working finish carpenter, using an **agentic software factory**: AI agents write most of the code, and a strict, automated quality pipeline decides what's allowed to ship.

## How the factory works

```
 GitHub issue  ──label "agent:build"──▶  Implementer agent (Claude Code)
                                              │  reads CLAUDE.md rules
                                              │  writes code + tests
                                              ▼
                                         Pull request
                                              │
               ┌──────────────────────────────┼──────────────────────────────┐
               ▼                              ▼                              ▼
     Quality pipeline (CI)            AI reviewer (fresh context)      Screenshots
     lint · strict types ·            pricing rules · shortcuts ·      phone viewport
     complexity · duplication ·       weakened tests ·                 attached to run
     dead code · unit · e2e           blast radius
               └──────────────────────────────┼──────────────────────────────┘
                                              ▼
                                   Human merges (for now)
```

- **Rules live in `CLAUDE.md`.** Architecture, money rules, testing rules.
- **Deterministic checks, not vibes.** ESLint complexity limits, strict TypeScript, jscpd (duplicate code), knip (dead code), Vitest for pricing math, Playwright end-to-end tests on a phone viewport.
- **Turn limit.** The implementer stops after 40 turns and hands back to a human instead of looping.
- **Blast radius.** The reviewer labels each PR small / medium / large so I know which ones need a real look.

## Run it locally

```bash
npm install
npx playwright install chromium   # first time only
npm run dev                        # http://localhost:3000
npm run quality                    # all static checks + unit tests
npm run test:e2e                   # end-to-end tests with screenshots
```

## Project layout

```
src/domain/        pricing engine (pure TypeScript, fully tested)
  priceBook.ts     every price and production rate, in one place
  assemblies/      one file per job type (deck re-board, handrail, ...)
src/components/    React UI
e2e/               Playwright tests
.github/workflows  quality pipeline, implementer agent, AI reviewer
```
