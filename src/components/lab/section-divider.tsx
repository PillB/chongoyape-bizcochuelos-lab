'use client'

import { cn } from '@/lib/utils'

// A decorative divider placed between major sections to give the very long
// page visual breathing room. Uses a centered icon badge with gradient lines.
export function SectionDivider({
  className,
  variant = 'dots',
}: {
  className?: string
  variant?: 'dots' | 'line' | 'ornament'
}) {
  if (variant === 'line') {
    return (
      <div className={cn('flex items-center justify-center py-6', className)} aria-hidden>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center py-8', className)} aria-hidden>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
          <span className="w-2 h-2 rounded-full bg-primary/70" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
        </div>
      </div>
    )
  }

  // ornament
  return (
    <div className={cn('flex items-center justify-center py-8', className)} aria-hidden>
      <div className="flex items-center gap-3">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/40" />
        <div className="w-2 h-2 rotate-45 bg-primary/30" />
        <div className="w-3 h-3 rotate-45 bg-primary/50" />
        <div className="w-2 h-2 rotate-45 bg-primary/30" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/40" />
      </div>
    </div>
  )
}
