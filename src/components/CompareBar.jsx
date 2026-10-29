import { useLocation, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { useCompare } from '../context/CompareContext'
import { getProduct } from '../data/products'

export default function CompareBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { slugs, remove, clear } = useCompare()

  const allowedPaths =
    location.pathname === '/' ||
    location.pathname === '/shop' ||
    location.pathname.startsWith('/product/') ||
    location.pathname === '/wishlist'

  const hiddenPaths =
    location.pathname === '/compare' ||
    location.pathname === '/cart' ||
    location.pathname === '/checkout'

  const isVisible = allowedPaths && !hiddenPaths && slugs.length > 0

  if (!isVisible) return null

  const isReady = slugs.length === 2

  const handleCompare = () => {
    if (isReady) {
      navigate(`/compare?a=${slugs[0]}&b=${slugs[1]}`)
    }
  }

  return (
    <>
      {/* Spacer to provide bottom padding to the page so footer/content is not covered */}
      <div aria-hidden="true" className="h-24 w-full shrink-0 pointer-events-none" />

      {/* Floating comparison bar above all other fixed elements */}
      <aside
        aria-label="Product comparison bar"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-[92vw] sm:w-auto bg-forest text-cream rounded-2xl sm:rounded-full px-4 sm:px-6 py-3 shadow-2xl border border-cream/15 flex items-center justify-between sm:justify-start gap-3 sm:gap-4 flex-wrap sm:flex-nowrap"
      >
        {/* Product chips */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {slugs.map((slug) => {
            const product = getProduct(slug)
            const name = product?.name ?? slug
            return (
              <div
                key={slug}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream/15 text-cream text-xs font-medium border border-cream/10"
              >
                <span className="truncate max-w-[120px] sm:max-w-[160px]">{name}</span>
                <button
                  type="button"
                  onClick={() => remove(slug)}
                  aria-label={`Remove ${name} from compare`}
                  className="hover:text-leaf transition-colors p-0.5 cursor-pointer rounded-full btn-minor"
                >
                  <X size={13} aria-hidden="true" />
                </button>
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-3 ml-auto shrink-0">
          <button
            type="button"
            onClick={clear}
            className="text-xs text-cream/70 hover:text-cream underline underline-offset-2 transition-colors cursor-pointer btn-minor px-2 py-1 rounded-full"
          >
            Clear
          </button>

          <button
            type="button"
            disabled={!isReady}
            onClick={handleCompare}
            className="px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer disabled:cursor-not-allowed disabled:bg-cream/20 disabled:text-cream/50 bg-leaf text-cream hover:bg-leaf/90 shadow-xs btn-major"
          >
            Compare
          </button>
        </div>
      </aside>
    </>
  )
}
