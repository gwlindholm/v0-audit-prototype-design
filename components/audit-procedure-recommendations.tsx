'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle2, PlusCircle, MinusCircle, ChevronDown, ExternalLink } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

type RecommendationType = 'add' | 'exclude'

interface ProcedureRecommendation {
  id: string
  text: string
  assertions: string
  type: RecommendationType
  rationale: string
}

interface AreaRecommendations {
  id: string
  code: string
  title: string
  recommendations: ProcedureRecommendation[]
}

const RECOMMENDATIONS: AreaRecommendations[] = [
  {
    id: 'cash',
    code: 'AP-10',
    title: 'Cash',
    recommendations: [
      {
        id: 'c-add-1',
        type: 'add',
        text: 'Test cash cutoff by reviewing disbursements and receipts for the five business days before and after year-end.',
        assertions: 'CO',
        rationale: 'Cash cutoff exceptions were noted in the prior year engagement. Risk assessment indicates elevated cutoff risk due to high transaction volume near period-end.',
      },
      {
        id: 'c-excl-1',
        type: 'exclude',
        text: 'Perform petty cash count and reconciliation for all petty cash funds.',
        assertions: 'EO, C',
        rationale: 'Client eliminated all petty cash funds in the current year. Procedure is no longer applicable based on updated controls assessment.',
      },
    ],
  },
  {
    id: 'ar',
    code: 'AP-20',
    title: 'Accounts Receivable',
    recommendations: [
      {
        id: 'ar-add-1',
        type: 'add',
        text: 'Perform a rollforward of the allowance for doubtful accounts from prior year-end to current year-end, validating write-offs and new provisions.',
        assertions: 'V, ACLP',
        rationale: 'Allowance methodology changed from the prior year. Risk planning identified elevated valuation risk requiring additional substantive testing.',
      },
      {
        id: 'ar-add-2',
        type: 'add',
        text: 'Test a sample of credit memos issued after year-end to evaluate whether any relate to pre-year-end transactions.',
        assertions: 'CO, EO',
        rationale: 'Revenue risk assessment flagged potential cutoff issues in Q4 that may affect the AR balance.',
      },
    ],
  },
  {
    id: 'revenue',
    code: 'AP-30',
    title: 'Revenue',
    recommendations: [
      {
        id: 'rv-add-1',
        type: 'add',
        text: 'Review contract modifications and variable consideration arrangements entered into during the year for appropriate accounting treatment under ASC 606.',
        assertions: 'V, PD',
        rationale: 'Risk planning identified two new contract structures involving variable consideration. These were not tested in the prior year and represent a new risk area.',
      },
      {
        id: 'rv-add-2',
        type: 'add',
        text: 'Obtain and review a listing of all side agreements or amendments to customer contracts and evaluate for revenue recognition implications.',
        assertions: 'EO, C, RO',
        rationale: 'Management disclosed one contract amendment in Q3. Completeness of side agreements should be confirmed given elevated fraud risk in revenue.',
      },
      {
        id: 'rv-excl-1',
        type: 'exclude',
        text: 'Test percentage-of-completion calculations for long-term construction contracts.',
        assertions: 'V, ACLP',
        rationale: 'Client exited long-term construction contracts in the prior year. ASC 606 Step 5 analysis confirms point-in-time recognition is applicable for all remaining contracts.',
      },
    ],
  },
  {
    id: 'inventory',
    code: 'AP-50',
    title: 'Inventory and Cost of Sales',
    recommendations: [
      {
        id: 'inv-add-1',
        type: 'add',
        text: 'Compare information obtained during the physical inventory observation to the final inventory listing and investigate any unusual differences.',
        assertions: 'V, ACLP',
        rationale: 'Observation was waived in the prior year. Current year risk assessment elevates inventory existence risk, requiring this comparison procedure.',
      },
      {
        id: 'inv-add-2',
        type: 'add',
        text: 'Perform lower of cost or net realizable value analysis on the top 20 inventory SKUs by carrying value.',
        assertions: 'V, ACLP',
        rationale: 'Gross margin declined 8% year-over-year. Risk planning flagged NRV impairment as a new risk area not addressed in the prior year program.',
      },
    ],
  },
  {
    id: 'payroll',
    code: 'AP-70',
    title: 'Payroll',
    recommendations: [
      {
        id: 'pay-add-1',
        type: 'add',
        text: 'Test accuracy of the year-end bonus accrual by agreeing amounts to board-approved bonus plans and recalculating individual awards.',
        assertions: 'C, V, CO',
        rationale: 'A discretionary bonus program was introduced in the current year. Risk assessment identifies this as a new completeness and valuation risk in payroll liabilities.',
      },
    ],
  },
  {
    id: 'equity',
    code: 'AP-90',
    title: 'Equity',
    recommendations: [
      {
        id: 'eq-add-1',
        type: 'add',
        text: 'Obtain board minutes for all meetings during the year and confirm all equity transactions (issuances, repurchases, dividends) are properly authorized.',
        assertions: 'EO, C',
        rationale: 'Risk planning identified a share repurchase program initiated mid-year that was not present in the prior year engagement.',
      },
      {
        id: 'eq-excl-1',
        type: 'exclude',
        text: 'Test stock option exercises and agree to option agreements and payroll records.',
        assertions: 'EO, V',
        rationale: 'The stock option plan expired and was not renewed. No options were outstanding or exercised in the current year.',
      },
    ],
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function RecommendationRow({
  rec,
  onAccept,
  onDismiss,
  accepted,
  dismissed,
}: {
  rec: ProcedureRecommendation
  onAccept: (id: string) => void
  onDismiss: (id: string) => void
  accepted: boolean
  dismissed: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  const isAdd = rec.type === 'add'

  return (
    <div
      className={`border-t px-4 py-3 text-sm transition-colors ${
        dismissed ? 'opacity-40' : 'hover:bg-gray-50'
      }`}
      style={{ borderColor: 'var(--saf-color-neutral-100, #f3f4f6)' }}
    >
      <div className="flex items-start gap-3">
        {/* Type badge */}
        <div className="mt-0.5 shrink-0">
          {isAdd ? (
            <PlusCircle
              size={16}
              className="text-green-600"
              aria-label="Recommended to add"
            />
          ) : (
            <MinusCircle
              size={16}
              className="text-red-500"
              aria-label="Recommended to exclude"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1 min-w-0">
          <p className={`leading-relaxed text-gray-800 ${dismissed ? 'line-through' : ''}`}>
            {rec.text}
          </p>

          {/* Assertions */}
          <p className="text-xs text-gray-400">{rec.assertions}</p>

          {/* Rationale toggle */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            <ChevronDown
              size={11}
              className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
            {expanded ? 'Hide rationale' : 'View rationale'}
          </button>

          {expanded && (
            <p
              className="rounded-md border-l-2 pl-3 text-xs leading-relaxed text-gray-600 italic"
              style={{ borderColor: 'var(--saf-color-brand-orange, #D64000)' }}
            >
              {rec.rationale}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 mt-0.5">
          {accepted ? (
            <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50">
              <CheckCircle2 size={11} aria-hidden="true" />
              {isAdd ? 'Added' : 'Excluded'}
            </span>
          ) : dismissed ? (
            <span className="rounded-full px-2.5 py-1 text-xs font-medium text-gray-400 bg-gray-100">
              Dismissed
            </span>
          ) : (
            <>
              <button
                onClick={() => onAccept(rec.id)}
                className="rounded-md px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: isAdd ? '#15803d' : '#dc2626' }}
              >
                {isAdd ? 'Add to program' : 'Exclude'}
              </button>
              <button
                onClick={() => onDismiss(rec.id)}
                className="rounded-md border px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                style={{ borderColor: 'var(--saf-color-neutral-300, #d1d5db)' }}
              >
                Dismiss
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AuditProcedureRecommendations({ onAllReviewed }: { onAllReviewed?: () => void }) {
  const [activeTabId, setActiveTabId] = useState(RECOMMENDATIONS[0].id)
  const [accepted, setAccepted] = useState<Set<string>>(new Set())
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const notifiedRef = useRef(false)

  const accept = (id: string) => setAccepted((prev) => new Set(prev).add(id))
  const dismiss = (id: string) => setDismissed((prev) => new Set(prev).add(id))

  const activeArea = RECOMMENDATIONS.find((a) => a.id === activeTabId)!

  const totalRecs = RECOMMENDATIONS.reduce((s, a) => s + a.recommendations.length, 0)
  const totalReviewed = accepted.size + dismissed.size

  const getOpenCount = (area: AreaRecommendations) =>
    area.recommendations.filter(
      (r) => !accepted.has(r.id) && !dismissed.has(r.id)
    ).length

  // Fire once when every recommendation has been accepted or dismissed
  useEffect(() => {
    if (totalReviewed === totalRecs && !notifiedRef.current && onAllReviewed) {
      notifiedRef.current = true
      setTimeout(() => onAllReviewed(), 600)
    }
  }, [totalReviewed, totalRecs, onAllReviewed])

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border bg-white"
      style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
    >
      {/* Tab bar */}
      <div
        className="flex items-end overflow-x-auto border-b bg-gray-50"
        style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
        role="tablist"
        aria-label="Audit area procedure recommendations"
      >
        {RECOMMENDATIONS.map((area) => {
          const open = getOpenCount(area)
          const isActive = area.id === activeTabId
          const allDone = open === 0

          return (
            <button
              key={area.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTabId(area.id)}
              className={`relative flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'border-gray-800 bg-white text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-gray-400 mr-0.5">{area.code}</span>
              {area.title}
              {allDone ? (
                <CheckCircle2 size={12} className="text-green-500 ml-0.5" aria-label="All reviewed" />
              ) : (
                <span
                  className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: 'var(--saf-color-brand-orange, #D64000)' }}
                  aria-label={`${open} open recommendations`}
                >
                  {open}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-4 border-b px-4 py-2"
        style={{ borderColor: 'var(--saf-color-neutral-100, #f3f4f6)' }}
      >
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <PlusCircle size={12} className="text-green-600" aria-hidden="true" />
          Recommended to add
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <MinusCircle size={12} className="text-red-500" aria-hidden="true" />
          Recommended to exclude
        </span>
      </div>

      {/* Procedure rows */}
      <div role="tabpanel">
        {activeArea.recommendations.map((rec) => (
          <RecommendationRow
            key={rec.id}
            rec={rec}
            accepted={accepted.has(rec.id)}
            dismissed={dismissed.has(rec.id)}
            onAccept={accept}
            onDismiss={dismiss}
          />
        ))}

        {/* All reviewed state */}
        {getOpenCount(activeArea) === 0 && (
          <div className="flex flex-col items-center gap-1.5 py-6 text-center">
            <CheckCircle2 size={20} className="text-green-500" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-700">All recommendations reviewed</p>
            <p className="text-xs text-gray-400">You can proceed to finalize the audit program.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center border-t px-4 py-2.5"
        style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
      >
        <span className="text-xs text-gray-400">
          Based on risk assessment · Sourced from Guided Assurance
        </span>
      </div>
    </div>
  )
}
