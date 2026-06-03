'use client'

import { useState } from 'react'
import { CheckCircle2, ChevronRight, ExternalLink, AlertCircle } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface OpenItem {
  id: string
  formId: string
  section: string
  question: string
  type: 'text' | 'select' | 'yesno' | 'risk'
  options?: string[]
  prefill?: string
  riskLevel?: 'high' | 'medium' | 'low'
}

interface RiskForm {
  id: string
  title: string
  area: string
  openItems: number
  totalItems: number
  complete: boolean
  url: string
}

const RISK_FORMS: RiskForm[] = [
  { id: 'GA-RP-001', title: 'Revenue — Risk Assessment', area: 'Revenue', openItems: 3, totalItems: 8, complete: false, url: '#' },
  { id: 'GA-RP-002', title: 'Accounts Receivable — Risk Assessment', area: 'Accounts Receivable', openItems: 2, totalItems: 7, complete: false, url: '#' },
  { id: 'GA-RP-003', title: 'Inventory & Cost of Sales — Risk Planning', area: 'Inventory and Cost of Sales', openItems: 4, totalItems: 10, complete: false, url: '#' },
  { id: 'GA-RP-004', title: 'Cash — Risk Assessment', area: 'Cash', openItems: 0, totalItems: 6, complete: true, url: '#' },
  { id: 'GA-RP-005', title: 'Payroll Liabilities — Risk Planning', area: 'Payroll Liabilities and Related Expenses', openItems: 2, totalItems: 8, complete: false, url: '#' },
  { id: 'GA-RP-006', title: 'Income Taxes — Risk Assessment', area: 'Income Taxes', openItems: 1, totalItems: 6, complete: false, url: '#' },
  { id: 'GA-RP-007', title: 'Equity — Risk Assessment', area: 'Equity', openItems: 0, totalItems: 5, complete: true, url: '#' },
  { id: 'GA-RP-008', title: 'Accounts Payable & Other Liabilities', area: 'Accounts Payable and Other Liabilities', openItems: 3, totalItems: 9, complete: false, url: '#' },
]

const OPEN_ITEMS: OpenItem[] = [
  {
    id: 'OI-001',
    formId: 'GA-RP-001',
    section: 'Revenue — Risk Assessment',
    question: 'Has management identified any significant changes to revenue recognition policies from the prior year?',
    type: 'yesno',
    prefill: '',
    riskLevel: 'high',
  },
  {
    id: 'OI-002',
    formId: 'GA-RP-001',
    section: 'Revenue — Risk Assessment',
    question: 'Describe any new revenue streams or contract types introduced during the engagement period.',
    type: 'text',
    prefill: '',
    riskLevel: 'medium',
  },
  {
    id: 'OI-003',
    formId: 'GA-RP-001',
    section: 'Revenue — Risk Assessment',
    question: 'Assessed risk level for revenue recognition completeness',
    type: 'risk',
    options: ['High', 'Medium', 'Low'],
    prefill: 'High',
    riskLevel: 'high',
  },
  {
    id: 'OI-004',
    formId: 'GA-RP-002',
    section: 'Accounts Receivable — Risk Assessment',
    question: 'Does the client have significant concentrations of credit risk with any single customer exceeding 10% of total AR?',
    type: 'yesno',
    prefill: '',
    riskLevel: 'medium',
  },
  {
    id: 'OI-005',
    formId: 'GA-RP-002',
    section: 'Accounts Receivable — Risk Assessment',
    question: 'Describe the aging profile changes from prior year and any new collectability concerns noted.',
    type: 'text',
    prefill: 'Prior year showed 12% of AR over 90 days. Recommend assessing for changes in allowance methodology.',
    riskLevel: 'medium',
  },
  {
    id: 'OI-006',
    formId: 'GA-RP-003',
    section: 'Inventory & Cost of Sales — Risk Planning',
    question: 'Has the client changed its inventory costing method (FIFO, LIFO, weighted average) from prior year?',
    type: 'yesno',
    prefill: '',
    riskLevel: 'high',
  },
  {
    id: 'OI-007',
    formId: 'GA-RP-003',
    section: 'Inventory & Cost of Sales — Risk Planning',
    question: 'Were there any inventory write-downs or obsolescence charges in the prior year that may recur?',
    type: 'yesno',
    prefill: '',
    riskLevel: 'high',
  },
  {
    id: 'OI-008',
    formId: 'GA-RP-003',
    section: 'Inventory & Cost of Sales — Risk Planning',
    question: 'Identify locations where physical inventory counts will be performed and confirm observation dates.',
    type: 'text',
    prefill: '',
    riskLevel: 'medium',
  },
  {
    id: 'OI-009',
    formId: 'GA-RP-003',
    section: 'Inventory & Cost of Sales — Risk Planning',
    question: 'Assessed overall risk level for inventory valuation',
    type: 'risk',
    options: ['High', 'Medium', 'Low'],
    prefill: 'High',
    riskLevel: 'high',
  },
  {
    id: 'OI-010',
    formId: 'GA-RP-005',
    section: 'Payroll Liabilities — Risk Planning',
    question: 'Are there any new compensation arrangements (equity-based, bonus, deferred) not present in prior year?',
    type: 'yesno',
    prefill: '',
    riskLevel: 'medium',
  },
  {
    id: 'OI-011',
    formId: 'GA-RP-005',
    section: 'Payroll Liabilities — Risk Planning',
    question: 'Summarize any changes to benefit plan terms or actuarial assumptions from prior year.',
    type: 'text',
    prefill: '',
    riskLevel: 'low',
  },
  {
    id: 'OI-012',
    formId: 'GA-RP-006',
    section: 'Income Taxes — Risk Assessment',
    question: 'Has the client entered any new jurisdictions or changed its tax filing positions from prior year?',
    type: 'yesno',
    prefill: '',
    riskLevel: 'medium',
  },
  {
    id: 'OI-013',
    formId: 'GA-RP-008',
    section: 'Accounts Payable & Other Liabilities',
    question: 'Are there any significant new vendor agreements or liabilities not present in the prior year balance sheet?',
    type: 'yesno',
    prefill: '',
    riskLevel: 'medium',
  },
  {
    id: 'OI-014',
    formId: 'GA-RP-008',
    section: 'Accounts Payable & Other Liabilities',
    question: 'Describe any accrued liabilities that were not settled from prior year and explain carryforward rationale.',
    type: 'text',
    prefill: 'Per prior year: accrued legal reserve of $240K carried forward pending resolution.',
    riskLevel: 'high',
  },
  {
    id: 'OI-015',
    formId: 'GA-RP-008',
    section: 'Accounts Payable & Other Liabilities',
    question: 'Assessed risk level for accounts payable completeness',
    type: 'risk',
    options: ['High', 'Medium', 'Low'],
    prefill: 'Medium',
    riskLevel: 'medium',
  },
]

// ─── Open Item Card ────────────────────────────────────────────────────────────

function OpenItemCard({ item, onComplete }: { item: OpenItem; onComplete: (id: string) => void }) {
  const [value, setValue] = useState(item.prefill ?? '')
  const [yesNo, setYesNo] = useState<'yes' | 'no' | null>(null)
  const [risk, setRisk] = useState(item.prefill ?? '')
  const [done, setDone] = useState(false)

  const riskColors: Record<string, string> = {
    high: '#B91C1C',
    medium: '#D97706',
    low: '#15803D',
  }
  const riskBg: Record<string, string> = {
    high: '#FEF2F2',
    medium: '#FFFBEB',
    low: '#F0FDF4',
  }

  if (done) {
    return (
      <div
        className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm text-gray-500"
        style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)', backgroundColor: '#fafafa' }}
      >
        <CheckCircle2 size={15} style={{ color: '#15803D' }} aria-hidden="true" />
        <span className="text-xs">{item.section} — response saved</span>
      </div>
    )
  }

  const canSave =
    item.type === 'yesno' ? yesNo !== null :
    item.type === 'risk' ? risk !== '' :
    value.trim() !== ''

  const handleSave = () => {
    setDone(true)
    onComplete(item.id)
  }

  return (
    <div
      className="rounded-xl border bg-white p-4 space-y-3"
      style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{item.section}</p>
          <span className="font-mono text-[10px] text-gray-300">{item.id} · {item.formId}</span>
        </div>
        {item.riskLevel && (
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
            style={{
              color: riskColors[item.riskLevel],
              backgroundColor: riskBg[item.riskLevel],
            }}
          >
            {item.riskLevel} risk
          </span>
        )}
      </div>

      {/* Question */}
      <p className="text-sm leading-relaxed text-gray-800">{item.question}</p>

      {/* Input */}
      {item.type === 'yesno' && (
        <div className="flex gap-2" role="group" aria-label="Yes or no">
          {(['yes', 'no'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setYesNo(opt)}
              className="flex-1 rounded-lg border py-2 text-sm font-medium capitalize transition-colors"
              style={{
                borderColor: yesNo === opt ? 'var(--saf-color-brand-orange, #D64000)' : 'var(--saf-color-neutral-200, #e5e7eb)',
                color: yesNo === opt ? 'var(--saf-color-brand-orange, #D64000)' : '#6B7280',
                backgroundColor: yesNo === opt ? '#FFF5F0' : 'transparent',
              }}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      )}

      {item.type === 'text' && (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          placeholder="Enter your response..."
          className="w-full resize-none rounded-lg border px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-1"
          style={{
            borderColor: 'var(--saf-color-neutral-200, #e5e7eb)',
            // @ts-ignore
            '--tw-ring-color': 'var(--saf-color-brand-orange, #D64000)',
          }}
        />
      )}

      {item.type === 'risk' && item.options && (
        <div className="flex gap-2" role="group" aria-label="Risk level">
          {item.options.map((opt) => (
            <button
              key={opt}
              onClick={() => setRisk(opt)}
              className="flex-1 rounded-lg border py-2 text-sm font-medium transition-colors"
              style={{
                borderColor: risk === opt ? riskColors[opt.toLowerCase()] : 'var(--saf-color-neutral-200, #e5e7eb)',
                color: risk === opt ? riskColors[opt.toLowerCase()] : '#6B7280',
                backgroundColor: risk === opt ? riskBg[opt.toLowerCase()] : 'transparent',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-opacity disabled:opacity-40"
          style={{ backgroundColor: 'var(--saf-color-brand-orange, #D64000)' }}
        >
          Save response
        </button>
      </div>
    </div>
  )
}

// ─── Workspace View ────────────────────────────────────────────────────────────

export function WorkspaceView() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)

  const handleComplete = (id: string) => {
    setCompletedIds((prev) => new Set([...prev, id]))
  }

  const filteredItems = selectedFormId
    ? OPEN_ITEMS.filter((item) => item.formId === selectedFormId)
    : OPEN_ITEMS

  const totalOpen = OPEN_ITEMS.length - completedIds.size
  const formsWithUpdatedCounts = RISK_FORMS.map((form) => {
    const formCompleted = [...completedIds].filter((id) => {
      const item = OPEN_ITEMS.find((oi) => oi.id === id)
      return item?.formId === form.id
    }).length
    const remaining = form.openItems - formCompleted
    return { ...form, currentOpen: Math.max(0, remaining), isComplete: form.complete || remaining === 0 }
  })

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left panel: Open items ── */}
      <div className="flex w-[55%] flex-col overflow-hidden border-r" style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}>
        {/* Panel header */}
        <div className="shrink-0 border-b px-5 py-4" style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Open items</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {totalOpen} item{totalOpen !== 1 ? 's' : ''} need{totalOpen === 1 ? 's' : ''} your attention
                {selectedFormId && (
                  <> &mdash; filtered to <span className="font-medium text-gray-700">{selectedFormId}</span></>
                )}
              </p>
            </div>
            {selectedFormId && (
              <button
                onClick={() => setSelectedFormId(null)}
                className="text-xs font-medium hover:underline"
                style={{ color: 'var(--saf-color-brand-orange, #D64000)' }}
              >
                Show all
              </button>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
              <CheckCircle2 size={32} style={{ color: '#15803D' }} />
              <p className="text-sm font-medium text-gray-600">All items complete</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <OpenItemCard key={item.id} item={item} onComplete={handleComplete} />
            ))
          )}
        </div>
      </div>

      {/* ── Right panel: Document list ── */}
      <div className="flex w-[45%] flex-col overflow-hidden bg-gray-50">
        {/* Panel header */}
        <div className="shrink-0 border-b px-5 py-4" style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)', backgroundColor: 'white' }}>
          <h2 className="text-sm font-semibold text-gray-900">Risk Planning documents</h2>
          <p className="text-xs text-gray-500 mt-0.5">Guided Assurance forms — pre-filled from prior year</p>
        </div>

        {/* Form list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {formsWithUpdatedCounts.map((form) => {
            const isSelected = selectedFormId === form.id
            return (
              <button
                key={form.id}
                onClick={() => setSelectedFormId(isSelected ? null : form.id)}
                className="flex w-full items-start gap-3 rounded-xl border bg-white px-4 py-3 text-left transition-all hover:shadow-sm"
                style={{
                  borderColor: isSelected ? 'var(--saf-color-brand-orange, #D64000)' : 'var(--saf-color-neutral-200, #e5e7eb)',
                  boxShadow: isSelected ? '0 0 0 1px var(--saf-color-brand-orange, #D64000)' : undefined,
                }}
                aria-pressed={isSelected}
              >
                {/* Status icon */}
                <div className="mt-0.5 shrink-0">
                  {form.isComplete ? (
                    <CheckCircle2 size={16} style={{ color: '#15803D' }} aria-label="Complete" />
                  ) : (
                    <AlertCircle size={16} style={{ color: '#D97706' }} aria-label={`${form.currentOpen} open items`} />
                  )}
                </div>

                {/* Title & meta */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-snug">{form.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{form.id} &middot; {form.totalItems} items total</p>
                </div>

                {/* Badge or check */}
                <div className="shrink-0 flex items-center gap-1.5">
                  {form.isComplete ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                      Complete
                    </span>
                  ) : (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                      style={{ backgroundColor: 'var(--saf-color-brand-orange, #D64000)' }}
                    >
                      {form.currentOpen} open
                    </span>
                  )}
                  <a
                    href={form.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Open ${form.title} in Guided Assurance`}
                    className="text-gray-400 transition-colors hover:text-gray-600"
                  >
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer summary */}
        <div
          className="shrink-0 border-t px-5 py-3"
          style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)', backgroundColor: 'white' }}
        >
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {formsWithUpdatedCounts.filter((f) => f.isComplete).length} of {RISK_FORMS.length} forms complete
            </span>
            <button
              className="flex items-center gap-1 font-medium hover:underline"
              style={{ color: 'var(--saf-color-brand-orange, #D64000)' }}
            >
              View all in Guided Assurance
              <ChevronRight size={11} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
