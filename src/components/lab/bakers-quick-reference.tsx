'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Printer, ChefHat, Clock, Thermometer, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// The core recipe distilled to its essentials — for a home baker to print
const CORE_RECIPE = [
  { name: 'Whole eggs (room temp)', grams: 240, note: '~4 large eggs; weigh shelled' },
  { name: 'Granulated sugar', grams: 150, note: 'Blanca del Norte or equivalent' },
  { name: 'All-purpose wheat flour', grams: 150, note: 'Plain, not self-raising' },
  { name: 'Fine salt', grams: 1.5, note: 'Sal Yodo' },
]

const KEY_STEPS = [
  { step: 'Preheat', detail: '180°C. Place a heavy sheet/stone on lower rack. Grease 6 × 7cm molds, line bottoms with parchment. Do NOT grease sides.', time: '20 min' },
  { step: 'Warm & whip', detail: 'Warm eggs+ sugar to ~38°C over water bath. Whip on high until pale, tripled, ribbon trail holds 3-sec figure-8.', time: '6-8 min' },
  { step: 'Sift & fold', detail: 'Sift flour+salt once over foam. Fold in 3 additions — cut down middle, scrape bottom, lift over. Stop at no dry streaks.', time: '2 min' },
  { step: 'Fill & tap', detail: 'Divide ~75g per mold. Tap each once on counter to release large bubbles.', time: '1 min' },
  { step: 'Bake', detail: 'Middle rack, 22-26 min. Do NOT open door before 20 min. Done when deep golden-amber, toothpick clean, internal ~95°C.', time: '22-26 min' },
  { step: 'Cool', detail: '5 min in mold, then run blade around sides, invert onto rack. Cool fully before packaging.', time: '30 min' },
]

const CHECKPOINTS = [
  { label: 'Ribbon stage', check: 'Trail holds 3-sec figure-8', icon: 'ribbon' },
  { label: 'Fold complete', check: 'No dry streaks; batter still voluminous', icon: 'fold' },
  { label: 'Doneness', check: 'Deep golden-amber + toothpick clean + ~95°C internal', icon: 'done' },
  { label: 'Cool', check: 'Cake releases cleanly from mold', icon: 'cool' },
]

const COMMON_PITFALLS = [
  'Underwhipping → dense, low rise. Whip until the ribbon trail holds.',
  'Overfolding → deflated foam. Stop the instant no streaks remain.',
  'Opening oven early → collapse. Wait until 20 min minimum.',
  'Greased sides → slumped, mushroomed top. Leave sides ungreased.',
]

export function BakersQuickReference() {
  const handlePrint = () => {
    // Add a class to body to trigger print CSS that shows only this card
    document.body.classList.add('print-bakers-card')
    window.print()
    // Clean up after print dialog
    setTimeout(() => document.body.classList.remove('print-bakers-card'), 1000)
  }

  const totalBatter = CORE_RECIPE.reduce((s, i) => s + i.grams, 0)

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-card border-primary/30 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ChefHat className="h-4 w-4 text-primary" />
            </div>
            Baker&rsquo;s Quick Reference
          </CardTitle>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity no-print"
          >
            <Printer className="h-3.5 w-3.5" />
            Print card
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          The core formula distilled to one printable card. 6 individual round domed cakes (~6.5 cm),
          ~75 g each. Scale linearly for larger batches.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ingredients — compact table */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2">
            Ingredients (weigh everything)
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
                {CORE_RECIPE.map((ing, idx) => (
                  <tr key={idx} className="border-t border-border/40">
                    <td className="py-2 px-3 font-medium">{ing.name}</td>
                    <td className="py-2 px-2 text-right">
                      <span className="font-mono font-bold text-primary tabular-nums">{ing.grams}</span>
                      <span className="text-[10px] text-muted-foreground ml-0.5">g</span>
                    </td>
                    <td className="py-2 px-3 text-[10px] text-muted-foreground">{ing.note}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-primary/20 bg-primary/5">
                  <td className="py-2 px-3 font-semibold text-[11px]">Total batter</td>
                  <td className="py-2 px-2 text-right font-mono font-bold tabular-nums">{totalBatter} g</td>
                  <td className="py-2 px-3 text-[10px] text-muted-foreground">≈ 6 cakes</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Method — timeline */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Method (6 steps, ~60 min total)
          </div>
          <ol className="space-y-1.5 relative">
            <span className="absolute left-[11px] top-2 bottom-2 w-px bg-primary/20" aria-hidden />
            {KEY_STEPS.map((s, idx) => (
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
            {CHECKPOINTS.map((c, idx) => (
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
            Common pitfalls
          </div>
          <ul className="space-y-1">
            {COMMON_PITFALLS.map((p, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                <span className="text-rose-500 flex-shrink-0 mt-0.5">▸</span>
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-primary/20 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="font-mono">
            <Thermometer className="inline h-3 w-3 mr-1" />
            180°C · foam-only · no chemical leavener
          </span>
          <span className="font-mono">Chongoyape Lab · v1</span>
        </div>
      </CardContent>
    </Card>
  )
}
