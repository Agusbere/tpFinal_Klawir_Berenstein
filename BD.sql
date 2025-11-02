-- DROP existing tables to reset schema
DROP TABLE IF EXISTS reviews, cart, orders, products, companies, categories CASCADE;

-- Create schema
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  website TEXT,
  contact_email TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'ARS',
  category_id INTEGER REFERENCES categories(id),
  company_id INTEGER REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  reviewer_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  session_id TEXT,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  session_id TEXT,
  total NUMERIC(10,2),
  created_at TIMESTAMP DEFAULT now()
);

-- Seed categories
INSERT INTO categories (id, name) VALUES
  (1, 'Electrónica'), (2, 'Hogar'), (3, 'Moda'), (4, 'Deportes'),
  (5, 'Jardín'), (6, 'Belleza'), (7, 'Alimentos'), (8, 'Niños'),
  (9, 'Oficina'), (10, 'Automotriz'), (11, 'Herramientas'),
  (12, 'Audio'), (13, 'Video')
ON CONFLICT DO NOTHING;

-- Seed companies
INSERT INTO companies (name, website, contact_email) VALUES
  ('Orion', 'https://orion.example', 'info@orion.example'),
  ('Lumen', 'https://lumen.example', 'contact@lumen.example'),
  ('Vega', 'https://vega.example', 'ventas@vega.example'),
  ('Natura', 'https://natura.example', 'hola@natura.example'),
  ('CasaBella', 'https://casabella.example', 'soporte@casabella.example'),
  ('FlexiFit', 'https://flexifit.example', 'help@flexifit.example'),
  ('TerraCo', 'https://terraco.example', 'info@terraco.example'),
  ('GreenField', 'https://greenfield.example', 'ventas@greenfield.example'),
  ('UrbanWear', 'https://urbanwear.example', 'shop@urbanwear.example'),
  ('AutoPro', 'https://autopro.example', 'info@autopro.example'),
  ('MaxHome', 'https://maxhome.example', 'info@maxhome.example'),
  ('Soundix', 'https://soundix.example', 'contact@soundix.example')
ON CONFLICT DO NOTHING;

-- Build distinct product name combos and insert first 500 unique pairs
WITH const AS (
  SELECT
    ARRAY[
      'Auriculares','Lámpara','Cafetera','Zapatillas','Mochila','Taladro','Cortacésped','Base de carga','Silla','Monitor',
      'Teclado','Bicicleta','Mixer','Parlante','Taza','Sensor','Luces','Router','Heladera','Microondas',
      'Espejo','Colchón','Almohada','Plancha','Reloj'
    ]::text[] AS nouns,
    ARRAY[
      'Urbano','Montaña','Infantil','Profesional','Compacto','Eléctrico','Manual','Premium','Ligero','Económico',
      'Deportivo','Híbrido','Plegable','Táctico','Ergonómico','Silencioso','Rústico','Moderno','Vintage','Térmico',
      'Inteligente','Portátil','Resistente','Estético','Oficial'
    ]::text[] AS variants,
    ARRAY[
      'Diseñado para uso diario con materiales de alta calidad y eficiencia energética.',
      'Rendimiento superior y gran durabilidad, ideal para usuarios exigentes.',
      'Diseño moderno y compacto que se integra a cualquier espacio.',
      'Incluye garantía y soporte técnico en la región.',
      'Fácil de usar, con controles intuitivos y materiales reciclables.',
      'Edición limitada con mejoras en la batería y rendimiento.',
      'Construido pensando en ergonomía y confort para uso prolongado.'
    ]::text[] AS descs
),
raw_combos AS (
  SELECT row_number() OVER () AS rn, n AS noun, v AS variant
  FROM const, unnest(const.nouns) AS n, unnest(const.variants) AS v
),
combos AS (
  SELECT rc.rn, rc.noun, rc.variant, const.descs[((rc.rn-1) % array_length(const.descs,1)) + 1] AS description
  FROM raw_combos rc, const
)
INSERT INTO products (name, description, price, currency, category_id, company_id)
SELECT
  (c.noun || ' ' || c.variant) AS name,
  c.description AS description,
  (10 + random() * 990)::numeric(10,2) AS price,
  'ARS' AS currency,
  ((c.rn-1) % 13) + 1 AS category_id,
  (((c.rn-1) % 12) + 1) AS company_id
FROM combos c
WHERE c.rn <= 500
ORDER BY c.rn;

-- Seed reviews (variable number per product)
INSERT INTO reviews (product_id, reviewer_name, rating, comment, created_at)
SELECT
  p.id,
  (array['Luis','María','Carlos','Ana','Sofía','Diego','Lucía','Pablo','Martina','Javier'])[((p.id + r.n) % 10) + 1],
  (floor(random() * 5) + 1)::int,
  (array[
    'Muy buen producto, funciona como esperaba.',
    'La calidad es buena pero esperaba mejor durabilidad.',
    'Excelente relación precio-calidad, muy recomendable.',
    'No cumple con lo prometido, devolví el producto.',
    'Me gustó el diseño, pero la batería dura poco.',
    'Buen servicio y envío rápido, contento con la compra.',
    'Producto aceptable para el precio.',
    'Lo uso a diario y no tuve problemas hasta ahora.',
    'La descripción no coincidía del todo con el producto.',
    'Buen soporte postventa, me ayudaron con una falla.'
  ])[((p.id + r.n) % 10) + 1],
  now() - (((p.id % 365)::text || ' days')::interval)
FROM products p
CROSS JOIN LATERAL (SELECT generate_series(1,5) AS n) r
WHERE random() < 0.5;