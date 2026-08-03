'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from './section-header'
import { ConfidenceBadge, TierBadge } from './badges'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Beaker, Store, ArrowLeftRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Ingredient } from './types'
import { GlossaryText } from './glossary'

const tiers = ['all', 'core', 'substitution', 'diagnostic', 'speculative', 'rejected']

const availabilityConfig: Record<string, string> = {
  common: 'text-emerald-600 dark:text-emerald-400',
  specialist: 'text-amber-600 dark:text-amber-400',
  uncertain: 'text-rose-600 dark:text-rose-400',
}

export function IngredientLedger({ ingredients }: { ingredients: Ingredient[] }) {
  const [tier, setTier] = useState('all')
  const filtered = tier === 'all' ? ingredients : ingredients.filter((i) => i.tier === tier)

  const totalGrams = ingredients.filter((i) => i.tier === 'core').reduce((s, i) => s + i.grams, 0)

  return (
    <section id="ingredients" className="scroll-mt-20 py-16 sm:py-20 border-b border-border/60 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="04"
          title="Ingredient Decision Ledger"
          subtitle="Every candidate ingredient with its function, evidence, Lima availability, substitution, expected effect, risk, and the predicted result of omission. An ingredient enters the core only with direct evidence or structural necessity."
          icon={<Beaker className="h-5 w-5 text-primary" />}
        />

        {/* Tier filter + summary */}
        <div className="flex flex-wrap items-center gap-2 mb-5 justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {tiers.map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium transition-colors border capitalize',
                  tier === t
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:bg-accent',
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            Core formula total: <span className="text-foreground font-semibold">{totalGrams} g</span>
          </div>
        </div>

        <Card className="bg-card/60 overflow-hidden">
          <CardContent className="p-0">
            <ScrollArea className="h-[640px] scroll-warm">
              <Accordion type="single" collapsible>
                {filtered.map((i, idx) => (
                  <AccordionItem
                    key={i.id}
                    value={i.id}
                    className={cn(
                      'border-0 border-b border-border/40',
                      idx % 2 === 1 && 'bg-muted/20',
                    )}
                  >
                    <AccordionTrigger className="px-4 py-3.5 hover:bg-primary/5 hover:no-underline group transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                        <div className="flex-shrink-0 w-[72px] text-right border-r border-border/40 pr-3 mr-1">
                          <span className="font-mono font-bold text-base text-primary tabular-nums">
                            {i.grams > 0 ? `${i.grams}` : '—'}
                          </span>
                          {i.grams > 0 && <span className="text-[10px] text-muted-foreground ml-0.5">g</span>}
                          <div className="text-[10px] text-muted-foreground font-mono tabular-nums">
                            {i.percent.toFixed(1)}%
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                            {i.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {i.function.split('.')[0]}.
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <TierBadge value={i.tier} />
                          <span className={cn('text-[10px] font-mono uppercase tracking-wide', availabilityConfig[i.limaAvailability])}>
                            {i.limaAvailability}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-1">
                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <Detail label="Function" value={i.function} glossary />
                        <Detail label="Evidence" value={i.evidence} glossary />
                        <Detail label="Confidence" valueNode={<ConfidenceBadge value={i.confidence} />} />
                        <Detail label="Lima availability" value={`${i.limaAvailability} — ${i.supermarketOption}`} />
                        <Detail label="Substitution" value={i.substitution} glossary />
                        <Detail label="Ratio adjustment" value={i.ratioAdjustment} />
                        <Detail label="Expected effect" value={i.expectedEffect} tone="emerald" glossary />
                        <Detail label="New risk" value={i.newRisk} tone="rose" glossary />
                        <Detail label="Omission result" value={i.omissionResult} tone="amber" glossary />
                        <Detail label="Baker's %" value={`${i.bakerPercent}%`} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/20 dark:border-emerald-900 p-3">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
              <Store className="h-3.5 w-3.5" /> Common in Lima
            </div>
            <p className="text-muted-foreground">Eggs, sugar, AP flour, salt, cornstarch, oil, vanilla, baking powder.</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 dark:bg-amber-950/20 dark:border-amber-900 p-3">
            <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-300 mb-1">
              <Store className="h-3.5 w-3.5" /> Specialist
            </div>
            <p className="text-muted-foreground">Cake flour / harina 0000, chuño (fécula de papa), algarrobina.</p>
          </div>
          <div className="rounded-lg border border-rose-200 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900 p-3">
            <div className="flex items-center gap-1.5 font-semibold text-rose-700 dark:text-rose-300 mb-1">
              <ArrowLeftRight className="h-3.5 w-3.5" /> Uncertain
            </div>
            <p className="text-muted-foreground">Algarrobo wood for smoking (regional; not supermarket).</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Detail({
  label,
  value,
  valueNode,
  tone = 'slate',
  glossary = false,
}: {
  label: string
  value?: string
  valueNode?: React.ReactNode
  tone?: 'slate' | 'emerald' | 'rose' | 'amber'
  glossary?: boolean
}) {
  const toneClass = {
    slate: 'bg-muted/40 border-border',
    emerald: 'bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900',
    rose: 'bg-rose-50/60 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900',
    amber: 'bg-amber-50/60 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900',
  }[tone]
  return (
    <div className={cn('rounded-md border p-2.5', toneClass)}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </div>
      {valueNode ?? (
        <div className="text-[12px] leading-relaxed">
          {glossary && value ? <GlossaryText>{value}</GlossaryText> : value}
        </div>
      )}
    </div>
  )
}
