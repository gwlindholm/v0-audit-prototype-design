'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { PromptInput } from '@/components/prompt-input'
import { TemplateChips } from '@/components/template-chips'

export function CoCounselHome() {
  const [_submitted, setSubmitted] = useState<string | null>(null)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar />

      {/* Top bar */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between border-b px-4"
          style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
        >
          <button
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            style={{ borderColor: 'var(--saf-color-brand-orange, #D64000)', color: 'var(--saf-color-brand-orange, #D64000)' }}
            aria-label="View all conversations"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            All conversations
          </button>

          <button
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            style={{ borderColor: 'var(--saf-color-neutral-300, #d1d5db)' }}
            aria-label="Developer tools"
          >
            <span className="font-mono text-xs text-gray-500">{'{ }'}</span>
            Developer
          </button>
        </header>

        {/* Main content */}
        <main className="flex flex-1 flex-col w-full items-center justify-center overflow-auto px-4 py-8 text-center">
          <div className="flex w-full max-w-2xl mx-auto flex-col items-center gap-6 text-center">
            {/* TR animated logo */}
            <div aria-hidden="true">
              <TRLargeLogo />
            </div>

            {/* Heading */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Your questions answered</h1>
              <p className="mt-1 text-sm text-gray-500">What are you working on today?</p>
            </div>

            {/* Prompt input */}
            <div className="w-full">
              <PromptInput onSubmit={(val) => setSubmitted(val)} />
            </div>

            {/* Template chips */}
            <TemplateChips onSelect={(template) => setSubmitted(template)} />
          </div>
        </main>
      </div>
    </div>
  )
}

function TRLargeLogo() {
  const dotCount = 20
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Thomson Reuters CoCounsel logo"
      role="img"
    >
      {Array.from({ length: dotCount }, (_, i) => {
        const angle = (i * 360) / dotCount
        const rad = (angle * Math.PI) / 180
        const r = 19
        const cx = 26 + r * Math.sin(rad)
        const cy = 26 - r * Math.cos(rad)
        // Vary size for a more organic look matching the screenshot
        const sizes = [2.8, 1.8, 2.2, 1.6, 2.5, 1.8, 2.0, 1.5, 2.8, 1.7, 2.2, 1.6, 2.5, 1.9, 2.0, 1.5, 2.8, 1.7, 2.2, 1.6]
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={sizes[i] ?? 2}
            fill="#D64000"
            opacity={0.6 + (i % 5) * 0.08}
          />
        )
      })}
    </svg>
  )
}
