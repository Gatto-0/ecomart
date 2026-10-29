import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, User } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function UtilityCluster({ className = '' }) {
  const { count: cartCount } = useCart()
  const { count: wishlistCount } = useWishlist()

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
        className="relative text-cream hover:text-leaf transition-colors flex items-center justify-center p-1"
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
        className="relative text-cream hover:text-leaf transition-colors flex items-center justify-center p-1"
      >
        <ShoppingCart size={18} aria-hidden="true" />
        <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-clay text-cream text-[10px] font-semibold leading-none">
          {cartCount}
        </span>
      </Link>

      {/* Login */}
      <Link
        to="/login"
        aria-label="Login"
        className="text-cream hover:text-leaf transition-colors flex items-center justify-center p-1"
      >
        <User size={18} aria-hidden="true" />
      </Link>
    </div>
  )
}
