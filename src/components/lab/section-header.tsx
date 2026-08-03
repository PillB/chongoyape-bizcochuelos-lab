'use client'

import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  index: string
  title: string
  subtitle?: string
  icon?: React.ReactNode
  className?: string
}

export function SectionHeader({ index, title, subtitle, icon, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-start gap-4 mb-8', className)}>
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-mono text-sm font-bold">
        {index}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {icon}
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">{title}</h2>
        </div>
        {subtitle && (
          <p className="mt-1.5 text-muted-foreground text-sm sm:text-base max-w-3xl text-balance">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
