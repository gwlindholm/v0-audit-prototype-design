'use client'

import { useState } from 'react'
import { TemplateList } from '@/components/template-list'

interface TemplateChipsProps {
  onSelect?: (template: string) => void
}

const templates = [
  'Popular at your firm',
  'Conduct nexus/sourcing study',
  'Prepare financial statements',
  'Audit testing & review',
]

const templateItems: Record<string, { label: string }[]> = {
  'Popular at your firm': [
    { label: 'Review Engagement Letter' },
    { label: 'Analyze Tax Provisions' },
    { label: 'Summarize Audit Findings' },
    { label: 'Draft Management Letter' },
    { label: 'Research Accounting Standards' },
  ],
  'Conduct nexus/sourcing study': [
    { label: 'Determine State Tax Nexus' },
    { label: 'Analyze Sales Tax Obligations' },
    { label: 'Review Apportionment Factors' },
    { label: 'Research Economic Nexus Rules' },
    { label: 'Assess Income Tax Filing Requirements' },
  ],
  'Prepare financial statements': [
    { label: 'Draft Balance Sheet' },
    { label: 'Prepare Income Statement' },
    { label: 'Compile Cash Flow Statement' },
    { label: 'Write Footnote Disclosures' },
    { label: 'Review MD&A Section' },
  ],
  'Audit testing & review': [
    { label: 'Staff Audit Workpaper Review' },
    { label: 'Analyze Contributions Receivable' },
    { label: 'Reconcile Financial Statements to Supplementary Information' },
    { label: 'Review Financial Statement' },
    { label: 'Search Public Company Disclosures' },
  ],
}

export function TemplateChips({ onSelect }: TemplateChipsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  if (activeCategory) {
    return (
      <div className="w-full text-left">
        <TemplateList
          category={activeCategory}
          items={templateItems[activeCategory] ?? []}
          onBack={() => setActiveCategory(null)}
          onSelect={onSelect}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-gray-500">Or start from a template</p>
      <div className="flex flex-wrap justify-center gap-2">
        {templates.map((template) => (
          <button
            key={template}
            onClick={() => setActiveCategory(template)}
            className="rounded-full border bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:border-gray-400"
            style={{ borderColor: 'var(--saf-color-neutral-300, #d1d5db)' }}
          >
            {template}
          </button>
        ))}
      </div>
    </div>
  )
}
