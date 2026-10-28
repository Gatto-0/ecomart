import { NavLink, Link } from 'react-router-dom'
import { Search, Heart, ShoppingCart, User } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/learn', label: 'Learn' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const cartCount = 0

  return (
    <nav className="sticky top-0 z-50 bg-forest text-cream shadow-md">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="font-heading text-2xl font-semibold tracking-tight text-cream hover:text-leaf transition-colors"
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
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-leaf ${
                    isActive ? 'text-leaf border-b-2 border-leaf pb-0.5' : 'text-cream'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Icon Actions */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <button
            aria-label="Search"
            className="text-cream hover:text-leaf transition-colors"
          >
            <Search size={20} />
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="text-cream hover:text-leaf transition-colors"
          >
            <Heart size={20} />
          </Link>

          {/* Cart with badge */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative text-cream hover:text-leaf transition-colors"
          >
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 rounded-full bg-clay text-cream text-[10px] font-semibold leading-none">
              {cartCount}
            </span>
          </Link>

          {/* Login */}
          <Link
            to="/login"
            aria-label="Login"
            className="text-cream hover:text-leaf transition-colors"
          >
            <User size={20} />
          </Link>
        </div>
      </div>
    </nav>
  )
}

