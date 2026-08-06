'use client'

import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from './section-header'
import { TierBadge } from './badges'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Wrench,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Target,
  Zap,
  AlertTriangle,
  Ruler,
  Lightbulb,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Technique } from './types'

const tierConfig: Record<string, {
  headerIcon: React.ReactNode
  headerLabel: string
  headerColor: string
  headerBg: string
  cardBorder: string
  cardBg: string
  iconColor: string
  accentBar: string
}> = {
  core: {
    headerIcon: <CheckCircle2 className="h-4 w-4" />,
    headerLabel: 'Core techniques',
    headerColor: 'text-primary',
    headerBg: 'bg-primary/10 border-primary/20',
    cardBorder: 'border-border',
    cardBg: 'bg-muted/30',
    iconColor: 'text-primary',
    accentBar: 'bg-primary',
  },
  optional: {
    headerIcon: <AlertCircle className="h-4 w-4" />,
    headerLabel: 'Optional',
    headerColor: 'text-amber-600 dark:text-amber-400',
    headerBg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    cardBorder: 'border-amber-200 dark:border-amber-800',
    cardBg: 'bg-amber-50/40 dark:bg-amber-950/10',
    iconColor: 'text-amber-600 dark:text-amber-400',
    accentBar: 'bg-amber-500',
  },
  reject: {
    headerIcon: <XCircle className="h-4 w-4" />,
    headerLabel: 'Rejected',
    headerColor: 'text-rose-600 dark:text-rose-400',
    headerBg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
    cardBorder: 'border-rose-200 dark:border-rose-800',
    cardBg: 'bg-rose-50/40 dark:bg-rose-950/10',
    iconColor: 'text-rose-600 dark:text-rose-400',
    accentBar: 'bg-rose-500',
  },
}

const fieldIcons = {
  function: <Zap className="h-3 w-3" />,
  target: <Target className="h-3 w-3" />,
  simpler: <Lightbulb className="h-3 w-3" />,
  failure: <AlertTriangle className="h-3 w-3" />,
  measurement: <Ruler className="h-3 w-3" />,
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
          phase="Phase 0 · Techniques"
          title="Technique Decision Ledger"
          subtitle="Every technique audited for its intended function, target evidence, simpler alternative, failure mode, and observable measurement. Ceremonial, redundant, or inherited steps are rejected."
          icon={<Wrench className="h-5 w-5 text-primary" />}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {(['core', 'optional', 'reject'] as const).map((tierKey) => {
            const cfg = tierConfig[tierKey]
            return (
              <Card key={tierKey} className="bg-card/60 flex flex-col overflow-hidden">
                {/* Colored header bar */}
                <div className={cn('flex items-center justify-between px-4 py-3 border-b', cfg.headerBg)}>
                  <h3 className={cn('font-semibold text-sm flex items-center gap-2', cfg.headerColor)}>
                    {cfg.headerIcon}
                    {cfg.headerLabel}
                  </h3>
                  <span className={cn('text-xs font-mono font-bold px-2 py-0.5 rounded-full', cfg.headerBg, cfg.headerColor)}>
                    {grouped[tierKey].length}
                  </span>
                </div>
                <CardContent className="p-3 flex-1 flex flex-col">
                  <ScrollArea className={cn('flex-1 scroll-warm', tierKey === 'core' ? 'max-h-[440px]' : 'max-h-[300px]')}>
                    <div className="space-y-2 pr-2">
                      {grouped[tierKey].map((t) => (
                        <div
                          key={t.id}
                          className={cn(
                            'relative rounded-md border p-3 text-xs overflow-hidden',
                            cfg.cardBorder,
                            cfg.cardBg,
                            'hover:shadow-sm transition-shadow',
                          )}
                        >
                          {/* Left accent bar */}
                          <div className={cn('absolute left-0 top-0 bottom-0 w-1', cfg.accentBar)} />

                          <div className="font-medium text-[13px] leading-snug mb-2 pl-1.5">{t.name}</div>
                          <div className="space-y-1.5 pl-1.5">
                            <FieldRow icon={fieldIcons.function} label="Function" value={t.function} iconColor={cfg.iconColor} />
                            <FieldRow icon={fieldIcons.target} label="Target" value={t.targetEvidence} iconColor={cfg.iconColor} />
                            {tierKey !== 'reject' && (
                              <FieldRow icon={fieldIcons.simpler} label="Simpler alt" value={t.simplerAlternative} iconColor={cfg.iconColor} />
                            )}
                            <FieldRow icon={fieldIcons.failure} label="Failure" value={t.failureMode} iconColor={cfg.iconColor} />
                            <FieldRow icon={fieldIcons.measurement} label="Measurement" value={t.measurement} iconColor={cfg.iconColor} />
                          </div>
                          {tierKey === 'reject' && (
                            <div className="mt-2 pt-2 border-t border-rose-200/60 dark:border-rose-900/60 pl-1.5">
                              <TierBadge value={t.tier} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FieldRow({
  icon,
  label,
  value,
  iconColor,
}: {
  icon: React.ReactNode
  label: string
  value: string
  iconColor: string
}) {
  return (
    <div className="flex items-start gap-1.5">
      <span className={cn('mt-0.5 flex-shrink-0', iconColor)}>{icon}</span>
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-foreground/70 text-[10px] uppercase tracking-wide">{label}: </span>
        <span className="text-muted-foreground">{value}</span>
      </div>
    </div>
  )
}
