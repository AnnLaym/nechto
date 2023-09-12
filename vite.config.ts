import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: '/nechto',
    build: {
        // generate manifest.json in outDir
        manifest: true,
        rollupOptions: {
            // overwrite default .html entry
            input: './src/main.ts',
        },
    },
    server: {
        origin: 'http://localhost:5173',
    },
});
