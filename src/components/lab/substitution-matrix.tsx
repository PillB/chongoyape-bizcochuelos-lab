'use client'

import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from './section-header'
import { ConfidenceBadge } from './badges'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeftRight } from 'lucide-react'
import type { Substitution } from './types'

export function SubstitutionMatrix({ substitutions }: { substitutions: Substitution[] }) {
  return (
    <section id="substitutions" className="scroll-mt-20 py-16 sm:py-20 border-b border-border/60 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="06"
          phase="Phase 0 · Substitutions"
          title="Substitution Matrix"
          subtitle="No two ingredients are called interchangeable without describing their functional differences. Each substitution states the property replaced, the property lost, the quantity adjustment, and the technique adjustment."
          icon={<ArrowLeftRight className="h-5 w-5 text-primary" />}
        />

        <Card className="bg-card/60">
          <CardContent className="p-0">
            <ScrollArea className="max-h-[560px]">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[760px]">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="py-3 px-4 font-medium">Original</th>
                      <th className="py-3 px-4 font-medium">Substitute</th>
                      <th className="py-3 px-4 font-medium">Property replaced</th>
                      <th className="py-3 px-4 font-medium">Property lost</th>
                      <th className="py-3 px-4 font-medium">Quantity adj.</th>
                      <th className="py-3 px-4 font-medium">Technique adj.</th>
                      <th className="py-3 px-4 font-medium">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {substitutions.map((s) => (
                      <tr key={s.id} className="border-b border-border/40 last:border-0 hover:bg-accent/20">
                        <td className="py-3 px-4 align-top font-medium">{s.original}</td>
                        <td className="py-3 px-4 align-top text-primary font-medium">{s.substitute}</td>
                        <td className="py-3 px-4 align-top text-muted-foreground">{s.propertyReplaced}</td>
                        <td className="py-3 px-4 align-top text-rose-600/80 dark:text-rose-400/80">{s.propertyLost}</td>
                        <td className="py-3 px-4 align-top font-mono text-xs">{s.quantityAdjustment}</td>
                        <td className="py-3 px-4 align-top text-muted-foreground text-xs">{s.techniqueAdjustment}</td>
                        <td className="py-3 px-4 align-top">
                          <ConfidenceBadge value={s.confidence} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <p className="mt-4 text-xs text-muted-foreground leading-relaxed max-w-3xl">
          Substitution hierarchy: (1) same ingredient, different Lima brand → (2) same functional
          category, known composition → (3) adjusted blend of common supermarket ingredients →
          (4) specialist substitute → (5) experimental analogue. The hierarchy above is applied in
          that order.
        </p>
      </div>
    </section>
  )
}
