'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  const [sectionLabel, setSectionLabel] = useState('01 · Memory Audit')

  useEffect(() => {
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const found = sections.find((s) => s.id === e.target.id)
            if (found) setSectionLabel(found.label)
          }
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

  return (
    <>
      {/* Thin progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-primary origin-left z-[60]"
        style={{ scaleX }}
        aria-hidden
      />
      {/* Section label chip */}
      <div className="fixed top-[3px] left-1/2 -translate-x-1/2 z-[60] hidden md:block pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md text-[10px] font-mono text-primary font-medium shadow-sm"
        >
          {sectionLabel}
        </motion.div>
      </div>
    </>
  )
}
