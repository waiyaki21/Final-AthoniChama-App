import { defineConfig, splitVendorChunkPlugin } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

import { name, version } from "../package.json";

// Function to capitalize the first letter of each word, including hyphen-separated words
function capitalizeFirstLetter(str) {
    return str
        .split(' ') // Split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(' '); // Join the words back into a single string
}

export default defineConfig({
    define: {
        'process.env.PACKAGE_NAME': JSON.stringify(capitalizeFirstLetter(name)),
        'process.env.PACKAGE_VERSION': JSON.stringify(version),
    },
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
                    if (id.includes('resources/js/Pages/Components/tabs')) {
                        // Group components in "components" chunk
                        return 'tabs';
                    }
                    if (id.includes('resources/js/Pages/Components/progress')) {
                        // Group components in "components" chunk
                        return 'progress';
                    }
                    if (id.includes('resources/js/Pages/Components/infopanel')) {
                        // Group components in "components" chunk
                        return 'infopanel';
                    }
                    if (id.includes('resources/js/Pages/Utilities')) {
                        // Group components in "components" chunk
                        return 'Utilities';
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
