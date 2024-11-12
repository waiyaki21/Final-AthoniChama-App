<template>
    <div class="p-2 flex-col space-y-2" id="cycles" role="tabpanel" aria-labelledby="cycles-tab">
        <h3 :class="[classInfo.headerMain]" @click="classInfo.viewShow = !classInfo.viewShow" preserve-scroll>
            <span>
                <span>Payment Cycles</span>
                <span class="text-xs text-gray-500 dark:text-gray-500 ml-4">
                    ( {{ props.cycles.length }} Cycles)
                </span>
            </span>

            <button class="cursor-pointer text-gray-300 hover:text-white dark:text-cyan-300 dark:hover:text-white bg-transparent dark:bg-transparent dark:hover:bg-cyan-700 border-2 border-gray-300 dark:border-cyan-300 dark:hover:border-cyan-500 rounded-full p-1 md:p-2 m-2 inline-flex justify-center">
                <down-icon class="w-3 h-3 md:w-4 md:h-4 text-gray-300 hover:text-white dark:text-cyan-300 dark:hover:text-white" v-if="!classInfo.viewShow"></down-icon>
                <up-icon class="w-3 h-3 md:w-4 md:h-4 text-gray-300 hover:text-white dark:text-cyan-300 dark:hover:text-white" v-else></up-icon>
            </button>
        </h3>

        <section class="grid grid-cols-1 md:grid-cols-4 gap-1" v-if="classInfo.viewShow">
            <!-- forms  -->
            <cycleform
                :cycles     = props.cycles
                :nextname   = props.nextname
                :date       = props.date
                :settings   = props.settings
                :current    = props.current
            ></cycleform>
        </section>

        <hr-line :color="'border-teal-500/50'"></hr-line>
    </div>
</template>

<script setup>
    import { defineProps, reactive } from 'vue';

    const props = defineProps({
        settings: {
            type: Object,
            required: true,
        },
        current: {
            type: Object,
            required: true,
        },
        cycles: {
            type: Array,
            required: true,
        },
        nextname: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        }
    })

    const classInfo = reactive ({
        viewShow: true,
        headerMain: 'font-normal md:text-2xl text-xl text-cyan-800 dark:text-gray-300 leading-tight uppercase py-1 w-full inline-flex justify-between my-1 hover:text-cyan-500 dark:hover:text-cyan-500 cursor-pointer',
    })
</script>