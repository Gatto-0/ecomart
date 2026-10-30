// src/components/Logo.jsx
// Plain-text EcoMart logo with Leaf icon, shared across all pages.

import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

export default function Logo({ className = '', onClick, scrolled = false }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`site-logo inline-flex items-center select-none font-heading font-medium text-[38px] tracking-[-0.01em] leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--walnut)] rounded-sm ${scrolled ? 'site-logo--scrolled' : ''} ${className}`}
      aria-label="EcoMart home"
    >
      <span className="site-logo-eco">Eco</span>
      <span className="site-logo-mart">Mart</span>
      <Leaf
        size={18}
        aria-hidden="true"
        style={{
          color: scrolled ? 'var(--leaf-light)' : 'var(--leaf)',
          transform: 'rotate(-20deg)',
        }}
        className="self-start ml-[3px] shrink-0"
      />
    </Link>
  )
}

