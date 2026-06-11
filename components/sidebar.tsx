'use client'

import {
  MessageSquare,
  FileText,
  Bookmark,
  Layers,
  ClipboardList,
  Users,
  Briefcase,
  Database,
  History,
  HelpCircle,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { icon: MessageSquare, label: 'Conversations', active: true },
  { icon: FileText, label: 'Documents', badge: true },
  { icon: Bookmark, label: 'Saved' },
  { icon: Layers, label: 'Workspaces' },
  { icon: ClipboardList, label: 'Tasks' },
  { icon: Users, label: 'Clients' },
  { icon: Briefcase, label: 'Matters' },
  { icon: Database, label: 'Data sources' },
]

const bottomNavItems = [
  { icon: History, label: 'History' },
  { icon: HelpCircle, label: 'Help' },
]

export function Sidebar() {
  const [activeItem, setActiveItem] = useState('Conversations')

  return (
    <aside
      className="flex h-screen w-[56px] flex-col items-center border-r bg-white py-3 shrink-0"
      style={{ borderColor: 'var(--saf-color-neutral-200, #e5e7eb)' }}
      aria-label="Primary navigation"
    >
      {/* TR Logo */}
      <div className="mb-4 flex h-10 w-10 items-center justify-center">
        <TRDottedLogo />
      </div>

      {/* Expand toggle */}
      <button
        className="mb-2 flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
        aria-label="Expand sidebar"
      >
        <ChevronRight size={14} className="text-gray-500" />
      </button>

      {/* Main nav */}
      <nav className="flex flex-1 flex-col items-center gap-1 pt-1" aria-label="Main navigation">
        {navItems.map(({ icon: Icon, label, badge, active: _active }) => (
          <button
            key={label}
            onClick={() => setActiveItem(label)}
            aria-label={label}
            aria-current={activeItem === label ? 'page' : undefined}
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              activeItem === label
                ? 'text-gray-800'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            }`}
          >
            <Icon size={18} />
            {badge && (
              <span
                className="absolute right-1 top-1 h-2 w-2 rounded-full"
                style={{ backgroundColor: 'var(--saf-color-brand-orange, #D64000)' }}
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom nav */}
      <nav className="flex flex-col items-center gap-1 pb-2" aria-label="Secondary navigation">
        {bottomNavItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            aria-label={label}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <Icon size={18} />
          </button>
        ))}

        {/* User avatar */}
        <button
          aria-label="User profile"
          className="mt-2 flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-semibold"
          style={{ backgroundColor: 'var(--saf-color-brand-orange, #D64000)' }}
        >
          GR
        </button>
      </nav>
    </aside>
  )
}

function TRDottedLogo() {
  // Mimics the orange dotted circle Thomson Reuters logo mark
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Thomson Reuters logo"
      role="img"
    >
      {/* Dots arranged in a circle */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 360) / 12
        const rad = (angle * Math.PI) / 180
        const r = 11
        const cx = 16 + r * Math.sin(rad)
        const cy = 16 - r * Math.cos(rad)
        const dotSize = i % 3 === 0 ? 2.2 : 1.5
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={dotSize}
            fill="#D64000"
            opacity={0.7 + (i % 4) * 0.1}
          />
        )
      })}
    </svg>
  )
}
