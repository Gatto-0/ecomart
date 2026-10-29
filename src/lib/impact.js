// src/lib/impact.js
// Derives eco-impact totals from a cart items array.
// Each item: { slug, qty }
// Uses product.impact.plasticG, product.impact.co2Kg, and product.total.

import { getProduct } from '../data/products'

/**
 * cartImpact(items) → { plasticG, co2Kg, avgScore }
 * - plasticG  : total grams of single-use plastic avoided (sum of impact.plasticG × qty)
 * - co2Kg     : total kg of CO₂-equivalent avoided (sum of impact.co2Kg × qty)
 * - avgScore  : quantity-weighted average of product.total, one decimal (0 when cart empty)
 */
export function cartImpact(items) {
  let plasticG = 0
  let co2Kg = 0
  let weightedScore = 0
  let totalQty = 0

  for (const item of items) {
    const product = getProduct(item.slug)
    if (!product) continue
    const qty = item.qty ?? 1
    plasticG += (product.impact?.plasticG ?? 0) * qty
    co2Kg += (product.impact?.co2Kg ?? 0) * qty
    weightedScore += product.total * qty
    totalQty += qty
  }

  const avgScore = totalQty > 0 ? Math.round((weightedScore / totalQty) * 10) / 10 : 0
  const roundedCo2 = Math.round(co2Kg * 100) / 100

  return { plasticG, co2Kg: roundedCo2, avgScore }
}

