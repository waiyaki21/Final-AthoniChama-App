<template>
    <section class="w-full flex flex-col justify-start">

        <span class="text-2xs text-gray-500 w-full uppercase">Search ( {{ props.new }} / {{ props.total }} ) {{ name }}</span>

        <h3 class="font-boldened md:text-md sm:text-md text-gray-800 dark:text-gray-300 leading-tight uppercase p-2 w-full inline-flex justify-between gap-1 whitespace-nowrap sticky">
            <div class="relative w-full inline-flex justify-start gap-1">
                <div class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    <search-icon class="w-4 h-4 m-1 text-gray-500 dark:text-gray-400" v-if="!classInfo.isKeyPressed"></search-icon>
                    <loader-icon class="w-4 h-4 animate-spin text-gray-200/0 dark:text-gray-200/0 fill-gray-900 dark:fill-gray-50" v-else></loader-icon>
                </div>
                <input type="text" v-model="classInfo.search" autocomplete="off"
                    class="w-full block p-2 pl-9 text-sm text-gray-900 border border-gray-300 rounded-lg  bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-10 shadow-md my-auto placeholder:uppercase  placeholder:boldened"
                    :placeholder="`SEARCH ${name}`" @keydown="handleKeydown" @keyup="handleKeyup">
            </div>
        </h3>
    </section>
</template>

<script setup>
    import { defineProps, computed, reactive, watch, defineEmits } from 'vue';

    const props = defineProps({
        total: {
            type: String,
            required: true,
        },
        new: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        }
    })

    watch(props.new, (newInfo) => {
        setNo();
    })

    const emit = defineEmits(['search'])

    const classInfo = reactive({
        no: '',
        search : '',
        isKeyPressed    : false,
    })

    const newSearch = computed(() => {
        let set = classInfo.search;
        emit('search', set);
        return set;
    })

    function setNo() {
        // classInfo.no = classInfo.$props.new;
    }

    function loadNo(x) {
        classInfo.no = x;
    }

    function handleKeydown(event) {
        if (!classInfo.isKeyPressed) {
            // console.log('Key press started');
            classInfo.isKeyPressed = true;
        }
    }

    function handleKeyup(event) {
        const searchValue = newSearch.value;

        if (classInfo.isKeyPressed) {
            // console.log('Key press stopped');
            classInfo.isKeyPressed = false;
        }
    }
</script>