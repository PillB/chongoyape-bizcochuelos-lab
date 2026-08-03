'use client'

import { useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import {
  BookOpen,
  Eye,
  ScrollText,
  Beaker,
  Wrench,
  ArrowLeftRight,
  FlaskConical,
  ClipboardCheck,
  AlertOctagon,
  Scissors,
  ShieldCheck,
  Search,
  Calculator,
  Type,
  ArrowUp,
  Cake,
} from 'lucide-react'
import type { RecipeVariant, Ingredient } from './types'

interface CommandAction {
  id: string
  label: string
  hint?: string
  icon: React.ReactNode
  group: string
  action: () => void
  keywords?: string
}

interface CommandPaletteProps {
  recipes?: RecipeVariant[]
  ingredients?: Ingredient[]
}

export function CommandPalette({ recipes, ingredients }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setOpen(false)
  }

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setOpen(false)
  }

  // Dispatch a custom event to select a recipe variant
  const selectRecipe = (id: string) => {
    scrollTo('recipe-lab')
    // Dispatch event after scroll starts
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('select-recipe', { detail: id }))
    }, 100)
  }

  const sectionActions: CommandAction[] = [
    { id: 'top', label: 'Scroll to top', icon: <ArrowUp className="h-4 w-4" />, group: 'Navigation', action: scrollTop },
    { id: 'memory', label: '01 · Memory Audit', hint: 'Pre-research rounds', icon: <BookOpen className="h-4 w-4" />, group: 'Sections', action: () => scrollTo('memory'), keywords: 'research protocol memory audit' },
    { id: 'evidence', label: '02 · Evidence Console', hint: 'VLM forensic analysis', icon: <Eye className="h-4 w-4" />, group: 'Sections', action: () => scrollTo('evidence'), keywords: 'vlm image visual contradictions sources' },
    { id: 'claims', label: '03 · Claims Ledger', hint: '15 claims, confidence-rated', icon: <ScrollText className="h-4 w-4" />, group: 'Sections', action: () => scrollTo('claims'), keywords: 'claims confidence corroborated contradicted' },
    { id: 'ingredients', label: '04 · Ingredients', hint: '12 ingredients, 4 tiers', icon: <Beaker className="h-4 w-4" />, group: 'Sections', action: () => scrollTo('ingredients'), keywords: 'ingredients chuño flour eggs sugar starch' },
    { id: 'techniques', label: '05 · Techniques', hint: '16 techniques', icon: <Wrench className="h-4 w-4" />, group: 'Sections', action: () => scrollTo('techniques'), keywords: 'techniques whipping folding baking ribbon' },
    { id: 'substitutions', label: '06 · Substitutions', hint: '8 substitutions', icon: <ArrowLeftRight className="h-4 w-4" />, group: 'Sections', action: () => scrollTo('substitutions'), keywords: 'substitutions cornstarch chuño cake flour' },
    { id: 'recipe-lab', label: '07 · Recipe Lab', hint: '4-level hierarchy, 9 variants', icon: <FlaskConical className="h-4 w-4" />, group: 'Sections', action: () => scrollTo('recipe-lab'), keywords: 'recipe lab core diagnostic speculative scaler' },
    { id: 'validation', label: '08 · Validation', hint: '6 lenses, radar chart', icon: <ClipboardCheck className="h-4 w-4" />, group: 'Sections', action: () => scrollTo('validation'), keywords: 'validation radar convergence rounds' },
    { id: 'failures', label: '09 · Failure Tests', hint: '14 failure modes', icon: <AlertOctagon className="h-4 w-4" />, group: 'Sections', action: () => scrollTo('failures'), keywords: 'failure tests collapse gummy dense' },
    { id: 'complexity', label: '10 · Complexity Log', hint: '9 elements removed', icon: <Scissors className="h-4 w-4" />, group: 'Sections', action: () => scrollTo('complexity'), keywords: 'complexity removed simplified parsimony' },
    { id: 'verdict', label: '11 · Final Verdict', hint: 'Challenge & parsimony', icon: <ShieldCheck className="h-4 w-4" />, group: 'Sections', action: () => scrollTo('verdict'), keywords: 'verdict final convergence challenge parsimony' },
  ]

  const recipeActions: CommandAction[] = (recipes ?? []).map((r) => ({
    id: r.id,
    label: r.name,
    hint: `L${r.level} · ${r.yieldNote.split('.')[0]}`,
    icon: <Cake className="h-4 w-4" />,
    group: 'Recipes',
    action: () => selectRecipe(r.id),
    keywords: r.summary + ' ' + (r.mainVariable ?? '') + ' ' + (r.question ?? ''),
  }))

  const ingredientActions: CommandAction[] = (ingredients ?? []).map((i) => ({
    id: i.id,
    label: i.name,
    hint: `${i.grams > 0 ? `${i.grams}g · ` : ''}${i.tier}`,
    icon: <Beaker className="h-4 w-4" />,
    group: 'Ingredients',
    action: () => scrollTo('ingredients'),
    keywords: i.function + ' ' + i.evidence + ' ' + i.substitution,
  }))

  const allActions = [...sectionActions, ...recipeActions, ...ingredientActions]

  // Group actions
  const grouped: Record<string, CommandAction[]> = {}
  allActions.forEach((a) => {
    if (!grouped[a.group]) grouped[a.group] = []
    grouped[a.group].push(a)
  })

  const groupOrder = ['Navigation', 'Sections', 'Recipes', 'Ingredients']

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:inline-flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-card/60 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search…</span>
        <kbd className="ml-1 inline-flex h-4 items-center gap-0.5 rounded border border-border bg-muted px-1 font-mono text-[9px] font-medium">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search sections, recipes, ingredients…" />
        <CommandList className="max-h-[420px]">
          <CommandEmpty>No results found.</CommandEmpty>
          {groupOrder
            .filter((g) => grouped[g]?.length > 0)
            .map((group) => (
              <CommandGroup key={group} heading={group}>
                {grouped[group].map((a) => (
                  <CommandItem
                    key={a.id}
                    value={`${a.label} ${a.hint ?? ''} ${a.keywords ?? ''}`}
                    onSelect={() => a.action()}
                    className="cursor-pointer"
                  >
                    <span className="text-primary mr-2">{a.icon}</span>
                    <span className="flex-1 min-w-0">
                      <span className="font-medium truncate block">{a.label}</span>
                      {a.hint && (
                        <span className="ml-0 text-xs text-muted-foreground truncate block">{a.hint}</span>
                      )}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          <CommandSeparator />
          <CommandGroup heading="Tips">
            <div className="px-2 py-3 text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <Calculator className="h-3.5 w-3.5 text-primary" />
                <span>Use the <strong>Recipe Scaler</strong> in section 07 to scale the core formula to any batch size.</span>
              </div>
              <div className="flex items-center gap-2">
                <Type className="h-3.5 w-3.5 text-primary" />
                <span>Hover technical terms (punto cinta, chuño, Maillard) for definitions.</span>
              </div>
            </div>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
