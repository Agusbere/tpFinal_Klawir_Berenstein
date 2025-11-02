import express from 'express'
import { query } from '../db.js'

const router = express.Router()

router.get('/', async function (req, res) {
  const q = (req.query.q || '').trim()
  const limit = Math.min(parseInt(req.query.limit, 10) || 12, 100)
  const offset = parseInt(req.query.offset, 10) || 0
  try {
    let rows
    if (q) {
      const like = '%' + q.replace(/%/g, '') + '%'
          const text = 'SELECT p.id, p.name, p.price, p.currency, p.description, c.name AS category FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.name ILIKE $1 OR p.description ILIKE $1 OR c.name ILIKE $1 ORDER BY p.id LIMIT $2 OFFSET $3'
      const result = await query(text, [like, limit, offset])
      rows = result.rows
    } else {
          const text = 'SELECT p.id, p.name, p.price, p.currency, p.description, c.name AS category FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.id LIMIT $1 OFFSET $2'
      const result = await query(text, [limit, offset])
      rows = result.rows
    }
    res.json(rows)
  } catch {
    res.status(500).json({ error: 'Database error' })
  }
})

router.get('/:id', async function (req, res) {
  const id = req.params.id
  try {
      const text = 'SELECT p.id, p.name, p.description, p.price, p.currency, c.name AS category FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1'
    const result = await query(text, [id])
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch {
    res.status(500).json({ error: 'Database error' })
  }
})

export default router
