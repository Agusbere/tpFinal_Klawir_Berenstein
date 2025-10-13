import './ProductCard.css'

export default function ProductCard({ product }) {
  const item = product?.item_data || {}
  const name = item.name || 'Item'
  const imageUrl = (item.image_url || product?.image_url) || ''
  const variation = item.variations?.[0]?.item_variation_data
  const money = variation?.price_money
  const price = money ? (money.amount / 100).toLocaleString('es-AR', { style: 'currency', currency: money.currency || 'ARS' }) : ''
  const permalink = product?.present_at_all_locations ? undefined : undefined

  return (
    <article className="product">
      <img src={imageUrl} alt={name} />
      <div className="product__body">
        <h4 title={name}>{name}</h4>
        <p className="price">{price}</p>
        <span className="source">Square Catalog API</span>
      </div>
    </article>
  )
}


