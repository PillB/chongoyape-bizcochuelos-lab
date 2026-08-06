'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { FlaskConical, Menu, X } from 'lucide-react'
import { CommandPalette } from './command-palette'
import { ThemeToggle } from './theme-toggle'
import type { RecipeVariant, Ingredient } from './types'

interface NavBarProps {
  recipes?: RecipeVariant[]
  ingredients?: Ingredient[]
}

const sections = [
  { id: 'memory', label: '01 · Memory Audit' },
  { id: 'evidence', label: '02 · Evidence' },
  { id: 'claims', label: '03 · Claims' },
  { id: 'ingredients', label: '04 · Ingredients' },
  { id: 'techniques', label: '05 · Techniques' },
  { id: 'substitutions', label: '06 · Substitutions' },
  { id: 'recipe-lab', label: '07 · Recipe Lab' },
  { id: 'validation', label: '08 · Validation' },
  { id: 'failures', label: '09 · Failure Tests' },
  { id: 'complexity', label: '10 · Complexity Log' },
  { id: 'verdict', label: '11 · Verdict' },
]

export function NavBar({ recipes, ingredients }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>('memory')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleClick = (id: string) => {
    setOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-colors overflow-x-hidden',
        scrolled
          ? 'bg-background/85 backdrop-blur-md border-border'
          : 'bg-background/40 backdrop-blur-sm border-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          <button
            onClick={() => handleClick('memory')}
            className="flex items-center gap-2 font-semibold text-sm tracking-tight flex-shrink-0"
          >
            <FlaskConical className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Bizcochuelos Lab</span>
            <span className="sm:hidden">Lab</span>
            <span className="ml-1 text-[10px] font-mono text-muted-foreground hidden md:inline">
              v0.1 · Phase 0
            </span>
          </button>

          {/* Desktop nav — scrolls internally if buttons overflow available width */}
          <nav className="hidden lg:flex items-center gap-1 text-xs min-w-0 flex-1 justify-center overflow-x-auto scroll-warm py-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => handleClick(s.id)}
                className={cn(
                  'px-2.5 py-1.5 rounded-md font-mono transition-colors whitespace-nowrap flex-shrink-0',
                  active === s.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
                )}
              >
                {s.label}
              </button>
            ))}
          </nav>

          {/* Command palette trigger + theme toggle */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <CommandPalette recipes={recipes} ingredients={ingredients} />
            <ThemeToggle />
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-border flex-shrink-0"
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-1.5">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => handleClick(s.id)}
                className={cn(
                  'px-3 py-2 rounded-md text-left text-xs font-mono transition-colors',
                  active === s.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
                )}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
