'use client'

import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from './section-header'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Scissors, ArrowRight, Check } from 'lucide-react'
import type { ComplexityLog } from './types'

export function ComplexityLog({ entries }: { entries: ComplexityLog[] }) {
  return (
    <section id="complexity" className="scroll-mt-20 py-16 sm:py-20 border-b border-border/60 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="10"
          title="Complexity-Removal Log"
          subtitle="Concrete changes applied during the parsimony review. No complexity is retained without a documented benefit — novelty, sophistication, and perceived thoroughness are not benefits."
          icon={<Scissors className="h-5 w-5 text-primary" />}
        />

        <Card className="bg-card/60">
          <CardContent className="p-0">
            <ScrollArea className="max-h-[640px]">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[820px]">
                  <thead className="sticky top-0 bg-card z-10">
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="py-3 px-4 font-medium w-1/4">Original element</th>
                      <th className="py-3 px-4 font-medium w-1/4">Problem</th>
                      <th className="py-3 px-4 font-medium w-1/4">Action</th>
                      <th className="py-3 px-4 font-medium w-1/4">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e) => (
                      <tr key={e.id} className="border-b border-border/40 last:border-0 hover:bg-accent/20 align-top">
                        <td className="py-3 px-4">
                          <div className="font-medium text-rose-700 dark:text-rose-400 line-through decoration-rose-400/60">
                            {e.original}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{e.problem}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-1.5">
                            <ArrowRight className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-foreground/90">{e.action}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-emerald-700 dark:text-emerald-400">{e.result}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-lg border border-border bg-card/60 p-3">
            <div className="font-mono text-2xl font-bold text-primary">{entries.length}</div>
            <div className="text-muted-foreground mt-0.5">complexity elements removed</div>
          </div>
          <div className="rounded-lg border border-border bg-card/60 p-3">
            <div className="font-mono text-2xl font-bold text-primary">4</div>
            <div className="text-muted-foreground mt-0.5">ingredients in core formula (minimum viable)</div>
          </div>
          <div className="rounded-lg border border-border bg-card/60 p-3">
            <div className="font-mono text-2xl font-bold text-primary">10</div>
            <div className="text-muted-foreground mt-0.5">active steps, each with an observable checkpoint</div>
          </div>
        </div>
      </div>
    </section>
  )
}
