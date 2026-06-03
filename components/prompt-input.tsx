'use client'

import { useState } from 'react'
import {
  Plus,
  Paperclip,
  Copy,
  Sparkles,
  Mic,
  ArrowRight,
} from 'lucide-react'

const MAX_CHARS = 45000

interface PromptInputProps {
  onSubmit?: (value: string) => void
}

export function PromptInput({ onSubmit }: PromptInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    if (value.trim() && onSubmit) onSubmit(value.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className="w-full rounded-2xl border bg-white"
      style={{ borderColor: 'var(--saf-color-neutral-300, #d1d5db)' }}
    >
      {/* Text area */}
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, MAX_CHARS))}
        onKeyDown={handleKeyDown}
        placeholder="Ask CoCounsel..."
        aria-label="Ask CoCounsel"
        rows={2}
        className="w-full resize-none rounded-t-2xl bg-transparent px-4 pt-3 pb-2 text-sm text-gray-800 placeholder-gray-400 outline-none"
        style={{ minHeight: '52px' }}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
        <div className="flex items-center gap-1">
          <ToolbarButton icon={Plus} label="Add content" />
          <ToolbarButton icon={Paperclip} label="Attach file" />
          <ToolbarButton icon={Copy} label="Copy" />
          <ToolbarButton icon={Sparkles} label="AI suggestions" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {value.length.toLocaleString()}/{MAX_CHARS.toLocaleString()}
          </span>
          <ToolbarButton icon={Mic} label="Voice input" />

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            aria-label="Send message"
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors disabled:opacity-40"
            style={{
              backgroundColor: value.trim()
                ? 'var(--saf-color-brand-orange, #D64000)'
                : 'var(--saf-color-neutral-200, #e5e7eb)',
            }}
          >
            <ArrowRight
              size={14}
              className={value.trim() ? 'text-white' : 'text-gray-400'}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

function ToolbarButton({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
}) {
  return (
    <button
      aria-label={label}
      title={label}
      className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
    >
      <Icon size={15} />
    </button>
  )
}
