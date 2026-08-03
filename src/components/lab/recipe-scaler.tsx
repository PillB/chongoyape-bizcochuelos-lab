'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Calculator, RotateCcw, Printer, Cake } from 'lucide-react'
import { cn } from '@/lib/utils'

// Core recipe baseline (per 1 cake ≈ 90 g batter)
// 6 cakes = 541.5 g total (240 eggs, 150 sugar, 150 flour, 1.5 salt)
const BASE_CAKES = 6
const BASE = [
  { name: 'Whole eggs (room temp, shelled)', grams: 240, note: '~60 g per egg; weigh for accuracy', icon: '🥚' },
  { name: 'Granulated sugar', grams: 150, note: 'Blanca del Norte or equivalent', icon: '🍬' },
  { name: 'All-purpose wheat flour', grams: 150, note: 'Plain, not self-raising', icon: '🌾' },
  { name: 'Fine salt', grams: 1.5, note: 'Sal Yodo', icon: '🧂' },
]

export function RecipeScaler() {
  const [cakes, setCakes] = useState(BASE_CAKES)

  const scale = useMemo(() => cakes / BASE_CAKES, [cakes])
  const scaled = useMemo(
    () => BASE.map((i) => ({ ...i, grams: i.grams * scale })),
    [scale],
  )
  const total = scaled.reduce((s, i) => s + i.grams, 0)
  const eggsCount = Math.round((240 * scale) / 60)
  const bakerPct = scaled.map((i) => ({
    ...i,
    bakerPct: (i.grams / scaled[0].grams) * 100,
  }))

  const reset = () => setCakes(BASE_CAKES)

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-card border-primary/20 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            Interactive Recipe Scaler
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <button
              onClick={reset}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-accent"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded hover:bg-primary/10"
            >
              <Printer className="h-3 w-3" />
              Print
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Slider control */}
        <div className="rounded-lg border border-primary/20 bg-card/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cake className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Number of cakes</span>
            </div>
            <div className="flex items-baseline gap-1">
              <motion.span
                key={cakes}
                initial={{ scale: 1.15, color: 'oklch(0.62 0.14 65)' }}
                animate={{ scale: 1, color: 'oklch(0.22 0.02 50)' }}
                transition={{ duration: 0.2 }}
                className="text-3xl font-bold font-mono tabular-nums"
              >
                {cakes}
              </motion.span>
              <span className="text-xs text-muted-foreground">cakes</span>
            </div>
          </div>
          <Slider
            value={[cakes]}
            onValueChange={(v) => setCakes(v[0])}
            min={1}
            max={24}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground font-mono">
            <span>1</span>
            <span>6 (base)</span>
            <span>12</span>
            <span>18</span>
            <span>24</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span>≈ {eggsCount} eggs</span>
            <span className="text-border">·</span>
            <span>≈ {total.toFixed(0)} g total batter</span>
            <span className="text-border">·</span>
            <span>≈ {(total / cakes).toFixed(0)} g/cake</span>
          </div>
        </div>

        {/* Scaled ingredients table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/60">
              <tr className="text-left text-[10px] text-muted-foreground uppercase tracking-wider">
                <th className="py-2 px-3 font-medium">Ingredient</th>
                <th className="py-2 px-2 font-medium text-right">Grams</th>
                <th className="py-2 px-2 font-medium text-right hidden sm:table-cell">Baker%</th>
                <th className="py-2 px-3 font-medium w-24">Visual ratio</th>
              </tr>
            </thead>
            <tbody>
              {bakerPct.map((ing, idx) => {
                const maxGrams = scaled[0].grams
                const barPct = (ing.grams / maxGrams) * 100
                return (
                  <tr key={idx} className="border-t border-border/50 hover:bg-accent/20 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{ing.icon}</span>
                        <div>
                          <div className="font-medium text-[13px]">{ing.name}</div>
                          <div className="text-[10px] text-muted-foreground">{ing.note}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <motion.span
                        key={ing.grams.toFixed(1)}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="font-mono font-semibold tabular-nums"
                      >
                        {ing.grams.toFixed(ing.grams < 5 ? 1 : 0)}
                      </motion.span>
                      <span className="text-[10px] text-muted-foreground ml-0.5">g</span>
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-xs text-muted-foreground hidden sm:table-cell tabular-nums">
                      {ing.bakerPct.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={false}
                          animate={{ width: `${barPct}%` }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className={cn(
                            'h-full rounded-full',
                            idx === 0
                              ? 'bg-amber-400'
                              : idx === 1
                                ? 'bg-amber-500'
                                : idx === 2
                                  ? 'bg-amber-600'
                                  : 'bg-amber-700',
                          )}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30">
                <td className="py-2 px-3 font-semibold text-xs">Total batter</td>
                <td className="py-2 px-2 text-right font-mono font-bold tabular-nums">
                  {total.toFixed(1)} g
                </td>
                <td className="py-2 px-2 text-right font-mono text-xs text-muted-foreground hidden sm:table-cell">
                  —
                </td>
                <td className="py-2 px-3" />
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Scaling is linear. Baker&rsquo;s percentages are relative to the egg weight (100%).
          For batches larger than 12 cakes, whip in two bowls to avoid overloading the mixer
          and fold in batches to preserve aeration.
        </p>
      </CardContent>
    </Card>
  )
}
