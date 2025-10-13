import axios from 'axios'

const ACCESS_TOKEN = import.meta.env.VITE_SQUARE_ACCESS_TOKEN || ''
const SQUARE_VERSION = import.meta.env.VITE_SQUARE_VERSION || '2023-09-25'

export const squareClient = axios.create({
  baseURL: '/api/square',
  headers: {
    'Content-Type': 'application/json',
    'Square-Version': SQUARE_VERSION,
    'Accept': 'application/json',
  },
})

export async function searchCatalogItems({ query, cursor, limit = 12 }) {
  const body = {
    text_filter: query || '',
    product_types: ['REGULAR'],
    limit,
    cursor,
  }
  const { data } = await squareClient.post('/v2/catalog/search-catalog-items', body, {
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
    }
  })
  return data
}


