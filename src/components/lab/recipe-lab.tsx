'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from './section-header'
import { levelLabels } from './badges'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  FlaskConical,
  Beaker,
  TestTube,
  Sparkles,
  Target,
  XCircle,
  CheckCircle2,
  Scale,
  ListOrdered,
  Package,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RecipeVariant } from './types'

const levelConfig: Record<number, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  1: {
    icon: <FlaskConical className="h-4 w-4" />,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/30',
  },
  2: {
    icon: <Package className="h-4 w-4" />,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    border: 'border-teal-200 dark:border-teal-800',
  },
  3: {
    icon: <TestTube className="h-4 w-4" />,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-800',
  },
  4: {
    icon: <Sparkles className="h-4 w-4" />,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800',
  },
}

export function RecipeLab({ recipes }: { recipes: RecipeVariant[] }) {
  const sorted = [...recipes].sort((a, b) => a.level - b.level)
  const [selectedId, setSelectedId] = useState(sorted[0]?.id ?? '')
  const selected = sorted.find((r) => r.id === selectedId) ?? sorted[0]

  // Listen for recipe selection events from the Command Palette
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      if (sorted.some((r) => r.id === id)) {
        setSelectedId(id)
      }
    }
    window.addEventListener('select-recipe', handler as EventListener)
    return () => window.removeEventListener('select-recipe', handler as EventListener)
  }, [sorted])

  const grouped: Record<number, RecipeVariant[]> = { 1: [], 2: [], 3: [], 4: [] }
  sorted.forEach((r) => {
    grouped[r.level].push(r)
  })

  const totalGrams = selected.ingredients.reduce((s, i) => s + i.grams, 0)
  const cfg = levelConfig[selected.level]

  return (
    <section id="recipe-lab" className="scroll-mt-20 py-16 sm:py-20 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="07"
          phase="Phase 1 · Recipe Reconstruction"
          title="Recipe Lab — Four-Level Hierarchy"
          subtitle="The core formula is a minimal egg–sugar–flour–salt foam. Every other ingredient is held in a separate diagnostic or speculative branch until a controlled test justifies its promotion. Uncertain authenticity cues never blend silently into the core."
          icon={<FlaskConical className="h-5 w-5 text-primary" />}
        />

        {/* Level tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {[1, 2, 3, 4].map((lvl) => {
            const lcfg = levelConfig[lvl]
            const isActive = selected.level === lvl
            return (
              <button
                key={lvl}
                onClick={() => {
                  const first = grouped[lvl][0]
                  if (first) setSelectedId(first.id)
                }}
                className={cn(
                  'rounded-lg border p-3 text-left transition-all',
                  isActive
                    ? cn(lcfg.bg, lcfg.border, 'shadow-sm')
                    : 'border-border bg-card/40 hover:bg-accent/40',
                )}
              >
                <div className={cn('flex items-center gap-1.5 mb-1', lcfg.color)}>
                  {lcfg.icon}
                  <span className="text-[10px] font-mono uppercase tracking-wider">L{lvl}</span>
                </div>
                <div className="text-xs font-semibold leading-tight">{levelLabels[lvl].label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{grouped[lvl].length} variant{grouped[lvl].length !== 1 ? 's' : ''}</div>
              </button>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-4 overflow-hidden">
          {/* Variant list */}
          <Card className="bg-card/60 h-fit lg:sticky lg:top-20 overflow-hidden">
            <CardContent className="p-3">
              <ScrollArea className="max-h-[560px] scroll-warm">
                <div className="space-y-4 pr-2 min-w-0">
                  {[1, 2, 3, 4].map((lvl) => (
                    grouped[lvl].length > 0 && (
                      <div key={lvl}>
                        <div className={cn('flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider mb-1.5 px-1', levelConfig[lvl].color)}>
                          {levelConfig[lvl].icon}
                          L{lvl} · {levelLabels[lvl].short}
                        </div>
                        <div className="space-y-1">
                          {grouped[lvl].map((r) => (
                            <button
                              key={r.id}
                              onClick={() => setSelectedId(r.id)}
                              className={cn(
                                'w-full text-left rounded-md p-2.5 text-xs transition-all border relative overflow-hidden min-w-0',
                                selectedId === r.id
                                  ? cn(levelConfig[lvl].bg, levelConfig[lvl].border, 'shadow-sm')
                                  : 'border-transparent hover:bg-accent/40 hover:border-border',
                              )}
                            >
                              {selectedId === r.id && (
                                <span className={cn('absolute left-0 top-0 bottom-0 w-1', levelConfig[lvl].color.replace('text-', 'bg-'))} />
                              )}
                              <div className="font-medium leading-snug truncate pr-1">{r.name}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2 pr-1">{r.summary}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Selected variant detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="min-w-0 overflow-hidden"
            >
              <Card className={cn('bg-card/60 border', cfg.border)}>
                <CardContent className="p-5 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={cn('flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center', cfg.bg, cfg.color)}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="outline" className={cn('text-[10px] font-mono', cfg.bg, cfg.color, cfg.border)}>
                          Level {selected.level} · {levelLabels[selected.level].short}
                        </Badge>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold leading-tight">{selected.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{selected.summary}</p>
                    </div>
                  </div>

                  {/* Question + criteria */}
                  {selected.level > 1 && (
                    <div className="grid sm:grid-cols-2 gap-3 mb-5">
                      <CriterionCard icon={<Target className="h-3.5 w-3.5" />} label="Question" value={selected.question} tone="slate" />
                      <CriterionCard icon={<Scale className="h-3.5 w-3.5" />} label="Single variable" value={selected.mainVariable} tone="violet" />
                      <CriterionCard icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Success criterion" value={selected.successCriterion} tone="emerald" />
                      <CriterionCard icon={<XCircle className="h-3.5 w-3.5" />} label="Abandonment criterion" value={selected.abandonmentCriterion} tone="rose" />
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Ingredients */}
                    <div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <Beaker className="h-4 w-4 text-primary" />
                        <h4 className="font-semibold text-sm">Ingredients</h4>
                        <span className="ml-auto text-xs font-mono text-muted-foreground">
                          total {totalGrams} g
                        </span>
                      </div>
                      <div className="rounded-lg border border-border overflow-hidden">
                        <table className="w-full text-xs">
                          <thead className="bg-muted/60 border-b-2 border-border">
                            <tr className="text-left text-[10px] text-muted-foreground uppercase tracking-wider">
                              <th className="py-2.5 px-3 font-semibold">Ingredient</th>
                              <th className="py-2.5 px-2 font-semibold text-right">Grams</th>
                              <th className="py-2.5 px-2 font-semibold text-right" title="Percentage of total batter weight">Wt %</th>
                              <th className="py-2.5 px-3 font-semibold text-right" title="Baker's percentage (relative to eggs = 100%)">Baker %</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selected.ingredients.map((ing, idx) => (
                              <tr key={idx} className="border-t border-border/40 hover:bg-accent/20 transition-colors">
                                <td className="py-2.5 px-3">
                                  <div className="font-medium">{ing.name}</div>
                                  {ing.note && <div className="text-[10px] text-muted-foreground mt-0.5">{ing.note}</div>}
                                </td>
                                <td className="py-2.5 px-2 text-right font-mono font-semibold tabular-nums">{ing.grams > 0 ? ing.grams : '—'}</td>
                                <td className="py-2.5 px-2 text-right font-mono text-muted-foreground tabular-nums">{ing.percent.toFixed(1)}</td>
                                <td className="py-2.5 px-3 text-right font-mono text-muted-foreground tabular-nums">
                                  {totalGrams > 0 ? ((ing.grams / Math.max(selected.ingredients.find(i => i.name.toLowerCase().includes('flour'))?.grams || 1, 1)) * 100).toFixed(0) : '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-2 text-[11px] text-muted-foreground">
                        <Package className="inline h-3 w-3 mr-1" />
                        {selected.yieldNote}
                      </div>
                    </div>

                    {/* Steps */}
                    <div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <ListOrdered className="h-4 w-4 text-primary" />
                        <h4 className="font-semibold text-sm">Method</h4>
                        <span className="ml-auto text-xs font-mono text-muted-foreground">
                          {selected.steps.length} steps
                        </span>
                      </div>
                      <ol className="space-y-2.5 relative">
                        {/* vertical timeline line */}
                        <span className="absolute left-[9px] top-2 bottom-2 w-px bg-border" aria-hidden />
                        {selected.steps.map((step, idx) => (
                          <li key={idx} className="flex gap-3 text-xs relative min-w-0">
                            <span className="flex-shrink-0 w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground font-mono text-[9px] font-bold flex items-center justify-center mt-0.5 z-10 ring-2 ring-background shadow-sm">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed text-foreground/90 pt-0.5 min-w-0 break-words">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Expected effect */}
                  {selected.expectedEffect && (
                    <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">
                        Expected effect
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed">{selected.expectedEffect}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function CriterionCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string | null
  tone: 'slate' | 'emerald' | 'rose' | 'violet'
}) {
  const toneClass = {
    slate: 'border-border bg-muted/40',
    emerald: 'border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/20 dark:border-emerald-900',
    rose: 'border-rose-200 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900',
    violet: 'border-violet-200 bg-violet-50/60 dark:bg-violet-950/20 dark:border-violet-900',
  }[tone]
  const iconColor = {
    slate: 'text-muted-foreground',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    rose: 'text-rose-600 dark:text-rose-400',
    violet: 'text-violet-600 dark:text-violet-400',
  }[tone]
  return (
    <div className={cn('rounded-lg border p-3', toneClass)}>
      <div className={cn('flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider mb-1', iconColor)}>
        {icon}
        {label}
      </div>
      <p className="text-xs leading-relaxed text-foreground/80">{value ?? '—'}</p>
    </div>
  )
}
