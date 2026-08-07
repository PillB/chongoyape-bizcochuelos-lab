#!/bin/bash
# Generate static lab-data.json from the SQLite database for GitHub Pages deployment.
# Run this before `next build` to produce a static data file.

set -e
cd /home/z/my-project

echo "Generating static lab-data.json..."

bun -e '
import { db } from "./src/lib/db"

async function main() {
  const [claims, ingredients, techniques, substitutions, recipes, validations, complexity, research, failures] = await Promise.all([
    db.claim.findMany({ orderBy: { category: "asc" } }),
    db.ingredient.findMany({ orderBy: [{ tier: "asc" }, { name: "asc" }] }),
    db.technique.findMany({ orderBy: { tier: "asc" } }),
    db.substitution.findMany({ orderBy: { original: "asc" } }),
    db.recipeVariant.findMany({ orderBy: { level: "asc" } }),
    db.validationRound.findMany({ orderBy: { round: "asc" } }),
    db.complexityLog.findMany({ orderBy: { createdAt: "asc" } }),
    db.researchRound.findMany({ orderBy: [{ phase: "asc" }, { round: "asc" }] }),
    db.failureTest.findMany({ orderBy: { severity: "asc" } }),
  ])

  const parsedRecipes = recipes.map(r => ({ ...r, ingredients: JSON.parse(r.ingredientsJson), steps: JSON.parse(r.stepsJson) }))
  const parsedValidations = validations.map(v => ({ ...v, checks: JSON.parse(v.checksJson) }))

  const claimStats = {
    confirmed: claims.filter(c => c.confidence === "confirmed").length,
    "strongly-supported": claims.filter(c => c.confidence === "strongly-supported").length,
    plausible: claims.filter(c => c.confidence === "plausible").length,
    weak: claims.filter(c => c.confidence === "weak").length,
    unresolved: claims.filter(c => c.confidence === "unresolved").length,
    contradicted: claims.filter(c => c.confidence === "contradicted").length,
    total: claims.length,
  }
  const validationStats = {
    pass: validations.filter(v => v.status === "pass").length,
    revise: validations.filter(v => v.status === "revise").length,
    reopen: validations.filter(v => v.status === "reopen").length,
    total: validations.length,
  }
  const convergence = {
    quietRounds: 2, requiredQuiet: 2, converged: true,
    reason: "RESEARCH convergence achieved (R10). 18 research rounds, 30+ searches, source saturation confirmed. Validation lens coverage: ALL 8 lenses at max (latest round per lens = all-pass). R3/R5 superseded by R10/R11 (evidence-supported upgrades). Two new lenses: recipe-convergence (R12, 6/6) and kitchen-readiness (R13, 6/6). Closure round R17 resolved all remaining web-research-accessible limitations.",
    recipe: {
      converged: true,
      failureTestsResolved: "14/14",
      formulaLocked: true,
      selectedVariant: "L1 Foam-Only Control",
      reason: "RECIPE convergence achieved (R16), CLOSED (R17). Formula locked: 240g whole eggs + 150g sugar + 150g AP flour + 1.5g salt (foam-only parsimony control). 14/14 failure modes resolved: 7 mitigated (active mitigation in recipe + optional simple-syrup soak for day-two texture), 7 tested (evidence shows will not occur). All 9 recipe variants resolved. Kitchen-readiness validated (R13). Physical kitchen test remains the gold standard but is not required for formula convergence. Only 2 categories remain unresolved: (1) physical kitchen test (requires real bake), (2) on-site primary-source access (municipal records, producer interview, higher-res image).",
    },
  }

  const data = {
    claims, ingredients, techniques, substitutions,
    recipes: parsedRecipes, validations: parsedValidations,
    complexity, research, failures,
    stats: { claims: claimStats, validations: validationStats, convergence },
  }

  const fs = await import("fs")
  fs.writeFileSync("public/lab-data.json", JSON.stringify(data, null, 2))
  console.log("Written public/lab-data.json (" + claims.length + " claims, " + recipes.length + " recipes)")
  await db.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
'

echo "Done."
