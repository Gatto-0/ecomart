import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, User, Menu } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

export default function UtilityCluster({
  className = '',
  onOpenMenu,
  menuButtonRef,
}) {
  const { count: cartCount } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { user, logout } = useAuth()
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)
  const accountButtonRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!accountOpen) return undefined

    const closeOnOutsideClick = (event) => {
      if (!accountRef.current?.contains(event.target)) setAccountOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setAccountOpen(false)
        accountButtonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [accountOpen])

  const handleLogout = () => {
    logout()
    setAccountOpen(false)
    if (location.pathname === '/checkout') navigate('/cart')
  }

  return (
    <div
      className={`h-11 px-4 sm:px-5 rounded-full bg-forest text-cream flex items-center gap-4 sm:gap-5 shadow-md border border-forest/20 ${className}`}
      role="region"
      aria-label="User utilities"
    >
      {/* Wishlist — badge only when above 0 */}
      <Link
        to="/wishlist"
        aria-label="Wishlist"
        className="relative text-cream hover:text-leaf transition-colors flex items-center justify-center p-1 rounded-full btn-minor"
      >
        <Heart size={18} aria-hidden="true" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-clay text-cream text-[10px] font-semibold leading-none">
            {wishlistCount}
          </span>
        )}
      </Link>

      {/* Cart with count badge */}
      <Link
        to="/cart"
        aria-label="Cart"
        className="relative text-cream hover:text-leaf transition-colors flex items-center justify-center p-1 rounded-full btn-minor"
      >
        <ShoppingCart size={18} aria-hidden="true" />
        <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-clay text-cream text-[10px] font-semibold leading-none">
          {cartCount}
        </span>
      </Link>

      {/* Login or account menu */}
      {user ? (
        <div className="relative" ref={accountRef}>
          <button
            ref={accountButtonRef}
            type="button"
            onClick={() => setAccountOpen((isOpen) => !isOpen)}
            aria-label={`Account menu for ${user.name}`}
            aria-haspopup="dialog"
            aria-expanded={accountOpen}
            aria-controls="account-menu"
            className="w-9 h-9 rounded-full bg-forest text-cream flex items-center justify-center font-semibold text-sm cursor-pointer btn-minor hover:text-forest"
          >
            {user.name.trim().charAt(0).toUpperCase() || '?'}
          </button>

          {accountOpen && (
            <div
              id="account-menu"
              role="dialog"
              aria-label="Account menu"
              className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-forest/10 bg-cream p-4 text-forest shadow-xl"
            >
              <div className="mb-3 border-b border-forest/10 pb-3">
                <p className="font-heading font-semibold leading-snug">{user.name}</p>
                <p className="mt-1 break-all text-xs text-charcoal/70">{user.email}</p>
              </div>
              <nav aria-label="Account links" className="flex flex-col gap-1">
                <Link
                  to="/wishlist"
                  onClick={() => setAccountOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm hover:bg-sage btn-minor"
                >
                  Wishlist
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setAccountOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm hover:bg-sage btn-minor"
                >
                  Cart
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-left text-sm text-walnut hover:bg-sage cursor-pointer btn-minor"
                >
                  Log out
                </button>
              </nav>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/login"
          aria-label="Login"
          className="text-cream hover:text-leaf transition-colors flex items-center justify-center p-1 rounded-full btn-minor"
        >
          <User size={18} aria-hidden="true" />
        </Link>
      )}

      {/* Menu button: icon only, no text, aria-label "Open menu" */}
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="text-cream hover:text-leaf transition-colors flex items-center justify-center p-1 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-leaf rounded-full btn-minor"
      >
        <Menu size={18} aria-hidden="true" />
      </button>
    </div>
  )
}
