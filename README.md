AntiShopper — instrucciones para ejecutar con Supabase/Postgres y Ollama
===============================================================

Resumen
-------
Esta versión reemplaza toda la integración con Square por un backend propio
que ejecuta consultas SQL directamente contra una base Postgres (puede ser
una base Supabase). El frontend (React + Vite) usa Axios para pedir datos a
este backend. No se usa el cliente oficial de Supabase.

Requisitos
----------
- Node.js 18+ y npm
- Una instancia Postgres local o Supabase (con credenciales)
- Ollama instalado y corriendo en http://localhost:11434 (opcional para IA)

Pasos rápidos
-------------
1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables en `.env` (archivo ya provisto, completá valores):

- DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT
- OLLAMA_API_KEY (si usás Ollama con autenticación) y OLLAMA_URL

3. Ejecutar el seed para crear tablas y cargar productos (520 productos):

```bash
node server/seed.js
```

4. Correr la app (arranca backend y frontend juntos):

```bash
npm run dev
```

Esto inicia el servidor en http://localhost:3000 y Vite en su puerto por defecto.

Detalles técnicos
-----------------
- Nuevo backend: `server/index.js` (Express)
- Conexión DB: `server/db.js` usa `pg` y variables desde `.env`
- Rutas de productos: `server/routes/products.js` (consultas SQL directas)
- Script de seed: `server/seed.js` crea tablas y genera 520 productos realistas

Front-end cambios
-----------------
- El hook `src/hooks/useFetchProducts.jsx` ahora llama a `/api/products`.
 - `src/components/ProductCard/ProductCard.jsx` se actualizó para el nuevo
 	esquema de producto (name, price, description). Note: imágenes fueron removidas del esquema y endpoints para evitar problemas de CORS.
- Se removió la integración con Square.

Ollama
------
AntiShopper consuma Ollama en `src/utils/llm.jsx` (si existe) usando `OLLAMA_URL`.
Instalá y ejecutá Ollama localmente según su documentación: https://ollama.com/

Notas finales
------------
- Si preferís, podés correr el backend y frontend en terminales separadas:
	- `npm run start:server` y luego `npm run dev` en otro terminal (o `npm run dev` si tenés `concurrently`).
- Los archivos originales de Square fueron eliminados/reemplazados.

