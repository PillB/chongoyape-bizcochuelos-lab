'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookOpen, Search } from 'lucide-react'
import { glossary } from './glossary'

export function GlossaryButton() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const terms = useMemo(() => {
    const all = Object.values(glossary)
    if (!query) return all
    const q = query.toLowerCase()
    return all.filter(
      (e) =>
        e.term.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="fixed bottom-5 left-5 z-50 h-11 w-11 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center text-primary group"
          aria-label="Open glossary"
          title="Open glossary"
        >
          <BookOpen className="h-5 w-5 transition-transform group-hover:scale-110" />
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-20" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Glossary
            <span className="ml-1 text-xs font-mono text-muted-foreground font-normal">
              {Object.keys(glossary).length} terms
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            id="glossary-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms…"
            className="pl-8"
            autoFocus
            aria-label="Search glossary terms"
          />
        </div>
        <ScrollArea className="max-h-[400px] -mx-1 px-1">
          <dl className="space-y-3">
            {terms.map((e) => (
              <div key={e.term} className="border-b border-border/40 last:border-0 pb-3 last:pb-0">
                <dt className="font-semibold text-sm text-primary capitalize flex items-center gap-2">
                  {e.term}
                </dt>
                <dd className="text-[13px] text-muted-foreground leading-relaxed mt-1">
                  {e.definition}
                </dd>
              </div>
            ))}
            {terms.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No terms match &ldquo;{query}&rdquo;.
              </div>
            )}
          </dl>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
