# Chongoyape Bizcochuelos Reverse-Engineering Lab — Worklog

---
Task ID: 0
Agent: main (Z.ai Code)
Task: Phase 0 — Memory & existing-evidence audit, multi-round pre-research, contradiction detection, and project scaffolding for the Chongoyape Bizcochuelos reverse-engineering lab website.

Work Log:
- Read previous research report `/home/z/my-project/upload/deep-research-report-2.md` (provisional evidence).
- Ran forensic VLM analysis on product image `/home/z/my-project/upload/DB2A22A1-1235-4758-95B6-4F54BF6428C5.jpeg`.
- Ran 5 targeted web searches (corroboration, counter-hypothesis, recipe baseline, bizcotela distinction, chuño function, wood-oven contribution).
- Detected major contradictions between previous report and VLM observation (see below).
- Designed Prisma schema for lab entities (claims, ingredients, techniques, substitutions, recipe variants, validation rounds, complexity log, research rounds).
- Built Next.js lab website with full evidence console, ledgers, recipe lab, validation dashboard, challenge/parsimony verdict.

Stage Summary — Key contradictions found in previous report (provisional evidence treated as UNVERIFIED):
1. **Product form**: Previous report claimed "rectangular sponge cake slices, 16 per tray (4x4 grid), flat top". VLM observes **individual round/oval domed cakes (~6.5 cm dia × ~3.5 cm tall), ~4 per tray (2×2), distinctly domed/pebbled surface**. The "16 Bizcochuelos" label likely refers to a multi-tray pack, not a single 4×4 slab. → Target product redefined as individual round domed cakes.
2. **Color**: Previous report "pale golden". VLM observes **deep golden-amber to light caramel brown** with Maillard concentration on dome apex. → Higher sugar and/or longer bake than previously assumed.
3. **Recipe complexity**: Previous report's "replicated recipe" loads 8 eggs + 200 g sugar + 200 g flour + 100 g starch + 10 g baking powder + vanilla + salt simultaneously — a direct violation of the parsimony protocol. → Rebuilt from foam-only baseline (eggs + sugar + flour + salt). All other ingredients demoted to diagnostic/speculative variants.
4. **Wood-oven interpretation**: Previous report implied wood oven ≈ 180 °C and "likely flavor". Popular sources claim BOTH thermal and smoke contributions. → Smoke is now a SEPARATE untested variable; core recipe is unsmoked control.

Corroborated findings (independent sources):
- Valera family + Chongoyape + wood-fired clay oven ("horno tradicional de barro", leña) — confirmed by RPP Noticias video + multiple Facebook/YouTube/TikTok posts + Restaurant Guru listing (4.6 rating).
- Bizcotela = alfajor-style sandwich with manjar blanco; bizcochuelo = plain sponge. Image shows plain bizcochuelos. Target confirmed.
- Foam-only sponge baseline is technically viable and traditional (8 eggs/245 g sugar/245 g flour, beat 10 min, 180 °C, 45 min — no chemical leavener).

Decisions changed:
- Core recipe = minimal egg–sugar–flour–salt foam, whole-egg whipping to ribbon stage, baked in individual round molds.
- Baking powder, chuño/cornstarch, fat, vanilla, citrus zest, smoke, algarrobina all moved to diagnostic/speculative branches pending controlled testing.
- Image-derived target metrics: round domed, ~6.5 cm, deep golden-amber, fine crumb, no filling/icing/liners.

Artifacts produced:
- `/home/z/my-project/upload/vlm-analysis.json` (forensic image analysis)
- `/home/z/my-project/upload/search1–5.json` (web research)
- Prisma schema with 8 lab models
- Seed data with full ledgers, recipe variants, validation rounds
- API routes under `/api/lab/*`
- Single-page lab website at `/` with 12 major sections

Next phase priorities:
- Run controlled kitchen tests of baseline vs diagnostic variants (cannot be executed in this environment — documented as predicted results with explicit acceptance criteria).
- Resolve round-vs-rectangular discrepancy by sourcing a second product image / video frame.
- Verify smoke perceptibility via unsmoked vs smoked triangle test design.

---
Task ID: 0 (completion)
Agent: main (Z.ai Code)
Task: Finalize Phase 0 — build, verify, and document the Chongoyape Bizcochuelos Reverse-Engineering Lab website.

Work Log:
- Set up Prisma schema with 9 lab models (Claim, Ingredient, Technique, Substitution, RecipeVariant, ValidationRound, ComplexityLog, ResearchRound, FailureTest) and pushed to SQLite.
- Wrote comprehensive seed script (prisma/seed.ts) populating: 15 claims, 12 ingredients, 16 techniques, 8 substitutions, 9 recipe variants (across 4 levels), 6 validation rounds, 9 complexity-log entries, 6 research rounds, 14 failure tests.
- Built aggregate API route GET /api/lab returning all ledgers + summary stats + convergence status.
- Designed warm amber/ochre theme in globals.css (matching the product's golden color); NO blue/indigo per rules.
- Built 12 lab section components under src/components/lab/: hero, nav-bar, research-rounds, evidence-console, claims-ledger, ingredient-ledger, technique-ledger, substitution-matrix, recipe-lab, validation-dashboard, complexity-log, verdict, footer — plus shared types/badges/section-header.
- Composed single-page lab at src/app/page.tsx (the only user-visible route) with sticky nav, sticky footer (min-h-screen flex flex-col + flex-1 main), loading skeleton, and error state.
- Ran ESLint: 0 errors, 0 warnings after cleanup.
- Started dev server (port 3000): HTTP 200 on / and /api/lab.
- Agent Browser self-verification:
  * Page renders with hero, status cards (4/15 claims, 4/6 validations, 1/2 convergence), product image, and all 11 sections.
  * Nav scroll-spy works (active section highlights).
  * Recipe Lab interactivity verified: clicking "Diagnostic B — Whole-Egg vs Separated-Egg Foam" updates the detail panel with its question, single variable, success/abandonment criteria, ingredients, and steps.
  * Footer verified at bottom with all 3 columns (lab description, honesty & limits, sources) + bottom bar.
  * VLM QA on full-page screenshot: "high visual quality and professionalism", "warm amber/ochre theme consistent throughout", "exceptionally well-organized", "no major layout issues", "footer correctly positioned at the very bottom".

Stage Summary:
- Final deliverable: a production-ready Next.js 16 single-page "Chongoyape Bizcochuelos Reverse-Engineering Lab" at /.
- The lab presents the complete research programme: 6 pre-research rounds, forensic VLM evidence console with contradiction ledger, 15-claim ledger with confidence ratings, 12-ingredient decision ledger, 16-technique ledger (core/optional/rejected), 8-row substitution matrix, 9-variant recipe lab (4-level hierarchy: core / substitution / diagnostic / speculative), 6-round validation dashboard, 14-entry failure-test spec, 9-entry complexity-removal log, and a final challenge-and-parsimony verdict with convergence status and remaining questions.
- Core recipe: foam-only control (240 g eggs · 150 g sugar · 150 g flour · 1.5 g salt), whole-egg whip to ribbon stage, 180 °C, ~22-26 min in 7 cm round molds. All uncertain ingredients (baking powder, starch, fat, vanilla, smoke, algarrobina) held in diagnostic/speculative branches.
- Convergence: 1/2 quiet rounds — not yet converged (kitchen execution required to convert predicted checks to tested).

Current project status:
- Stable and complete for Phase 0. Dev server running on port 3000.
- All acceptance tests from the protocol are satisfied EXCEPT kitchen execution (documented as predicted, not testable in this environment).

Unresolved / next-phase priorities:
1. Cannot execute kitchen tests in this environment — the recipe-lab predicted checks (color, rise, crumb, day-two texture) remain predicted until a real bake.
2. Mobile-viewport verification was limited (agent-browser --viewport did not resize the active session); responsive classes are standard Tailwind (hidden lg:flex / lg:hidden) and should work, but a real mobile-device check is recommended.
3. A second product image / video frame would resolve the 4-vs-16 piece count discrepancy.
4. The convergence loop needs one more quiet round after kitchen fault-testing to formally converge.

---
Task ID: 1 (cron webDevReview round 1)
Agent: main (Z.ai Code)
Task: QA assessment, bug fixes, styling improvements, and new feature development for the Chongoyape Bizcochuelos Reverse-Engineering Lab.

Work Log:
- Reviewed worklog.md to understand Phase 0 completion status.
- QA assessment via agent-browser: dev server stable (HTTP 200, ~30ms), lint clean (0 errors), all 12 sections rendering.
- VLM QA on 4 section screenshots identified opportunities (not bugs): hero hyphenation, data density, chart visualizations.
- Fixed critical bug: API returned `stronglySupported` (camelCase) but chart accessed `strongly-supported` (kebab-case), causing the donut chart to miss 3 strongly-supported claims and show "8% corroborated" instead of "27%". Fixed API key to kebab-case; updated hero.tsx references. Now correctly shows 4/15 (27%).

New features added:
1. **Reading Progress Bar** (reading-progress.tsx): thin fixed bar at top showing scroll progress + a section label chip that updates via IntersectionObserver scroll-spy.
2. **Back-to-Top Button** (back-to-top.tsx): floating amber button that appears after 600px scroll, with smooth scroll-to-top.
3. **Interactive Recipe Scaler** (recipe-scaler.tsx): slider (1-24 cakes) that linearly scales the core recipe's ingredient grams in real-time, with visual ratio bars, baker's percentages, total batter count, and egg count estimate. Includes Print button with print CSS.
4. **Claims Confidence Donut Chart** (claims-chart.tsx): recharts donut showing the distribution of all 15 claims by confidence level, with center label showing % corroborated, color-coded legend with counts and percentages.
5. **Validation Radar Chart** (validation-radar.tsx): recharts radar visualizing the 6 validation lenses (structural, historical, target-match, Lima-practicality, adversarial, parsimony) with weighted scores and tooltip showing pass/total counts.
6. **Convergence Tracker Card**: visual progress bar showing 1/2 quiet rounds with gradient fill and explanation.
7. **Glossary System** (glossary.tsx): searchable glossary card with 15 technical terms (punto cinta, chuño, Maillard, algarrobina, horno de barro, etc.) + inline GlossaryTooltip component for term highlighting.
8. **Section Reveal Animations** (section-reveal.tsx): subtle y-translate entrance animation on scroll (opacity kept at 1 for accessibility/SEO/screenshot compatibility).

Styling improvements:
- Hero: fixed "Reverse-Engineering" hyphenation (split into 3 lines, [hyphens:none]); added "live" pulse indicator; hover effects on CTA buttons (gap expansion + icon scale).
- Print CSS: @media print rules to hide nav/footer/charts and show only recipe content.
- Dotted divider utility class for decorative section separators.
- ClaimsLedger restructured to 2-column grid (ledger + chart sidebar) with count badge in filter bar.

Architecture changes:
- ClaimsLedger now accepts optional `sidebar` prop for the chart.
- ValidationDashboard now accepts optional `overview` prop for the radar + convergence card.
- page.tsx restructured to pass charts as props, eliminating duplicate section IDs.

Verification:
- ESLint: 0 errors, 0 warnings.
- Dev server: HTTP 200 on / and /api/lab.
- DOM verification: scaler ✓, slider ✓ (aria-valuenow=6, min=1, max=24), donut chart ✓, radar chart ✓, reading progress ✓, back-to-top ✓, glossary ✓ (15 terms), print button ✓.
- Slider interactivity: changed 6→7 cakes, total batter updated 541.5→631.8 g (correct linear scaling).
- Claims chart fix verified: hero now shows 4/15 (27%) corroborated.
- Full-page VLM QA: "All content is visible. The page is fully populated with text, data tables, charts (Donut and Radar), and images. There are no blank or empty sections."

Stage Summary:
- Phase 0 lab enhanced with 8 new interactive features and multiple styling improvements.
- Two data-visualization charts added (donut + radar) using the already-installed recharts library.
- Recipe Scaler provides genuine utility — users can scale the core recipe to any batch size.
- Glossary provides educational context for 15 technical terms.
- All animations are accessibility-safe (content always visible).
- A critical stats-key bug was found and fixed during QA.

Unresolved / next-phase priorities:
1. Kitchen tests still cannot be executed (predicted checks remain predicted).
2. The GlossaryTooltip inline component was created but not yet used in body text — could be added to ingredient/technique descriptions in a future round.
3. Print CSS exists but could be expanded to a full recipe-card print layout.
4. A "compare two variants side-by-side" feature could be added to the recipe lab.
5. Mobile viewport testing still limited (agent-browser --viewport didn't resize).

---
Task ID: 2 (cron webDevReview round 2)
Agent: main (Z.ai Code)
Task: QA assessment, styling improvements, and new feature development for the Chongoyape Bizcochuelos Reverse-Engineering Lab.

Work Log:
- Reviewed worklog.md (Tasks 0, 0-completion, 1) to understand project state.
- QA assessment: dev server stable (HTTP 200, ~38ms), lint clean (0 errors), DOM audit confirmed all 11 sections present, 6 donut sectors, 1 radar polygon, slider/progress/glossary all functional, no runtime errors, page height ~16,258px.
- VLM QA on 5 section screenshots (claims, ingredients, recipe, verdict, footer) identified improvement opportunities: ingredient ledger looked plain (needed alternating rows, bolder weights), recipe lab step numbers were small, footer lacked visual grounding, no protocol overview diagram.

New features added:
1. **Command Palette (Cmd+K)** (command-palette.tsx): power-user feature with ⌘K keyboard shortcut, search input, grouped navigation (all 11 sections + scroll-to-top), fuzzy search with keywords, tips section. Trigger button in nav bar with kbd hint.
2. **Protocol Flow Diagram** (protocol-flow.tsx): new section between hero and research rounds visualizing the governing sequence — Red → Green → Refactor → Validate → Converge — with 5 color-coded cards, arrow connectors (desktop), staggered reveal animations, and a loop indicator explaining the 2-quiet-rounds convergence rule.
3. **Skip-to-Content Link**: accessibility improvement, sr-only link that appears on focus, jumps to #main-content.

Styling improvements:
- **Ingredient Ledger**: alternating row backgrounds (idx % 2), bolder gram values in amber/primary color with larger font, vertical border separator between grams column and name, hover state changes to primary/5, name turns primary on hover, scroll-warm class for custom scrollbar, uppercase tracking on availability labels.
- **Recipe Lab**: sidebar items now have hover translate-x effect + left accent bar when selected + shadow; ingredient table has bolder 2px header border, hover row highlight, clearer column headers (Wt% / Baker% with title tooltips), tabular-nums for alignment; method steps now use filled amber circles (bg-primary text-primary-foreground) with a vertical timeline line connecting them, ring-2 ring-background for depth.
- **Footer**: complete redesign with gradient background (from-muted/40 to-muted/70), 2px primary/20 top border, decorative gradient accent line, dotted divider pattern, colored icon boxes for each column (amber/amber/rose), tag pills (evidence-led, foam-only, etc.), status indicator with pulse dot, Back-to-top link.
- **Accessibility**: skip-to-content link, aria-labels on command palette, title attributes on table headers for tooltip explanations.

Architecture changes:
- nav-bar.tsx: integrated CommandPalette component.
- page.tsx: added ProtocolFlow between Hero and ResearchRounds, added skip-to-content link, main element gets id="main-content".

Verification:
- ESLint: 0 errors, 0 warnings (fixed one JSX parsing typo during development).
- Dev server: HTTP 200 on / and /api/lab.
- DOM audit: all 11 sections + main-content present, protocol flow confirmed (7 border-t-2 cards, all 5 phase texts in DOM), command palette button found, skip link found, 6 donut sectors, 1 radar polygon, no runtime errors, page height ~16,714px.
- Command Palette interactivity: opened via button click, dialog renders with search input, grouped options (Navigation + Sections), fuzzy search working, escape to close.
- VLM QA: Protocol Flow "clearly visible near the top, just below the header statistics" with "5 colored cards connected by arrow connectors". Ingredient ledger "alternating background colors, bold amber gram values, tier badges aligned". Recipe lab "filled amber circles with vertical timeline line, bolder header border, clearer Wt%/Baker% labels". Footer "distinct background tint, decorative dotted top divider, colored icon boxes, Back-to-top link". Full-page polish rated 8/10.

Stage Summary:
- Phase 0 lab enhanced with 3 new features (command palette, protocol flow diagram, skip-to-content) and major styling improvements to 3 components (ingredient ledger, recipe lab, footer).
- Command Palette provides fast keyboard-driven navigation — a genuine power-user feature.
- Protocol Flow diagram gives users an immediate visual overview of the entire methodology before diving into details.
- Footer now feels like a proper closing element rather than an afterthought.
- All animations and interactions are accessibility-safe.

Unresolved / next-phase priorities:
1. Kitchen tests still cannot be executed (predicted checks remain predicted).
2. Command Palette could be expanded with recipe-variant and ingredient search (currently sections only).
3. A "compare two variants side-by-side" feature for the recipe lab would be valuable.
4. The GlossaryTooltip inline component exists but is not yet used in body text — could annotate ingredient/technique descriptions.
5. Dark mode toggle could be added (theme variables are already defined in globals.css).
6. Mobile viewport testing still limited.

---
Task ID: 3 (cron webDevReview round 3)
Agent: main (Z.ai Code)
Task: QA assessment, dark mode implementation, recipe variant comparison feature, command palette expansion, and styling polish.

Work Log:
- Reviewed worklog.md (Tasks 0, 1, 2) to understand project state.
- QA assessment: dev server stable (HTTP 200, ~41ms), lint clean (0 errors), DOM audit confirmed all 12 sections + main-content, 6 donut sectors, 1 radar polygon, slider/progress/glossary/command-palette all functional, no runtime errors, page height ~16,714px. No bugs found — project is stable.
- Identified next-phase priorities from worklog: dark mode toggle, recipe comparison feature, command palette expansion.

New features added:
1. **Dark Mode Toggle** (theme-toggle.tsx + theme-provider.tsx): 
   - Added next-themes ThemeProvider to layout.tsx with `attribute="class"`, `defaultTheme="light"`, `disableTransitionOnChange`.
   - Built ThemeToggle component with animated Sun/Moon icons (framer-motion rotate+scale transition), `resolvedTheme` for hydration-safe rendering, `suppressHydrationWarning` on button.
   - Added `color-scheme: light/dark` to globals.css for native form controls.
   - Added smooth 150ms background-color/border-color transition on all elements (but 0ms on hover/focus for instant feedback).
   - Toggle button placed in nav bar next to Command Palette.
   - Verified: dark mode produces deep charcoal background with amber accents, light mode returns to warm parchment. VLM rated dark mode 9/10 polish.

2. **Recipe Variant Comparison** (recipe-comparison.tsx):
   - New component below the Recipe Lab detail view.
   - "Compare" toggle button activates comparison mode.
   - Checkbox selector with all 9 recipe variants, max 3 selectable, disabled state when 3 already selected.
   - Side-by-side comparison table: rows = all unique ingredients, columns = selected variants, cells = grams values.
   - Automatic difference highlighting: rows that differ get amber background, highest value in a differing row is bold primary color.
   - "Key differences" summary panel: lists ingredients that differ (with delta in grams) and ingredients present in some but not all variants.
   - Sticky left column for ingredient names (horizontal scroll on mobile).
   - Alternating row backgrounds, total batter row.
   - Legend explaining the highlighting.
   - Animated entrance/exit for compare mode.

3. **Expanded Command Palette**:
   - CommandPalette now accepts `recipes` and `ingredients` props.
   - Added "Recipes" group (all 9 variants searchable by name, summary, variable, question) — selecting dispatches a custom `select-recipe` event that RecipeLab listens for and auto-selects the variant.
   - Added "Ingredients" group (all 12 ingredients searchable by name, function, evidence, substitution) — selecting scrolls to the ingredients section.
   - NavBar updated to forward `recipes` and `ingredients` props to CommandPalette.
   - RecipeLab updated with `useEffect` listener for `select-recipe` custom events.
   - Verified: searching "chuño" finds both the Ingredients section AND "Diagnostic A — Chuño vs Cornstarch" recipe.

Architecture changes:
- layout.tsx: wrapped app in ThemeProvider.
- nav-bar.tsx: accepts NavBarProps (recipes, ingredients), forwards to CommandPalette.
- page.tsx: passes data.recipes and data.ingredients to NavBar.
- recipe-lab.tsx: added useEffect listener for select-recipe custom events.
- globals.css: added color-scheme, smooth theme transitions.

Verification:
- ESLint: 0 errors, 0 warnings.
- Dev server: HTTP 200 on / and /api/lab.
- DOM audit: all 12 sections + main-content present, theme toggle found, comparison card found, protocol flow found, 6 donut sectors, 1 radar polygon, no runtime errors, page height ~16,930px.
- Dark mode toggle: clicked toggle, html class changed from "light" to "dark", background changed from light parchment to deep charcoal. VLM confirmed "dark theme is highly consistent, deep charcoal background with light gray/white text and distinct amber/gold accents" — 9/10 polish.
- Light mode toggle: clicked back, confirmed "light mode with consistent off-white background and dark text".
- Command palette search: typed "chuño", found both "04 · Ingredients" section and "Diagnostic A — Chuño vs Cornstarch" recipe variant. Custom event dispatch works.
- Recipe comparison: clicked Compare button, checkboxes appeared with (0/3) counter, selected 2 variants (Core + Lima Substitution), comparison table rendered with side-by-side grams, differences highlighted (flour 150g vs 135g, cornstarch — vs 15g), "Key differences" panel appeared with delta values.

Stage Summary:
- Phase 0 lab enhanced with 3 major new features: dark mode, recipe comparison, expanded command palette.
- Dark mode provides a complete alternative theme with smooth transitions — the warm amber palette works beautifully on dark charcoal.
- Recipe comparison is a genuinely useful analytical tool — users can now see exactly which ingredients differ across variants and by how much.
- Command palette now searches the entire lab content (sections + recipes + ingredients) — a true power-user navigation tool.
- All features verified working via agent-browser interactivity tests and VLM visual QA.

Unresolved / next-phase priorities:
1. Kitchen tests still cannot be executed (predicted checks remain predicted).
2. GlossaryTooltip inline component exists but is not yet used in body text — could annotate ingredient/technique descriptions.
3. The comparison table could be expanded to show method-step differences (not just ingredients).
4. A "share comparison" feature (URL state for selected variants) could be added.
5. Print CSS could be expanded for the comparison table.
6. Mobile viewport testing still limited.

---
Task ID: 4 (cron webDevReview round 4)
Agent: main (Z.ai Code)
Task: QA assessment, new data visualizations, animated stats band, and inline glossary tooltips.

Work Log:
- Reviewed worklog.md (Tasks 0-3) to understand project state.
- QA assessment: dev server stable (HTTP 200, ~38ms), lint clean (0 errors), DOM audit confirmed all 12 sections + main-content, theme toggle, comparison card, protocol flow, 6 donut sectors, 1 radar polygon, no runtime errors, page height ~16,930px. No bugs found — project is stable and mature.
- VLM QA on 4 section screenshots (hero, research, evidence, verdict) identified improvement opportunities: need for data visualizations, animated counters, and inline glossary term highlighting.

New features added:
1. **Formula Breakdown Chart** (ingredient-breakdown.tsx):
   - New card in the Recipe Lab section, placed side-by-side with the Recipe Scaler.
   - Stacked horizontal bar chart showing ingredient composition by weight percentage.
   - Ingredients auto-categorized by type (eggs, sugar, flour, starch, fat, salt, flavoring, leavener) with warm bakery color palette.
   - Animated segment expansion (framer-motion, staggered by 0.06s).
   - Hover tooltips on each segment showing category, grams, and percentage.
   - Category legend with detail cards showing ingredient names, grams, and percentages.
   - Variant selector dropdown — switch between any recipe variant to see its composition.
   - Scale markers (0%, 25%, 50%, 75%, 100%) below the bar.
   - Info note explaining the difference between weight % and baker's %.
   - Verified: Core recipe shows 44% eggs, 28% sugar, 28% flour, 0.3% salt.

2. **Animated Lab Stats Band** (lab-stats-band.tsx):
   - New section between hero and protocol flow.
   - 6 animated counters with count-up animation (ease-out cubic, 1.2s duration) triggered on scroll-into-view.
   - Stats: 15 Claims audited, 12 Ingredients, 16 Techniques, 9 Recipe variants, 6 Validation rounds, 9 Complexity removed.
   - Each stat has a distinct color (primary, amber, teal, violet, rose, emerald).
   - Sublabels provide context (e.g., "4 tiers", "6 adversarial lenses").
   - Responsive grid: 2 cols mobile → 3 cols tablet → 6 cols desktop.
   - Gradient background with backdrop blur for visual depth.
   - Verified: VLM confirmed all 6 counters visible with correct numbers.

3. **Inline Glossary Tooltips** (GlossaryText component in glossary.tsx):
   - New GlossaryText component that renders text with any glossary terms automatically wrapped in interactive tooltips.
   - Case-insensitive, whole-word matching using a regex built from the 15 glossary terms.
   - Longer terms matched first to avoid partial overlaps.
   - Integrated into the Ingredient Ledger: Function, Evidence, Substitution, Expected effect, New risk, and Omission result fields now highlight terms like "chuño", "maicena", "Maillard", "algarrobina", "foam-only", etc.
   - Clicking/hovering a highlighted term shows a tooltip with the full definition.
   - Verified via DOM: "maicena" appears as a dotted-underlined amber link in the chuño ingredient's substitution field.

Architecture changes:
- page.tsx: added LabStatsBand between Hero and ProtocolFlow; added IngredientBreakdown alongside RecipeScaler in the recipe lab section; GlossaryCard now full-width below.
- ingredient-ledger.tsx: Detail component extended with optional `glossary` prop; imports GlossaryText.
- glossary.tsx: added GlossaryText exported component.

Verification:
- ESLint: 0 errors, 0 warnings.
- Dev server: HTTP 200 on / and /api/lab.
- DOM audit: all 12 sections + main-content present, stats band found, formula breakdown found, theme toggle found, 6 donut sectors, 1 radar polygon, no runtime errors, page height ~17,600px (grew from 16,930px due to new content).
- Stats band: VLM confirmed "6 animated counters (Claims, Ingredients, Techniques, Variants, Rounds, Complexity) located near the top of the page" with correct numbers (15, 12, 16, 9, 6, 9).
- Formula breakdown: VLM confirmed "stacked horizontal bar chart titled 'Composition by weight'" with segments "44% eggs, 28% sugar, 28% flour, 0.3% salt" and a detailed legend.
- Glossary tooltips: DOM confirmed "maicena" rendered as a dotted-underlined amber button (glossary tooltip link) in the chuño ingredient's expanded detail.
- Full-page VLM QA: 9/10 polish. "Exceptionally detailed, professional, and data-rich, resembling a high-end technical report. No major issues."

Stage Summary:
- Phase 0 lab enhanced with 3 new features: formula breakdown chart, animated stats band, and inline glossary tooltips.
- The Formula Breakdown chart gives bakers an immediate visual understanding of the recipe's composition — eggs dominate at 44%, confirming the lean foam-only profile.
- The animated stats band provides a scannable summary of the lab's scope right at the top of the page.
- Inline glossary tooltips make technical terms self-documenting — no need to scroll to the glossary card to understand "chuño", "maicena", or "Maillard".
- All features verified working via DOM audit and VLM visual QA.
- Full-page polish rated 9/10.

Unresolved / next-phase priorities:
1. Kitchen tests still cannot be executed (predicted checks remain predicted).
2. The comparison table could show method-step differences (not just ingredients).
3. A "share comparison" feature (URL state) could be added.
4. Print CSS could be expanded for the breakdown chart and comparison table.
5. Mobile viewport testing still limited.
6. Could add a "baker's percentage mode" toggle to the formula breakdown (switch between weight % and baker's %).

---
Task ID: 5 (cron webDevReview round 5)
Agent: main (Z.ai Code)
Task: QA assessment, interactive recipe sandbox, technique ledger visual enhancement.

Work Log:
- Reviewed worklog.md (Tasks 0-4) to understand project state.
- QA assessment: dev server stable (HTTP 200, ~46ms), lint clean (0 errors), DOM audit confirmed all 12 sections + main-content, stats band, formula breakdown, theme toggle, comparison card, 6 donut sectors, 1 radar polygon, no runtime errors, page height ~17,600px. No bugs found — project is stable and mature.
- VLM QA on 4 section screenshots identified the single most impactful new feature: an interactive "what-if" recipe sandbox where users can toggle substitutions and see predicted outcomes.

New features added:
1. **What-If Recipe Sandbox** (recipe-sandbox.tsx):
   - Interactive tool that lets users toggle 8 recipe modifications (chuño, baking powder, oil, vanilla, separated-egg, smoke, algarrobina, baking stone) and see real-time predicted outcomes.
   - Left panel: toggle switches with descriptions, active count, reset button.
   - Right panel: modified formula table showing gram changes (delta from base), total batter with change indicator.
   - Predicted effects grid: colored cards (green for positive, red for negative, gray for neutral) with trend arrows (TrendingUp/TrendingDown/Minus), magnitude, and detail. Effects cover crumb tenderness, shelf life, oven spring, foam volume, moisture, aroma, color, etc.
   - Fidelity assessment panel: calculates a 0-100 fidelity score based on which modifications are active. Each modification has a risk level (high/medium/low) with explanatory text. Tier label changes (core/diagnostic/substitution/speculative) based on score.
   - Animated entrance/exit for effects and empty state.
   - Verified: toggling chuño adds a starch row and shows crumb tenderness +15% effect. Toggling oil increases total from 541.5g to 556.5g, shows Day-2 moisture +25% effect, and drops fidelity to 87/100.

2. **Enhanced Technique Ledger** (technique-ledger.tsx):
   - Complete visual redesign with colored header bars for each tier column (primary/amber/rose).
   - Count badges in headers with tier-colored backgrounds.
   - Left accent bars on each technique card matching the tier color.
   - Field icons (Zap for Function, Target for Target, Lightbulb for Simpler alt, AlertTriangle for Failure, Ruler for Measurement) with tier-colored icon coloring.
   - Uppercase tracking-wide field labels for better scannability.
   - Hover shadow effect on cards.
   - Custom scrollbar (scroll-warm class).
   - VLM confirmed: "significantly more polished than a plain list, clean card-based layout with rounded corners, subtle shadows, organized typography."

Architecture changes:
- page.tsx: added RecipeSandbox between IngredientBreakdown and GlossaryCard in the recipe lab section.
- technique-ledger.tsx: complete rewrite with tierConfig object, FieldRow sub-component, field icons.

Verification:
- ESLint: 0 errors, 0 warnings.
- Dev server: HTTP 200 on / and /api/lab.
- DOM audit: all 12 sections + main-content present, sandbox found, stats band found, formula breakdown found, theme toggle found, 6 donut sectors, 1 radar polygon, no runtime errors, page height ~18,181px (grew from 17,600px due to sandbox).
- Sandbox interactivity: toggled chuño → starch row appeared, crumb tenderness +15% effect shown. Toggled oil → total increased 541.5→556.5g, Day-2 moisture +25% effect shown, fidelity dropped to 87/100. All effects and fidelity assessment render correctly.
- Technique ledger: VLM confirmed "3 columns with colored header bars, left accent bars on cards, field icons, significantly more polished."
- Full-page VLM QA: 9/10 polish. "Exceptionally dense, logically structured, visually sophisticated with data-driven dashboard aesthetic. No major functional issues."

Stage Summary:
- Phase 0 lab enhanced with 2 major features: interactive recipe sandbox and enhanced technique ledger.
- The What-If Sandbox is the most interactive feature in the lab — users can experiment with 8 modifications and immediately see predicted effects, formula changes, and fidelity impact. It's a genuine reasoning tool that makes the parsimony principle tangible.
- The technique ledger is now visually consistent with the ingredient ledger's polish level, with clear tier differentiation via colors and icons.
- All features verified working via DOM audit and VLM visual QA.
- Full-page polish rated 9/10.

Unresolved / next-phase priorities:
1. Kitchen tests still cannot be executed (predicted checks remain predicted).
2. The sandbox could be expanded with more modifications (e.g., different starch types, mold sizes).
3. A "save scenario" feature could let users bookmark a combination of toggles.
4. The sandbox effects are predicted from food science — a disclaimer is present but could be more prominent.
5. Mobile viewport testing still limited.
6. Could add a "compare scenarios" feature to diff two toggle combinations.
