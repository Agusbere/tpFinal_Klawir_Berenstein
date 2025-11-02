import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'antishopper'
}

if ((process.env.DB_SSL || '').toLowerCase() === 'true' || (process.env.DB_HOST || '').includes('supabase.co')) {
  poolConfig.ssl = { rejectUnauthorized: false }
}

const pool = new Pool(poolConfig)

export async function query(text, params) {
  return pool.query(text, params)
}

export default pool
