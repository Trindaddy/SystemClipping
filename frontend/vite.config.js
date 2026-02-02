import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // <--- O SEGREDO: Libera acesso externo (Docker -> Windows)
    port: 5173,
    watch: {
      usePolling: true, // Força o Windows a detectar mudanças de arquivo
    }
  }
})