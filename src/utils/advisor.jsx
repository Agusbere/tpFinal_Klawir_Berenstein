export function evaluatePurchase({ needLevel, hasAlternative, budgetFit, price, usageFrequency }) {
  let score = 0
  if (needLevel === 'alta') score += 2
  if (needLevel === 'media') score += 1
  if (!hasAlternative) score += 1
  if (budgetFit === 'si') score += 2
  if (budgetFit === 'parcial') score += 1
  if (usageFrequency === 'alta') score += 2
  if (usageFrequency === 'media') score += 1

  const verdict = score >= 6 ? 'Comprar' : 'Posponer'
  const summary = verdict === 'Comprar'
    ? 'Tus respuestas indican que puede ser una compra razonable.'
    : 'Tus respuestas sugieren esperar o buscar alternativas más económicas.'
  return { verdict, summary, score }
}

export function formatPriceARS(value) {
  if (typeof value !== 'number') return ''
  return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
}


