<template>
    <nav class="flex uppercase font-boldened mt-8" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li class="inline-flex items-center">
                <a @click="getRoute('/dashboard')" class="inline-flex items-center md:text-base text-xs font-normal text-cyan-700 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-400">
                    <svg class="md:w-4 md:h-4 w-2 h-2 md:me-2.5 me-1 text-cyan-700 dark:text-cyan-300"
                        aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    <span class="hover:underline hover:underline-offset-2">Home</span>
                </a>
            </li>
        </ol>
    </nav>
</template>

<script setup>
    import { router } from '@inertiajs/vue3';
    function getRoute(a) {
        router.get(a)
    }
</script>