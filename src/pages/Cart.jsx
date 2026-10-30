import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Repeat2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { getProduct, getSwap, categories } from '../data/products'
import EcoScoreBadge from '../components/EcoScoreBadge'
import ImpactSummary from '../components/ImpactSummary'
import { cartImpact } from '../lib/impact'

function fmt(price) {
  return '₹' + price.toLocaleString('en-IN')
}

function CartItemImage({ product }) {
  const [src, setSrc] = useState(product.image)
  const cat = categories.find((c) => c.slug === product.category)

  const handleError = () => {
    if (src === product.image && cat?.image && cat.image !== src) {
      setSrc(cat.image)
    } else {
      setSrc(null)
    }
  }

  if (src === null) {
    return (
      <div className="w-full h-full bg-forest/10 flex items-center justify-center">
        <span className="text-forest/30 font-heading text-[10px] text-center px-1">{product.name}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={product.name}
      onError={handleError}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  )
}

function CartRow({ item }) {
  const { removeItem, setQty } = useCart()
  const product = getProduct(item.slug)
  if (!product) return null

  const cat = categories.find((c) => c.slug === product.category)
  const lineTotal = product.price * item.qty

  return (
    <li className="cart-item flex gap-3 sm:gap-4 py-5 border-b border-forest/10 last:border-0">
      {/* Photo */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-forest/5 shrink-0">
        <CartItemImage product={product} />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-[11px] text-charcoal/50">{cat?.name ?? product.category}</span>
            <h3 className="font-heading font-semibold text-sm sm:text-base text-forest leading-tight line-clamp-2">
              {product.name}
            </h3>
          </div>
          <EcoScoreBadge total={product.total} size="sm" />
        </div>

        <p className="text-sm text-charcoal/70">{fmt(product.price)} each</p>

        <div className="flex items-center justify-between mt-auto pt-1 flex-wrap gap-2">
          {/* Quantity stepper */}
          <div className="flex items-center gap-1 border border-forest/20 rounded-full overflow-hidden">
            <button
              type="button"
              onClick={() => setQty(item.slug, item.qty - 1)}
              disabled={item.qty <= 1}
              aria-label="Decrease quantity"
              className="w-8 h-8 flex items-center justify-center text-forest hover:bg-forest/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors btn-minor"
            >
              <Minus size={14} aria-hidden="true" />
            </button>
            <span className="w-6 text-center text-sm font-semibold text-charcoal tabular-nums">
              {item.qty}
            </span>
            <button
              type="button"
              onClick={() => setQty(item.slug, item.qty + 1)}
              aria-label="Increase quantity"
              className="w-8 h-8 flex items-center justify-center text-forest hover:bg-forest/5 cursor-pointer transition-colors btn-minor"
            >
              <Plus size={14} aria-hidden="true" />
            </button>
          </div>

          {/* Line total + remove */}
          <div className="flex items-center gap-3">
            <span className="font-heading font-semibold text-sm sm:text-base text-forest tabular-nums">
              {fmt(lineTotal)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(item.slug)}
              aria-label={`Remove ${product.name} from cart`}
              className="w-8 h-8 flex items-center justify-center text-charcoal/40 hover:text-clay transition-colors cursor-pointer btn-minor"
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}

function GreenerSwaps() {
  const { items, replaceItem } = useCart()

  const swapPairs = items
    .map((item) => {
      const product = getProduct(item.slug)
      if (!product || product.total >= 5) return null
      const swap = getSwap(product)
      if (!swap) return null
      return { item, product, swap }
    })
    .filter(Boolean)

  if (swapPairs.length === 0) return null

  return (
    <div className="mt-6 rounded-xl border border-sun/40 bg-sun/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Repeat2 size={16} className="text-clay shrink-0" aria-hidden="true" />
        <h3 className="font-heading font-semibold text-sm text-charcoal">Greener swaps</h3>
      </div>
      <ul className="flex flex-col gap-3">
        {swapPairs.map(({ product, swap }) => (
          <li key={product.slug} className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-charcoal/60 leading-tight">
                Instead of <span className="font-medium text-charcoal">{product.name}</span>
              </p>
              <p className="text-sm font-semibold text-forest leading-tight mt-0.5">{swap.name}</p>
              <p className="text-xs font-semibold text-leaf mt-0.5">
                +{swap.total - product.total} points
              </p>
            </div>
            <button
              type="button"
              onClick={() => replaceItem(product.slug, swap.slug)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-forest text-cream hover:bg-forest/90 transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              Swap
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Cart() {
  const { items, subtotal } = useCart()
  const navigate = useNavigate()
  const impact = cartImpact(items)

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24 flex flex-col items-center text-center gap-6">
        <ShoppingBag size={56} className="text-forest/20" aria-hidden="true" />
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-forest">
          Your cart is empty
        </h1>
        <p className="text-charcoal/60 max-w-sm">
          Add some sustainable products and make your shopping greener.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest text-cream font-semibold text-sm hover:bg-forest/90 transition-colors btn-major"
        >
          Browse the shop <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
      <div className="pt-4 sm:pt-6 pb-6 sm:pb-8">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-forest tracking-tight">
          Your cart
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Item list */}
        <div className="flex-1 w-full min-w-0">
          <ul>
            {items.map((item) => (
              <CartRow key={item.slug} item={item} />
            ))}
          </ul>

          <GreenerSwaps />
        </div>

        {/* Sticky summary */}
        <aside className="w-full lg:w-80 lg:sticky lg:top-24 flex flex-col gap-4">
          <div className="cart-summary rounded-2xl border border-forest/15 bg-cream p-5 flex flex-col gap-4 shadow-sm">
            <h2 className="font-heading font-semibold text-lg text-forest">
              Order summary
            </h2>

            <div className="flex justify-between text-sm text-charcoal/80 border-b border-forest/10 pb-3">
              <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
              <span className="font-semibold text-charcoal">{fmt(subtotal)}</span>
            </div>

            <div className="cart-total flex justify-between text-sm font-semibold text-charcoal">
              <span>Total</span>
              <span className="font-heading text-base">{fmt(subtotal)}</span>
            </div>

            <ImpactSummary
              plasticG={impact.plasticG}
              co2Kg={impact.co2Kg}
              avgScore={impact.avgScore}
            />

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-3 rounded-full bg-forest text-cream font-semibold text-sm hover:bg-forest/90 transition-colors flex items-center justify-center gap-2 cursor-pointer btn-major"
            >
              Checkout <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
