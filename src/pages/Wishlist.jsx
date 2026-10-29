import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { getProduct } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const { slugs, toggle } = useWishlist()

  const saved = slugs.map(getProduct).filter(Boolean)

  if (saved.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24 flex flex-col items-center text-center gap-6">
        <Heart size={56} className="text-forest/20" aria-hidden="true" />
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-forest">
          Your wishlist is empty
        </h1>
        <p className="text-charcoal/60 max-w-sm">
          Save products you love and come back to them any time.
        </p>
        <Link
          to="/shop"
          className="btn-major inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest text-cream font-semibold text-sm hover:bg-forest/90 transition-colors"
        >
          <ShoppingBag size={16} aria-hidden="true" />
          Browse the shop
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
      <div className="pt-4 sm:pt-6 pb-6 sm:pb-8 flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-forest tracking-tight">
          Wishlist
        </h1>
        <button
          type="button"
          onClick={() => {
            ;[...slugs].forEach((s) => toggle(s))
          }}
          className="btn-major inline-flex items-center gap-2 text-[16px] px-[22px] py-[12px] rounded-[10px] border-2 border-[var(--walnut)] text-[var(--walnut)] hover:bg-[var(--walnut)] hover:text-[var(--cream)] font-medium cursor-pointer"
        >
          <Trash2 size={18} aria-hidden="true" />
          Clear wishlist
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {saved.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  )
}
