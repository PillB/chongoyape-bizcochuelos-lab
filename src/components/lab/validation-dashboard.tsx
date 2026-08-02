'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from './section-header'
import { StatusBadge } from './badges'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ClipboardCheck, AlertOctagon, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ValidationRound, FailureTest } from './types'

const lensLabels: Record<string, string> = {
  structural: 'Structural plausibility',
  historical: 'Historical & regional plausibility',
  'target-comparison': 'Target-product comparison',
  'lima-practicality': 'Lima practicality',
  adversarial: 'Adversarial fault testing',
  parsimony: 'Parsimony challenge',
}

const checkStatusIcon: Record<string, React.ReactNode> = {
  pass: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
  predicted: <AlertTriangle className="h-3.5 w-3.5 text-sky-500" />,
  revise: <RotateCcw className="h-3.5 w-3.5 text-amber-500" />,
  reopen: <AlertOctagon className="h-3.5 w-3.5 text-rose-500" />,
}

export function ValidationDashboard({
  validations,
  failures,
}: {
  validations: ValidationRound[]
  failures: FailureTest[]
}) {
  const passCount = validations.filter((v) => v.status === 'pass').length
  const reviseCount = validations.filter((v) => v.status === 'revise').length

  return (
    <>
      <section id="validation" className="scroll-mt-20 py-16 sm:py-20 border-b border-border/60 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            index="08"
            title="Validation Dashboard"
            subtitle="Six adversarial lenses applied to the leading formula. Each check is labelled pass, predicted, revise, or reopen. Predicted checks are explicitly flagged — they have not been executed in a kitchen."
            icon={<ClipboardCheck className="h-5 w-5 text-primary" />}
          />

          {/* Summary bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <SummaryStat label="Rounds passed" value={passCount} total={validations.length} tone="emerald" />
            <SummaryStat label="Rounds revised" value={reviseCount} total={validations.length} tone="amber" />
            <SummaryStat
              label="Checks predicted"
              value={validations.reduce((s, v) => s + v.checks.filter((c) => c.status === 'predicted').length, 0)}
              total={validations.reduce((s, v) => s + v.checks.length, 0)}
              tone="sky"
            />
            <SummaryStat
              label="Checks passed"
              value={validations.reduce((s, v) => s + v.checks.filter((c) => c.status === 'pass').length, 0)}
              total={validations.reduce((s, v) => s + v.checks.length, 0)}
              tone="emerald"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {validations.map((v) => (
              <Card key={v.id} className="bg-card/60">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary text-sm">
                        R{v.round}
                      </div>
                      <div>
                        <CardTitle className="text-base leading-tight">
                          {lensLabels[v.lens] ?? v.lens}
                        </CardTitle>
                        <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">{v.lens}</div>
                      </div>
                    </div>
                    <StatusBadge value={v.status} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ScrollArea className="max-h-[280px]">
                    <ul className="space-y-2 pr-2">
                      {v.checks.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs">
                          <span className="mt-0.5 flex-shrink-0">
                            {checkStatusIcon[c.status] ?? <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground">{c.check}</div>
                            <div className="text-muted-foreground mt-0.5 leading-relaxed">{c.result}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                  {v.defects && (
                    <div className="mt-3 pt-3 border-t border-border text-xs">
                      <span className="font-semibold text-amber-600 dark:text-amber-400">Defects: </span>
                      <span className="text-muted-foreground">{v.defects}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Failure tests */}
      <section id="failures" className="scroll-mt-20 py-16 sm:py-20 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            index="09"
            title="Failure-Test Specification"
            subtitle="Defined before formulation. Each failure mode has a measurable threshold, a detection method, and a severity. Most are currently predicted — kitchen execution will convert them to tested or mitigated."
            icon={<AlertOctagon className="h-5 w-5 text-primary" />}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {failures.map((f) => (
              <Card key={f.id} className={cn('bg-card/60', f.severity === 'critical' && 'border-rose-200 dark:border-rose-900')}>
                <CardContent className="p-3.5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-medium text-sm leading-snug flex-1">{f.failureMode}</div>
                    <SeverityPill severity={f.severity} />
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="font-semibold text-muted-foreground">Threshold: </span>
                      <span className="font-mono text-[11px]">{f.threshold}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground">Detection: </span>
                      <span className="text-foreground/80">{f.detection}</span>
                    </div>
                    <div>
                      <StatusBadge value={f.status} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function SummaryStat({
  label,
  value,
  total,
  tone,
}: {
  label: string
  value: number
  total: number
  tone: 'emerald' | 'amber' | 'sky' | 'rose'
}) {
  const toneClass = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-600 dark:text-amber-400',
    sky: 'text-sky-600 dark:text-sky-400',
    rose: 'text-rose-600 dark:text-rose-400',
  }[tone]
  return (
    <Card className="bg-card/60">
      <CardContent className="p-3.5">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
        <div className={cn('mt-1 font-mono text-2xl font-bold', toneClass)}>
          {value}
          <span className="text-sm text-muted-foreground font-normal"> / {total}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function SeverityPill({ severity }: { severity: string }) {
  const cfg = {
    critical: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    major: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    minor: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/60 dark:text-yellow-300 dark:border-yellow-800',
  }[severity] ?? 'bg-muted text-muted-foreground border-border'
  return (
    <span className={cn('text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border flex-shrink-0', cfg)}>
      {severity}
    </span>
  )
}
