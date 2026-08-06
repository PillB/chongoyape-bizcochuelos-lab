'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SectionHeader } from './section-header'
import {
  ShieldCheck,
  Trophy,
  AlertTriangle,
  Scale,
  Scissors,
  Wrench,
  HelpCircle,
  DoorOpen,
  Target,
} from 'lucide-react'
import type { LabData } from './types'

export function Verdict({ data }: { data: LabData }) {
  const { convergence } = data.stats

  const microReviews = [
    {
      section: 'Historical review',
      strongest: 'Valera family origin in Chongoyape (~1913) and wood-fired clay oven production are multiply corroborated across independent source classes.',
      weakest: 'The exact founding date (1913 vs ~1920) and the founder’s age at start remain single-source.',
      counter: 'A different founder or founding date in municipal records — searched, not found.',
      removed: 'Removed: unsourced genealogical details; repeated "100-year tradition" folklore presented as fact.',
      correction: 'Downgraded founding-precision claim from "confirmed" to "strongly supported".',
      uncertainty: 'Exact founding year; whether Eutemio was 17 in 1913.',
      gate: 'Pass',
    },
    {
      section: 'Visual / target review',
      strongest: 'The photographed product is an individual round domed sponge cake, deep golden-amber, with no filling or icing — directly observed.',
      weakest: 'Crumb cell structure is inferred from side visibility, not measured on a cut cross-section.',
      counter: 'A higher-resolution image showing rectangular pieces or a hidden filling layer — not present.',
      removed: 'Removed: "rectangular 4×4 slab, flat, pale" description from the prior report (contradicted).',
      correction: 'Target redefined as individual round domed cakes (~6.5 cm).',
      uncertainty: 'Exact piece count per retail pack (4 vs 16).',
      gate: 'Pass',
    },
    {
      section: 'Recipe review',
      strongest: 'The core formula (eggs + sugar + flour + salt, foam-only) is the minimum viable sponge and is structurally sufficient.',
      weakest: 'Whether Valera specifically uses chuño, vanilla, or a trace of fat — unresolved, kept out of core.',
      counter: 'A foam-only control that fails to match the target would force a leavener or starch into core.',
      removed: 'Removed from core: baking powder, dual starch blend, hybrid whole+separated method, vanilla+zest together, resting step, 3× sifting.',
      correction: 'Rebuilt from foam-only baseline; every other ingredient demoted to a diagnostic or speculative branch.',
      uncertainty: 'Actual Valera ratios; actual starch/flavoring use.',
      gate: 'Revise — kitchen execution required',
    },
    {
      section: 'Wood-oven interpretation',
      strongest: 'The oven is real (wood-fired clay) and contributes thermally.',
      weakest: 'Whether smoke is perceptible in the finished, clamshell-packaged product — unverified.',
      counter: 'A triangle test (smoked vs unsmoked) showing no perceptible difference.',
      removed: 'Removed: assumption that smoke flavor is present; assumption that algarrobina ≈ wood smoke.',
      correction: 'Smoke is a separate speculative variant (Level 4), tested only after an unsmoked control.',
      uncertainty: 'Smoke perceptibility; appropriate wood species.',
      gate: 'Reopen after triangle test',
    },
  ]

  const remaining = [
    'Execute the foam-only core in a Lima home kitchen and measure rise, color, crumb, and day-two texture against the target image.',
    'Run Diagnostic A (chuño vs cornstarch) and Diagnostic C (foam-only vs low-dose leavener) as paired blind tests.',
    'Run the smoke triangle test (Speculative F) only after the unsmoked control passes Round 3 (target comparison).',
    'Source a second product image or video frame to resolve the 4-vs-16 piece count discrepancy.',
    'Verify DIGESA sanitary-registration status of the brand directly (not inferred from the 48 h rule).',
    'Confirm the current Chiclayo retail address via an independent directory check.',
  ]

  const convergencePct = Math.round(
    (convergence.quietRounds / Math.max(convergence.requiredQuiet, 1)) * 50 +
      (convergence.converged ? 50 : 0),
  )

  return (
    <section id="verdict" className="scroll-mt-20 py-16 sm:py-20 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="11"
          phase="Phase 3 · Final Verdict"
          title="Final Challenge & Parsimony Verdict"
          subtitle="The whole-project adversarial review. Each major section was challenged, simplified, corrected, and re-checked. Convergence requires two consecutive quiet rounds."
          icon={<ShieldCheck className="h-5 w-5 text-primary" />}
        />

        {/* Convergence banner */}
        <Card className={`mb-6 border-2 ${convergence.converged ? 'border-emerald-300 dark:border-emerald-800' : 'border-amber-300 dark:border-amber-800'} bg-card/60`}>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${convergence.converged ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'}`}>
                {convergence.converged ? <Trophy className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-lg">
                    {convergence.converged ? 'Converged' : 'Not yet converged'}
                  </h3>
                  <Badge variant="outline" className="font-mono text-xs">
                    {convergence.quietRounds} / {convergence.requiredQuiet} quiet rounds
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{convergence.reason}</p>
                <Progress value={convergencePct} className="mt-3 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Micro-reviews */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {microReviews.map((r) => (
            <Card key={r.section} className="bg-card/60">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{r.section}</CardTitle>
                  <GateBadge gate={r.gate} />
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2.5 text-xs">
                <ReviewField icon={<Trophy className="h-3.5 w-3.5 text-emerald-500" />} label="Strongest conclusion" value={r.strongest} />
                <ReviewField icon={<AlertTriangle className="h-3.5 w-3.5 text-amber-500" />} label="Weakest claim" value={r.weakest} />
                <ReviewField icon={<Scale className="h-3.5 w-3.5 text-violet-500" />} label="Counter-hypothesis" value={r.counter} />
                <ReviewField icon={<Scissors className="h-3.5 w-3.5 text-rose-500" />} label="Complexity removed" value={r.removed} />
                <ReviewField icon={<Wrench className="h-3.5 w-3.5 text-primary" />} label="Correction made" value={r.correction} />
                <ReviewField icon={<HelpCircle className="h-3.5 w-3.5 text-sky-500" />} label="Remaining uncertainty" value={r.uncertainty} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* End-of-recipe verdict */}
        <Card className="mb-6 bg-primary/5 border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              End-of-recipe verdict
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <VerdictLine label="Selected formula" value="Foam-only core: 240 g whole eggs · 150 g sugar · 150 g AP flour · 1.5 g salt. Whole-egg whip to ribbon stage; 180 °C; ~22-26 min in 7 cm round molds." />
              <VerdictLine label="Confidence" value="Plausible — structurally and historically sound; target-match is predicted, not yet kitchen-verified." />
              <VerdictLine label="Strongest supporting evidence" value="Multiply-corroborated producer profile; canonical foam-only sponge mechanics; VLM-confirmed target form." />
              <VerdictLine label="Largest unresolved uncertainty" value="Whether the foam-only core matches the target color, rise, and crumb without any of the diagnostic additions." />
              <VerdictLine label="Complexity removed" value={'9 elements (see Complexity-Removal Log): baking powder, dual starch, hybrid method, vanilla+zest, smoke+algarrobina confound, 3× sifting, "bake until done", resting step, rectangular-slab assumption.'} />
              <VerdictLine label="Optional variants excluded from core" value="Chuño/cornstarch, separated-egg, low-dose leavener, trace oil, thermal stone simulation, smoke exposure, algarrobina — all held in Level 2-4 branches." />
            </div>
            <div className="pt-3 border-t border-border">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">
                Conditions that would justify another iteration
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A failed foam-only kitchen test (collapse, dense lower layer, or pale color after two controlled
                attempts); a measurable improvement from a diagnostic variant; a new producer disclosure; or a
                second product image that materially changes the target.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Remaining questions */}
        <Card className="bg-card/60">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DoorOpen className="h-4 w-4 text-primary" />
              Remaining research questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {remaining.map((q, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary font-mono text-[11px] font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-foreground/85 leading-relaxed pt-0.5">{q}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function ReviewField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
        {icon}
        {label}
      </div>
      <p className="text-[12px] leading-relaxed text-foreground/85 pl-5">{value}</p>
    </div>
  )
}

function GateBadge({ gate }: { gate: string }) {
  const cfg =
    gate === 'Pass'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
      : gate.startsWith('Reopen')
        ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
        : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
  return (
    <Badge variant="outline" className={`text-[10px] font-mono uppercase tracking-wide ${cfg}`}>
      Gate: {gate}
    </Badge>
  )
}

function VerdictLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card/60 p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">{label}</div>
      <p className="text-xs leading-relaxed text-foreground/85">{value}</p>
    </div>
  )
}
