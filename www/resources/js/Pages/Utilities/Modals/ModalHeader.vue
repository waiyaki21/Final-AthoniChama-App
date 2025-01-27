<!-- ModalHeader.vue -->
<template>
    <div class="w-full inline-flex justify-between mb-1 p-2">
        <!-- Header Text Passed as a Prop -->
        <h2 class="font-boldened sm:text-sm md:text-xl text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1 w-full">
            {{ headerText }}
        </h2>

        <!-- Close Button -->
        <button @click="closeModal" :class="[classInfo.modalCloseBtn]">
            <times-icon class="w-6 h-6"></times-icon>
        </button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    headerText: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['close'])

const classInfo = {
    modalCloseBtn: 'cursor-pointer dark:text-cyan-400 text-cyan-500 transition-transform hover:rotate-180 w-6 h-6 hover:w-6 hover:h-6',
};

const closeModal = () => {
    emit('close'); // Emit event to parent to handle modal close
};
</script>