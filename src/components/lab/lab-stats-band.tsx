'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Stat {
  value: number
  suffix?: string
  label: string
  sublabel?: string
  color: string
}

interface AnimatedCounterProps {
  value: number
  suffix?: string
  duration?: number
  className?: string
}

function AnimatedCounter({ value, suffix, duration = 1200, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let startTime: number | null = null
    let frame: number

    const animate = (now: number) => {
      if (startTime === null) startTime = now
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)
      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [isInView, value, duration])

  const isDecimal = value % 1 !== 0

  return (
    <span ref={ref} className={cn('font-mono tabular-nums', className)}>
      {isDecimal ? display.toFixed(1) : Math.round(display).toLocaleString()}
      {suffix}
    </span>
  )
}

interface LabStatsBandProps {
  stats: {
    claims: number
    ingredients: number
    techniques: number
    recipes: number
    validations: number
    complexityRemoved: number
  }
}

export function LabStatsBand({ stats }: LabStatsBandProps) {
  const statsList: Stat[] = [
    {
      value: stats.claims,
      label: 'Claims audited',
      sublabel: 'confidence-rated',
      color: 'text-primary',
    },
    {
      value: stats.ingredients,
      label: 'Ingredients',
      sublabel: '4 tiers',
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      value: stats.techniques,
      label: 'Techniques',
      sublabel: 'core / optional / rejected',
      color: 'text-teal-600 dark:text-teal-400',
    },
    {
      value: stats.recipes,
      label: 'Recipe variants',
      sublabel: '4-level hierarchy',
      color: 'text-violet-600 dark:text-violet-400',
    },
    {
      value: stats.validations,
      label: 'Validation rounds',
      sublabel: '6 adversarial lenses',
      color: 'text-rose-600 dark:text-rose-400',
    },
    {
      value: stats.complexityRemoved,
      label: 'Complexity removed',
      sublabel: 'parsimony log',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
  ]

  return (
    <section className="border-y border-border/60 bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {statsList.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="text-center sm:text-left relative group"
            >
              <div className="flex items-baseline gap-0.5 justify-center sm:justify-start">
                <AnimatedCounter
                  value={stat.value}
                  className={cn('text-3xl sm:text-4xl font-bold', stat.color)}
                />
              </div>
              <div className="text-xs font-semibold text-foreground mt-0.5 leading-tight">
                {stat.label}
              </div>
              {stat.sublabel && (
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {stat.sublabel}
                </div>
              )}
              {/* Hover accent line */}
              <div className={cn('h-0.5 mt-1.5 rounded-full transition-all duration-300', stat.color.replace('text-', 'bg-'))} style={{ width: '0%' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
