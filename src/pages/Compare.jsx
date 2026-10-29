import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, Check, Scale } from 'lucide-react'
import { getProduct, categories } from '../data/products'
import { criteria } from '../data/ecoScore'
import EcoScoreBadge from '../components/EcoScoreBadge'
import { useCart } from '../context/CartContext'

function fmt(price) {
  return '₹' + price.toLocaleString('en-IN')
}

function fmtPlastic(g) {
  if (g >= 1000) {
    return `${(g / 1000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} kg`
  }
  return `${g} g`
}

function ProductImage({ product }) {
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
      <div className="w-full h-full bg-forest/10 flex items-center justify-center p-2">
        <span className="text-forest/30 font-heading text-xs text-center">{product.name}</span>
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

function AddToCartBtn({ slug }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(slug)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
        added
          ? 'bg-leaf text-cream'
          : 'bg-forest text-cream hover:bg-forest/90 active:scale-[0.98]'
      }`}
    >
      {added ? 'Added to cart' : 'Add to cart'}
    </button>
  )
}

export default function Compare() {
  const [searchParams] = useSearchParams()
  const aSlug = searchParams.get('a')
  const bSlug = searchParams.get('b')

  const prodA = aSlug ? getProduct(aSlug) : null
  const prodB = bSlug ? getProduct(bSlug) : null

  if (!prodA || !prodB) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24 text-center">
        <Scale size={56} className="text-forest/20 mx-auto mb-4" aria-hidden="true" />
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-forest mb-3">
          Compare products
        </h1>
        <p className="text-charcoal/70 mb-6 max-w-md mx-auto">
          Please select two products to compare their eco-scores, pricing, and impact side by side.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest text-cream font-semibold text-sm hover:bg-forest/90 transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Browse the shop
        </Link>
      </div>
    )
  }

  // Highlight logic: 'A' | 'B' | null
  const betterPrice =
    prodA.price < prodB.price ? 'A' : prodB.price < prodA.price ? 'B' : null
  const betterTotal =
    prodA.total > prodB.total ? 'A' : prodB.total > prodA.total ? 'B' : null
  const betterPlastic =
    prodA.impact.plasticG > prodB.impact.plasticG
      ? 'A'
      : prodB.impact.plasticG > prodA.impact.plasticG
      ? 'B'
      : null
  const betterCo2 =
    prodA.impact.co2Kg > prodB.impact.co2Kg
      ? 'A'
      : prodB.impact.co2Kg > prodA.impact.co2Kg
      ? 'B'
      : null

  const betterSub = (key) => {
    const sA = prodA.ecoScores?.[key] ?? 0
    const sB = prodB.ecoScores?.[key] ?? 0
    if (sA > sB) return 'A'
    if (sB > sA) return 'B'
    return null
  }

  const highlightClass = 'bg-leaf/10 font-semibold'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
      <div className="pt-4 sm:pt-6 pb-6 sm:pb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-forest tracking-tight">
            Compare products
          </h1>
          <p className="text-xs text-charcoal/60 mt-1">
            Green highlighting shows the better value in each row.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-leaf transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to shop
        </Link>
      </div>

      {/* Desktop side-by-side table */}
      <div className="hidden md:block border border-forest/15 rounded-3xl overflow-hidden bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-forest/10 bg-forest/5">
              <th className="p-4 w-1/4 text-xs font-semibold text-charcoal/60 uppercase tracking-wider">
                Feature
              </th>
              <th className="p-4 w-[37.5%] font-heading font-bold text-lg text-forest">
                {prodA.name}
              </th>
              <th className="p-4 w-[37.5%] font-heading font-bold text-lg text-forest border-l border-forest/10">
                {prodB.name}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest/10 text-sm">
            {/* Photo */}
            <tr>
              <td className="p-4 font-medium text-charcoal/70 bg-cream/40">Product photo</td>
              <td className="p-4">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-forest/5 mx-auto">
                  <ProductImage product={prodA} />
                </div>
              </td>
              <td className="p-4 border-l border-forest/10">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-forest/5 mx-auto">
                  <ProductImage product={prodB} />
                </div>
              </td>
            </tr>

            {/* Name */}
            <tr>
              <td className="p-4 font-medium text-charcoal/70 bg-cream/40">Name</td>
              <td className="p-4">
                <Link
                  to={`/product/${prodA.slug}`}
                  className="font-heading font-semibold text-base text-forest hover:text-leaf transition-colors"
                >
                  {prodA.name}
                </Link>
              </td>
              <td className="p-4 border-l border-forest/10">
                <Link
                  to={`/product/${prodB.slug}`}
                  className="font-heading font-semibold text-base text-forest hover:text-leaf transition-colors"
                >
                  {prodB.name}
                </Link>
              </td>
            </tr>

            {/* Price (lower is better) */}
            <tr>
              <td className="p-4 font-medium text-charcoal/70 bg-cream/40">Price</td>
              <td className={`p-4 font-semibold tabular-nums text-base ${betterPrice === 'A' ? highlightClass : ''}`}>
                {fmt(prodA.price)}
                {betterPrice === 'A' && <span className="ml-2 text-xs text-leaf font-normal">Lower</span>}
              </td>
              <td className={`p-4 border-l border-forest/10 font-semibold tabular-nums text-base ${betterPrice === 'B' ? highlightClass : ''}`}>
                {fmt(prodB.price)}
                {betterPrice === 'B' && <span className="ml-2 text-xs text-leaf font-normal">Lower</span>}
              </td>
            </tr>

            {/* Total Eco Score Badge (higher is better) */}
            <tr>
              <td className="p-4 font-medium text-charcoal/70 bg-cream/40">Total eco score</td>
              <td className={`p-4 ${betterTotal === 'A' ? highlightClass : ''}`}>
                <div className="flex items-center gap-3">
                  <EcoScoreBadge total={prodA.total} size="sm" />
                  <span className="font-heading font-semibold text-forest text-base">{prodA.total}/10</span>
                </div>
              </td>
              <td className={`p-4 border-l border-forest/10 ${betterTotal === 'B' ? highlightClass : ''}`}>
                <div className="flex items-center gap-3">
                  <EcoScoreBadge total={prodB.total} size="sm" />
                  <span className="font-heading font-semibold text-forest text-base">{prodB.total}/10</span>
                </div>
              </td>
            </tr>

            {/* 5 Sub-scores */}
            {criteria.map((c) => {
              const bSub = betterSub(c.key)
              const sA = prodA.ecoScores?.[c.key] ?? 0
              const sB = prodB.ecoScores?.[c.key] ?? 0
              return (
                <tr key={c.key}>
                  <td className="p-4 font-medium text-charcoal/70 bg-cream/40">{c.name}</td>
                  <td className={`p-4 ${bSub === 'A' ? highlightClass : ''}`}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-forest">{sA}/2</span>
                      <span className="text-xs text-charcoal/70">— {c.levels[sA]}</span>
                    </div>
                  </td>
                  <td className={`p-4 border-l border-forest/10 ${bSub === 'B' ? highlightClass : ''}`}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-forest">{sB}/2</span>
                      <span className="text-xs text-charcoal/70">— {c.levels[sB]}</span>
                    </div>
                  </td>
                </tr>
              )
            })}

            {/* Plastic Avoided (higher is better) */}
            <tr>
              <td className="p-4 font-medium text-charcoal/70 bg-cream/40">Plastic avoided</td>
              <td className={`p-4 font-medium ${betterPlastic === 'A' ? highlightClass : ''}`}>
                {fmtPlastic(prodA.impact.plasticG)}
              </td>
              <td className={`p-4 border-l border-forest/10 font-medium ${betterPlastic === 'B' ? highlightClass : ''}`}>
                {fmtPlastic(prodB.impact.plasticG)}
              </td>
            </tr>

            {/* CO₂ Avoided (higher is better) */}
            <tr>
              <td className="p-4 font-medium text-charcoal/70 bg-cream/40">CO₂ avoided</td>
              <td className={`p-4 font-medium ${betterCo2 === 'A' ? highlightClass : ''}`}>
                {prodA.impact.co2Kg.toLocaleString('en-IN', { maximumFractionDigits: 2 })} kg
              </td>
              <td className={`p-4 border-l border-forest/10 font-medium ${betterCo2 === 'B' ? highlightClass : ''}`}>
                {prodB.impact.co2Kg.toLocaleString('en-IN', { maximumFractionDigits: 2 })} kg
              </td>
            </tr>

            {/* Tags */}
            <tr>
              <td className="p-4 font-medium text-charcoal/70 bg-cream/40">Tags</td>
              <td className="p-4">
                <div className="flex flex-wrap gap-1.5">
                  {prodA.tags?.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-forest/8 text-forest">
                      #{t}
                    </span>
                  ))}
                </div>
              </td>
              <td className="p-4 border-l border-forest/10">
                <div className="flex flex-wrap gap-1.5">
                  {prodB.tags?.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-forest/8 text-forest">
                      #{t}
                    </span>
                  ))}
                </div>
              </td>
            </tr>

            {/* Add to cart row */}
            <tr className="bg-forest/5">
              <td className="p-4 font-medium text-charcoal/70">Cart action</td>
              <td className="p-4">
                <AddToCartBtn slug={prodA.slug} />
              </td>
              <td className="p-4 border-l border-forest/10">
                <AddToCartBtn slug={prodB.slug} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile stacked columns */}
      <div className="md:hidden flex flex-col gap-8">
        {[
          { prod: prodA, role: 'A' },
          { prod: prodB, role: 'B' },
        ].map(({ prod, role }) => (
          <article
            key={prod.slug}
            className="border border-forest/15 rounded-3xl overflow-hidden bg-white p-5 shadow-xs flex flex-col gap-4"
          >
            <div className="w-40 h-40 rounded-2xl overflow-hidden bg-forest/5 mx-auto">
              <ProductImage product={prod} />
            </div>

            <div>
              <span className="text-xs text-charcoal/50 uppercase tracking-wider font-semibold">
                Product {role}
              </span>
              <h2 className="font-heading font-bold text-xl text-forest mt-0.5">
                <Link to={`/product/${prod.slug}`} className="hover:text-leaf">
                  {prod.name}
                </Link>
              </h2>
            </div>

            {/* Key stats row */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-cream/60">
              <div className={betterPrice === role ? 'text-leaf font-bold' : ''}>
                <span className="text-xs text-charcoal/60 block">Price</span>
                <span className="text-lg font-heading font-semibold">{fmt(prod.price)}</span>
              </div>
              <div className="flex items-center gap-2">
                <EcoScoreBadge total={prod.total} size="sm" />
                <span className={`text-base font-heading font-semibold ${betterTotal === role ? 'text-leaf' : 'text-forest'}`}>
                  {prod.total}/10
                </span>
              </div>
            </div>

            {/* Sub-scores */}
            <div className="space-y-2 border-t border-forest/10 pt-3">
              <h3 className="font-heading font-semibold text-sm text-forest">Sub-scores</h3>
              {criteria.map((c) => {
                const s = prod.ecoScores?.[c.key] ?? 0
                const isBetter = betterSub(c.key) === role
                return (
                  <div
                    key={c.key}
                    className={`flex justify-between items-center text-xs p-2 rounded-lg ${
                      isBetter ? highlightClass : ''
                    }`}
                  >
                    <span className="font-medium text-charcoal">{c.name}</span>
                    <span className="text-charcoal/70">
                      <strong>{s}/2</strong> — {c.levels[s]}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Impact */}
            <div className="space-y-1.5 border-t border-forest/10 pt-3 text-xs">
              <div className={`flex justify-between p-1.5 rounded ${betterPlastic === role ? highlightClass : ''}`}>
                <span className="text-charcoal/70">Plastic avoided:</span>
                <span className="font-semibold text-charcoal">{fmtPlastic(prod.impact.plasticG)}</span>
              </div>
              <div className={`flex justify-between p-1.5 rounded ${betterCo2 === role ? highlightClass : ''}`}>
                <span className="text-charcoal/70">CO₂ avoided:</span>
                <span className="font-semibold text-charcoal">
                  {prod.impact.co2Kg.toLocaleString('en-IN', { maximumFractionDigits: 2 })} kg
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 border-t border-forest/10 pt-3">
              {prod.tags?.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-forest/8 text-forest">
                  #{t}
                </span>
              ))}
            </div>

            <AddToCartBtn slug={prod.slug} />
          </article>
        ))}
      </div>
    </div>
  )
}

