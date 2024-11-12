<template>
    <!-- header  -->
    <section class="font-normal text-cyan-800 dark:text-gray-300 leading-tight uppercase py-1 grid grid-cols-2 md:grid-cols-6">
        <section class="flex flex-col col-span-1 md:col-span-3 w-full">
            <span class="inline-flex justify-start gap-1">
                <span class="underline text-xl md:text-2xl">{{ props.header }}.</span>
            </span>
            <section class="font-normal text-md leading-tight uppercase p-1 w-full inline-flex justify-start gap-1">
                <span :class="classInfo.successBadge">
                    ADMIN
                </span>
            </section>
        </section>
    </section>
    <!-- end header  -->
</template>

<script setup>

    import { defineProps, reactive } from 'vue'

    const props = defineProps({
        header: {
            type: String,
            required: true,
        },
    })

    const classInfo = reactive({
        successBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-green-900 border-black bg-green-400 rounded-md shadow-md py-1 px-2 my-auto'
    })
</script>
