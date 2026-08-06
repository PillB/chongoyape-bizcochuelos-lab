'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Wand2,
  Egg,
  Wheat,
  Beaker,
  Droplet,
  FlaskRound,
  Flame,
  Cloud,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Toggle {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  enabled: boolean
}

interface Effect {
  metric: string
  direction: 'up' | 'down' | 'neutral'
  magnitude: string // qualitative only — NOT a measured percentage
  detail: string
  uncertainty: 'low' | 'medium' | 'high'
}

interface Risk {
  level: 'low' | 'medium' | 'high'
  text: string
}

// Base core recipe values
const BASE = {
  eggs: 240,
  sugar: 150,
  flour: 150,
  salt: 1.5,
  total: 541.5,
}

const defaultToggles: Toggle[] = [
  {
    id: 'chuño',
    label: 'Add chuño (potato starch)',
    description: 'Replace 10% of flour weight with potato starch',
    icon: <Beaker className="h-4 w-4" />,
    enabled: false,
  },
  {
    id: 'leavener',
    label: 'Add baking powder (3 g)',
    description: 'Low-dose chemical leavener supplement',
    icon: <FlaskRound className="h-4 w-4" />,
    enabled: false,
  },
  {
    id: 'oil',
    label: 'Add trace oil (15 g)',
    description: 'Neutral vegetable oil for moisture',
    icon: <Droplet className="h-4 w-4" />,
    enabled: false,
  },
  {
    id: 'vanilla',
    label: 'Add vanilla (3 g)',
    description: 'Liquid vanilla extract for aroma',
    icon: <FlaskRound className="h-4 w-4" />,
    enabled: false,
  },
  {
    id: 'separated',
    label: 'Use separated-egg method',
    description: 'Whip yolks and whites separately, then fold',
    icon: <Egg className="h-4 w-4" />,
    enabled: false,
  },
  {
    id: 'smoke',
    label: 'Smoke exposure (60-90s)',
    description: 'Surface smoke treatment after baking',
    icon: <Cloud className="h-4 w-4" />,
    enabled: false,
  },
  {
    id: 'algarrobina',
    label: 'Add algarrobina (8 g)',
    description: 'Carob syrup — color and flavor',
    icon: <Flame className="h-4 w-4" />,
    enabled: false,
  },
  {
    id: 'stone',
    label: 'Bake on preheated stone',
    description: 'Simulate wood-oven deck heat',
    icon: <Wheat className="h-4 w-4" />,
    enabled: false,
  },
]

export function RecipeSandbox() {
  const [toggles, setToggles] = useState<Toggle[]>(defaultToggles)

  const toggle = (id: string) => {
    setToggles((prev) => prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)))
  }

  const reset = () => setToggles(defaultToggles)

  const enabledCount = toggles.filter((t) => t.enabled).length

  // Calculate modified formula
  const formula = useMemo(() => {
    const f = {
      eggs: BASE.eggs,
      sugar: BASE.sugar,
      flour: BASE.flour,
      salt: BASE.salt,
      starch: 0,
      leavener: 0,
      oil: 0,
      vanilla: 0,
      algarrobina: 0,
    }

    const isOn = (id: string) => toggles.find((t) => t.id === id)?.enabled ?? false

    if (isOn('chuño')) {
      const starchAmt = BASE.flour * 0.1 // 10% of flour
      f.flour = BASE.flour - starchAmt
      f.starch = starchAmt
    }
    if (isOn('leavener')) f.leavener = 3
    if (isOn('oil')) f.oil = 15
    if (isOn('vanilla')) f.vanilla = 3
    if (isOn('algarrobina')) {
      f.algarrobina = 8
      f.sugar = BASE.sugar - 8 // reduce sugar to compensate
    }

    return f
  }, [toggles])

  const total = Object.values(formula).reduce((s, v) => s + v, 0)

  // Predicted effects
  const effects: Effect[] = useMemo(() => {
    const isOn = (id: string) => toggles.find((t) => t.id === id)?.enabled ?? false
    const list: Effect[] = []

    if (isOn('chuño')) {
      list.push({ metric: 'Crumb tenderness', direction: 'up', magnitude: 'increases', detail: 'Starch dilutes gluten-forming proteins', uncertainty: 'low' })
      list.push({ metric: 'Staling rate', direction: 'down', magnitude: 'slows', detail: 'Potato starch retrogrades more slowly than wheat starch', uncertainty: 'medium' })
      list.push({ metric: 'Crumb strength', direction: 'down', magnitude: 'decreases', detail: 'Reduced gluten network is more fragile', uncertainty: 'medium' })
    }
    if (isOn('leavener')) {
      list.push({ metric: 'Oven spring', direction: 'up', magnitude: 'increases', detail: 'Supplemental CO₂ lift beyond foam aeration', uncertainty: 'low' })
      list.push({ metric: 'Crumb cell size', direction: 'up', magnitude: 'coarsens', detail: 'Additional gas bubbles create larger cells', uncertainty: 'medium' })
      list.push({ metric: 'Flavor purity', direction: 'down', magnitude: 'risk of off-flavor', detail: 'Possible chemical aftertaste if dose is high', uncertainty: 'high' })
    }
    if (isOn('oil')) {
      list.push({ metric: 'Day-2 moisture', direction: 'up', magnitude: 'improves', detail: 'Fat coats starch, slows water migration', uncertainty: 'low' })
      list.push({ metric: 'Foam volume', direction: 'down', magnitude: 'decreases', detail: 'Fat interferes with egg foam protein network', uncertainty: 'low' })
      list.push({ metric: 'Mouthfeel', direction: 'up', magnitude: 'softer', detail: 'Fat improves lubricity and tenderness', uncertainty: 'medium' })
    }
    if (isOn('vanilla')) {
      list.push({ metric: 'Aroma complexity', direction: 'up', magnitude: 'adds note', detail: 'Vanillin adds sweet top note — NOT evidenced for Valera', uncertainty: 'high' })
      list.push({ metric: 'Egg aroma purity', direction: 'down', magnitude: 'masks', detail: 'Distracts from clean egg flavor', uncertainty: 'medium' })
    }
    if (isOn('separated')) {
      list.push({ metric: 'Total volume', direction: 'up', magnitude: 'increases', detail: 'Whites-only foam achieves higher overrun', uncertainty: 'low' })
      list.push({ metric: 'Crumb uniformity', direction: 'down', magnitude: 'risk of unevenness', detail: 'Multiple folding stages risk uneven distribution', uncertainty: 'medium' })
      list.push({ metric: 'Workflow steps', direction: 'up', magnitude: 'more complex', detail: 'Extra bowl, separate whipping, 3-stage fold', uncertainty: 'low' })
    }
    if (isOn('smoke')) {
      list.push({ metric: 'Crust aroma', direction: 'up', magnitude: 'may add note', detail: 'Algarrobo phenols may adsorb to crust — perceptibility unverified', uncertainty: 'high' })
      list.push({ metric: 'Color depth', direction: 'up', magnitude: 'may darken', detail: 'Surface darkening from combustion products', uncertainty: 'high' })
      list.push({ metric: 'Predictability', direction: 'down', magnitude: 'unverified', detail: 'Needs controlled triangle test after unsmoked control', uncertainty: 'high' })
    }
    if (isOn('algarrobina')) {
      list.push({ metric: 'Crust color', direction: 'up', magnitude: 'deepens', detail: 'Molasses + Maillard — sugar reduction does NOT fully account for water/soluble solids', uncertainty: 'high' })
      list.push({ metric: 'Flavor identity', direction: 'down', magnitude: 'changes', detail: 'Carob note contradicts thesis ingredient list (no algarrobina listed)', uncertainty: 'high' })
      list.push({ metric: 'Sweetness', direction: 'neutral', magnitude: 'unpredictable', detail: 'Sugar reduction does not account for algarrobina water content and soluble solids', uncertainty: 'high' })
    }
    if (isOn('stone')) {
      list.push({ metric: 'Base color', direction: 'up', magnitude: 'darkens', detail: 'Stronger conductive heat from stone', uncertainty: 'low' })
      list.push({ metric: 'Rise speed', direction: 'up', magnitude: 'faster', detail: 'Faster initial heat set promotes earlier structure', uncertainty: 'medium' })
      list.push({ metric: 'Burn risk', direction: 'up', magnitude: 'increases', detail: 'Excessive bottom heat can scorch before crumb sets', uncertainty: 'medium' })
    }

    return list
  }, [toggles])

  // Overall assessment
  const assessment = useMemo(() => {
    const isOn = (id: string) => toggles.find((t) => t.id === id)?.enabled ?? false
    const risks: Risk[] = []
    // NOTE: No arbitrary numerical fidelity score.
    // Instead, we classify the current configuration qualitatively.
    let hasHighRisk = false
    let hasMediumRisk = false

    if (isOn('leavener')) {
      risks.push({ level: 'high', text: 'Chemical leavener taste risk — contradicts foam-only principle. Thesis confirms Valera uses baking powder, but dose and effect are unverified.' })
      hasHighRisk = true
    }
    if (isOn('oil')) {
      risks.push({ level: 'medium', text: 'Fat deflates foam; chiffon-style departs from traditional bizcochuelo. Thesis does not list oil (lists milk instead).' })
      hasMediumRisk = true
    }
    if (isOn('algarrobina')) {
      risks.push({ level: 'high', text: 'Algarrobina changes flavor identity — thesis ingredient list does NOT include algarrobina. Sugar reduction does not account for water/soluble solids.' })
      hasHighRisk = true
    }
    if (isOn('smoke')) {
      risks.push({ level: 'medium', text: 'Smoke perceptibility unverified — needs controlled triangle test after unsmoked control succeeds.' })
      hasMediumRisk = true
    }
    if (isOn('vanilla')) {
      risks.push({ level: 'low', text: 'Vanilla NOT in thesis ingredient list — contradicted by primary source. Kept as diagnostic only.' })
    }
    if (isOn('chuño')) {
      risks.push({ level: 'low', text: 'Chuño confirmed by thesis — plausible. Test against cornstarch control.' })
    }
    if (isOn('separated')) {
      risks.push({ level: 'low', text: 'Adds steps; whole-egg is the simpler canonical method. Thesis does not specify method.' })
    }
    if (isOn('stone')) {
      risks.push({ level: 'low', text: 'Thermal-only simulation — safe, no flavor impact. Validated approach for deck-heat approximation.' })
    }

    const tier = hasHighRisk ? 'speculative' : hasMediumRisk ? 'diagnostic' : 'core'
    return { risks, tier }
  }, [toggles])

  const tierConfig = {
    core: { label: 'Core fidelity', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800' },
    diagnostic: { label: 'Diagnostic tier', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-violet-200 dark:border-violet-800' },
    substitution: { label: 'Substitution tier', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/30', border: 'border-teal-200 dark:border-teal-800' },
    speculative: { label: 'Speculative tier', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-200 dark:border-rose-800' },
  }[assessment.tier as 'core' | 'diagnostic' | 'substitution' | 'speculative'] ?? {
    label: 'Unknown', color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border',
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-card border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Wand2 className="h-4 w-4 text-primary" />
            </div>
            What-If Recipe Sandbox
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn('text-[10px] font-mono', tierConfig.bg, tierConfig.color, tierConfig.border)}>
              {tierConfig.label}
            </Badge>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-accent"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          Toggle modifications to see predicted effects on the core formula. This is a reasoning tool, not a kitchen test — all effects are predicted from food science, not measured.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid lg:grid-cols-[280px_1fr] gap-4">
          {/* Toggle panel */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Modifications ({enabledCount} active)
            </div>
            <ScrollArea className="max-h-[380px] scroll-warm pr-2">
              <div className="space-y-2">
                {toggles.map((t) => (
                  <div
                    key={t.id}
                    className={cn(
                      'flex items-start gap-2.5 p-2.5 rounded-md border transition-all',
                      t.enabled
                        ? 'border-primary/30 bg-primary/5 shadow-sm'
                        : 'border-border bg-card/40 hover:bg-accent/30',
                    )}
                  >
                    <Switch
                      checked={t.enabled}
                      onCheckedChange={() => toggle(t.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={cn(t.enabled ? 'text-primary' : 'text-muted-foreground')}>
                          {t.icon}
                        </span>
                        <span className="text-xs font-medium leading-snug">{t.label}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                        {t.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Results panel */}
          <div className="space-y-4">
            {/* Modified formula */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Modified formula
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/60 border-b border-border">
                    <tr className="text-left text-[10px] text-muted-foreground uppercase tracking-wider">
                      <th className="py-2 px-3 font-semibold">Component</th>
                      <th className="py-2 px-2 font-semibold text-right">Grams</th>
                      <th className="py-2 px-3 font-semibold w-24">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(formula).filter(([, v]) => v > 0).map(([key, val]) => {
                      const baseVal = (BASE as Record<string, number>)[key] ?? 0
                      const delta = val - baseVal
                      const labels: Record<string, string> = {
                        eggs: 'Whole eggs', sugar: 'Sugar', flour: 'Flour', salt: 'Salt',
                        starch: 'Starch (chuño)', leavener: 'Baking powder', oil: 'Oil',
                        vanilla: 'Vanilla', algarrobina: 'Algarrobina',
                      }
                      return (
                        <tr key={key} className="border-t border-border/40">
                          <td className="py-1.5 px-3 font-medium">{labels[key] ?? key}</td>
                          <td className="py-1.5 px-2 text-right font-mono tabular-nums">{val.toFixed(1)}g</td>
                          <td className="py-1.5 px-3">
                            {delta === 0 ? (
                              <span className="text-[10px] text-muted-foreground">—</span>
                            ) : delta > 0 ? (
                              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">+{delta.toFixed(1)}g</span>
                            ) : (
                              <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400">{delta.toFixed(1)}g</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                    <tr className="border-t-2 border-border bg-muted/30">
                      <td className="py-1.5 px-3 font-semibold text-[11px]">Total batter</td>
                      <td className="py-1.5 px-2 text-right font-mono font-bold tabular-nums">{total.toFixed(1)}g</td>
                      <td className="py-1.5 px-3">
                        <span className={cn(
                          'text-[10px] font-mono',
                          total === BASE.total ? 'text-muted-foreground' : total > BASE.total ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
                        )}>
                          {total === BASE.total ? '—' : `${total > BASE.total ? '+' : ''}${(total - BASE.total).toFixed(1)}g`}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Predicted effects */}
            <AnimatePresence mode="wait">
              {effects.length > 0 ? (
                <motion.div
                  key="effects"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Qualitative directions ({effects.length})
                  </div>
                  <div className="text-[10px] text-muted-foreground mb-2 leading-relaxed">
                    NOTE: These are qualitative expectations from food science — NOT quantitative predictions.
                    For full mechanism details, evidence, and validating experiments, see the
                    <strong className="text-foreground"> Mechanism Explorer</strong> in the Real Batch Log section below.
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {effects.map((e, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: idx * 0.03 }}
                        className={cn(
                          'flex items-start gap-2 rounded-md border p-2 text-xs',
                          e.direction === 'up'
                            ? 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/15 dark:border-emerald-900'
                            : e.direction === 'down'
                              ? 'border-rose-200 bg-rose-50/50 dark:bg-rose-950/15 dark:border-rose-900'
                              : 'border-border bg-muted/30',
                        )}
                      >
                        <span className="mt-0.5 flex-shrink-0">
                          {e.direction === 'up' ? (
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                          ) : e.direction === 'down' ? (
                            <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                          ) : (
                            <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-medium">{e.metric}</span>
                            <Badge variant="outline" className={cn(
                              'text-[8px] h-3.5 px-1 font-mono',
                              e.uncertainty === 'low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400' :
                              e.uncertainty === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400' :
                              'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400'
                            )}>
                              {e.uncertainty}
                            </Badge>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{e.detail}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center"
                >
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Core formula active.</strong> Toggle modifications on the left to see predicted effects.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Risk assessment */}
            {assessment.risks.length > 0 && (
              <div className={cn('rounded-lg border p-3', tierConfig.border, tierConfig.bg)}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className={cn('h-3.5 w-3.5', tierConfig.color)} />
                    <span className={cn('text-[10px] font-semibold uppercase tracking-wider', tierConfig.color)}>
                      Configuration assessment
                    </span>
                  </div>
                  <span className={cn('text-xs font-semibold', tierConfig.color)}>
                    {tierConfig.label}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {assessment.risks.map((r, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                      <span className={cn(
                        'mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0',
                        r.level === 'high' ? 'bg-rose-500' : r.level === 'medium' ? 'bg-amber-500' : 'bg-yellow-500',
                      )} />
                      <span className="text-foreground/80 leading-relaxed">{r.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
