import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productsRouter from './routes/products.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', function (req, res) { res.json({ ok: true }) })

app.use('/api/products', productsRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, function () { console.log('Server listening on port', PORT) })
