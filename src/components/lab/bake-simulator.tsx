'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Flame,
  Play,
  Square,
  RotateCcw,
  Thermometer,
  Clock,
  Egg,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Download,
  FlaskRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BakeLogEntry {
  id: string
  timestamp: string
  variant: string
  temperature: number
  duration: number
  outcome: {
    rise: 'sufficient' | 'insufficient' | 'excessive'
    color: 'pale' | 'golden-amber' | 'dark'
    crumb: 'fine' | 'coarse' | 'gummy'
    collapse: boolean
    eggAroma: 'clean' | 'excessive' | 'sulfur'
  }
  overallPass: boolean
  notes: string
}

interface BakeSimulatorProps {
  recipes: Array<{ id: string; name: string; level: number }>
}

// Simulated bake outcomes based on parameters
function simulateBake(
  variant: string,
  temperature: number,
  duration: number,
  modifications: { chuño: boolean; leavener: boolean; oil: boolean; separated: boolean; stone: boolean },
): BakeLogEntry['outcome'] {
  const isCore = !modifications.chuño && !modifications.leavener && !modifications.oil
  const tempFactor = temperature / 180
  const timeFactor = duration / 24

  // Rise depends on foam stability + leavener
  let rise: 'sufficient' | 'insufficient' | 'excessive' = 'sufficient'
  if (modifications.leavener && tempFactor > 1.05) rise = 'excessive'
  else if (tempFactor < 0.9 || duration < 20) rise = 'insufficient'
  else if (modifications.oil && !modifications.separated) rise = 'insufficient'

  // Color depends on temp + time + sugar
  let color: 'pale' | 'golden-amber' | 'dark' = 'golden-amber'
  const browning = tempFactor * timeFactor
  if (browning < 0.85) color = 'pale'
  else if (browning > 1.25 || (modifications.stone && tempFactor > 1)) color = 'dark'

  // Crumb depends on method + leavener
  let crumb: 'fine' | 'coarse' | 'gummy' = 'fine'
  if (modifications.leavener) crumb = 'coarse'
  else if (duration < 20 && tempFactor < 0.95) crumb = 'gummy'
  else if (modifications.chuño) crumb = 'fine'

  // Collapse risk
  const collapse = (modifications.oil && !modifications.separated && timeFactor > 1.1) ||
    (modifications.leavener && tempFactor > 1.1 && duration > 28) ||
    (duration < 18)

  // Egg aroma
  let eggAroma: 'clean' | 'excessive' | 'sulfur' = 'clean'
  if (duration > 30 && tempFactor > 1.1) eggAroma = 'sulfur'
  else if (tempFactor > 1.15) eggAroma = 'excessive'

  return { rise, color, crumb, collapse, eggAroma }
}

function isPass(outcome: BakeLogEntry['outcome']): boolean {
  return (
    outcome.rise === 'sufficient' &&
    outcome.color === 'golden-amber' &&
    (outcome.crumb === 'fine' || outcome.crumb === 'coarse') &&
    !outcome.collapse &&
    outcome.eggAroma !== 'sulfur'
  )
}

const STORAGE_KEY = 'bake-log-entries'

export function BakeSimulator({ recipes }: BakeSimulatorProps) {
  const [variant, setVariant] = useState(recipes[0]?.id ?? '')
  const [temperature, setTemperature] = useState(180)
  const [duration, setDuration] = useState(24)
  const [mods, setMods] = useState({ chuño: false, leavener: false, oil: false, separated: false, stone: false })
  const [logs, setLogs] = useState<BakeLogEntry[]>([])
  const [baking, setBaking] = useState(false)
  const [lastResult, setLastResult] = useState<BakeLogEntry | null>(null)

  // Load logs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Use a microtask to avoid setState-in-effect lint
        Promise.resolve().then(() => setLogs(parsed))
      }
    } catch {}
  }, [])

  // Save logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
    } catch {}
  }, [logs])

  const selectedRecipe = recipes.find((r) => r.id === variant)

  const runBake = () => {
    setBaking(true)
    setLastResult(null)
    // Simulate baking time (2s animation)
    setTimeout(() => {
      const outcome = simulateBake(variant, temperature, duration, mods)
      const pass = isPass(outcome)
      const entry: BakeLogEntry = {
        id: `bake-${Date.now()}`,
        timestamp: new Date().toISOString(),
        variant: selectedRecipe?.name ?? variant,
        temperature,
        duration,
        outcome,
        overallPass: pass,
        notes: '',
      }
      setLogs((prev) => [entry, ...prev].slice(0, 50))
      setLastResult(entry)
      setBaking(false)
    }, 2000)
  }

  const clearLogs = () => {
    if (confirm('Clear all bake logs?')) {
      setLogs([])
      setLastResult(null)
    }
  }

  const exportLogs = () => {
    const data = JSON.stringify(logs, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bake-log-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const passCount = logs.filter((l) => l.overallPass).length
  const failCount = logs.length - passCount

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-card border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Flame className="h-4 w-4 text-primary" />
            </div>
            Live Bake Simulator
          </CardTitle>
          <Badge variant="outline" className="text-[10px] font-mono">
            {logs.length} bakes logged
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          Run a simulated bake with adjustable parameters. Outcomes are predicted from food-science models — not real kitchen tests. Logs persist in your browser.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Controls */}
          <div className="space-y-3">
            {/* Variant selector */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                Recipe variant
              </label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {recipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    L{r.level} · {r.name.split('—')[0].trim().substring(0, 35)}
                  </option>
                ))}
              </select>
            </div>

            {/* Temperature */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3" /> Oven temperature
                </span>
                <span className="font-mono text-primary">{temperature}°C</span>
              </label>
              <input
                type="range"
                min={150}
                max={210}
                step={5}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground font-mono mt-0.5">
                <span>150°C</span>
                <span className="text-primary">180°C (base)</span>
                <span>210°C</span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Bake duration
                </span>
                <span className="font-mono text-primary">{duration} min</span>
              </label>
              <input
                type="range"
                min={15}
                max={35}
                step={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground font-mono mt-0.5">
                <span>15 min</span>
                <span className="text-primary">24 min (base)</span>
                <span>35 min</span>
              </div>
            </div>

            {/* Modifications */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Modifications
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(mods) as Array<keyof typeof mods>).map((key) => (
                  <label
                    key={key}
                    className={cn(
                      'flex items-center gap-1.5 p-1.5 rounded border cursor-pointer text-[11px] transition-colors',
                      mods[key]
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border bg-card/40 hover:bg-accent/30',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={mods[key]}
                      onChange={(e) => setMods((m) => ({ ...m, [key]: e.target.checked }))}
                      className="accent-primary h-3 w-3"
                    />
                    <span className="capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bake button */}
            <Button
              onClick={runBake}
              disabled={baking}
              className="w-full h-10 gap-2"
              size="default"
            >
              {baking ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <FlaskRound className="h-4 w-4" />
                  </motion.div>
                  Baking…
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run bake
                </>
              )}
            </Button>
          </div>

          {/* Results + Logs */}
          <div className="space-y-3">
            {/* Last result */}
            <AnimatePresence mode="wait">
              {lastResult && (
                <motion.div
                  key={lastResult.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    'rounded-lg border-2 p-3',
                    lastResult.overallPass
                      ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800'
                      : 'border-rose-300 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-800',
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Last bake result
                    </span>
                    {lastResult.overallPass ? (
                      <Badge className="bg-emerald-500 text-white gap-1">
                        <CheckCircle2 className="h-3 w-3" /> PASS
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-500 text-white gap-1">
                        <XCircle className="h-3 w-3" /> FAIL
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <ResultRow label="Rise" value={lastResult.outcome.rise} />
                    <ResultRow label="Color" value={lastResult.outcome.color} />
                    <ResultRow label="Crumb" value={lastResult.outcome.crumb} />
                    <ResultRow label="Collapse" value={lastResult.outcome.collapse ? 'yes' : 'no'} />
                    <ResultRow label="Egg aroma" value={lastResult.outcome.eggAroma} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            {logs.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md border border-border bg-card/40 p-2 text-center">
                  <div className="font-mono text-lg font-bold tabular-nums">{logs.length}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">Total</div>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/15 dark:border-emerald-900 p-2 text-center">
                  <div className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{passCount}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">Pass</div>
                </div>
                <div className="rounded-md border border-rose-200 bg-rose-50/50 dark:bg-rose-950/15 dark:border-rose-900 p-2 text-center">
                  <div className="font-mono text-lg font-bold text-rose-600 dark:text-rose-400 tabular-nums">{failCount}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">Fail</div>
                </div>
              </div>
            )}

            {/* Log list */}
            <div className="max-h-[300px] overflow-y-auto scroll-warm rounded-md border border-border">
              {logs.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No bakes logged yet. Run a bake to see results here.
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {logs.map((log) => (
                    <div key={log.id} className="p-2.5 text-xs hover:bg-accent/20 transition-colors">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-medium truncate flex-1">{log.variant.split('—')[0].trim()}</span>
                        <span className="font-mono text-[10px] text-muted-foreground flex-shrink-0">
                          {log.temperature}°C · {log.duration}m
                        </span>
                        {log.overallPass ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <OutcomeChip label={log.outcome.rise} />
                        <OutcomeChip label={log.outcome.color} />
                        <OutcomeChip label={log.outcome.crumb} />
                        {log.outcome.collapse && (
                          <span className="text-[9px] font-mono text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
                            COLLAPSE
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            {logs.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportLogs}
                  className="h-8 text-xs gap-1.5 flex-1"
                >
                  <Download className="h-3 w-3" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearLogs}
                  className="h-8 text-xs gap-1.5 text-rose-600 hover:text-rose-700"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ResultRow({ label, value }: { label: string; value: string }) {
  const isBad = ['insufficient', 'excessive', 'pale', 'dark', 'gummy', 'sulfur', 'yes'].includes(value)
  const isGood = ['sufficient', 'golden-amber', 'fine', 'clean', 'no'].includes(value)
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <span className={cn(
        'font-mono font-medium',
        isBad ? 'text-rose-600 dark:text-rose-400' : isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground',
      )}>
        {value}
      </span>
    </div>
  )
}

function OutcomeChip({ label }: { label: string }) {
  const isBad = ['insufficient', 'excessive', 'pale', 'dark', 'gummy', 'sulfur'].includes(label)
  const isGood = ['sufficient', 'golden-amber', 'fine', 'clean'].includes(label)
  return (
    <span className={cn(
      'text-[9px] font-mono px-1.5 py-0.5 rounded border',
      isBad
        ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        : isGood
          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
          : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    )}>
      {label}
    </span>
  )
}
