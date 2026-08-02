'use client'

import { FlaskConical, Scale, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-3 gap-6 text-xs">
          <div>
            <div className="flex items-center gap-2 font-semibold text-sm mb-2">
              <FlaskConical className="h-4 w-4 text-primary" />
              Chongoyape Bizcochuelos Lab
            </div>
            <p className="text-muted-foreground leading-relaxed">
              An evidence-gated reverse-engineering study of the Bizcochuelos Valera. Built on a
              Red–Green–Refactor validation protocol with adversarial challenge and parsimony reviews.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 font-semibold text-sm mb-2">
              <Scale className="h-4 w-4 text-primary" />
              Honesty & limits
            </div>
            <ul className="space-y-1 text-muted-foreground leading-relaxed list-disc pl-4">
              <li>Visual evidence is VLM-analysed and treated as provisional.</li>
              <li>Kitchen validation rounds are labelled <em>predicted</em> — not executed in this environment.</li>
              <li>Historical plausibility is never presented as proof.</li>
              <li>Smoke, algarrobina, and chuño remain outside the core formula until tested.</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 font-semibold text-sm mb-2">
              <Heart className="h-4 w-4 text-primary" />
              Sources
            </div>
            <ul className="space-y-1 text-muted-foreground leading-relaxed list-disc pl-4">
              <li>RPP Noticias — Valera family reportaje (YouTube)</li>
              <li>Restaurant Guru — Bizcochuelos Valera, Chongoyape</li>
              <li>Yanuq, Cookpad — Peruvian bizcochuelo recipes</li>
              <li>Food-science literature on egg-foam &amp; starch mechanics</li>
              <li>Product image — primary evidence (VLM-analysed)</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <div>
            Phase 0 · Memory audit complete · Convergence pending kitchen execution
          </div>
          <div className="font-mono">
            v0.1 · {new Date().getFullYear()} · Reverse-engineering lab
          </div>
        </div>
      </div>
    </footer>
  )
}
