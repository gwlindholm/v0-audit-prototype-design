'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'

// ─── Data model ──────────────────────────────────────────────────────────────

export interface FormField {
  id: string
  label: string
  type: 'text' | 'select' | 'risk' | 'yesno' | 'textarea'
  prefilled?: string
  options?: string[]
  required?: boolean
}

export interface FormSection {
  title: string
  fields: FormField[]
}

export interface RiskForm {
  id: string
  title: string
  formRef: string   // Guided Assurance form number
  sections: FormSection[]
}

// ─── Pre-filled risk planning forms ─────────────────────────────────────────
// Pre-population derived from Guided Assurance forms PIN-CX-4.1, PIN-CX-4.2.3,
// PIN-CX-3.1–3.6, PIN-CX-1.1, and numbered forms 08–17.
// Engagement: Setup 1 · Client: 21AUG25RELEASE1 · FY: 12/31/2026

const RISK_FORMS: RiskForm[] = [
  {
    id: 'cash',
    title: 'Cash',
    formRef: 'Form 10',
    sections: [
      {
        title: 'Risk Assessment',
        fields: [
          {
            id: 'cash-inherent',
            label: 'Inherent risk level',
            type: 'risk',
            prefilled: 'Low',
            options: ['Low', 'Medium', 'High', 'Significant'],
          },
          {
            id: 'cash-control',
            label: 'Control risk level',
            type: 'risk',
            options: ['Low', 'Medium', 'High', 'Significant'],
          },
          {
            id: 'cash-fraud',
            label: 'Fraud risk identified? (AU-C 240 / ISA 240)',
            type: 'yesno',
            prefilled: 'No',
          },
          {
            id: 'cash-restriction',
            label: 'Restricted cash balances present?',
            type: 'yesno',
            prefilled: 'No',
          },
          {
            id: 'cash-remark',
            label: 'Prior year risk remarks',
            type: 'textarea',
            prefilled: 'No significant risks noted in prior year. Bank reconciliations were completed timely with no unreconciled differences. Three bank accounts confirmed; all confirmations returned without exception.',
          },
        ],
      },
      {
        title: 'Audit Procedures',
        fields: [
          {
            id: 'cash-confirm',
            label: 'Bank confirmations to be obtained? (Standard Form)',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'cash-recon',
            label: 'Reconciliation review approach',
            type: 'select',
            prefilled: 'Detail testing',
            options: ['Analytical review', 'Detail testing', 'Combined approach'],
          },
          {
            id: 'cash-cutoff',
            label: 'Cutoff testing required around 12/31/2026?',
            type: 'yesno',
          },
          {
            id: 'cash-scope',
            label: 'Scope notes',
            type: 'textarea',
            prefilled: 'Test all accounts with balance > $50K. Confirm top 3 bank accounts. Trace outstanding checks and deposits in transit to subsequent clearance.',
          },
        ],
      },
    ],
  },
  {
    id: 'ar',
    title: 'Trade Receivables',
    formRef: 'Form 12',
    sections: [
      {
        title: 'Risk Assessment',
        fields: [
          {
            id: 'ar-inherent',
            label: 'Inherent risk level',
            type: 'risk',
            prefilled: 'Medium',
            options: ['Low', 'Medium', 'High', 'Significant'],
          },
          {
            id: 'ar-control',
            label: 'Control risk level',
            type: 'risk',
            options: ['Low', 'Medium', 'High', 'Significant'],
          },
          {
            id: 'ar-fraud',
            label: 'Fraud risk — fictitious or overstated receivables?',
            type: 'yesno',
            prefilled: 'No',
          },
          {
            id: 'ar-allowance',
            label: 'Allowance for doubtful accounts — adequacy concern?',
            type: 'yesno',
          },
          {
            id: 'ar-cutoff',
            label: 'Revenue cutoff risk at period-end',
            type: 'risk',
            prefilled: 'Medium',
            options: ['Low', 'Medium', 'High', 'Significant'],
          },
          {
            id: 'ar-concentration',
            label: 'Significant customer concentration?',
            type: 'yesno',
            prefilled: 'No',
          },
        ],
      },
      {
        title: 'Audit Procedures',
        fields: [
          {
            id: 'ar-confirm',
            label: 'Positive confirmations to be sent?',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'ar-sample',
            label: 'Sampling approach',
            type: 'select',
            prefilled: 'Statistical sampling',
            options: ['Statistical sampling', 'Judgmental sampling', 'Full population'],
          },
          {
            id: 'ar-aging',
            label: 'Aging analysis required?',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'ar-scope',
            label: 'Scope notes',
            type: 'textarea',
          },
        ],
      },
    ],
  },
  {
    id: 'revenue',
    title: 'Revenue',
    formRef: 'Form 09',
    sections: [
      {
        title: 'Risk Assessment',
        fields: [
          {
            id: 'rev-inherent',
            label: 'Inherent risk level',
            type: 'risk',
            prefilled: 'High',
            options: ['Low', 'Medium', 'High', 'Significant'],
          },
          {
            id: 'rev-control',
            label: 'Control risk level',
            type: 'risk',
            prefilled: 'Medium',
            options: ['Low', 'Medium', 'High', 'Significant'],
          },
          {
            id: 'rev-fraud',
            label: 'Fraud risk — fictitious or premature revenue recognition? (AU-C 240)',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'rev-new-stream',
            label: 'New revenue stream identified (e.g. licensing agreement)?',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'rev-recognition',
            label: 'ASC 606 / IFRS 15 step with highest risk',
            type: 'select',
            prefilled: 'Recognize revenue',
            options: ['Identify contract', 'Identify obligations', 'Determine price', 'Allocate price', 'Recognize revenue'],
          },
          {
            id: 'rev-sig',
            label: 'Significant risk requiring special audit consideration?',
            type: 'yesno',
            prefilled: 'Yes',
          },
        ],
      },
      {
        title: 'Audit Procedures',
        fields: [
          {
            id: 'rev-cutoff',
            label: 'Cutoff testing — number of days around 12/31/2026',
            type: 'text',
            prefilled: '10',
          },
          {
            id: 'rev-analytical',
            label: 'Analytical procedure approach',
            type: 'select',
            prefilled: 'Regression analysis',
            options: ['Simple trend', 'Ratio analysis', 'Regression analysis', 'Predictive model'],
          },
          {
            id: 'rev-journals',
            label: 'Journal entry testing for manual revenue entries? (AU-C 240.32)',
            type: 'yesno',
          },
          {
            id: 'rev-licensing',
            label: 'Specific procedures for new licensing revenue stream?',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'rev-scope',
            label: 'Scope notes',
            type: 'textarea',
            prefilled: 'New licensing agreement identified in board minutes — obtain contract, assess performance obligations under ASC 606. Focus on Q4 entries and manual adjustments. Compare to budget and prior year. Evaluate whether revenue is recognized in the correct period.',
          },
        ],
      },
    ],
  },
  {
    id: 'inventory',
    title: 'Inventories',
    formRef: 'Form 14',
    sections: [
      {
        title: 'Risk Assessment',
        fields: [
          {
            id: 'inv-inherent',
            label: 'Inherent risk level',
            type: 'risk',
            prefilled: 'High',
            options: ['Low', 'Medium', 'High', 'Significant'],
          },
          {
            id: 'inv-control',
            label: 'Control risk level',
            type: 'risk',
            prefilled: 'Medium',
            options: ['Low', 'Medium', 'High', 'Significant'],
          },
          {
            id: 'inv-obsolete',
            label: 'Obsolescence risk?',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'inv-valuation',
            label: 'Cost flow assumption',
            type: 'select',
            prefilled: 'FIFO',
            options: ['FIFO', 'LIFO', 'Weighted average', 'Specific identification'],
          },
          {
            id: 'inv-obs',
            label: 'Physical inventory observation required? (AU-C 501)',
            type: 'yesno',
            prefilled: 'Yes',
          },
        ],
      },
      {
        title: 'Audit Procedures',
        fields: [
          {
            id: 'inv-obs-date',
            label: 'Planned observation date',
            type: 'text',
          },
          {
            id: 'inv-cutoff',
            label: 'Receiving/shipping cutoff procedures at 12/31/2026?',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'inv-costing',
            label: 'Cost rollback testing required?',
            type: 'yesno',
          },
          {
            id: 'inv-nrv',
            label: 'Net realizable value analysis required?',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'inv-scope',
            label: 'Scope notes',
            type: 'textarea',
          },
        ],
      },
    ],
  },
  {
    id: 'payroll',
    title: 'Payroll',
    formRef: 'Form 17',
    sections: [
      {
        title: 'Risk Assessment',
        fields: [
          {
            id: 'pay-inherent',
            label: 'Inherent risk level',
            type: 'risk',
            prefilled: 'Medium',
            options: ['Low', 'Medium', 'High', 'Significant'],
          },
          {
            id: 'pay-control',
            label: 'Control risk level',
            type: 'risk',
            prefilled: 'Low',
            options: ['Low', 'Medium', 'High', 'Significant'],
          },
          {
            id: 'pay-ghost',
            label: 'Ghost employee risk?',
            type: 'yesno',
            prefilled: 'No',
          },
          {
            id: 'pay-restructure',
            label: 'Treasury restructuring — impact on payroll classification?',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'pay-comp',
            label: 'Executive compensation — special disclosure required?',
            type: 'yesno',
            prefilled: 'Yes',
          },
        ],
      },
      {
        title: 'Audit Procedures',
        fields: [
          {
            id: 'pay-headcount',
            label: 'Headcount reconciliation required?',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'pay-accrual',
            label: 'Year-end accrual testing approach',
            type: 'select',
            options: ['Recalculation', 'Inquiry + analytical', 'Detail vouching'],
          },
          {
            id: 'pay-treasury',
            label: 'Evaluate payroll reclassification from treasury restructuring?',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'pay-scope',
            label: 'Scope notes',
            type: 'textarea',
            prefilled: 'Agree payroll register to GL. Test top 20 earners for authorization. Confirm treasury restructuring has not resulted in misclassification of compensation expense.',
          },
        ],
      },
    ],
  },
  {
    id: 'internal-control',
    title: 'Internal Control',
    formRef: 'PIN-CX-4.1',
    sections: [
      {
        title: 'Control Environment (AU-C 315 / ISA 315)',
        fields: [
          {
            id: 'ic-commitment',
            label: 'Does management demonstrate commitment to integrity and ethical values?',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'ic-env-found',
            label: 'Does the control environment provide an appropriate foundation for other IC components?',
            type: 'yesno',
          },
          {
            id: 'ic-env-notes',
            label: 'Control environment observations',
            type: 'textarea',
            prefilled: 'Management has established reporting lines and accountability structures consistent with financial reporting objectives. Board oversight appears appropriate for the size and complexity of the entity.',
          },
        ],
      },
      {
        title: 'Risk Assessment Process',
        fields: [
          {
            id: 'ic-ra-appropriate',
            label: 'Is the risk assessment process relevant to the financial statements appropriate?',
            type: 'yesno',
          },
          {
            id: 'ic-ra-fraud',
            label: 'Has management considered the potential for fraud in its risk assessment?',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'ic-ra-changes',
            label: 'Significant changes in the entity\'s risk environment in the current year?',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'ic-ra-notes',
            label: 'Risk assessment notes',
            type: 'textarea',
            prefilled: 'Treasury restructuring and new licensing revenue stream represent changes that could significantly impact the system of internal control. Management should document how these have been addressed in the risk assessment.',
          },
        ],
      },
      {
        title: 'Monitoring',
        fields: [
          {
            id: 'ic-mon-appropriate',
            label: 'Is the monitoring process relevant to the financial statements appropriate?',
            type: 'yesno',
          },
          {
            id: 'ic-mon-internal-audit',
            label: 'Does the entity have an internal audit function?',
            type: 'yesno',
            prefilled: 'No',
          },
          {
            id: 'ic-mon-notes',
            label: 'Monitoring observations',
            type: 'textarea',
            prefilled: 'Management relies on monthly financial reports, budget variance analysis, and account reconciliations for monitoring purposes.',
          },
        ],
      },
      {
        title: 'Information & Communication',
        fields: [
          {
            id: 'ic-comm-appropriate',
            label: 'Does the communication process appropriately support preparation of financial statements?',
            type: 'yesno',
          },
          {
            id: 'ic-comm-notes',
            label: 'Information system and communication observations',
            type: 'textarea',
            prefilled: 'Entity uses an ERP system for transaction processing. Management communicates significant financial reporting matters to those charged with governance via quarterly board presentations.',
          },
        ],
      },
    ],
  },
  {
    id: 'analytical',
    title: 'Analytical',
    formRef: 'Form 08',
    sections: [
      {
        title: 'Financial Statement Risk — Overall',
        fields: [
          {
            id: 'anal-fs-risk',
            label: 'Overall financial statement risk level',
            type: 'risk',
            prefilled: 'Medium',
            options: ['Low', 'Medium', 'High', 'Significant'],
          },
          {
            id: 'anal-going-concern',
            label: 'Going concern risk identified?',
            type: 'yesno',
            prefilled: 'No',
          },
          {
            id: 'anal-material-weakness',
            label: 'Material weaknesses noted in prior year?',
            type: 'yesno',
            prefilled: 'No',
          },
        ],
      },
      {
        title: 'Preliminary Analytical Procedures',
        fields: [
          {
            id: 'anal-approach',
            label: 'Overall analytical approach',
            type: 'select',
            prefilled: 'Ratio analysis',
            options: ['Simple trend', 'Ratio analysis', 'Regression analysis', 'Predictive model'],
          },
          {
            id: 'anal-unusual',
            label: 'Unusual fluctuations identified in trial balance?',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'anal-new-accounts',
            label: 'New account activity since prior year?',
            type: 'yesno',
            prefilled: 'Yes',
          },
          {
            id: 'anal-notes',
            label: 'Analytical observations',
            type: 'textarea',
            prefilled: 'Trial balance review identified unusual fluctuation in revenue (new licensing stream) and a reclassification in treasury-related payroll expense. New accounts opened for licensing arrangements require additional scrutiny. Prior year comparative analysis shows significant YoY variance in operating income.',
          },
        ],
      },
    ],
  },
]

// ─── Suggested next steps derived from open items ────────────────────────────

const OPEN_ITEM_NEXT_STEPS: Record<string, string> = {
  // Cash (Form 10)
  'cash-control':       'Assess and document control risk for Cash before finalizing the audit approach',
  'cash-cutoff':        'Determine whether cash cutoff testing is required around 12/31/2026',
  // Trade Receivables (Form 12)
  'ar-control':         'Evaluate and record Trade Receivables control risk to complete the risk matrix',
  'ar-allowance':       'Assess adequacy of the allowance for doubtful accounts and document conclusion',
  'ar-scope':           'Document scope and sampling rationale for Accounts Receivable confirmations',
  // Revenue (Form 09)
  'rev-journals':       'Confirm whether journal entry testing is required for manual revenue entries (AU-C 240.32)',
  // Inventories (Form 14)
  'inv-obs-date':       'Schedule and document the planned inventory observation date (AU-C 501)',
  'inv-costing':        'Determine whether cost rollback testing is needed for Inventory valuation',
  'inv-scope':          'Complete scope notes for the Inventories audit procedures',
  // Payroll (Form 17)
  'pay-accrual':        'Select the year-end payroll accrual testing approach and document rationale',
  // Internal Control (PIN-CX-4.1)
  'ic-env-found':       'Document whether the control environment provides an appropriate foundation for other IC components',
  'ic-ra-appropriate':  'Evaluate and document whether the risk assessment process is appropriate',
  'ic-mon-appropriate': 'Document evaluation of the monitoring process adequacy',
  'ic-comm-appropriate':'Document whether the communication process appropriately supports financial statement preparation',
  // Analytical (Form 08)
  'anal-unusual':       'Document and investigate unusual fluctuations identified in the trial balance review',
}

function deriveSuggestedNextSteps(
  forms: RiskForm[],
  answers: Record<string, string>
): string[] {
  const steps: string[] = []
  for (const form of forms) {
    for (const section of form.sections) {
      for (const field of section.fields) {
        const isOpen = !answers[field.id] && !field.prefilled
        if (isOpen && OPEN_ITEM_NEXT_STEPS[field.id]) {
          steps.push(OPEN_ITEM_NEXT_STEPS[field.id])
        }
      }
    }
  }
  // Return up to 4 most actionable suggestions
  return steps.slice(0, 4)
}

function openItemCount(form: RiskForm, answers: Record<string, string>): number {
  return form.sections.flatMap((s) => s.fields).filter(
    (f) => !answers[f.id] && !f.prefilled
  ).length
}

function riskColor(level: string): string {
  if (level === 'Significant') return '#b91c1c'
  if (level === 'High') return '#D64000'
  if (level === 'Medium') return '#d97706'
  return '#15803d'
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RiskPlanningPanel({
  onAllComplete,
  onSuggestedStepsChange,
}: {
  onAllComplete?: () => void
  onSuggestedStepsChange?: (steps: string[]) => void
}) {
  const [activeTab, setActiveTab] = useState(RISK_FORMS[0].id)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showOpenOnly, setShowOpenOnly] = useState(false)
  const notifiedRef = useRef(false)

  const setAnswer = (id: string, val: string) =>
    setAnswers((prev) => ({ ...prev, [id]: val }))

  const activeForm = RISK_FORMS.find((f) => f.id === activeTab)!
  const openCount = (form: RiskForm) => openItemCount(form, answers)

  const totalOpenItems = useMemo(
    () => RISK_FORMS.reduce((sum, f) => sum + openItemCount(f, answers), 0),
    [answers]
  )

  // Fire onAllComplete exactly once when all items are filled in
  useEffect(() => {
    if (totalOpenItems === 0 && !notifiedRef.current && onAllComplete) {
      notifiedRef.current = true
      onAllComplete()
    }
  }, [totalOpenItems, onAllComplete])

  const suggestedNextSteps = useMemo(
    () => deriveSuggestedNextSteps(RISK_FORMS, answers),
    [answers]
  )

  // Notify parent whenever suggested steps change
  useEffect(() => {
    onSuggestedStepsChange?.(suggestedNextSteps)
  }, [suggestedNextSteps, onSuggestedStepsChange])

  const visibleSections = activeForm.sections.map((section) => ({
    ...section,
    fields: showOpenOnly
      ? section.fields.filter((f) => !answers[f.id] && !f.prefilled)
      : section.fields,
  })).filter((s) => !showOpenOnly || s.fields.length > 0)

  const activeOpenCount = openCount(activeForm)

  return (
    <div
      className="w-full rounded-2xl border bg-white overflow-hidden"
      style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
    >
      {/* Tab bar */}
      <div
        className="flex items-center gap-0 overflow-x-auto border-b"
        style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
        role="tablist"
        aria-label="Risk planning forms"
      >
        {RISK_FORMS.map((form) => {
          const count = openCount(form)
          const isActive = form.id === activeTab
          return (
            <button
              key={form.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${form.id}`}
              onClick={() => { setActiveTab(form.id); setShowOpenOnly(false) }}
              className={`
                relative flex shrink-0 items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap
                ${isActive
                  ? 'border-b-2 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                }
              `}
              style={isActive ? { borderBottomColor: 'var(--saf-color-brand-orange, #D64000)' } : {}}
            >
              {form.title}
              {count > 0 ? (
                <span
                  className="flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white"
                  style={{ backgroundColor: 'var(--saf-color-brand-orange, #D64000)' }}
                  aria-label={`${count} open items`}
                >
                  {count}
                </span>
              ) : (
                <CheckCircle2
                  size={12}
                  className="text-green-600"
                  aria-label="Complete"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Form header with toggle */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'var(--saf-color-neutral-100, #f3f4f6)' }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-gray-800">{activeForm.title} — Risk Planning</h3>
          <span className="text-[10px] font-mono text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">{activeForm.formRef}</span>
          {activeOpenCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
              <AlertCircle size={10} aria-hidden="true" />
              {activeOpenCount} open {activeOpenCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
        {activeOpenCount > 0 && (
          <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600 select-none">
            <span>Open items only</span>
            <button
              role="switch"
              aria-checked={showOpenOnly}
              onClick={() => setShowOpenOnly((v) => !v)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2`}
              style={{
                backgroundColor: showOpenOnly
                  ? 'var(--saf-color-brand-orange, #D64000)'
                  : 'var(--saf-color-neutral-300, #d1d5db)',
              }}
            >
              <span
                className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${showOpenOnly ? 'translate-x-4' : 'translate-x-0.5'}`}
              />
            </button>
          </label>
        )}
      </div>

      {/* Form body */}
      <div
        id={`panel-${activeForm.id}`}
        role="tabpanel"
        className="max-h-96 overflow-y-auto divide-y px-0"
        style={{ divideColor: 'var(--saf-color-neutral-100, #f3f4f6)' }}
      >
        {visibleSections.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <CheckCircle2 size={28} className="text-green-500" />
            <p className="text-sm font-medium text-gray-700">All items complete</p>
            <p className="text-xs text-gray-400">No open items remain for this form.</p>
          </div>
        ) : (
          visibleSections.map((section) => (
            <div key={section.title} className="px-4 py-3">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {section.title}
              </p>
              <div className="space-y-3">
                {section.fields.map((field) => {
                  const value = answers[field.id] ?? field.prefilled ?? ''
                  const isOpen = !value
                  return (
                    <FieldRow
                      key={field.id}
                      field={field}
                      value={value}
                      isOpen={isOpen}
                      onChange={(v) => setAnswer(field.id, v)}
                    />
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between border-t px-4 py-2.5"
        style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
      >
        <span className="text-xs text-gray-400">
          Source: Guided Assurance · {activeForm.formRef} · Pre-filled from prior year engagement
        </span>
        <a
          href="#guided-assurance"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium hover:underline"
          style={{ color: 'var(--saf-color-brand-orange, #D64000)' }}
        >
          Open in Guided Assurance ↗
        </a>
      </div>
    </div>
  )
}

// ─── Field row ────────────────────────────────────────────────────────────────

function FieldRow({
  field,
  value,
  isOpen,
  onChange,
}: {
  field: FormField
  value: string
  isOpen: boolean
  onChange: (v: string) => void
}) {
  return (
    <div
      className={`rounded-lg px-3 py-2.5 ${isOpen ? 'border' : 'bg-gray-50'}`}
      style={isOpen ? { borderColor: 'var(--saf-color-brand-orange, #D64000)', backgroundColor: '#fff7f5' } : {}}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <label
          htmlFor={field.id}
          className="text-xs font-medium text-gray-700 leading-tight"
        >
          {field.label}
          {field.required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
        </label>
        {isOpen && (
          <span
            className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: 'var(--saf-color-brand-orange, #D64000)' }}
          >
            Open
          </span>
        )}
      </div>

      {field.type === 'yesno' && (
        <div className="flex gap-2">
          {['Yes', 'No'].map((opt) => (
            <button
              key={opt}
              id={field.id}
              onClick={() => onChange(opt)}
              className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${value === opt ? 'text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              style={value === opt
                ? { backgroundColor: 'var(--saf-color-brand-orange, #D64000)', borderColor: 'var(--saf-color-brand-orange, #D64000)' }
                : { borderColor: 'var(--saf-color-neutral-300, #d1d5db)' }}
              aria-pressed={value === opt}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {field.type === 'risk' && (
        <div className="flex flex-wrap gap-1.5">
          {(field.options ?? []).map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors`}
              style={
                value === opt
                  ? { backgroundColor: riskColor(opt), borderColor: riskColor(opt), color: '#fff' }
                  : { borderColor: 'var(--saf-color-neutral-300, #d1d5db)', color: '#6b7280' }
              }
              aria-pressed={value === opt}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {field.type === 'select' && (
        <select
          id={field.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:ring-1"
          style={{
            borderColor: isOpen ? 'var(--saf-color-brand-orange, #D64000)' : 'var(--saf-color-neutral-300, #d1d5db)',
          }}
        >
          <option value="">Select...</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {field.type === 'text' && (
        <input
          id={field.id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter value..."
          className="w-full rounded-md border bg-white px-2.5 py-1.5 text-xs text-gray-700 placeholder-gray-400 outline-none focus:ring-1"
          style={{
            borderColor: isOpen ? 'var(--saf-color-brand-orange, #D64000)' : 'var(--saf-color-neutral-300, #d1d5db)',
          }}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          id={field.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter notes..."
          rows={2}
          className="w-full resize-none rounded-md border bg-white px-2.5 py-1.5 text-xs text-gray-700 placeholder-gray-400 outline-none focus:ring-1"
          style={{
            borderColor: isOpen ? 'var(--saf-color-brand-orange, #D64000)' : 'var(--saf-color-neutral-300, #d1d5db)',
          }}
        />
      )}
    </div>
  )
}
