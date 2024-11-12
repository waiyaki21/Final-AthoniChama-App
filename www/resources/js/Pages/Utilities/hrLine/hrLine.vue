<template>
    <hr :class="[`w-[95%] my-1 mx-auto border-t-4 md:border-t-4 rounded-full shadow-md`, color]">
</template>

<script setup>
    import { defineProps } from 'vue';

    const props = defineProps({
        color: String
    });
</script>