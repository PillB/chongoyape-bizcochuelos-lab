'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Target,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LabData } from './types'

interface Finding {
  icon: React.ReactNode
  label: string
  title: string
  detail: string
  color: string
  bg: string
  border: string
}

export function ExecutiveSummary({ data }: { data: LabData }) {
  const { claims, validations, convergence } = data.stats
  const corroborated = claims.confirmed + claims['strongly-supported']
  const passRate = Math.round((validations.pass / Math.max(validations.total, 1)) * 100)

  const findings: Finding[] = [
    {
      icon: <AlertTriangle className="h-4 w-4" />,
      label: 'Key contradiction',
      title: 'Product form redefined',
      detail:
        'VLM forensic analysis contradicted the prior report: the product is individual round domed cakes (~6.5 cm), not a rectangular 4×4 slab. All dependent recipe assumptions were downgraded.',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/20',
      border: 'border-rose-200 dark:border-rose-800',
    },
    {
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: 'Core formula',
      title: 'Foam-only baseline (4 ingredients)',
      detail:
        'Eggs + sugar + flour + salt. No chemical leavener, no starch, no fat, no flavoring in the core. Every other ingredient is held in a separate diagnostic or speculative branch until tested.',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      icon: <Target className="h-4 w-4" />,
      label: 'Producer confirmed',
      title: `${corroborated}/${claims.total} claims corroborated`,
      detail:
        'Valera family, Chongoyape origin, wood-fired clay oven — all multiply corroborated across independent source classes (RPP news, directories, social media). Recipe internals remain single-source.',
      color: 'text-primary',
      bg: 'bg-primary/5',
      border: 'border-primary/20',
    },
    {
      icon: <Lightbulb className="h-4 w-4" />,
      label: 'Validation status',
      title: `${validations.pass}/${validations.total} rounds passed (${passRate}%)`,
      detail:
        '6 adversarial lenses applied. Rounds 1-4 and 6 pass; Round 5 (adversarial) raises predicted-but-untested fault modes. Kitchen execution required to convert predicted checks to tested.',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-200 dark:border-amber-800',
    },
    {
      icon: <AlertTriangle className="h-4 w-4" />,
      label: 'Convergence',
      title: convergence.converged ? 'Converged' : 'Not yet converged',
      detail: convergence.reason,
      color: convergence.converged
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-600 dark:text-rose-400',
      bg: convergence.converged
        ? 'bg-emerald-50 dark:bg-emerald-950/20'
        : 'bg-rose-50 dark:bg-rose-950/20',
      border: convergence.converged
        ? 'border-emerald-200 dark:border-emerald-800'
        : 'border-rose-200 dark:border-rose-800',
    },
  ]

  return (
    <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/30 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            Executive Summary
          </CardTitle>
          <Badge variant="outline" className="text-[10px] font-mono bg-primary/5 text-primary border-primary/20">
            5 key findings
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          The entire lab distilled to its essential conclusions. Scroll the page for full evidence, ledgers, and recipes.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {findings.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              className={cn(
                'relative rounded-lg border p-3 flex flex-col gap-2 overflow-hidden',
                f.bg,
                f.border,
              )}
            >
              {/* Top accent line */}
              <div className={cn('absolute top-0 left-0 right-0 h-0.5', f.color.replace('text-', 'bg-'))} />

              <div className="flex items-center gap-1.5">
                <span className={cn('flex-shrink-0', f.color)}>{f.icon}</span>
                <span className={cn('text-[9px] font-semibold uppercase tracking-wider', f.color)}>
                  {f.label}
                </span>
              </div>
              <div className="font-semibold text-[13px] leading-snug">{f.title}</div>
              <div className="text-[11px] text-muted-foreground leading-relaxed flex-1">{f.detail}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick navigation */}
        <div className="mt-4 pt-3 border-t border-primary/20 flex items-center gap-2 flex-wrap text-[11px]">
          <span className="text-muted-foreground font-medium">Jump to:</span>
          {[
            { label: 'Recipe', href: '#recipe-lab' },
            { label: 'Evidence', href: '#evidence' },
            { label: 'Claims', href: '#claims' },
            { label: 'Validation', href: '#validation' },
            { label: 'Verdict', href: '#verdict' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group inline-flex items-center gap-0.5 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              {link.label}
              <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
