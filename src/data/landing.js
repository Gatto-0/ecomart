import { categories as productCategories } from './products'

export const marqueePhrases = [
  'Plastic-free packaging',
  'Non-toxic ingredients',
  'Recycled materials',
  'Sustainably sourced',
  'Organic and natural',
  'Ethically made',
  'Chat with Eco Buddy',
]

export const typewriterPhrases = [
  'Retail therapy, minus the guilt.',
  'Your cart has a carbon footprint.',
  'Buy better. Waste less.',
]

export const categories = productCategories.slice(0, 6).map((category) => ({
  title: category.name,
  slug: category.slug,
  image: category.image,
  imageAlt: category.imageAlt,
}))

export default {
  marqueePhrases,
  typewriterPhrases,
  categories,
}
