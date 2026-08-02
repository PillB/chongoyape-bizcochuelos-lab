'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'memory', label: 'Memory', num: '01' },
  { id: 'evidence', label: 'Evidence', num: '02' },
  { id: 'claims', label: 'Claims', num: '03' },
  { id: 'ingredients', label: 'Ingredients', num: '04' },
  { id: 'techniques', label: 'Techniques', num: '05' },
  { id: 'substitutions', label: 'Substitutions', num: '06' },
  { id: 'recipe-lab', label: 'Recipe Lab', num: '07' },
  { id: 'validation', label: 'Validation', num: '08' },
  { id: 'failures', label: 'Failures', num: '09' },
  { id: 'complexity', label: 'Complexity', num: '10' },
  { id: 'verdict', label: 'Verdict', num: '11' },
]

export function SectionRail() {
  const [active, setActive] = useState('memory')
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px' },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.body.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const activeIndex = sections.findIndex((s) => s.id === active)

  return (
    <div className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-1.5">
      {/* Scroll progress percentage */}
      <div className="text-[9px] font-mono text-muted-foreground mb-1 tabular-nums">
        {Math.round(scrollProgress * 100)}%
      </div>

      {/* Vertical progress line */}
      <div className="relative w-px h-[280px] bg-border">
        <motion.div
          className="absolute top-0 left-0 right-0 bg-primary origin-top"
          style={{ height: `${scrollProgress * 100}%` }}
        />

        {/* Section dots */}
        <div className="absolute inset-0 flex flex-col justify-between -left-[5px]">
          {sections.map((s, idx) => {
            const isActive = s.id === active
            const isPassed = idx < activeIndex
            return (
              <button
                key={s.id}
                onClick={() => handleClick(s.id)}
                className="group relative flex items-center"
                aria-label={`Go to ${s.label}`}
              >
                <span
                  className={cn(
                    'block rounded-full transition-all duration-300',
                    isActive
                      ? 'w-3 h-3 bg-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-background'
                      : isPassed
                        ? 'w-2 h-2 bg-primary/60'
                        : 'w-2 h-2 bg-border group-hover:bg-primary/40',
                  )}
                />
                {/* Tooltip label */}
                <span
                  className={cn(
                    'absolute right-full mr-3 whitespace-nowrap text-[10px] font-mono font-medium px-2 py-0.5 rounded border transition-all duration-200 pointer-events-none',
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary opacity-100'
                      : 'bg-card text-muted-foreground border-border opacity-0 group-hover:opacity-100',
                  )}
                >
                  <span className="text-primary/70">{s.num}</span> {s.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active section label at bottom */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="mt-1 text-[9px] font-mono text-primary font-semibold tabular-nums text-center max-w-[60px] leading-tight"
        >
          {sections.find((s) => s.id === active)?.label}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
