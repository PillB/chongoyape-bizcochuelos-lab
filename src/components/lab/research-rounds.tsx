'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SectionHeader } from './section-header'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookOpen, ChevronRight, Search, Scale, FlaskRound, Layers, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ResearchRound } from './types'

const kindIcon: Record<string, React.ReactNode> = {
  memory: <BookOpen className="h-4 w-4" />,
  primary: <Search className="h-4 w-4" />,
  corroboration: <Scale className="h-4 w-4" />,
  counter: <ChevronRight className="h-4 w-4" />,
  ingredient: <FlaskRound className="h-4 w-4" />,
  synthesis: <Layers className="h-4 w-4" />,
}

const kindAccent: Record<string, string> = {
  memory: 'bg-violet-400',
  primary: 'bg-primary',
  corroboration: 'bg-emerald-400',
  counter: 'bg-rose-400',
  ingredient: 'bg-amber-400',
  synthesis: 'bg-teal-400',
}

export function ResearchRounds({ rounds }: { rounds: ResearchRound[] }) {
  return (
    <section id="memory" className="scroll-mt-20 py-16 sm:py-20 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="01"
          phase="Phase 0 · Pre-Research"
          title="Pre-Research Protocol — Memory & Multi-Round Audit"
          subtitle="Six bounded research rounds executed before any recipe decision. Each round states findings, what strengthened or weakened the hypothesis, contradictions, decisions changed, and whether another round is justified."
          icon={<BookOpen className="h-5 w-5 text-primary" />}
        />

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div>
            <Accordion type="single" collapsible defaultValue={`round-${rounds[0]?.id}`} className="space-y-3">
              {rounds.map((r, idx) => (
                <AccordionItem
                  key={r.id}
                  value={`round-${r.id}`}
                  className="border border-border rounded-lg overflow-hidden bg-card/60 hover:shadow-sm transition-shadow relative"
                >
                  {/* Left accent bar — color by kind */}
                  <div className={cn('absolute left-0 top-0 bottom-0 w-1', kindAccent[r.kind] ?? 'bg-primary/40')} />
                  <AccordionTrigger className="px-4 py-3.5 pl-5 hover:bg-accent/40 hover:no-underline group">
                    <div className="flex items-center gap-3 text-left flex-1 min-w-0">
                      {/* Round number badge */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-mono font-bold text-sm tabular-nums">
                        R{r.round}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            {r.kind}
                          </span>
                          {r.continueResearch ? (
                            <Badge variant="outline" className="text-[10px] h-5 bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800">
                              continued
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] h-5 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                              stopped
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm font-medium mt-0.5 truncate">{r.phase}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-1 pl-5">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="grid sm:grid-cols-2 gap-3 text-sm"
                    >
                      <Field label="Findings" value={r.findings} />
                      <Field label="Strengthened" value={r.strengthened} tone="emerald" />
                      <Field label="Weakened" value={r.weakened} tone="amber" />
                      <Field label="Contradictions" value={r.contradictions} tone="rose" />
                      <Field label="Decisions changed" value={r.decisionsChanged} tone="violet" />
                      <Field label="Unresolved" value={r.unresolved} tone="sky" />
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Side: stopping rule */}
          <div className="lg:sticky lg:top-20 lg:self-start space-y-4">
            <Card className="bg-card/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Stopping rule
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-muted-foreground">
                <p>
                  A pre-research sequence stops when decision-relevant evidence is located, major
                  source classes are checked, a counter-hypothesis round is complete, and another
                  round is unlikely to change the next action.
                </p>
                <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs">
                  <Stat label="Rounds run" value={`${rounds.length}`} />
                  <Stat label="Counter-hypothesis" value="1" />
                  <Stat label="Source classes" value="5+" />
                  <Stat label="Material contradictions" value="4" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50/60 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-amber-900 dark:text-amber-200">
                  Honesty note
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                Kitchen validation rounds are documented as <strong>predicted results</strong> with
                explicit acceptance criteria — they have not been executed in this environment.
                Every predicted check is labelled as such.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  tone = 'slate',
}: {
  label: string
  value: string
  tone?: 'slate' | 'emerald' | 'amber' | 'rose' | 'violet' | 'sky'
}) {
  const toneClass = {
    slate: 'border-border bg-muted/40',
    emerald: 'border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/20 dark:border-emerald-900',
    amber: 'border-amber-200 bg-amber-50/60 dark:bg-amber-950/20 dark:border-amber-900',
    rose: 'border-rose-200 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900',
    violet: 'border-violet-200 bg-violet-50/60 dark:bg-violet-950/20 dark:border-violet-900',
    sky: 'border-sky-200 bg-sky-50/60 dark:bg-sky-950/20 dark:border-sky-900',
  }[tone]
  return (
    <div className={`rounded-md border p-3 ${toneClass}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </div>
      <div className="text-[13px] leading-relaxed">{value}</div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/50 p-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-mono font-semibold mt-0.5">{value}</div>
    </div>
  )
}
