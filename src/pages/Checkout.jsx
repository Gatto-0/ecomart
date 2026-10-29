import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProduct } from '../data/products'
import ImpactSummary from '../components/ImpactSummary'
import { cartImpact } from '../lib/impact'

function fmt(price) {
  return '₹' + price.toLocaleString('en-IN')
}

const EMPTY_FORM = {
  name: '',
  phone: '',
  address: '',
  city: '',
  pincode: '',
  payment: 'cod',
}

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Full name is required.'
  if (!/^\d{10}$/.test(form.phone.trim())) errors.phone = 'Enter a valid 10-digit phone number.'
  if (!form.address.trim()) errors.address = 'Address is required.'
  if (!form.city.trim()) errors.city = 'City is required.'
  if (!/^\d{6}$/.test(form.pincode.trim())) errors.pincode = 'Enter a valid 6-digit pincode.'
  return errors
}

function Field({ label, id, type = 'text', value, onChange, error, ...rest }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-charcoal">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          rows={3}
          className={`rounded-xl border px-4 py-2.5 text-sm bg-cream text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest resize-none transition-colors ${
            error ? 'border-clay ring-1 ring-clay' : 'border-forest/20 hover:border-forest/40'
          }`}
          {...rest}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className={`rounded-xl border px-4 py-2.5 text-sm bg-cream text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest transition-colors ${
            error ? 'border-clay ring-1 ring-clay' : 'border-forest/20 hover:border-forest/40'
          }`}
          {...rest}
        />
      )}
      {error && <p className="text-xs text-clay">{error}</p>}
    </div>
  )
}

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const impact = cartImpact(items)

  // Redirect if cart is empty
  useEffect(() => {
    if (!submitting && items.length === 0) {
      navigate('/cart', { replace: true })
    }
  }, [items.length, submitting, navigate])

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // Scroll to first error
      const firstKey = Object.keys(errs)[0]
      document.getElementById(firstKey)?.focus()
      return
    }
    setErrors({})
    setSubmitting(true)

    const orderId = `ECO-${Math.floor(100000 + Math.random() * 899999)}`

    try {
      const order = {
        orderId,
        form,
        items: items.map((i) => {
          const p = getProduct(i.slug)
          return { slug: i.slug, name: p?.name ?? i.slug, price: p?.price ?? 0, qty: i.qty }
        }),
        subtotal,
        impact,
        placedAt: new Date().toISOString(),
      }
      sessionStorage.setItem('ecomart_last_order', JSON.stringify(order))
    } catch {
      // sessionStorage unavailable — continue anyway
    }

    clear()
    navigate('/order-success')
  }

  if (items.length === 0) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
      <div className="pt-4 sm:pt-6 pb-6 sm:pb-8">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-forest tracking-tight">
          Checkout
        </h1>
        <p className="text-xs text-charcoal/50 mt-1">
          Demo checkout — no payment is taken.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex-1 w-full min-w-0 flex flex-col gap-5"
        >
          <fieldset className="flex flex-col gap-4 border border-forest/15 rounded-2xl p-5">
            <legend className="font-heading font-semibold text-base text-forest px-1">
              Delivery details
            </legend>

            <Field
              label="Full name"
              id="name"
              value={form.name}
              onChange={set('name')}
              error={errors.name}
              placeholder="Priya Sharma"
              autoComplete="name"
            />
            <Field
              label="Phone number"
              id="phone"
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              error={errors.phone}
              placeholder="10-digit mobile number"
              autoComplete="tel"
              maxLength={10}
            />
            <Field
              label="Address"
              id="address"
              type="textarea"
              value={form.address}
              onChange={set('address')}
              error={errors.address}
              placeholder="Flat / House no., Street, Locality"
              autoComplete="street-address"
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="City"
                id="city"
                value={form.city}
                onChange={set('city')}
                error={errors.city}
                placeholder="Mumbai"
                autoComplete="address-level2"
              />
              <Field
                label="Pincode"
                id="pincode"
                value={form.pincode}
                onChange={set('pincode')}
                error={errors.pincode}
                placeholder="400001"
                maxLength={6}
              />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-3 border border-forest/15 rounded-2xl p-5">
            <legend className="font-heading font-semibold text-base text-forest px-1">
              Payment method
            </legend>

            {[
              { value: 'cod', label: 'Cash on delivery' },
              { value: 'upi', label: 'UPI (demo)' },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  checked={form.payment === opt.value}
                  onChange={set('payment')}
                  className="accent-forest w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-charcoal group-hover:text-forest transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}
          </fieldset>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-full bg-forest text-cream font-semibold text-sm hover:bg-forest/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </form>

        {/* Order summary */}
        <aside className="w-full lg:w-80 lg:sticky lg:top-24 flex flex-col gap-4">
          <div className="rounded-2xl border border-forest/15 bg-cream p-5 flex flex-col gap-4 shadow-sm">
            <h2 className="font-heading font-semibold text-lg text-forest">
              Order summary
            </h2>

            <ul className="flex flex-col gap-3">
              {items.map((item) => {
                const p = getProduct(item.slug)
                if (!p) return null
                return (
                  <li key={item.slug} className="flex justify-between gap-2 text-sm">
                    <span className="text-charcoal/80 flex-1 min-w-0 leading-tight">
                      {p.name}
                      <span className="text-charcoal/50"> × {item.qty}</span>
                    </span>
                    <span className="font-semibold text-charcoal shrink-0 tabular-nums">
                      {fmt(p.price * item.qty)}
                    </span>
                  </li>
                )
              })}
            </ul>

            <div className="flex justify-between text-sm font-semibold text-charcoal border-t border-forest/10 pt-3">
              <span>Total</span>
              <span className="font-heading text-base">{fmt(subtotal)}</span>
            </div>

            <ImpactSummary
              plasticG={impact.plasticG}
              co2Kg={impact.co2Kg}
              avgScore={impact.avgScore}
            />

            <Link
              to="/cart"
              className="text-xs text-center text-charcoal/50 hover:text-forest underline underline-offset-2 transition-colors"
            >
              Edit cart
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

