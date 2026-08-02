'use client'

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Radar as RadarIcon } from 'lucide-react'
import type { ValidationRound } from './types'

const lensLabels: Record<string, string> = {
  structural: 'Structural',
  historical: 'Historical',
  'target-comparison': 'Target match',
  'lima-practicality': 'Lima practical',
  adversarial: 'Adversarial',
  parsimony: 'Parsimony',
}

const statusScore: Record<string, number> = {
  pass: 100,
  predicted: 65,
  revise: 45,
  reopen: 20,
}

export function ValidationRadar({ validations }: { validations: ValidationRound[] }) {
  const data = validations.map((v) => {
    const checks = v.checks
    const passCount = checks.filter((c) => c.status === 'pass').length
    const totalCount = checks.length
    const avgScore =
      checks.reduce((s, c) => s + (statusScore[c.status] ?? 50), 0) / Math.max(totalCount, 1)
    const passPct = Math.round((passCount / Math.max(totalCount, 1)) * 100)
    return {
      lens: lensLabels[v.lens] ?? v.lens,
      fullLabel: `${lensLabels[v.lens] ?? v.lens} (R${v.round})`,
      score: Math.round(avgScore),
      passPct,
      passCount,
      totalCount,
      status: v.status,
    }
  })

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
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} outerRadius="72%">
                <PolarGrid stroke="oklch(0.90 0.02 70)" />
                <PolarAngleAxis
                  dataKey="lens"
                  tick={{ fill: 'oklch(0.50 0.025 60)', fontSize: 10 }}
                />
                <PolarRadiusAxis
                  domain={[0, 100]}
                  tick={{ fill: 'oklch(0.60 0.02 60)', fontSize: 9 }}
                  tickCount={5}
                  stroke="oklch(0.90 0.02 70)"
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="oklch(0.62 0.14 65)"
                  fill="oklch(0.62 0.14 65)"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    background: 'oklch(0.18 0.012 55)',
                    border: '1px solid oklch(1 0 0 / 12%)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'oklch(0.96 0.012 80)',
                  }}
                  formatter={(_value: number, _name: string, props: { payload?: { fullLabel?: string; passCount?: number; totalCount?: number; status?: string } }) => {
                    const p = props?.payload
                    if (!p) return []
                    return [
                      `${p.passCount}/${p.totalCount} checks pass · status: ${p.status}`,
                      p.fullLabel ?? '',
                    ]
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend / detail */}
          <div className="space-y-1.5 text-xs">
            {data.map((d) => (
              <div key={d.lens} className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground truncate">{d.lens}</span>
                <span className="font-mono font-semibold tabular-nums">
                  {d.passCount}/{d.totalCount}
                </span>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t border-border text-[10px] text-muted-foreground leading-relaxed">
              Score = weighted average of check statuses (pass 100, predicted 65, revise 45, reopen 20).
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
