import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
export default function useFetchProducts(query) {
  const [items, setItems] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const limit = 12

  const fetchPage = useCallback(async (reset = false) => {
    if (!query) return
    setLoading(true)
    setError(null)
    try {
      const currentOffset = reset ? 0 : offset
      const res = await axios.get('/api/products', {
        params: { q: query, limit, offset: currentOffset }
      })
      const newItems = res.data || []
      setItems((prev) => (reset ? newItems : [...prev, ...newItems]))
      setOffset(currentOffset + newItems.length)
      setHasMore(newItems.length === limit)
    } catch (e) {
      console.error('Products fetch error', e?.response || e.message || e)
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [query, offset])

  useEffect(() => {
    setItems([])
    setOffset(0)
    setHasMore(false)
    if (query) fetchPage(true)
  }, [query, fetchPage])

  const loadMore = useCallback(() => {
    if (hasMore && !loading) fetchPage(false)
  }, [hasMore, loading, fetchPage])

  const data = useMemo(() => items, [items])

  return { data, loading, error, hasMore, loadMore }
}


