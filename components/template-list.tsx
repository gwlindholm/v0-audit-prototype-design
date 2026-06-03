'use client'

interface TemplateItem {
  label: string
}

interface TemplateListProps {
  category: string
  items: TemplateItem[]
  onBack: () => void
  onSelect?: (item: string) => void
}

export function TemplateList({ category, items, onBack, onSelect }: TemplateListProps) {
  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
          aria-label="Back to templates"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="font-medium">{category}</span>
        </button>

        <button
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Browse all templates"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          Browse all
        </button>
      </div>

      {/* Template items */}
      <div className="flex flex-col">
        {items.map((item, index) => (
          <button
            key={item.label}
            onClick={() => onSelect?.(item.label)}
            className="flex items-center justify-between gap-3 px-1 py-4 text-left transition-colors hover:bg-gray-50 group"
            style={{
              borderTop: index === 0 ? '1px solid var(--saf-color-neutral-200, #e5e7eb)' : undefined,
              borderBottom: '1px solid var(--saf-color-neutral-200, #e5e7eb)',
            }}
            aria-label={`Start template: ${item.label}`}
          >
            <div className="flex items-center gap-3">
              {/* Chat/document icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-gray-400"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="text-sm text-gray-800">{item.label}</span>
            </div>
            {/* Right arrow */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
