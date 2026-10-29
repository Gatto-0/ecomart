import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Heart, ShoppingCart, User } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/learn', label: 'Learn' },
  { to: '/how-it-works', label: 'How it works' },
]

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const { count: cartCount } = useCart()
  const { count: wishlistCount } = useWishlist()

  useEffect(() => {
    if (!isHome) return

    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  if (!isHome) return null

  const isSolid = scrolled

  return (
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
          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className={`relative transition-colors ${
              isSolid ? 'text-cream hover:text-leaf' : 'text-forest hover:text-leaf'
            }`}
          >
            <Heart size={isSolid ? 18 : 20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-clay text-cream text-[10px] font-semibold leading-none">
                {wishlistCount}
              </span>
            )}
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
  )
}
