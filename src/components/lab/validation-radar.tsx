'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Radar as RadarIcon } from 'lucide-react'
import type { ValidationRound } from './types'

// ---------------------------------------------------------------------------
// Static configuration
// ---------------------------------------------------------------------------

const LENS_ORDER = [
  'structural',
  'historical',
  'target-comparison',
  'lima-practicality',
  'adversarial',
  'parsimony',
  'recipe-convergence',
  'kitchen-readiness',
] as const

const lensLabels: Record<string, string> = {
  structural: 'Structural',
  historical: 'Historical',
  'target-comparison': 'Target match',
  'lima-practicality': 'Lima practical',
  adversarial: 'Adversarial',
  parsimony: 'Parsimony',
  'recipe-convergence': 'Recipe conv.',
  'kitchen-readiness': 'Kitchen ready',
}

const statusScore: Record<string, number> = {
  pass: 100,
  predicted: 65,
  revise: 45,
  reopen: 20,
}

// ---------------------------------------------------------------------------
// Per-lens aggregation (latest round wins)
// ---------------------------------------------------------------------------

interface LensAggregate {
  lens: string
  label: string
  round: number | null
  score: number | null
  passCount: number
  totalCount: number
  status: string | null
}

function aggregateByLens(validations: ValidationRound[]): LensAggregate[] {
  return LENS_ORDER.map((lens) => {
    // Pick the latest (highest round number) validation round that used this lens.
    const roundsForLens = validations
      .filter((v) => v.lens === lens)
      .sort((a, b) => a.round - b.round)
    const latest = roundsForLens[roundsForLens.length - 1]

    if (!latest) {
      return {
        lens,
        label: lensLabels[lens] ?? lens,
        round: null,
        score: null,
        passCount: 0,
        totalCount: 0,
        status: null,
      }
    }

    const checks = latest.checks
    const passCount = checks.filter((c) => c.status === 'pass').length
    const totalCount = checks.length
    const avgScore =
      checks.reduce((s, c) => s + (statusScore[c.status] ?? 50), 0) /
      Math.max(totalCount, 1)

    return {
      lens,
      label: lensLabels[lens] ?? lens,
      round: latest.round,
      score: Math.round(avgScore),
      passCount,
      totalCount,
      status: latest.status,
    }
  })
}

// ---------------------------------------------------------------------------
// SVG geometry helpers
// ---------------------------------------------------------------------------

const SIZE = 300
const CENTER = SIZE / 2 // 150
const MAX_RADIUS = 100
const GRID_RINGS = [20, 40, 60, 80, 100] // 5 concentric rings (20/40/60/80/100)
const RADIUS_TICKS = [0, 25, 50, 75, 100]

// 6 axes, evenly distributed, starting at the top (-PI/2) going clockwise.
function angleForIndex(i: number): number {
  return -Math.PI / 2 + (i * 2 * Math.PI) / LENS_ORDER.length
}

function pointAt(i: number, radius: number): { x: number; y: number } {
  const a = angleForIndex(i)
  return {
    x: CENTER + radius * Math.cos(a),
    y: CENTER + radius * Math.sin(a),
  }
}

// ---------------------------------------------------------------------------
// Score-based color tokens
// ---------------------------------------------------------------------------

const AMBER_STROKE = 'oklch(0.62 0.14 65)'
const GRID_STROKE = 'oklch(0.90 0.02 70)'
const AXIS_LABEL_FILL = 'oklch(0.50 0.025 60)'
const TICK_LABEL_FILL = 'oklch(0.60 0.02 60)'
const HALO_STROKE = 'oklch(0.18 0.012 55)'

function pillClassesForScore(score: number | null): string {
  if (score === null) {
    return 'bg-muted/50 text-muted-foreground border-border'
  }
  if (score >= 80) {
    return 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
  }
  if (score >= 60) {
    return 'bg-amber-500/12 text-amber-700 dark:text-amber-300 border-amber-500/30'
  }
  return 'bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/30'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ValidationRadar({ validations }: { validations: ValidationRound[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const data = aggregateByLens(validations)

  // Build the data polygon point string. Empty lenses (no round) collapse to
  // the centre so the polygon stays closed without misrepresenting coverage.
  const polygonPoints = data
    .map((d, i) => {
      const r = d.score !== null ? (d.score / 100) * MAX_RADIUS : 0
      const p = pointAt(i, r)
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
    })
    .join(' ')

  const hoverItem = hovered !== null ? data[hovered] ?? null : null

  // Anchor logic for axis labels (so they don't overflow the viewBox).
  function anchorFor(i: number): 'start' | 'middle' | 'end' {
    const x = pointAt(i, MAX_RADIUS + 18).x
    if (x > CENTER + 4) return 'start'
    if (x < CENTER - 4) return 'end'
    return 'middle'
  }

  return (
    <Card className="bg-card/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <RadarIcon className="h-4 w-4 text-primary" />
          Validation lens coverage
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid sm:grid-cols-[1fr_180px] gap-4 items-center">
          {/* ---------------- SVG radar ---------------- */}
          <div className="relative min-h-[260px] w-full">
            <svg
              viewBox="0 0 300 300"
              className="w-full h-auto max-h-[260px]"
              role="img"
              aria-label="Validation lens coverage radar chart"
            >
              {/* Concentric grid rings (hexagonal to match 6 axes) */}
              {GRID_RINGS.map((r) => {
                const pts = LENS_ORDER.map((_, i) => {
                  const p = pointAt(i, r)
                  return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
                }).join(' ')
                return (
                  <polygon
                    key={`ring-${r}`}
                    points={pts}
                    fill="none"
                    stroke={GRID_STROKE}
                    strokeWidth={1}
                  />
                )
              })}

              {/* Axis spokes from centre to outer ring */}
              {LENS_ORDER.map((_, i) => {
                const p = pointAt(i, MAX_RADIUS)
                return (
                  <line
                    key={`axis-${i}`}
                    x1={CENTER}
                    y1={CENTER}
                    x2={p.x}
                    y2={p.y}
                    stroke={GRID_STROKE}
                    strokeWidth={1}
                  />
                )
              })}

              {/* Data polygon */}
              <polygon
                points={polygonPoints}
                fill={AMBER_STROKE}
                fillOpacity={0.35}
                stroke={AMBER_STROKE}
                strokeWidth={2}
                strokeLinejoin="round"
              />

              {/* Vertex circles (interactive) */}
              {data.map((d, i) => {
                const r = d.score !== null ? (d.score / 100) * MAX_RADIUS : 0
                const p = pointAt(i, r)
                const isHovered = hovered === i
                const dimmed = hovered !== null && !isHovered
                return (
                  <circle
                    key={`vertex-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 5 : 3.5}
                    fill={AMBER_STROKE}
                    stroke={HALO_STROKE}
                    strokeWidth={1}
                    className="cursor-pointer transition-all"
                    opacity={dimmed ? 0.45 : 1}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  />
                )
              })}

              {/* Radius tick labels (rendered after polygon so they stay readable) */}
              {RADIUS_TICKS.map((tick) => {
                const r = (tick / 100) * MAX_RADIUS
                const p = pointAt(0, r)
                return (
                  <text
                    key={`tick-${tick}`}
                    x={p.x + 4}
                    y={p.y}
                    fontSize={9}
                    fill={TICK_LABEL_FILL}
                    stroke={HALO_STROKE}
                    strokeWidth={2}
                    paintOrder="stroke"
                    dominantBaseline="middle"
                  >
                    {tick}
                  </text>
                )
              })}

              {/* Axis labels (lens names) outside the outer ring */}
              {data.map((d, i) => {
                const p = pointAt(i, MAX_RADIUS + 18)
                const anchor = anchorFor(i)
                return (
                  <text
                    key={`label-${i}`}
                    x={p.x}
                    y={p.y}
                    fontSize={10}
                    fill={AXIS_LABEL_FILL}
                    stroke={HALO_STROKE}
                    strokeWidth={2}
                    paintOrder="stroke"
                    textAnchor={anchor}
                    dominantBaseline="middle"
                    className="select-none"
                  >
                    {d.label}
                  </text>
                )
              })}
            </svg>

            {/* Tooltip */}
            {hoverItem && (
              <div className="pointer-events-none absolute left-1/2 top-1 z-10 -translate-x-1/2 rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
                <div className="font-medium text-foreground">{hoverItem.label}</div>
                <div className="mt-0.5 text-muted-foreground">
                  {hoverItem.round !== null ? `Round ${hoverItem.round}` : 'No data'}
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <span className="font-mono font-semibold tabular-nums text-foreground">
                    Score: {hoverItem.score ?? '—'}
                  </span>
                  <span className="font-mono tabular-nums text-muted-foreground">
                    {hoverItem.totalCount > 0
                      ? `${hoverItem.passCount}/${hoverItem.totalCount} checks`
                      : 'no checks'}
                  </span>
                </div>
                {hoverItem.status && (
                  <div className="mt-0.5 text-muted-foreground">
                    Status: {hoverItem.status}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---------------- Legend / detail ---------------- */}
          <div className="space-y-1.5 text-xs">
            {data.map((d, i) => (
              <div
                key={`legend-${d.lens}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`flex items-center justify-between gap-2 rounded px-1.5 py-0.5 transition-colors cursor-default ${
                  hovered === i ? 'bg-accent/60' : ''
                }`}
              >
                <span className="text-muted-foreground truncate">{d.label}</span>
                <span className="font-mono font-semibold tabular-nums">
                  {d.totalCount > 0 ? `${d.passCount}/${d.totalCount}` : '—'}
                </span>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t border-border text-[10px] text-muted-foreground leading-relaxed">
              Score = latest round avg of check statuses (pass 100, predicted 65,
              revise 45, reopen 20).
            </div>
          </div>
        </div>

        {/* ---------------- Coverage pills ---------------- */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="mb-2 text-[10px] uppercase tracking-wide text-muted-foreground">
            Lens coverage
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.map((d, i) => (
              <span
                key={`pill-${d.lens}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-opacity cursor-default ${
                  pillClassesForScore(d.score)
                } ${hovered !== null && hovered !== i ? 'opacity-60' : ''}`}
              >
                <span>{d.label}</span>
                <span className="font-mono tabular-nums">{d.score ?? '—'}</span>
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
