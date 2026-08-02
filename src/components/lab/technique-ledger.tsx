'use client'

import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from './section-header'
import { TierBadge } from './badges'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Wrench, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Technique } from './types'

const tierIcon: Record<string, React.ReactNode> = {
  core: <CheckCircle2 className="h-3.5 w-3.5" />,
  optional: <AlertCircle className="h-3.5 w-3.5" />,
  reject: <XCircle className="h-3.5 w-3.5" />,
}

export function TechniqueLedger({ techniques }: { techniques: Technique[] }) {
  const grouped = {
    core: techniques.filter((t) => t.tier === 'core'),
    optional: techniques.filter((t) => t.tier === 'optional'),
    reject: techniques.filter((t) => t.tier === 'reject'),
  }

  return (
    <section id="techniques" className="scroll-mt-20 py-16 sm:py-20 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="05"
          title="Technique Decision Ledger"
          subtitle="Every technique audited for its intended function, target evidence, simpler alternative, failure mode, and observable measurement. Ceremonial, redundant, or inherited steps are rejected."
          icon={<Wrench className="h-5 w-5 text-primary" />}
        />

        <div className="grid lg:grid-cols-3 gap-4">
          {(['core', 'optional', 'reject'] as const).map((tierKey) => (
            <Card key={tierKey} className="bg-card/60 flex flex-col">
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm capitalize flex items-center gap-2">
                    {tierIcon[tierKey]}
                    {tierKey === 'core' ? 'Core techniques' : tierKey === 'optional' ? 'Optional' : 'Rejected'}
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground">
                    {grouped[tierKey].length}
                  </span>
                </div>
                <ScrollArea className={cn('flex-1', tierKey === 'core' ? 'max-h-[460px]' : 'max-h-[300px]')}>
                  <div className="space-y-2 pr-2">
                    {grouped[tierKey].map((t) => (
                      <div
                        key={t.id}
                        className={cn(
                          'rounded-md border p-3 text-xs',
                          tierKey === 'reject'
                            ? 'border-rose-200 bg-rose-50/40 dark:bg-rose-950/10 dark:border-rose-900'
                            : tierKey === 'optional'
                              ? 'border-amber-200 bg-amber-50/40 dark:bg-amber-950/10 dark:border-amber-900'
                              : 'border-border bg-muted/30',
                        )}
                      >
                        <div className="font-medium text-[13px] leading-snug mb-1.5">{t.name}</div>
                        <div className="space-y-1 text-muted-foreground">
                          <div><span className="font-semibold text-foreground/70">Function: </span>{t.function}</div>
                          <div><span className="font-semibold text-foreground/70">Target: </span>{t.targetEvidence}</div>
                          {tierKey !== 'reject' && (
                            <div><span className="font-semibold text-foreground/70">Simpler alt: </span>{t.simplerAlternative}</div>
                          )}
                          <div><span className="font-semibold text-foreground/70">Failure: </span>{t.failureMode}</div>
                          <div><span className="font-semibold text-foreground/70">Measurement: </span>{t.measurement}</div>
                        </div>
                        {tierKey === 'reject' && (
                          <div className="mt-2 pt-2 border-t border-rose-200/60 dark:border-rose-900/60">
                            <TierBadge value={t.tier} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
