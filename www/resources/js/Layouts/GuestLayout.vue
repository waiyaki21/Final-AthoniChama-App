<script setup>
    import ApplicationLogo from '@/Components/ApplicationLogo.vue';
    import { Link } from '@inertiajs/vue3';

    import { defineOptions, h } from "vue";

    defineProps({
        data: Array
    })
</script>

<template>
    <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
        <!-- <div>
            <Link href="/">
                <ApplicationLogo class="w-20 h-20 fill-current text-gray-500" />
            </Link>
        </div> -->

        <div class="w-full sm:max-w-md my-6 px-4 py-2 bg-white border border-gray-600 dark:border-gray-500 shadow-md overflow-hidden sm:rounded-lg">
            <slot />
        </div>
    </div>
</template>
