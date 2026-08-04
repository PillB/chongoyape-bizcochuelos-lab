'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart as PieIcon } from 'lucide-react'
import type { LabData } from './types'

const confidenceConfig: Record<string, { color: string; label: string }> = {
  confirmed: { color: 'oklch(0.65 0.15 155)', label: 'Confirmed' },
  'strongly-supported': { color: 'oklch(0.70 0.14 75)', label: 'Strongly supported' },
  plausible: { color: 'oklch(0.75 0.13 85)', label: 'Plausible' },
  weak: { color: 'oklch(0.70 0.12 55)', label: 'Weak' },
  unresolved: { color: 'oklch(0.65 0.10 220)', label: 'Unresolved' },
  contradicted: { color: 'oklch(0.58 0.20 25)', label: 'Contradicted' },
}

const order = ['confirmed', 'strongly-supported', 'plausible', 'weak', 'unresolved', 'contradicted']

export function ClaimsChart({ data }: { data: LabData }) {
  const stats = data.stats.claims

  const chartData = order
    .map((k) => ({
      name: confidenceConfig[k].label,
      key: k,
      value: stats[k] ?? 0,
      color: confidenceConfig[k].color,
    }))
    .filter((d) => d.value > 0)

  const total = chartData.reduce((s, d) => s + d.value, 0)
  const strongCount = (stats['confirmed'] ?? 0) + (stats['strongly-supported'] ?? 0)
  const strongPct = Math.round((strongCount / Math.max(total, 1)) * 100)

  return (
    <Card className="bg-card/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <PieIcon className="h-4 w-4 text-primary" />
          Confidence distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] gap-3 items-center">
          {/* Donut */}
          <div className="relative h-[140px] sm:h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="62%"
                  outerRadius="100%"
                  paddingAngle={1.5}
                  stroke="none"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'oklch(0.18 0.012 55)',
                    border: '1px solid oklch(1 0 0 / 12%)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'oklch(0.96 0.012 80)',
                  }}
                  formatter={(value: number, name: string) => [`${value} claim${value !== 1 ? 's' : ''}`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold font-mono tabular-nums">{strongPct}%</span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">corroborated</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 min-w-0 overflow-hidden">
            {chartData.map((d) => (
              <div key={d.key} className="flex items-center gap-2 text-xs min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-muted-foreground flex-1 truncate min-w-0">{d.name}</span>
                <span className="font-mono font-semibold tabular-nums flex-shrink-0">{d.value}</span>
                <span className="text-[10px] text-muted-foreground tabular-nums flex-shrink-0 w-8 text-right">
                  {Math.round((d.value / Math.max(total, 1)) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
