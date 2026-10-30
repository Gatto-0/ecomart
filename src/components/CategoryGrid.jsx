import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/landing'

function CategoryCardImage({ src, alt }) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div
        className="w-full h-full bg-[#E4EBDD] flex flex-col items-center justify-center p-4 transition-transform duration-500 ease-out group-hover:scale-105"
        aria-label={alt}
      >
        <svg
          className="w-10 h-10 sm:w-12 sm:h-12 text-leaf/40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
    />
  )
}

export default function CategoryGrid() {
  return (
    <section className="py-20 sm:py-28 px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col items-start mb-8 sm:mb-12">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-forest tracking-tight">
          Find your swap
        </h2>
        <div className="w-12 h-[3px] bg-marigold mt-3 rounded-full" aria-hidden="true" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((category, index) => {
          const isLarge = index < 2

          return (
            <Link
              key={category.slug}
              to={`/shop?category=${category.slug}`}
              className={`group relative overflow-hidden rounded-2xl rounded-l-none border-l-4 border-l-walnut block bg-[#E4EBDD] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${
                isLarge
                  ? 'col-span-1 lg:col-span-2 h-56 sm:h-72 lg:h-80'
                  : 'col-span-1 lg:col-span-1 h-48 sm:h-60 lg:h-64'
              }`}
            >
              {/* Photo with fallback */}
              <CategoryCardImage
                src={category.image}
                alt={category.imageAlt || `${category.title} category`}
              />

              {/* Dark gradient overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[rgba(47,74,53,0.75)] to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Title at bottom */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 z-10">
                <h3 className="font-heading font-semibold text-cream text-base sm:text-lg lg:text-xl group-hover:text-leaf transition-colors leading-tight">
                  {category.title}
                </h3>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

