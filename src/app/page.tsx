'use client'

import { useEffect, useState } from 'react'
import { NavBar } from '@/components/lab/nav-bar'
import { Hero } from '@/components/lab/hero'
import { ResearchRounds } from '@/components/lab/research-rounds'
import { EvidenceConsole } from '@/components/lab/evidence-console'
import { ClaimsLedger } from '@/components/lab/claims-ledger'
import { ClaimsChart } from '@/components/lab/claims-chart'
import { IngredientLedger } from '@/components/lab/ingredient-ledger'
import { TechniqueLedger } from '@/components/lab/technique-ledger'
import { SubstitutionMatrix } from '@/components/lab/substitution-matrix'
import { RecipeLab } from '@/components/lab/recipe-lab'
import { RecipeScaler } from '@/components/lab/recipe-scaler'
import { RecipeComparison } from '@/components/lab/recipe-comparison'
import { IngredientBreakdown } from '@/components/lab/ingredient-breakdown'
import { RecipeSandbox } from '@/components/lab/recipe-sandbox'
import { ValidationDashboard } from '@/components/lab/validation-dashboard'
import { ValidationRadar } from '@/components/lab/validation-radar'
import { ComplexityLog } from '@/components/lab/complexity-log'
import { Verdict } from '@/components/lab/verdict'
import { Footer } from '@/components/lab/footer'
import { ReadingProgress } from '@/components/lab/reading-progress'
import { BackToTop } from '@/components/lab/back-to-top'
import { SectionReveal } from '@/components/lab/section-reveal'
import { ProtocolFlow } from '@/components/lab/protocol-flow'
import { LabStatsBand } from '@/components/lab/lab-stats-band'
import { GlossaryCard } from '@/components/lab/glossary'
import { Skeleton } from '@/components/ui/skeleton'
import { FlaskConical } from 'lucide-react'
import type { LabData } from '@/components/lab/types'

export default function Page() {
  const [data, setData] = useState<LabData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/lab')
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<LabData>
      })
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message ?? 'Failed to load lab data')
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <ReadingProgress />
        <NavBar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-rose-600 dark:text-rose-400 font-mono text-sm mb-2">
              LAB DATA LOAD ERROR
            </div>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <ReadingProgress />
        <NavBar />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <FlaskConical className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <div>
                <div className="font-semibold">Initialising lab…</div>
                <div className="text-xs text-muted-foreground font-mono">loading evidence, ledgers, and recipes</div>
              </div>
            </div>
            <Skeleton className="h-[420px] w-full rounded-xl" />
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:text-sm focus:shadow-lg"
      >
        Skip to content
      </a>
      <ReadingProgress />
      <NavBar recipes={data.recipes} ingredients={data.ingredients} />
      <BackToTop />
      <main id="main-content" className="flex-1">
        <Hero data={data} />

        <LabStatsBand
          stats={{
            claims: data.claims.length,
            ingredients: data.ingredients.length,
            techniques: data.techniques.length,
            recipes: data.recipes.length,
            validations: data.validations.length,
            complexityRemoved: data.complexity.length,
          }}
        />

        <ProtocolFlow />

        <SectionReveal>
          <ResearchRounds rounds={data.research} />
        </SectionReveal>

        <SectionReveal>
          <EvidenceConsole />
        </SectionReveal>

        {/* Claims ledger with chart sidebar */}
        <SectionReveal>
          <ClaimsLedger
            claims={data.claims}
            sidebar={
              <>
                <ClaimsChart data={data} />
                <div className="rounded-lg border border-border bg-card/60 p-4 text-xs leading-relaxed text-muted-foreground">
                  <div className="font-semibold text-foreground mb-1.5">How to read this chart</div>
                  The donut shows the confidence distribution of all {data.stats.claims.total} claims.
                  &ldquo;Corroborated&rdquo; = confirmed + strongly supported. A claim is downgraded
                  whenever the evidence cannot support its original precision.
                </div>
              </>
            }
          />
        </SectionReveal>

        <SectionReveal>
          <IngredientLedger ingredients={data.ingredients} />
        </SectionReveal>

        <SectionReveal>
          <TechniqueLedger techniques={data.techniques} />
        </SectionReveal>

        <SectionReveal>
          <SubstitutionMatrix substitutions={data.substitutions} />
        </SectionReveal>

        {/* Recipe lab with scaler + comparison + breakdown + glossary */}
        <SectionReveal>
          <section id="recipe-lab" className="scroll-mt-20 py-16 sm:py-20 border-b border-border/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <RecipeLab recipes={data.recipes} />
              <div className="mt-6">
                <RecipeComparison recipes={data.recipes} />
              </div>
              <div className="mt-6 grid lg:grid-cols-2 gap-4 items-start">
                <RecipeScaler />
                <IngredientBreakdown recipes={data.recipes} />
              </div>
              <div className="mt-6">
                <RecipeSandbox />
              </div>
              <div className="mt-6">
                <GlossaryCard />
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* Validation dashboard with radar + convergence */}
        <SectionReveal>
          <ValidationDashboard
            validations={data.validations}
            failures={data.failures}
            overview={
              <>
                <ValidationRadar validations={data.validations} />
                <ConvergenceCard data={data} />
              </>
            }
          />
        </SectionReveal>

        <SectionReveal>
          <ComplexityLog entries={data.complexity} />
        </SectionReveal>

        <SectionReveal>
          <Verdict data={data} />
        </SectionReveal>
      </main>
      <Footer />
    </div>
  )
}

function ConvergenceCard({ data }: { data: LabData }) {
  const { convergence } = data.stats
  const pct = Math.round(
    (convergence.quietRounds / Math.max(convergence.requiredQuiet, 1)) * 50 +
      (convergence.converged ? 50 : 0),
  )
  return (
    <div className="rounded-xl border-2 border-amber-300 dark:border-amber-800 bg-card/60 p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        Convergence tracker
      </div>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-bold font-mono">{convergence.quietRounds}</span>
        <span className="text-sm text-muted-foreground">/ {convergence.requiredQuiet} quiet rounds</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden mb-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{convergence.reason}</p>
      <div className="mt-3 pt-3 border-t border-border text-[11px] text-muted-foreground">
        Two consecutive quiet rounds are required to converge.
      </div>
    </div>
  )
}
