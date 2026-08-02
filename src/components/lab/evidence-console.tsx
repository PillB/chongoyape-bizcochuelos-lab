'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectionHeader } from './section-header'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Eye,
  AlertTriangle,
  Globe,
  Image as ImageIcon,
  FileText,
  Check,
  X,
  ExternalLink,
} from 'lucide-react'

const vlmObservations = [
  { label: 'Product form', value: 'Individual round/oval cakes, ~6.5 cm dia × ~3.5 cm tall', contradicts: 'Rectangular slab' },
  { label: 'Count per tray', value: '~4 (2×2 arrangement)', contradicts: '16 (4×4)' },
  { label: 'Top profile', value: 'Distinctly domed/peaked', contradicts: 'Flat' },
  { label: 'Color', value: 'Deep golden-amber to light caramel (Pantone ~7513C–7515C)', contradicts: 'Pale golden' },
  { label: 'Surface texture', value: 'Pebbled / orange-peel with fine craquelure; matte-satin', contradicts: 'n/a' },
  { label: 'Browning', value: 'Concentrated on dome apex; moderately non-uniform', contradicts: 'n/a' },
  { label: 'Sides', value: 'Vertical to slightly bell-shaped; no mushrooming', contradicts: 'n/a' },
  { label: 'Crumb (inferred)', value: 'Dense, uniform; no tunneling visible', contradicts: 'n/a' },
  { label: 'Liners', value: 'None visible', contradicts: 'n/a' },
]

const vlmAbsences = [
  'No filling (jam, cream, dulce de leche)',
  'No icing, frosting, or glaze',
  'No powdered sugar dusting',
  'No seeds, nuts, or fruit',
  'No chocolate',
  'No paper liners',
]

const vlmLabelText = [
  'BIZCOCHUELOS',
  'Valera (blue cursive script)',
  'Únicos / Últimos en el Perú!',
  'Víctor (Tito) Valera — "El Tigre del Sabor"',
  'BISCOTELAS (yellow)',
  'Pedidos: 074-630 433 · 074-433 071 · 978 081 803 · 979 429 440',
  'Panda-chef logo + tiger head motif',
]

const webSources = [
  {
    host: 'RPP Noticias (YouTube)',
    title: 'En Chiclayo conocimos la preparación de bizcochuelos y bizcotelas — familia Valera',
    snippet: 'Video reportaje confirming Valera family production in Chongoyape; references "horno tradicional de barro" and "leña". Independent national-news source.',
    role: 'Primary corroboration',
  },
  {
    host: 'facebook.com (multiple)',
    title: 'Posts referencing horno de barro + leña + Chongoyape',
    snippet: 'Several independent user posts converge on the same wood-fired clay oven claim. Not all derive from a single press release.',
    role: 'Corroboration',
  },
  {
    host: 'es.restaurantguru.com',
    title: 'Bizcochuelos Valera, Chongoyape — 4.6 Google rating',
    snippet: 'Independent directory listing confirms an active retail business in Chongoyape.',
    role: 'Business corroboration',
  },
  {
    host: 'youtube.com (foodies)',
    title: 'Foam-only sponge recipes (no baking powder)',
    snippet: '8 eggs / 245 g sugar / 245 g flour, beat 10 min, 180 °C, 45 min — confirms a foam-only baseline is technically viable and traditional.',
    role: 'Counter-hypothesis support',
  },
  {
    host: 'yanuq.com',
    title: 'Bizcochuelo esponjoso — modern Peruvian home recipe',
    snippet: '6 eggs separated, 1 cup sugar, ½ cup flour, ½ cup chuño, 1 tsp baking powder — the canonical modern Peruvian formula (NOT necessarily the artisanal one).',
    role: 'Recipe context',
  },
  {
    host: 'instagram.com / tiktok.com',
    title: 'Tastings in Chongoyape; chuño vs maicena comparisons',
    snippet: 'Multiple independent social posts; chuño used at ~10% of flour weight in modern recipes.',
    role: 'Ingredient context',
  },
  {
    host: 'web (food science forums)',
    title: 'Wood-oven contributions: thermal vs smoke',
    snippet: 'Popular sources claim BOTH thermal (crust, rise) AND smoke (aroma) contributions. Food science: smoke compounds adsorb primarily to crust; perceptibility after cooling/clamshell storage unverified.',
    role: 'Counter-hypothesis',
  },
]

export function EvidenceConsole() {
  return (
    <section id="evidence" className="scroll-mt-20 py-16 sm:py-20 border-b border-border/60 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="02"
          title="Evidence Console"
          subtitle="Forensic visual analysis of the supplied image (VLM) and the multi-source web research that corroborated or contradicted it. Observations are separated from inferences."
          icon={<Eye className="h-5 w-5 text-primary" />}
        />

        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3 h-auto p-1 rounded-lg border border-border bg-card/60">
            <TabsTrigger value="visual" className="py-2.5 text-xs sm:text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
              <ImageIcon className="h-3.5 w-3.5" />
              <span className="font-medium">Visual</span>
            </TabsTrigger>
            <TabsTrigger value="contradictions" className="py-2.5 text-xs sm:text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="font-medium">Contradictions</span>
            </TabsTrigger>
            <TabsTrigger value="sources" className="py-2.5 text-xs sm:text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
              <Globe className="h-3.5 w-3.5" />
              <span className="font-medium">Sources</span>
            </TabsTrigger>
          </TabsList>

          {/* Visual analysis */}
          <TabsContent value="visual" className="mt-6">
            <div className="grid lg:grid-cols-[420px_1fr] gap-6">
              <Card className="overflow-hidden bg-card">
                <div className="relative aspect-[4/3] bg-muted">
                  <img
                    src="/product/bizcochuelos-valera.jpeg"
                    alt="Bizcochuelos Valera — forensic reference image"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-primary/20" />
                </div>
                <CardContent className="p-4 text-xs text-muted-foreground">
                  Image analysed with VLM (vision-language model). Treated as{' '}
                  <span className="text-primary font-medium">provisional evidence</span>, not verified truth.
                </CardContent>
              </Card>

              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="bg-card/60">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" />
                      Observed characteristics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[440px] px-4 pb-4 scroll-warm">
                      <ul className="space-y-3">
                        {vlmObservations.map((o) => (
                          <li key={o.label} className="text-xs">
                            <div className="font-semibold text-foreground flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                              {o.label}
                            </div>
                            <div className="text-muted-foreground mt-0.5 pl-2.5 leading-relaxed">{o.value}</div>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Card className="bg-card/60">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <X className="h-4 w-4 text-rose-500" />
                        Explicit absences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1.5 text-xs">
                        {vlmAbsences.map((a) => (
                          <li key={a} className="flex items-start gap-1.5 text-muted-foreground">
                            <span className="text-rose-500 mt-0.5">✕</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Label transcription
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1 text-[11px] font-mono text-muted-foreground">
                        {vlmLabelText.map((t) => (
                          <li key={t} className="leading-relaxed">{t}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Contradictions with previous report */}
          <TabsContent value="contradictions" className="mt-6">
            <Card className="bg-card/60">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Contradiction & disconfirmation ledger
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs text-muted-foreground">
                        <th className="py-2 pr-4 font-medium">Dimension</th>
                        <th className="py-2 pr-4 font-medium text-rose-600 dark:text-rose-400">Previous report claim</th>
                        <th className="py-2 pr-4 font-medium text-emerald-600 dark:text-emerald-400">VLM observation</th>
                        <th className="py-2 font-medium">Resolution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vlmObservations.filter((o) => o.contradicts !== 'n/a').map((o) => (
                        <tr key={o.label} className="border-b border-border/50 last:border-0">
                          <td className="py-2.5 pr-4 font-medium align-top">{o.label}</td>
                          <td className="py-2.5 pr-4 align-top text-muted-foreground line-through">{o.contradicts}</td>
                          <td className="py-2.5 pr-4 align-top text-foreground">{o.value}</td>
                          <td className="py-2.5 align-top">
                            <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
                              Downgraded
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                  The previous report&rsquo;s visual description is <strong>contradicted</strong> by direct VLM
                  analysis of the supplied image. All dependent recipe assumptions (rectangular slab,
                  4×4 cut, flat top, pale color) are downgraded. The target is redefined as{' '}
                  <strong>individual round domed cakes, deep golden-amber, pebbled surface</strong>.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Web sources */}
          <TabsContent value="sources" className="mt-6">
            <div className="grid sm:grid-cols-2 gap-3">
              {webSources.map((s) => (
                <Card key={s.host} className="bg-card/60 hover:bg-card transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="font-mono text-[11px] text-primary truncate">{s.host}</div>
                      <Badge variant="outline" className="text-[10px] h-5 flex-shrink-0">{s.role}</Badge>
                    </div>
                    <div className="text-sm font-medium leading-snug mb-1.5">{s.title}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.snippet}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Source classes checked: national news, business directories, social media (Facebook/YouTube/TikTok),
              recipe databases, food-science forums. Dependent repetition was excluded from &ldquo;corroboration&rdquo;.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
