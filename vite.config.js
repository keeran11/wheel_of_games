import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'wheel-of-gifts-route',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/wheelofgift-game' || req.url.startsWith('/wheelofgift-game/')) {
            req.url = '/wheelofnames-game/';
          }
          next();
        });
      },
    },
  ],
  base: '/wheelofnames-game/',
})
