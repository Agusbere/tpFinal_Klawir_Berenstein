import dotenv from 'dotenv'
import { query } from './db.js'

dotenv.config()

async function createTables() {
  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price NUMERIC(10,2) NOT NULL,
      currency TEXT DEFAULT 'ARS',
      category_id INTEGER REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      hashed_password TEXT
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id),
      user_id INTEGER REFERENCES users(id),
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS cart (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      total NUMERIC(10,2),
      created_at TIMESTAMP DEFAULT now()
    );
  `)
}

async function seedCategories() {
  const categories = ['Electrónica', 'Hogar', 'Moda', 'Deportes', 'Jardín', 'Belleza', 'Alimentos', 'Niños', 'Oficina', 'Automotriz']
  for (const name of categories) {
    await query('INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [name])
  }
}

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)] }

async function seedProducts(target = 520) {
  const brands = ['Orion', 'Lumen', 'Vega', 'Natura', 'CasaBella', 'FlexiFit', 'TerraCo', 'GreenField', 'UrbanWear', 'AutoPro']
  const adjectives = ['Compacto', 'Premium', 'Económico', 'Ultra', 'Portátil', 'Ergonómico', 'Duradero', 'Versátil', 'Ligero', 'Profesional']
  const nouns = ['Auriculares', 'Lámpara', 'Cafetera', 'Zapatillas', 'Mochila', 'Taladro', 'Cortacésped', 'Base de carga', 'Silla', 'Monitor']
  const descriptions = [
    'Diseñado para uso diario con materiales de alta calidad y eficiencia energética.',
    'Rendimiento superior y gran durabilidad, ideal para usuarios exigentes.',
    'Diseño moderno y compacto que se integra a cualquier espacio.',
    'Incluye garantía de 2 años y servicio técnico local.',
    'Fácil de usar, con controles intuitivos y componentes reciclables.'
  ]

  // map categories to ids
  const catRes = await query('SELECT id, name FROM categories')
  const cats = catRes.rows

  for (let i = 0; i < target; i++) {
    const brand = randomFrom(brands)
    const adj = randomFrom(adjectives)
    const noun = randomFrom(nouns)
    const name = `${brand} ${adj} ${noun} ${i + 1}`
    const description = randomFrom(descriptions)
    const price = (Math.random() * 490 + 10).toFixed(2) // between 10 and 500
    const category = randomFrom(cats)
    await query(
      `INSERT INTO products (name, description, price, currency, category_id) VALUES ($1,$2,$3,$4,$5)`,
      [name, description, price, 'ARS', category.id]
    )
  }
}

async function seedUsersAndReviews() {
  // create a couple sample users
  await query(`INSERT INTO users (email, name) VALUES ('ana@example.com','Ana Perez') ON CONFLICT DO NOTHING`)
  await query(`INSERT INTO users (email, name) VALUES ('juan@example.com','Juan Gomez') ON CONFLICT DO NOTHING`)
  const users = await query('SELECT id FROM users')
  const products = await query('SELECT id FROM products LIMIT 50')
  for (const p of products.rows) {
    const u = randomFrom(users.rows)
    const rating = Math.floor(Math.random() * 5) + 1
    await query('INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1,$2,$3,$4)', [p.id, u.id, rating, 'Buen producto, recomendado.'])
  }
}

async function main() {
  console.log('Creating tables...')
  await createTables()
  console.log('Seeding categories...')
  await seedCategories()
  console.log('Seeding products (this may take a minute)...')
  await seedProducts(520)
  console.log('Seeding users and reviews...')
  await seedUsersAndReviews()
  console.log('Seeding complete')
  process.exit(0)
}

main().catch((e) => {
  console.error('Seeding failed', e)
  process.exit(1)
})
