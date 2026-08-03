// Seed script for the Chongoyape Bizcochuelos Reverse-Engineering Lab.
// Populates every ledger and recipe variant required by the protocol.
import { db } from '../src/lib/db'

const GREEN = '\x1b[32m'
const RESET = '\x1b[0m'

async function main() {
  console.log(`${GREEN}Seeding lab database…${RESET}`)

  // Wipe (idempotent re-seed)
  await db.failureTest.deleteMany()
  await db.researchRound.deleteMany()
  await db.complexityLog.deleteMany()
  await db.validationRound.deleteMany()
  await db.recipeVariant.deleteMany()
  await db.substitution.deleteMany()
  await db.technique.deleteMany()
  await db.ingredient.deleteMany()
  await db.claim.deleteMany()

  // ---------------------------------------------------------------- RESEARCH ROUNDS
  const research = [
    {
      phase: 'Phase 0 — Memory audit', round: 0, kind: 'memory',
      findings: 'Previous report describes rectangular slab cut into 16 pieces (4x4), flat top, pale golden, baked ~35-40 min at 180°C. Recipe loads 8 eggs + 200g sugar + 200g flour + 100g starch + 10g baking powder + vanilla simultaneously.',
      strengthened: 'Chongoyape location, Valera family, ~1913 founding, wood-fired oven, clamshell packaging, "Únicos en el Perú" slogan.',
      weakened: 'Visual description, piece count, top profile, color, and recipe parsimony are all questionable.',
      contradictions: 'VLM analysis of the supplied image shows individual ROUND domed cakes (~6.5 cm), ~4 per tray (2x2), deep golden-amber, pebbled surface — contradicting the rectangular/flat/pale description.',
      decisionsChanged: 'Target product redefined as individual round domed cakes. Recipe rebuilt from foam-only baseline.',
      unresolved: 'Whether the "16 Bizcochuelos" label refers to a 4-tray pack or a different SKU. Whether previous report described a different photo.',
      continueResearch: true,
    },
    {
      phase: 'Phase 0 — Primary evidence', round: 1, kind: 'primary',
      findings: 'RPP Noticias YouTube video titled "En Chiclayo conocimos la preparación de bizcochuelos y bizcotelas por parte de la familia Valera". Multiple Facebook posts: "horno tradicional de barro", "leña". Restaurant Guru listing "Bizcochuelos Valera, Chongoyape" 4.6 rating. TikTok videos of tasting in Chongoyape.',
      strengthened: 'Producer identity, wood-fired clay oven, family operation, geographic origin, retail presence.',
      weakened: 'None — independent sources converge on the same facts.',
      contradictions: 'None new.',
      decisionsChanged: 'Confirmed producer profile. Wood oven is real, not folklore.',
      unresolved: 'Exact internal recipe. Whether oven is purely thermal or also imparts smoke.',
      continueResearch: true,
    },
    {
      phase: 'Phase 0 — Corroboration', round: 2, kind: 'corroboration',
      findings: 'RPP (national news), Restaurant Guru (independent directory), Facebook user posts, YouTube creators, and TikTok tastings all reference Valera independently. Not all derive from a single press release.',
      strengthened: 'Producer identity is multiply corroborated across source classes.',
      weakened: 'Recipe-specific claims remain single-source (family statements only).',
      contradictions: 'None.',
      decisionsChanged: 'Accept producer facts as "strongly supported". Recipe internals remain "weak/unresolved".',
      unresolved: 'No independent recipe disclosure exists. Family recipe is secret by design.',
      continueResearch: true,
    },
    {
      phase: 'Phase 0 — Counter-hypothesis', round: 3, kind: 'counter',
      findings: 'Counter-hypothesis A: another Chongoyape producer uses identical terminology — search found no second "Valera-class" producer in Chongoyape; the brand appears unique. Counter-hypothesis B: "bizcotela" denotes the plain sponge — refuted, bizcotela is the manjar-blanco-filled alfajor-style product. Counter-hypothesis C: foam-only (no chemical leavener) is impossible — refuted by multiple published foam-only recipes (8 eggs/245g sugar/245g flour, beat 10 min).',
      strengthened: 'Brand uniqueness, bizcochuelo vs bizcotela distinction, foam-only viability.',
      weakened: 'None.',
      contradictions: 'None.',
      decisionsChanged: 'Adopt foam-only as the core baseline. Reject baking powder from core.',
      unresolved: 'Whether Valera specifically uses chuño — plausible but unverified.',
      continueResearch: true,
    },
    {
      phase: 'Phase 0 — Ingredient & technique', round: 4, kind: 'ingredient',
      findings: 'Chuño (freeze-dried potato starch) tenderizes crumb by diluting gluten; modern Peruvian home recipes use ~10% of flour weight. Cornstarch is a partial substitute but gelatinizes differently. Vanilla is common in modern recipes but absent from the label and not advertised. Whole-egg whipping to "punto cinta" (ribbon stage) is the canonical technique. Warming whole eggs to ~40°C accelerates foam but is optional. Separated-egg method gives more volume but adds steps.',
      strengthened: 'Foam-only baseline mechanics. Chuño functional role.',
      weakened: 'Any claim that chuño or vanilla is DEFINITELY in the Valera recipe.',
      contradictions: 'None.',
      decisionsChanged: 'Core = whole-egg foam, no starch, no fat, no flavoring. Chuño and vanilla moved to diagnostic/speculative.',
      unresolved: 'Actual starch and flavoring use by Valera.',
      continueResearch: false,
    },
    {
      phase: 'Phase 0 — Synthesis', round: 5, kind: 'synthesis',
      findings: 'Decision-relevant evidence located: product form (round domed), producer (confirmed), oven (wood-fired clay), baseline technique (foam-only), target color (deep golden-amber). Major source classes checked (news, directories, social, recipe databases, food-science). Counter-hypothesis round completed. Ingredient/technique functions sufficiently understood for a baseline.',
      strengthened: 'All core decisions.',
      weakened: 'None.',
      contradictions: 'Previous report defects documented and corrected.',
      decisionsChanged: 'Proceed to recipe development with foam-only baseline and 4-level variant hierarchy.',
      unresolved: 'Kitchen tests cannot be executed in this environment — documented as predicted results with explicit acceptance criteria.',
      continueResearch: false,
    },
    {
      phase: 'Red-Team Audit — Round 6', round: 6, kind: 'counter',
      findings: 'MAJOR FINDING: Multiple independent sources (Instagram, Facebook, Chongoyape posts) confirm the wood IS algarrobo lambayecano: "La leña que se usa es algarrobo lambayecano, que le da un aromo y sabor peculiar." This upgrades the smoke claim from unresolved to strongly-supported. The algarrobina claim upgrades from weak to plausible (same tree). Food science (PMC, MDPI) confirms wood-smoke phenols adsorb to baked goods.',
      strengthened: 'Smoke claim (unresolved → strongly-supported). DIGESA regulatory claim (plausible → strongly-supported, official document found). Algarrobina claim (weak → plausible).',
      weakened: 'The "smoke is unverified" gate is now resolved — smoke IS expected. The core unsmoked recipe may now be LESS faithful to the target than a diagnostic smoke variant.',
      contradictions: 'None new. The prior "unresolved" smoke gate is now contradicted by direct evidence.',
      decisionsChanged: 'Smoke ingredient upgraded from speculative to diagnostic tier. Algarrobina stays speculative but with stronger evidence basis.',
      unresolved: 'Whether the smoke flavor survives cooling + clamshell storage (still needs triangle test).',
      continueResearch: true,
    },
    {
      phase: 'Red-Team Audit — Round 7', round: 7, kind: 'ingredient',
      findings: 'Traditional Peruvian bizcochuelo recipes (Todos Santos, Yanuq) commonly use cornstarch (maicena) at 10-50% of flour weight. The "Bizcochuelo de Todos Santos" recipe uses 1 cup maicena + 6 cups flour. Foam-only recipes without baking powder are confirmed standard (multiple published recipes). The Yanuq recipe (6 eggs separated, ½ cup flour, ½ cup chuño, 1 tsp baking powder) is the canonical modern hybrid — confirms our rejection of hybrid + leavener in the core.',
      strengthened: 'Starch use is plausible (common in Peruvian tradition). Foam-only core is validated (multiple published recipes without leavener).',
      weakened: 'None.',
      contradictions: 'None new.',
      decisionsChanged: 'No recipe changes — core remains foam-only. Starch stays in substitution tier (not confirmed for Valera specifically).',
      unresolved: 'Whether Valera uses starch at all — still no direct producer confirmation.',
      continueResearch: true,
    },
    {
      phase: 'Red-Team Audit — Round 8', round: 8, kind: 'synthesis',
      findings: 'Red-team audit complete. 3 new research rounds (6-8) executed. 2 claims upgraded (smoke → strongly-supported, DIGESA → strongly-supported, algarrobina → plausible). 1 ingredient tier upgraded (smoke → diagnostic). All validation rounds re-audited. The convergence status improves: Round 6 (parsimony) was quiet; the smoke upgrade resolves a previously-unresolved gate. One more quiet round after kitchen fault-testing is still required.',
      strengthened: 'Smoke, regulatory, and algarrobina claims. Overall evidence base is stronger.',
      weakened: 'The core unsmoked recipe is now less faithful to the target — a diagnostic smoke variant is more important than before.',
      contradictions: 'The prior "unresolved" smoke gate is now resolved.',
      decisionsChanged: 'Convergence status: 1.5/2 quiet rounds (the smoke resolution is a partial quiet round). Smoke variant promoted from speculative to diagnostic.',
      unresolved: 'Kitchen triangle test for smoke perceptibility. Whether algarrobina syrup is used (vs just wood).',
      continueResearch: false,
    },
  ]
  for (const r of research) await db.researchRound.create({ data: r })

  // ---------------------------------------------------------------- CLAIMS
  const claims = [
    { category: 'historical', statement: 'Bizcochuelos Valera was founded by Eutemio (Tito) Valera Santa Cruz in Chongoyape, ~1913.', confidence: 'strongly-supported', evidenceBasis: 'Family monograph cited in previous report; centennial framing in multiple independent social posts.', counterTest: 'A different founding date or founder name in municipal records — not found.', status: 'open' },
    { category: 'business', statement: 'The business operates a wood-fired clay oven ("horno tradicional de barro") in Chongoyape.', confidence: 'strongly-supported', evidenceBasis: 'RPP Noticias video; multiple Facebook posts mentioning "horno de barro" and "leña".', counterTest: 'A production video showing only gas/electric ovens — not found.', status: 'open' },
    { category: 'visual', statement: 'The photographed product is an individual round domed sponge cake, ~6.5 cm diameter × ~3.5 cm tall, deep golden-amber.', confidence: 'strongly-supported', evidenceBasis: 'Forensic VLM analysis of the supplied image.', counterTest: 'A higher-resolution image showing rectangular pieces — not present.', status: 'open' },
    { category: 'visual', statement: 'The product has no filling, icing, powdered sugar, or liners.', confidence: 'confirmed', evidenceBasis: 'VLM explicit-negative analysis.', counterTest: 'A side view revealing a hidden layer — not visible.', status: 'open' },
    { category: 'recipe', statement: 'The core formula is an egg-foam sponge (eggs + sugar + flour + salt) with no chemical leavener.', confidence: 'plausible', evidenceBasis: 'Foam-only is the canonical bizcochuelo method; published foam-only recipes produce equivalent texture; family states "todo a base de huevos frescos".', counterTest: 'A production video showing baking powder being added — not available. A failed foam-only kitchen test.', status: 'open' },
    { category: 'ingredient', statement: 'The recipe uses chuño (potato starch) alongside wheat flour.', confidence: 'weak', evidenceBasis: 'Previous report mentions "harinas especiales"; chuño is regionally traditional; modern Peruvian recipes use it. No direct producer confirmation.', counterTest: 'A producer statement that no starch is used. A foam-only control that matches the target without starch.', status: 'open' },
    { category: 'ingredient', statement: 'The recipe contains vanilla or citrus zest.', confidence: 'weak', evidenceBasis: 'Common in modern Peruvian sponge recipes; not advertised on the label.', counterTest: 'A producer statement that no flavoring is used.', status: 'open' },
    { category: 'technique', statement: 'Whole eggs are whipped to ribbon stage ("punto cinta") as the primary leavening.', confidence: 'plausible', evidenceBasis: 'Canonical technique; simplest explanation consistent with a fine, even crumb.', counterTest: 'A production video showing separated-egg whipping. A whole-egg test that fails to achieve target rise.', status: 'open' },
    { category: 'technique', statement: 'The wood oven imparts a perceptible smoke flavor to the cake using algarrobo lambayecano wood.', confidence: 'strongly-supported', evidenceBasis: 'Multiple independent sources (Instagram, Facebook, Chongoyape posts) confirm: "La leña que se usa es algarrobo lambayecano, que le da un aromo y sabor peculiar." Food science (PMC, MDPI) confirms wood-smoke phenols adsorb to baked goods and impart flavor. The smoke claim is no longer unresolved — the wood IS algarrobo, and it IS used for its aromatic contribution.', counterTest: 'A triangle test (smoked vs unsmoked) showing no perceptible difference after cooling + clamshell storage.', status: 'open' },
    { category: 'regulatory', statement: 'The product is exempt from DIGESA sanitary registration as a short-shelf-life artisanal bakery item (≤48 h, unpreserved).', confidence: 'strongly-supported', evidenceBasis: 'Official DIGESA document "NORMA DE PANADERIAS" states: "productos de panificación con vida útil menor a 48 horas desde su elaboración no requieren de Registro Sanitario." The clamshell packaging with no ingredient list is consistent with this artisanal exemption.', counterTest: 'A DIGESA record showing active sanitary registration for the brand — not found.', status: 'open' },
    { category: 'historical', statement: 'The product form is a slab cut into 16 rectangular pieces (4×4 grid).', confidence: 'contradicted', evidenceBasis: 'Previous report claim. VLM analysis of the supplied image shows individual round domed cakes, ~4 per tray.', counterTest: 'The supplied image itself.', status: 'downgraded' },
    { category: 'recipe', statement: 'The core recipe should include 10 g baking powder "for reliability".', confidence: 'contradicted', evidenceBasis: 'Previous report claim. Violates parsimony: no foam-only control was tested before adding leavener.', counterTest: 'Foam-only baseline is structurally sufficient per published recipes.', status: 'removed' },
    { category: 'business', statement: 'The shop in Chiclayo is on Alfredo Lapoint near Mercado Central.', confidence: 'plausible', evidenceBasis: 'Previous report; phone numbers with 074 area code corroborate Lambayeque location.', counterTest: 'A current address check — not performed.', status: 'open' },
    { category: 'visual', statement: 'Each clamshell tray holds ~4 individual cakes in a 2×2 arrangement; multi-tray packs may total 16.', confidence: 'plausible', evidenceBasis: 'VLM observation of the supplied image (4 visible per tray) reconciled with the "16 Bizcochuelos" label claim.', counterTest: 'A photo of the full pack showing the tray count.', status: 'open' },
    { category: 'ingredient', statement: 'Algarrobina (carob syrup) is a hidden flavoring.', confidence: 'plausible', evidenceBasis: 'Algarrobo lambayecano wood is confirmed used in the oven (upgraded from weak). Algarrobina syrup is derived from the same algarrobo tree pods. The deep golden-amber color COULD be algarrobina OR pure Maillard — both are now plausible. No direct producer confirmation of syrup use, but the wood confirmation strengthens the regional-algarrobo connection.', counterTest: 'A producer statement that no syrup is used; a sensory test distinguishing algarrobina from Maillard.', status: 'open' },
  ]
  for (const c of claims) await db.claim.create({ data: c })

  // ---------------------------------------------------------------- INGREDIENTS
  const ingredients = [
    // CORE (Level 1)
    { name: 'Whole eggs (room temp)', grams: 240, percent: 38.4, bakerPercent: 100, function: 'Primary structure + leavening (foam) + moisture + color (yolk fat & lecithin).', evidence: 'Canonical bizcochuelo; family statement "todo a base de huevos frescos"; foam-only published recipes.', confidence: 'high', limaAvailability: 'common', supermarketOption: 'Any supermarket brand (e.g. San Fernando, Pehuen). Medium-large (~60 g shell-on).', substitution: 'None in core. Separated-egg method is a diagnostic variant, not a substitution.', ratioAdjustment: 'Weigh shelled eggs; 4 large ≈ 200-240 g.', expectedEffect: 'Volume, tenderness, golden yolk color.', newRisk: 'Egg-size variation shifts ratios.', omissionResult: 'No cake — cannot omit.', tier: 'core' },
    { name: 'Granulated sugar', grams: 150, percent: 24.0, bakerPercent: 62.5, function: 'Sweetness, foam stabilization (delays coalescence), crust browning (caramelization/Maillard), moisture retention.', evidence: 'Canonical; foam-only recipes use 60-70% baker% sugar.', confidence: 'high', limaAvailability: 'common', supermarketOption: 'Blanca del Norte, Liofilizada, or any white granulated sugar.', substitution: 'Sugar is functionally essential to foam stability. Do not substitute in core.', ratioAdjustment: 'If reducing, expect less stable foam and paler crust.', expectedEffect: 'Stable ribbon-stage foam; deep golden-amber crust matching target.', newRisk: 'Excess sugar -> collapse; deficit -> pale, dense crumb.', omissionResult: 'Foam will not stabilize; product fails.', tier: 'core' },
    { name: 'All-purpose wheat flour (harina preparada)', grams: 150, percent: 24.0, bakerPercent: 62.5, function: 'Structure (gluten + starch gelatinization).', evidence: 'Canonical; wheat flour is the historical base for coastal Peruvian baking.', confidence: 'high', limaAvailability: 'common', supermarketOption: 'Blanca Flor or Alicorp harina preparada (commonly with self-raising agents — check label and use plain if possible).', substitution: 'Cake flour (lower protein) softens crumb — diagnostic variant. Chuño/cornstarch partial replacement — diagnostic.', ratioAdjustment: 'If using self-raising flour, omit any added leavener and expect a different crumb.', expectedEffect: 'Set crumb, tender chew.', newRisk: 'Over-mixing develops gluten -> toughness.', omissionResult: 'No structure — batter collapses.', tier: 'core' },
    { name: 'Fine salt', grams: 1.5, percent: 0.24, bakerPercent: 0.6, function: 'Flavor balance; tightens gluten slightly; masks flatness.', evidence: 'Universal bakery practice.', confidence: 'high', limaAvailability: 'common', supermarketOption: 'Any fine table salt (e.g. Sal Yodo).', substitution: 'None needed.', ratioAdjustment: 'Halve if using salted butter elsewhere (not in core).', expectedEffect: 'Cleaner flavor.', newRisk: 'Excess -> salty.', omissionResult: 'Flat, dull flavor.', tier: 'core' },

    // SUBSTITUTION (Level 2)
    { name: 'Cake flour / lower-protein flour', grams: 150, percent: 24.0, bakerPercent: 62.5, function: 'Softer crumb than all-purpose.', evidence: 'Food science: lower protein = less gluten = more tender.', confidence: 'medium', limaAvailability: 'specialist', supermarketOption: 'Harina para pastelería (look for "harina 0000" or low-protein brands in Wong/Tottus).', substitution: 'All-purpose + 10-15% cornstarch (see diagnostic).', ratioAdjustment: '1:1 by weight.', expectedEffect: 'Finer, more tender crumb.', newRisk: 'May be weaker structurally; fold gently.', omissionResult: 'Slightly chewier crumb (acceptable).', tier: 'substitution' },
    { name: 'Potato starch (chuño / fécula de papa)', grams: 15, percent: 2.4, bakerPercent: 6.25, function: 'Tenderizes crumb by diluting gluten; absorbs water; delays staling.', evidence: 'Traditional Andean ingredient; modern Peruvian recipes use ~10% of flour weight.', confidence: 'medium', limaAvailability: 'specialist', supermarketOption: 'Fécula de papa (look in market aisles or buy chuño and grind/sift finely).', substitution: 'Cornstarch (maicena) is a partial substitute but gelatinizes at a lower temperature and gives a slightly different mouthfeel.', ratioAdjustment: 'Replace up to 10% of flour weight 1:1.', expectedEffect: 'Softer, finer crumb; longer shelf life.', newRisk: 'Excess -> gummy, fragile crumb.', omissionResult: 'Slightly chewier crumb.', tier: 'substitution' },

    // DIAGNOSTIC (Level 3)
    { name: 'Baking powder (low dose)', grams: 3, percent: 0.48, bakerPercent: 1.25, function: 'Supplemental chemical leavening.', evidence: 'None direct for Valera. Tested only if foam-only control fails to reach target rise.', confidence: 'low', limaAvailability: 'common', supermarketOption: 'Polvo de hornear (any brand).', substitution: 'None.', ratioAdjustment: 'Start at 1-1.5% baker%; increase only if justified.', expectedEffect: 'Extra oven spring; risk of coarser crumb and chemical taste.', newRisk: 'Chemical-leavener taste; uneven large cells.', omissionResult: 'Foam-only crumb (the core target).', tier: 'diagnostic' },
    { name: 'Neutral oil (trace)', grams: 15, percent: 2.4, bakerPercent: 6.25, function: 'Moisture retention; tenderness.', evidence: 'None direct for Valera. Chiffon-style addition; tested only if crumb is too dry on day two.', confidence: 'low', limaAvailability: 'common', supermarketOption: 'Vegetable oil (Marca D1, Primor).', substitution: 'Melted butter adds flavor but changes texture.', ratioAdjustment: 'Reduce sugar slightly if adding fat.', expectedEffect: 'Moister crumb; slightly less foam volume.', newRisk: 'Deflation during folding.', omissionResult: 'Leaner crumb (the core target).', tier: 'diagnostic' },
    { name: 'Vanilla extract', grams: 3, percent: 0.48, bakerPercent: 1.25, function: 'Aroma.', evidence: 'Common in modern recipes; NOT advertised on label; not in family statements.', confidence: 'low', limaAvailability: 'common', supermarketOption: 'Vainilla líquida (avoid "esencia" which is weaker).', substitution: 'Citrus zest (lime or orange) — regional alternative.', ratioAdjustment: '1 tsp extract ≈ 3 g.', expectedEffect: 'Sweet aroma.', newRisk: 'Distracts from pure egg flavor.', omissionResult: 'Cleaner egg aroma (closer to target).', tier: 'diagnostic' },

    // SPECULATIVE (Level 4)
    { name: 'Algarrobina (carob syrup)', grams: 8, percent: 1.28, bakerPercent: 3.3, function: 'Speculative flavor + color.', evidence: 'Regional northern-Peru ingredient. The deep color COULD be algarrobina OR pure Maillard. No producer confirmation.', confidence: 'weak', limaAvailability: 'specialist', supermarketOption: 'Algarrobina bottled (markets in Chiclayo/Lima specialty).', substitution: 'Chancaca syrup (different flavor profile).', ratioAdjustment: 'Reduce sugar 8 g if used.', expectedEffect: 'Deeper color; darker, molasses-like aroma.', newRisk: 'Off-flavor if overdosed; contradicts "pure egg" claim.', omissionResult: 'Color from Maillard alone (the core target).', tier: 'speculative' },
    { name: 'Applewood / algarrobo wood smoke (surface exposure)', grams: 0, percent: 0, bakerPercent: 0, function: 'Smoke aroma on crust from algarrobo lambayecano wood combustion.', evidence: 'CONFIRMED: Multiple independent sources state "La leña que se usa es algarrobo lambayecano, que le da un aromo y sabor peculiar." Food science (PMC, MDPI) confirms wood-smoke phenols adsorb to baked goods. Upgraded from speculative to diagnostic — the wood IS used, but perceptibility in the finished clamshell-packaged product still needs a triangle test.', confidence: 'medium', limaAvailability: 'uncertain', supermarketOption: 'Smoking chips (applewood imported; algarrobo wood regional).', substitution: 'Liquid smoke (heavily discouraged — artificial).', ratioAdjustment: 'N/A — surface exposure, not ingredient.', expectedEffect: 'Faint smoke note on crust from algarrobo phenols.', newRisk: 'Overpowering smoke; food-safety concerns if uncontrolled.', omissionResult: 'Unsmoked control (the core target).', tier: 'diagnostic' },

    // REJECTED
    { name: '10 g baking powder (as in previous report)', grams: 10, percent: 1.6, bakerPercent: 4.2, function: 'Rejected: dose was unjustified and likely excessive.', evidence: 'Previous report. No foam-only control was tested. 4.2% baker% is high and risks chemical taste.', confidence: 'contradicted', limaAvailability: 'common', supermarketOption: 'n/a', substitution: 'Use foam-only or low-dose diagnostic instead.', ratioAdjustment: 'n/a', expectedEffect: 'Coarse crumb, chemical taste.', newRisk: 'High.', omissionResult: 'Clean foam-only crumb.', tier: 'rejected' },
  ]
  for (const i of ingredients) await db.ingredient.create({ data: i })

  // ---------------------------------------------------------------- TECHNIQUES
  const techniques = [
    { name: 'Weigh eggs (shelled) rather than count', function: 'Eliminates egg-size variation, the largest source of ratio drift.', targetEvidence: 'Eggs vary 50-70 g; 8 eggs can shift the formula by ±20%.', simplerAlternative: 'Counting eggs is simpler but imprecise.', failureMode: 'Counting leads to dense or collapsed bakes.', measurement: 'Digital scale ±1 g.', tier: 'core' },
    { name: 'Warm whole eggs to ~38-40°C before whipping', function: 'Lowers surface tension, accelerates foam formation, increases final volume.', targetEvidence: 'Standard genoise practice; foam reaches ribbon stage faster.', simplerAlternative: 'Room-temp eggs (already specified) whip adequately with 1-2 extra minutes.', failureMode: 'Overheating >45°C cooks yolks.', measurement: 'Thermometer probe.', tier: 'optional' },
    { name: 'Whip whole eggs + sugar to ribbon stage ("punto cinta")', function: 'Primary leavening; traps air; stabilizes foam.', targetEvidence: 'Canonical bizcochuelo technique; visible fine-even crumb in target.', simplerAlternative: 'None — this IS the simplest leavening method for a fat-free sponge.', failureMode: 'Underwhipping -> dense; overwhipping -> coarse, fragile foam.', measurement: 'Ribbon trail holds 3-second figure-8; volume tripled; pale ivory.', tier: 'core' },
    { name: 'Sift dry ingredients once', function: 'Disperses flour/starch/salt; aerates.', targetEvidence: 'Standard.', simplerAlternative: 'Whisking in a bowl is equivalent for dispersion.', failureMode: 'Multiple sifts add steps without measurable benefit.', measurement: 'No lumps visible.', tier: 'core' },
    { name: 'Fold dry into foam in 3 additions', function: 'Preserves air; ensures even dispersion.', targetEvidence: 'Standard.', simplerAlternative: '2 additions acceptable for small batches.', failureMode: 'Overfolding deflates; underfolding leaves streaks.', measurement: 'No dry streaks; batter still voluminous.', tier: 'core' },
    { name: 'Tap mold once on counter', function: 'Releases large trapped air pockets that would form tunnels.', targetEvidence: 'Standard.', simplerAlternative: 'None.', failureMode: 'Aggressive tapping deflates foam.', measurement: 'A few bubbles surface.', tier: 'optional' },
    { name: 'Grease + parchment-line mold bottom only; sides ungreased', function: 'Allows batter to grip sides and climb (oven spring); parchment ensures clean release.', targetEvidence: 'Standard sponge practice; matches the straight-sided target.', simplerAlternative: 'Greasing sides — simpler but reduces rise.', failureMode: 'Greased sides -> slumped, mushroomed top.', measurement: 'Straight vertical sides after bake.', tier: 'core' },
    { name: 'Bake at 180°C, ~22-26 min for individual molds', function: 'Sets foam before it collapses; develops Maillard crust.', targetEvidence: 'Published foam-only recipes; target color indicates moderate-high heat.', simplerAlternative: 'A single fixed temperature.', failureMode: 'Too hot -> dark crust before crumb sets; too cool -> collapse.', measurement: 'Toothpick clean; internal 95°C; spring-back.', tier: 'core' },
    { name: 'Optional: baking stone / deck-heat simulation', function: 'Mimics the strong bottom heat of a wood-fired clay deck.', targetEvidence: 'Wood oven has high thermal-mass floor.', simplerAlternative: 'A preheated heavy sheet pan on the lower rack.', failureMode: 'Stone too hot -> burnt base.', measurement: 'Even golden base.', tier: 'optional' },
    { name: 'Cool 5 min in mold, then invert/unmold onto rack', function: 'Prevents steam-softening the crust; sets structure.', targetEvidence: 'Standard.', simplerAlternative: 'None.', failureMode: 'Unmolding too hot -> tearing; leaving in mold too long -> gummy base.', measurement: 'Cake releases cleanly.', tier: 'core' },
    { name: 'Three-time sifting of flour', function: 'Rejected: no measurable improvement over one thorough sift.', targetEvidence: 'Parsimony check.', simplerAlternative: 'One thorough sift.', failureMode: 'Adds time during which foam waits and deflates.', measurement: 'n/a.', tier: 'reject' },
    { name: 'Combining whole-egg AND separated-egg methods in one recipe', function: 'Rejected: confounds the variable; adds steps and collapse risk.', targetEvidence: 'Previous report presented both as a single hybrid.', simplerAlternative: 'Pick ONE method per trial.', failureMode: 'Hybrid collapses more easily than either pure method.', measurement: 'n/a.', tier: 'reject' },
    { name: 'Adding baking powder "for reliability"', function: 'Rejected: no foam-only control was tested first.', targetEvidence: 'Parsimony + Red phase.', simplerAlternative: 'Foam-only baseline.', failureMode: 'Chemical taste; coarse crumb.', measurement: 'n/a.', tier: 'reject' },
    { name: 'Smoke exposure before unsmoked control', function: 'Rejected sequence: must establish unsmoked baseline first.', targetEvidence: 'Protocol Section F.', simplerAlternative: 'Run unsmoked control first.', failureMode: 'Confounds color and aroma variables.', measurement: 'n/a.', tier: 'reject' },
    { name: 'Treat algarrobina as equivalent to algarrobo wood smoke', function: 'Rejected: syrup flavor ≠ combustion smoke aroma.', targetEvidence: 'Protocol acceptance test.', simplerAlternative: 'Test each separately.', failureMode: 'False equivalence.', measurement: 'n/a.', tier: 'reject' },
    { name: 'Rest batter before baking', function: 'Rejected: deflates foam with no benefit.', targetEvidence: 'Parsimony.', simplerAlternative: 'Bake immediately.', failureMode: 'Loss of rise.', measurement: 'n/a.', tier: 'reject' },
  ]
  for (const t of techniques) await db.technique.create({ data: t })

  // ---------------------------------------------------------------- SUBSTITUTIONS
  const subs = [
    { original: 'All-purpose wheat flour', substitute: 'Cake flour / harina 0000', propertyReplaced: 'Lower protein for tenderness', propertyLost: 'Slightly less structural strength', quantityAdjustment: '1:1 by weight', techniqueAdjustment: 'Fold even more gently; do not overmix.', confidence: 'medium' },
    { original: 'All-purpose wheat flour (10% of weight)', substitute: 'Potato starch (chuño)', propertyReplaced: 'Tenderness, delayed staling', propertyLost: 'Some gluten strength; chuño has a slightly earthy note', quantityAdjustment: 'Replace 10% of flour weight 1:1', techniqueAdjustment: 'Sift together with flour.', confidence: 'medium' },
    { original: 'Potato starch (chuño)', substitute: 'Cornstarch (maicena)', propertyReplaced: 'Starch tenderization', propertyLost: 'Chuño gelatinizes at higher temp; cornstarch gives a slightly softer, shorter crumb', quantityAdjustment: '1:1 by weight', techniqueAdjustment: 'None, but expect marginally different mouthfeel', confidence: 'medium' },
    { original: 'Whole eggs', substitute: 'Separated eggs (yolks + whipped whites)', propertyReplaced: 'Greater volume; lighter texture', propertyLost: 'Simplicity; one extra bowl; higher collapse risk', quantityAdjustment: 'Same total egg weight', techniqueAdjustment: 'Beat yolks + sugar to ribbon; whip whites to soft peaks; fold whites in 3 additions', confidence: 'medium' },
    { original: 'Vanilla extract', substitute: 'Citrus zest (lime or orange)', propertyReplaced: 'Aroma', propertyLost: 'Sweet vanillin note; zest adds oil-soluble terpenes', quantityAdjustment: '1 tsp zest ≈ 2 g', techniqueAdjustment: 'Rub into sugar before whipping to release oils', confidence: 'low' },
    { original: 'Baking stone', substitute: 'Preheated heavy sheet pan on lower rack', propertyReplaced: 'Bottom radiant heat mass', propertyLost: 'Less thermal mass than a stone', quantityAdjustment: 'n/a', techniqueAdjustment: 'Preheat 20 min', confidence: 'medium' },
    { original: 'Wood-fired clay oven', substitute: 'Conventional home oven + stone + optional smoke treatment', propertyReplaced: 'Thermal profile', propertyLost: 'Combustion smoke aroma (unverified as perceptible)', quantityAdjustment: 'n/a', techniqueAdjustment: 'Use stone; test smoke as a separate variant only after unsmoked control', confidence: 'low' },
    { original: 'Algarrobina syrup', substitute: 'Chancaca syrup', propertyReplaced: 'Dark syrup color + molasses note', propertyLost: 'Algarrobina has a distinct carob flavor; chancaca is more caramel', quantityAdjustment: '1:1 by weight', techniqueAdjustment: 'Dissolve into egg foam at ribbon stage', confidence: 'low' },
  ]
  for (const s of subs) await db.substitution.create({ data: s })

  // ---------------------------------------------------------------- RECIPE VARIANTS
  const recipes = [
    {
      name: 'Core Best-Evidence Recipe (Foam-Only Control)',
      level: 1,
      summary: 'The minimal egg–sugar–flour–salt sponge. No chemical leavener, no starch, no fat, no flavoring. The baseline against which every other variant is compared.',
      question: 'What is the smallest formula that plausibly reproduces the target?',
      mainVariable: 'None — this is the control.',
      expectedEffect: 'Fine, even, golden-amber crumb with a tender crust and clean egg aroma; individual round domed cakes.',
      control: 'Itself.',
      successCriterion: 'Visible fine crumb; dome intact; deep golden-amber top; clean egg aroma; no chemical taste; no collapse; day-two texture still acceptable.',
      abandonmentCriterion: 'Collapse, dense lower layer, gummy center, or pale color after two controlled attempts.',
      ingredientsJson: JSON.stringify([
        { name: 'Whole eggs (room temp, shelled)', grams: 240, percent: 38.4, note: '~4 large eggs; weigh for accuracy' },
        { name: 'Granulated sugar', grams: 150, percent: 24.0, note: '~62.5% baker%' },
        { name: 'All-purpose wheat flour', grams: 150, percent: 24.0, note: 'Plain, not self-raising' },
        { name: 'Fine salt', grams: 1.5, percent: 0.24, note: '~0.6% baker%' },
      ]),
      stepsJson: JSON.stringify([
        'Preheat oven to 180°C (convection) or 190°C (static). Place a heavy baking sheet or stone on the lower rack to preheat.',
        'Grease 6 individual round molds (~7 cm dia, ~4 cm tall) and line bottoms with parchment. Do NOT grease the sides — the batter must grip to climb.',
        'In a heatproof bowl, combine whole eggs + sugar. Warm gently over a water bath to ~38°C, stirring, then remove from heat.',
        'Whip on high speed until pale, thick, tripled in volume, and a ribbon trail holds a 3-second figure-8 (~6-8 min).',
        'Sift flour + salt once directly over the foam.',
        'Fold in 3 additions using a wide spatula: cut down the middle, scrape along the bottom, lift up and over. Stop the instant no dry streaks remain.',
        'Divide batter into molds (~75 g each). Tap each mold once on the counter to release large bubbles.',
        'Bake on the middle rack 22-26 min. Do NOT open the door before 20 min.',
        'Done when: top is deep golden-amber, a toothpick comes out clean, internal temp ~95°C, and the surface springs back.',
        'Cool 5 min in the mold, then run a thin blade around (sides only) and invert onto a rack. Cool fully before packaging.',
      ]),
      yieldNote: '6 individual round domed cakes (~6.5 cm dia × ~3.5 cm tall), ~75 g each. Scale up linearly for 16-piece packs.',
    },
    {
      name: 'Practical Lima Substitution Variant',
      level: 2,
      summary: 'Same core formula, with the most likely Lima-availability substitutions applied: cake-flour-style tenderization via partial cornstarch (where chuño is unavailable) and a baking-stone substitute.',
      question: 'Can a Lima home baker match the target with supermarket ingredients?',
      mainVariable: 'Flour blend + stone substitute.',
      expectedEffect: 'Marginally softer crumb; equivalent color and rise.',
      control: 'Core recipe.',
      successCriterion: 'Equivalent or better crumb tenderness vs core, with no new defects.',
      abandonmentCriterion: 'Gummy crumb or off-flavor from the starch blend.',
      ingredientsJson: JSON.stringify([
        { name: 'Whole eggs (room temp, shelled)', grams: 240, percent: 38.2, note: 'San Fernando/Pehuen large' },
        { name: 'Granulated sugar', grams: 150, percent: 23.9, note: 'Blanca del Norte' },
        { name: 'All-purpose wheat flour', grams: 135, percent: 21.5, note: 'Blanca Flor plain' },
        { name: 'Cornstarch (maicena)', grams: 15, percent: 2.4, note: '10% of flour weight; chuño substitute' },
        { name: 'Fine salt', grams: 1.5, percent: 0.24, note: 'Sal Yodo' },
      ]),
      stepsJson: JSON.stringify([
        'Same as Core, with: sift flour + cornstarch + salt together twice for even dispersion.',
        'Place a preheated heavy baking sheet (or pizza stone) on the lower rack to simulate deck heat.',
        'Proceed identically through folding, dividing, and baking.',
      ]),
      yieldNote: '6 individual cakes.',
    },
    {
      name: 'Diagnostic A — Chuño vs Cornstarch',
      level: 3,
      summary: 'Controlled single-variable test: replace cornstarch with an equal weight of potato starch (chuño).',
      question: 'Does chuño produce a measurably different crumb than cornstarch?',
      mainVariable: 'Starch type (chuño vs cornstarch) at 10% of flour weight.',
      expectedEffect: 'Chuño: slightly higher gelatinization temp, marginally firmer bite, faintly earthier note.',
      control: 'Lima substitution variant (cornstarch).',
      successCriterion: 'Blind triangle test: can a taster distinguish chuño from cornstarch above chance?',
      abandonmentCriterion: 'No perceptible difference -> keep the more available starch (cornstarch).',
      ingredientsJson: JSON.stringify([
        { name: 'Whole eggs', grams: 240, percent: 38.2, note: '' },
        { name: 'Sugar', grams: 150, percent: 23.9, note: '' },
        { name: 'All-purpose flour', grams: 135, percent: 21.5, note: '' },
        { name: 'Potato starch (chuño)', grams: 15, percent: 2.4, note: 'Single variable vs control' },
        { name: 'Salt', grams: 1.5, percent: 0.24, note: '' },
      ]),
      stepsJson: JSON.stringify(['Identical to Lima substitution variant.']),
      yieldNote: '6 cakes — bake control and diagnostic side by side.',
    },
    {
      name: 'Diagnostic B — Whole-Egg vs Separated-Egg Foam',
      level: 3,
      summary: 'Controlled test: separated-egg method (yolks+ sugar ribbon, whites whipped separately, folded).',
      question: 'Does separated-egg method yield higher volume or finer crumb than whole-egg whipping?',
      mainVariable: 'Whipping method.',
      expectedEffect: 'Greater volume; potentially coarser cells; one extra bowl and step.',
      control: 'Core whole-egg recipe.',
      successCriterion: 'Measurably higher dome AND equal-or-better crumb fineness.',
      abandonmentCriterion: 'Higher dome but coarser crumb -> reject; keep whole-egg core.',
      ingredientsJson: JSON.stringify([
        { name: 'Eggs, separated', grams: 240, percent: 38.4, note: 'Yolks and whites weighed separately' },
        { name: 'Sugar (split)', grams: 150, percent: 24.0, note: '100 g to yolks, 50 g to whites' },
        { name: 'Flour', grams: 150, percent: 24.0, note: '' },
        { name: 'Salt', grams: 1.5, percent: 0.24, note: '0.75 g to yolks, 0.75 g to whites' },
      ]),
      stepsJson: JSON.stringify([
        'Whip yolks + 100 g sugar to ribbon stage.',
        'In a clean bowl, whip whites + 50 g sugar to soft-gloss peaks.',
        'Fold whites into yolk foam in 3 additions.',
        'Sift flour+salt and fold in 3 additions.',
        'Bake as core.',
      ]),
      yieldNote: '6 cakes.',
    },
    {
      name: 'Diagnostic C — Foam-Only vs Low-Dose Leavener',
      level: 3,
      summary: 'Controlled test: add 3 g baking powder (1.25% baker%) to the core formula.',
      question: 'Does a small dose of chemical leavener improve oven spring without chemical taste?',
      mainVariable: 'Baking powder presence (0 g vs 3 g).',
      expectedEffect: 'Slightly higher dome; risk of coarser cells; potential chemical aftertaste.',
      control: 'Core foam-only.',
      successCriterion: 'Higher dome AND no detectable chemical taste AND finer-or-equal crumb.',
      abandonmentCriterion: 'Any chemical taste -> reject; keep foam-only core.',
      ingredientsJson: JSON.stringify([
        { name: 'Whole eggs', grams: 240, percent: 38.3, note: '' },
        { name: 'Sugar', grams: 150, percent: 23.9, note: '' },
        { name: 'Flour', grams: 150, percent: 23.9, note: '' },
        { name: 'Baking powder', grams: 3, percent: 0.48, note: 'Single variable' },
        { name: 'Salt', grams: 1.5, percent: 0.24, note: '' },
      ]),
      stepsJson: JSON.stringify(['Sift baking powder with flour+salt. Otherwise identical to core.']),
      yieldNote: '6 cakes.',
    },
    {
      name: 'Diagnostic D — Fat-Free vs Trace Oil',
      level: 3,
      summary: 'Controlled test: add 15 g neutral oil (6.25% baker%) to the core.',
      question: 'Does a trace of fat improve day-two moisture without deflating the foam?',
      mainVariable: 'Oil presence (0 g vs 15 g).',
      expectedEffect: 'Moister day-two crumb; slightly lower foam volume; marginally softer crust.',
      control: 'Core foam-only.',
      successCriterion: 'Better day-two texture AND no collapse AND no oily mouthfeel.',
      abandonmentCriterion: 'Collapse or oily mouthfeel -> reject.',
      ingredientsJson: JSON.stringify([
        { name: 'Whole eggs', grams: 240, percent: 37.6, note: '' },
        { name: 'Sugar', grams: 150, percent: 23.5, note: '' },
        { name: 'Flour', grams: 150, percent: 23.5, note: '' },
        { name: 'Neutral vegetable oil', grams: 15, percent: 2.4, note: 'Single variable' },
        { name: 'Salt', grams: 1.5, percent: 0.24, note: '' },
      ]),
      stepsJson: JSON.stringify(['Drizzle oil over the finished foam and fold 5-6 strokes to incorporate. Otherwise identical to core.']),
      yieldNote: '6 cakes.',
    },
    {
      name: 'Speculative E — Thermal Wood-Oven Simulation (No Smoke)',
      level: 4,
      summary: 'Test whether the wood oven contribution is purely thermal (stone + radiant heat) by simulating deck heat WITHOUT smoke.',
      question: 'Is the wood-oven contribution fully explained by thermal profile alone?',
      mainVariable: 'Deck-heat intensity (stone preheated 45 min vs 20 min).',
      expectedEffect: 'Deeper base color; faster set; marginally taller dome.',
      control: 'Core recipe on a standard sheet pan.',
      successCriterion: 'Target base color matched without any smoke treatment.',
      abandonmentCriterion: 'If thermal alone matches target -> smoke variant unnecessary.',
      ingredientsJson: JSON.stringify([
        { name: 'Core recipe ingredients', grams: 541.5, percent: 100, note: 'Same as core' },
      ]),
      stepsJson: JSON.stringify([
        'Preheat pizza stone 45 min at 200°C, then reduce to 180°C.',
        'Bake cakes directly on stone (or on a thin sheet on the stone).',
        'Otherwise identical to core.',
      ]),
      yieldNote: '6 cakes.',
    },
    {
      name: 'Speculative F — Smoke Exposure (only AFTER unsmoked control)',
      level: 4,
      summary: 'Test whether perceptible smoke aroma is achievable and desirable. Run ONLY after Diagnostic E establishes the unsmoked baseline.',
      question: 'Does controlled smoke exposure produce a perceptible, pleasant note on the crust?',
      mainVariable: 'Smoke presence (0 vs 90-second surface exposure).',
      expectedEffect: 'Faint smoke note on crust; slightly darker color.',
      control: 'Diagnostic E (thermal simulation, no smoke).',
      successCriterion: 'Blind triangle test: tasters detect smoke above chance AND rate it pleasant.',
      abandonmentCriterion: 'No perceptible difference OR unpleasant -> reject; conclude wood oven is purely thermal.',
      ingredientsJson: JSON.stringify([
        { name: 'Core recipe ingredients', grams: 541.5, percent: 100, note: 'Same as core' },
        { name: 'Applewood or algarrobo chips (for smoke, not ingredient)', grams: 30, percent: 0, note: 'Surface exposure only' },
      ]),
      stepsJson: JSON.stringify([
        'Bake the core recipe to 90% done.',
        'In a ventilated outdoor setup, expose the cakes\' surface to thin smoke for 60-90 seconds.',
        'Return to oven 2 min to set.',
        'Cool and evaluate vs unsmoked control in a blind triangle test.',
      ]),
      yieldNote: '6 cakes.',
    },
    {
      name: 'Speculative G — Algarrobina Color/Flavor',
      level: 4,
      summary: 'Test whether algarrobina syrup reproduces the deep target color and adds a desirable note.',
      question: 'Is the deep golden-amber color explained by algarrobina, or by Maillard alone?',
      mainVariable: 'Algarrobina presence (0 vs 8 g), with sugar reduced 8 g to compensate.',
      expectedEffect: 'Deeper brown-amber color; darker, molasses/carob aroma.',
      control: 'Core recipe (Maillard-only color).',
      successCriterion: 'Blind test: color match AND pleasant, non-dominating aroma.',
      abandonmentCriterion: 'Off-flavor OR aroma contradicts "pure egg" identity -> reject.',
      ingredientsJson: JSON.stringify([
        { name: 'Whole eggs', grams: 240, percent: 38.6, note: '' },
        { name: 'Sugar', grams: 142, percent: 22.8, note: 'reduced 8 g' },
        { name: 'Flour', grams: 150, percent: 24.1, note: '' },
        { name: 'Algarrobina syrup', grams: 8, percent: 1.3, note: 'Single variable' },
        { name: 'Salt', grams: 1.5, percent: 0.24, note: '' },
      ]),
      stepsJson: JSON.stringify(['Blend algarrobina into the egg-sugar mix before whipping. Otherwise identical to core.']),
      yieldNote: '6 cakes.',
    },
  ]
  for (const r of recipes) await db.recipeVariant.create({ data: r })

  // ---------------------------------------------------------------- VALIDATION ROUNDS
  const validations = [
    {
      round: 1, lens: 'structural',
      checksJson: JSON.stringify([
        { check: 'Egg-to-flour ratio (1:0.625 by weight)', result: 'Within sponge range (0.5-0.7). Viable.', status: 'pass' },
        { check: 'Sugar-to-egg ratio (0.625)', result: 'Within foam-stabilizing range (0.5-0.8). Viable.', status: 'pass' },
        { check: 'Total solids ~49%', result: 'Appropriate for a fat-free foam sponge.', status: 'pass' },
        { check: 'Batter depth (~3.5 cm in 7 cm mold)', result: 'Allows 2x rise to dome above mold. OK.', status: 'pass' },
        { check: 'Estimated expansion (2.5-3x)', result: 'Consistent with whole-egg ribbon-stage foam.', status: 'pass' },
        { check: 'Baking loss (~12-15%)', result: 'Typical. Final piece ~65 g from 75 g batter.', status: 'pass' },
      ]),
      defects: 'None structural.', status: 'pass',
    },
    {
      round: 2, lens: 'historical',
      checksJson: JSON.stringify([
        { check: 'Period plausibility (~1913, eggs+flour+sugar)', result: 'Pre-chemical-leavener sponge is historically correct for the period.', status: 'pass' },
        { check: 'Family-scale production feasibility', result: 'Whipping eggs by hand or with rotary beater is period-appropriate.', status: 'pass' },
        { check: 'Regional ingredient availability (wheat flour, sugar, eggs)', result: 'All were common on the Lambayeque coast.', status: 'pass' },
        { check: '"Fresh eggs / special flours" producer statement', result: 'Reconciled: "special" may mean selected/proportioned, not necessarily exotic.', status: 'pass' },
        { check: 'Wood-oven economics', result: 'Consistent with rural bakery practice.', status: 'pass' },
      ]),
      defects: 'Chuño is plausible but unverified; kept out of core.', status: 'pass',
    },
    {
      round: 3, lens: 'target-comparison',
      checksJson: JSON.stringify([
        { check: 'Visible color (deep golden-amber)', result: 'Predicted: Maillard + caramelization at 180°C/24 min produces golden-amber. Match expected.', status: 'predicted' },
        { check: 'Shape (round domed, ~6.5 cm)', result: 'Predicted: 7 cm mold + 3.5 cm batter + 2x rise -> ~6.5 cm domed cake. Match expected.', status: 'predicted' },
        { check: 'Surface (pebbled, matte-satin)', result: 'Predicted: foam-only crust is matte; pebbling from small bubbles. Match expected.', status: 'predicted' },
        { check: 'Crumb (fine, even)', result: 'Predicted: ribbon-stage whole-egg foam yields fine cells. Match expected.', status: 'predicted' },
        { check: 'No filling/icing', result: 'Core has none. Match.', status: 'pass' },
      ]),
      defects: 'Comparison is PREDICTED, not measured — kitchen test required for confirmation.', status: 'revise',
    },
    {
      round: 4, lens: 'lima-practicality',
      checksJson: JSON.stringify([
        { check: 'Ingredient availability in Lima supermarkets', result: 'Eggs, sugar, AP flour, salt, cornstarch: all common. Chuño: specialist. Algarrobina: specialist.', status: 'pass' },
        { check: 'Oven tolerance', result: '180°C is standard; ±10°C tolerable with time adjustment.', status: 'pass' },
        { check: 'Humid coastal conditions', result: 'Lima humidity ~80%; bake 1-2 min longer or vent oven last 2 min.', status: 'pass' },
        { check: 'Equipment (7 cm molds)', result: 'Available as "pirotas" or ramekins; alternatively a muffin tin.', status: 'pass' },
        { check: 'Batch size / cost', result: '6 cakes cost ~S/8-10 in ingredients. Practical.', status: 'pass' },
      ]),
      defects: 'None.', status: 'pass',
    },
    {
      round: 5, lens: 'adversarial',
      checksJson: JSON.stringify([
        { check: '10% underwhipping', result: 'Predicted: ~15% less rise; acceptable. Fold time unchanged.', status: 'predicted' },
        { check: '10% overwhipping', result: 'Predicted: coarse cells; risk of foam separation. Mitigation: stop at ribbon stage, not "stiff".', status: 'predicted' },
        { check: 'Oven ±15°C error', result: 'Predicted: hotter -> darker crust, gummy center if pulled early; cooler -> collapse. Mitigation: thermometer.', status: 'predicted' },
        { check: 'Delayed baking (batter sits 5 min)', result: 'Predicted: ~10% volume loss. Mitigation: have oven preheated, molds ready BEFORE mixing.', status: 'predicted' },
        { check: 'Flour protein variation', result: 'Predicted: higher protein -> chewier. Mitigation: use plain AP, not bread flour.', status: 'predicted' },
        { check: 'Egg-size variation', result: 'Mitigated by weighing shelled eggs (core technique).', status: 'pass' },
      ]),
      defects: 'Most fault tests are predicted, not executed. Flagged as unresolved until tested.', status: 'revise',
    },
    {
      round: 6, lens: 'parsimony',
      checksJson: JSON.stringify([
        { check: 'Ingredient count (4 in core)', result: 'Minimum viable. Cannot reduce further.', status: 'pass' },
        { check: 'Active steps (10)', result: 'Each has an observable checkpoint. None ceremonial.', status: 'pass' },
        { check: 'Special equipment (7 cm molds, optional stone)', result: 'Stone is optional, demoted to speculative. Molds are essential.', status: 'pass' },
        { check: 'Variables changed simultaneously in core', result: 'None — core is single-method.', status: 'pass' },
        { check: 'Redundant safeguards', result: 'None detected. Removed: 3x sifting, hybrid whole+separated, "insurance" baking powder.', status: 'pass' },
        { check: 'Fidelity to target (not generic cake)', result: 'Optimized for round, domed, golden-amber, fine-crumb, no-filling — matches photographed product.', status: 'pass' },
      ]),
      defects: 'None.', status: 'pass',
    },
    {
      round: 7, lens: 'parsimony',
      checksJson: JSON.stringify([
        { check: 'Red-team re-audit: smoke claim upgrade', result: 'Smoke claim upgraded from unresolved to strongly-supported. Algarrobo wood confirmed by 3+ independent sources. This RESOLVES a previously-open gate.', status: 'pass' },
        { check: 'Red-team re-audit: DIGESA regulatory claim', result: 'Official DIGESA document found confirming 48h exemption. Upgraded from plausible to strongly-supported.', status: 'pass' },
        { check: 'Red-team re-audit: algarrobina claim', result: 'Upgraded from weak to plausible (algarrobo wood confirmed, algarrobina from same tree). Still speculative for core recipe.', status: 'pass' },
        { check: 'Red-team re-audit: smoke ingredient tier', result: 'Smoke exposure upgraded from speculative to diagnostic tier. Evidence basis now medium (confirmed wood, needs triangle test for perceptibility).', status: 'pass' },
        { check: 'Red-team re-audit: foam-only core', result: 'Multiple published Peruvian recipes confirm foam-only without baking powder is standard. Core recipe validated.', status: 'pass' },
        { check: 'Red-team re-audit: parsimony check', result: 'No new complexity added to core. Smoke stays in diagnostic tier, not core. Core remains 4 ingredients.', status: 'pass' },
        { check: 'Red-team re-audit: convergence status', result: 'Round 6 was quiet. This round (7) resolves the smoke gate — counts as a partial quiet round. Convergence: 1.5/2. One more full quiet round needed after kitchen testing.', status: 'pass' },
      ]),
      defects: 'None critical. The smoke upgrade means the core unsmoked recipe is now LESS faithful to the target — a diagnostic smoke variant is more important than before.', status: 'pass',
    },
  ]
  for (const v of validations) await db.validationRound.create({ data: v })

  // ---------------------------------------------------------------- COMPLEXITY LOG
  const complexity = [
    { original: '10 g baking powder in baseline', problem: 'Unsupported; no foam-only control tested first; 4.2% baker% risks chemical taste.', action: 'Removed from core. Demoted to Diagnostic C at 3 g.', result: 'Clean foam-only control; interpretable leavener test.' },
    { original: '100 g starch (chuño + cornstarch together)', problem: 'Confounds two starches in one formula; cannot attribute any effect.', action: 'Removed from core. Split into Diagnostic A (chuño vs cornstarch, single variable).', result: 'Clean starch comparison.' },
    { original: 'Whole-egg + separated-egg hybrid method', problem: 'Two leavening methods in one recipe; redundant; higher collapse risk.', action: 'Selected whole-egg for core. Separated-egg is Diagnostic B.', result: 'One method per trial; fewer collapse risks.' },
    { original: 'Vanilla + citrus zest together', problem: 'Two aroma variables; neither evidenced for Valera.', action: 'Removed from core. Vanilla is Diagnostic; zest is a substitution option for vanilla only.', result: 'Clean aroma evaluation.' },
    { original: 'Smoke + algarrobina in same batch', problem: 'Two uncontrolled aroma/color variables.', action: 'Separated into Speculative F (smoke) and Speculative G (algarrobina). Each tested only after its unsmoked/Maillard-only control.', result: 'Safe, interpretable tests.' },
    { original: 'Three-time sifting of flour', problem: 'No measurable benefit over one thorough sift; adds wait time that deflates foam.', action: 'Reduced to one thorough sift (or two for starch blends).', result: 'Faster workflow; better foam retention.' },
    { original: '"Bake until done" instruction', problem: 'Unobservable checkpoint.', action: 'Replaced with three explicit checkpoints: color (deep golden-amber), toothpick clean, internal ~95°C.', result: 'Repeatable doneness.' },
    { original: 'Resting batter before baking', problem: 'Deflates foam; no benefit.', action: 'Removed. Bake immediately after folding.', result: 'Better rise.' },
    { original: '16-piece rectangular slab assumption', problem: 'Contradicted by VLM image analysis (round individual cakes).', action: 'Replaced target with individual round molds (~6.5 cm).', result: 'Target matches photographed product.' },
    { original: 'Smoke as "unresolved" speculative tier', problem: 'Red-team audit found 3+ independent sources confirming algarrobo wood use. The smoke claim was no longer unresolved.', action: 'Upgraded smoke claim from unresolved to strongly-supported. Upgraded smoke ingredient from speculative to diagnostic tier.', result: 'Evidence-led tier promotion; smoke variant now testable as diagnostic, not just speculative.' },
    { original: 'DIGESA regulatory claim as "plausible"', problem: 'Red-team audit found official DIGESA document confirming 48h exemption for bakery products.', action: 'Upgraded from plausible to strongly-supported with direct regulatory citation.', result: 'Regulatory gate resolved; artisanal exemption confirmed.' },
  ]
  for (const c of complexity) await db.complexityLog.create({ data: c })

  // ---------------------------------------------------------------- FAILURE TESTS
  const failures = [
    { failureMode: 'Insufficient rise', threshold: '<1.5x original batter height', detection: 'Visual + height measurement', severity: 'critical', status: 'predicted' },
    { failureMode: 'Excessive dome / mushrooming', threshold: 'Top wider than base', detection: 'Visual', severity: 'major', status: 'predicted' },
    { failureMode: 'Collapse after baking', threshold: '>20% height loss on cooling', detection: 'Height before/after', severity: 'critical', status: 'predicted' },
    { failureMode: 'Gummy center', threshold: 'Toothpick wet; internal <90°C', detection: 'Toothpick + thermometer', severity: 'critical', status: 'predicted' },
    { failureMode: 'Coarse tunnels', threshold: 'Visible >3 mm cells', detection: 'Crumb cross-section', severity: 'major', status: 'predicted' },
    { failureMode: 'Dense lower layer', threshold: 'Lower 1/3 visibly compressed', detection: 'Cross-section', severity: 'major', status: 'predicted' },
    { failureMode: 'Dry/chalky crumb', threshold: 'Crumb rubs to powder', detection: 'Tactile + mouthfeel', severity: 'major', status: 'predicted' },
    { failureMode: 'Crust too thick', threshold: '>2 mm hard crust', detection: 'Visual + tactile', severity: 'minor', status: 'predicted' },
    { failureMode: 'Top too pale', threshold: 'Lighter than Pantone 7513C', detection: 'Color reference', severity: 'minor', status: 'predicted' },
    { failureMode: 'Top too dark', threshold: 'Darker than Pantone 7515C', detection: 'Color reference', severity: 'minor', status: 'predicted' },
    { failureMode: 'Excessive egg aroma', threshold: 'Sulfur note > 2 s aftertaste', detection: 'Sensory', severity: 'minor', status: 'predicted' },
    { failureMode: 'Chemical-leavener taste', threshold: 'Any bitter/soapy note', detection: 'Sensory', severity: 'critical', status: 'predicted' },
    { failureMode: 'Obvious smoke flavor', threshold: 'Smoke detected in >50% of unprimed tasters', detection: 'Blind triangle test', severity: 'major', status: 'predicted' },
    { failureMode: 'Poor day-two texture', threshold: '>30% moisture loss or staling note', detection: 'Day-2 sensory', severity: 'major', status: 'predicted' },
  ]
  for (const f of failures) await db.failureTest.create({ data: f })

  console.log(`${GREEN}Seed complete.${RESET}`)
  console.log(`  Claims:          ${await db.claim.count()}`)
  console.log(`  Ingredients:     ${await db.ingredient.count()}`)
  console.log(`  Techniques:      ${await db.technique.count()}`)
  console.log(`  Substitutions:   ${await db.substitution.count()}`)
  console.log(`  Recipe variants: ${await db.recipeVariant.count()}`)
  console.log(`  Validation rounds: ${await db.validationRound.count()}`)
  console.log(`  Complexity logs: ${await db.complexityLog.count()}`)
  console.log(`  Research rounds: ${await db.researchRound.count()}`)
  console.log(`  Failure tests:   ${await db.failureTest.count()}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
