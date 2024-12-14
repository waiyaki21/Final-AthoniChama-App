<template>
    <section class="w-full flex">
        <div class="relative w-full">
            <div :class="classInfo.rowClass">
                <div :class="progressClass" :style="`width:${props.percent}%; min-width:5px`">
                    <span class="flex justify-center text-black font-boldened"></span>
                </div>
                <div v-if="props.percent > 0" :class="progressClassRemaining" :style="`width:${100 - props.percent}%;`">
                    <span class="flex justify-center text-black font-boldened"></span>
                </div>
            </div>
        </div>
        <span :class="progressInfoClass" v-tooltip="$tooltip(classInfo.message.toUpperCase(), 'top')">
            {{ props.percent }}%
        </span>
    </section>
</template>

<script setup>
    import { defineProps, onMounted, reactive, computed } from 'vue'

    const props = defineProps({
        percent: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        }
    })

    const classInfo = reactive ({
        rowClass:  'rounded-full overflow-hidden w-full inline-flex justify-start gap-1',
        // table progress bar
        progressClass100: 'alerts flex h-0.5 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-green-600 text-base leading-none',
        progressClass: 'alerts flex h-0.5 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-base leading-none',
        progressClassLow: 'alerts flex h-0.5 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-base leading-none',
        progressClassZero: 'alerts flex h-0.5 items-center justify-center rounded-full bg-gradient-to-r from-red-400 via-rose-500 to-red-600 text-base leading-none',
        progressClassDiff: 'alerts flex h-0.5 items-center justify-center rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-red-500 text-base leading-none',
        // table progress bar info
        progressInfo100: 'mx-1 text-2xs md:text-xs font-normal text-green-500',
        progressInfo: 'mx-1 text-2xs md:text-xs font-normal text-blue-500',
        progressInfoLow: 'mx-1 text-2xs md:text-xs font-normal text-orange-500',
        progressInfoZero: 'mx-1 text-2xs md:text-xs font-normal text-rose-500',

        message: ''
    })

    onMounted(() => {
        setMessage()
    })

    // Computed properties for determining class based on `percent`
    const progressClass = computed(() => {
        if (props.percent >= 30) return classInfo.progressClass100;
        if (props.percent >= 20) return classInfo.progressClass;
        if (props.percent > 10) return classInfo.progressClassLow;
        return classInfo.progressClassZero;
    });

    const progressClassRemaining = computed(() => {
        return progressClass.value;
    });

    const progressInfoClass = computed(() => {
        if (props.percent >= 30) return classInfo.progressInfo100;
        if (props.percent >= 20) return classInfo.progressInfo;
        if (props.percent > 10) return classInfo.progressInfoLow;
        return classInfo.progressInfoZero;
    });

    function setMessage() {
        // classInfo.message = props.name + ': ' + props.percent + '% / ' + Number(100 - props.percent).toLocaleString() + '%'
        classInfo.message = `${props.name} - Paid : ${props.percent}% / ${Number(100 - props.percent).toLocaleString()}%`;
    }
</script>