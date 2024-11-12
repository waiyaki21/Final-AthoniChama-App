<template>
    <nav class="flex uppercase font-boldened mt-8" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li class="inline-flex items-center">
                <Link @click="getRoute('/dashboard')"
                    class="inline-flex items-center md:text-2xl sm:text-base font-medium text-cyan-700 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-400">
                    <svg class="md:w-5 md:h-5 sm:w-3 sm:h-3 md:me-2.5 sm:me-1 text-cyan-700 dark:text-cyan-300" aria-hidden="true" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                            d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    <span class="hover:underline hover:underline-offset-2">Home</span>
                </Link>
            </li>
            <li aria-current="page">
                <div class="flex items-center">
                    <svg class="rtl:rotate-180 w-3 h-3 text-cyan-700 dark:text-cyan-300 mx-1" aria-hidden="true" fill="none"
                        viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 9 4-4-4-4" />
                    </svg>
                    <Link @click="getRoute('/welfares')"
                        class="ms-1 md:text-2xl sm:text-base font-medium text-cyan-700 hover:text-cyan-600 md:ms-2 dark:text-cyan-300 dark:hover:text-cyan-400 cursor-pointer">
                        <span class="hover:underline hover:underline-offset-2">Welfares</span>
                    </Link>
                </div>
            </li>
        </ol>
    </nav>
</template>

<script setup>
    import { router } from '@inertiajs/vue3';
    import { defineProps } from "vue";

    const props = defineProps({
        cycle: {
            type: Object,
            required: true
        }
    })

    function getRoute(a) {
        router.get(a)
    }
</script>