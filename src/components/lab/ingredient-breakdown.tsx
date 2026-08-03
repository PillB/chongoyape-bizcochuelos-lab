'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RecipeVariant } from './types'

// Color palette for ingredient categories (warm bakery tones)
const ingredientColors: Record<string, { bg: string; text: string; label: string }> = {
  egg: { bg: 'bg-amber-400', text: 'text-amber-700 dark:text-amber-300', label: 'Eggs' },
  sugar: { bg: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300', label: 'Sugar' },
  flour: { bg: 'bg-amber-600', text: 'text-amber-800 dark:text-amber-400', label: 'Flour' },
  starch: { bg: 'bg-orange-400', text: 'text-orange-700 dark:text-orange-300', label: 'Starch' },
  fat: { bg: 'bg-yellow-500', text: 'text-yellow-800 dark:text-yellow-300', label: 'Fat' },
  salt: { bg: 'bg-stone-500', text: 'text-stone-700 dark:text-stone-300', label: 'Salt' },
  flavor: { bg: 'bg-rose-400', text: 'text-rose-700 dark:text-rose-300', label: 'Flavoring' },
  leavener: { bg: 'bg-teal-400', text: 'text-teal-700 dark:text-teal-300', label: 'Leavener' },
  other: { bg: 'bg-primary', text: 'text-primary', label: 'Other' },
}

function categorize(name: string): keyof typeof ingredientColors {
  const n = name.toLowerCase()
  if (n.includes('egg')) return 'egg'
  if (n.includes('sugar')) return 'sugar'
  if (n.includes('flour') || n.includes('harina')) return 'flour'
  if (n.includes('starch') || n.includes('chuño') || n.includes('cornstarch') || n.includes('maicena')) return 'starch'
  if (n.includes('oil') || n.includes('butter') || n.includes('fat')) return 'fat'
  if (n.includes('salt')) return 'salt'
  if (n.includes('vanilla') || n.includes('zest') || n.includes('algarrobina') || n.includes('flavor')) return 'flavor'
  if (n.includes('baking') || n.includes('leaven') || n.includes('polvo')) return 'leavener'
  return 'other'
}

export function IngredientBreakdown({ recipes }: { recipes: RecipeVariant[] }) {
  // Show the core recipe (level 1) by default, allow switching to any variant
  const coreRecipe = recipes.find((r) => r.level === 1) ?? recipes[0]
  const [selectedId, setSelectedId] = useState(coreRecipe?.id ?? '')

  const selected = recipes.find((r) => r.id === selectedId) ?? coreRecipe
  if (!selected) return null

  const totalGrams = selected.ingredients.reduce((s, i) => s + i.grams, 0)

  // Categorize and aggregate
  const categorized = new Map<string, { grams: number; items: { name: string; grams: number }[] }>()
  selected.ingredients.forEach((ing) => {
    if (ing.grams <= 0) return
    const cat = categorize(ing.name)
    const existing = categorized.get(cat) ?? { grams: 0, items: [] }
    existing.grams += ing.grams
    existing.items.push({ name: ing.name, grams: ing.grams })
    categorized.set(cat, existing)
  })

  const categories = Array.from(categorized.entries())
    .map(([key, val]) => ({
      key,
      ...val,
      pct: (val.grams / totalGrams) * 100,
      config: ingredientColors[key] ?? ingredientColors.other,
    }))
    .sort((a, b) => b.grams - a.grams)

  // Get variants that have ingredients with grams > 0
  const selectableVariants = recipes.filter((r) => r.ingredients.some((i) => i.grams > 0))

  return (
    <Card className="bg-card/60 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BarChart3 className="h-3.5 w-3.5 text-primary" />
            </div>
            Formula Breakdown
          </CardTitle>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="h-7 px-2 rounded-md border border-border bg-card text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Select recipe variant"
          >
            {selectableVariants.map((r) => (
              <option key={r.id} value={r.id}>
                L{r.level} · {r.name.split('—')[0].trim().substring(0, 30)}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stacked horizontal bar */}
        <div>
          <div className="flex items-center justify-between mb-2 text-[11px]">
            <span className="text-muted-foreground font-medium">Composition by weight</span>
            <span className="font-mono text-muted-foreground">{totalGrams.toFixed(1)} g total</span>
          </div>
          <div className="flex h-8 rounded-md overflow-hidden border border-border shadow-inner">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.key}
                initial={{ width: 0 }}
                animate={{ width: `${cat.pct}%` }}
                transition={{ duration: 0.5, delay: idx * 0.06, ease: 'easeOut' }}
                className={cn(cat.config.bg, 'relative group flex items-center justify-center min-w-[2px]')}
                title={`${cat.config.label}: ${cat.grams.toFixed(1)}g (${cat.pct.toFixed(1)}%)`}
              >
                {cat.pct > 8 && (
                  <span className="text-[10px] font-mono font-bold text-white drop-shadow-sm px-1">
                    {cat.pct.toFixed(0)}%
                  </span>
                )}
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-40 pointer-events-none">
                  <div className="rounded-md border border-border bg-popover shadow-lg p-2 text-left">
                    <div className={cn('text-[10px] font-bold uppercase tracking-wider mb-1', cat.config.text)}>
                      {cat.config.label}
                    </div>
                    <div className="font-mono text-xs font-semibold">{cat.grams.toFixed(1)} g</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{cat.pct.toFixed(1)}% of total</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Scale markers */}
          <div className="flex justify-between mt-1 text-[9px] text-muted-foreground font-mono">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Category legend with details */}
        <div className="grid sm:grid-cols-2 gap-2">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/20 p-2 hover:bg-muted/40 transition-colors"
            >
              <span className={cn('w-3 h-3 rounded-sm flex-shrink-0', cat.config.bg)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className={cn('text-xs font-semibold', cat.config.text)}>{cat.config.label}</span>
                  <span className="font-mono text-xs tabular-nums">
                    {cat.grams.toFixed(1)}g
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground truncate">
                    {cat.items.map((i) => i.name.split('(')[0].trim()).join(', ')}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                    {cat.pct.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Baker's percentages note */}
        <div className="flex items-start gap-2 rounded-md bg-primary/5 border border-primary/15 p-2.5">
          <Info className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="text-primary font-medium">Baker&rsquo;s %</span> expresses each ingredient as a
            percentage of the egg weight (the 100% reference for foam sponges). This chart shows weight
            percentage of the total batter — useful for visualizing the formula&rsquo;s lean, fat-free profile.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
