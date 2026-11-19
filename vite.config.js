import { statSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Serves the /api routes locally so `npm run dev` can submit the contact form.
// On Vercel the same files are deployed as Functions.
function localApiRoutes() {
  const routes = {
    '/api/contact': 'api/contact.js',
  }

  return {
    name: 'local-api-routes',
    configureServer(server) {
      // Vite only exposes VITE_* vars to the client. The handlers run in Node
      // and need the full set from .env.local (written by `vercel env pull`).
      const env = loadEnv(server.config.mode, server.config.root, '')
      for (const [key, value] of Object.entries(env)) {
        if (!(key in process.env)) process.env[key] = value
      }

      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url || '').split('?')[0]
        const entry = routes[pathname]
        if (!entry) return next()

        try {
          const file = resolve(server.config.root, entry)
          // Bust the module cache so edits to the handler apply immediately.
          const url = `${pathToFileURL(file).href}?v=${statSync(file).mtimeMs}`
          const { default: handler } = await import(url)
          await handler(req, res)
        } catch (error) {
          console.error(`[local-api] ${pathname} failed:`, error)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ error: 'Server error.' }))
          }
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localApiRoutes()],
  base: '/',
})
