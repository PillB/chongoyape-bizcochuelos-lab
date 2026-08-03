'use client'

import { FlaskConical, Scale, Heart, ArrowUp } from 'lucide-react'

export function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="mt-auto border-t-2 border-primary/20 bg-gradient-to-b from-muted/40 to-muted/70 relative">
      {/* Decorative top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Dotted divider pattern */}
      <div className="divider-dots opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-3 gap-8 text-xs">
          <div>
            <div className="flex items-center gap-2 font-semibold text-sm mb-3 text-foreground">
              <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                <FlaskConical className="h-3.5 w-3.5 text-primary" />
              </div>
              Chongoyape Bizcochuelos Lab
            </div>
            <p className="text-muted-foreground leading-relaxed">
              An evidence-gated reverse-engineering study of the Bizcochuelos Valera. Built on a
              Red–Green–Refactor validation protocol with adversarial challenge and parsimony reviews.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['evidence-led', 'foam-only', 'parsimony-bound', 'Lima-tested'].map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/5 text-primary/80 border border-primary/15"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 font-semibold text-sm mb-3 text-foreground">
              <div className="w-7 h-7 rounded-md bg-amber-100 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
                <Scale className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              Honesty &amp; limits
            </div>
            <ul className="space-y-1.5 text-muted-foreground leading-relaxed list-none">
              <li className="flex gap-1.5">
                <span className="text-amber-500 flex-shrink-0">▸</span>
                <span>Visual evidence is VLM-analysed and treated as provisional.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="text-amber-500 flex-shrink-0">▸</span>
                <span>Kitchen validation rounds are labelled <em>predicted</em> — not executed in this environment.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="text-amber-500 flex-shrink-0">▸</span>
                <span>Historical plausibility is never presented as proof.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="text-amber-500 flex-shrink-0">▸</span>
                <span>Smoke, algarrobina, and chuño remain outside the core formula until tested.</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 font-semibold text-sm mb-3 text-foreground">
              <div className="w-7 h-7 rounded-md bg-rose-100 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center">
                <Heart className="h-3.5 w-3.5 text-rose-500" />
              </div>
              Sources
            </div>
            <ul className="space-y-1.5 text-muted-foreground leading-relaxed list-none">
              <li className="flex gap-1.5">
                <span className="text-primary flex-shrink-0">·</span>
                <span>RPP Noticias — Valera family reportaje (YouTube)</span>
              </li>
              <li className="flex gap-1.5">
                <span className="text-primary flex-shrink-0">·</span>
                <span>Restaurant Guru — Bizcochuelos Valera, Chongoyape</span>
              </li>
              <li className="flex gap-1.5">
                <span className="text-primary flex-shrink-0">·</span>
                <span>Yanuq, Cookpad — Peruvian bizcochuelo recipes</span>
              </li>
              <li className="flex gap-1.5">
                <span className="text-primary flex-shrink-0">·</span>
                <span>Food-science literature on egg-foam &amp; starch mechanics</span>
              </li>
              <li className="flex gap-1.5">
                <span className="text-primary flex-shrink-0">·</span>
                <span>Product image — primary evidence (VLM-analysed)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 align-middle" />
              Phase 0 · Memory audit complete
            </span>
            <span className="text-border">·</span>
            <span className="text-amber-600 dark:text-amber-400">Convergence pending kitchen execution</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={scrollTop}
              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ArrowUp className="h-3 w-3" />
              Back to top
            </button>
            <span className="text-border">·</span>
            <span className="font-mono">v0.2 · {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
