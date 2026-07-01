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

// Engagements keyed by client name
const CLIENT_ENGAGEMENTS: Record<string, string[]> = {
  'Acme Corporation': ['FY2024 Annual Audit', 'FY2023 Annual Audit', 'FY2022 Annual Audit'],
  'Bright Horizons LLC': ['FY2024 Annual Audit', 'FY2023 Annual Audit'],
  'Cedar Group': ['FY2024 Annual Audit', 'Q3 2024 Review', 'FY2023 Annual Audit'],
  'Delta Industries': ['FY2024 Annual Audit', 'FY2023 Annual Audit'],
  'Eastfield Partners': ['FY2024 Annual Audit', 'FY2023 Annual Audit', 'FY2022 Annual Audit'],
  'Fairview Enterprises': ['FY2024 Annual Audit', 'FY2023 Annual Audit'],
  'Global Dynamics Inc.': ['FY2024 Annual Audit', 'Q2 2024 Review', 'FY2023 Annual Audit'],
  'Harbor Capital': ['FY2024 Annual Audit', 'FY2023 Annual Audit'],
}

interface NewEngagementTemplateProps {
  onRemove: () => void
  onUse: (data: EngagementData) => void
}

interface EngagementData {
  client: string
  engagement: string
  usePreviousYear: boolean | null
}

export function NewEngagementTemplate({ onRemove, onUse }: NewEngagementTemplateProps) {
  const [client, setClient] = useState('')
  const [engagement, setEngagement] = useState('')
  const [usePreviousYear, setUsePreviousYear] = useState<boolean | null>(null)
  const [showErrors, setShowErrors] = useState(false)

  const engagements = client ? (CLIENT_ENGAGEMENTS[client] ?? []) : []

  const isValid = client !== '' && engagement !== '' && usePreviousYear !== null

  const handleUse = () => {
    if (!isValid) {
      setShowErrors(true)
      return
    }
    onUse({ client, engagement, usePreviousYear: usePreviousYear! })
  }

  // Reset engagement when client changes
  const handleClientChange = (val: string) => {
    setClient(val)
    setEngagement('')
  }

  const requiredMark = <span style={{ color: 'var(--saf-color-brand-orange, #D64000)' }}>*</span>

  return (
    <div
      className="w-full rounded-2xl border bg-white text-sm text-left"
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
              onChange={(e) => handleClientChange(e.target.value)}
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

        {/* 2. Select engagement */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="engagement-select" className="font-medium text-gray-700">
            Select engagement:{requiredMark}
          </label>
          <div className="relative">
            <select
              id="engagement-select"
              value={engagement}
              onChange={(e) => setEngagement(e.target.value)}
              disabled={!client}
              className="w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-8 text-sm text-gray-800 outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                borderColor: showErrors && !engagement ? 'var(--saf-color-brand-orange, #D64000)' : 'var(--saf-color-neutral-300, #d1d5db)',
              }}
              aria-required="true"
              aria-invalid={showErrors && !engagement}
            >
              <option value="" disabled>
                {client ? 'Select engagement' : 'Select a client first'}
              </option>
              {engagements.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </div>
          {showErrors && !engagement && (
            <p className="flex items-center gap-1 text-xs" style={{ color: 'var(--saf-color-brand-orange, #D64000)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              Engagement is required
            </p>
          )}
        </div>

        {/* 3. Use previous year */}
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
