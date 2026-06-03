'use client'

import { useState } from 'react'

const CLIENTS = [
  'Acme Corporation',
  'Bright Horizons LLC',
  'Cedar Group',
  'Delta Industries',
  'Eastfield Partners',
  'Fairview Enterprises',
  'Global Dynamics Inc.',
  'Harbor Capital',
]

const KEY_AUDIT_AREAS = [
  'Cash',
  'Accounts receivable',
  'Revenue',
  'Additional revenue',
  'Inventory and Cost of Sales',
  'Inventory observation',
  'Property',
  'Investments and derivatives',
  'Prepaid expenses and other assets',
  'Accounts payable and other liabilities',
  'Payroll liabilities and related expenses',
  'Notes payable and long-term debt',
  'Income taxes',
  'Equity',
  'Income and expense',
]

interface NewEngagementTemplateProps {
  onRemove: () => void
  onUse: (data: EngagementData) => void
}

interface EngagementData {
  client: string
  startDate: string
  endDate: string
  keyAuditAreas: string[]
  usePreviousYear: boolean | null
}

export function NewEngagementTemplate({ onRemove, onUse }: NewEngagementTemplateProps) {
  const [client, setClient] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [keyAuditAreas, setKeyAuditAreas] = useState<string[]>([])
  const [usePreviousYear, setUsePreviousYear] = useState<boolean | null>(null)
  const [showErrors, setShowErrors] = useState(false)
  const [auditAreaOpen, setAuditAreaOpen] = useState(false)

  const isValid = client !== '' && startDate !== '' && endDate !== '' && keyAuditAreas.length > 0 && usePreviousYear !== null

  const handleUse = () => {
    if (!isValid) {
      setShowErrors(true)
      return
    }
    onUse({ client, startDate, endDate, keyAuditAreas, usePreviousYear: usePreviousYear! })
  }

  const toggleAuditArea = (area: string) => {
    setKeyAuditAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  const requiredMark = <span style={{ color: 'var(--saf-color-brand-orange, #D64000)' }}>*</span>

  return (
    <div
      className="w-full rounded-2xl border bg-white text-sm"
      style={{ borderColor: 'var(--saf-color-neutral-300, #d1d5db)' }}
    >
      {/* Required note */}
      <div className="px-5 pt-4 pb-3 border-b" style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}>
        <p className="font-semibold text-gray-800">{requiredMark} = Required</p>
      </div>

      {/* Form fields */}
      <div className="px-5 py-4 flex flex-col gap-5">

        {/* 1. Select client */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="engagement-client" className="font-medium text-gray-700">
            Select client:{requiredMark}
          </label>
          <div className="relative">
            <select
              id="engagement-client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-8 text-sm text-gray-800 outline-none focus:ring-2"
              style={{
                borderColor: showErrors && !client ? 'var(--saf-color-brand-orange, #D64000)' : 'var(--saf-color-neutral-300, #d1d5db)',
                focusRingColor: 'var(--saf-color-brand-orange, #D64000)',
              }}
              aria-required="true"
              aria-invalid={showErrors && !client}
            >
              <option value="" disabled>Select client</option>
              {CLIENTS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="__new__">+ Create new client</option>
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </div>
          {showErrors && !client && (
            <p className="flex items-center gap-1 text-xs" style={{ color: 'var(--saf-color-brand-orange, #D64000)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              Client is required
            </p>
          )}
        </div>

        {/* 2. Select dates */}
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-gray-700">
            Select dates of engagement:{requiredMark}
          </label>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-xs text-gray-500">Start date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                aria-label="Engagement start date"
                aria-required="true"
                aria-invalid={showErrors && !startDate}
                className="rounded-lg border px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 bg-white"
                style={{ borderColor: showErrors && !startDate ? 'var(--saf-color-brand-orange, #D64000)' : 'var(--saf-color-neutral-300, #d1d5db)' }}
              />
            </div>
            <span className="mt-5 text-gray-400 text-xs">to</span>
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-xs text-gray-500">End date</span>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                aria-label="Engagement end date"
                aria-required="true"
                aria-invalid={showErrors && !endDate}
                className="rounded-lg border px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 bg-white"
                style={{ borderColor: showErrors && !endDate ? 'var(--saf-color-brand-orange, #D64000)' : 'var(--saf-color-neutral-300, #d1d5db)' }}
              />
            </div>
          </div>
          {showErrors && (!startDate || !endDate) && (
            <p className="flex items-center gap-1 text-xs" style={{ color: 'var(--saf-color-brand-orange, #D64000)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              Both dates are required
            </p>
          )}
        </div>

        {/* 3. Key audit areas multi-select */}
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-gray-700">
            Select key audit areas:{requiredMark}
          </label>

          {/* Selected tags */}
          {keyAuditAreas.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-1">
              {keyAuditAreas.map((area) => (
                <span
                  key={area}
                  className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: 'var(--saf-color-brand-orange-light, #FFF0EB)',
                    color: 'var(--saf-color-brand-orange, #D64000)',
                    border: '1px solid var(--saf-color-brand-orange, #D64000)',
                  }}
                >
                  {area}
                  <button
                    onClick={() => toggleAuditArea(area)}
                    aria-label={`Remove ${area}`}
                    className="hover:opacity-70"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setAuditAreaOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={auditAreaOpen}
              aria-label="Select key audit areas"
              className="flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm outline-none"
              style={{ borderColor: showErrors && keyAuditAreas.length === 0 ? 'var(--saf-color-brand-orange, #D64000)' : 'var(--saf-color-neutral-300, #d1d5db)' }}
            >
              <span className={keyAuditAreas.length === 0 ? 'text-gray-400' : 'text-gray-700'}>
                {keyAuditAreas.length === 0 ? 'Select audit areas' : `${keyAuditAreas.length} area${keyAuditAreas.length > 1 ? 's' : ''} selected`}
              </span>
              <svg className={`transition-transform ${auditAreaOpen ? 'rotate-180' : ''} text-gray-400`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>

            {auditAreaOpen && (
              <div
                role="listbox"
                aria-multiselectable="true"
                aria-label="Key audit areas"
                className="absolute z-20 mt-1 w-full rounded-lg border bg-white shadow-lg overflow-y-auto"
                style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)', maxHeight: '220px' }}
              >
                {KEY_AUDIT_AREAS.map((area) => {
                  const selected = keyAuditAreas.includes(area)
                  return (
                    <button
                      key={area}
                      role="option"
                      aria-selected={selected}
                      type="button"
                      onClick={() => toggleAuditArea(area)}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                    >
                      <span
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded border"
                        style={{
                          backgroundColor: selected ? 'var(--saf-color-brand-orange, #D64000)' : 'white',
                          borderColor: selected ? 'var(--saf-color-brand-orange, #D64000)' : 'var(--saf-color-neutral-300, #d1d5db)',
                        }}
                      >
                        {selected && (
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
                        )}
                      </span>
                      <span className="text-gray-800">{area}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {showErrors && keyAuditAreas.length === 0 && (
            <p className="flex items-center gap-1 text-xs" style={{ color: 'var(--saf-color-brand-orange, #D64000)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              At least one audit area is required
            </p>
          )}
        </div>

        {/* 4. Use previous year */}
        <div className="flex flex-col gap-2">
          <p className="font-medium text-gray-700">
            Use previous year&apos;s engagement to recommend audit risk and procedure changes?{requiredMark}
          </p>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="use-previous-year"
                value="yes"
                checked={usePreviousYear === true}
                onChange={() => setUsePreviousYear(true)}
                className="h-4 w-4 cursor-pointer"
                style={{ accentColor: 'var(--saf-color-brand-orange, #D64000)' }}
                aria-label="Yes, use previous year engagement"
              />
              <span className="text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="use-previous-year"
                value="no"
                checked={usePreviousYear === false}
                onChange={() => setUsePreviousYear(false)}
                className="h-4 w-4 cursor-pointer"
                style={{ accentColor: 'var(--saf-color-brand-orange, #D64000)' }}
                aria-label="No, do not use previous year engagement"
              />
              <span className="text-gray-700">No</span>
            </label>
          </div>
          {showErrors && usePreviousYear === null && (
            <p className="flex items-center gap-1 text-xs" style={{ color: 'var(--saf-color-brand-orange, #D64000)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              Selection is required
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-5 py-3 border-t"
        style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
      >
        {showErrors && !isValid ? (
          <p className="text-xs" style={{ color: 'var(--saf-color-brand-orange, #D64000)' }}>
            *Please fill in all required fields.
          </p>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={onRemove}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            style={{ borderColor: 'var(--saf-color-neutral-300, #d1d5db)' }}
          >
            Remove template
          </button>
          <button
            onClick={handleUse}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: 'var(--saf-color-neutral-900, #111827)' }}
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  )
}
