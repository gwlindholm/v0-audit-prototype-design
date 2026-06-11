'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Plus,
  Paperclip,
  Copy,
  Sparkles,
  Mic,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'
import { RiskPlanningPanel } from '@/components/risk-planning-panel'
import { AuditProgramWorkspace } from '@/components/audit-program-workspace'

const MAX_CHARS = 45000

interface EngagementData {
  client: string
  startDate: string
  endDate: string
  keyAuditAreas: string[]
  usePreviousYear: boolean | null
}

interface ConversationViewProps {
  userPrompt: string
  engagementData?: EngagementData | null
}

// Parse the engagement context out of the prompt if no structured data provided
function parseEngagementFromPrompt(prompt: string): Partial<EngagementData> {
  const clientMatch = prompt.match(/for (.+?)\./i)
  const client = clientMatch ? clientMatch[1] : 'the client'
  const areasMatch = prompt.match(/Key audit areas to address: (.+?)\./i)
  const areas = areasMatch ? areasMatch[1].split(', ') : []
  return { client, keyAuditAreas: areas }
}

function buildEngagementResponse(prompt: string): ResponseContent {
  const parsed = parseEngagementFromPrompt(prompt)
  const client = parsed.client ?? 'the client'
  const areas = parsed.keyAuditAreas ?? []

  const formLinks: FormLink[] = areas.slice(0, 6).map((area, i) => ({
    id: `GA-${2024 + i}-${String(i + 1).padStart(3, '0')}`,
    label: `${area} — Guided Assurance Form`,
    url: '#guided-assurance',
  }))

  return {
    approachSteps: [
      `Pull prior year engagement binder for ${client} from Engagement Manager and identify carryforward items, roll-forward schedules, and previously noted risks.`,
      `Create a new engagement binder in Engagement Manager pre-populated with the selected audit areas and applicable period dates.`,
      `Source the required Guided Assurance forms for each selected audit area and attach them to the new engagement binder.`,
      `Cross-reference prior year risk assessments and auditor notes to flag recommended procedure changes for the current engagement.`,
    ],
    paragraphs: [
      `I've set up a new audit engagement binder for **${client}** in Engagement Manager. The binder has been pre-populated with the engagement period and the ${areas.length} selected audit areas. You can view and access the engagement directly in Engagement Manager using the link below.`,
      `While setting up this engagement, I referenced the prior year documentation for ${client}. Based on that review, I've flagged several carry-forward risk items and recommended procedure updates — these are noted inline within the relevant Guided Assurance forms.`,
      `The following Guided Assurance forms have been pulled in and attached to the engagement binder based on your selected audit areas. Each form is pre-linked to its corresponding risk and procedure sections from the prior year:`,
    ],
    engagementManagerLink: {
      label: `View engagement for ${client} in Engagement Manager`,
      url: '#engagement-manager',
    },
    formLinks,
    previousYearNote: `Prior year documentation reviewed: carryforward schedules, risk assessments, and auditor sign-off notes have been incorporated as starting points in the relevant forms above.`,
  }
}

interface FormLink {
  id: string
  label: string
  url: string
}

interface ResponseContent {
  approachSteps: string[]
  paragraphs: string[]
  engagementManagerLink: { label: string; url: string }
  formLinks: FormLink[]
  previousYearNote: string
}

const NEXT_STEPS = [
  { label: 'Add additional documents from client', icon: 'plus' },
  { label: 'Identify risks', icon: 'arrow' },
]

// Typing speed in ms per character
const TYPING_SPEED = 8

export function ConversationView({ userPrompt }: ConversationViewProps) {
  const [followUpValue, setFollowUpValue] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [displayedParagraphs, setDisplayedParagraphs] = useState<string[]>([])
  const [showApproach, setShowApproach] = useState(false)
  const [showLinks, setShowLinks] = useState(false)
  const [showPrevYear, setShowPrevYear] = useState(false)
  const [showNextSteps, setShowNextSteps] = useState(false)
  const [currentParaIndex, setCurrentParaIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [identifyRisksClicked, setIdentifyRisksClicked] = useState(false)
  const [auditProgramReady, setAuditProgramReady] = useState(false)
  const [showAuditProgram, setShowAuditProgram] = useState(false)

  const handleAllRiskItemsComplete = useCallback(() => {
    setTimeout(() => setAuditProgramReady(true), 1000)
  }, [])

  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const responseContent = useRef<ResponseContent>(buildEngagementResponse(userPrompt))
  const rc = responseContent.current

  // Auto-scroll to bottom as content streams in
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  })

  // Sequence: approach box -> paragraph 0 -> paragraph 1 -> paragraph 2 -> links -> prev year -> next steps
  useEffect(() => {
    const timer = setTimeout(() => setShowApproach(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!showApproach) return
    const timer = setTimeout(() => {
      setCurrentParaIndex(0)
      setCurrentCharIndex(0)
    }, 600)
    return () => clearTimeout(timer)
  }, [showApproach])

  // Character-by-character streaming for paragraphs
  useEffect(() => {
    if (!showApproach) return
    if (currentParaIndex >= rc.paragraphs.length) return

    const full = rc.paragraphs[currentParaIndex]
    if (currentCharIndex < full.length) {
      const timer = setTimeout(() => {
        setCurrentCharIndex((c) => c + 1)
        const partial = full.slice(0, currentCharIndex + 1)
        setDisplayedParagraphs((prev) => {
          const next = [...prev]
          next[currentParaIndex] = partial
          return next
        })
      }, TYPING_SPEED)
      return () => clearTimeout(timer)
    } else {
      // Paragraph done — move to next
      if (currentParaIndex + 1 < rc.paragraphs.length) {
        const timer = setTimeout(() => {
          setCurrentParaIndex((p) => p + 1)
          setCurrentCharIndex(0)
        }, 200)
        return () => clearTimeout(timer)
      } else {
        // All paragraphs done
        const t1 = setTimeout(() => setShowLinks(true), 300)
        const t2 = setTimeout(() => setShowPrevYear(true), 700)
        const t3 = setTimeout(() => {
          setIsTyping(false)
          setShowNextSteps(true)
        }, 1200)
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
      }
    }
  }, [showApproach, currentParaIndex, currentCharIndex, rc.paragraphs])

  const handleFollowUp = () => {
    if (followUpValue.trim()) {
      // Future: extend conversation
      setFollowUpValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleFollowUp()
    }
  }

  // Render bold markdown (**text**)
  const renderBold = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    )
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Scrollable message area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6"
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className="mx-auto max-w-2xl space-y-8">

          {/* User message */}
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
              style={{ backgroundColor: 'var(--saf-color-brand-orange, #D64000)' }}
              aria-label="User avatar"
            >
              GR
            </div>
            <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
              {userPrompt}
            </p>
          </div>

          {/* CoCounsel response */}
          {showApproach && (
            <div className="flex items-start gap-3">
              {/* CoCounsel logo dot */}
              <div className="mt-0.5 shrink-0" aria-label="CoCounsel">
                <TRSmallDot />
              </div>

              <div className="flex-1 space-y-4 text-sm leading-relaxed text-gray-800">
                {/* My Approach box */}
                <div
                  className="rounded-lg border p-4"
                  style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)', backgroundColor: '#fafafa' }}
                >
                  <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <span aria-hidden="true">💡</span>
                    My Approach
                  </div>
                  <ol className="space-y-2 text-sm text-gray-700">
                    {rc.approachSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: 'var(--saf-color-brand-orange, #D64000)' }}
                          aria-hidden="true"
                        >
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Streaming paragraphs */}
                {displayedParagraphs.map((text, i) => (
                  <p key={i}>{renderBold(text)}{isTyping && i === currentParaIndex && (
                    <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-gray-400 align-middle" aria-hidden="true" />
                  )}</p>
                ))}

                {/* Engagement Manager link */}
                {showLinks && (
                  <div
                    className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
                    style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
                  >
                    <CheckCircle2 size={15} style={{ color: 'var(--saf-color-brand-orange, #D64000)' }} aria-hidden="true" />
                    <a
                      href={rc.engagementManagerLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 hover:underline"
                      style={{ color: 'var(--saf-color-brand-orange, #D64000)' }}
                    >
                      {rc.engagementManagerLink.label}
                    </a>
                    <ExternalLink size={13} className="text-gray-400 shrink-0" aria-hidden="true" />
                  </div>
                )}

                {/* Guided Assurance form links */}
                {showLinks && rc.formLinks.length > 0 && (
                  <div className="space-y-1.5">
                    {rc.formLinks.map((form) => (
                      <div
                        key={form.id}
                        className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-gray-50"
                        style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
                      >
                        <span className="shrink-0 font-mono text-[10px] text-gray-400">{form.id}</span>
                        <a
                          href={form.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-gray-700 hover:underline"
                        >
                          {form.label}
                        </a>
                        <ExternalLink size={12} className="text-gray-400 shrink-0" aria-hidden="true" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Previous year note */}
                {showPrevYear && (
                  <p className="rounded-lg border-l-2 pl-3 text-sm text-gray-600 italic"
                    style={{ borderColor: 'var(--saf-color-brand-orange, #D64000)' }}
                  >
                    {rc.previousYearNote}
                  </p>
                )}

                {/* Feedback icons */}
                {!isTyping && (
                  <div className="flex items-center gap-3 pt-1">
                    {[
                      { label: 'Copy response', icon: 'copy' },
                      { label: 'Thumbs up', icon: 'up' },
                      { label: 'Thumbs down', icon: 'down' },
                    ].map(({ label, icon }) => (
                      <button
                        key={label}
                        aria-label={label}
                        className="text-gray-400 transition-colors hover:text-gray-600"
                      >
                        {icon === 'copy' && <CopyIcon />}
                        {icon === 'up' && <ThumbUpIcon />}
                        {icon === 'down' && <ThumbDownIcon />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next steps */}
          {showNextSteps && (
            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Sparkles size={12} aria-hidden="true" />
                Suggested next steps
              </p>
              {NEXT_STEPS.map(({ label, icon }) => (
                <button
                  key={label}
                  onClick={() => {
                    if (label === 'Identify risks') {
                      setIdentifyRisksClicked(true)
                    }
                  }}
                  className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 text-left"
                  style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
                >
                  <div className="flex items-center gap-2.5">
                    {icon === 'plus' ? (
                      <Plus size={14} className="text-gray-400 shrink-0" aria-hidden="true" />
                    ) : (
                      <ChevronRight size={14} className="text-gray-400 shrink-0" aria-hidden="true" />
                    )}
                    {label}
                  </div>
                  <ChevronRight size={14} className="text-gray-400 shrink-0" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}

          {/* Risk planning panel — appended as a new turn when Identify risks is clicked */}
          {identifyRisksClicked && (
            <>
              {/* User turn */}
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                  style={{ backgroundColor: 'var(--saf-color-brand-orange, #D64000)' }}
                  aria-label="User avatar"
                >
                  GR
                </div>
                <p className="text-sm leading-relaxed text-gray-800">Identify risks</p>
              </div>

              {/* CoCounsel response turn */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0" aria-label="CoCounsel">
                  <TRSmallDot />
                </div>
                <div className="flex-1 space-y-3 text-sm leading-relaxed text-gray-800">
                  <p>
                    I&apos;ve pulled the Risk Planning forms from Guided Assurance for each of your selected audit areas and pre-filled them using prior year documentation. Forms with outstanding items are highlighted — use the tabs to navigate each form, or toggle to focus on open items only.
                  </p>
                  <RiskPlanningPanel onAllComplete={handleAllRiskItemsComplete} />
                </div>
              </div>
            </>
          )}

          {/* Audit program ready — CoCounsel message turn */}
          {auditProgramReady && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0" aria-label="CoCounsel">
                <TRSmallDot />
              </div>
              <div className="flex-1 space-y-3 text-sm leading-relaxed text-gray-800">
                <p>
                  Now that risk planning and assessment is complete, I&apos;ve started drafting the audit program for you. Procedures have been pre-selected based on the risk levels and assessments documented in the risk planning forms.
                </p>
                <button
                  onClick={() => setShowAuditProgram(true)}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: 'var(--saf-color-brand-orange, #D64000)' }}
                >
                  Open audit program
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} aria-hidden="true" />
        </div>
      </div>

      {/* Fixed follow-up input */}
      <div
        className="shrink-0 border-t px-4 py-3"
        style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
      >
        <div
          className="mx-auto max-w-2xl rounded-2xl border bg-white"
          style={{ borderColor: 'var(--saf-color-neutral-300, #d1d5db)' }}
        >
          <textarea
            value={followUpValue}
            onChange={(e) => setFollowUpValue(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            placeholder="Ask CoCounsel a follow up question..."
            aria-label="Ask CoCounsel a follow up question"
            rows={2}
            className="w-full resize-none rounded-t-2xl bg-transparent px-4 pt-3 pb-2 text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
          <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
            <div className="flex items-center gap-1">
              <ToolbarButton icon={Plus} label="Add content" />
              <ToolbarButton icon={Paperclip} label="Attach file" />
              <ToolbarButton icon={Copy} label="Copy" />
              <ToolbarButton icon={Sparkles} label="AI suggestions" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {followUpValue.length.toLocaleString()}/{MAX_CHARS.toLocaleString()}
              </span>
              <ToolbarButton icon={Mic} label="Voice input" />
              <button
                onClick={handleFollowUp}
                disabled={!followUpValue.trim()}
                aria-label="Send follow-up"
                className="flex h-7 w-7 items-center justify-center rounded-full transition-colors disabled:opacity-40"
                style={{
                  backgroundColor: followUpValue.trim()
                    ? 'var(--saf-color-brand-orange, #D64000)'
                    : 'var(--saf-color-neutral-200, #e5e7eb)',
                }}
              >
                <ArrowRight size={14} className={followUpValue.trim() ? 'text-white' : 'text-gray-400'} />
              </button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-gray-400">
          CoCounsel uses generative AI. Verify all data and responses for accuracy.
        </p>
      </div>

      {/* Audit program workspace overlay */}
      {showAuditProgram && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white">
          <AuditProgramWorkspace onClose={() => setShowAuditProgram(false)} />
        </div>
      )}
    </div>
  )
}

// ─── Small inline icons ───────────────────────────────────────────────────────

function TRSmallDot() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 360) / 12
        const rad = (angle * Math.PI) / 180
        const r = 8
        const cx = 12 + r * Math.sin(rad)
        const cy = 12 - r * Math.cos(rad)
        return <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 1.6 : 1.1} fill="#D64000" opacity={0.7 + (i % 4) * 0.1} />
      })}
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function ThumbUpIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  )
}

function ThumbDownIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
      <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
    </svg>
  )
}

function ToolbarButton({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
}) {
  return (
    <button
      aria-label={label}
      title={label}
      className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
    >
      <Icon size={15} />
    </button>
  )
}
