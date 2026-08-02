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
  magnitude: string
  detail: string
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
      list.push({ metric: 'Crumb tenderness', direction: 'up', magnitude: '+15%', detail: 'Starch dilutes gluten, finer crumb' })
      list.push({ metric: 'Shelf life', direction: 'up', magnitude: '+1 day', detail: 'Starch retrogrades slower than gluten' })
      list.push({ metric: 'Crumb strength', direction: 'down', magnitude: '-10%', detail: 'Slightly more fragile — fold gently' })
    }
    if (isOn('leavener')) {
      list.push({ metric: 'Oven spring', direction: 'up', magnitude: '+8%', detail: 'Extra CO₂ lift beyond foam' })
      list.push({ metric: 'Crumb cell size', direction: 'up', magnitude: '+20%', detail: 'Coarser, more open cells' })
      list.push({ metric: 'Flavor purity', direction: 'down', magnitude: 'risk', detail: 'Possible chemical aftertaste' })
    }
    if (isOn('oil')) {
      list.push({ metric: 'Day-2 moisture', direction: 'up', magnitude: '+25%', detail: 'Fat retains moisture, delays staling' })
      list.push({ metric: 'Foam volume', direction: 'down', magnitude: '-12%', detail: 'Fat deflates egg foam during folding' })
      list.push({ metric: 'Mouthfeel', direction: 'up', magnitude: 'softer', detail: 'Richer, more tender bite' })
    }
    if (isOn('vanilla')) {
      list.push({ metric: 'Aroma complexity', direction: 'up', magnitude: '+1 note', detail: 'Vanillin adds sweet top note' })
      list.push({ metric: 'Egg aroma purity', direction: 'down', magnitude: 'masked', detail: 'Distracts from clean egg flavor' })
    }
    if (isOn('separated')) {
      list.push({ metric: 'Total volume', direction: 'up', magnitude: '+15%', detail: 'Whipped whites add extra aeration' })
      list.push({ metric: 'Crumb uniformity', direction: 'down', magnitude: '-10%', detail: 'Risk of larger cells if overfolded' })
      list.push({ metric: 'Workflow steps', direction: 'up', magnitude: '+3 steps', detail: 'Extra bowl, whipping, 3-stage fold' })
    }
    if (isOn('smoke')) {
      list.push({ metric: 'Crust aroma', direction: 'up', magnitude: '+1 note', detail: 'Faint smoke on crust (if perceptible)' })
      list.push({ metric: 'Color depth', direction: 'up', magnitude: '+5%', detail: 'Slightly darker surface' })
      list.push({ metric: 'Predictability', direction: 'down', magnitude: 'low', detail: 'Unverified — needs triangle test' })
    }
    if (isOn('algarrobina')) {
      list.push({ metric: 'Crust color', direction: 'up', magnitude: '+20% darker', detail: 'Molasses + Maillard deepens amber' })
      list.push({ metric: 'Flavor identity', direction: 'down', magnitude: 'changed', detail: 'Carob note contradicts "pure egg" claim' })
      list.push({ metric: 'Sweetness', direction: 'neutral', magnitude: 'balanced', detail: 'Sugar reduced 8g to compensate' })
    }
    if (isOn('stone')) {
      list.push({ metric: 'Base color', direction: 'up', magnitude: '+15%', detail: 'Stronger bottom radiant heat' })
      list.push({ metric: 'Rise speed', direction: 'up', magnitude: '+10%', detail: 'Faster initial set, taller dome' })
      list.push({ metric: 'Burn risk', direction: 'up', magnitude: 'medium', detail: 'Monitor base — reduce temp 10°C if needed' })
    }

    return list
  }, [toggles])

  // Overall assessment
  const assessment = useMemo(() => {
    const isOn = (id: string) => toggles.find((t) => t.id === id)?.enabled ?? false
    const risks: Risk[] = []
    let fidelityScore = 100

    if (isOn('leavener')) {
      risks.push({ level: 'high', text: 'Chemical leavener taste risk — contradicts foam-only principle' })
      fidelityScore -= 20
    }
    if (isOn('oil')) {
      risks.push({ level: 'medium', text: 'Fat deflates foam; chiffon-style departs from traditional bizcochuelo' })
      fidelityScore -= 10
    }
    if (isOn('algarrobina')) {
      risks.push({ level: 'high', text: 'Algarrobina changes flavor identity — contradicts "pure egg" claim' })
      fidelityScore -= 25
    }
    if (isOn('smoke')) {
      risks.push({ level: 'medium', text: 'Smoke perceptibility unverified — may add nothing or overpower' })
      fidelityScore -= 10
    }
    if (isOn('vanilla')) {
      risks.push({ level: 'low', text: 'Vanilla not advertised on label — adds unverified aroma' })
      fidelityScore -= 5
    }
    if (isOn('chuño')) {
      risks.push({ level: 'low', text: 'Chuño plausible but unverified — test against cornstarch control' })
      fidelityScore -= 3
    }
    if (isOn('separated')) {
      risks.push({ level: 'low', text: 'Adds steps; whole-egg is the simpler canonical method' })
      fidelityScore -= 5
    }
    if (isOn('stone')) {
      risks.push({ level: 'low', text: 'Thermal-only simulation — safe, no flavor impact' })
      // No fidelity penalty — stone is purely thermal
    }

    const tier = fidelityScore >= 90 ? 'core' : fidelityScore >= 70 ? 'diagnostic' : fidelityScore >= 50 ? 'substitution' : 'speculative'
    return { risks, fidelityScore, tier }
  }, [toggles])

  const tierConfig = {
    core: { label: 'Core fidelity', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800' },
    diagnostic: { label: 'Diagnostic tier', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-violet-200 dark:border-violet-800' },
    substitution: { label: 'Substitution tier', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/30', border: 'border-teal-200 dark:border-teal-800' },
    speculative: { label: 'Speculative tier', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-200 dark:border-rose-800' },
  }[assessment.tier]

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
                    Predicted effects ({effects.length})
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
                            <span className="font-mono text-[10px] font-semibold tabular-nums">{e.magnitude}</span>
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
                      Fidelity assessment
                    </span>
                  </div>
                  <span className={cn('font-mono text-lg font-bold tabular-nums', tierConfig.color)}>
                    {assessment.fidelityScore}
                    <span className="text-[10px] text-muted-foreground">/100</span>
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
