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
    reason: "Red-team audit complete. Round 6 (parsimony) was quiet. Round 7 (red-team re-audit) resolved the smoke gate (algarrobo wood confirmed by 3+ sources) and the DIGESA regulatory gate (official document found). Both rounds found no new critical defects and no unjustified simplifications. Two consecutive quiet rounds achieved — convergence reached.",
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
