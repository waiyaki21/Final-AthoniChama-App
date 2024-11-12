import { defineConfig, splitVendorChunkPlugin } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel({
            
            input: [
                'resources/css/app.css', 
                'resources/js/app.js',
                'resources/js/Pages/Cycles.vue',
                'resources/js/Pages/Dashboard.vue',
                'resources/js/Pages/Expenses.vue',
                'resources/js/Pages/Ledgers.vue',
                'resources/js/Pages/Members.vue',
                'resources/js/Pages/Member.vue',
                'resources/js/Pages/Payments.vue',
                'resources/js/Pages/Profile.vue',
                'resources/js/Pages/Projects.vue',
                'resources/js/Pages/Settings.vue',
                'resources/js/Pages/Auth/Login.vue',
                'resources/js/Pages/Auth/Register.vue'
            ],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        splitVendorChunkPlugin(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // Group all dependencies from node_modules into "vendor" chunk
                        return 'vendor';
                    }
                    if (id.includes('resources/js/Pages/')) {
                        // Group components in "components" chunk
                        return 'pages';
                    }
                    if (id.includes('resources/js/Pages/Components/tables')) {
                        // Group components in "components" chunk
                        return 'tables';
                    }
                    if (id.includes('resources/js/Pages/Components/Profile')) {
                        // Group components in "components" chunk
                        return 'profile';
                    }
                    if (id.includes('resources/js/Pages/Components/forms') || id.includes('resources/js/Pages/Components/modal-forms') || id.includes('resources/js/Pages/Components/modals')) {
                        // Group components in "components" chunk
                        return 'forms';
                    }
                }
            }
        }
    },
    resolve: {
        alias: {
            '@components': '/resources/js/Pages/Components',
            '@layouts': '/resources/js/Pages/Layouts',
            '@pages': '/resources/js/Pages'
        },
    },
});
