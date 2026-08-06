'use client'

import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from './section-header'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Scissors, ArrowRight, Check, X, TrendingDown, Layers, ListChecks } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ComplexityLog as ComplexityLogType } from './types'

export function ComplexityLog({ entries }: { entries: ComplexityLogType[] }) {
  return (
    <section id="complexity" className="scroll-mt-20 py-16 sm:py-20 border-b border-border/60 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="10"
          phase="Phase 2 · Complexity Log"
          title="Complexity-Removal Log"
          subtitle="Concrete changes applied during the parsimony review. No complexity is retained without a documented benefit — novelty, sophistication, and perceived thoroughness are not benefits."
          icon={<Scissors className="h-5 w-5 text-primary" />}
        />

        {/* Summary stats — enhanced with icons */}
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <StatCard
            icon={<TrendingDown className="h-4 w-4" />}
            value={entries.length}
            label="complexity elements removed"
            color="text-primary"
            bg="bg-primary/10"
            border="border-primary/20"
          />
          <StatCard
            icon={<Layers className="h-4 w-4" />}
            value={4}
            label="ingredients in core formula (minimum viable)"
            color="text-amber-600 dark:text-amber-400"
            bg="bg-amber-50 dark:bg-amber-950/30"
            border="border-amber-200 dark:border-amber-800"
          />
          <StatCard
            icon={<ListChecks className="h-4 w-4" />}
            value={10}
            label="active steps, each with an observable checkpoint"
            color="text-emerald-600 dark:text-emerald-400"
            bg="bg-emerald-50 dark:bg-emerald-950/30"
            border="border-emerald-200 dark:border-emerald-800"
          />
        </div>

        {/* Table with header bar */}
        <Card className="bg-card/60 overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-rose-50/50 to-card dark:from-rose-950/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-rose-100 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center">
                <X className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Removed elements</h3>
                <p className="text-[10px] text-muted-foreground">Each entry shows what was cut, why, and the result</p>
              </div>
            </div>
            <span className="text-xs font-mono text-muted-foreground">{entries.length} entries</span>
          </div>

          <CardContent className="p-0">
            <ScrollArea className="max-h-[640px] scroll-warm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[820px]">
                  <thead className="sticky top-0 bg-card z-10 border-b-2 border-border">
                    <tr className="text-left text-[10px] text-muted-foreground uppercase tracking-wider">
                      <th className="py-2.5 px-4 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <X className="h-3 w-3 text-rose-500" />
                          Original element
                        </span>
                      </th>
                      <th className="py-2.5 px-4 font-semibold">Problem</th>
                      <th className="py-2.5 px-4 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <ArrowRight className="h-3 w-3 text-primary" />
                          Action
                        </span>
                      </th>
                      <th className="py-2.5 px-4 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-emerald-500" />
                          Result
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e, idx) => (
                      <tr
                        key={e.id}
                        className={cn(
                          'border-b border-border/40 last:border-0 hover:bg-accent/20 transition-colors align-top',
                          idx % 2 === 1 && 'bg-muted/10',
                        )}
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-rose-700 dark:text-rose-400 line-through decoration-rose-400/60 leading-snug">
                            {e.original}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-[13px] leading-relaxed">{e.problem}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-1.5">
                            <ArrowRight className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-foreground/90 text-[13px] leading-relaxed">{e.action}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-emerald-700 dark:text-emerald-400 text-[13px] leading-relaxed font-medium">{e.result}</span>
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
      </div>
    </section>
  )
}

function StatCard({
  icon,
  value,
  label,
  color,
  bg,
  border,
}: {
  icon: React.ReactNode
  value: number
  label: string
  color: string
  bg: string
  border: string
}) {
  return (
    <div className={cn('rounded-lg border p-3 flex items-center gap-3', bg, border)}>
      <div className={cn('w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0', bg, color)}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className={cn('font-mono text-2xl font-bold tabular-nums', color)}>{value}</div>
        <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">{label}</div>
      </div>
    </div>
  )
}
