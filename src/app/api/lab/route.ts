import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Aggregate endpoint: returns every ledger and structured artifact
// required to render the lab in a single round-trip.
export async function GET() {
  const [
    claims,
    ingredients,
    techniques,
    substitutions,
    recipes,
    validations,
    complexity,
    research,
    failures,
  ] = await Promise.all([
    db.claim.findMany({ orderBy: { category: 'asc' } }),
    db.ingredient.findMany({ orderBy: [{ tier: 'asc' }, { name: 'asc' }] }),
    db.technique.findMany({ orderBy: { tier: 'asc' } }),
    db.substitution.findMany({ orderBy: { original: 'asc' } }),
    db.recipeVariant.findMany({ orderBy: { level: 'asc' } }),
    db.validationRound.findMany({ orderBy: { round: 'asc' } }),
    db.complexityLog.findMany({ orderBy: { createdAt: 'asc' } }),
    db.researchRound.findMany({ orderBy: [{ phase: 'asc' }, { round: 'asc' }] }),
    db.failureTest.findMany({ orderBy: { severity: 'asc' } }),
  ])

  // Parse JSON fields for the client
  const parsedRecipes = recipes.map((r) => ({
    ...r,
    ingredients: JSON.parse(r.ingredientsJson),
    steps: JSON.parse(r.stepsJson),
  }))
  const parsedValidations = validations.map((v) => ({
    ...v,
    checks: JSON.parse(v.checksJson),
  }))

  // Summary statistics for the dashboard header
  // Keys match the confidence enum values (kebab-case) for direct lookup
  const claimStats = {
    confirmed: claims.filter((c) => c.confidence === 'confirmed').length,
    'strongly-supported': claims.filter((c) => c.confidence === 'strongly-supported').length,
    plausible: claims.filter((c) => c.confidence === 'plausible').length,
    weak: claims.filter((c) => c.confidence === 'weak').length,
    unresolved: claims.filter((c) => c.confidence === 'unresolved').length,
    contradicted: claims.filter((c) => c.confidence === 'contradicted').length,
    total: claims.length,
  }

  const validationStats = {
    pass: validations.filter((v) => v.status === 'pass').length,
    revise: validations.filter((v) => v.status === 'revise').length,
    reopen: validations.filter((v) => v.status === 'reopen').length,
    total: validations.length,
  }

  const convergence = {
    quietRounds: 1, // Round 6 was quiet; Round 5 raised unresolved predictions
    requiredQuiet: 2,
    converged: false,
    reason:
      'Round 6 (parsimony) was quiet. Round 5 (adversarial) raised predicted-but-untested fault modes. One additional quiet round is required after kitchen execution of the fault tests.',
  }

  return NextResponse.json({
    claims,
    ingredients,
    techniques,
    substitutions,
    recipes: parsedRecipes,
    validations: parsedValidations,
    complexity,
    research,
    failures,
    stats: { claims: claimStats, validations: validationStats, convergence },
  })
}
