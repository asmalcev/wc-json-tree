import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'index.js',
            name: 'json-tree',
            fileName: 'json-tree',
            formats: ['es'],
        },
    },
});
