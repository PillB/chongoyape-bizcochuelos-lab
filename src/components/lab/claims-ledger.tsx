'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from './section-header'
import { ConfidenceBadge } from './badges'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ScrollText, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Claim } from './types'

const categories = ['all', 'historical', 'business', 'visual', 'recipe', 'ingredient', 'technique', 'regulatory']

export function ClaimsLedger({ claims, sidebar }: { claims: Claim[]; sidebar?: React.ReactNode }) {
  const [cat, setCat] = useState('all')
  const filtered = cat === 'all' ? claims : claims.filter((c) => c.category === cat)

  return (
    <section id="claims" className="scroll-mt-20 py-16 sm:py-20 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="03"
          phase="Phase 0 · Claims"
          title="Claims Ledger"
          subtitle="Every major claim classified by confidence. Wording is downgraded whenever the evidence cannot support precision — historical plausibility is never presented as proof."
          icon={<ScrollText className="h-5 w-5 text-primary" />}
        />

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          <div className="min-w-0">
            {/* Filter chips */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
                <Filter className="h-3.5 w-3.5" />
                Category:
              </div>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-medium transition-colors border',
                    cat === c
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border hover:bg-accent',
                  )}
                >
                  {c}
                </button>
              ))}
              <span className="ml-auto text-[11px] text-muted-foreground font-mono">
                {filtered.length} / {claims.length}
              </span>
            </div>

            <Card className="bg-card/60">
              <CardContent className="p-0">
                <ScrollArea className="h-[560px]">
                  <div className="divide-y divide-border/50">
                    {filtered.map((c) => {
                      const borderColor = {
                        confirmed: 'border-l-emerald-500',
                        'strongly-supported': 'border-l-amber-500',
                        plausible: 'border-l-yellow-500',
                        weak: 'border-l-orange-500',
                        unresolved: 'border-l-sky-500',
                        contradicted: 'border-l-rose-500',
                      }[c.confidence] ?? 'border-l-border'
                      return (
                      <div key={c.id} className={cn('p-4 hover:bg-accent/30 transition-colors border-l-2', borderColor)}>
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {c.category}
                              </span>
                              <ConfidenceBadge value={c.confidence as Claim['confidence']} />
                              {c.status !== 'open' && (
                                <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 uppercase">
                                  {c.status}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium leading-snug mb-2">{c.statement}</p>
                            <div className="grid sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="font-semibold text-muted-foreground">Evidence: </span>
                                <span className="text-foreground/80">{c.evidenceBasis}</span>
                              </div>
                              {c.counterTest && (
                                <div>
                                  <span className="font-semibold text-muted-foreground">Counter-test: </span>
                                  <span className="text-foreground/80 italic">{c.counterTest}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {sidebar && (
            <div className="space-y-4 lg:sticky lg:top-20 min-w-0 overflow-hidden">
              {sidebar}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
