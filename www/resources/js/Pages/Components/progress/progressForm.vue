<template>
    <section class="w-full flex" v-if="percent == 100">
        <div class="relative w-full">
            <div :class="[classInfo.rowClass]">
                <div 
                    :class="[classInfo.progressClass]" 
                    :style="'width:' + percent + '%; min-width:5px'">
                    <span class="flex justify-center text-black font-boldened"></span>
                </div>
            </div>
        </div>
        <span :class="[classInfo.progressInfo]" v-tooltip="{ content: classInfo.message }">
            {{ percent }}%
        </span>
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
    import { defineProps, onMounted, reactive, watch, computed } from 'vue'

    const props = defineProps({
        percent: {
            type: String,
            required: true,
        },
    })

    const loading = computed(() => props.percent);

    watch(loading, (newValue) => {
        percentClass();
    })

    const classInfo = reactive ({
        rowClass:  'rounded-full overflow-hidden w-full inline-flex justify-start space-x-2',
        // table progress bar
        progressClass100: 'alerts flex h-1 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-green-600 text-base leading-none',
        progressClass: 'alerts flex h-1 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-base leading-none',
        progressClassLow: 'alerts flex h-1 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-base leading-none',
        progressClassZero: 'alerts flex h-1 items-center justify-center rounded-full bg-gradient-to-r from-red-400 via-rose-500 to-red-600 text-base leading-none',
        progressClassWelf: 'alerts flex h-1 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-cyan-600 to-teal-300 text-base leading-none',
        // table progress bar info
        progressInfo100: 'mx-2 text-sm font-normal text-green-500',
        progressInfo: 'mx-2 text-sm font-normal text-blue-500',
        progressInfoLow: 'mx-2 text-sm font-normal text-orange-500',
        progressInfoZero: 'mx-2 text-sm font-normal text-red-500',

        message: ''
    })

    onMounted(() => {
        setMessage()
    })

    function percentClass() {
        let percentMain = props.percent;
        switch (true) {
            case (percentMain = 100):
                classInfo.progressClass = classInfo.progressClass100;
                classInfo.progressInfo  = classInfo.progressInfo100;
                break;
            case (percentMain > 50):
                classInfo.progressClass = classInfo.progressClass;
                classInfo.progressInfo  = classInfo.progressInfo;
                break;
            case (percentMain < 50):
                classInfo.progressClass = classInfo.progressClassZero;
                classInfo.progressInfo  = classInfo.progressInfoZero;
                break;
        }
    }

    function setMessage() {
        classInfo.message = 'LOADING : ' + props.percent + '%'
    }
</script>