'use client'

import { motion } from 'framer-motion'
import { Microscope, AlertTriangle, ShieldCheck, GitBranch } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CollapseAllControl } from './collapsible-section'
import { assetUrl } from '@/lib/asset-url'
import type { LabData } from './types'

interface HeroProps {
  data: LabData
}

export function Hero({ data }: HeroProps) {
  const { claims, validations, convergence } = data.stats
  const confirmedPct = Math.round(
    ((claims.confirmed + claims['strongly-supported']) / Math.max(claims.total, 1)) * 100,
  )
  const passPct = Math.round((validations.pass / Math.max(validations.total, 1)) * 100)
  const convergencePct = Math.round(
    (convergence.quietRounds / Math.max(convergence.requiredQuiet, 1)) * 50 +
      (convergence.converged ? 50 : 0),
  )

  return (
    <header className="relative overflow-hidden border-b border-border/60">
      {/* Warm gradient + grid backdrop */}
      <div className="absolute inset-0 paper-grain" aria-hidden />
      <div className="absolute inset-0 bg-grid-warm opacity-60" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start"
        >
          {/* Left: title block */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="flex items-center gap-2 mb-4"
            >
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-mono text-xs">
                Phase 0 · Memory Audit Complete
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                Red → Green → Refactor
              </Badge>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                live
              </span>
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-tight leading-[1.08] [hyphens:none]">
              <span className="block">Chongoyape</span>
              <span className="block">Bizcochuelos</span>
              <span className="block text-primary mt-1">Reverse-Engineering Lab</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl text-balance leading-relaxed">
              An evidence-gated reconstruction of the <em>Bizcochuelos Valera</em> — a wood-fired
              sponge cake from Chongoyape, Lambayeque, Peru. Built from a minimal egg–sugar–flour
              control, validated across six adversarial lenses, and held to a strict parsimony budget.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#recipe-lab"
                className="group inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all hover:gap-3 hover:shadow-lg hover:shadow-primary/25"
              >
                <Microscope className="h-4 w-4 transition-transform group-hover:scale-110" />
                Open the recipe lab
              </a>
              <a
                href="#verdict"
                className="group inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-accent transition-all hover:gap-3"
              >
                <ShieldCheck className="h-4 w-4 transition-transform group-hover:scale-110" />
                Final verdict
              </a>
              <CollapseAllControl className="h-11" />
            </div>

            {/* Status strip */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatusCard
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Claims corroborated"
                value={`${claims.confirmed + claims['strongly-supported']} / ${claims.total}`}
                pct={confirmedPct}
                hint={`${claims.contradicted} contradicted · ${claims.unresolved} unresolved`}
              />
              <StatusCard
                icon={<GitBranch className="h-4 w-4" />}
                label="Validation rounds passed"
                value={`${validations.pass} / ${validations.total}`}
                pct={passPct}
                hint={`${validations.revise} revise · ${validations.reopen} reopen`}
              />
              <StatusCard
                icon={<AlertTriangle className="h-4 w-4" />}
                label="Convergence"
                value={`${convergence.quietRounds} / ${convergence.requiredQuiet} quiet rounds`}
                pct={convergencePct}
                hint={convergence.converged ? 'Converged' : 'Not yet converged'}
                warning={!convergence.converged}
              />
            </div>
          </div>

          {/* Right: product image card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full lg:w-[380px] flex-shrink-0"
          >
            <figure className="rounded-xl overflow-hidden border border-border bg-card shadow-sm">
              <div className="relative aspect-[4/3] bg-muted">
                <img
                  src={assetUrl('/product/bizcochuelos-valera.jpeg')}
                  alt="Bizcochuelos Valera product — individual round golden-amber sponge cakes in a clear clamshell tray"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-background/90 text-foreground border-border backdrop-blur font-mono text-xs">
                    Primary evidence
                  </Badge>
                </div>
              </div>
              <figcaption className="p-4 text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">VLM forensic read:</span>{' '}
                individual round domed cakes (~6.5 cm), deep golden-amber, pebbled matte surface,
                no filling/icing/liners. <span className="text-primary">Contradicts</span> the prior
                report&rsquo;s &ldquo;rectangular 4×4 slab, flat, pale&rdquo; description.
              </figcaption>
            </figure>
          </motion.div>
        </motion.div>
      </div>
    </header>
  )
}

function StatusCard({
  icon,
  label,
  value,
  pct,
  hint,
  warning,
}: {
  icon: React.ReactNode
  label: string
  value: string
  pct: number
  hint: string
  warning?: boolean
}) {
  return (
    <div className="rounded-lg border border-border bg-card/60 backdrop-blur p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className={warning ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}>{icon}</span>
        <span className="font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-1.5 text-lg font-semibold font-mono">{value}</div>
      <Progress value={pct} className="mt-2 h-1.5" />
      <div className="mt-1.5 text-[11px] text-muted-foreground">{hint}</div>
    </div>
  )
}
