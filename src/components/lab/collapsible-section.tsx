'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CollapsibleSectionProps {
  id: string
  title: string
  index?: string
  icon?: React.ReactNode
  summary: string
  children: React.ReactNode
  defaultOpen?: boolean
}

// A context-free collapsible wrapper. Each section can be independently
// collapsed to its summary, reducing visual density on the very long page.
export function CollapsibleSection({
  id,
  title,
  index,
  icon,
  summary,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  // Listen for global expand/collapse all events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ open: boolean }>).detail
      if (detail) setOpen(detail.open)
    }
    window.addEventListener('section-collapse', handler as EventListener)
    return () => window.removeEventListener('section-collapse', handler as EventListener)
  }, [])

  return (
    <div id={id} className="scroll-mt-20">
      {/* Section header — always visible, acts as the collapse toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full flex items-center gap-4 py-5 px-4 sm:px-6 rounded-lg transition-colors text-left group',
          'bg-gradient-to-r from-card/80 to-card/40 border border-border/60 hover:border-primary/30 hover:from-primary/5',
        )}
        aria-expanded={open}
        aria-controls={`${id}-content`}
      >
        {index && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-mono text-sm font-bold">
            {index}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {icon}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-balance">{title}</h2>
          </div>
          {!open && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1 text-balance">{summary}</p>
          )}
        </div>
        <motion.div
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 rounded-md bg-muted/50 border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      {/* Collapsible content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-content`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// A global expand/collapse all control — placed in the hero or nav
interface CollapseAllContextValue {
  expandAll: () => void
  collapseAll: () => void
}

// Simple event-based approach: dispatch a custom event that CollapsibleSections listen for
export function CollapseAllControl({ className }: { className?: string }) {
  const [state, setState] = useState<'expanded' | 'mixed' | 'collapsed'>('expanded')

  const expandAll = useCallback(() => {
    window.dispatchEvent(new CustomEvent('section-collapse', { detail: { open: true } }))
    setState('expanded')
  }, [])

  const collapseAll = useCallback(() => {
    window.dispatchEvent(new CustomEvent('section-collapse', { detail: { open: false } }))
    setState('collapsed')
  }, [])

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={collapseAll}
        className="h-8 text-xs gap-1.5"
        title="Collapse all sections to summaries"
      >
        <Minimize2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Collapse all</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={expandAll}
        className="h-8 text-xs gap-1.5"
        title="Expand all sections"
      >
        <Maximize2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Expand all</span>
      </Button>
    </div>
  )
}
