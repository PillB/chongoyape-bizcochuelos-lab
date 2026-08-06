'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  FlaskRound,
  TrendingUp,
  TrendingDown,
  Minus,
  Trash2,
  Download,
  Plus,
  Beaker,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================
// MECHANISM EXPLORER
// Qualitative direction only — NO exact percentages, NO pass/fail,
// NO simulated outcomes. Each mechanism has a direction, a
// food-science basis, and a validating experiment.
// ============================================================

interface Mechanism {
  id: string
  toggle: string
  description: string
  effects: Array<{
    metric: string
    direction: 'up' | 'down' | 'neutral'
    mechanism: string
    evidence: string
    uncertainty: 'low' | 'medium' | 'high'
    validatingExperiment: string
  }>
}

const mechanisms: Mechanism[] = [
  {
    id: 'chuño',
    toggle: 'Add chuño (potato starch)',
    description: 'Replace ~10% of flour weight with potato starch',
    effects: [
      { metric: 'Crumb tenderness', direction: 'up', mechanism: 'Starch dilutes gluten-forming proteins, reducing gluten development during folding', evidence: 'Food science: starch interference with gluten network is well-established', uncertainty: 'low', validatingExperiment: 'Diagnostic A — chuño vs cornstarch controlled comparison' },
      { metric: 'Staling rate', direction: 'down', mechanism: 'Potato starch retrogrades more slowly than wheat starch', evidence: 'Starch retrogradation literature', uncertainty: 'medium', validatingExperiment: 'Day-2 and day-3 texture comparison' },
      { metric: 'Crumb strength', direction: 'down', mechanism: 'Reduced gluten network is more fragile', evidence: 'Gluten-starch interaction studies', uncertainty: 'medium', validatingExperiment: 'Compression test on controlled batches' },
    ],
  },
  {
    id: 'leavener',
    toggle: 'Add baking powder (low dose)',
    description: 'Add ~1-2% baker\'s weight baking powder',
    effects: [
      { metric: 'Oven spring', direction: 'up', mechanism: 'CO₂ release provides supplemental lift beyond foam aeration', evidence: 'Chemical leavening mechanics are well-established', uncertainty: 'low', validatingExperiment: 'Diagnostic C — foam-only vs low-dose controlled comparison' },
      { metric: 'Crumb cell size', direction: 'up', mechanism: 'Additional gas bubbles create larger cells', evidence: 'Bubble nucleation and growth literature', uncertainty: 'medium', validatingExperiment: 'Crumb cross-section image analysis' },
      { metric: 'Flavor purity', direction: 'down', mechanism: 'Residual chemical taste possible if dose is high or acid-base balance is off', evidence: 'Baking powder flavor threshold studies', uncertainty: 'high', validatingExperiment: 'Triangle test: foam-only vs leavened (blind)' },
    ],
  },
  {
    id: 'oil',
    toggle: 'Add trace oil',
    description: 'Add ~5-6% baker\'s weight neutral oil',
    effects: [
      { metric: 'Day-2 moisture', direction: 'up', mechanism: 'Fat coats starch granules, slowing water migration and retrogradation', evidence: 'Fat-starch interaction in baking science', uncertainty: 'low', validatingExperiment: 'Day-2 and day-3 gravimetric moisture test' },
      { metric: 'Foam volume', direction: 'down', mechanism: 'Fat interferes with egg foam protein network during folding', evidence: 'Egg foam stability studies with fat contamination', uncertainty: 'low', validatingExperiment: 'Measure batter density before and after oil addition' },
      { metric: 'Mouthfeel', direction: 'up', mechanism: 'Fat improves lubricity and tenderness perception', evidence: 'Sensory science of fat in baked goods', uncertainty: 'medium', validatingExperiment: 'Descriptive profiling panel' },
    ],
  },
  {
    id: 'separated',
    toggle: 'Use separated-egg method',
    description: 'Whip yolks and whites separately, then fold',
    effects: [
      { metric: 'Total volume', direction: 'up', mechanism: 'Whites-only foam reaches higher volume than whole-egg foam', evidence: 'Egg foam science: whites achieve greater overrun', uncertainty: 'low', validatingExperiment: 'Diagnostic B — whole-egg vs separated controlled comparison' },
      { metric: 'Crumb uniformity', direction: 'down', mechanism: 'Multiple folding stages increase risk of uneven distribution', evidence: 'Folding mechanics in sponge production', uncertainty: 'medium', validatingExperiment: 'Crumb cross-section comparison' },
      { metric: 'Workflow complexity', direction: 'up', mechanism: 'Additional bowl, separate whipping, 3-stage fold', evidence: 'Procedural analysis', uncertainty: 'low', validatingExperiment: 'Time-and-motion study' },
    ],
  },
  {
    id: 'stone',
    toggle: 'Bake on preheated stone',
    description: 'Simulate wood-oven deck heat with baking stone',
    effects: [
      { metric: 'Base color', direction: 'up', mechanism: 'Stronger conductive heat from stone darkens base', evidence: 'Heat transfer in deck ovens', uncertainty: 'low', validatingExperiment: 'Diagnostic E — thermal comparison with/without stone' },
      { metric: 'Rise speed', direction: 'up', mechanism: 'Faster initial heat set promotes earlier structure formation', evidence: 'Oven spring mechanics', uncertainty: 'medium', validatingExperiment: 'Height measurement at 5-min intervals' },
      { metric: 'Burn risk', direction: 'up', mechanism: 'Excessive bottom heat can scorch before crumb sets', evidence: 'Baking thermodynamics', uncertainty: 'medium', validatingExperiment: 'Monitor base temperature with IR thermometer' },
    ],
  },
]

// ============================================================
// REAL BATCH LOG
// Only actual entered observations — NO simulation, NO pass/fail
// from heuristics. Users enter what they actually observed.
// ============================================================

interface RealBatchEntry {
  id: string
  timestamp: string
  date: string
  variant: string
  temperature: number
  duration: number
  modifications: string
  // Actual observations (user-entered, not simulated)
  observedRise: string
  observedColor: string
  observedCrumb: string
  observedCollapse: string
  observedAroma: string
  bakedWeight: string
  height: string
  notes: string
  photoUrl: string
}

const BATCH_STORAGE_KEY = 'real-batch-entries'

export function BakeSimulator({ recipes }: { recipes: Array<{ id: string; name: string; level: number }> }) {
  const [activeMechanisms, setActiveMechanisms] = useState<Set<string>>(new Set())
  const [batches, setBatches] = useState<RealBatchEntry[]>([])
  const [showBatchForm, setShowBatchForm] = useState(false)
  const [newBatch, setNewBatch] = useState<Partial<RealBatchEntry>>({
    variant: recipes[0]?.name ?? '',
    temperature: 180,
    duration: 24,
    modifications: '',
    observedRise: '',
    observedColor: '',
    observedCrumb: '',
    observedCollapse: 'no',
    observedAroma: '',
    bakedWeight: '',
    height: '',
    notes: '',
    photoUrl: '',
  })

  // Load batches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BATCH_STORAGE_KEY)
      if (stored) {
        Promise.resolve().then(() => setBatches(JSON.parse(stored)))
      }
    } catch {}
  }, [])

  // Save batches
  useEffect(() => {
    try {
      localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(batches))
    } catch {}
  }, [batches])

  const toggleMechanism = (id: string) => {
    setActiveMechanisms((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const addBatch = () => {
    const entry: RealBatchEntry = {
      id: `batch-${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: newBatch.date || new Date().toISOString().split('T')[0],
      variant: newBatch.variant || '',
      temperature: newBatch.temperature || 180,
      duration: newBatch.duration || 24,
      modifications: newBatch.modifications || 'none',
      observedRise: newBatch.observedRise || '',
      observedColor: newBatch.observedColor || '',
      observedCrumb: newBatch.observedCrumb || '',
      observedCollapse: newBatch.observedCollapse || 'no',
      observedAroma: newBatch.observedAroma || '',
      bakedWeight: newBatch.bakedWeight || '',
      height: newBatch.height || '',
      notes: newBatch.notes || '',
      photoUrl: newBatch.photoUrl || '',
    }
    setBatches((prev) => [entry, ...prev].slice(0, 100))
    setShowBatchForm(false)
    setNewBatch({
      variant: recipes[0]?.name ?? '',
      temperature: 180,
      duration: 24,
      modifications: '',
      observedRise: '',
      observedColor: '',
      observedCrumb: '',
      observedCollapse: 'no',
      observedAroma: '',
      bakedWeight: '',
      height: '',
      notes: '',
      photoUrl: '',
    })
  }

  const clearBatches = () => {
    if (confirm('Delete all real batch records? This cannot be undone.')) {
      setBatches([])
    }
  }

  const exportBatches = () => {
    const data = JSON.stringify(batches, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `real-batch-log-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-card border-primary/30 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FlaskRound className="h-4 w-4 text-primary" />
            </div>
            Mechanism Explorer &amp; Real Batch Log
          </CardTitle>
          <Badge variant="outline" className="text-[10px] font-mono">
            {batches.length} real batches logged
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          Explore qualitative mechanism directions (no simulated outcomes). Log only real bake observations —
          no simulation records are generated or stored.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* MECHANISM EXPLORER */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2">
            Mechanism Explorer — qualitative direction only
          </div>
          <div className="space-y-2">
            {mechanisms.map((m) => {
              const isActive = activeMechanisms.has(m.id)
              return (
                <div key={m.id} className={cn('rounded-lg border transition-colors overflow-hidden', isActive ? 'border-primary/30 bg-primary/5' : 'border-border bg-card/40')}>
                  <button
                    onClick={() => toggleMechanism(m.id)}
                    className="w-full text-left p-2.5 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-medium">{m.toggle}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{m.description}</div>
                    </div>
                    <Badge variant="outline" className={cn('text-[9px] font-mono flex-shrink-0', isActive ? 'bg-primary/10 text-primary border-primary/20' : '')}>
                      {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </button>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-2.5 pt-0 space-y-1.5">
                          {m.effects.map((eff, idx) => (
                            <div key={idx} className="rounded-md border border-border/60 bg-card/40 p-2">
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <span className="text-[11px] font-medium">{eff.metric}</span>
                                <div className="flex items-center gap-1">
                                  {eff.direction === 'up' ? (
                                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                                  ) : eff.direction === 'down' ? (
                                    <TrendingDown className="h-3 w-3 text-rose-500" />
                                  ) : (
                                    <Minus className="h-3 w-3 text-muted-foreground" />
                                  )}
                                  <Badge variant="outline" className={cn(
                                    'text-[8px] h-3.5 px-1 font-mono',
                                    eff.uncertainty === 'low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400' :
                                    eff.uncertainty === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400' :
                                    'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400'
                                  )}>
                                    {eff.uncertainty} uncertainty
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-[10px] text-muted-foreground leading-relaxed">
                                <span className="font-medium">Mechanism:</span> {eff.mechanism}
                              </div>
                              <div className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">
                                <span className="font-medium">Evidence:</span> {eff.evidence}
                              </div>
                              <div className="text-[10px] text-primary leading-relaxed mt-0.5">
                                <span className="font-medium">Validating experiment:</span> {eff.validatingExperiment}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
          <div className="mt-2 rounded-md border border-amber-200 bg-amber-50/50 dark:bg-amber-950/15 dark:border-amber-900 p-2">
            <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
              <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>Directions are qualitative expectations from food science, NOT quantitative predictions.
              No simulated outcomes are generated. Validate with controlled experiments.</span>
            </div>
          </div>
        </div>

        {/* REAL BATCH LOG */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Real Batch Log — actual observations only
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBatchForm(!showBatchForm)}
              className="h-7 text-xs gap-1"
            >
              <Plus className="h-3 w-3" />
              Add batch
            </Button>
          </div>

          {/* Batch entry form */}
          <AnimatePresence>
            {showBatchForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-lg border border-border bg-card/60 p-3 space-y-2 mb-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Enter real observations from an actual bake
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-muted-foreground">Recipe variant</label>
                      <select
                        value={newBatch.variant}
                        onChange={(e) => setNewBatch({ ...newBatch, variant: e.target.value })}
                        className="w-full h-7 px-2 rounded border border-border bg-card text-xs"
                      >
                        {recipes.map((r) => (
                          <option key={r.id} value={r.name}>L{r.level} · {r.name.substring(0, 30)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] text-muted-foreground">Bake date</label>
                      <Input
                        type="date"
                        value={newBatch.date || ''}
                        onChange={(e) => setNewBatch({ ...newBatch, date: e.target.value })}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-muted-foreground">Oven temp (°C)</label>
                      <Input
                        type="number"
                        value={newBatch.temperature || ''}
                        onChange={(e) => setNewBatch({ ...newBatch, temperature: Number(e.target.value) })}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-muted-foreground">Bake time (min)</label>
                      <Input
                        type="number"
                        value={newBatch.duration || ''}
                        onChange={(e) => setNewBatch({ ...newBatch, duration: Number(e.target.value) })}
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-muted-foreground">Observed rise</label>
                      <Input placeholder="sufficient / insufficient / excessive" value={newBatch.observedRise} onChange={(e) => setNewBatch({ ...newBatch, observedRise: e.target.value })} className="h-7 text-xs" />
                    </div>
                    <div>
                      <label className="text-[9px] text-muted-foreground">Observed color</label>
                      <Input placeholder="pale / golden-amber / dark" value={newBatch.observedColor} onChange={(e) => setNewBatch({ ...newBatch, observedColor: e.target.value })} className="h-7 text-xs" />
                    </div>
                    <div>
                      <label className="text-[9px] text-muted-foreground">Observed crumb</label>
                      <Input placeholder="fine / coarse / gummy" value={newBatch.observedCrumb} onChange={(e) => setNewBatch({ ...newBatch, observedCrumb: e.target.value })} className="h-7 text-xs" />
                    </div>
                    <div>
                      <label className="text-[9px] text-muted-foreground">Collapse?</label>
                      <select value={newBatch.observedCollapse} onChange={(e) => setNewBatch({ ...newBatch, observedCollapse: e.target.value })} className="w-full h-7 px-2 rounded border border-border bg-card text-xs">
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] text-muted-foreground">Baked weight (g)</label>
                      <Input type="number" placeholder="e.g. 78" value={newBatch.bakedWeight || ''} onChange={(e) => setNewBatch({ ...newBatch, bakedWeight: e.target.value })} className="h-7 text-xs" />
                    </div>
                    <div>
                      <label className="text-[9px] text-muted-foreground">Height (mm)</label>
                      <Input type="number" placeholder="e.g. 35" value={newBatch.height || ''} onChange={(e) => setNewBatch({ ...newBatch, height: e.target.value })} className="h-7 text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] text-muted-foreground">Modifications applied</label>
                    <Input placeholder="e.g. chuño 15g, baking powder 3g" value={newBatch.modifications || ''} onChange={(e) => setNewBatch({ ...newBatch, modifications: e.target.value })} className="h-7 text-xs" />
                  </div>
                  <div>
                    <label className="text-[9px] text-muted-foreground">Notes</label>
                    <Input placeholder="Any observations, surprises, learnings" value={newBatch.notes || ''} onChange={(e) => setNewBatch({ ...newBatch, notes: e.target.value })} className="h-7 text-xs" />
                  </div>
                  <Button onClick={addBatch} size="sm" className="w-full h-8 text-xs gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Save real batch observation
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Batch list */}
          <div className="max-h-[350px] overflow-y-auto scroll-warm rounded-md border border-border">
            {batches.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No real batches logged yet. Add an actual bake observation to start building evidence.
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {batches.map((b) => (
                  <div key={b.id} className="p-2.5 text-xs hover:bg-accent/20 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium truncate">{b.variant.substring(0, 30)}</span>
                      <span className="font-mono text-[10px] text-muted-foreground flex-shrink-0">{b.date}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
                      <span>🌡 {b.temperature}°C · ⏱ {b.duration}min</span>
                      <span>Rise: {b.observedRise || '—'}</span>
                      <span>Color: {b.observedColor || '—'}</span>
                      <span>Crumb: {b.observedCrumb || '—'}</span>
                      {b.bakedWeight && <span>Weight: {b.bakedWeight}g</span>}
                      {b.height && <span>Height: {b.height}mm</span>}
                      {b.observedCollapse === 'yes' && <span className="text-rose-600 dark:text-rose-400">⚠ Collapse</span>}
                    </div>
                    {b.notes && <div className="text-[10px] text-muted-foreground mt-1 italic">{b.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          {batches.length > 0 && (
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={exportBatches} className="h-7 text-xs gap-1 flex-1">
                <Download className="h-3 w-3" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={clearBatches} className="h-7 text-xs gap-1 text-rose-600 hover:text-rose-700">
                <Trash2 className="h-3 w-3" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Keep this import for the CheckCircle2 icon used in the form
import { CheckCircle2 } from 'lucide-react'
