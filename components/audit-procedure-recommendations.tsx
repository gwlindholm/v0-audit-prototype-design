'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle2, PlusCircle, MinusCircle, ChevronDown, ChevronRight, X } from 'lucide-react'

// ─── Data model ────────────────────────────────────────────────────────────────

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
  /** Maps to a recommendation that highlights this procedure in the drawer */
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
  /** Guided Assurance form number, e.g. "AP-30" */
  code: string
  title: string
  recommendations: ProcedureRecommendation[]
  fullProgram: {
    description: string
    sections: FullProcedureSection[]
  }
}

// ─── Recommendation & full program data ────────────────────────────────────────
// Codes and procedure text sourced directly from PPC Guided Assurance forms.
// Engagement: Setup 1 · Client: 21AUG25RELEASE1 · FY: 12/31/2026

const RECOMMENDATIONS: AreaRecommendations[] = [
  // ── AP-30 Cash ────────────────────────────────────────────────────────────────
  {
    id: 'cash',
    code: 'AP-30',
    title: 'Cash',
    recommendations: [
      {
        id: 'c-add-1',
        type: 'add',
        text: 'Scan cash receipts and disbursements for significant or unusual transactions near 12/31/2026 (both before and after year-end) and obtain explanations for any items noted.',
        assertions: 'E/O, C, CO',
        rationale: 'Cash cutoff exceptions were noted in the prior year workpapers. Treasury restructuring increases the risk of unusual interbank transfers near period-end.',
      },
      {
        id: 'c-add-2',
        type: 'add',
        text: 'For selected bank accounts, request a subsequent-period bank statement, trace deposits in transit to subsequent clearance, and inspect outstanding checks.',
        assertions: 'E/O, C, R/O, V, A/CL/P, CO',
        rationale: 'Three bank accounts were confirmed in the prior year with no exceptions. Risk assessment supports extending to additional bank reconciliation procedures for higher-balance accounts.',
      },
      {
        id: 'c-excl-1',
        type: 'exclude',
        text: 'Perform a proof of cash for all accounts (expanded bank reconciliation reconciling beginning and ending balances to general ledger).',
        assertions: 'E/O, C, V, A/CL/P',
        rationale: 'No fraud risks have been identified in the cash cycle and the control environment assessment is satisfactory. The proof of cash procedure is not required given the low inherent risk level assessed for this area.',
      },
    ],
    fullProgram: {
      description: 'PIN-AP-30 — Audit procedures for cash balances, bank reconciliations, confirmations, cutoff, and restricted cash. Procedures highlighted below are flagged based on the risk assessment for this engagement.',
      sections: [
        {
          id: 'cash-basic',
          title: 'Cash (Basic)',
          procedures: [
            {
              id: 'fp-c1',
              number: '1.',
              text: 'Perform the following bank reconciliation procedures:',
              assertions: 'E/O, C, R/O, V, A/CL/P, CO',
              children: [
                { id: 'fp-c1a', number: 'a.', text: 'Obtain the bank reconciliation for significant bank accounts for the workpapers.', assertions: 'E/O, C, R/O, V, A/CL/P, CO' },
                { id: 'fp-c1b', number: 'b.', text: 'Trace the bank balance on the reconciliation to the balance per the bank statement (or confirmations received).', assertions: 'E/O, C, R/O, V, A/CL/P, CO' },
                { id: 'fp-c1c', number: 'c.', text: 'Trace the reconciled book balance to the general ledger, working trial balance, or lead schedule as applicable.', assertions: 'E/O, C, R/O, V, A/CL/P, CO' },
                { id: 'fp-c1d', number: 'd.', text: 'Test the clerical accuracy of the reconciliation.', assertions: 'E/O, C, R/O, V, A/CL/P, CO' },
                { id: 'fp-c1e', number: 'e.', text: 'Scan the bank reconciliation for significant or unusual reconciling items. Obtain explanations and review supporting documentation for any unusual items noted.', assertions: 'E/O, C, R/O, V, A/CL/P, CO' },
              ],
            },
            {
              id: 'fp-c2',
              number: '2.',
              text: 'Perform and document (including expectations) the following analytical procedures:',
              assertions: 'E/O, C, CO',
              children: [
                {
                  id: 'fp-c2a',
                  number: 'a.',
                  text: 'Scan cash receipts and disbursements for significant or unusual transactions (including any bank transfers) near reporting period end (both before and after year-end).',
                  assertions: 'E/O, C, CO',
                  recommendationId: 'c-add-1',
                },
                { id: 'fp-c2b', number: 'b.', text: 'Obtain explanations and review supporting documentation, as necessary, for any such items noted.', assertions: 'E/O, C, CO', recommendationId: 'c-add-1' },
                { id: 'fp-c2c', number: 'c.', text: 'Obtain explanations for significant account variations from the prior period.', assertions: 'E/O, C, CO' },
                { id: 'fp-c2d', number: 'd.', text: 'Assess the reasonableness of cash balances in light of your understanding of the business and current operating results.', assertions: 'E/O, C, CO' },
              ],
            },
            {
              id: 'fp-c3',
              number: '3.',
              text: 'Perform the following confirmation procedures:',
              assertions: 'E/O, C, R/O',
              children: [
                { id: 'fp-c3a', number: 'a.', text: 'Confirm selected bank account(s), certificates of deposit, money market investments, and compensating balances as at the reporting date. Document the items selected for confirmation and retain returned confirmations.', assertions: 'E/O, C, R/O' },
                { id: 'fp-c3b', number: 'b.', text: 'Tie confirmation amounts to bank reconciliations or the general ledger as appropriate. Investigate exceptions.', assertions: 'E/O, C, R/O' },
                { id: 'fp-c3c', number: 'c.', text: 'Consider the possibility of unrecorded interest or substitution of certificate numbers for cash investments.', assertions: 'E/O, C, R/O' },
              ],
            },
            { id: 'fp-c4', number: '4.', text: 'Determine whether amounts are appropriately classified as cash, restricted cash, cash equivalents, or other short-term investments.', assertions: 'A/CL/P' },
          ],
        },
        {
          id: 'cash-additional',
          title: 'Additional Bank Reconciliation Procedures',
          procedures: [
            {
              id: 'fp-c5',
              number: '1.',
              text: 'Perform the following procedures for selected bank accounts:',
              assertions: 'E/O, C, R/O, V, A/CL/P, CO',
              children: [
                { id: 'fp-c5a', number: 'a.', text: 'Request a subsequent-period bank statement from the bank.', assertions: 'E/O, C, R/O, V, A/CL/P, CO', recommendationId: 'c-add-2' },
                { id: 'fp-c5b', number: 'b.', text: 'Compare the beginning bank balance on the subsequent bank statement to the reporting period-end bank reconciliation. Investigate any differences.', assertions: 'E/O, C, R/O, V, A/CL/P, CO', recommendationId: 'c-add-2' },
                { id: 'fp-c5c', number: 'c.', text: 'Trace deposits in transit per the bank reconciliation to deposits in the subsequent bank statement, noting whether the time period between book and bank recording is reasonable.', assertions: 'E/O, C, R/O, V, A/CL/P, CO', recommendationId: 'c-add-2' },
                { id: 'fp-c5d', number: 'd.', text: 'Inspect selected canceled checks that cleared on the subsequent bank statement. Trace checks dated before the reporting date to the list of outstanding checks.', assertions: 'E/O, C, R/O, V, A/CL/P, CO', recommendationId: 'c-add-2' },
                { id: 'fp-c5e', number: 'e.', text: 'Inspect the dates on which checks cleared the bank. Investigate any large or unusual outstanding checks that cleared late and/or outstanding checks that did not clear.', assertions: 'E/O, C, R/O, V, A/CL/P, CO' },
              ],
            },
          ],
        },
        {
          id: 'cash-interbank',
          title: 'Interbank Transfers',
          procedures: [
            {
              id: 'fp-c6',
              number: '1.',
              text: 'Using a schedule of interbank transfers for selected days before and after the reporting date, perform the following:',
              assertions: 'E/O, C, CO',
              children: [
                { id: 'fp-c6a', number: 'a.', text: 'Determine whether transfers between each ledger were recorded in the same period.', assertions: 'E/O, C, CO' },
                { id: 'fp-c6b', number: 'b.', text: 'Determine whether transfers not clearing the bank in the same accounting period are properly reflected as reconciling items on bank reconciliations.', assertions: 'E/O, C, CO' },
              ],
            },
            { id: 'fp-c7', number: '2.', text: 'Review bank statements for interbank transfers made at various times during the reporting period and investigate unexpected transfers.', assertions: 'E/O, C, R/O, CO' },
          ],
        },
        {
          id: 'cash-proof',
          title: 'Proof of Cash',
          procedures: [
            {
              id: 'fp-c8',
              number: '1.',
              text: 'Perform a proof of cash (generally as a response to identified fraud risks) using an expanded version of the bank reconciliation that reconciles the beginning-of-period balances, current-period cash receipts, current-period cash disbursements, and end-of-period balances per the bank statement and the books.',
              assertions: 'E/O, C, V, A/CL/P',
              recommendationId: 'c-excl-1',
            },
          ],
        },
        {
          id: 'cash-concluding',
          title: 'Concluding Audit Steps',
          procedures: [
            { id: 'fp-c9', number: '1.', text: 'Ensure that the workpapers include the information needed to support required financial statement disclosures and such information has been subjected to appropriate audit procedures.', assertions: '' },
            { id: 'fp-c10', number: '2.', text: 'Consider the need to apply one or more additional procedures and whether the results of audit procedures indicate internal control related matters that are required to be communicated to management and others.', assertions: '' },
          ],
        },
      ],
    },
  },

  // ── AP-40 Trade Receivables ───────────────────────────────────────────────────
  {
    id: 'ar',
    code: 'AP-40',
    title: 'Trade Receivables',
    recommendations: [
      {
        id: 'ar-add-1',
        type: 'add',
        text: 'Perform a rollforward of the allowance for doubtful accounts from prior year-end to current year-end, validating individual write-offs and the current year provision.',
        assertions: 'V, A/CL/P',
        rationale: 'Allowance methodology changed from the prior year. Risk planning identified elevated valuation risk requiring additional substantive testing of the allowance estimate.',
      },
      {
        id: 'ar-add-2',
        type: 'add',
        text: 'Test a sample of credit memos issued after year-end to evaluate whether any relate to pre-year-end transactions that should have been recorded before 12/31/2026.',
        assertions: 'CO, E/O',
        rationale: 'Revenue risk assessment flagged potential cutoff issues in Q4 that could affect the AR balance at year-end.',
      },
    ],
    fullProgram: {
      description: 'PIN-AP-40 — Audit procedures for trade receivables, confirmations, allowance for doubtful accounts, and cutoff. Procedures highlighted below are flagged based on the risk assessment for this engagement.',
      sections: [
        {
          id: 'ar-basic',
          title: 'Trade Receivables (Basic)',
          procedures: [
            {
              id: 'fp-ar1',
              number: '1.',
              text: 'Perform and document (including expectations) the following analytical procedures:',
              assertions: 'E/O, C, A/CL/P, CO',
              children: [
                { id: 'fp-ar1a', number: 'a.', text: 'Compare the balance in trade receivables with the balance for prior periods or other expectations.', assertions: 'E/O, C, A/CL/P, CO' },
                { id: 'fp-ar1b', number: 'b.', text: 'Compare accounts receivable turnover and days sales outstanding to prior-year and industry expectations.', assertions: 'E/O, C, A/CL/P' },
                { id: 'fp-ar1c', number: 'c.', text: 'Obtain explanations for significant account variations from the prior period. Assess the reasonableness of the balance.', assertions: 'E/O, C, A/CL/P' },
              ],
            },
            {
              id: 'fp-ar2',
              number: '2.',
              text: 'Obtain the accounts receivable aging schedule and agree or reconcile the total to the general ledger.',
              assertions: 'E/O, C, R/O, V',
              children: [
                { id: 'fp-ar2a', number: 'a.', text: 'Scan the aging schedule and investigate any unusual or old items.', assertions: 'E/O, C, R/O, V' },
                { id: 'fp-ar2b', number: 'b.', text: 'Scan the schedule for related-party receivables and gather information for appropriate financial statement disclosure.', assertions: 'E/O, C, R/O, V' },
              ],
            },
            {
              id: 'fp-ar3',
              number: '3.',
              text: 'Send positive confirmation requests to a representative sample of customers.',
              assertions: 'E/O, C, R/O',
              children: [
                { id: 'fp-ar3a', number: 'a.', text: 'Apply alternative procedures (vouch to subsequent cash receipts or shipping documents) for non-responses.', assertions: 'E/O, C, R/O' },
                { id: 'fp-ar3b', number: 'b.', text: 'Investigate and resolve all exceptions reported by customers.', assertions: 'E/O, C, R/O, V' },
              ],
            },
            {
              id: 'fp-ar4',
              number: '4.',
              text: 'Evaluate the adequacy of the allowance for doubtful accounts by reviewing management\'s estimate methodology and testing underlying assumptions.',
              assertions: 'V, A/CL/P',
            },
            {
              id: 'fp-ar5',
              number: '5.',
              text: 'Perform a rollforward of the allowance for doubtful accounts from prior year-end to current year-end, validating individual write-offs and the current year provision.',
              assertions: 'V, A/CL/P',
              recommendationId: 'ar-add-1',
            },
          ],
        },
        {
          id: 'ar-cutoff',
          title: 'Cutoff',
          procedures: [
            {
              id: 'fp-ar6',
              number: '1.',
              text: 'Perform the following revenue and receivables cutoff procedures at or near 12/31/2026:',
              assertions: 'CO, E/O',
              children: [
                { id: 'fp-ar6a', number: 'a.', text: 'Review a sample of sales transactions recorded near year-end and agree to shipping documents to confirm recording in the correct period.', assertions: 'CO, E/O' },
                {
                  id: 'fp-ar6b',
                  number: 'b.',
                  text: 'Test a sample of credit memos issued after year-end to evaluate whether any relate to pre-year-end transactions.',
                  assertions: 'CO, E/O',
                  recommendationId: 'ar-add-2',
                },
              ],
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

  // ── AP-45 Revenue ──────────────────────────────────────────────────────────────
  {
    id: 'revenue',
    code: 'AP-45',
    title: 'Revenue',
    recommendations: [
      {
        id: 'rv-add-1',
        type: 'add',
        text: 'Obtain the new licensing agreement and evaluate the identification of performance obligations and the timing of revenue recognition under ASC 606 Step 2 and Step 5.',
        assertions: 'V, A/CL/P',
        rationale: 'Board minutes reference a new licensing revenue stream entered into during the year. This was not present in the prior year engagement and represents a new risk area under ASC 606.',
      },
      {
        id: 'rv-add-2',
        type: 'add',
        text: 'Test manual journal entries posted to revenue accounts, focusing on entries near 12/31/2026, entries posted by senior management, and entries with unusual account coding.',
        assertions: 'E/O, C, A/CL/P',
        rationale: 'Risk planning identified fictitious or premature revenue recognition as a fraud risk (AU-C 240). Journal entry testing is a required response to this assessed risk.',
      },
      {
        id: 'rv-excl-1',
        type: 'exclude',
        text: 'Test percentage-of-completion calculations for long-term construction contracts.',
        assertions: 'V, A/CL/P',
        rationale: 'Client has no long-term construction contracts. ASC 606 analysis confirms point-in-time recognition is applicable for all current revenue streams.',
      },
    ],
    fullProgram: {
      description: 'PIN-AP-45 — Audit procedures for revenue recognition under ASC 606/IFRS 15, including the five-step model, cutoff, and fraud-related journal entry testing. Procedures highlighted below are flagged based on the risk assessment for this engagement.',
      sections: [
        {
          id: 'rev-basic',
          title: 'Revenue (Basic)',
          procedures: [
            { id: 'fp-rv1', number: '1.', text: 'Update your understanding of the entity\'s revenue recognition policies and their application of ASC 606 / IFRS 15, including the five-step model.', assertions: 'E/O, C, A/CL/P' },
            {
              id: 'fp-rv2',
              number: '2.',
              text: 'Perform and document (including expectations) the following analytical procedures:',
              assertions: 'E/O, C, V, A/CL/P, CO',
              children: [
                { id: 'fp-rv2a', number: 'a.', text: 'Compare current year revenue by product or service line to prior year and budget. Investigate variances exceeding materiality thresholds.', assertions: 'E/O, C, V, A/CL/P' },
                { id: 'fp-rv2b', number: 'b.', text: 'Compute gross margin by product line and compare to prior periods. Investigate unexpected fluctuations.', assertions: 'E/O, C, V, A/CL/P' },
              ],
            },
            {
              id: 'fp-rv3',
              number: '3.',
              text: 'Select a sample of revenue transactions and trace from contract through recognition, verifying each step of the ASC 606 model:',
              assertions: 'E/O, C, R/O, V, CO',
              children: [
                { id: 'fp-rv3a', number: 'a.', text: 'Step 1 — Confirm a valid contract exists with commercial substance and enforceable rights and obligations.', assertions: 'E/O, R/O' },
                { id: 'fp-rv3b', number: 'b.', text: 'Step 2 — Identify performance obligations. Evaluate whether distinct goods or services are bundled or separated.', assertions: 'E/O, V, A/CL/P' },
                { id: 'fp-rv3c', number: 'c.', text: 'Step 3 — Determine the transaction price, including variable consideration, significant financing components, and non-cash consideration.', assertions: 'V, A/CL/P' },
                { id: 'fp-rv3d', number: 'd.', text: 'Step 4 — Allocate the transaction price to performance obligations using standalone selling prices.', assertions: 'V, A/CL/P' },
                { id: 'fp-rv3e', number: 'e.', text: 'Step 5 — Confirm revenue is recognized when (or as) each performance obligation is satisfied.', assertions: 'E/O, CO' },
              ],
            },
            {
              id: 'fp-rv4',
              number: '4.',
              text: 'Obtain the new licensing agreement entered into during the year and evaluate performance obligations and timing of revenue recognition.',
              assertions: 'V, A/CL/P',
              recommendationId: 'rv-add-1',
            },
            {
              id: 'fp-rv5',
              number: '5.',
              text: 'Test percentage-of-completion calculations for long-term construction contracts.',
              assertions: 'V, A/CL/P',
              recommendationId: 'rv-excl-1',
            },
          ],
        },
        {
          id: 'rev-cutoff',
          title: 'Cutoff and Fraud',
          procedures: [
            {
              id: 'fp-rv6',
              number: '1.',
              text: 'Perform revenue cutoff testing around 12/31/2026:',
              assertions: 'CO, E/O',
              children: [
                { id: 'fp-rv6a', number: 'a.', text: 'Review revenue transactions recorded in the last 10 business days of the period and the first 10 business days after period-end.', assertions: 'CO, E/O' },
                { id: 'fp-rv6b', number: 'b.', text: 'Agree a sample of transactions to shipping documents, invoices, and contracts to confirm recording in the correct period.', assertions: 'CO, E/O' },
              ],
            },
            {
              id: 'fp-rv7',
              number: '2.',
              text: 'Test manual journal entries posted to revenue accounts in response to fraud risk (AU-C 240.32):',
              assertions: 'E/O, C, A/CL/P',
              recommendationId: 'rv-add-2',
              children: [
                { id: 'fp-rv7a', number: 'a.', text: 'Obtain a population of all manual journal entries with a debit or credit to revenue accounts.', assertions: 'E/O, C' },
                { id: 'fp-rv7b', number: 'b.', text: 'Focus selection on entries near year-end, entries posted outside normal business hours, entries with unusual account combinations, and entries posted by senior management or IT personnel.', assertions: 'E/O, C, A/CL/P' },
                { id: 'fp-rv7c', number: 'c.', text: 'Obtain supporting documentation for selected entries and evaluate business purpose.', assertions: 'E/O, C, A/CL/P' },
              ],
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

  // ── AP-50 Inventory and Cost of Sales ─────────────────────────────────────────
  {
    id: 'inventory',
    code: 'AP-50',
    title: 'Inventory and Cost of Sales',
    recommendations: [
      {
        id: 'inv-add-1',
        type: 'add',
        text: 'Compare information obtained during the physical inventory observation to the final inventory listing and investigate any significant or unusual differences.',
        assertions: 'V, A/CL/P',
        rationale: 'Inventory observation was waived in the prior year. Current year risk assessment elevates inventory existence risk — this comparison procedure is now required under AU-C 501.',
      },
      {
        id: 'inv-add-2',
        type: 'add',
        text: 'Perform a lower of cost or net realizable value (NRV) analysis on the top 20 inventory SKUs by carrying value and evaluate management\'s write-down methodology.',
        assertions: 'V, A/CL/P',
        rationale: 'Gross margin declined year-over-year. Risk planning flagged NRV impairment as a new risk area. Management\'s current write-down process has not been tested previously.',
      },
    ],
    fullProgram: {
      description: 'PIN-AP-50 — Audit procedures for inventory existence, valuation, cost of sales, and physical inventory observation per AU-C 501. Procedures highlighted below are flagged based on the risk assessment for this engagement.',
      sections: [
        {
          id: 'inv-basic',
          title: 'Inventory',
          procedures: [
            {
              id: 'fp-inv1',
              number: '1.',
              text: 'Update your understanding of the valuation procedures used by the client. Identify changes in products, accounting policies, and methods used to accumulate inventory cost.',
              assertions: 'E/O, C, R/O, V, A/CL/P',
            },
            {
              id: 'fp-inv2',
              number: '2.',
              text: 'Perform and document (including expectations) the following analytical procedures:',
              assertions: 'E/O, C, V, A/CL/P, CO',
              children: [
                { id: 'fp-inv2a', number: 'a.', text: 'Compare balances of inventory with those of prior periods or other expectations.', assertions: 'E/O, C, V, A/CL/P, CO' },
                { id: 'fp-inv2b', number: 'b.', text: 'Compute the ratio of inventory classifications to total inventory and compare with prior periods.', assertions: 'E/O, C, V, A/CL/P, CO' },
                { id: 'fp-inv2c', number: 'c.', text: 'Compute inventory turnover and compare with the turnover of prior periods or other expectations.', assertions: 'E/O, C, V, A/CL/P, CO' },
              ],
            },
            {
              id: 'fp-inv3',
              number: '3.',
              text: 'Perform the following valuation procedures:',
              assertions: 'V, A/CL/P',
              children: [
                { id: 'fp-inv3a', number: 'a.', text: 'Obtain or update your understanding of management\'s process for determining write-downs for scrap, obsolete, unsalable, slow-moving, or overstocked items.', assertions: 'V, A/CL/P' },
                {
                  id: 'fp-inv3b',
                  number: 'b.',
                  text: 'Compare relevant information obtained during the physical inventory observation to the final inventory listing and investigate unusual differences.',
                  assertions: 'V, A/CL/P',
                  recommendationId: 'inv-add-1',
                },
                { id: 'fp-inv3c', number: 'c.', text: 'Determine the client\'s method for identifying potential inventory problems. Inquire of production and sales personnel concerning possible excess, defective, or obsolete items.', assertions: 'V, A/CL/P' },
              ],
            },
            { id: 'fp-inv4', number: '4.', text: 'Observe the entity\'s physical inventory. Use the separate inventory observation program at PIN-AP-60.', assertions: 'E/O, C, R/O, CO' },
          ],
        },
        {
          id: 'inv-nrv',
          title: 'Test of Lower of Cost or Net Realizable Value',
          procedures: [
            {
              id: 'fp-inv5',
              number: '1.',
              text: 'Perform lower of cost or net realizable value analysis on the top 20 inventory SKUs by carrying value and evaluate management\'s write-down methodology.',
              assertions: 'V, A/CL/P',
              recommendationId: 'inv-add-2',
            },
            {
              id: 'fp-inv6',
              number: '2.',
              text: 'Review and test the determination of market prices to determine whether net realizable value is lower than cost:',
              assertions: 'V, A/CL/P',
              children: [
                { id: 'fp-inv6a', number: 'a.', text: 'Test the net realizable value of finished goods by comparing costs to current sales prices (after deducting reasonable completion and sales costs).', assertions: 'V, A/CL/P' },
                { id: 'fp-inv6b', number: 'b.', text: 'Review management\'s current period assessment of any items written down in prior periods for evidence of possible reversals.', assertions: 'V, A/CL/P' },
              ],
            },
          ],
        },
        {
          id: 'inv-cos',
          title: 'Cost of Sales',
          procedures: [
            { id: 'fp-inv7', number: '1.', text: 'Perform and document analytical procedures on cost of sales, comparing balances and gross profit margin to prior periods or other expectations.', assertions: 'E/O, C, A/CL/P, CO' },
            { id: 'fp-inv8', number: '2.', text: 'Investigate any unexpected results (ratios or variations different from what would be expected), considering known changes in client or industry operations.', assertions: 'E/O, C, A/CL/P, CO' },
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

  // ── AP-100 Trade and Other Payables ───────────────────────────────────────────
  {
    id: 'payables',
    code: 'AP-100',
    title: 'Trade and Other Payables',
    recommendations: [
      {
        id: 'ap-add-1',
        type: 'add',
        text: 'Trace receiving cutoff information obtained during inventory observation to the accounting records, noting whether the liability for the merchandise is recorded in the proper accounting period.',
        assertions: 'E/O, C, R/O, A/CL/P, CO',
        rationale: 'Inventory cutoff was identified as a risk area. Payables cutoff must be coordinated with inventory observation procedures to ensure completeness at 12/31/2026.',
      },
      {
        id: 'ap-add-2',
        type: 'add',
        text: 'Obtain and examine supporting documents for selected disbursements after 12/31/2026 to determine whether goods or services were received on or before the reporting date and whether the liability is recorded.',
        assertions: 'C, A/CL/P, CO',
        rationale: 'Search for unrecorded liabilities is elevated given the treasury restructuring and new vendor arrangements identified in board minutes.',
      },
    ],
    fullProgram: {
      description: 'PIN-AP-100 — Audit procedures for trade payables, accrued liabilities, and the search for unrecorded liabilities at 12/31/2026. Procedures highlighted below are flagged based on the risk assessment for this engagement.',
      sections: [
        {
          id: 'ap-basic',
          title: 'Trade Payables (Basic)',
          procedures: [
            { id: 'fp-ap1', number: '1.', text: 'Compare and document (including expectations) the balances in trade payables and purchases with those of prior periods. Relate the level of activity to inventory levels and sales volume. Investigate any unusual fluctuations.', assertions: 'E/O, C, R/O, V, A/CL/P, CO' },
            {
              id: 'fp-ap2',
              number: '2.',
              text: 'Perform the following trade payable procedures:',
              assertions: 'E/O, C, R/O, A/CL/P',
              children: [
                { id: 'fp-ap2a', number: 'a.', text: 'Obtain a listing of trade payables as at the reporting date. Agree or reconcile the balance to the general ledger.', assertions: 'E/O, C, R/O, A/CL/P' },
                { id: 'fp-ap2b', number: 'b.', text: 'Scan the listing and investigate any unusual or old items.', assertions: 'E/O, C, R/O, A/CL/P' },
                { id: 'fp-ap2c', number: 'c.', text: 'Scan the listing for related-party trade payables. Gather information for appropriate financial statement disclosure.', assertions: 'E/O, C, R/O, A/CL/P' },
              ],
            },
            {
              id: 'fp-ap3',
              number: '3.',
              text: 'With respect to unrecorded liabilities, perform the following:',
              assertions: 'C, A/CL/P, CO',
              children: [
                { id: 'fp-ap3a', number: 'a.', text: 'Inquire of responsible client personnel about procedures for processing invoices and their knowledge of additional unprocessed invoices, commitments, or contingent liabilities.', assertions: 'C, A/CL/P, CO' },
                {
                  id: 'fp-ap3b',
                  number: 'b.',
                  text: 'Trace receiving cutoff information obtained during inventory observation to the accounting records, noting whether the liability is recorded in the proper accounting period.',
                  assertions: 'E/O, C, R/O, A/CL/P, CO',
                  recommendationId: 'ap-add-1',
                },
              ],
            },
            {
              id: 'fp-ap4',
              number: '4.',
              text: 'Perform a search for unrecorded liabilities:',
              assertions: 'E/O, C, R/O, A/CL/P, CO',
              children: [
                {
                  id: 'fp-ap4a',
                  number: 'a.',
                  text: 'Obtain and examine supporting selected disbursements after the reporting date and determine whether the goods or services on the paid invoices were received on or before the reporting date.',
                  assertions: 'C, A/CL/P, CO',
                  recommendationId: 'ap-add-2',
                },
                { id: 'fp-ap4b', number: 'b.', text: 'Inspect files of unprocessed invoices, vendor statements, and unmatched receiving documents. If goods or services were received on or before the reporting date, determine whether the liability is included in the trade payable listing.', assertions: 'E/O, C, R/O, A/CL/P, CO' },
                { id: 'fp-ap4c', number: 'c.', text: 'Relate the findings in the search for unrecorded liabilities to the accrued balances.', assertions: 'E/O, C, R/O, A/CL/P, CO' },
              ],
            },
          ],
        },
        {
          id: 'ap-accruals',
          title: 'Accruals and Other Liabilities',
          procedures: [
            { id: 'fp-ap5', number: '1.', text: 'Update your understanding of the basis for accrued liability accounts, considering the possibility of both material understatement and overstatement.', assertions: '' },
            { id: 'fp-ap6', number: '2.', text: 'Compare and document (including expectations) the balances in accrued liabilities with those of prior periods. Investigate any unusual fluctuations.', assertions: 'E/O, C, R/O, V, A/CL/P, CO' },
            {
              id: 'fp-ap7',
              number: '3.',
              text: 'Test accruals and other liabilities:',
              assertions: 'E/O, C, R/O, V, A/CL/P, CO',
              children: [
                { id: 'fp-ap7a', number: 'a.', text: 'Scan the working trial balance and determine those accrual accounts for which additional testing should be performed.', assertions: 'E/O, C, R/O, V, A/CL/P, CO' },
                { id: 'fp-ap7b', number: 'b.', text: 'Determine the basis and method of accrual.', assertions: 'E/O, C, R/O, V, A/CL/P, CO' },
                { id: 'fp-ap7c', number: 'c.', text: 'Test the reasonableness of the accrual by performing and documenting a predictive test and comparing it to the recorded amount.', assertions: 'E/O, C, R/O, V, A/CL/P, CO' },
              ],
            },
            { id: 'fp-ap8', number: '4.', text: 'Scan the expense accounts and compare balances to prior-period balances. Investigate unusual fluctuations or the absence of accrued expense items that existed in the prior period.', assertions: 'C, A/CL/P' },
          ],
        },
        {
          id: 'ap-concluding',
          title: 'Concluding Audit Steps',
          procedures: [
            { id: 'fp-ap9', number: '1.', text: 'Ensure that the workpapers include the information needed to support required financial statement disclosures and such information has been subjected to appropriate audit procedures.', assertions: '' },
            { id: 'fp-ap10', number: '2.', text: 'Consider the need to apply one or more additional procedures and whether the results of audit procedures indicate internal control related matters that are required to be communicated to management and others.', assertions: '' },
          ],
        },
      ],
    },
  },

  // ── AP-101 Payroll Liabilities and Related Expenses ───────────────────────────
  {
    id: 'payroll',
    code: 'AP-101',
    title: 'Payroll',
    recommendations: [
      {
        id: 'pay-add-1',
        type: 'add',
        text: 'Test the accuracy of the year-end bonus accrual by agreeing amounts to board-approved bonus plans and recalculating individual awards for a sample of employees.',
        assertions: 'C, V, CO',
        rationale: 'A discretionary bonus program was introduced in the current year. Risk assessment identifies this as a new completeness and valuation risk in payroll liabilities not addressed in the prior year program.',
      },
      {
        id: 'pay-add-2',
        type: 'add',
        text: 'Evaluate the payroll reclassification resulting from the treasury restructuring and confirm that compensation costs are classified in the correct expense accounts.',
        assertions: 'A/CL/P',
        rationale: 'Board minutes identify a restructuring of the treasury function that may have resulted in payroll costs being recorded in incorrect expense categories compared to prior year.',
      },
    ],
    fullProgram: {
      description: 'PIN-AP-101 — Audit procedures for payroll liabilities, accrued compensation, and payroll-related expenses. Procedures highlighted below are flagged based on the risk assessment for this engagement.',
      sections: [
        {
          id: 'pay-liabilities',
          title: 'Accrued Payroll-Related Liabilities',
          procedures: [
            { id: 'fp-pay1', number: '1.', text: 'Compare and document (including expectations) the balances in accrued payroll-related liabilities with those of prior periods or other expectations. Investigate any unusual fluctuations.', assertions: 'E/O, C, R/O, V, A/CL/P, CO' },
            {
              id: 'fp-pay2',
              number: '2.',
              text: 'Test payroll-related accruals by performing the following procedures:',
              assertions: 'E/O, C, R/O, V, A/CL/P, CO',
              children: [
                { id: 'fp-pay2a', number: 'a.', text: 'Scan the working trial balance and determine those payroll-related accrual accounts for which additional testing should be performed.', assertions: 'E/O, C, R/O, V, A/CL/P, CO' },
                { id: 'fp-pay2b', number: 'b.', text: 'Determine the basis and method of accrual.', assertions: 'E/O, C, R/O, V, A/CL/P, CO' },
                { id: 'fp-pay2c', number: 'c.', text: 'Test the reasonableness of the accrual by performing and documenting a predictive test and comparing it to the recorded amount.', assertions: 'E/O, C, R/O, V, A/CL/P, CO' },
                {
                  id: 'fp-pay2d',
                  number: 'd.',
                  text: 'Test the accuracy of the year-end bonus accrual by agreeing amounts to board-approved bonus plans and recalculating individual awards for a sample of employees.',
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
            { id: 'fp-pay3', number: '1.', text: 'Reconcile total payroll per the payroll register to the general ledger. Investigate variances.', assertions: 'C, R/O, V' },
            { id: 'fp-pay4', number: '2.', text: 'Test a sample of employees for proper authorization, correct rate of pay, and agreement to employment records.', assertions: 'E/O, C, V' },
            { id: 'fp-pay5', number: '3.', text: 'Evaluate the year-end payroll accrual by recalculating accrued wages, salaries, vacation, and bonuses.', assertions: 'C, V, CO' },
            { id: 'fp-pay6', number: '4.', text: 'Agree executive compensation to board-approved compensation arrangements and verify disclosure requirements.', assertions: 'E/O, V, A/CL/P' },
            {
              id: 'fp-pay7',
              number: '5.',
              text: 'Evaluate the payroll reclassification resulting from the treasury restructuring and confirm compensation costs are in the correct expense accounts.',
              assertions: 'A/CL/P',
              recommendationId: 'pay-add-2',
            },
          ],
        },
        {
          id: 'pay-concluding',
          title: 'Concluding Audit Steps',
          procedures: [
            { id: 'fp-pay8', number: '1.', text: 'Ensure that the workpapers include the information needed to support required financial statement disclosures.', assertions: '' },
            { id: 'fp-pay9', number: '2.', text: 'Consider the need to apply additional procedures and whether the results indicate internal control related matters to communicate.', assertions: '' },
          ],
        },
      ],
    },
  },
]

// ─── Helper ────────────────────────────────────────────────────────────────────

function countOpen(area: AreaRecommendations, accepted: Set<string>, dismissed: Set<string>) {
  return area.recommendations.filter((r) => !accepted.has(r.id) && !dismissed.has(r.id)).length
}

// ─── RecommendationRow ─────────────────────────────────────────────────────────

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
    <div className={`px-4 py-3 text-sm transition-colors ${dismissed ? 'opacity-40' : 'hover:bg-gray-50/60'}`}>
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
          <p className="text-[10px] font-mono text-gray-400">{rec.assertions}</p>

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
              className="mt-1 rounded-sm border-l-2 pl-3 text-[11px] leading-relaxed text-gray-600 italic"
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

// ─── FullProcedureItem ─────────────────────────────────────────────────────────

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
  const isAdd = rec?.type === 'add'
  const isExclude = rec?.type === 'exclude'

  const highlight =
    rec
      ? isAdd
        ? 'bg-green-50 border-l-2 border-green-500'
        : 'bg-red-50 border-l-2 border-red-400'
      : ''

  return (
    <>
      <div
        className={`flex items-start gap-2 py-2 pr-3 rounded-sm ${highlight}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        <span className="shrink-0 text-gray-400 text-xs font-mono mt-0.5 min-w-[20px]">{proc.number}</span>
        <div className="flex-1 min-w-0">
          <span className="leading-relaxed text-xs text-gray-700">{proc.text}</span>
          {proc.assertions && (
            <p className="text-[10px] font-mono text-gray-400 mt-0.5">{proc.assertions}</p>
          )}
          {rec && (
            <div className="mt-1.5 flex items-center gap-1.5">
              {isAdd ? (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-100 rounded-full px-2 py-0.5">
                  <PlusCircle size={9} aria-hidden="true" />
                  Recommended to add
                  {isAccepted && <CheckCircle2 size={9} className="ml-0.5 text-green-600" aria-hidden="true" />}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-red-600 bg-red-100 rounded-full px-2 py-0.5">
                  <MinusCircle size={9} aria-hidden="true" />
                  Recommended to exclude
                  {isAccepted && <CheckCircle2 size={9} className="ml-0.5 text-red-500" aria-hidden="true" />}
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

// ─── FullProgramDrawer ─────────────────────────────────────────────────────────

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Trap focus inside drawer
  useEffect(() => {
    drawerRef.current?.focus()
  }, [])

  const highlighted = area.recommendations.length

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" aria-hidden="true" onClick={onClose} />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Full program: ${area.code} — ${area.title}`}
        tabIndex={-1}
        className="fixed right-0 top-0 z-50 flex h-full w-[540px] max-w-[95vw] flex-col bg-white shadow-2xl outline-none"
        style={{ borderLeft: '1px solid var(--saf-color-neutral-200, #e5e7eb)' }}
      >
        {/* Header */}
        <div
          className="flex shrink-0 items-start justify-between gap-3 border-b px-5 py-4"
          style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded"
                style={{ color: 'var(--saf-color-brand-orange, #D64000)', backgroundColor: 'rgba(214,64,0,0.07)' }}
              >
                {area.code}
              </span>
              <h2 className="text-sm font-bold text-gray-900 truncate">{area.title}</h2>
            </div>
            <p className="mt-1 text-[11px] text-gray-500 leading-relaxed">
              Full audit program &mdash; {highlighted} procedure{highlighted !== 1 ? 's' : ''} highlighted from risk assessment
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close full program"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        {/* Legend */}
        <div
          className="flex shrink-0 items-center gap-5 border-b px-5 py-2"
          style={{ borderColor: 'var(--saf-color-neutral-100, #f3f4f6)', backgroundColor: '#fafafa' }}
        >
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="inline-block h-3 w-1 rounded-sm bg-green-500" aria-hidden="true" />
            Recommended to add
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="inline-block h-3 w-1 rounded-sm bg-red-400" aria-hidden="true" />
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
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {area.fullProgram.sections.map((section) => (
            <div key={section.id}>
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {section.title}
              </h3>
              <div
                className="rounded-lg border overflow-hidden divide-y"
                style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
              >
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
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex shrink-0 items-center border-t px-5 py-3"
          style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
        >
          <span className="text-[11px] text-gray-400">Guided Assurance &middot; {area.code}</span>
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

// ─── AreaCard ──────────────────────────────────────────────────────────────────

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
  const openCount = countOpen(area, accepted, dismissed)
  const allDone = openCount === 0
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <div
        className="overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-sm"
        style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
      >
        {/* Card header — click to collapse/expand */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50/60"
          aria-expanded={!collapsed}
        >
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span
              className="shrink-0 text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded"
              style={{ color: 'var(--saf-color-brand-orange, #D64000)', backgroundColor: 'rgba(214,64,0,0.07)' }}
            >
              {area.code}
            </span>
            <span className="text-sm font-semibold text-gray-900 truncate">{area.title}</span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {allDone ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-green-700">
                <CheckCircle2 size={13} aria-hidden="true" />
                All reviewed
              </span>
            ) : (
              <span
                className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
                style={{ backgroundColor: 'var(--saf-color-brand-orange, #D64000)' }}
                aria-label={`${openCount} open`}
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

        {/* Expanded body */}
        {!collapsed && (
          <>
            <div
              className="border-t divide-y"
              style={{ borderColor: 'var(--saf-color-neutral-100, #f3f4f6)' }}
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

            {/* Footer bar */}
            <div
              className="flex items-center justify-between border-t px-4 py-2"
              style={{ borderColor: 'var(--saf-color-neutral-100, #f3f4f6)', backgroundColor: '#fafafa' }}
            >
              <span className="text-[11px] text-gray-400">
                {area.recommendations.length} flagged procedure{area.recommendations.length !== 1 ? 's' : ''}
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

      {/* Full program drawer */}
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

// ─── AuditProcedureRecommendations (main export) ───────────────────────────────

export function AuditProcedureRecommendations({
  onAllReviewed,
}: {
  onAllReviewed?: () => void
}) {
  const [accepted, setAccepted] = useState<Set<string>>(new Set())
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const totalOpen = RECOMMENDATIONS.reduce(
    (sum, area) => sum + countOpen(area, accepted, dismissed),
    0
  )
  const allDone = totalOpen === 0

  useEffect(() => {
    if (allDone) onAllReviewed?.()
  }, [allDone, onAllReviewed])

  const handleAccept = (id: string) => {
    setAccepted((prev) => new Set(prev).add(id))
    setDismissed((prev) => { const next = new Set(prev); next.delete(id); return next })
  }

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id))
    setAccepted((prev) => { const next = new Set(prev); next.delete(id); return next })
  }

  return (
    <div className="space-y-3 w-full">
      {/* Summary bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {allDone
            ? 'All recommendations reviewed — audit program is ready to finalize.'
            : `${totalOpen} recommendation${totalOpen !== 1 ? 's' : ''} pending review across ${RECOMMENDATIONS.length} audit areas`}
        </p>
        {allDone && (
          <span className="flex items-center gap-1 text-xs font-medium text-green-700">
            <CheckCircle2 size={13} aria-hidden="true" />
            Complete
          </span>
        )}
      </div>

      {/* One collapsible card per audit area */}
      {RECOMMENDATIONS.map((area) => (
        <AreaCard
          key={area.id}
          area={area}
          accepted={accepted}
          dismissed={dismissed}
          onAccept={handleAccept}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  )
}
