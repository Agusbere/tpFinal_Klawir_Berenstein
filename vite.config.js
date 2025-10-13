import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const SQUARE_TOKEN = env.VITE_SQUARE_ACCESS_TOKEN || ''
  const SQUARE_VERSION = env.VITE_SQUARE_VERSION || '2024-09-19'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/square': {
          target: 'https://connect.squareupsandbox.com',
          changeOrigin: true,
          secure: false,
          headers: {
            Authorization: `Bearer ${SQUARE_TOKEN}`,
            'Square-Version': SQUARE_VERSION,
          },
          rewrite: (path) => path.replace(/^\/api\/square/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // Strip browser-originated headers that Square rejects
              proxyReq.removeHeader && proxyReq.removeHeader('origin')
              proxyReq.removeHeader && proxyReq.removeHeader('referer')
            })
          },
        }
      }
    }
  }
})
