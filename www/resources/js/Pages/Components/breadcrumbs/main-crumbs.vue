<template>
    <!-- Breadcrumb -->
    <nav class="flex mt-1 pt-1 uppercase boldened" aria-label="Breadcrumb">
        <ol class="inline-flex items-center gap-1 md:gap-3">
            <li class="inline-flex items-center">
                <button @click="getRoute('/')" class="inline-flex items-center text-xs md:text-sm font-normal text-gray-700 hover:text-blue-600 dark:text-white dark:hover:text-blue-300 hover:underline">
                    <home-icon aria-hidden="true" class="w-3.5 h-3.5 md:w-4 md:h-4 mb-1 mr-1 md:mr-2"></home-icon>
                    <span class="hidden md:flex">Homepage</span>
                </button>
            </li>
            <li v-for="(item, index) in allItems" :key="index" aria-current="page">
                <div class="inline-flex items-center justify-between gap-0.5 md:gap-1">
                    <right-icon class="w-4 h-4 text-gray-900 dark:text-gray-100"></right-icon>
                    <button @click="getRoute(item.url)" :class="item.active ? classInfo.activeClass : classInfo.inactiveClass">
                        {{ item.label }}
                    </button>
                </div>
            </li>
        </ol>
    </nav>
</template>

<script setup>
    import { reactive ,defineProps, computed } from 'vue';
    import { router } from '@inertiajs/vue3';

    const props = defineProps({
        items : {
            type: Array,
            required: true
        }
    })

    const classInfo = reactive ({
        data: [],
        activeClass               : 'ml-1 text-xs md:text-sm font-normal text-emerald-700 hover:text-emerald-600 md:ml-2 dark:text-emerald-300 dark:hover:text-emerald-400 bg-green-200 px-3 md:px-2 py-[1px] md:py-0.5 rounded-full dark:bg-green-900 border-1.5 border-emerald-900 dark:border-emerald-200',
        inactiveClass             : 'ml-1 text-xs md:text-sm font-normal text-gray-700 hover:text-blue-600 md:ml-2 dark:text-white dark:hover:text-blue-300 hover:bg-cyan-200 px-3 md:px-2 py-[1px] md:py-0.5 rounded-full dark:hover:bg-cyan-900 hover:border-1.5 hover:border-cyan-900 dark:hover:border-cyan-200',
    })

    // computed 
    const allItems = computed(() => {
        if (!props.items) return [];

        let tempItems = props.items

        return tempItems;
    })

    function getRoute(a) {
        router.get(a)
    }
</script>