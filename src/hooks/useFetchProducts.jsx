import { useCallback, useEffect, useMemo, useState } from 'react'
import { searchCatalogItems } from '../utils/squareClient'

export default function useFetchProducts(query) {
  const [items, setItems] = useState([])
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPage = useCallback(async (reset = false) => {
    if (!query) return
    setLoading(true)
    setError(null)
    try {
      const data = await searchCatalogItems({ query, cursor: reset ? null : cursor, limit: 12 })
      const newItems = data?.items || []
      setItems((prev) => (reset ? newItems : [...prev, ...newItems]))
      setCursor(data?.cursor || null)
      setHasMore(Boolean(data?.cursor))
    } catch (e) {
      if (e.response) {
        // Helpful diagnostics for Square errors
        console.error('Square error', e.response.status, e.response.data)
      }
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [query, cursor])

  useEffect(() => {
    setItems([])
    setCursor(null)
    setHasMore(false)
    if (query) fetchPage(true)
  }, [query])

  const loadMore = useCallback(() => {
    if (hasMore && !loading) fetchPage(false)
  }, [hasMore, loading, fetchPage])

  const data = useMemo(() => items, [items])

  return { data, loading, error, hasMore, loadMore }
}


