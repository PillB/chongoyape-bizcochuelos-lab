'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ArrowLeftRight,
  MousePointerClick,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  CircleDot,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConfidenceBadge } from './badges'
import type { Substitution } from './types'

interface ExtendedEffect {
  property: string
  direction: 'up' | 'down' | 'neutral'
  detail: string
}

// Cascading effects for each substitution (food-science predicted)
const cascadingEffects: Record<string, ExtendedEffect[]> = {
  'All-purpose wheat flour': [
    { property: 'Gluten development', direction: 'down', detail: 'Lower protein = less gluten = more tender crumb' },
    { property: 'Structure strength', direction: 'down', detail: 'Weaker scaffold — fold more gently' },
    { property: 'Crumb fineness', direction: 'up', detail: 'Finer, more uniform cells' },
    { property: 'Availability', direction: 'down', detail: 'Harina 0000 is specialist in Lima' },
  ],
  'All-purpose wheat flour (10% of weight)': [
    { property: 'Gluten dilution', direction: 'up', detail: 'Starch displaces 10% of gluten-forming protein' },
    { property: 'Crumb tenderness', direction: 'up', detail: 'Softer, shorter bite' },
    { property: 'Staling rate', direction: 'down', detail: 'Starch retrogrades slower than gluten' },
    { property: 'Earthy note', direction: 'up', detail: 'Chuño adds a faintly earthy flavor' },
  ],
  'Potato starch (chuño)': [
    { property: 'Gelatinization temp', direction: 'up', detail: 'Higher than cornstarch — sets later' },
    { property: 'Crumb bite', direction: 'up', detail: 'Marginally firmer, more resilient' },
    { property: 'Flavor neutrality', direction: 'down', detail: 'Slightly earthier than cornstarch' },
    { property: 'Lima availability', direction: 'down', detail: 'Specialist — fécula de papa' },
  ],
  'Whole eggs': [
    { property: 'Total volume', direction: 'up', detail: 'Whipped whites add ~15% extra aeration' },
    { property: 'Crumb uniformity', direction: 'down', detail: 'Risk of coarser cells if overfolded' },
    { property: 'Workflow complexity', direction: 'up', detail: '+3 steps: separate, whip whites, 3-stage fold' },
    { property: 'Collapse risk', direction: 'up', detail: 'Higher — whites deflate if mishandled' },
  ],
  'Vanilla extract': [
    { property: 'Aroma type', direction: 'neutral', detail: 'Terpenes (citrus) replace vanillin (sweet)' },
    { property: 'Oil solubility', direction: 'up', detail: 'Zest oils need sugar-rubbing to release' },
    { property: 'Regional fit', direction: 'up', detail: 'Lime/orange zest is more Lambayeque-traditional' },
    { property: 'Intensity', direction: 'down', detail: 'Zest is subtler than extract' },
  ],
  'Baking stone': [
    { property: 'Thermal mass', direction: 'down', detail: 'Sheet pan has less thermal reserve than stone' },
    { property: 'Bottom heat', direction: 'down', detail: 'Slightly less intense base browning' },
    { property: 'Setup time', direction: 'down', detail: 'Faster to preheat (10 vs 45 min)' },
    { property: 'Equipment cost', direction: 'down', detail: 'No specialist purchase needed' },
  ],
  'Wood-fired clay oven': [
    { property: 'Thermal profile', direction: 'neutral', detail: 'Stone + radiant heat approximates deck' },
    { property: 'Smoke aroma', direction: 'down', detail: 'Lost — combustion compounds not replicated' },
    { property: 'Humidity', direction: 'down', detail: 'Home oven is drier — consider steam pan' },
    { property: 'Repeatability', direction: 'up', detail: 'Much more consistent than wood fire' },
  ],
  'Algarrobina syrup': [
    { property: 'Flavor profile', direction: 'neutral', detail: 'Caramel/molasses vs carob/earth' },
    { property: 'Color depth', direction: 'down', detail: 'Chancaca is marginally lighter' },
    { property: 'Regional availability', direction: 'up', detail: 'Chancaca is more common in Lima markets' },
    { property: 'Mineral content', direction: 'up', detail: 'Higher in calcium/iron than algarrobina' },
  ],
}

export function SubstitutionExplorer({ substitutions }: { substitutions: Substitution[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(substitutions[0]?.id ?? null)
  const selected = substitutions.find((s) => s.id === selectedId) ?? substitutions[0]

  const effects = selected ? (cascadingEffects[selected.original] ?? []) : []

  return (
    <Card className="bg-card/60 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
            <ArrowLeftRight className="h-4 w-4 text-primary" />
          </div>
          Interactive Substitution Explorer
        </CardTitle>
        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
          <MousePointerClick className="h-3 w-3" />
          Click any substitution on the left to see its cascading effects on the formula.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
          {/* Substitution list */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Substitutions ({substitutions.length})
            </div>
            <ScrollArea className="max-h-[400px] scroll-warm pr-2">
              <div className="space-y-1.5">
                {substitutions.map((s) => {
                  const isSelected = s.id === selectedId
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className={cn(
                        'w-full text-left rounded-md border p-2.5 transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border bg-card/40 hover:bg-accent/30 hover:border-border',
                      )}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <CircleDot className={cn('h-3 w-3 flex-shrink-0', isSelected ? 'text-primary' : 'text-muted-foreground/50')} />
                        <span className="text-xs font-medium leading-snug flex-1 truncate">{s.original}</span>
                      </div>
                      <div className="flex items-center gap-1 pl-5">
                        <ArrowRight className="h-2.5 w-2.5 text-primary/60" />
                        <span className="text-[10px] text-primary font-medium truncate">{s.substitute}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* Substitution header */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Original</div>
                      <div className="text-sm font-medium leading-snug">{selected.original}</div>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-0.5">Substitute</div>
                      <div className="text-sm font-medium leading-snug text-primary">{selected.substitute}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <ConfidenceBadge value={selected.confidence} />
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {selected.quantityAdjustment}
                    </Badge>
                  </div>
                </div>

                {/* Properties */}
                <div className="grid sm:grid-cols-2 gap-2">
                  <div className="rounded-md border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/15 dark:border-emerald-900 p-2.5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                      Property replaced
                    </div>
                    <div className="text-xs text-foreground/80">{selected.propertyReplaced}</div>
                  </div>
                  <div className="rounded-md border border-rose-200 bg-rose-50/50 dark:bg-rose-950/15 dark:border-rose-900 p-2.5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-1">
                      Property lost
                    </div>
                    <div className="text-xs text-foreground/80">{selected.propertyLost}</div>
                  </div>
                </div>

                {/* Technique adjustment */}
                <div className="rounded-md border border-border bg-muted/20 p-2.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Technique adjustment
                  </div>
                  <div className="text-xs text-foreground/80">{selected.techniqueAdjustment}</div>
                </div>

                {/* Cascading effects */}
                {effects.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3" />
                      Cascading effects (predicted)
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {effects.map((e, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: idx * 0.04 }}
                          className={cn(
                            'flex items-start gap-2 rounded-md border p-2 text-xs',
                            e.direction === 'up'
                              ? 'border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/10 dark:border-emerald-900'
                              : e.direction === 'down'
                                ? 'border-rose-200 bg-rose-50/40 dark:bg-rose-950/10 dark:border-rose-900'
                                : 'border-border bg-muted/20',
                          )}
                        >
                          <span className="mt-0.5 flex-shrink-0">
                            {e.direction === 'up' ? (
                              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                            ) : e.direction === 'down' ? (
                              <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                            ) : (
                              <CircleDot className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[12px]">{e.property}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{e.detail}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
