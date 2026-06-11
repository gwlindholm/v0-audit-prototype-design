'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, MoreHorizontal, Save, Link2, SlidersHorizontal, Plus, X } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

type InProgram = boolean

interface Procedure {
  id: string
  text: string
  assertions: string
  inProgram: InProgram
  children?: Procedure[]
}

interface ProcedureGroup {
  id: string
  title: string
  procedures: Procedure[]
}

interface AuditArea {
  id: string
  code: string
  title: string
  description: string
  groups: ProcedureGroup[]
}

const AUDIT_AREAS: AuditArea[] = [
  {
    id: 'cash',
    code: 'AP-10',
    title: 'Cash',
    description: 'Review the AI-suggested procedures and update as needed. You can include procedures or categories, edit procedures, link risks to procedures, exclude steps, and arrange steps in your preferred order.',
    groups: [
      {
        id: 'cash-basic',
        title: 'Cash (Basic)',
        procedures: [
          {
            id: 'c1',
            text: 'Obtain a listing of all cash and cash equivalent accounts and agree to the general ledger.',
            assertions: 'EO, C, RO',
            inProgram: true,
          },
          {
            id: 'c2',
            text: 'Send bank confirmation requests to all financial institutions holding cash balances.',
            assertions: 'EO, C, RO, V',
            inProgram: true,
            children: [
              {
                id: 'c2a',
                text: 'Follow up on any outstanding confirmations within 10 business days.',
                assertions: 'C',
                inProgram: true,
              },
              {
                id: 'c2b',
                text: 'Investigate and resolve any discrepancies noted between confirmations and recorded balances.',
                assertions: 'V, ACLP',
                inProgram: true,
              },
            ],
          },
          {
            id: 'c3',
            text: 'Perform bank reconciliation procedures for all accounts with balances greater than $50,000.',
            assertions: 'C, RO, V',
            inProgram: true,
          },
          {
            id: 'c4',
            text: 'Test cash cutoff by reviewing disbursements and receipts for the five business days before and after year-end.',
            assertions: 'CO',
            inProgram: false,
          },
        ],
      },
      {
        id: 'cash-restricted',
        title: 'Restricted Cash',
        procedures: [
          {
            id: 'c5',
            text: 'Obtain documentation supporting any amounts classified as restricted cash and evaluate appropriateness of classification.',
            assertions: 'C, PD',
            inProgram: true,
          },
        ],
      },
    ],
  },
  {
    id: 'ar',
    code: 'AP-20',
    title: 'Accounts Receivable',
    description: 'Review the AI-suggested procedures and update as needed.',
    groups: [
      {
        id: 'ar-basic',
        title: 'Accounts Receivable (Basic)',
        procedures: [
          {
            id: 'ar1',
            text: 'Obtain the accounts receivable aging schedule and agree total to the general ledger.',
            assertions: 'EO, C, RO',
            inProgram: true,
          },
          {
            id: 'ar2',
            text: 'Send positive confirmation requests using statistical sampling methodology to a representative sample of customers.',
            assertions: 'EO, C, RO, V',
            inProgram: true,
            children: [
              {
                id: 'ar2a',
                text: 'Apply alternative procedures (vouch to subsequent cash receipts) for non-responses.',
                assertions: 'EO, C',
                inProgram: true,
              },
            ],
          },
          {
            id: 'ar3',
            text: 'Perform analytical procedures comparing AR turnover and days sales outstanding to prior year and budget.',
            assertions: 'C, V, ACLP',
            inProgram: true,
          },
          {
            id: 'ar4',
            text: 'Evaluate the adequacy of the allowance for doubtful accounts by reviewing management\'s estimate and testing underlying assumptions.',
            assertions: 'V, ACLP',
            inProgram: true,
          },
        ],
      },
    ],
  },
  {
    id: 'revenue',
    code: 'AP-30',
    title: 'Revenue',
    description: 'Review the AI-suggested procedures and update as needed.',
    groups: [
      {
        id: 'rev-basic',
        title: 'Revenue Recognition (ASC 606)',
        procedures: [
          {
            id: 'rv1',
            text: 'Evaluate the client\'s revenue recognition policy for compliance with ASC 606, focusing on the five-step model.',
            assertions: 'EO, C, PD',
            inProgram: true,
          },
          {
            id: 'rv2',
            text: 'Select a sample of revenue transactions and trace from contract through recognition, verifying each step of the ASC 606 model is satisfied.',
            assertions: 'EO, C, RO, V, CO',
            inProgram: true,
            children: [
              {
                id: 'rv2a',
                text: 'Focus selection on Q4 entries, manual journal entries, and entries near period-end.',
                assertions: 'CO',
                inProgram: true,
              },
            ],
          },
          {
            id: 'rv3',
            text: 'Perform a regression analysis comparing current year revenue by product line to prior year, investigating variances exceeding 10% or $500K.',
            assertions: 'C, V, ACLP',
            inProgram: true,
          },
          {
            id: 'rv4',
            text: 'Test journal entries for manual revenue postings, focusing on unusual entries, entries posted by IT or senior management, and entries near period-end.',
            assertions: 'EO, C, ACLP',
            inProgram: true,
          },
          {
            id: 'rv5',
            text: 'Review contract modifications and variable consideration arrangements for appropriate accounting treatment.',
            assertions: 'V, PD',
            inProgram: false,
          },
        ],
      },
    ],
  },
  {
    id: 'inventory',
    code: 'AP-50',
    title: 'Inventory and Cost of Sales',
    description: 'Review the AI-suggested procedures and update as needed. You can include procedures or categories, edit procedures, link risks to procedures, exclude steps, and arrange steps in your preferred order.',
    groups: [
      {
        id: 'inv-basic',
        title: 'Inventory (Basic)',
        procedures: [
          {
            id: 'inv1',
            text: 'Perform the following valuation procedures:',
            assertions: 'EO, C, RO, V, ACLP',
            inProgram: true,
            children: [
              {
                id: 'inv1a',
                text: 'If considered necessary, update your understanding obtained during planning of the valuation procedures used by the client. Identify any changes in specific products, production methods, accounting policies, methods used to accumulate cost of inventory items, or pricing policies and procedures of the entity; consider results of physical observation during the period; and determine their effects on inventory valuation.',
                assertions: 'EO, C, RO, V, ACLP',
                inProgram: true,
              },
              {
                id: 'inv1b',
                text: 'Determine whether allowances have been made for scrap, obsolete, unsalable, slow-moving, or overstocked items.',
                assertions: 'V, ACLP',
                inProgram: true,
              },
              {
                id: 'inv1c',
                text: "Determine the client's method for identifying potential problems. Inquire of production and sales personnel concerning possible excess, defective, obsolete, and other inventory items that might have valuation risks.",
                assertions: 'V, ACLP',
                inProgram: true,
              },
              {
                id: 'inv1d',
                text: 'Compare information obtained in the observation of the physical inventory count to the final inventory listing and investigate and explain any unusual differences.',
                assertions: 'V, ACLP',
                inProgram: false,
              },
            ],
          },
          {
            id: 'inv2',
            text: 'Perform and document (including expectations) the following analytical procedures:',
            assertions: 'EO, C, V, ACLP, CO',
            inProgram: true,
            children: [
              {
                id: 'inv2a',
                text: 'Compare balances of inventory with those of prior periods or other expectations.',
                assertions: 'EO, C, V, ACLP, CO',
                inProgram: true,
              },
            ],
          },
        ],
      },
      {
        id: 'inv-obs',
        title: 'Physical Inventory Observation',
        procedures: [
          {
            id: 'inv3',
            text: 'Observe the client\'s physical inventory count and perform test counts for a representative sample of inventory items.',
            assertions: 'EO, C, RO',
            inProgram: true,
          },
          {
            id: 'inv4',
            text: 'Evaluate receiving and shipping cutoff procedures to ensure inventory and cost of sales are recorded in the correct period.',
            assertions: 'CO',
            inProgram: true,
          },
        ],
      },
    ],
  },
  {
    id: 'payroll',
    code: 'AP-70',
    title: 'Payroll Liabilities and Related Expenses',
    description: 'Review the AI-suggested procedures and update as needed.',
    groups: [
      {
        id: 'pay-basic',
        title: 'Payroll (Basic)',
        procedures: [
          {
            id: 'pay1',
            text: 'Reconcile total payroll per the payroll register to the general ledger and investigate variances.',
            assertions: 'C, RO, V',
            inProgram: true,
          },
          {
            id: 'pay2',
            text: 'Test a sample of employees for proper authorization, correct rate of pay, and agreement to employment records.',
            assertions: 'EO, C, V',
            inProgram: true,
          },
          {
            id: 'pay3',
            text: 'Evaluate the year-end payroll accrual by recalculating accrued wages, salaries, vacation, and bonuses.',
            assertions: 'C, V, CO',
            inProgram: true,
          },
          {
            id: 'pay4',
            text: 'Agree executive compensation to board-approved compensation arrangements and verify disclosure requirements.',
            assertions: 'EO, V, PD',
            inProgram: true,
          },
        ],
      },
    ],
  },
  {
    id: 'equity',
    code: 'AP-90',
    title: 'Equity',
    description: 'Review the AI-suggested procedures and update as needed.',
    groups: [
      {
        id: 'eq-basic',
        title: 'Equity (Basic)',
        procedures: [
          {
            id: 'eq1',
            text: 'Obtain and review equity rollforward schedules for common stock, additional paid-in capital, retained earnings, and other comprehensive income.',
            assertions: 'EO, C, RO, V',
            inProgram: true,
          },
          {
            id: 'eq2',
            text: 'Agree dividends declared and paid to board of directors minutes and authorization.',
            assertions: 'EO, C',
            inProgram: true,
          },
          {
            id: 'eq3',
            text: 'Confirm shares outstanding and other equity information with the transfer agent.',
            assertions: 'C, RO',
            inProgram: true,
          },
          {
            id: 'eq4',
            text: 'Evaluate disclosures for equity-related transactions for completeness and accuracy per applicable accounting standards.',
            assertions: 'C, PD',
            inProgram: true,
          },
        ],
      },
    ],
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface AuditProgramWorkspaceProps {
  onClose: () => void
}

export function AuditProgramWorkspace({ onClose }: AuditProgramWorkspaceProps) {
  const [activeAreaId, setActiveAreaId] = useState(AUDIT_AREAS[0].id)
  const [editMode, setEditMode] = useState(true)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [inProgram, setInProgram] = useState<Record<string, boolean>>({})

  const activeArea = AUDIT_AREAS.find((a) => a.id === activeAreaId)!

  const toggleCollapse = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const collapseAll = () =>
    setCollapsed(new Set(activeArea.groups.map((g) => g.id)))

  const expandAll = () => setCollapsed(new Set())

  const getProgramValue = (proc: Procedure): boolean =>
    inProgram[proc.id] ?? proc.inProgram

  const setProgram = (id: string, val: boolean) => {
    setInProgram((prev) => ({ ...prev, [id]: val }))
    setHasUnsaved(true)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* Toolbar */}
      <div
        className="flex shrink-0 items-center gap-3 border-b px-4 py-2.5"
        style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
      >
        {/* Left actions */}
        <button
          onClick={() => setHasUnsaved(false)}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-white transition-colors"
          style={{ backgroundColor: '#15803d' }}
        >
          <Save size={12} aria-hidden="true" />
          Save
        </button>

        <button
          className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
          style={{ borderColor: 'var(--saf-color-neutral-300, #d1d5db)' }}
        >
          <SlidersHorizontal size={12} aria-hidden="true" />
          Switch to completion view
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
          <span>Edit mode</span>
          <button
            role="switch"
            aria-checked={editMode}
            onClick={() => setEditMode((v) => !v)}
            className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
            style={{ backgroundColor: editMode ? 'var(--saf-color-brand-orange, #D64000)' : 'var(--saf-color-neutral-300, #d1d5db)' }}
          >
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${editMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {hasUnsaved && (
          <span className="text-xs text-gray-500">Unsaved changes</span>
        )}

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            style={{ borderColor: 'var(--saf-color-neutral-300, #d1d5db)' }}
          >
            <Link2 size={12} aria-hidden="true" />
            Linkage view
          </button>
          <button
            onClick={onClose}
            aria-label="Close audit program workspace"
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Area tabs */}
      <div
        className="flex shrink-0 items-end gap-0 overflow-x-auto border-b bg-gray-50 px-4"
        style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
        role="tablist"
        aria-label="Audit areas"
      >
        {AUDIT_AREAS.map((area) => {
          const isActive = area.id === activeAreaId
          return (
            <button
              key={area.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveAreaId(area.id)}
              className={`shrink-0 whitespace-nowrap px-4 py-2 text-xs font-medium transition-colors border-b-2 ${
                isActive
                  ? 'border-gray-800 text-gray-900 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-1.5 text-gray-400">{area.code}</span>
              {area.title}
            </button>
          )
        })}
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Area header */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {activeArea.code}: {activeArea.title}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 leading-relaxed">
              {activeArea.description}
            </p>
            <button className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
              <span aria-hidden="true">💡</span>
              Purpose/Usage tip
            </button>
          </div>

          {/* Sub-toolbar */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                style={{ borderColor: 'var(--saf-color-neutral-300, #d1d5db)' }}
              >
                <Plus size={12} aria-hidden="true" />
                Add
                <ChevronDown size={11} aria-hidden="true" />
              </button>
              <button
                className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                style={{ borderColor: 'var(--saf-color-neutral-300, #d1d5db)' }}
              >
                <SlidersHorizontal size={12} aria-hidden="true" />
                Filter
                <ChevronDown size={11} aria-hidden="true" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={expandAll}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
              >
                Expand
                <ChevronDown size={11} aria-hidden="true" />
              </button>
              <button
                onClick={collapseAll}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
              >
                Collapse
                <ChevronUp size={11} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Procedures table */}
          <div
            className="w-full overflow-hidden rounded-lg border"
            style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-[1fr_140px_120px_80px] border-b px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-50"
              style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
            >
              <span>Available procedures</span>
              <span className="text-center">Assertions</span>
              <span className="text-center">In program</span>
              <span className="text-center">Actions</span>
            </div>

            {activeArea.groups.map((group) => {
              const isCollapsed = collapsed.has(group.id)
              return (
                <div
                  key={group.id}
                  className="border-b last:border-0"
                  style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
                >
                  {/* Group header */}
                  <button
                    onClick={() => toggleCollapse(group.id)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    {isCollapsed
                      ? <ChevronDown size={14} className="shrink-0 text-gray-500" aria-hidden="true" />
                      : <ChevronUp size={14} className="shrink-0 text-gray-500" aria-hidden="true" />
                    }
                    {group.title}
                  </button>

                  {/* Procedures */}
                  {!isCollapsed && group.procedures.map((proc) => (
                    <ProcedureRow
                      key={proc.id}
                      proc={proc}
                      depth={0}
                      getValue={getProgramValue}
                      setValue={setProgram}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Procedure row ─────────────────────────────────────────────────────────────

function ProcedureRow({
  proc,
  depth,
  getValue,
  setValue,
}: {
  proc: Procedure
  depth: number
  getValue: (p: Procedure) => boolean
  setValue: (id: string, val: boolean) => void
}) {
  const [childrenCollapsed, setChildrenCollapsed] = useState(false)
  const checked = getValue(proc)
  const hasChildren = (proc.children?.length ?? 0) > 0

  return (
    <>
      <div
        className={`grid grid-cols-[1fr_140px_120px_80px] items-start border-t px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 ${depth > 0 ? 'bg-gray-50/50' : ''}`}
        style={{
          borderColor: 'var(--saf-color-neutral-100, #f3f4f6)',
          paddingLeft: `${16 + depth * 20}px`,
        }}
      >
        {/* Procedure text */}
        <div className="flex items-start gap-2 pr-4">
          {hasChildren && (
            <button
              onClick={() => setChildrenCollapsed((v) => !v)}
              className="mt-0.5 shrink-0 text-gray-400 hover:text-gray-600"
              aria-label={childrenCollapsed ? 'Expand' : 'Collapse'}
            >
              {childrenCollapsed
                ? <ChevronDown size={13} aria-hidden="true" />
                : <ChevronUp size={13} aria-hidden="true" />
              }
            </button>
          )}
          {!hasChildren && (
            <span className="mt-1 shrink-0 text-gray-300" aria-hidden="true">
              <GripIcon />
            </span>
          )}
          <span className="leading-relaxed">{proc.text}</span>
        </div>

        {/* Assertions */}
        <div className="text-center text-xs text-gray-500 pt-0.5">
          {proc.assertions}
        </div>

        {/* In program checkbox */}
        <div className="flex justify-center pt-0.5">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setValue(proc.id, e.target.checked)}
            aria-label={`Include in program: ${proc.text.slice(0, 40)}`}
            className="h-4 w-4 cursor-pointer rounded border-gray-300 transition-colors focus:ring-2 focus:ring-offset-1"
            style={{
              accentColor: 'var(--saf-color-brand-orange, #D64000)',
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <button
            aria-label="More actions"
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <MoreHorizontal size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && !childrenCollapsed &&
        proc.children!.map((child) => (
          <ProcedureRow
            key={child.id}
            proc={child}
            depth={depth + 1}
            getValue={getValue}
            setValue={setValue}
          />
        ))
      }
    </>
  )
}

function GripIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" aria-hidden="true">
      <circle cx="2" cy="3" r="1.2" />
      <circle cx="8" cy="3" r="1.2" />
      <circle cx="2" cy="7" r="1.2" />
      <circle cx="8" cy="7" r="1.2" />
      <circle cx="2" cy="11" r="1.2" />
      <circle cx="8" cy="11" r="1.2" />
    </svg>
  )
}
