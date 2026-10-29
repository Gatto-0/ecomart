import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  ArrowLeft,
  AlertTriangle,
  Sparkles,
} from 'lucide-react'
import {
  getProduct,
  getProductsByCategory,
  getSwap,
  getCategory,
  categories,
} from '../data/products'
import { criteria, getBand, MAX_SCORE } from '../data/ecoScore'
import EcoScoreBadge from '../components/EcoScoreBadge'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

function fmt(price) {
  return '₹' + price.toLocaleString('en-IN')
}

function fmtPlastic(g) {
  if (g >= 1000) {
    return `${(g / 1000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} kg`
  }
  return `${g} g`
}

function ProductDetailImage({ product }) {
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
      <div className="w-full aspect-square bg-forest/10 rounded-3xl flex items-center justify-center p-6 border border-forest/10">
        <span className="text-forest/30 font-heading text-xl text-center">
          {product.name}
        </span>
      </div>
    )
  }

  return (
    <div className="w-full aspect-square rounded-3xl overflow-hidden bg-forest/5 shadow-xs border border-forest/10">
      <img
        src={src}
        alt={product.name}
        onError={handleError}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

function MiniImage({ product }) {
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
      <div className="w-full h-full bg-forest/10 flex items-center justify-center p-1">
        <span className="text-forest/30 font-heading text-[10px] text-center">
          {product.name}
        </span>
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

export default function ProductDetail() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const { addItem, setQty: setCartItemQty, items } = useCart()
  const { toggle, has } = useWishlist()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24 text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-forest mb-4">
          Product not found
        </h1>
        <p className="text-charcoal/70 mb-6 max-w-sm mx-auto">
          We couldn't find the product you're looking for. It may have been moved or removed.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest text-cream font-semibold text-sm hover:bg-forest/90 transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to shop
        </Link>
      </div>
    )
  }

  const inWishlist = has(product.slug)
  const cat = getCategory(product.category)
  const band = getBand(product.total)
  const swap = product.total < 8 ? getSwap(product) : null
  const hasVagueClaim = product.tags?.includes('vague-claim')

  const categoryProducts = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4)

  const handleAddToCart = () => {
    const existing = items.find((i) => i.slug === product.slug)
    if (existing) {
      setCartItemQty(product.slug, existing.qty + qty)
    } else {
      addItem(product.slug)
      if (qty > 1) {
        setCartItemQty(product.slug, qty)
      }
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleAskBuddy = () => {
    window.dispatchEvent(
      new CustomEvent('ecobuddy:ask', {
        detail: `Tell me about ${product.name} (eco score ${product.total}/10). Is it really eco-friendly?`,
      })
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      {/* Back button */}
      <div className="pt-2 pb-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest/70 hover:text-forest transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to shop
        </Link>
      </div>

      {/* Main 2-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
        {/* Left: Large Photo */}
        <div className="lg:sticky lg:top-24">
          <ProductDetailImage product={product} />
        </div>

        {/* Right: Info & Details */}
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <span className="text-xs text-charcoal/50 font-medium">
              {cat?.name ?? product.category}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-forest leading-tight mt-1">
              {product.name}
            </h1>
            <p className="font-heading text-2xl font-bold text-forest mt-3">
              {fmt(product.price)}
            </p>
          </div>

          {/* Large EcoScoreBadge with band label */}
          <div className="flex items-center gap-4 py-3 border-y border-forest/10">
            <EcoScoreBadge total={product.total} size="lg" />
            <div>
              <span className="font-heading font-bold text-xl text-forest block leading-snug">
                {band.label}
              </span>
              <span className="text-xs text-charcoal/60 block mt-0.5">
                Eco score {product.total} of {MAX_SCORE}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-charcoal/80 text-base leading-relaxed">
            {product.description}
          </p>

          {/* Tag chips */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-forest/8 text-forest border border-forest/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity selector, Add to cart & Wishlist heart */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center border border-forest/20 rounded-full overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
                className="w-10 h-10 flex items-center justify-center text-forest hover:bg-forest/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <Minus size={16} aria-hidden="true" />
              </button>
              <span className="w-10 text-center font-semibold text-charcoal tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="w-10 h-10 flex items-center justify-center text-forest hover:bg-forest/5 cursor-pointer transition-colors"
              >
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-6 rounded-full font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                added
                  ? 'bg-leaf text-cream'
                  : 'bg-forest text-cream hover:bg-forest/90 active:scale-[0.98]'
              }`}
            >
              <ShoppingCart size={16} aria-hidden="true" />
              {added ? 'Added to cart' : 'Add to cart'}
            </button>

            <button
              type="button"
              onClick={() => toggle(product.slug)}
              aria-label={inWishlist ? `Remove from wishlist` : `Add to wishlist`}
              className={`w-12 h-12 rounded-full flex items-center justify-center border border-forest/20 transition-all cursor-pointer shrink-0 ${
                inWishlist
                  ? 'bg-forest text-cream'
                  : 'bg-white text-forest/70 hover:text-forest hover:border-forest/40'
              }`}
            >
              <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} aria-hidden="true" />
            </button>
          </div>

          {/* Vague claim warning box */}
          {hasVagueClaim && (
            <div className="rounded-2xl border border-clay/30 bg-clay/10 p-4 text-clay flex items-start gap-3">
              <AlertTriangle size={20} className="shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-sm">Unbacked green claim</p>
                <p className="text-xs text-clay/90 mt-0.5 leading-relaxed">
                  This product's green claim is not backed up by independent proof, and the eco score reflects that.
                </p>
              </div>
            </div>
          )}

          {/* Greener option card */}
          {swap && (
            <div className="rounded-2xl border border-sun/40 bg-sun/10 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-forest/5 shrink-0 border border-forest/10">
                  <MiniImage product={swap} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-charcoal/60 block">Greener option</span>
                  <p className="font-heading font-semibold text-sm text-forest truncate">{swap.name}</p>
                  <p className="text-xs text-charcoal/80">{fmt(swap.price)}</p>
                  <p className="text-xs font-semibold text-leaf mt-0.5">
                    +{swap.total - product.total} points ({swap.total}/10)
                  </p>
                </div>
              </div>
              <Link
                to={`/product/${swap.slug}`}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-forest text-cream hover:bg-forest/90 transition-colors shrink-0 shadow-xs"
              >
                View
              </Link>
            </div>
          )}

          {/* Why this score: 5 rows */}
          <div className="rounded-2xl border border-forest/15 p-5 bg-white/60">
            <h2 className="font-heading font-semibold text-lg text-forest mb-4">
              Why this score
            </h2>
            <div className="divide-y divide-forest/10">
              {criteria.map((c) => {
                const score = product.ecoScores?.[c.key] ?? 0
                return (
                  <div
                    key={c.key}
                    className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="sm:w-1/3">
                      <span className="font-medium text-sm text-forest">{c.name}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:w-1/4">
                      {/* 2-segment bar filled by product's score */}
                      <div className="flex gap-1 w-20 h-2.5">
                        <div
                          className={`flex-1 rounded-xs transition-colors ${
                            score >= 1 ? 'bg-leaf' : 'bg-forest/15'
                          }`}
                        />
                        <div
                          className={`flex-1 rounded-xs transition-colors ${
                            score >= 2 ? 'bg-leaf' : 'bg-forest/15'
                          }`}
                        />
                      </div>
                      <span className="text-xs font-semibold text-charcoal tabular-nums">
                        {score}/2
                      </span>
                    </div>

                    <div className="sm:w-5/12 text-xs text-charcoal/70 leading-snug">
                      {c.levels[score]}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Estimated impact box */}
          <div className="rounded-2xl border border-forest/15 bg-forest/5 p-5">
            <h2 className="font-heading font-semibold text-base text-forest mb-2">
              Estimated impact
            </h2>
            <p className="text-xs text-charcoal/70 mb-4 leading-relaxed">
              Estimated impact over the first year of use compared with a typical conventional alternative:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white/80 rounded-xl p-3 border border-forest/10">
                <span className="font-heading font-bold text-xl text-forest block leading-tight">
                  {fmtPlastic(product.impact.plasticG)}
                </span>
                <span className="text-xs text-charcoal/70 mt-0.5 block">
                  single-use plastic avoided (estimate)
                </span>
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-forest/10">
                <span className="font-heading font-bold text-xl text-forest block leading-tight">
                  {product.impact.co2Kg.toLocaleString('en-IN', { maximumFractionDigits: 2 })} kg
                </span>
                <span className="text-xs text-charcoal/70 mt-0.5 block">
                  CO₂-equivalent avoided (estimate)
                </span>
              </div>
            </div>
          </div>

          {/* Ask Eco Buddy about this product */}
          <button
            type="button"
            onClick={handleAskBuddy}
            className="w-full py-3.5 px-6 rounded-full border-2 border-forest text-forest font-semibold text-sm hover:bg-forest/5 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles size={16} aria-hidden="true" />
            Ask Eco Buddy about this product
          </button>
        </div>
      </div>

      {/* More from this category */}
      {categoryProducts.length > 0 && (
        <section className="mt-16 sm:mt-24 border-t border-forest/10 pt-12 sm:pt-16">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-forest tracking-tight mb-8">
            More from this category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
