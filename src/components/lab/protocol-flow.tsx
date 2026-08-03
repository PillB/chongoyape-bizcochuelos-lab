'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertCircle,
  CheckCircle2,
  Scissors,
  ShieldCheck,
  Target,
  RefreshCw,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FlowStep {
  phase: string
  label: string
  description: string
  icon: React.ReactNode
  color: string
  bg: string
  border: string
}

const steps: FlowStep[] = [
  {
    phase: 'Red',
    label: 'Define failure tests',
    description: 'List every way the claim, ingredient, or recipe could be wrong before formulation.',
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800',
  },
  {
    phase: 'Green',
    label: 'Build minimal solution',
    description: 'Select the smallest historically & technically plausible formula that satisfies the evidence.',
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  {
    phase: 'Refactor',
    label: 'Remove complexity',
    description: 'Strip unnecessary ingredients, techniques, and steps without reducing fidelity or safety.',
    icon: <Scissors className="h-4 w-4" />,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
  },
  {
    phase: 'Validate',
    label: 'Test against evidence',
    description: 'Compare against independent sources, food science, the image, and explicit acceptance criteria.',
    icon: <ShieldCheck className="h-4 w-4" />,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-800',
  },
  {
    phase: 'Converge',
    label: 'Two quiet rounds',
    description: 'Stop only after two consecutive rounds produce no new critical defect and no justified simplification.',
    icon: <Target className="h-4 w-4" />,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/30',
  },
]

export function ProtocolFlow() {
  return (
    <section className="py-12 sm:py-16 border-b border-border/60 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <RefreshCw className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            The governing sequence
          </h2>
        </div>

        {/* Horizontal flow on desktop, vertical on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-2 relative">
          {steps.map((step, idx) => (
            <div key={step.phase} className="relative">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="h-full"
              >
                <Card className={cn('h-full bg-card/60 border-t-2 transition-all hover:shadow-md hover:-translate-y-0.5', step.border)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shadow-sm', step.bg, step.color)}>
                        {step.icon}
                      </div>
                      <div>
                        <div className={cn('text-[10px] font-mono uppercase tracking-wider font-bold', step.color)}>
                          {step.phase}
                        </div>
                        <div className="text-xs font-semibold leading-tight">{step.label}</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Arrow connector (desktop only) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-2.5 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-primary text-primary-foreground border-2 border-background items-center justify-center shadow-md">
                  <ArrowRight className="h-2.5 w-2.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Loop indicator */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="h-3 w-3" />
          <span>
            Loop repeats until <strong className="text-foreground">two consecutive quiet rounds</strong> —
            max 4 substantive research rounds per question.
          </span>
        </div>
      </div>
    </section>
  )
}
