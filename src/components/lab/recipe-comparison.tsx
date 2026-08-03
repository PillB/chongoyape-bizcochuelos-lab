'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  GitCompare,
  X,
  CheckCircle2,
  AlertTriangle,
  Scale,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { levelLabels } from './badges'
import type { RecipeVariant, RecipeIngredient } from './types'

const levelColors: Record<number, string> = {
  1: 'text-primary',
  2: 'text-teal-600 dark:text-teal-400',
  3: 'text-violet-600 dark:text-violet-400',
  4: 'text-rose-600 dark:text-rose-400',
}

const levelBg: Record<number, string> = {
  1: 'bg-primary/10 border-primary/30',
  2: 'bg-teal-50 border-teal-200 dark:bg-teal-950/30 dark:border-teal-800',
  3: 'bg-violet-50 border-violet-200 dark:bg-violet-950/30 dark:border-violet-800',
  4: 'bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800',
}

export function RecipeComparison({ recipes }: { recipes: RecipeVariant[] }) {
  const [compareMode, setCompareMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const selectedVariants = useMemo(
    () => selectedIds.map((id) => recipes.find((r) => r.id === id)).filter(Boolean) as RecipeVariant[],
    [selectedIds, recipes],
  )

  // Collect all unique ingredient names across selected variants
  const allIngredients = useMemo(() => {
    const names = new Set<string>()
    selectedVariants.forEach((v) => v.ingredients.forEach((i) => names.add(i.name)))
    return Array.from(names)
  }, [selectedVariants])

  const toggleVariant = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return [prev[1], prev[2], id] // keep max 3, drop oldest
      return [...prev, id]
    })
  }

  const getIngredient = (variant: RecipeVariant, name: string): RecipeIngredient | undefined =>
    variant.ingredients.find((i) => i.name === name)

  return (
    <Card className="bg-card/60 border-primary/20">
      <CardContent className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <GitCompare className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Variant Comparison</h3>
              <p className="text-[11px] text-muted-foreground">
                Select up to 3 variants to compare ingredients side-by-side
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCompareMode((m) => !m)
              if (compareMode) setSelectedIds([])
            }}
            className={cn(
              'inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium border transition-colors',
              compareMode
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border hover:bg-accent',
            )}
          >
            {compareMode ? (
              <>
                <X className="h-3 w-3" />
                Exit compare
              </>
            ) : (
              <>
                <GitCompare className="h-3 w-3" />
                Compare
              </>
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {compareMode ? (
            <motion.div
              key="compare-mode"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {/* Variant selector */}
              <div className="mb-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Select variants ({selectedIds.length}/3)
                </div>
                <ScrollArea className="max-h-[200px] scroll-warm">
                  <div className="grid sm:grid-cols-2 gap-1.5 pr-2">
                    {recipes.map((r) => {
                      const isSelected = selectedIds.includes(r.id)
                      const isDisabled = !isSelected && selectedIds.length >= 3
                      return (
                        <label
                          key={r.id}
                          className={cn(
                            'flex items-start gap-2.5 p-2.5 rounded-md border cursor-pointer transition-all',
                            isSelected
                              ? cn(levelBg[r.level], 'shadow-sm')
                              : isDisabled
                                ? 'border-border bg-muted/20 opacity-50 cursor-not-allowed'
                                : 'border-border bg-card/40 hover:bg-accent/40',
                          )}
                        >
                          <Checkbox
                            checked={isSelected}
                            disabled={isDisabled}
                            onCheckedChange={() => toggleVariant(r.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className={cn('text-[9px] font-mono font-bold', levelColors[r.level])}>
                                L{r.level}
                              </span>
                              <span className="text-xs font-medium leading-snug truncate">{r.name}</span>
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate">{r.summary}</div>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Comparison table */}
              {selectedVariants.length >= 2 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="rounded-lg border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs min-w-[500px]">
                        <thead className="bg-muted/60 border-b-2 border-border">
                          <tr>
                            <th className="py-2.5 px-3 text-left font-semibold text-[10px] uppercase tracking-wider text-muted-foreground sticky left-0 bg-muted/60 z-10">
                              Ingredient
                            </th>
                            {selectedVariants.map((v) => (
                              <th key={v.id} className="py-2.5 px-3 text-right font-semibold min-w-[100px]">
                                <div className="flex flex-col items-end gap-0.5">
                                  <span className={cn('text-[9px] font-mono font-bold', levelColors[v.level])}>
                                    L{v.level}
                                  </span>
                                  <span className="text-[11px] leading-tight">{v.name.split('—')[0].trim()}</span>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {allIngredients.map((ingName, idx) => {
                            const values = selectedVariants.map((v) => getIngredient(v, ingName))
                            const gramsValues = values.map((v) => v?.grams ?? 0)
                            const hasValues = gramsValues.some((g) => g > 0)
                            const allSame = hasValues && gramsValues.every((g) => g === gramsValues[0])
                            const maxGrams = Math.max(...gramsValues)

                            return (
                              <tr
                                key={ingName}
                                className={cn(
                                  'border-t border-border/40',
                                  idx % 2 === 1 && 'bg-muted/20',
                                  !allSame && hasValues && 'bg-amber-50/40 dark:bg-amber-950/10',
                                )}
                              >
                                <td className="py-2 px-3 font-medium sticky left-0 bg-inherit z-10">
                                  {ingName}
                                </td>
                                {values.map((v, vIdx) => (
                                  <td key={vIdx} className="py-2 px-3 text-right">
                                    {v ? (
                                      <span className={cn(
                                        'font-mono tabular-nums',
                                        !allSame && v.grams === maxGrams && v.grams > 0
                                          ? 'font-bold text-primary'
                                          : 'text-foreground/80',
                                      )}>
                                        {v.grams > 0 ? `${v.grams}` : '—'}
                                        {v.grams > 0 && <span className="text-[9px] text-muted-foreground ml-0.5">g</span>}
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground/40">—</span>
                                    )}
                                  </td>
                                ))}
                              </tr>
                            )
                          })}
                          {/* Total row */}
                          <tr className="border-t-2 border-border bg-muted/30">
                            <td className="py-2 px-3 font-semibold text-[11px] sticky left-0 bg-muted/30 z-10">
                              Total batter
                            </td>
                            {selectedVariants.map((v) => {
                              const total = v.ingredients.reduce((s, i) => s + i.grams, 0)
                              return (
                                <td key={v.id} className="py-2 px-3 text-right">
                                  <span className="font-mono font-bold tabular-nums">{total.toFixed(0)}</span>
                                  <span className="text-[9px] text-muted-foreground ml-0.5">g</span>
                                </td>
                              )
                            })}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800" />
                      <span>Row differs across variants</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-primary">bold</span>
                      <span>Highest value in row</span>
                    </div>
                  </div>

                  {/* Key differences summary */}
                  <KeyDifferences variants={selectedVariants} />
                </motion.div>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
                  <Scale className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Select at least <strong className="text-foreground">2 variants</strong> above to see the comparison.
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Currently selected: {selectedVariants.length}
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="info-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-dashed border-border bg-muted/20 p-4 text-center"
            >
              <p className="text-xs text-muted-foreground">
                Click <strong className="text-foreground">Compare</strong> to select up to 3 variants and view their ingredients side-by-side. Differences are highlighted automatically.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

function KeyDifferences({ variants }: { variants: RecipeVariant[] }) {
  if (variants.length < 2) return null

  // Find ingredients that differ
  const allNames = new Set<string>()
  variants.forEach((v) => v.ingredients.forEach((i) => allNames.add(i.name)))

  const differences: { name: string; values: number[]; range: number }[] = []
  allNames.forEach((name) => {
    const values = variants.map((v) => v.ingredients.find((i) => i.name === name)?.grams ?? 0)
    const hasValues = values.some((v) => v > 0)
    const allSame = values.every((v) => v === values[0])
    if (hasValues && !allSame) {
      const range = Math.max(...values) - Math.min(...values.filter((v) => v > 0), 0)
      differences.push({ name, values, range })
    }
  })

  // Ingredients present in some but not others
  const presenceDiff: { name: string; present: number; total: number }[] = []
  allNames.forEach((name) => {
    const present = variants.filter((v) => v.ingredients.some((i) => i.name === name)).length
    if (present > 0 && present < variants.length) {
      presenceDiff.push({ name, present, total: variants.length })
    }
  })

  if (differences.length === 0 && presenceDiff.length === 0) {
    return (
      <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/20 dark:border-emerald-900 p-3 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <span className="text-xs text-emerald-800 dark:text-emerald-300">
          These variants have identical ingredient lists and quantities — only the method differs.
        </span>
      </div>
    )
  }

  return (
    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/40 dark:bg-amber-950/10 dark:border-amber-900 p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          Key differences
        </span>
      </div>
      <div className="space-y-1.5 text-[11px]">
        {differences.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="text-muted-foreground flex-1 truncate">{d.name}</span>
            <span className="font-mono text-foreground">
              {d.values.map((v, i) => (
                <span key={i}>
                  {v > 0 ? `${v}g` : '—'}
                  {i < d.values.length - 1 && <span className="text-muted-foreground mx-1">→</span>}
                </span>
              ))}
            </span>
            <Badge variant="outline" className="text-[9px] h-4 bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
              Δ {d.range}g
            </Badge>
          </div>
        ))}
        {presenceDiff.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <span className="text-muted-foreground flex-1 truncate">{p.name}</span>
            <span className="font-mono text-amber-700 dark:text-amber-400">
              in {p.present}/{p.total} variants
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
