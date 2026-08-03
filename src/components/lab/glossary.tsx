'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, BookMarked, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface GlossaryEntry {
  term: string
  definition: string
}

export const glossary: Record<string, GlossaryEntry> = {
  'punto cinta': {
    term: 'punto cinta',
    definition:
      'Spanish for "ribbon stage". The egg–sugar foam has been whipped long enough that a trail of batter falling back on itself holds a visible ribbon shape for ~3 seconds before settling. Indicates sufficient air incorporation and foam stabilization.',
  },
  'chuño': {
    term: 'chuño',
    definition:
      'Freeze-dried potato starch, traditional to the Andes. Potatoes are exposed to freezing nights and strong sun, repeatedly, until the starch is concentrated and dried. In baking it tenderizes crumb by diluting wheat gluten. Also called "fécula de papa".',
  },
  'maicena': {
    term: 'maicena',
    definition:
      'Cornstarch (corn flour in UK English). A common supermarket starch in Peru. Gelatinizes at a lower temperature than potato starch, giving a slightly softer, shorter crumb.',
  },
  'maillard': {
    term: 'Maillard',
    definition:
      'A non-enzymatic browning reaction between amino acids and reducing sugars, occurring above ~140°C. Produces the golden-amber crust color and roasted aroma on the cake surface. Distinct from caramelization (sugar-only browning).',
  },
  "baker's percent": {
    term: "baker's percent",
    definition:
      'A bakery convention where every ingredient is expressed as a percentage of the flour weight (or, for foam sponges, sometimes the egg weight). Allows scaling without ratio drift. Here we use egg weight as the 100% reference.',
  },
  'algarrobina': {
    term: 'algarrobina',
    definition:
      'A dark syrup made from the pods of the algarrobo (carob) tree, traditional to northern Peru. Adds color and a molasses-like, slightly earthy flavor. NOT the same as algarrobo wood smoke — syrup flavor ≠ combustion aroma.',
  },
  'bizcotela': {
    term: 'bizcotela',
    definition:
      'A related but distinct Valera product: alfajor-style sandwich of two sponge layers with manjar blanco (dulce de leche) filling. The bizcochuelo is the plain, unfilled sponge — the target of this lab.',
  },
  'manjar blanco': {
    term: 'manjar blanco',
    definition:
      'Peruvian dulce de leche — milk and sugar slowly cooked to a thick, caramel-colored spread. Used as filling in bizcotelas and alfajores.',
  },
  'horno de barro': {
    term: 'horno de barro',
    definition:
      'A traditional wood-fired clay oven. High thermal mass from the clay dome and floor provides steady radiant heat; combustion of leña (firewood) may also impart smoke compounds to the crust. Whether the smoke is perceptible in the finished product is unverified.',
  },
  'ribbon stage': {
    term: 'ribbon stage',
    definition:
      'See "punto cinta". The foam has tripled in volume and a dribbled trail holds for ~3 seconds.',
  },
  'foam-only': {
    term: 'foam-only',
    definition:
      'A sponge leavened entirely by air trapped in whipped eggs — no chemical leavener (baking powder/baking soda). The canonical method for traditional bizcochuelo.',
  },
  'oven spring': {
    term: 'oven spring',
    definition:
      'The rapid initial expansion of batter when it enters the oven, driven by thermal expansion of trapped air bubbles and steam. A good spring indicates a stable, well-aerated foam.',
  },
  'triangle test': {
    term: 'triangle test',
    definition:
      'A sensory test where tasters receive three samples (two identical, one different) and must identify the odd one. Chance performance is 33%; significantly higher detection indicates a perceptible difference.',
  },
  'digesa': {
    term: 'DIGESA',
    definition:
      'Dirección General de Salud Ambiental — the Peruvian health authority. Short-shelf-life artisanal bakery items (≤48 h, unpreserved) are generally exempt from sanitary registration.',
  },
  'convergence': {
    term: 'convergence',
    definition:
      'The protocol requires two consecutive "quiet" validation rounds (no new critical defect, no justified simplification) before the study is considered converged. Until then, findings remain provisional.',
  },
}

interface GlossaryTooltipProps {
  term: keyof typeof glossary | string
  children?: React.ReactNode
  className?: string
}

export function GlossaryTooltip({ term, children, className }: GlossaryTooltipProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const entry = glossary[term.toLowerCase()]

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (!entry) return <>{children ?? term}</>

  return (
    <span
      ref={ref}
      className={cn('relative inline-flex items-center', className)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        className="inline-flex items-center gap-0.5 text-primary underline decoration-primary/40 decoration-dotted underline-offset-2 hover:decoration-primary transition-colors"
      >
        {children ?? term}
        <HelpCircle className="h-3 w-3 opacity-60" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-72 max-w-[80vw] rounded-lg border border-border bg-popover shadow-lg p-3 text-left"
          >
            <span className="block font-semibold text-xs text-primary mb-1 capitalize">
              {entry.term}
            </span>
            <span className="block text-[11px] leading-relaxed text-muted-foreground">
              {entry.definition}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

// A standalone glossary card listing all terms
export function GlossaryCard() {
  const [query, setQuery] = useState('')
  const terms = Object.values(glossary).filter(
    (e) =>
      e.term.toLowerCase().includes(query.toLowerCase()) ||
      e.definition.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <Card className="bg-card/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BookMarked className="h-4 w-4 text-primary" />
            Glossary
          </CardTitle>
          <Badge variant="outline" className="text-[10px] font-mono">
            {Object.keys(glossary).length} terms
          </Badge>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms…"
            className="h-8 pl-8 text-xs"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="max-h-[340px]">
          <dl className="space-y-2.5 pr-2">
            {terms.map((e) => (
              <div key={e.term} className="border-b border-border/40 last:border-0 pb-2 last:pb-0">
                <dt className="font-semibold text-xs text-primary capitalize">{e.term}</dt>
                <dd className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                  {e.definition}
                </dd>
              </div>
            ))}
            {terms.length === 0 && (
              <div className="text-xs text-muted-foreground text-center py-4">
                No terms match &ldquo;{query}&rdquo;.
              </div>
            )}
          </dl>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Renders text with any glossary terms automatically wrapped in tooltips.
// Case-insensitive matching, whole-word only.
export function GlossaryText({ children, className }: { children: string; className?: string }) {
  // Build a regex from all glossary terms (sorted by length desc to match longer terms first)
  const terms = Object.keys(glossary).sort((a, b) => b.length - a.length)
  if (terms.length === 0) return <span className={className}>{children}</span>

  const pattern = new RegExp(
    `\\b(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'gi',
  )

  const parts = children.split(pattern)
  return (
    <span className={className}>
      {parts.map((part, idx) => {
        const key = part.toLowerCase()
        if (glossary[key]) {
          return <GlossaryTooltip key={idx} term={key}>{part}</GlossaryTooltip>
        }
        return <span key={idx}>{part}</span>
      })}
    </span>
  )
}
