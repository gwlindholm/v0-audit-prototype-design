'use client'

interface TemplateChipsProps {
  onSelect?: (template: string) => void
}

const templates = [
  'Popular at your firm',
  'Conduct nexus/sourcing study',
  'Prepare financial statements',
  'Audit testing & review',
]

export function TemplateChips({ onSelect }: TemplateChipsProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-gray-500">Or start from a template</p>
      <div className="flex flex-wrap justify-center gap-2">
        {templates.map((template) => (
          <button
            key={template}
            onClick={() => onSelect?.(template)}
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
