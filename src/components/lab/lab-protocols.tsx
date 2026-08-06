'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from './section-header'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ClipboardList,
  Thermometer,
  Triangle,
  BookMarked,
  Flame,
  Beaker,
} from 'lucide-react'

export function LabProtocols() {
  return (
    <section id="protocols" className="scroll-mt-20 py-16 sm:py-20 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="—"
          title="Lab Protocols & Annotated Bibliography"
          subtitle="Batch-record templates, sensory-testing protocol, oven/mold adaptation guide, causal dossier, and complete annotated bibliography — the remaining deliverables from the 41-item requirement."
          icon={<ClipboardList className="h-5 w-5 text-primary" />}
        />

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Batch Record Template */}
          <Card className="bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Beaker className="h-4 w-4 text-primary" />
                Batch-Record Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-[11px] text-muted-foreground mb-2">Document for every trial batch:</div>
              <ScrollArea className="max-h-[300px] scroll-warm pr-2">
                <div className="space-y-1.5 text-xs">
                  {[
                    'Hypothesis being tested',
                    'Historical rationale',
                    'Food-science rationale',
                    'Independent variable (single)',
                    'Control formula (reference)',
                    'Fixed variables (all others held constant)',
                    'Ingredient brands + lot numbers',
                    'Ingredient weights (grams, weighed)',
                    'Total egg mass (shelled)',
                    'Ingredient temperatures (°C)',
                    'Mixer model + speed setting',
                    'Whipping time (seconds)',
                    'Foam density (g/mL if measurable)',
                    'Batter density (g/mL if measurable)',
                    'Mold dimensions (diameter × depth)',
                    'Batter mass per mold (g)',
                    'Oven type + verified temperature (thermometer)',
                    'Rack position',
                    'Bake time (minutes)',
                    'Core temperature at removal (°C)',
                    'Cooling method + duration',
                    'Baked weight (g)',
                    'Baking loss (%)',
                    'Height (mm, measured)',
                    'Standardized photograph (top + cross-section)',
                    'Crumb cell description (fine/coarse/tunneling)',
                    'Compression recovery (spring-back %)',
                    'Sensory scores (if applicable)',
                    'Storage conditions',
                    'Result: pass/fail/revise',
                    'Interpretation + next test',
                    'Did result change historical hypothesis?',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-[9px] text-primary/60 mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="text-foreground/80">{item}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Sensory Testing Protocol */}
          <Card className="bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Triangle className="h-4 w-4 text-primary" />
                Sensory-Testing Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">Triangle Test (for perceptible differences)</div>
                <ol className="space-y-1 text-muted-foreground">
                  <li>1. Prepare 3 samples: 2 identical (control), 1 different (variable)</li>
                  <li>2. Code samples with random 3-digit numbers</li>
                  <li>3. Serve at room temperature (~20°C), identical portion size</li>
                  <li>4. Provide water palate cleanser between samples</li>
                  <li>5. Ask: "Which sample is different?"</li>
                  <li>6. Minimum 12 assessors for statistical power</li>
                  <li>7. Chance = 1/3 (33%); significance at p&lt;0.05 requires ≥8/12 correct (one-tailed binomial)</li>
                  <li>8. Randomize serving order across assessors</li>
                  <li>9. Blind: assessors must not know which is the variable</li>
                </ol>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">Descriptive Profiling (for characterization)</div>
                <ol className="space-y-1 text-muted-foreground">
                  <li>1. Define 10-12 attributes: sweetness, egg aroma, smoke, crust flavor, crumb softness, springiness, dryness, cohesiveness, cell size, aftertaste, day-2 quality</li>
                  <li>2. Scale: 0 (absent) to 10 (intense)</li>
                  <li>3. 6-8 trained assessors</li>
                  <li>4. Serve blind-coded samples</li>
                  <li>5. Randomize order; provide palate cleansers</li>
                  <li>6. Score independently (no discussion during evaluation)</li>
                </ol>
              </div>
              <div className="rounded-md border border-amber-200 bg-amber-50/50 dark:bg-amber-950/15 dark:border-amber-900 p-2.5">
                <div className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 mb-0.5">Without authentic reference</div>
                <p className="text-[11px] text-muted-foreground">Results identify the most plausible reconstruction, not exact replication. An authentic Valera sample is needed for definitive comparison.</p>
              </div>
            </CardContent>
          </Card>

          {/* Oven & Mold Adaptation Guide */}
          <Card className="bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" />
                Oven &amp; Mold Adaptation Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="text-[11px] text-muted-foreground mb-2">Adapt the wood-fired clay oven to a Lima home kitchen:</div>
              {[
                { element: 'Oven type', wood: 'Clay dome, wood-fired', home: 'Gas/electric convection oven', adaptation: 'Use baking stone on lower rack for thermal mass' },
                { element: 'Fuel', wood: 'Algarrobo lambayecano wood', home: 'Gas/electric heat', adaptation: 'NOT VERIFIED — thermal-only. Smoke is a separate diagnostic variable.' },
                { element: 'Temperature', wood: '~180-220°C (estimated)', home: '180°C (verified with thermometer)', adaptation: 'Always verify with oven thermometer — dial thermometers are unreliable' },
                { element: 'Bottom heat', wood: 'Strong radiant from clay floor', home: 'Moderate from rack', adaptation: 'Preheat stone 45 min; place molds directly on stone' },
                { element: 'Top heat', wood: 'Moderate radiant from dome', home: 'Standard convection', adaptation: 'If top browns too fast, cover loosely with foil at 20 min' },
                { element: 'Humidity', wood: 'Slightly humid (clay retains moisture)', home: 'Dry (especially Lima coastal)', adaptation: 'Add steam pan or spray oven walls with water at start' },
                { element: 'Mold type', wood: 'Metal or clay individual molds', home: 'Metal ramekins, muffin tin, or pirotas', adaptation: '7 cm diameter × 4 cm deep; grease bottom only, parchment-lined' },
                { element: 'Mold preparation', wood: 'Likely greased', home: 'Grease bottom + parchment; sides ungreased', adaptation: 'Ungreased sides let batter grip and climb for oven spring' },
              ].map((row, idx) => (
                <div key={idx} className="border-b border-border/40 last:border-0 pb-2 last:pb-0">
                  <div className="font-semibold text-foreground text-[12px] mb-0.5">{row.element}</div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div><span className="text-muted-foreground">Wood oven: </span><span className="text-foreground/80">{row.wood}</span></div>
                    <div><span className="text-muted-foreground">Home oven: </span><span className="text-foreground/80">{row.home}</span></div>
                    <div><span className="text-muted-foreground">Adaptation: </span><span className="text-primary">{row.adaptation}</span></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Annotated Bibliography */}
          <Card className="bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookMarked className="h-4 w-4 text-primary" />
                Annotated Bibliography
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[300px] scroll-warm pr-2">
                <div className="space-y-2">
                  {[
                    { source: 'Master thesis (studocu.com)', type: 'Primary', note: 'Interview with Valera grandson. Lists ingredients: harina, azúcar rubia+blanca, huevos, polvo de hornear, chuño, leche de vaca. No proportions. Key source for actual recipe.', date: '~2015' },
                    { source: 'RPP Noticias (YouTube video)', type: 'Primary', note: 'Video reportage of Valera family preparation. Confirms wood oven, family, Chongoyape. Independent.', date: '2022' },
                    { source: 'Facebook/Instagram (Valera account)', type: 'Primary', note: 'Producer social media. Confirms algarrobo wood, address, founding 1920, Eufemio. Citation-dependency: same content across platforms.', date: '2020-2025' },
                    { source: 'Gobierno Regional Lambayeque', type: 'Government', note: 'Regional government source confirming Eufemio Valera as founder. Independent.', date: 'Unknown' },
                    { source: 'Slideshare monograph (Chongoyape)', type: 'Secondary', note: 'District monograph. Says Eutemio/1913 — CONFLICTS with primary sources saying Eufemio/1920. Secondary, lower weight.', date: 'Unknown' },
                    { source: 'DIGESA NORMA DE PANADERIAS', type: 'Regulatory', note: 'Official Peruvian health regulation. Confirms 48h exemption from sanitary registration for bakery products. Independent.', date: 'Current' },
                    { source: 'PMC/MDPI food science papers', type: 'Academic', note: 'Peer-reviewed. Confirms wood-smoke phenols adsorb to baked goods and are perceptible. Supports smoke claim.', date: '2023-2025' },
                    { source: 'Restaurant Guru listing', type: 'Directory', note: 'Business directory. 4.6 rating. Confirms business exists independently.', date: 'Current' },
                    { source: 'VLM forensic image analysis', type: 'Primary', note: 'Vision-language model analysis of supplied product image. Product form, color, shape, packaging. Independent.', date: '2024' },
                    { source: 'Manual del nuevo dulcero peruano', type: 'Historical', note: '1902 Peruvian pastry manual. NOT VERIFIED — original text not accessed. Potential root source for Peruvian bizcochuelo.', date: '1902' },
                    { source: 'Nuevo manual de la cocina peruana', type: 'Historical', note: '1910 Peruvian cookbook. NOT VERIFIED — original text not accessed.', date: '1910' },
                    { source: 'El Comercio recipe (bizcochuelo de chuño)', type: 'Recipe', note: 'Modern Peruvian recipe with chuño. 6 eggs, 1/2 cup flour, 1/2 cup chuño, 1 tsp baking powder. Independent.', date: 'Modern' },
                    { source: 'Yanuq.com recipe', type: 'Recipe', note: 'COPIED from El Comercio recipe. Same proportions. NOT independent evidence.', date: 'Modern' },
                    { source: 'Bizcochuelo de Todos Santos', type: 'Traditional', note: 'Traditional Peruvian recipe with cornstarch. 30 eggs, 6 cups flour, 1 cup maicena. Independent tradition.', date: 'Traditional' },
                    { source: 'Pan di Spagna (historical)', type: 'Historical', note: 'Italian sponge cake. Created 18th century for Spanish court by Genovese chef. Root ancestor of egg-foam family.', date: '18th c.' },
                    { source: '2013 blog post (Las historias están en la realidad)', type: 'Secondary', note: 'Blog confirming founder as Eufemio Valera Santacruz. Independent corroboration.', date: '2013' },
                  ].map((entry, idx) => (
                    <div key={idx} className="border-b border-border/40 last:border-0 pb-2 last:pb-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[9px] text-muted-foreground">{entry.date}</span>
                        <Badge variant="outline" className="text-[8px] h-4 px-1 font-mono">
                          {entry.type}
                        </Badge>
                      </div>
                      <div className="font-medium text-[12px] leading-snug">{entry.source}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{entry.note}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Causal Dossier & Direct Evidence vs Analogy */}
        <div className="mt-4 grid lg:grid-cols-2 gap-4">
          <Card className="bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Causal Dossier — Proposed Cultural Influences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { influence: 'Spanish colonial', evidence: 'Convent sweets, bizcocho tradition since 16th century', level: 'Broad national context', pathway: 'Convents, domestic service, colonial bakeries' },
                { influence: 'Italian (Pan di Spagna)', evidence: 'Italian migrants in Lambayeque from mid-19th c.; Pan di Spagna created 18th c.', level: 'Documented regional presence', pathway: 'Italian bakeries, migrant community, cookbook circulation' },
                { influence: 'French (Genoise)', evidence: 'French pastry technique known but French presence in Lambayeque is limited vs Lima', level: 'Broad national context', pathway: 'NOT VERIFIED — no direct link to Chongoyape' },
                { influence: 'Andean (Chuño)', evidence: 'Chuño is ancient Andean product; trade routes connect Cajamarca to Lambayeque', level: 'Local temporal overlap', pathway: 'Trade routes, market exchange' },
                { influence: 'Japanese (Castella)', evidence: 'Castella similar to Pan di Spagna but Japanese presence in Chongoyape not documented', level: 'NOT VERIFIED', pathway: 'No evidence of Japanese baking in Chongoyape' },
                { influence: 'Chinese (Cantonese)', evidence: 'Chinese laborers on sugar estates but no evidence of sponge-cake technique transmission', level: 'NOT VERIFIED for technique', pathway: 'Sugar estate labor — not baking' },
              ].map((item, idx) => (
                <div key={idx} className="rounded-md border border-border/60 p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[12px]">{item.influence}</span>
                    <Badge variant="outline" className="text-[8px] h-4 px-1 font-mono">{item.level}</Badge>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{item.evidence}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5"><span className="font-medium">Pathway:</span> {item.pathway}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Direct Evidence vs Analogy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b-2 border-border">
                    <tr className="text-left text-[10px] text-muted-foreground uppercase tracking-wider">
                      <th className="py-2 px-2 font-semibold">Claim</th>
                      <th className="py-2 px-2 font-semibold">Direct Evidence</th>
                      <th className="py-2 px-2 font-semibold">Analogy/Inference</th>
                      <th className="py-2 px-2 font-semibold">Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { claim: 'Wood oven', direct: 'RPP video + social posts', analogy: '—', verdict: 'DIRECT' },
                      { claim: 'Algarrobo wood', direct: 'Producer social media (1 source)', analogy: 'Algarrobo is native to Lambayeque', verdict: 'DIRECT (1 source)' },
                      { claim: 'Founder Eufemio/1920', direct: 'Thesis + family social media', analogy: 'Slideshare says Eutemio/1913 (conflict)', verdict: 'DIRECT (conflict documented)' },
                      { claim: 'Chuño in recipe', direct: 'Thesis ingredient list', analogy: 'Chuño is traditional Andean', verdict: 'DIRECT' },
                      { claim: 'Baking powder', direct: 'Thesis ingredient list', analogy: 'Commercially available by 1900s', verdict: 'DIRECT' },
                      { claim: 'Milk in recipe', direct: 'Thesis ingredient list', analogy: '—', verdict: 'DIRECT' },
                      { claim: 'Italian technique ancestry', direct: 'NONE', analogy: 'Italian migrants present; Pan di Spagna similar', verdict: 'ANALOGY ONLY' },
                      { claim: 'Smoke perceptibility', direct: 'Producer claim + food science', analogy: 'Phenol thresholds documented in literature', verdict: 'DIRECT + ANALOGY' },
                      { claim: 'Vanilla in recipe', direct: 'Thesis OMITS vanilla', analogy: 'Common in modern recipes', verdict: 'CONTRADICTED' },
                    ].map((row, idx) => (
                      <tr key={idx} className="border-t border-border/40">
                        <td className="py-1.5 px-2 font-medium">{row.claim}</td>
                        <td className="py-1.5 px-2 text-muted-foreground">{row.direct}</td>
                        <td className="py-1.5 px-2 text-muted-foreground">{row.analogy}</td>
                        <td className="py-1.5 px-2">
                          <span className={
                            row.verdict.startsWith('DIRECT') ? 'text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-medium' :
                            row.verdict === 'ANALOGY ONLY' ? 'text-amber-600 dark:text-amber-400 font-mono text-[10px] font-medium' :
                            row.verdict === 'CONTRADICTED' ? 'text-rose-600 dark:text-rose-400 font-mono text-[10px] font-medium' :
                            'text-muted-foreground font-mono text-[10px]'
                          }>{row.verdict}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
