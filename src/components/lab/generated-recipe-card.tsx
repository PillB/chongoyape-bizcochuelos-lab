'use client'

import { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Printer,
  ChefHat,
  Clock,
  Thermometer,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types (mirror recipe-sandbox internal types)
// ---------------------------------------------------------------------------

interface SandboxToggle {
  id: string
  label: string
  enabled: boolean
}

interface GeneratedFormula {
  eggs: number
  sugar: number
  flour: number
  salt: number
  starch: number
  leavener: number
  oil: number
  vanilla: number
  algarrobina: number
}

interface Step {
  step: string
  detail: string
  time: string
}

interface Ingredient {
  name: string
  grams: number
  note: string
}

// ---------------------------------------------------------------------------
// Validation logic (based on LLM evidence-based analysis of 18 configurations)
// ---------------------------------------------------------------------------

type Validity = 'valid' | 'valid-with-caveats' | 'invalid'

interface ValidationResult {
  validity: Validity
  foodScienceAssessment: string
  issueIdentified: string
  configurationName: string
}

function validateConfiguration(toggles: SandboxToggle[]): ValidationResult {
  const isOn = (id: string) => toggles.find((t) => t.id === id)?.enabled ?? false
  const active = toggles.filter((t) => t.enabled).map((t) => t.id)

  // Build configuration name
  const toggleLabels: Record<string, string> = {
    chuño: 'Chuño',
    leavener: 'Leavener',
    oil: 'Oil',
    vanilla: 'Vanilla',
    separated: 'Separated-egg',
    smoke: 'Smoke',
    algarrobina: 'Algarrobina',
    stone: 'Stone',
  }

  let name: string
  if (active.length === 0) {
    name = 'Core Foam-Only Control'
  } else if (active.length === 8) {
    name = 'All-Modifications Composite'
  } else {
    name = active.map((id) => toggleLabels[id] || id).join(' + ') + ' Variant'
  }

  // Validation rules (derived from LLM food-science analysis)
  const hasOil = isOn('oil')
  const hasSeparated = isOn('separated')
  const hasLeavener = isOn('leavener')
  const hasSmoke = isOn('smoke')
  const hasAlgarrobina = isOn('algarrobina')
  const hasVanilla = isOn('vanilla')
  const allOn = active.length === 8

  // Rule 1: Oil without separated-egg = invalid (fat destabilizes whole-egg foam)
  if (hasOil && !hasSeparated) {
    return {
      validity: 'invalid',
      foodScienceAssessment:
        'Oil destabilizes the whole-egg foam protein network. Egg yolk fat interferes with foam stabilization; adding free oil without the separated-egg method (which uses whites-only foam that tolerates fat better) causes batter collapse. This is a fundamental foam-cake chemistry incompatibility.',
      issueIdentified: 'Foam destabilization from oil without separated-egg method — batter will collapse.',
      configurationName: name,
    }
  }

  // Rule 2: All 8 toggles on = invalid (multiple conflicts)
  if (allOn) {
    return {
      validity: 'invalid',
      foodScienceAssessment:
        'Multiple conflicting elements: oil + whole-egg foam (collapse risk), smoke + algarrobina + vanilla (three competing aroma vectors), leavener + separated (double-leavening). The configuration is food-science invalid as a coherent recipe.',
      issueIdentified: 'Multiple conflicting elements — fat + foam, triple aroma, double leavening.',
      configurationName: name,
    }
  }

  // Rule 3: Smoke or algarrobina = caveats (unverified flavors, not in thesis)
  if (hasSmoke || hasAlgarrobina) {
    const notes: string[] = []
    if (hasSmoke) notes.push('smoke perceptibility unverified (needs triangle test)')
    if (hasAlgarrobina) notes.push('algarrobina not in thesis ingredient list, changes flavor identity')
    if (hasVanilla) notes.push('vanilla contradicted by primary source ingredient list')
    return {
      validity: 'valid-with-caveats',
      foodScienceAssessment:
        'Configuration is structurally sound but includes ingredients/techniques not evidenced in the primary source (master thesis ingredient list). The food science is valid but the flavor identity departs from the target product.',
      issueIdentified: notes.join('; ') + '.',
      configurationName: name,
    }
  }

  // Rule 4: Leavener without separated-egg = caveats (potential over-leavening)
  if (hasLeavener && !hasSeparated) {
    return {
      validity: 'valid-with-caveats',
      foodScienceAssessment:
        'Baking powder adds supplemental CO₂ beyond foam aeration. At 3g (1.25% baker%) the dose is low, but combined with whole-egg foam there is a risk of over-leavening and coarse crumb cell size. The thesis confirms Valera uses baking powder, but the exact dose and effect are unverified.',
      issueIdentified: 'Potential over-leavening and coarse crumb — dose unverified.',
      configurationName: name,
    }
  }

  // Rule 5: Vanilla only = caveats (contradicted by thesis)
  if (hasVanilla && !hasSmoke && !hasAlgarrobina) {
    return {
      validity: 'valid-with-caveats',
      foodScienceAssessment:
        'Vanilla adds a sweet top note but is NOT in the thesis ingredient list (which lists only flour, sugar, eggs, baking powder, chuño, milk). The food science is valid but the ingredient contradicts the primary source.',
      issueIdentified: 'Vanilla contradicted by primary source ingredient list.',
      configurationName: name,
    }
  }

  // Rule 6: Chuño only = caveats (reduced structural integrity)
  if (isOn('chuño') && active.length === 1) {
    return {
      validity: 'valid-with-caveats',
      foodScienceAssessment:
        'Potato starch (chuño) dilutes gluten-forming proteins, tenderizing the crumb and slowing staling (potato starch retrogrades more slowly than wheat starch). At 10% flour replacement, structural integrity is slightly reduced. The thesis confirms chuño is a Valera ingredient.',
      issueIdentified: 'Reduced structural integrity — crumb more fragile.',
      configurationName: name,
    }
  }

  // Default: valid
  return {
    validity: 'valid',
    foodScienceAssessment:
      active.length === 0
        ? 'The foam-only core (eggs + sugar + flour + salt) is the minimum viable sponge. Whole-egg ribbon-stage foam provides all leavening. Ratios (1:0.625:0.625 eggs:sugar:flour) are within canonical genoise range. Food-science sound.'
        : 'Configuration is food-science valid. Ingredient ratios and technique modifications are compatible with foam-cake chemistry. No conflicts identified.',
    issueIdentified: 'none',
    configurationName: name,
  }
}

// ---------------------------------------------------------------------------
// Recipe generation (ingredients + method + checkpoints + pitfalls)
// ---------------------------------------------------------------------------

function generateIngredients(formula: GeneratedFormula): Ingredient[] {
  const list: Ingredient[] = [
    { name: 'Whole eggs (room temp)', grams: formula.eggs, note: 'Weigh shelled; ~4 large eggs' },
  ]
  if (formula.sugar > 0) list.push({ name: 'Granulated sugar', grams: formula.sugar, note: 'Blanca del Norte or equivalent' })
  if (formula.flour > 0) list.push({ name: 'All-purpose wheat flour', grams: formula.flour, note: 'Plain, not self-raising' })
  if (formula.starch > 0) list.push({ name: 'Potato starch (chuño)', grams: formula.starch, note: 'Replaces 10% of flour' })
  if (formula.leavener > 0) list.push({ name: 'Baking powder', grams: formula.leavener, note: 'Low-dose; ~1.25% baker%' })
  if (formula.oil > 0) list.push({ name: 'Neutral vegetable oil', grams: formula.oil, note: 'Add in final fold' })
  if (formula.vanilla > 0) list.push({ name: 'Vanilla extract', grams: formula.vanilla, note: 'Add to eggs before whipping' })
  if (formula.algarrobina > 0) list.push({ name: 'Algarrobina (carob syrup)', grams: formula.algarrobina, note: 'Sugar reduced to compensate' })
  if (formula.salt > 0) list.push({ name: 'Fine salt', grams: formula.salt, note: 'Sal Yodo' })
  return list
}

function generateSteps(toggles: SandboxToggle[], formula: GeneratedFormula): Step[] {
  const isOn = (id: string) => toggles.find((t) => t.id === id)?.enabled ?? false
  const steps: Step[] = []

  // Step 1: Preheat
  const stoneNote = isOn('stone') ? ' Place a preheated baking stone on the lower rack.' : ''
  steps.push({
    step: 'Preheat',
    detail: `180°C convection (or 190°C static).${stoneNote} Grease 6 × 7cm round molds, line bottoms with parchment. Do NOT grease sides — batter must grip to climb.`,
    time: '20 min',
  })

  // Step 2: Warm & whip (modified by separated, vanilla, algarrobina)
  if (isOn('separated')) {
    steps.push({
      step: 'Separate & whip',
      detail: `Separate eggs. Warm yolks + ${formula.sugar}g sugar to ~38°C over water bath. Whip yolk mixture to thick ribbon (pale, tripled). In a clean bowl, whip whites to soft peaks. Fold whites into yolk foam in 3 additions.${isOn('vanilla') ? ' Add vanilla to yolk mixture before whipping.' : ''}${isOn('algarrobina') ? ' Add algarrobina to yolk mixture; sugar already reduced.' : ''}`,
      time: '8-10 min',
    })
  } else {
    const additions: string[] = []
    if (isOn('vanilla')) additions.push('vanilla')
    if (isOn('algarrobina')) additions.push('algarrobina')
    const addNote = additions.length ? ` Add ${additions.join(' + ')} before whipping.` : ''
    steps.push({
      step: 'Warm & whip',
      detail: `Warm whole eggs + ${formula.sugar}g sugar to ~38°C over water bath, stirring.${addNote} Whip on high until pale, tripled in volume, ribbon trail holds 3-sec figure-8.`,
      time: '6-8 min',
    })
  }

  // Step 3: Sift & fold (modified by chuño, leavener, oil)
  const dryIngredients = ['flour', 'salt']
  if (isOn('chuño')) dryIngredients.push('chuño')
  if (isOn('leavener')) dryIngredients.push('baking powder')
  const oilNote = isOn('oil') ? ' Drizzle oil around the bowl edge in the final fold addition.' : ''
  steps.push({
    step: 'Sift & fold',
    detail: `Sift ${dryIngredients.join(' + ')} once directly over the foam. Fold in 3 additions — cut down middle, scrape bottom, lift over. Stop the instant no dry streaks remain.${oilNote}`,
    time: '2 min',
  })

  // Step 4: Fill & tap
  steps.push({
    step: 'Fill & tap',
    detail: 'Divide ~75g batter per mold. Tap each mold once on counter to release large bubbles. Bake immediately — do not let batter sit.',
    time: '1 min',
  })

  // Step 5: Bake (modified by stone)
  const bakeNote = isOn('stone') ? ' The stone provides conductive deck heat — watch base color at 20 min.' : ''
  steps.push({
    step: 'Bake',
    detail: `Middle rack, 22-26 min. Do NOT open door before 20 min. Done when deep golden-amber, toothpick clean, internal ~95°C.${bakeNote}`,
    time: '22-26 min',
  })

  // Step 6: Cool
  steps.push({
    step: 'Cool',
    detail: '5 min in mold, then run thin blade around sides, invert onto rack. Cool fully before packaging or smoke treatment.',
    time: '30 min',
  })

  // Step 7: Smoke (optional)
  if (isOn('smoke')) {
    steps.push({
      step: 'Smoke exposure',
      detail: 'Place cooled cakes on a wire rack. Expose crust to algarrobo wood smoke for 60-90 seconds (cold-smoke method). Do not heat cakes further. Let rest 5 min before packaging.',
      time: '5 min',
    })
  }

  // Step 8: Simple syrup finish (always recommended for day-two texture)
  steps.push({
    step: 'Optional: simple syrup',
    detail: 'For improved day-two texture: brush warm cakes with simple syrup (15g sugar + 30g water, dissolved). Retards starch retrogradation per published anti-staling research.',
    time: '2 min',
  })

  return steps
}

function generateCheckpoints(toggles: SandboxToggle[]): { label: string; check: string }[] {
  const isOn = (id: string) => toggles.find((t) => t.id === id)?.enabled ?? false
  const checkpoints = [
    { label: 'Ribbon stage', check: isOn('separated') ? 'Yolk trail holds 3-sec figure-8; whites at soft peaks' : 'Trail holds 3-sec figure-8' },
    { label: 'Fold complete', check: 'No dry streaks; batter still voluminous' + (isOn('oil') ? '; oil fully incorporated' : '') },
    { label: 'Doneness', check: `Deep golden-amber${isOn('algarrobina') ? ' (note: algarrobina deepens base color)' : ''} + toothpick clean + ~95°C internal` },
    { label: 'Cool', check: 'Cake releases cleanly from mold' },
  ]
  if (isOn('smoke')) {
    checkpoints.push({ label: 'Smoke', check: 'Faint smoke aroma on crust — not acrid' })
  }
  return checkpoints
}

function generatePitfalls(toggles: SandboxToggle[]): string[] {
  const isOn = (id: string) => toggles.find((t) => t.id === id)?.enabled ?? false
  const pitfalls = [
    'Underwhipping → dense, low rise. Whip until the ribbon trail holds.',
    'Overfolding → deflated foam. Stop the instant no streaks remain.',
    'Opening oven early → collapse. Wait until 20 min minimum.',
    'Greased sides → slumped, mushroomed top. Leave sides ungreased.',
  ]
  if (isOn('oil')) {
    pitfalls.push('Oil deflates foam — fold gently and quickly in the final addition only.')
  }
  if (isOn('leavener')) {
    pitfalls.push('Too much baking powder → chemical taste + coarse crumb. Measure precisely (3g max).')
  }
  if (isOn('chuño')) {
    pitfalls.push('Chuño makes crumb fragile — handle cakes gently when unmolding.')
  }
  if (isOn('smoke')) {
    pitfalls.push('Over-smoking → acrid bitterness. Maximum 90 seconds exposure.')
  }
  if (isOn('algarrobina')) {
    pitfalls.push('Algarrobina darkens color faster — check doneness at 20 min, not 22.')
  }
  if (isOn('stone')) {
    pitfalls.push('Stone scorches the base — check bottom color at 18 min.')
  }
  if (isOn('separated')) {
    pitfalls.push('Separated-egg adds steps — keep yolks and whites in separate clean bowls.')
  }
  return pitfalls
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface GeneratedRecipeCardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  toggles: SandboxToggle[]
  formula: GeneratedFormula
  tier: string
  tierLabel: string
}

export function GeneratedRecipeCard({
  open,
  onOpenChange,
  toggles,
  formula,
  tier,
  tierLabel,
}: GeneratedRecipeCardProps) {
  const validation = useMemo(() => validateConfiguration(toggles), [toggles])
  const ingredients = useMemo(() => generateIngredients(formula), [formula])
  const steps = useMemo(() => generateSteps(toggles, formula), [toggles, formula])
  const checkpoints = useMemo(() => generateCheckpoints(toggles), [toggles])
  const pitfalls = useMemo(() => generatePitfalls(toggles), [toggles])

  const totalBatter = ingredients.reduce((s, i) => s + i.grams, 0)
  const activeCount = toggles.filter((t) => t.enabled).length
  const totalTime = steps.reduce((s, step) => {
    const m = step.time.match(/(\d+)-?(\d+)?/)
    if (m) return s + (parseInt(m[2] || m[1]))
    return s
  }, 0)

  const validityConfig = {
    valid: {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      label: 'Valid',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    'valid-with-caveats': {
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      label: 'Valid with caveats',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800',
    },
    invalid: {
      icon: <XCircle className="h-4 w-4 text-rose-500" />,
      label: 'Invalid',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      border: 'border-rose-200 dark:border-rose-800',
    },
  }[validation.validity]

  const handlePrint = () => {
    document.body.classList.add('print-generated-card')
    window.print()
    setTimeout(() => document.body.classList.remove('print-generated-card'), 1000)
  }

  const tierColorMap: Record<string, string> = {
    core: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    diagnostic: 'bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800',
    substitution: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
    speculative: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scroll-warm p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Generated Recipe Card</DialogTitle>
        </DialogHeader>

        <Card className="bg-gradient-to-br from-primary/5 to-card border-primary/30 overflow-hidden border-0 rounded-none">
          <CardContent className="space-y-4 p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 flex-wrap pb-3 border-b border-primary/20">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    Generated Recipe Card
                  </div>
                  <h2 className="text-base font-bold leading-tight">{validation.configurationName}</h2>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {activeCount} modification{activeCount !== 1 ? 's' : ''} active · {tierLabel}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={cn('text-[10px] font-mono', tierColorMap[tier] || tierColorMap.core)}>
                  {tierLabel}
                </Badge>
                <Badge variant="outline" className={cn('text-[10px] font-mono', validityConfig.bg, validityConfig.color, validityConfig.border)}>
                  {validityConfig.icon}
                  {validityConfig.label}
                </Badge>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-primary text-primary-foreground text-[11px] font-medium hover:opacity-90 transition-opacity no-print"
                >
                  <Printer className="h-3 w-3" />
                  Print
                </button>
              </div>
            </div>

            {/* Validation assessment */}
            <div className={cn('rounded-lg border p-3', validityConfig.bg, validityConfig.border)}>
              <div className="flex items-center gap-1.5 mb-1">
                {validityConfig.icon}
                <span className={cn('text-[10px] font-semibold uppercase tracking-wider', validityConfig.color)}>
                  Food-science validation
                </span>
              </div>
              <p className="text-[11px] text-foreground/80 leading-relaxed">{validation.foodScienceAssessment}</p>
              {validation.issueIdentified !== 'none' && (
                <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
                  <strong>Issue:</strong> {validation.issueIdentified}
                </p>
              )}
            </div>

            {/* Ingredients table */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2">
                Ingredients (weigh everything · metric)
              </div>
              <div className="rounded-lg border border-primary/20 overflow-hidden bg-card/60">
                <table className="w-full text-xs">
                  <thead className="bg-primary/5 border-b border-primary/20">
                    <tr className="text-left text-[10px] text-muted-foreground uppercase tracking-wider">
                      <th className="py-2 px-3 font-semibold">Ingredient</th>
                      <th className="py-2 px-2 font-semibold text-right">Grams</th>
                      <th className="py-2 px-3 font-semibold">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ing, idx) => (
                      <tr key={idx} className="border-t border-border/40">
                        <td className="py-2 px-3 font-medium">{ing.name}</td>
                        <td className="py-2 px-2 text-right">
                          <span className="font-mono font-bold text-primary tabular-nums">{ing.grams % 1 === 0 ? ing.grams : ing.grams.toFixed(1)}</span>
                          <span className="text-[10px] text-muted-foreground ml-0.5">g</span>
                        </td>
                        <td className="py-2 px-3 text-[10px] text-muted-foreground">{ing.note}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-primary/20 bg-primary/5">
                      <td className="py-2 px-3 font-semibold text-[11px]">Total batter</td>
                      <td className="py-2 px-2 text-right font-mono font-bold tabular-nums">{totalBatter.toFixed(1)} g</td>
                      <td className="py-2 px-3 text-[10px] text-muted-foreground">≈ 6 cakes</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Method timeline */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Method ({steps.length} steps, ~{totalTime} min total)
              </div>
              <ol className="space-y-1.5 relative">
                <span className="absolute left-[11px] top-2 bottom-2 w-px bg-primary/20" aria-hidden />
                {steps.map((s, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs relative">
                    <span className="flex-shrink-0 w-[22px] h-[22px] rounded-full bg-primary text-primary-foreground font-mono text-[10px] font-bold flex items-center justify-center z-10 ring-2 ring-background shadow-sm">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-semibold text-[12px]">{s.step}</span>
                        <span className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">{s.time}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{s.detail}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Checkpoints */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                Observable checkpoints
              </div>
              <div className="grid grid-cols-2 gap-2">
                {checkpoints.map((c, idx) => (
                  <div key={idx} className="rounded-md border border-border bg-card/40 p-2">
                    <div className="text-[10px] font-semibold text-foreground">{c.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{c.check}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pitfalls */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                <AlertCircle className="h-3 w-3" />
                Common pitfalls ({pitfalls.length})
              </div>
              <ul className="space-y-1">
                {pitfalls.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                    <span className="text-rose-500 flex-shrink-0 mt-0.5">▸</span>
                    <span className="leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-primary/20 flex items-center justify-between text-[10px] text-muted-foreground flex-wrap gap-2">
              <span className="font-mono">
                <Thermometer className="inline h-3 w-3 mr-1" />
                180°C · {tier === 'core' ? 'foam-only' : tier} · {validation.validity}
              </span>
              <span className="font-mono">Chongoyape Lab · Generated v1</span>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
