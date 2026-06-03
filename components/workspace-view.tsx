'use client'

import { useState } from 'react'
import { CheckCircle2, ChevronRight, ExternalLink, AlertCircle, SlidersHorizontal } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

type ItemType = 'text' | 'select' | 'yesno' | 'risk'

interface FormItem {
  id: string
  formId: string
  section: string
  question: string
  type: ItemType
  options?: string[]
  prefill?: string
  riskLevel?: 'high' | 'medium' | 'low'
  isOpen: boolean // true = needs auditor input
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
  { id: 'GA-RP-001', title: 'Revenue — Risk Assessment',                area: 'Revenue',                             openItems: 3, totalItems: 8,  complete: false, url: '#' },
  { id: 'GA-RP-002', title: 'Accounts Receivable — Risk Assessment',    area: 'Accounts Receivable',                 openItems: 2, totalItems: 7,  complete: false, url: '#' },
  { id: 'GA-RP-003', title: 'Inventory & Cost of Sales — Risk Planning', area: 'Inventory and Cost of Sales',        openItems: 4, totalItems: 10, complete: false, url: '#' },
  { id: 'GA-RP-004', title: 'Cash — Risk Assessment',                   area: 'Cash',                                openItems: 0, totalItems: 6,  complete: true,  url: '#' },
  { id: 'GA-RP-005', title: 'Payroll Liabilities — Risk Planning',      area: 'Payroll Liabilities',                 openItems: 2, totalItems: 8,  complete: false, url: '#' },
  { id: 'GA-RP-006', title: 'Income Taxes — Risk Assessment',           area: 'Income Taxes',                        openItems: 1, totalItems: 6,  complete: false, url: '#' },
  { id: 'GA-RP-007', title: 'Equity — Risk Assessment',                 area: 'Equity',                              openItems: 0, totalItems: 5,  complete: true,  url: '#' },
  { id: 'GA-RP-008', title: 'Accounts Payable & Other Liabilities',     area: 'Accounts Payable and Other Liabilities', openItems: 3, totalItems: 9, complete: false, url: '#' },
]

// All items per form — both pre-filled (closed) and open
const ALL_FORM_ITEMS: FormItem[] = [
  // ── GA-RP-001 Revenue ────────────────────────────────────────────────────────
  { id: 'F001-01', formId: 'GA-RP-001', section: 'General Information', question: 'Engagement period covered by this assessment', type: 'text', prefill: '01/01/2024 – 12/31/2024', isOpen: false },
  { id: 'F001-02', formId: 'GA-RP-001', section: 'General Information', question: 'Prior year revenue (per audited F/S)', type: 'text', prefill: '$42,800,000', isOpen: false },
  { id: 'F001-03', formId: 'GA-RP-001', section: 'General Information', question: 'Revenue recognition standard applied (ASC 606 / IFRS 15)', type: 'text', prefill: 'ASC 606', isOpen: false },
  { id: 'F001-04', formId: 'GA-RP-001', section: 'General Information', question: 'Primary revenue streams identified in prior year', type: 'text', prefill: 'Product sales, SaaS subscriptions, Professional services', isOpen: false },
  { id: 'F001-05', formId: 'GA-RP-001', section: 'Risk Identification', question: 'Has management identified any significant changes to revenue recognition policies from the prior year?', type: 'yesno', isOpen: true, riskLevel: 'high' },
  { id: 'F001-06', formId: 'GA-RP-001', section: 'Risk Identification', question: 'Describe any new revenue streams or contract types introduced during the engagement period.', type: 'text', isOpen: true, riskLevel: 'medium' },
  { id: 'F001-07', formId: 'GA-RP-001', section: 'Risk Assessment', question: 'Inherent risk of material misstatement — Revenue completeness', type: 'text', prefill: 'Medium — consistent with prior year', isOpen: false },
  { id: 'F001-08', formId: 'GA-RP-001', section: 'Risk Assessment', question: 'Assessed risk level for revenue recognition completeness', type: 'risk', options: ['High', 'Medium', 'Low'], isOpen: true, riskLevel: 'high' },

  // ── GA-RP-002 Accounts Receivable ────────────────────────────────────────────
  { id: 'F002-01', formId: 'GA-RP-002', section: 'General Information', question: 'AR balance as of period end (prior year)', type: 'text', prefill: '$8,340,000', isOpen: false },
  { id: 'F002-02', formId: 'GA-RP-002', section: 'General Information', question: 'Allowance for doubtful accounts (prior year)', type: 'text', prefill: '$412,000 (4.9% of gross AR)', isOpen: false },
  { id: 'F002-03', formId: 'GA-RP-002', section: 'General Information', question: 'AR turnover ratio (prior year)', type: 'text', prefill: '6.2x', isOpen: false },
  { id: 'F002-04', formId: 'GA-RP-002', section: 'Risk Identification', question: 'Does the client have significant concentrations of credit risk with any single customer exceeding 10% of total AR?', type: 'yesno', isOpen: true, riskLevel: 'medium' },
  { id: 'F002-05', formId: 'GA-RP-002', section: 'Risk Identification', question: 'Describe the aging profile changes from prior year and any new collectability concerns noted.', type: 'text', prefill: 'Prior year showed 12% of AR over 90 days. Recommend assessing for changes in allowance methodology.', isOpen: true, riskLevel: 'medium' },
  { id: 'F002-06', formId: 'GA-RP-002', section: 'Risk Assessment', question: 'Overall inherent risk of material misstatement for AR valuation', type: 'text', prefill: 'Medium', isOpen: false },
  { id: 'F002-07', formId: 'GA-RP-002', section: 'Risk Assessment', question: 'Planned substantive procedures — AR confirmation approach', type: 'text', prefill: 'Positive confirmations for balances > $50K; alternative for non-responses', isOpen: false },

  // ── GA-RP-003 Inventory ───────────────────────────────────────────────────────
  { id: 'F003-01', formId: 'GA-RP-003', section: 'General Information', question: 'Inventory balance as of prior year end', type: 'text', prefill: '$14,620,000', isOpen: false },
  { id: 'F003-02', formId: 'GA-RP-003', section: 'General Information', question: 'Inventory costing method applied in prior year', type: 'text', prefill: 'FIFO', isOpen: false },
  { id: 'F003-03', formId: 'GA-RP-003', section: 'General Information', question: 'Number of inventory locations (prior year)', type: 'text', prefill: '3 warehouses — Chicago, Dallas, Seattle', isOpen: false },
  { id: 'F003-04', formId: 'GA-RP-003', section: 'General Information', question: 'Inventory write-down charges in prior year', type: 'text', prefill: '$320,000 — slow-moving SKUs', isOpen: false },
  { id: 'F003-05', formId: 'GA-RP-003', section: 'Risk Identification', question: 'Has the client changed its inventory costing method (FIFO, LIFO, weighted average) from prior year?', type: 'yesno', isOpen: true, riskLevel: 'high' },
  { id: 'F003-06', formId: 'GA-RP-003', section: 'Risk Identification', question: 'Were there any inventory write-downs or obsolescence charges in the prior year that may recur?', type: 'yesno', isOpen: true, riskLevel: 'high' },
  { id: 'F003-07', formId: 'GA-RP-003', section: 'Risk Identification', question: 'Identify locations where physical inventory counts will be performed and confirm observation dates.', type: 'text', isOpen: true, riskLevel: 'medium' },
  { id: 'F003-08', formId: 'GA-RP-003', section: 'Risk Assessment', question: 'Inherent risk for inventory existence and completeness', type: 'text', prefill: 'High — due to volume and prior write-downs', isOpen: false },
  { id: 'F003-09', formId: 'GA-RP-003', section: 'Risk Assessment', question: 'Assessed overall risk level for inventory valuation', type: 'risk', options: ['High', 'Medium', 'Low'], isOpen: true, riskLevel: 'high' },
  { id: 'F003-10', formId: 'GA-RP-003', section: 'Risk Assessment', question: 'Planned observation date and lead auditor responsible', type: 'text', prefill: 'TBD — to be confirmed with engagement manager', isOpen: false },

  // ── GA-RP-004 Cash (complete) ─────────────────────────────────────────────────
  { id: 'F004-01', formId: 'GA-RP-004', section: 'General Information', question: 'Cash and equivalents balance (prior year end)', type: 'text', prefill: '$3,210,000', isOpen: false },
  { id: 'F004-02', formId: 'GA-RP-004', section: 'General Information', question: 'Number of bank accounts held', type: 'text', prefill: '7 operating accounts, 1 restricted', isOpen: false },
  { id: 'F004-03', formId: 'GA-RP-004', section: 'Risk Identification', question: 'Are there any restricted cash balances not disclosed in prior year?', type: 'yesno', prefill: 'No', isOpen: false },
  { id: 'F004-04', formId: 'GA-RP-004', section: 'Risk Identification', question: 'Any new foreign currency bank accounts opened during the period?', type: 'yesno', prefill: 'No', isOpen: false },
  { id: 'F004-05', formId: 'GA-RP-004', section: 'Risk Assessment', question: 'Inherent risk for cash existence', type: 'text', prefill: 'Low — standard bank confirmation procedures adequate', isOpen: false },
  { id: 'F004-06', formId: 'GA-RP-004', section: 'Risk Assessment', question: 'Assessed overall risk level for cash', type: 'risk', options: ['High', 'Medium', 'Low'], prefill: 'Low', isOpen: false },

  // ── GA-RP-005 Payroll ─────────────────────────────────────────────────────────
  { id: 'F005-01', formId: 'GA-RP-005', section: 'General Information', question: 'Total payroll expense (prior year)', type: 'text', prefill: '$9,800,000', isOpen: false },
  { id: 'F005-02', formId: 'GA-RP-005', section: 'General Information', question: 'Number of employees (full-time, prior year end)', type: 'text', prefill: '142', isOpen: false },
  { id: 'F005-03', formId: 'GA-RP-005', section: 'General Information', question: 'Payroll processing system used', type: 'text', prefill: 'ADP Workforce Now', isOpen: false },
  { id: 'F005-04', formId: 'GA-RP-005', section: 'General Information', question: 'Stock-based compensation present?', type: 'text', prefill: 'Yes — RSUs, 24-month vesting schedule', isOpen: false },
  { id: 'F005-05', formId: 'GA-RP-005', section: 'Risk Identification', question: 'Are there any new compensation arrangements (equity-based, bonus, deferred) not present in prior year?', type: 'yesno', isOpen: true, riskLevel: 'medium' },
  { id: 'F005-06', formId: 'GA-RP-005', section: 'Risk Identification', question: 'Summarize any changes to benefit plan terms or actuarial assumptions from prior year.', type: 'text', isOpen: true, riskLevel: 'low' },
  { id: 'F005-07', formId: 'GA-RP-005', section: 'Risk Assessment', question: 'Inherent risk for payroll completeness and accuracy', type: 'text', prefill: 'Medium — reliance on IT controls; review SOC 1 for ADP', isOpen: false },
  { id: 'F005-08', formId: 'GA-RP-005', section: 'Risk Assessment', question: 'Planned approach for payroll testing', type: 'text', prefill: 'Controls reliance + recalculation for high-risk individuals', isOpen: false },

  // ── GA-RP-006 Income Taxes ────────────────────────────────────────────────────
  { id: 'F006-01', formId: 'GA-RP-006', section: 'General Information', question: 'Effective tax rate (prior year)', type: 'text', prefill: '23.4%', isOpen: false },
  { id: 'F006-02', formId: 'GA-RP-006', section: 'General Information', question: 'Jurisdictions filed in (prior year)', type: 'text', prefill: 'Federal, IL, TX, WA; no international', isOpen: false },
  { id: 'F006-03', formId: 'GA-RP-006', section: 'General Information', question: 'Deferred tax asset balance (prior year)', type: 'text', prefill: '$1,140,000', isOpen: false },
  { id: 'F006-04', formId: 'GA-RP-006', section: 'Risk Identification', question: 'Has the client entered any new jurisdictions or changed its tax filing positions from prior year?', type: 'yesno', isOpen: true, riskLevel: 'medium' },
  { id: 'F006-05', formId: 'GA-RP-006', section: 'Risk Assessment', question: 'Inherent risk for income tax provision accuracy', type: 'text', prefill: 'Medium — deferred tax complexity requires specialist review', isOpen: false },
  { id: 'F006-06', formId: 'GA-RP-006', section: 'Risk Assessment', question: 'Tax specialist engagement required?', type: 'text', prefill: 'Yes — refer to tax group for DTA recoverability assessment', isOpen: false },

  // ── GA-RP-007 Equity (complete) ───────────────────────────────────────────────
  { id: 'F007-01', formId: 'GA-RP-007', section: 'General Information', question: 'Total stockholders equity (prior year)', type: 'text', prefill: '$18,200,000', isOpen: false },
  { id: 'F007-02', formId: 'GA-RP-007', section: 'General Information', question: 'Share classes outstanding', type: 'text', prefill: 'Common (Class A) — 12.4M shares; no preferred', isOpen: false },
  { id: 'F007-03', formId: 'GA-RP-007', section: 'Risk Identification', question: 'Any new equity issuances, buybacks, or dividends in current year?', type: 'yesno', prefill: 'No', isOpen: false },
  { id: 'F007-04', formId: 'GA-RP-007', section: 'Risk Assessment', question: 'Inherent risk for equity completeness', type: 'text', prefill: 'Low — no complex equity transactions in prior year', isOpen: false },
  { id: 'F007-05', formId: 'GA-RP-007', section: 'Risk Assessment', question: 'Assessed overall risk level for equity', type: 'risk', options: ['High', 'Medium', 'Low'], prefill: 'Low', isOpen: false },

  // ── GA-RP-008 Accounts Payable ────────────────────────────────────────────────
  { id: 'F008-01', formId: 'GA-RP-008', section: 'General Information', question: 'AP balance as of prior year end', type: 'text', prefill: '$5,670,000', isOpen: false },
  { id: 'F008-02', formId: 'GA-RP-008', section: 'General Information', question: 'AP days outstanding (prior year)', type: 'text', prefill: '42 days', isOpen: false },
  { id: 'F008-03', formId: 'GA-RP-008', section: 'General Information', question: 'Accrued liabilities balance (prior year)', type: 'text', prefill: '$1,820,000', isOpen: false },
  { id: 'F008-04', formId: 'GA-RP-008', section: 'General Information', question: 'Significant accruals carried from prior year', type: 'text', prefill: 'Legal reserve $240K, warranty reserve $180K', isOpen: false },
  { id: 'F008-05', formId: 'GA-RP-008', section: 'Risk Identification', question: 'Are there any significant new vendor agreements or liabilities not present in the prior year balance sheet?', type: 'yesno', isOpen: true, riskLevel: 'medium' },
  { id: 'F008-06', formId: 'GA-RP-008', section: 'Risk Identification', question: 'Describe any accrued liabilities that were not settled from prior year and explain carryforward rationale.', type: 'text', prefill: 'Per prior year: accrued legal reserve of $240K carried forward pending resolution.', isOpen: true, riskLevel: 'high' },
  { id: 'F008-07', formId: 'GA-RP-008', section: 'Risk Assessment', question: 'Assessed risk level for accounts payable completeness', type: 'risk', options: ['High', 'Medium', 'Low'], isOpen: true, riskLevel: 'medium' },
  { id: 'F008-08', formId: 'GA-RP-008', section: 'Risk Assessment', question: 'Inherent risk for accrued liabilities existence', type: 'text', prefill: 'Medium — legal reserves require management judgement', isOpen: false },
  { id: 'F008-09', formId: 'GA-RP-008', section: 'Risk Assessment', question: 'Planned cutoff procedures for AP', type: 'text', prefill: 'Review disbursements 10 days before/after year end', isOpen: false },
]

// ─── Item Row ──────────────────────────────────────────────────────────────────

interface ItemRowProps {
  item: FormItem
  isCompleted: boolean
  onComplete: (id: string) => void
}

function ItemRow({ item, isCompleted, onComplete }: ItemRowProps) {
  const [value, setValue] = useState(item.prefill ?? '')
  const [yesNo, setYesNo] = useState<'yes' | 'no' | null>(
    item.prefill === 'Yes' ? 'yes' : item.prefill === 'No' ? 'no' : null
  )
  const [risk, setRisk] = useState(item.prefill ?? '')
  const [saved, setSaved] = useState(!item.isOpen) // pre-filled items start as saved

  const riskColor: Record<string, string> = { high: '#B91C1C', medium: '#D97706', low: '#15803D' }
  const riskBg: Record<string, string>    = { high: '#FEF2F2', medium: '#FFFBEB', low: '#F0FDF4' }

  const canSave =
    item.type === 'yesno' ? yesNo !== null :
    item.type === 'risk'  ? risk !== '' :
    value.trim() !== ''

  const handleSave = () => {
    setSaved(true)
    if (item.isOpen) onComplete(item.id)
  }

  return (
    <div
      className="rounded-lg border bg-white p-4 space-y-3"
      style={{
        borderColor: item.isOpen && !saved
          ? 'var(--saf-color-brand-orange, #D64000)'
          : 'var(--saf-color-neutral-200, #e5e7eb)',
        opacity: saved && !item.isOpen ? 0.85 : 1,
      }}
    >
      {/* Section label + open badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{item.section}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {item.riskLevel && item.isOpen && !saved && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
              style={{ color: riskColor[item.riskLevel], backgroundColor: riskBg[item.riskLevel] }}
            >
              {item.riskLevel} risk
            </span>
          )}
          {item.isOpen && !saved && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
              style={{ backgroundColor: 'var(--saf-color-brand-orange, #D64000)' }}
            >
              Open
            </span>
          )}
          {saved && item.isOpen && (
            <CheckCircle2 size={14} style={{ color: '#15803D' }} aria-label="Saved" />
          )}
        </div>
      </div>

      {/* Question */}
      <p className="text-sm leading-relaxed text-gray-800">{item.question}</p>

      {/* Answer area */}
      {item.type === 'yesno' ? (
        saved ? (
          <p className="text-sm text-gray-600 font-medium">{yesNo === 'yes' ? 'Yes' : yesNo === 'no' ? 'No' : item.prefill}</p>
        ) : (
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
        )
      ) : item.type === 'risk' && item.options ? (
        saved ? (
          <p className="text-sm text-gray-600 font-medium">{risk}</p>
        ) : (
          <div className="flex gap-2" role="group" aria-label="Risk level">
            {item.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setRisk(opt)}
                className="flex-1 rounded-lg border py-2 text-sm font-medium transition-colors"
                style={{
                  borderColor: risk === opt ? riskColor[opt.toLowerCase()] : 'var(--saf-color-neutral-200, #e5e7eb)',
                  color: risk === opt ? riskColor[opt.toLowerCase()] : '#6B7280',
                  backgroundColor: risk === opt ? riskBg[opt.toLowerCase()] : 'transparent',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )
      ) : (
        saved ? (
          <p className="text-sm text-gray-600 leading-relaxed">{value || <span className="text-gray-400 italic">No response</span>}</p>
        ) : (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
            placeholder="Enter your response..."
            className="w-full resize-none rounded-lg border px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-1"
            style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
          />
        )
      )}

      {/* Save button — only for open, unsaved items */}
      {item.isOpen && !saved && (
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
      )}
    </div>
  )
}

// ─── Workspace View ────────────────────────────────────────────────────────────

export function WorkspaceView() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)
  const [showOpenOnly, setShowOpenOnly] = useState(false)

  const handleComplete = (id: string) => {
    setCompletedIds((prev) => new Set([...prev, id]))
  }

  // Derive open count per form (adjusting for items completed this session)
  const formsWithCounts = RISK_FORMS.map((form) => {
    const sessionCompleted = [...completedIds].filter((cid) => {
      const item = ALL_FORM_ITEMS.find((i) => i.id === cid)
      return item?.formId === form.id
    }).length
    const currentOpen = Math.max(0, form.openItems - sessionCompleted)
    return { ...form, currentOpen, isComplete: form.complete || currentOpen === 0 }
  })

  // Left panel items
  const panelItems = selectedFormId
    ? ALL_FORM_ITEMS.filter((i) => i.formId === selectedFormId && (showOpenOnly ? (i.isOpen && !completedIds.has(i.id)) : true))
    : ALL_FORM_ITEMS.filter((i) => i.isOpen && !completedIds.has(i.id))

  const selectedForm = formsWithCounts.find((f) => f.id === selectedFormId)
  const openCountForSelected = selectedForm?.currentOpen ?? 0

  const totalGlobalOpen = ALL_FORM_ITEMS.filter((i) => i.isOpen).length - completedIds.size

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left panel ───────────────────────────────────────────────────────── */}
      <div
        className="flex w-[58%] flex-col overflow-hidden border-r"
        style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
      >
        {/* Panel header */}
        <div
          className="shrink-0 border-b px-5 py-4"
          style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
        >
          {selectedFormId && selectedForm ? (
            // Full-form mode
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{selectedForm.id}</p>
                  <h2 className="text-sm font-semibold text-gray-900 leading-snug">{selectedForm.title}</h2>
                </div>
                <button
                  onClick={() => { setSelectedFormId(null); setShowOpenOnly(false) }}
                  className="shrink-0 text-xs font-medium hover:underline"
                  style={{ color: 'var(--saf-color-brand-orange, #D64000)' }}
                >
                  All open items
                </button>
              </div>

              {/* Toggle filter row */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {openCountForSelected > 0
                    ? `${openCountForSelected} open item${openCountForSelected !== 1 ? 's' : ''} remaining`
                    : 'All items complete'}
                </p>
                {openCountForSelected > 0 && (
                  <button
                    onClick={() => setShowOpenOnly((v) => !v)}
                    className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors"
                    style={{
                      borderColor: showOpenOnly ? 'var(--saf-color-brand-orange, #D64000)' : 'var(--saf-color-neutral-200, #e5e7eb)',
                      color: showOpenOnly ? 'var(--saf-color-brand-orange, #D64000)' : '#6B7280',
                      backgroundColor: showOpenOnly ? '#FFF5F0' : 'transparent',
                    }}
                    aria-pressed={showOpenOnly}
                  >
                    <SlidersHorizontal size={11} aria-hidden="true" />
                    {showOpenOnly ? 'Showing open items only' : 'Show open items only'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            // Global open items mode
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Open items</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {totalGlobalOpen} item{totalGlobalOpen !== 1 ? 's' : ''} across all forms
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {panelItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
              <CheckCircle2 size={28} style={{ color: '#15803D' }} aria-hidden="true" />
              <p className="text-sm font-medium text-gray-600">All items complete</p>
            </div>
          ) : (
            panelItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                isCompleted={completedIds.has(item.id)}
                onComplete={handleComplete}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Right panel: Document list ────────────────────────────────────────── */}
      <div className="flex w-[42%] flex-col overflow-hidden bg-gray-50">
        {/* Panel header */}
        <div
          className="shrink-0 border-b px-5 py-4 bg-white"
          style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
        >
          <h2 className="text-sm font-semibold text-gray-900">Risk Planning documents</h2>
          <p className="text-xs text-gray-500 mt-0.5">Guided Assurance — pre-filled from prior year</p>
        </div>

        {/* Form list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {formsWithCounts.map((form) => {
            const isSelected = selectedFormId === form.id
            return (
              <button
                key={form.id}
                onClick={() => {
                  if (isSelected) {
                    setSelectedFormId(null)
                    setShowOpenOnly(false)
                  } else {
                    setSelectedFormId(form.id)
                    setShowOpenOnly(false)
                  }
                }}
                className="flex w-full items-start gap-3 rounded-xl border bg-white px-4 py-3 text-left transition-all hover:shadow-sm"
                style={{
                  borderColor: isSelected ? 'var(--saf-color-brand-orange, #D64000)' : 'var(--saf-color-neutral-200, #e5e7eb)',
                  boxShadow: isSelected ? '0 0 0 1px var(--saf-color-brand-orange, #D64000)' : undefined,
                }}
                aria-pressed={isSelected}
              >
                <div className="mt-0.5 shrink-0">
                  {form.isComplete
                    ? <CheckCircle2 size={15} style={{ color: '#15803D' }} aria-label="Complete" />
                    : <AlertCircle  size={15} style={{ color: '#D97706' }} aria-label={`${form.currentOpen} open items`} />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-snug">{form.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{form.id} · {form.totalItems} items total</p>
                </div>

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

        {/* Footer */}
        <div
          className="shrink-0 border-t px-5 py-3 bg-white"
          style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
        >
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {formsWithCounts.filter((f) => f.isComplete).length} of {RISK_FORMS.length} forms complete
            </span>
            <a
              href="#"
              className="flex items-center gap-1 font-medium hover:underline"
              style={{ color: 'var(--saf-color-brand-orange, #D64000)' }}
            >
              View all in Guided Assurance
              <ChevronRight size={11} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
