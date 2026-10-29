import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { X, Home, ShoppingBag, BookOpen, HelpCircle } from 'lucide-react'
import Logo from './Logo'

const navLinks = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/shop', label: 'Shop', icon: ShoppingBag, end: false },
  { to: '/learn', label: 'Learn', icon: BookOpen, end: false },
  { to: '/how-it-works', label: 'How it works', icon: HelpCircle, end: false },
]

export default function SideDrawer({ isOpen, onClose, menuButtonRef }) {
  const closeButtonRef = useRef(null)
  const prevIsOpenRef = useRef(isOpen)

  // Manage focus on open and close
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus()
    } else if (prevIsOpenRef.current && !isOpen) {
      menuButtonRef?.current?.focus()
    }
    prevIsOpenRef.current = isOpen
  }, [isOpen, menuButtonRef])

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  return (
    <>
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 bottom-0 right-0 z-50 w-[300px] max-w-[85vw] h-full bg-forest text-cream flex flex-col shadow-2xl transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Top: Logo & Close Button */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-cream/10 shrink-0">
          <Logo onClick={onClose} />

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-10 h-10 rounded-full flex items-center justify-center text-cream/80 hover:text-cream btn-minor transition-colors cursor-pointer"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Links with lucide icons */}
        <nav className="p-4 flex-1 overflow-y-auto" aria-label="Main navigation">
          <ul className="space-y-1.5">
            {navLinks.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-leaf bg-cream/10 font-semibold'
                        : 'text-cream/80 hover:text-cream hover:bg-cream/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        className={`shrink-0 transition-colors ${
                          isActive
                            ? 'text-leaf'
                            : 'text-cream/60 group-hover:text-cream'
                        }`}
                        aria-hidden="true"
                      />
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom small muted text */}
        <div className="p-6 border-t border-cream/10 shrink-0">
          <p className="text-xs text-cream/50 leading-relaxed font-sans">
            Don&apos;t just shop. Shop with purpose.
          </p>
        </div>
      </aside>
    </>
  )
}

