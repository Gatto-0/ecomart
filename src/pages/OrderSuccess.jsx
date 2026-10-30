import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, ShoppingBag, Leaf } from 'lucide-react'
import EcoScoreBadge from '../components/EcoScoreBadge'

function fmt(price) {
  return '₹' + price.toLocaleString('en-IN')
}

export default function OrderSuccess() {
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('ecomart_last_order')
      if (!raw) {
        navigate('/shop', { replace: true })
        return
      }
      setOrder(JSON.parse(raw))
    } catch {
      navigate('/shop', { replace: true })
    }
  }, [navigate])

  if (!order) return null

  const { orderId, items, subtotal, impact } = order
  const plasticDisplay =
    impact.plasticG >= 1000
      ? `${(impact.plasticG / 1000).toFixed(2)} kg`
      : `${impact.plasticG} g`

  const handleAskBuddy = () => {
    window.dispatchEvent(
      new CustomEvent('ecobuddy:ask', {
        detail: `I just ordered some eco products. Can you give me tips on how to make the most of them sustainably?`,
      })
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
      <div className="pt-4 sm:pt-6 pb-6 text-center flex flex-col items-center gap-4">
        <CheckCircle2 size={56} className="text-leaf" aria-hidden="true" />
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-forest">
            Order confirmed!
          </h1>
          <p className="text-charcoal/60 text-sm mt-1">
            Thank you for shopping sustainably.
          </p>
          <p className="text-xs text-charcoal/40 mt-0.5">
            Demo checkout, no payment is taken
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1 px-4 py-2 rounded-full bg-forest/8 border border-forest/15">
          <span className="text-xs text-charcoal/60">Order ID:</span>
          <span className="font-heading font-bold text-sm text-forest tracking-wide">{orderId}</span>
        </div>
      </div>

      {/* Impact banner */}
      <div className="rounded-2xl bg-forest text-cream p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start mb-8">
        <Leaf size={32} className="text-marigold shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h2 className="font-heading font-semibold text-lg mb-1">Your green impact</h2>
          <p className="text-cream/85 text-sm leading-relaxed">
            This order avoids about <strong className="text-cream">{plasticDisplay} of plastic</strong> and{' '}
            <strong className="text-cream">
              {impact.co2Kg.toLocaleString('en-IN', { maximumFractionDigits: 2 })} kg of CO₂
            </strong>
            , estimated.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <EcoScoreBadge total={Math.round(impact.avgScore)} size="sm" />
            <span className="text-xs text-cream/70">average eco score for this order</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-2xl border border-forest/15 p-5 mb-8">
        <h2 className="font-heading font-semibold text-base text-forest mb-4">Items ordered</h2>
        <ul className="flex flex-col divide-y divide-forest/10">
          {items.map((item) => (
            <li key={item.slug} className="flex justify-between gap-3 py-3 text-sm">
              <span className="text-charcoal flex-1 min-w-0 leading-tight">
                {item.name}
                <span className="text-charcoal/50"> × {item.qty}</span>
              </span>
              <span className="font-semibold text-charcoal shrink-0 tabular-nums">
                {fmt(item.price * item.qty)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between pt-4 border-t border-forest/10 mt-1 font-semibold text-charcoal">
          <span>Total</span>
          <span className="font-heading text-base text-forest">{fmt(subtotal)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/shop"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-forest text-cream font-semibold text-sm hover:bg-forest/90 transition-colors"
        >
          <ShoppingBag size={16} aria-hidden="true" />
          Continue shopping
        </Link>
        <button
          type="button"
          onClick={handleAskBuddy}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-forest text-forest font-semibold text-sm hover:bg-forest/5 transition-colors cursor-pointer"
        >
          <Leaf size={16} aria-hidden="true" />
          Ask Eco Buddy for tips
        </button>
      </div>
    </div>
  )
}

