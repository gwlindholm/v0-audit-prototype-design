'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle2, PlusCircle, MinusCircle, ChevronDown, ChevronUp, ChevronRight, X } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

type RecommendationType = 'add' | 'exclude'

interface ProcedureRecommendation {
  id: string
  text: string
  assertions: string
  type: RecommendationType
  rationale: string
}

interface FullProcedure {
  id: string
  number: string
  text: string
  assertions: string
  /** ID of a recommendation that maps to this procedure */
  recommendationId?: string
  children?: FullProcedure[]
}

interface FullProcedureSection {
  id: string
  title: string
  procedures: FullProcedure[]
}

interface AreaRecommendations {
  id: string
  code: string
  title: string
  recommendations: ProcedureRecommendation[]
  fullProgram: {
    description: string
    sections: FullProcedureSection[]
  }
}

// ─── Full program data per AP ─────────────────────────────────────────────────

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
    fullProgram: {
      description: 'Procedures for auditing cash balances. The highlighted procedures below are flagged by Guided Assurance based on your risk assessment.',
      sections: [
        {
          id: 'cash-basic',
          title: 'Cash (Basic)',
          procedures: [
            {
              id: 'fp-c1',
              number: '1.',
              text: 'Obtain a listing of all cash and cash equivalent accounts and agree to the general ledger.',
              assertions: 'EO, C, RO',
            },
            {
              id: 'fp-c2',
              number: '2.',
              text: 'Send bank confirmation requests to all financial institutions holding cash balances.',
              assertions: 'EO, C, RO, V',
              children: [
                { id: 'fp-c2a', number: 'a.', text: 'Follow up on any outstanding confirmations within 10 business days.', assertions: 'C' },
                { id: 'fp-c2b', number: 'b.', text: 'Investigate and resolve any discrepancies noted between confirmations and recorded balances.', assertions: 'V, ACLP' },
              ],
            },
            {
              id: 'fp-c3',
              number: '3.',
              text: 'Perform bank reconciliation procedures for all accounts with balances greater than $50,000.',
              assertions: 'C, RO, V',
            },
            {
              id: 'fp-c4',
              number: '4.',
              text: 'Test cash cutoff by reviewing disbursements and receipts for the five business days before and after year-end.',
              assertions: 'CO',
              recommendationId: 'c-add-1',
            },
          ],
        },
        {
          id: 'cash-petty',
          title: 'Petty Cash',
          procedures: [
            {
              id: 'fp-c5',
              number: '1.',
              text: 'Perform petty cash count and reconciliation for all petty cash funds.',
              assertions: 'EO, C',
              recommendationId: 'c-excl-1',
            },
          ],
        },
        {
          id: 'cash-restricted',
          title: 'Restricted Cash',
          procedures: [
            {
              id: 'fp-c6',
              number: '1.',
              text: 'Obtain documentation supporting any amounts classified as restricted cash and evaluate appropriateness of classification.',
              assertions: 'C, PD',
            },
          ],
        },
        {
          id: 'cash-concluding',
          title: 'Concluding Audit Steps',
          procedures: [
            { id: 'fp-c7', number: '1.', text: 'Ensure that the workpapers include the information needed to support required financial statement disclosures and such information has been subjected to appropriate audit procedures.', assertions: '' },
            { id: 'fp-c8', number: '2.', text: 'Consider the need to apply one or more additional procedures and whether the results of audit procedures indicate internal control related matters that are required to be communicated to management and others.', assertions: '' },
          ],
        },
      ],
    },
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
    fullProgram: {
      description: 'Procedures for auditing trade receivables and the related allowance for doubtful accounts.',
      sections: [
        {
          id: 'ar-basic',
          title: 'Accounts Receivable (Basic)',
          procedures: [
            { id: 'fp-ar1', number: '1.', text: 'Obtain the accounts receivable aging schedule and agree total to the general ledger.', assertions: 'EO, C, RO' },
            {
              id: 'fp-ar2',
              number: '2.',
              text: 'Send positive confirmation requests using statistical sampling methodology to a representative sample of customers.',
              assertions: 'EO, C, RO, V',
              children: [
                { id: 'fp-ar2a', number: 'a.', text: 'Apply alternative procedures (vouch to subsequent cash receipts) for non-responses.', assertions: 'EO, C' },
              ],
            },
            { id: 'fp-ar3', number: '3.', text: 'Perform analytical procedures comparing AR turnover and days sales outstanding to prior year and budget.', assertions: 'C, V, ACLP' },
            { id: 'fp-ar4', number: '4.', text: 'Evaluate the adequacy of the allowance for doubtful accounts by reviewing management\'s estimate and testing underlying assumptions.', assertions: 'V, ACLP' },
            {
              id: 'fp-ar5',
              number: '5.',
              text: 'Perform a rollforward of the allowance for doubtful accounts from prior year-end to current year-end, validating write-offs and new provisions.',
              assertions: 'V, ACLP',
              recommendationId: 'ar-add-1',
            },
            {
              id: 'fp-ar6',
              number: '6.',
              text: 'Test a sample of credit memos issued after year-end to evaluate whether any relate to pre-year-end transactions.',
              assertions: 'CO, EO',
              recommendationId: 'ar-add-2',
            },
          ],
        },
        {
          id: 'ar-concluding',
          title: 'Concluding Audit Steps',
          procedures: [
            { id: 'fp-ar7', number: '1.', text: 'Ensure that the workpapers include the information needed to support required financial statement disclosures.', assertions: '' },
            { id: 'fp-ar8', number: '2.', text: 'Consider the need to apply one or more additional procedures and whether the results of audit procedures indicate internal control related matters.', assertions: '' },
          ],
        },
      ],
    },
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
    fullProgram: {
      description: 'Procedures for auditing revenue recognition under ASC 606 / IFRS 15, including the five-step model and related journal entries.',
      sections: [
        {
          id: 'rev-recognition',
          title: 'Revenue Recognition (ASC 606)',
          procedures: [
            { id: 'fp-rv1', number: '1.', text: 'Evaluate the client\'s revenue recognition policy for compliance with ASC 606, focusing on the five-step model.', assertions: 'EO, C, PD' },
            {
              id: 'fp-rv2',
              number: '2.',
              text: 'Select a sample of revenue transactions and trace from contract through recognition, verifying each step of the ASC 606 model is satisfied.',
              assertions: 'EO, C, RO, V, CO',
              children: [
                { id: 'fp-rv2a', number: 'a.', text: 'Focus selection on Q4 entries, manual journal entries, and entries near period-end.', assertions: 'CO' },
              ],
            },
            { id: 'fp-rv3', number: '3.', text: 'Perform a regression analysis comparing current year revenue by product line to prior year, investigating variances exceeding 10% or $500K.', assertions: 'C, V, ACLP' },
            { id: 'fp-rv4', number: '4.', text: 'Test journal entries for manual revenue postings, focusing on unusual entries, entries posted by IT or senior management, and entries near period-end.', assertions: 'EO, C, ACLP' },
            {
              id: 'fp-rv5',
              number: '5.',
              text: 'Test percentage-of-completion calculations for long-term construction contracts.',
              assertions: 'V, ACLP',
              recommendationId: 'rv-excl-1',
            },
            {
              id: 'fp-rv6',
              number: '6.',
              text: 'Review contract modifications and variable consideration arrangements entered into during the year for appropriate accounting treatment under ASC 606.',
              assertions: 'V, PD',
              recommendationId: 'rv-add-1',
            },
            {
              id: 'fp-rv7',
              number: '7.',
              text: 'Obtain and review a listing of all side agreements or amendments to customer contracts and evaluate for revenue recognition implications.',
              assertions: 'EO, C, RO',
              recommendationId: 'rv-add-2',
            },
          ],
        },
        {
          id: 'rev-concluding',
          title: 'Concluding Audit Steps',
          procedures: [
            { id: 'fp-rv8', number: '1.', text: 'Ensure that the workpapers include the information needed to support required financial statement disclosures.', assertions: '' },
            { id: 'fp-rv9', number: '2.', text: 'Consider the need to apply additional procedures and whether results indicate internal control matters to communicate to management.', assertions: '' },
          ],
        },
      ],
    },
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
    fullProgram: {
      description: 'Procedures for auditing inventory existence, valuation, cost of sales, and physical observation under AU-C 501.',
      sections: [
        {
          id: 'inv-basic',
          title: 'Inventory',
          procedures: [
            { id: 'fp-inv1', number: '1.', text: 'Update your understanding of the valuation procedures used by the client. Identify changes in products, accounting policies, and methods used to accumulate inventory cost.', assertions: 'EO, C, RO, V, ACLP' },
            {
              id: 'fp-inv2',
              number: '2.',
              text: 'Perform and document (including expectations) the following analytical procedures:',
              assertions: 'EO, C, V, ACLP, CO',
              children: [
                { id: 'fp-inv2a', number: 'a.', text: 'Compare balances of inventory with those of prior periods or other expectations.', assertions: 'EO, C, V, ACLP, CO' },
                { id: 'fp-inv2b', number: 'b.', text: 'Compute the ratio of inventory classifications to total inventory and compare the ratios with those of prior periods.', assertions: 'EO, C, V, ACLP, CO' },
                { id: 'fp-inv2c', number: 'c.', text: 'Compute inventory turnover and compare with the turnover of prior periods or other expectations.', assertions: 'EO, C, V, ACLP, CO' },
              ],
            },
            {
              id: 'fp-inv3',
              number: '3.',
              text: 'Perform the following valuation procedures:',
              assertions: 'V, ACLP',
              children: [
                { id: 'fp-inv3a', number: 'a.', text: 'Obtain or update your understanding of management\'s process for determining write-downs for scrap, obsolete, unsalable, slow-moving, or overstocked items.', assertions: 'V, ACLP' },
                {
                  id: 'fp-inv3b',
                  number: 'b.',
                  text: 'Compare relevant information obtained during the physical inventory observation to the final inventory listing and investigate unusual differences.',
                  assertions: 'V, ACLP',
                  recommendationId: 'inv-add-1',
                },
                { id: 'fp-inv3c', number: 'c.', text: "Determine the client's method for identifying potential problems. Inquire of production and sales personnel concerning possible excess, defective, obsolete, and other inventory items.", assertions: 'V, ACLP' },
              ],
            },
            { id: 'fp-inv4', number: '4.', text: 'Observe the entity\'s physical inventory. Use the separate inventory observation program at PIN-AP-60.', assertions: 'EO, C, RO, CO' },
          ],
        },
        {
          id: 'inv-nrv',
          title: 'Test of Lower of Cost or Net Realizable Value',
          procedures: [
            {
              id: 'fp-inv5',
              number: '1.',
              text: 'Perform lower of cost or net realizable value analysis on the top 20 inventory SKUs by carrying value.',
              assertions: 'V, ACLP',
              recommendationId: 'inv-add-2',
            },
            {
              id: 'fp-inv6',
              number: '2.',
              text: 'Review and test the determination of market prices to determine whether net realizable value is lower than cost.',
              assertions: 'V, ACLP',
              children: [
                { id: 'fp-inv6a', number: 'a.', text: 'Test the net realizable value of finished goods by comparing costs to current sales prices (after deducting reasonable completion and sales costs).', assertions: 'V, ACLP' },
                { id: 'fp-inv6b', number: 'b.', text: 'Review management\'s current period assessment of any items written down in prior periods for evidence of possible reversals.', assertions: 'V, ACLP' },
              ],
            },
          ],
        },
        {
          id: 'inv-cos',
          title: 'Cost of Sales',
          procedures: [
            { id: 'fp-inv7', number: '1.', text: 'Perform and document (including expectations) analytical procedures on cost of sales, comparing balances and gross profit margin to prior periods or other expectations.', assertions: 'EO, C, ACLP, CO' },
            { id: 'fp-inv8', number: '2.', text: 'Investigate any unexpected results (that is, ratios or variations different from what would be expected), considering known changes in client or industry operations.', assertions: 'EO, C, ACLP, CO' },
          ],
        },
        {
          id: 'inv-concluding',
          title: 'Concluding Audit Steps',
          procedures: [
            { id: 'fp-inv9', number: '1.', text: 'Ensure that the workpapers include the information needed to support required financial statement disclosures.', assertions: '' },
            { id: 'fp-inv10', number: '2.', text: 'Consider the need to apply one or more additional procedures.', assertions: '' },
          ],
        },
      ],
    },
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
    fullProgram: {
      description: 'Procedures for auditing payroll liabilities, payroll expense, and related accruals including AU-C 240 fraud procedures.',
      sections: [
        {
          id: 'pay-accrued',
          title: 'Accrued Payroll-related Liabilities',
          procedures: [
            { id: 'fp-pay1', number: '1.', text: 'Compare and document (including expectations) the balances in accrued payroll-related liabilities with those of prior periods or other expectations. Investigate any unusual fluctuations.', assertions: 'EO, C, RO, V, ACLP, CO' },
            {
              id: 'fp-pay2',
              number: '2.',
              text: 'Test payroll-related accruals by performing the following procedures:',
              assertions: 'EO, C, RO, V, ACLP, CO',
              children: [
                { id: 'fp-pay2a', number: 'a.', text: 'Scan the working trial balance and determine those payroll-related accrual accounts for which additional testing should be performed.', assertions: 'EO, C, RO, V, ACLP, CO' },
                { id: 'fp-pay2b', number: 'b.', text: 'Determine the basis and method of accrual.', assertions: 'EO, C, RO, V, ACLP, CO' },
                { id: 'fp-pay2c', number: 'c.', text: 'Test the reasonableness of the accrual by performing and documenting (including expectations) a predictive test of the amount.', assertions: 'EO, C, RO, V, ACLP, CO' },
                {
                  id: 'fp-pay2d',
                  number: 'd.',
                  text: 'Test accuracy of the year-end bonus accrual by agreeing amounts to board-approved bonus plans and recalculating individual awards.',
                  assertions: 'C, V, CO',
                  recommendationId: 'pay-add-1',
                },
              ],
            },
          ],
        },
        {
          id: 'pay-expense',
          title: 'Payroll Expense',
          procedures: [
            { id: 'fp-pay3', number: '1.', text: 'Reconcile total payroll per the payroll register to the general ledger and investigate variances.', assertions: 'C, RO, V' },
            { id: 'fp-pay4', number: '2.', text: 'Test a sample of employees for proper authorization, correct rate of pay, and agreement to employment records.', assertions: 'EO, C, V' },
            { id: 'fp-pay5', number: '3.', text: 'Evaluate the year-end payroll accrual by recalculating accrued wages, salaries, vacation, and bonuses.', assertions: 'C, V, CO' },
            { id: 'fp-pay6', number: '4.', text: 'Agree executive compensation to board-approved compensation arrangements and verify disclosure requirements.', assertions: 'EO, V, PD' },
          ],
        },
        {
          id: 'pay-concluding',
          title: 'Concluding Audit Steps',
          procedures: [
            { id: 'fp-pay7', number: '1.', text: 'Ensure that the workpapers include the information needed to support required financial statement disclosures.', assertions: '' },
            { id: 'fp-pay8', number: '2.', text: 'Consider the need to apply additional procedures and whether the results indicate internal control related matters to communicate.', assertions: '' },
          ],
        },
      ],
    },
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
    fullProgram: {
      description: 'Procedures for auditing equity accounts, including share capital, retained earnings, dividends, and equity-based compensation.',
      sections: [
        {
          id: 'eq-basic',
          title: 'Equity (Basic)',
          procedures: [
            { id: 'fp-eq1', number: '1.', text: 'Obtain and review equity rollforward schedules for common stock, additional paid-in capital, retained earnings, and other comprehensive income.', assertions: 'EO, C, RO, V' },
            { id: 'fp-eq2', number: '2.', text: 'Agree dividends declared and paid to board of directors minutes and authorization.', assertions: 'EO, C' },
            { id: 'fp-eq3', number: '3.', text: 'Confirm shares outstanding and other equity information with the transfer agent.', assertions: 'C, RO' },
            { id: 'fp-eq4', number: '4.', text: 'Evaluate disclosures for equity-related transactions for completeness and accuracy per applicable accounting standards.', assertions: 'C, PD' },
            {
              id: 'fp-eq5',
              number: '5.',
              text: 'Obtain board minutes for all meetings during the year and confirm all equity transactions (issuances, repurchases, dividends) are properly authorized.',
              assertions: 'EO, C',
              recommendationId: 'eq-add-1',
            },
            {
              id: 'fp-eq6',
              number: '6.',
              text: 'Test stock option exercises and agree to option agreements and payroll records.',
              assertions: 'EO, V',
              recommendationId: 'eq-excl-1',
            },
          ],
        },
        {
          id: 'eq-concluding',
          title: 'Concluding Audit Steps',
          procedures: [
            { id: 'fp-eq7', number: '1.', text: 'Ensure that the workpapers include the information needed to support required financial statement disclosures.', assertions: '' },
            { id: 'fp-eq8', number: '2.', text: 'Consider the need to apply additional procedures and whether results indicate internal control matters to communicate to management and others.', assertions: '' },
          ],
        },
      ],
    },
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
      className={`px-4 py-3 text-sm transition-colors ${dismissed ? 'opacity-40' : 'hover:bg-gray-50/60'}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {isAdd ? (
            <PlusCircle size={15} className="text-green-600" aria-label="Recommended to add" />
          ) : (
            <MinusCircle size={15} className="text-red-500" aria-label="Recommended to exclude" />
          )}
        </div>

        <div className="flex-1 space-y-1 min-w-0">
          <p className={`leading-relaxed text-gray-800 text-xs ${dismissed ? 'line-through' : ''}`}>
            {rec.text}
          </p>
          <p className="text-[11px] text-gray-400">{rec.assertions}</p>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-gray-700"
          >
            <ChevronDown
              size={10}
              className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
            {expanded ? 'Hide rationale' : 'View rationale'}
          </button>

          {expanded && (
            <p
              className="rounded-md border-l-2 pl-3 text-[11px] leading-relaxed text-gray-600 italic"
              style={{ borderColor: 'var(--saf-color-brand-orange, #D64000)' }}
            >
              {rec.rationale}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 mt-0.5">
          {accepted ? (
            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-green-700 bg-green-50">
              <CheckCircle2 size={10} aria-hidden="true" />
              {isAdd ? 'Added' : 'Excluded'}
            </span>
          ) : dismissed ? (
            <span className="rounded-full px-2 py-0.5 text-[11px] font-medium text-gray-400 bg-gray-100">
              Dismissed
            </span>
          ) : (
            <>
              <button
                onClick={() => onAccept(rec.id)}
                className="rounded px-2 py-0.5 text-[11px] font-semibold text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: isAdd ? '#15803d' : '#dc2626' }}
              >
                {isAdd ? 'Add' : 'Exclude'}
              </button>
              <button
                onClick={() => onDismiss(rec.id)}
                className="rounded border px-2 py-0.5 text-[11px] font-medium text-gray-600 transition-colors hover:bg-gray-50"
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

// ─── Full program drawer ───────────────────────────────────────────────────────

function FullProcedureItem({
  proc,
  depth,
  recommendations,
  accepted,
  dismissed,
}: {
  proc: FullProcedure
  depth: number
  recommendations: ProcedureRecommendation[]
  accepted: Set<string>
  dismissed: Set<string>
}) {
  const rec = proc.recommendationId
    ? recommendations.find((r) => r.id === proc.recommendationId)
    : undefined
  const isAccepted = rec ? accepted.has(rec.id) : false
  const isDismissed = rec ? dismissed.has(rec.id) : false
  const isAdd = rec?.type === 'add'
  const isExclude = rec?.type === 'exclude'

  let highlight = ''
  if (rec) {
    if (isAdd) highlight = 'bg-green-50 border-l-2 border-green-500'
    else if (isExclude) highlight = 'bg-red-50 border-l-2 border-red-400'
  }

  return (
    <>
      <div
        className={`flex items-start gap-2 py-2 pr-3 text-sm text-gray-700 rounded-sm ${highlight}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        <span className="shrink-0 text-gray-400 text-xs font-mono mt-0.5 min-w-[24px]">{proc.number}</span>
        <div className="flex-1 min-w-0">
          <span className={`leading-relaxed text-xs ${isDismissed ? 'opacity-50' : ''}`}>{proc.text}</span>
          {proc.assertions && (
            <p className="text-[10px] text-gray-400 mt-0.5">{proc.assertions}</p>
          )}
          {rec && (
            <div className="mt-1 flex items-center gap-1.5">
              {isAdd ? (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-100 rounded-full px-2 py-0.5">
                  <PlusCircle size={9} aria-hidden="true" />
                  Recommended to add
                  {isAccepted && <CheckCircle2 size={9} className="text-green-600" aria-hidden="true" />}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-red-600 bg-red-100 rounded-full px-2 py-0.5">
                  <MinusCircle size={9} aria-hidden="true" />
                  Recommended to exclude
                  {isAccepted && <CheckCircle2 size={9} className="text-red-500" aria-hidden="true" />}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {proc.children?.map((child) => (
        <FullProcedureItem
          key={child.id}
          proc={child}
          depth={depth + 1}
          recommendations={recommendations}
          accepted={accepted}
          dismissed={dismissed}
        />
      ))}
    </>
  )
}

function FullProgramDrawer({
  area,
  accepted,
  dismissed,
  onClose,
}: {
  area: AreaRecommendations
  accepted: Set<string>
  dismissed: Set<string>
  onClose: () => void
}) {
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const highlightedCount = area.recommendations.length

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        aria-hidden="true"
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Full program: ${area.code} ${area.title}`}
        className="fixed right-0 top-0 z-50 flex h-full w-[520px] max-w-[95vw] flex-col bg-white shadow-2xl"
        style={{ borderLeft: '1px solid var(--saf-color-neutral-200, #e5e7eb)' }}
      >
        {/* Header */}
        <div
          className="flex shrink-0 items-center justify-between gap-3 border-b px-5 py-3.5"
          style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">{area.code}</span>
              <h2 className="text-sm font-bold text-gray-900 truncate">{area.title} — Full Program</h2>
            </div>
            <p className="mt-0.5 text-[11px] text-gray-500 leading-relaxed">
              {highlightedCount} procedure{highlightedCount !== 1 ? 's' : ''} highlighted based on your risk assessment
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close full program drawer"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        {/* Legend */}
        <div
          className="flex shrink-0 items-center gap-4 border-b px-5 py-2"
          style={{ borderColor: 'var(--saf-color-neutral-100, #f3f4f6)' }}
        >
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="inline-block h-3 w-1.5 rounded-sm bg-green-500" aria-hidden="true" />
            Recommended to add
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="inline-block h-3 w-1.5 rounded-sm bg-red-400" aria-hidden="true" />
            Recommended to exclude
          </span>
        </div>

        {/* Description */}
        <div
          className="shrink-0 border-b px-5 py-3"
          style={{ borderColor: 'var(--saf-color-neutral-100, #f3f4f6)' }}
        >
          <p className="text-[11px] text-gray-500 leading-relaxed">{area.fullProgram.description}</p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {area.fullProgram.sections.map((section) => (
            <div key={section.id}>
              <h3
                className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500"
              >
                {section.title}
              </h3>
              <div
                className="rounded-lg border overflow-hidden"
                style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
              >
                <div className="divide-y" style={{ borderColor: 'var(--saf-color-neutral-100, #f3f4f6)' }}>
                  {section.procedures.map((proc) => (
                    <FullProcedureItem
                      key={proc.id}
                      proc={proc}
                      depth={0}
                      recommendations={area.recommendations}
                      accepted={accepted}
                      dismissed={dismissed}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex shrink-0 items-center border-t px-5 py-3"
          style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
        >
          <span className="text-[11px] text-gray-400">
            Sourced from Guided Assurance · {area.code}
          </span>
          <button
            onClick={onClose}
            className="ml-auto rounded-md border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'var(--saf-color-neutral-300, #d1d5db)' }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Area card ────────────────────────────────────────────────────────────────

function AreaCard({
  area,
  accepted,
  dismissed,
  onAccept,
  onDismiss,
}: {
  area: AreaRecommendations
  accepted: Set<string>
  dismissed: Set<string>
  onAccept: (id: string) => void
  onDismiss: (id: string) => void
}) {
  const openCount = area.recommendations.filter(
    (r) => !accepted.has(r.id) && !dismissed.has(r.id)
  ).length
  const allDone = openCount === 0

  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <div
        className="overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-sm"
        style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
      >
        {/* Card header */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50/60"
          aria-expanded={!collapsed}
        >
          {/* Code + title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-400">{area.code}</span>
              <span className="text-sm font-semibold text-gray-900">{area.title}</span>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex shrink-0 items-center gap-2">
            {allDone ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-green-700">
                <CheckCircle2 size={13} aria-hidden="true" />
                All reviewed
              </span>
            ) : (
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: 'var(--saf-color-brand-orange, #D64000)' }}
                aria-label={`${openCount} open recommendations`}
              >
                {openCount}
              </span>
            )}
            {collapsed
              ? <ChevronRight size={14} className="text-gray-400" aria-hidden="true" />
              : <ChevronDown size={14} className="text-gray-400" aria-hidden="true" />
            }
          </div>
        </button>

        {/* Recommendations list */}
        {!collapsed && (
          <>
            <div
              className="border-t divide-y"
              style={{
                borderColor: 'var(--saf-color-neutral-100, #f3f4f6)',
              }}
            >
              {area.recommendations.map((rec) => (
                <RecommendationRow
                  key={rec.id}
                  rec={rec}
                  accepted={accepted.has(rec.id)}
                  dismissed={dismissed.has(rec.id)}
                  onAccept={onAccept}
                  onDismiss={onDismiss}
                />
              ))}
            </div>

            {/* See full program link */}
            <div
              className="flex items-center justify-between border-t px-4 py-2"
              style={{ borderColor: 'var(--saf-color-neutral-100, #f3f4f6)' }}
            >
              <span className="text-[11px] text-gray-400">
                Showing {area.recommendations.length} flagged procedure{area.recommendations.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-1 text-[11px] font-medium transition-colors hover:underline"
                style={{ color: 'var(--saf-color-brand-orange, #D64000)' }}
              >
                See full program
                <ChevronRight size={11} aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </div>

      {drawerOpen && (
        <FullProgramDrawer
          area={area}
          accepted={accepted}
          dismissed={dismissed}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AuditProcedureRecommendations({ onAllReviewed }: { onAllReviewed?: () => void }) {
  const [accepted, setAccepted] = useState<Set<string>>(new Set())
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const notifiedRef = useRef(false)

  const accept = (id: string) => setAccepted((prev) => new Set(prev).add(id))
  const dismiss = (id: string) => setDismissed((prev) => new Set(prev).add(id))

  const totalRecs = RECOMMENDATIONS.reduce((s, a) => s + a.recommendations.length, 0)
  const totalReviewed = accepted.size + dismissed.size

  useEffect(() => {
    if (totalReviewed === totalRecs && !notifiedRef.current && onAllReviewed) {
      notifiedRef.current = true
      setTimeout(() => onAllReviewed(), 600)
    }
  }, [totalReviewed, totalRecs, onAllReviewed])

  return (
    <div className="w-full space-y-3">
      {/* Legend */}
      <div className="flex items-center gap-4 px-1">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <PlusCircle size={12} className="text-green-600" aria-hidden="true" />
          Recommended to add
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <MinusCircle size={12} className="text-red-500" aria-hidden="true" />
          Recommended to exclude
        </span>
        <span className="ml-auto text-xs text-gray-400">
          {totalReviewed}/{totalRecs} reviewed
        </span>
      </div>

      {/* Cards */}
      {RECOMMENDATIONS.map((area) => (
        <AreaCard
          key={area.id}
          area={area}
          accepted={accepted}
          dismissed={dismissed}
          onAccept={accept}
          onDismiss={dismiss}
        />
      ))}

      {/* All done state */}
      {totalReviewed === totalRecs && (
        <div className="flex flex-col items-center gap-1.5 py-5 text-center">
          <CheckCircle2 size={20} className="text-green-500" aria-hidden="true" />
          <p className="text-sm font-medium text-gray-700">All recommendations reviewed</p>
          <p className="text-xs text-gray-400">You can proceed to finalize the audit program.</p>
        </div>
      )}

      {/* Footer */}
      <p className="px-1 text-[11px] text-gray-400">
        Based on risk assessment · Sourced from Guided Assurance
      </p>
    </div>
  )
}
