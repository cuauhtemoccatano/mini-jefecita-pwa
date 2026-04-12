import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null, // Lo manejamos manual en app.js para v3.x
      manifest: false, // Usamos el manifest.json existente
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Evitar hashing para mantener compatibilidad con sw.js manual si fuera necesario, 
        // pero aquí configuramos Vite para que sea el motor.
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        // Forzamos nombres fijos para evitar romper el sw.js manual actual
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  }
});
