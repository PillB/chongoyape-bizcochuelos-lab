'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Confidence } from './types'

const confidenceConfig: Record<Confidence, { label: string; className: string }> = {
  confirmed: {
    label: 'Confirmed',
    className:
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
  },
  'strongly-supported': {
    label: 'Strongly supported',
    className:
      'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
  },
  plausible: {
    label: 'Plausible',
    className:
      'bg-yellow-100 text-yellow-900 border-yellow-300 dark:bg-yellow-950/60 dark:text-yellow-300 dark:border-yellow-800',
  },
  weak: {
    label: 'Weak',
    className:
      'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
  },
  unresolved: {
    label: 'Unresolved',
    className:
      'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
  },
  contradicted: {
    label: 'Contradicted',
    className:
      'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
  },
}

export function ConfidenceBadge({ value }: { value: Confidence }) {
  const cfg = confidenceConfig[value] ?? confidenceConfig.plausible
  return (
    <Badge variant="outline" className={cn('font-medium', cfg.className)}>
      {cfg.label}
    </Badge>
  )
}

const tierConfig: Record<string, { label: string; className: string }> = {
  core: {
    label: 'Core',
    className:
      'bg-primary/15 text-primary border-primary/30 dark:bg-primary/25 dark:text-primary-foreground',
  },
  substitution: {
    label: 'Substitution',
    className:
      'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
  },
  diagnostic: {
    label: 'Diagnostic',
    className:
      'bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800',
  },
  speculative: {
    label: 'Speculative',
    className:
      'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
  },
  rejected: {
    label: 'Rejected',
    className:
      'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800 line-through',
  },
  optional: {
    label: 'Optional',
    className:
      'bg-muted text-muted-foreground border-border',
  },
}

export function TierBadge({ value }: { value: string }) {
  const cfg = tierConfig[value] ?? tierConfig.optional
  return (
    <Badge variant="outline" className={cn('font-medium', cfg.className)}>
      {cfg.label}
    </Badge>
  )
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pass: {
    label: 'Pass',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
  },
  revise: {
    label: 'Revise',
    className: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
  },
  reopen: {
    label: 'Reopen',
    className: 'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
  },
  open: {
    label: 'Open',
    className: 'bg-muted text-muted-foreground border-border',
  },
  downgraded: {
    label: 'Downgraded',
    className: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
  },
  removed: {
    label: 'Removed',
    className: 'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
  },
  predicted: {
    label: 'Predicted',
    className: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
  },
  tested: {
    label: 'Tested',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
  },
  mitigated: {
    label: 'Mitigated',
    className: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
  },
}

export function StatusBadge({ value }: { value: string }) {
  const cfg = statusConfig[value] ?? statusConfig.open
  return (
    <Badge variant="outline" className={cn('font-medium', cfg.className)}>
      {cfg.label}
    </Badge>
  )
}

const severityConfig: Record<string, { label: string; className: string }> = {
  critical: {
    label: 'Critical',
    className: 'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
  },
  major: {
    label: 'Major',
    className: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
  },
  minor: {
    label: 'Minor',
    className: 'bg-yellow-100 text-yellow-900 border-yellow-300 dark:bg-yellow-950/60 dark:text-yellow-300 dark:border-yellow-800',
  },
}

export function SeverityBadge({ value }: { value: string }) {
  const cfg = severityConfig[value] ?? severityConfig.minor
  return (
    <Badge variant="outline" className={cn('font-medium', cfg.className)}>
      {cfg.label}
    </Badge>
  )
}

export const levelLabels: Record<number, { label: string; short: string }> = {
  1: { label: 'Core Best-Evidence Recipe', short: 'Core' },
  2: { label: 'Practical Lima Substitutions', short: 'Sub' },
  3: { label: 'Diagnostic Variants', short: 'Diag' },
  4: { label: 'Speculative Experiments', short: 'Spec' },
}
