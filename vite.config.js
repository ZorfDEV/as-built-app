import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),svgr()],
  server: {
     host: '0.0.0.0', // Écouter sur toutes les interfaces réseau  
    port: 5173, // Port de l'application
    proxy: {
      '/api': {
        target: 'http://10.188.44.43:5000',
       //target: 'http://192.168.1.106:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
