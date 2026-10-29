import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Search, Heart, ShoppingCart, User } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/learn', label: 'Learn' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const cartCount = 0

  useEffect(() => {
    if (!isHome) return

    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  const isSolid = !isHome || scrolled

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isSolid ? 'bg-forest text-cream shadow-md' : 'bg-transparent text-forest'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ease-in-out ${
            isSolid ? 'h-14' : 'h-20'
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className={`font-heading font-semibold tracking-tight transition-all duration-300 ease-in-out hover:text-leaf ${
              isSolid ? 'text-xl text-cream' : 'text-2xl text-forest'
            }`}
          >
            EcoMart
          </Link>

          {/* Nav Links */}
          <ul className="flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => {
                    const baseStyle = 'text-sm font-medium transition-colors'
                    if (isActive) {
                      return isSolid
                        ? `${baseStyle} text-leaf border-b-2 border-leaf pb-0.5`
                        : `${baseStyle} text-forest font-semibold border-b-2 border-forest pb-0.5`
                    }
                    return isSolid
                      ? `${baseStyle} text-cream hover:text-leaf`
                      : `${baseStyle} text-forest/80 hover:text-forest`
                  }}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Action Icons */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              className={`transition-colors cursor-pointer ${
                isSolid ? 'text-cream hover:text-leaf' : 'text-forest hover:text-leaf'
              }`}
            >
              <Search size={isSolid ? 18 : 20} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className={`transition-colors ${
                isSolid ? 'text-cream hover:text-leaf' : 'text-forest hover:text-leaf'
              }`}
            >
              <Heart size={isSolid ? 18 : 20} />
            </Link>

            {/* Cart with count badge */}
            <Link
              to="/cart"
              aria-label="Cart"
              className={`relative transition-colors ${
                isSolid ? 'text-cream hover:text-leaf' : 'text-forest hover:text-leaf'
              }`}
            >
              <ShoppingCart size={isSolid ? 18 : 20} />
              <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-clay text-cream text-[10px] font-semibold leading-none">
                {cartCount}
              </span>
            </Link>

            {/* Login */}
            <Link
              to="/login"
              aria-label="Login"
              className={`transition-colors ${
                isSolid ? 'text-cream hover:text-leaf' : 'text-forest hover:text-leaf'
              }`}
            >
              <User size={isSolid ? 18 : 20} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer so non-home page content isn't covered by the fixed slim navbar */}
      {!isHome && <div className="h-14 shrink-0" aria-hidden="true" />}
    </>
  )
}
