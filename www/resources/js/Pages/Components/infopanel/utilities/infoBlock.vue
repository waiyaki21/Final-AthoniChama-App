<template>
    <a :class="`block ${width} p-2 bg-transparent`">
        <h5 :class="[info.infoHeader]" :title="title">
            <span>{{ label }}</span>
            <info-icon class="flex-shrink-0 inline w-3 h-3 ml-1"></info-icon>
        </h5>
        <p :class="`font-normal text-left md:text-3xl text-xl uppercase ${colorClass}`">
            {{ value }} {{ suffix }}
        </p>
    </a>
</template>

<script setup>
    import { defineProps, reactive } from 'vue';

    const props = defineProps({
        title: String,
        label: String,
        value: [String, Number],
        suffix: String,
        width: String,
        colorClass: String
    });

    const info = reactive({
        infoHeader: 'text-cyan-900 dark:text-cyan-300 mb-2 md:text-xl sm:text-md md:text-left sm:text-left font-normal underline tracking-tight uppercase',
    })
</script>
