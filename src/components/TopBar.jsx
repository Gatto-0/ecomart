// src/components/TopBar.jsx
// Shared top navigation bar across all pages.

import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Logo from './Logo'
import UtilityCluster from './UtilityCluster'

const navLinks = [
  { to: '/', label: 'Home', minWidth: 'min-w-[70px]' },
  { to: '/shop', label: 'Shop', minWidth: 'min-w-[70px]' },
  { to: '/learn', label: 'Learn', minWidth: 'min-w-[75px]' },
  { to: '/how-it-works', label: 'How it works', minWidth: 'min-w-[130px]' },
]

export default function TopBar() {
  const [scrolled, setScrolled] = useState(() => window.scrollY >= 40)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`site-topbar fixed top-0 left-0 right-0 z-40 select-none ${scrolled ? 'site-topbar--scrolled' : ''}`}
      aria-label="Main navigation bar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Left: Plain-text EcoMart Logo */}
        <div className="shrink-0 flex items-center">
          <Logo scrolled={scrolled} />
        </div>

        {/* Center: Desktop Navigation Links (hidden on mobile) */}
        <ul className="hidden md:flex items-center gap-1 lg:gap-3" role="menubar">
          {navLinks.map(({ to, label, minWidth }) => (
            <li
              key={to}
              className={`topbar-nav-item ${minWidth}`}
              role="none"
            >
              <NavLink
                to={to}
                end={to === '/'}
                role="menuitem"
                className={({ isActive }) =>
                  `topbar-nav-link ${
                    isActive
                      ? 'topbar-nav-link--active font-semibold'
                      : ''
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right: Utility Cluster (Wishlist, Cart, Login) */}
        <div className="shrink-0 flex items-center">
          <UtilityCluster scrolled={scrolled} />
        </div>
      </div>
    </nav>
  )
}
