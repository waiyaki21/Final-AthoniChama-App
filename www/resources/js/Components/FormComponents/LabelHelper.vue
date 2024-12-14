<script setup>
defineProps({
    value: {
        type: String,
    },
});
</script>

<template>
    <label class="block text-xs font-normal text-orange-900 dark:text-orange-400 underline uppercase mt-2">
        <span v-if="value">{{ value }}</span>
        <span v-else><slot /></span>
    </label>
</template>
