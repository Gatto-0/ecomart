import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, User } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

export default function UtilityCluster({
  className = '',
  scrolled = false,
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
      className={`utility-cluster h-11 px-4 sm:px-5 flex items-center gap-4 sm:gap-5 ${scrolled ? 'utility-cluster--scrolled' : ''} ${className}`}
      role="region"
      aria-label="User utilities"
    >
      {/* Wishlist — badge only when above 0 */}
      <Link
        to="/wishlist"
        aria-label="Wishlist"
        className="utility-icon relative transition-colors flex items-center justify-center p-1 rounded-full btn-minor"
      >
        <Heart size={18} aria-hidden="true" />
        {wishlistCount > 0 && (
          <span className="count-badge absolute -top-1 -right-2 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-clay text-cream text-[10px] font-semibold leading-none">
            {wishlistCount}
          </span>
        )}
      </Link>

      {/* Cart with count badge */}
      <Link
        to="/cart"
        aria-label="Cart"
        className="utility-icon relative transition-colors flex items-center justify-center p-1 rounded-full btn-minor"
      >
        <ShoppingCart size={18} aria-hidden="true" />
        <span className="count-badge absolute -top-1 -right-2 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-clay text-cream text-[10px] font-semibold leading-none">
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
            className="account-badge w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm cursor-pointer btn-minor"
          >
            {user.name.trim().charAt(0).toUpperCase() || '?'}
          </button>

          {accountOpen && (
            <div
              id="account-menu"
              role="dialog"
              aria-label="Account menu"
              className="account-dropdown absolute right-0 top-full z-50 mt-2 w-64 border border-line bg-white p-4 text-forest"
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
          className="utility-icon transition-colors flex items-center justify-center p-1 rounded-full btn-minor"
        >
          <User size={18} aria-hidden="true" />
        </Link>
      )}

    </div>
  )
}
