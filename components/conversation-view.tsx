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
import { AuditProcedureRecommendations } from '@/components/audit-procedure-recommendations'

const MAX_CHARS = 45000

interface EngagementData {
  client: string
  engagement: string
  usePreviousYear: boolean | null
}

interface ConversationViewProps {
  userPrompt: string
  engagementData?: EngagementData | null
}

// Parse the engagement and client out of the prompt
function parseEngagementFromPrompt(prompt: string): { client: string; engagement: string } {
  const match = prompt.match(/for (.+?) — (.+?)\./i)
  const client = match ? match[1] : 'the client'
  const engagement = match ? match[2] : 'the selected engagement'
  return { client, engagement }
}

function buildEngagementResponse(prompt: string): ResponseContent {
  const { client, engagement } = parseEngagementFromPrompt(prompt)

  const formLinks: FormLink[] = [
    { id: 'EM-DOC-001', label: `${engagement} — Prior Year Audit Workpapers`, url: '#engagement-manager' },
    { id: 'EM-DOC-002', label: `${engagement} — Trial Balance & General Ledger`, url: '#engagement-manager' },
    { id: 'EM-DOC-003', label: `${engagement} — Board Meeting Minutes`, url: '#engagement-manager' },
    { id: 'EM-DOC-004', label: `${engagement} — Financial Statements`, url: '#engagement-manager' },
  ]

  return {
    approachSteps: [
      `Access the existing engagement for ${client} in Engagement Manager and retrieve all attached documents, including prior year workpapers, trial balance, and board minutes.`,
      `Analyze the prior year audit findings, carryforward items, and previously documented risks to identify areas requiring attention in the current year.`,
      `Review the trial balance and general ledger for significant changes, unusual fluctuations, or new account activity since the prior year.`,
      `Synthesize findings across all available documents to inform risk assessment and audit procedure selection for the current engagement.`,
    ],
    paragraphs: [
      `I've reviewed the existing engagement for **${client}** in Engagement Manager. Based on the documents attached to **${engagement}**, I've analyzed the prior year audit workpapers, trial balance, general ledger, board meeting minutes, and other supporting materials.`,
      `The prior year audit workpapers show several carry-forward risk areas and open items from the prior engagement. Board minutes reference a restructuring of the treasury function and a new revenue stream from a licensing agreement — both of which will need to be reflected in this year's risk assessment.`,
      `The following documents from Engagement Manager have been reviewed and form the basis for the risk planning and audit procedure selection steps ahead:`,
    ],
    engagementManagerLink: {
      label: `View ${engagement} in Engagement Manager`,
      url: '#engagement-manager',
    },
    formLinks,
    previousYearNote: `Prior year audit findings reviewed: carryforward schedules, risk flags, and auditor sign-off notes from ${engagement} have been incorporated as the baseline for risk planning.`,
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
  const [exportReady, setExportReady] = useState(false)
  const [riskNextSteps, setRiskNextSteps] = useState<string[]>([])

  const handleAllRiskItemsComplete = useCallback(() => {
    setTimeout(() => setAuditProgramReady(true), 800)
  }, [])

  const handleRiskNextStepsChange = useCallback((steps: string[]) => {
    setRiskNextSteps(steps)
  }, [])

  const handleAllRecsReviewed = useCallback(() => {
    setExportReady(true)
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
                <div className="flex-1 min-w-0 space-y-3 text-sm leading-relaxed text-gray-800">
                  <p>
                    Based on the documents reviewed in Engagement Manager, I&apos;ve pre-populated the Guided Assurance risk planning forms — Forms 08–17 and PIN-CX-4.1 — using prior year audit findings, trial balance fluctuations, and board minutes. Key findings include a new licensing revenue stream and a treasury restructuring that affect Revenue (Form 09), Payroll (Form 17), and Internal Control (PIN-CX-4.1). Forms with open items that need your input are highlighted — navigate each form using the tabs, or toggle to focus only on what needs to be completed.
                  </p>
                  <RiskPlanningPanel
                    onAllComplete={handleAllRiskItemsComplete}
                    onSuggestedStepsChange={handleRiskNextStepsChange}
                  />
                  {/* Suggested next steps from open risk items */}
                  {riskNextSteps.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <Sparkles size={12} aria-hidden="true" />
                        Suggested next steps
                      </p>
                      {riskNextSteps.map((step) => (
                        <button
                          key={step}
                          className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 text-left"
                          style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
                        >
                          <span>{step}</span>
                          <ChevronRight size={14} className="shrink-0 text-gray-400" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Audit procedure recommendations — shown once risk planning is complete */}
          {auditProgramReady && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0" aria-label="CoCounsel">
                <TRSmallDot />
              </div>
              <div className="flex-1 min-w-0 space-y-3 text-sm leading-relaxed text-gray-800">
                <p>
                  Now that risk planning is complete, I&apos;ve reviewed the audit program and identified procedures that should be added or excluded based on the risk assessment. Review each recommendation below and accept or dismiss to finalize the program.
                </p>
                <AuditProcedureRecommendations onAllReviewed={handleAllRecsReviewed} />
              </div>
            </div>
          )}

          {/* Export to Guided Assurance — shown once all recommendations are reviewed */}
          {exportReady && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0" aria-label="CoCounsel">
                <TRSmallDot />
              </div>
              <div className="flex-1 min-w-0 space-y-3 text-sm leading-relaxed text-gray-800">
                <p>
                  All procedure recommendations have been reviewed. The updated audit program is ready to export — I&apos;ve applied all accepted additions and exclusions. Click below to send the finalized audit program to Guided Assurance, where you can open it to view the complete program with all procedures and assignments.
                </p>
                <div
                  className="rounded-xl border p-4 space-y-3"
                  style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)', backgroundColor: '#fafafa' }}
                >
                  <div className="flex items-center gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0" aria-hidden="true" />
                    <span>Audit program updated with accepted procedure changes</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0" aria-hidden="true" />
                    <span>Excluded procedures flagged and removed from program</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0" aria-hidden="true" />
                    <span>Risk linkages carried forward from planning forms</span>
                  </div>
                  <a
                    href="https://guidedassurance.thomsonreuters.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
                    style={{ backgroundColor: 'var(--saf-color-brand-orange, #D64000)' }}
                  >
                    Export to Guided Assurance
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                  <p className="text-center text-xs text-gray-400">
                    Opens Guided Assurance in a new tab with the full audit program loaded
                  </p>
                </div>
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
