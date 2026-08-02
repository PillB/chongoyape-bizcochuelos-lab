'use client'

import { useEffect, useState } from 'react'
import { NavBar } from '@/components/lab/nav-bar'
import { Hero } from '@/components/lab/hero'
import { ResearchRounds } from '@/components/lab/research-rounds'
import { EvidenceConsole } from '@/components/lab/evidence-console'
import { ClaimsLedger } from '@/components/lab/claims-ledger'
import { IngredientLedger } from '@/components/lab/ingredient-ledger'
import { TechniqueLedger } from '@/components/lab/technique-ledger'
import { SubstitutionMatrix } from '@/components/lab/substitution-matrix'
import { RecipeLab } from '@/components/lab/recipe-lab'
import { ValidationDashboard } from '@/components/lab/validation-dashboard'
import { ComplexityLog } from '@/components/lab/complexity-log'
import { Verdict } from '@/components/lab/verdict'
import { Footer } from '@/components/lab/footer'
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
      <NavBar />
      <main className="flex-1">
        <Hero data={data} />
        <ResearchRounds rounds={data.research} />
        <EvidenceConsole />
        <ClaimsLedger claims={data.claims} />
        <IngredientLedger ingredients={data.ingredients} />
        <TechniqueLedger techniques={data.techniques} />
        <SubstitutionMatrix substitutions={data.substitutions} />
        <RecipeLab recipes={data.recipes} />
        <ValidationDashboard validations={data.validations} failures={data.failures} />
        <ComplexityLog entries={data.complexity} />
        <Verdict data={data} />
      </main>
      <Footer />
    </div>
  )
}
