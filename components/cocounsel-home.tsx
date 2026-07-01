'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { PromptInput } from '@/components/prompt-input'
import { TemplateChips } from '@/components/template-chips'
import { NewEngagementTemplate } from '@/components/new-engagement-template'
import { ConversationView } from '@/components/conversation-view'

export function CoCounselHome() {
  const [prefillPrompt, setPrefillPrompt] = useState<string>('')
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null)
  const [conversationPrompt, setConversationPrompt] = useState<string | null>(null)

  const handleTemplateSelect = (template: string) => {
    if (template === 'Create Audit Plan') {
      setActiveTemplate('new-engagement')
    }
  }

  const handleEngagementUse = (data: {
    client: string
    startDate: string
    endDate: string
    keyAuditAreas: string[]
    usePreviousYear: boolean | null
  }) => {
    const fmt = (d: string) => {
      if (!d) return d
      const [y, m, day] = d.split('-')
      return `${m}/${day}/${y}`
    }

    const areasList = data.keyAuditAreas.join(', ')
    const previousYear = data.usePreviousYear ? 'Yes' : 'No'

    const prompt = [
      `Start a new audit engagement for ${data.client}.`,
      ``,
      `Engagement period: ${fmt(data.startDate)} – ${fmt(data.endDate)}.`,
      ``,
      `Key audit areas to address: ${areasList}.`,
      ``,
      `Use previous year's engagement to recommend audit risk and procedure changes: ${previousYear}.`,
      ``,
      `Please generate an audit engagement plan including recommended audit procedures, identified risk areas, and any changes from the prior year engagement based on the selected parameters above.`,
    ].join('\n')

    setActiveTemplate(null)
    setPrefillPrompt(prompt)
  }

  const isInConversation = conversationPrompt !== null

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex h-12 shrink-0 items-center justify-between border-b px-4"
          style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
        >
          <button
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50"
            style={{ borderColor: 'var(--saf-color-brand-orange, #D64000)', color: 'var(--saf-color-brand-orange, #D64000)' }}
            aria-label="View all conversations"
            onClick={() => {
              if (isInConversation) {
                setConversationPrompt(null)
                setPrefillPrompt('')
              }
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            All conversations
          </button>

          {isInConversation && (
            <p className="text-sm font-semibold text-gray-800 text-balance text-center">
              New Audit Engagement
            </p>
          )}

          <button
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            style={{ borderColor: 'var(--saf-color-neutral-300, #d1d5db)' }}
            aria-label="Developer tools"
          >
            <span className="font-mono text-xs text-gray-500">{'{ }'}</span>
            Developer
          </button>
        </header>

        {/* Conversation view */}
        {isInConversation ? (
          <main className="flex flex-1 flex-col overflow-hidden">
            <ConversationView userPrompt={conversationPrompt} />
          </main>
        ) : (
          /* Home / prompt view */
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

              {/* Prompt input or active template */}
              <div className="w-full">
                {activeTemplate === 'new-engagement' ? (
                  <NewEngagementTemplate
                    onRemove={() => setActiveTemplate(null)}
                    onUse={handleEngagementUse}
                  />
                ) : (
                  <PromptInput
                    initialValue={prefillPrompt}
                    onSubmit={(val) => setConversationPrompt(val)}
                  />
                )}
              </div>

              {/* Template chips — hide when a template is active */}
              {activeTemplate === null && (
                <TemplateChips onSelect={handleTemplateSelect} />
              )}
            </div>
          </main>
        )}
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
