import { useRef } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null)

  return (
    <div className="relative w-full">
      {/* Search icon inside on the left */}
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none">
        <Search size={18} aria-hidden="true" />
      </span>

      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products, for example plastic-free shampoo"
        aria-label="Search products"
        className="w-full h-12 pl-11 pr-10 rounded-2xl border border-forest/15 bg-white text-charcoal placeholder:text-charcoal/40 text-sm font-sans shadow-xs focus:outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20 transition-all"
      />

      {/* Clear button when there is text */}
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('')
            inputRef.current?.focus()
          }}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors cursor-pointer"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

