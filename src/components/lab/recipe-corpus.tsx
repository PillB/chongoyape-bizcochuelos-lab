'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from './section-header'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookOpen, ArrowRight, Copy, Star, GitBranch } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecipeEntry {
  title: string
  date: string
  location: string
  source: string
  independence: 'independent' | 'derivative' | 'translated' | 'copied'
  ingredients: string
  method: string
  relationship: string
}

const corpus: RecipeEntry[] = [
  {
    title: 'Manual del nuevo dulcero peruano',
    date: '1902',
    location: 'Lima, Peru',
    source: 'Printed cookbook (earliest Peruvian pastry manual)',
    independence: 'independent',
    ingredients: 'Not directly accessed — likely contains bizcochuelo/bizcocho recipes with eggs, sugar, flour',
    method: 'NOT VERIFIED — original text not accessed in this research',
    relationship: 'Potential root source for Peruvian bizcochuelo recipes; predates Valera founding (1920)',
  },
  {
    title: 'Nuevo manual de la cocina peruana',
    date: '1910',
    location: 'Lima, Peru',
    source: 'Printed cookbook',
    independence: 'independent',
    ingredients: 'Not directly accessed',
    method: 'NOT VERIFIED — original text not accessed',
    relationship: 'Second major Peruvian cookbook; may contain bizcochuelo recipes that influenced regional bakers',
  },
  {
    title: 'Pan di Spagna (original)',
    date: '18th century',
    location: 'Madrid, Spain / Genoa, Italy',
    source: 'Historical — created by Genovese chef Giabatta Cabona for Spanish court',
    independence: 'independent',
    ingredients: 'Eggs, sugar, flour (no fat, no leavener originally)',
    method: 'Whole eggs whipped with sugar; flour folded in. Separated-egg variant developed later.',
    relationship: 'Root ancestor of European egg-foam sponge family. Italian migrants brought technique to Peru.',
  },
  {
    title: 'Genoise (French)',
    date: '19th century',
    location: 'France',
    source: 'French pastry tradition',
    independence: 'independent',
    ingredients: 'Eggs, sugar, flour, sometimes butter',
    method: 'Whole eggs warmed with sugar, whipped to ribbon stage, flour folded in',
    relationship: 'Parallel development to Pan di Spagna. Warming technique is in our diagnostic variant.',
  },
  {
    title: 'Bizcochuelo de chuño (El Comercio)',
    date: 'Modern (exact date unknown)',
    location: 'Peru',
    source: 'El Comercio newspaper recipe',
    independence: 'independent',
    ingredients: '6 eggs, 1 cup sugar, 1/2 cup flour, 1/2 cup chuño, 1 tsp baking powder',
    method: 'Separated eggs; chuño mixed with flour; baking powder included',
    relationship: 'Modern Peruvian recipe preserving chuño tradition. DERIVATIVE of earlier Peruvian recipes.',
  },
  {
    title: 'Bizcochuelo esponjoso (Yanuq)',
    date: 'Modern',
    location: 'Peru',
    source: 'Yanuq.com recipe database',
    independence: 'derivative',
    ingredients: '6 eggs separated, 1 cup sugar, 1/2 cup flour, 1/2 cup chuño, 1 tsp baking powder',
    method: 'Separated eggs; same as El Comercio recipe with minor variations',
    relationship: 'COPIED from earlier Peruvian recipes (likely El Comercio or similar). NOT independent evidence.',
  },
  {
    title: 'Bizcochuelo de Todos Santos',
    date: 'Traditional (pre-1950s?)',
    location: 'Peru (national)',
    source: 'Traditional recipe, multiple online sources',
    independence: 'independent',
    ingredients: '30 eggs, 6 cups flour, 1 cup maicena, 3.5 cups sugar',
    method: 'Large-batch traditional recipe with cornstarch',
    relationship: 'Independent traditional recipe showing cornstarch use is Peruvian-wide, not Valera-specific',
  },
  {
    title: 'Valera thesis recipe (studocu.com)',
    date: '~2015 (thesis publication)',
    location: 'Chongoyape, Lambayeque',
    source: 'Master thesis with grandson interview',
    independence: 'independent',
    ingredients: 'harina, azúcar rubia+blanca, huevos, polvo de hornear, chuño, leche de vaca',
    method: 'Method not specified in accessible thesis excerpt. Ingredients only.',
    relationship: 'PRIMARY SOURCE for actual Valera ingredients. Does not give proportions.',
  },
  {
    title: 'Foam-only recipes (Cookpad, YouTube)',
    date: 'Modern',
    location: 'Peru / International',
    source: 'Multiple online recipe platforms',
    independence: 'independent',
    ingredients: 'Eggs, sugar, flour (no baking powder, no starch)',
    method: 'Whole eggs whipped to "punto letra" or ribbon stage',
    relationship: 'Confirms foam-only without leavener is a viable Peruvian technique. Independent of Valera.',
  },
]

const independenceConfig = {
  independent: { label: 'Independent', className: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' },
  derivative: { label: 'Derivative', className: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' },
  translated: { label: 'Translated', className: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800' },
  copied: { label: 'Copied', className: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800' },
}

export function RecipeCorpus() {
  const independentCount = corpus.filter(r => r.independence === 'independent').length
  const derivativeCount = corpus.filter(r => r.independence !== 'independent').length

  return (
    <section id="corpus" className="scroll-mt-20 py-16 sm:py-20 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="—"
          title="Historical Recipe Corpus & Genealogy"
          subtitle="Every relevant recipe catalogued with date, source, independence status, and textual relationship. Dependent recipes are flagged — ten derivative articles do not equal ten independent confirmations."
          icon={<BookOpen className="h-5 w-5 text-primary" />}
        />

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-lg border border-border bg-card/60 p-3 text-center">
            <div className="font-mono text-2xl font-bold text-primary">{corpus.length}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total recipes</div>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/15 dark:border-emerald-900 p-3 text-center">
            <div className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">{independentCount}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Independent</div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 dark:bg-amber-950/15 dark:border-amber-900 p-3 text-center">
            <div className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">{derivativeCount}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Derivative/copied</div>
          </div>
          <div className="rounded-lg border border-border bg-card/60 p-3 text-center">
            <div className="font-mono text-2xl font-bold text-primary">2</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">NOT VERIFIED</div>
          </div>
        </div>

        {/* Recipe genealogy table */}
        <Card className="bg-card/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-primary/5 to-card">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Recipe-text genealogy</h3>
            </div>
            <span className="text-xs font-mono text-muted-foreground">{corpus.length} entries</span>
          </div>
          <ScrollArea className="max-h-[600px] scroll-warm">
            <div className="divide-y divide-border/40">
              {corpus.map((r, idx) => {
                const cfg = independenceConfig[r.independence]
                return (
                  <div key={idx} className={cn('p-4 hover:bg-accent/20 transition-colors', idx % 2 === 1 && 'bg-muted/10')}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{r.date}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">{r.location}</span>
                          <Badge variant="outline" className={cn('text-[9px] font-mono', cfg.className)}>
                            {r.independence === 'independent' ? <Star className="h-2.5 w-2.5 mr-0.5" /> : <Copy className="h-2.5 w-2.5 mr-0.5" />}
                            {cfg.label}
                          </Badge>
                        </div>
                        <div className="font-semibold text-sm leading-snug">{r.title}</div>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-semibold text-muted-foreground">Source: </span>
                        <span className="text-foreground/80">{r.source}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Ingredients: </span>
                        <span className="text-foreground/80">{r.ingredients}</span>
                      </div>
                    </div>
                    <div className="mt-1.5 text-xs">
                      <span className="font-semibold text-muted-foreground">Method: </span>
                      <span className="text-foreground/80">{r.method}</span>
                    </div>
                    <div className="mt-1.5 text-xs flex items-start gap-1.5">
                      <ArrowRight className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/80">{r.relationship}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </Card>

        {/* Copying analysis */}
        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2">
            Copying analysis summary
          </div>
          <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
            <p>• The Yanuq bizcochuelo recipe is a <strong className="text-foreground">copy</strong> of the El Comercio recipe — both use identical ingredient ratios (6 eggs, 1/2 cup flour, 1/2 cup chuño, 1 tsp baking powder). These count as <strong className="text-foreground">1 source, not 2</strong>.</p>
            <p>• The Bizcochuelo de Todos Santos is <strong className="text-foreground">independent</strong> — different proportions and context (religious festival recipe).</p>
            <p>• Pan di Spagna and Genoise are <strong className="text-foreground">independent root sources</strong> — developed separately, same technique family.</p>
            <p>• The Valera thesis is <strong className="text-foreground">primary and independent</strong> — direct grandson interview. No proportions given.</p>
            <p>• The 1902 and 1910 Peruvian manuals are <strong className="text-foreground">NOT VERIFIED — original texts not accessed</strong>. Listed as potential root sources but evidence is inferred from existence, not content review. Do not cite these as supporting evidence for any recipe claim until the relevant pages have been inspected.</p>
          </div>
        </div>

        {/* Defect 6: Migration disclaimer */}
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/50 dark:bg-amber-950/15 dark:border-amber-900 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
            Migration presence ≠ recipe transmission
          </div>
          <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
            <p>• The presence of Italian, Spanish, German, Chinese, Japanese, or other migrant populations in Lambayeque is <strong className="text-foreground">demographic context, not evidence of culinary transmission</strong>.</p>
            <p>• A technique being <em>available</em> in a migrant tradition does not mean it was <em>transmitted</em> to Chongoyape or the Valera family.</p>
            <p>• Similar ingredient ratios between recipes may reflect convergent optimization of the same egg-foam system, not direct copying. Do not infer copying from ratio similarity alone without textual genealogy evidence.</p>
            <p>• The whole-egg foam technique was <strong className="text-foreground">widespread in Peruvian and Spanish colonial baking</strong> before any documented migrant influence. A simpler explanation (Spanish colonial convent tradition) is at least as plausible as any migrant-specific transmission.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
