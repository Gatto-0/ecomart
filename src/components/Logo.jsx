// src/components/Logo.jsx
// Plain-text EcoMart logo with Leaf icon, shared across all pages.

import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

export default function Logo({ className = '', onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`inline-flex items-center select-none font-heading font-medium text-[38px] tracking-[-0.01em] leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--walnut)] rounded-sm ${className}`}
      aria-label="EcoMart home"
    >
      <span style={{ color: 'var(--forest)' }}>Eco</span>
      <span style={{ color: 'var(--sand)' }}>Mart</span>
      <Leaf
        size={18}
        aria-hidden="true"
        style={{
          color: 'var(--leaf)',
          transform: 'rotate(-20deg)',
        }}
        className="self-start ml-[3px] shrink-0"
      />
    </Link>
  )
}

