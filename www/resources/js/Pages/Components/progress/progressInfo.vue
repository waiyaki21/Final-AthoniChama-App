<template>
    <section class="m-2 mx-auto w-full">
        <div class="relative">
            <div class="my-1 flex rounded-full text-sm w-full">
                <div :style="'width:' + percent1 + '%; min-width: 10px;'" class="alerts bg-gradient-to-r from-green-300 via-green-700 to-green-600 transition-all duration-500 ease-out rounded-full border md:border-base border-green-300 dark:border-green-700 m-0.5 h-1.5 cursor-pointer" v-tooltip="$tooltip('Total ' + props.name1 +' : '+ Number(props.percent1).toFixed(1) +'%', 'top')">
                </div>
                <div :style="'width:' + percent2 + '%; min-width: 10px;'" class="alerts bg-gradient-to-r from-cyan-300 via-teal-700 to-blue-600 transition-all duration-500 ease-out rounded-full border md:border-base border-cyan-300 dark:border-cyan-700 m-0.5 h-1.5 cursor-pointer" v-tooltip="$tooltip('Total ' + props.name2 +' : '+ Number(props.percent2).toFixed(1) +'%', 'top')"  v-if="props.name2 != null">
                </div>
                <div :style="'width:' + percent3 + '%; min-width: 10px;'" class="alerts bg-gradient-to-r from-rose-300 via-red-700 to-red-600 transition-all duration-500 ease-out rounded-full border md:border-base border-red-300 dark:border-red-700 m-0.5 h-1.5 cursor-pointer" v-tooltip="$tooltip('Total ' + props.name3 +' : '+ Number(props.percent3).toFixed(1) +'%', 'top')" v-if="props.name3 != null">
                </div>
            </div>
            <div class="mb-1 flex items-center justify-between text-2xs">
                <div class="text-green-600">{{ 'Total ' + props.name1 +' : '+ Number(props.percent1).toFixed(1) +'%' }}</div>
                <div class="text-blue-600" v-if="props.name2 != null">{{ 'Total ' + props.name2 +' : '+ Number(props.percent2).toFixed(1) +'%' }}</div>
                <div class="text-red-600"  v-if="props.name3 != null">{{ 'Total ' + props.name3 +' : '+ Number(props.percent3).toFixed(1) +'%' }}</div>
            </div>
        </div>
    </section>
</template>

<style>
    .alerts {
        display: block;
        animation: grow 10s forwards;
        width: 0%;
    }

    @keyframes grow {
        0% {
            width: 0%;
        }

        100% {
            width: percent +'%';
        }
    }
</style>

<script setup>
    import { defineProps } from 'vue'

    const props = defineProps({
        name1: {
            type: String,
            required: true,
        },
        percent1: {
            type: String,
            required: true,
        },
        name2: {
            type: String,
            required: true,
        },
        percent2: {
            type: String,
            required: true,
        },
        name3: {
            type: String,
            required: true,
        },
        percent3: {
            type: String,
            required: true,
        },
    })
</script>