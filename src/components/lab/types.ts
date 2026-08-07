// Shared types for the Chongoyape Bizcochuelos Reverse-Engineering Lab.

export type Confidence =
  | 'confirmed'
  | 'strongly-supported'
  | 'plausible'
  | 'weak'
  | 'contradicted'
  | 'unresolved'

export type Tier = 'core' | 'substitution' | 'diagnostic' | 'speculative' | 'rejected' | 'optional'

export type Status = 'pass' | 'revise' | 'reopen' | 'open' | 'downgraded' | 'removed' | 'predicted' | 'tested' | 'mitigated' | 'superseded'

export interface Claim {
  id: string
  category: string
  statement: string
  confidence: Confidence
  evidenceBasis: string
  counterTest: string | null
  status: string
}

export interface Ingredient {
  id: string
  name: string
  grams: number
  percent: number
  bakerPercent: number
  function: string
  evidence: string
  confidence: Confidence
  limaAvailability: string
  supermarketOption: string
  substitution: string
  ratioAdjustment: string
  expectedEffect: string
  newRisk: string
  omissionResult: string
  tier: string
}

export interface Technique {
  id: string
  name: string
  function: string
  targetEvidence: string
  simplerAlternative: string
  failureMode: string
  measurement: string
  tier: string
}

export interface Substitution {
  id: string
  original: string
  substitute: string
  propertyReplaced: string
  propertyLost: string
  quantityAdjustment: string
  techniqueAdjustment: string
  confidence: Confidence
}

export interface RecipeIngredient {
  name: string
  grams: number
  percent: number
  note: string
}

export interface RecipeVariant {
  id: string
  name: string
  level: number
  summary: string
  question: string | null
  mainVariable: string | null
  expectedEffect: string | null
  control: string | null
  successCriterion: string | null
  abandonmentCriterion: string | null
  ingredients: RecipeIngredient[]
  steps: string[]
  yieldNote: string
}

export interface ValidationCheck {
  check: string
  result: string
  status: string
}

export interface ValidationRound {
  id: string
  round: number
  lens: string
  checks: ValidationCheck[]
  defects: string | null
  status: string
}

export interface ComplexityLog {
  id: string
  original: string
  problem: string
  action: string
  result: string
}

export interface ResearchRound {
  id: string
  phase: string
  round: number
  kind: string
  findings: string
  strengthened: string
  weakened: string
  contradictions: string
  decisionsChanged: string
  unresolved: string
  continueResearch: boolean
}

export interface FailureTest {
  id: string
  failureMode: string
  threshold: string
  detection: string
  severity: string
  status: string
}

export interface LabData {
  claims: Claim[]
  ingredients: Ingredient[]
  techniques: Technique[]
  substitutions: Substitution[]
  recipes: RecipeVariant[]
  validations: ValidationRound[]
  complexity: ComplexityLog[]
  research: ResearchRound[]
  failures: FailureTest[]
  stats: {
    claims: Record<string, number>
    validations: Record<string, number>
    convergence: {
      quietRounds: number
      requiredQuiet: number
      converged: boolean
      reason: string
      // Recipe convergence (Phase 4: simulated-kitchen-test methodology).
      // Optional so old data without `recipe` still type-checks; the Verdict
      // UI handles undefined gracefully with an "not yet assessed" banner.
      recipe?: {
        converged: boolean
        failureTestsResolved: string // e.g. "13/14"
        formulaLocked: boolean
        selectedVariant: string // e.g. "L1 Foam-Only Control"
        reason: string
      }
    }
  }
}
