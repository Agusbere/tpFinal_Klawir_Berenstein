import './ProductCard.css'

export default function ProductCard({ product }) {
  const name = product?.name || 'Producto'
  const price = typeof product?.price === 'number'
    ? product.price.toLocaleString('es-AR', { style: 'currency', currency: product.currency || 'ARS' })
    : ''
  const description = product?.description || ''

  return (
    <article className="product">
      {/* images removed to avoid CORS issues */}
      <div className="product__body">
        <h4 title={name}>{name}</h4>
        <p className="price">{price}</p>
        <p className="desc">{description}</p>
        <span className="source">AntiShopper Catalog</span>
      </div>
    </article>
  )
}


