import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/rede_social/',
  build: { outDir: 'dist', sourcemap: false },
});
