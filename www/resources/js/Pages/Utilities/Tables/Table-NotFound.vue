<template>
    <h2 
        class="font-normal font-boldened text-2xl text-center text-red-600 dark:text-red-600 leading-tight uppercase py-1"
        v-if="count === 0"
    >
        <span v-if="search" class="flex flex-col space-y-2 w-full">
            <span>NOT FOUND:</span>
            <span class="text-rose-500 dark:text-rose-500 underline font-sans text-xl">
                {{ search }}
            </span>
        </span>
        <span v-else class="text-red-500 dark:text-red-500">
            ADD {{ title.toUpperCase() }} TO GET STARTED!!
        </span>
    </h2>
</template>

<script setup>
defineProps({
    title: String,
    count: Number,
    search: String
});
</script>