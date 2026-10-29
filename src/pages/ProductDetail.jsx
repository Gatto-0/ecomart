import { useParams } from 'react-router-dom'
import { products } from '../data/products'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-charcoal/70">Product not found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-forest">
        {product.name}
      </h1>
    </div>
  )
}

