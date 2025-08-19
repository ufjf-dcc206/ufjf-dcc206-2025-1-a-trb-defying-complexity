import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.NODE_ENV === 'production' ? '/ufjf-dcc206-2025-1-a-trb-defying-complexity/' : '/',

    build: {
        outDir: 'dist',
        sourcemap: true,
        minify: true,
    },
    server: {
        host: true,
        port: 3000,
    },
})
