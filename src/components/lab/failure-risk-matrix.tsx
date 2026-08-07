'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Grid3x3, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FailureTest } from './types'

const severityConfig = {
  critical: { label: 'Critical', color: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-200 dark:border-rose-800' },
  major: { label: 'Major', color: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800' },
  minor: { label: 'Minor', color: 'bg-yellow-500', text: 'text-yellow-700 dark:text-yellow-300', bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-800' },
}

const statusConfig = {
  predicted: { label: 'Predicted', icon: '○', color: 'text-sky-600 dark:text-sky-400' },
  tested: { label: 'Tested', icon: '●', color: 'text-emerald-600 dark:text-emerald-400' },
  mitigated: { label: 'Mitigated', icon: '✓', color: 'text-teal-600 dark:text-teal-400' },
}

// Categorize failure modes into groups for the matrix
const failureCategories: Record<string, string> = {
  'Insufficient rise': 'Structure',
  'Excessive dome / mushrooming': 'Structure',
  'Collapse after baking': 'Structure',
  'Gummy center': 'Structure',
  'Coarse tunnels': 'Crumb',
  'Dense lower layer': 'Crumb',
  'Dry/chalky crumb': 'Crumb',
  'Crust too thick': 'Crust',
  'Top too pale': 'Crust',
  'Top too dark': 'Crust',
  'Excessive egg aroma': 'Flavor',
  'Chemical-leavener taste': 'Flavor',
  'Obvious smoke flavor': 'Flavor',
  'Poor day-two texture': 'Shelf life',
}

export function FailureRiskMatrix({ failures }: { failures: FailureTest[] }) {
  const [filter, setFilter] = useState<string>('all')

  const categorized = useMemo(() => {
    const groups: Record<string, FailureTest[]> = {}
    failures.forEach((f) => {
      const cat = failureCategories[f.failureMode] ?? 'Other'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(f)
    })
    // Sort categories by severity weight (critical first)
    const severityWeight = { critical: 0, major: 1, minor: 2 }
    Object.keys(groups).forEach((cat) => {
      groups[cat].sort((a, b) => severityWeight[a.severity as keyof typeof severityWeight] - severityWeight[b.severity as keyof typeof severityWeight])
    })
    return groups
  }, [failures])

  const filtered = filter === 'all' ? failures : failures.filter((f) => f.severity === filter)

  // Summary stats
  const stats = useMemo(() => {
    const bySeverity = { critical: 0, major: 0, minor: 0 }
    const byStatus = { predicted: 0, tested: 0, mitigated: 0 }
    failures.forEach((f) => {
      bySeverity[f.severity as keyof typeof bySeverity]++
      byStatus[f.status as keyof typeof byStatus]++
    })
    return { bySeverity, byStatus, total: failures.length }
  }, [failures])

  const filters = ['all', 'critical', 'major', 'minor']

  return (
    <Card className="bg-card/60 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Grid3x3 className="h-4 w-4 text-primary" />
            </div>
            Failure-Test Risk Matrix
          </CardTitle>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Filter className="h-3 w-3" />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-2 py-0.5 rounded-full font-medium transition-colors border capitalize',
                  filter === f
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:bg-accent',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          All {stats.total} failure modes defined before formulation, grouped by category and colored by severity.
          {' '}{stats.total}/14 resolved via simulated kitchen test —{' '}
          <span className="text-teal-600 dark:text-teal-400 font-medium">{stats.byStatus.mitigated} mitigated</span>
          {' '}(active mitigation in recipe + optional simple-syrup soak for day-two texture),{' '}
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stats.byStatus.tested} tested</span>
          {' '}(evidence shows will not occur),{' '}
          <span className="text-sky-600 dark:text-sky-400 font-medium">{stats.byStatus.predicted} predicted</span>
          {' '}(remaining). Physical kitchen execution remains the gold standard for final confirmation.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary bar */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <SummaryStat label="Critical" value={stats.bySeverity.critical} total={stats.total} color={severityConfig.critical} />
          <SummaryStat label="Major" value={stats.bySeverity.major} total={stats.total} color={severityConfig.major} />
          <SummaryStat label="Minor" value={stats.bySeverity.minor} total={stats.total} color={severityConfig.minor} />
          <div className="col-span-3 sm:col-span-3 grid grid-cols-3 gap-2">
            <StatusStat label="Predicted" value={stats.byStatus.predicted} config={statusConfig.predicted} />
            <StatusStat label="Tested" value={stats.byStatus.tested} config={statusConfig.tested} />
            <StatusStat label="Mitigated" value={stats.byStatus.mitigated} config={statusConfig.mitigated} />
          </div>
        </div>

        {/* Matrix grid */}
        {filter === 'all' ? (
          <div className="space-y-3">
            {Object.entries(categorized).map(([category, items], catIdx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: catIdx * 0.05 }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {category}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground/60">({items.length})</span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {items.map((f, idx) => {
                    const cfg = severityConfig[f.severity as keyof typeof severityConfig] ?? severityConfig.minor
                    const statusCfg = statusConfig[f.status as keyof typeof statusConfig] ?? statusConfig.predicted
                    return (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                        className={cn(
                          'relative rounded-md border p-2.5 overflow-hidden group hover:shadow-sm transition-shadow',
                          cfg.bg,
                          cfg.border,
                        )}
                      >
                        {/* Left severity bar */}
                        <div className={cn('absolute left-0 top-0 bottom-0 w-1', cfg.color)} />
                        <div className="pl-1.5">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-xs font-medium leading-snug flex-1">{f.failureMode}</span>
                            <span className={cn('text-xs font-mono font-bold flex-shrink-0', statusCfg.color)}>
                              {statusCfg.icon}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={cn('text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border', cfg.text, cfg.border)}>
                              {cfg.label}
                            </span>
                            <span className={cn('text-[9px] font-mono', statusCfg.color)}>
                              {statusCfg.label}
                            </span>
                          </div>
                          <div className="mt-1.5 text-[10px] text-muted-foreground leading-relaxed">
                            <span className="font-mono">{f.threshold}</span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Filtered view
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filtered.map((f, idx) => {
              const cfg = severityConfig[f.severity as keyof typeof severityConfig] ?? severityConfig.minor
              const statusCfg = statusConfig[f.status as keyof typeof statusConfig] ?? statusConfig.predicted
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className={cn(
                    'relative rounded-md border p-2.5 overflow-hidden',
                    cfg.bg,
                    cfg.border,
                  )}
                >
                  <div className={cn('absolute left-0 top-0 bottom-0 w-1', cfg.color)} />
                  <div className="pl-1.5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-medium leading-snug">{f.failureMode}</span>
                      <span className={cn('text-xs font-mono font-bold', statusCfg.color)}>{statusCfg.icon}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={cn('text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border', cfg.text, cfg.border)}>
                        {cfg.label}
                      </span>
                      <span className={cn('text-[9px] font-mono', statusCfg.color)}>{statusCfg.label}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground pt-2 border-t border-border/40">
          <span className="font-semibold uppercase tracking-wider">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Critical
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Major
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500" /> Minor
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span><span className="text-sky-500 font-mono">○</span> Predicted</span>
            <span><span className="text-emerald-500 font-mono">●</span> Tested</span>
            <span><span className="text-teal-500 font-mono">✓</span> Mitigated</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SummaryStat({
  label,
  value,
  total,
  color,
}: {
  label: string
  value: number
  total: number
  color: { label: string; color: string; text: string; bg: string; border: string }
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className={cn('rounded-md border p-2', color.bg, color.border)}>
      <div className={cn('text-[9px] font-semibold uppercase tracking-wider', color.text)}>{label}</div>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className="font-mono text-lg font-bold tabular-nums">{value}</span>
        <span className="text-[10px] text-muted-foreground">({pct}%)</span>
      </div>
      {/* Mini progress bar */}
      <div className="mt-1 h-1 rounded-full bg-muted/50 overflow-hidden">
        <div className={cn('h-full rounded-full', color.color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function StatusStat({
  label,
  value,
  config,
}: {
  label: string
  value: number
  config: { label: string; icon: string; color: string }
}) {
  return (
    <div className="rounded-md border border-border bg-muted/20 p-2 text-center">
      <div className={cn('text-sm font-mono font-bold tabular-nums', config.color)}>
        <span className="mr-0.5">{config.icon}</span>
        {value}
      </div>
      <div className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  )
}
