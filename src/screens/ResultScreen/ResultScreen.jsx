import './ResultScreen.css'
import { useChatContext } from '../../context/ChatContext'
import useFetchProducts from '../../hooks/useFetchProducts.jsx'
import ProductCard from '../../components/ProductCard/ProductCard'
import Loader from '../../components/Loader/Loader'
import LoadMore from './LoadMore'

export default function ResultScreen() {
  const { finalAnalysis, messages } = useChatContext()
  const firstUser = messages.find((m) => m.role === 'user')
  const query = firstUser ? firstUser.content.replace(/^Quiero comprar\s*/i, '') : 'producto'
  const { data, loading, error, hasMore, loadMore } = useFetchProducts(query)

  return (
    <div className="result">
      <section className="result__summary">
        <h2>Veredicto</h2>
        <p className={`badge badge--${(finalAnalysis?.verdict || 'Posponer').toLowerCase()}`}>
          {finalAnalysis?.verdict || 'Posponer'}
        </p>
        <p>{finalAnalysis?.summary || 'Aún sin suficiente información; analizá opciones más económicas.'}</p>
      </section>

      <section className="result__alternatives">
        <h3>Resultados de Square Catalog API</h3>
        {loading && <Loader />}
        {error && <p className="error">Error al cargar productos.</p>}
        <div className="result__grid">
          {data.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {!loading && data.length === 0 && (
          <p>No se encontraron productos para tu búsqueda.</p>
        )}
        {!loading && data.length > 0 && (
          <LoadMore onClick={loadMore} disabled={!hasMore} />
        )}
      </section>
    </div>
  )
}


