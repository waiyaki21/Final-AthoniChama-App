<template>
<!-- info section  -->
    <section class="font-normal text-2xl text-cyan-800 dark:text-gray-300 leading-tight uppercase py-1 w-full inline-flex justify-start gap-1">
        <span class="underline">All Payment Cycles.</span>
        <span class="text-xl text-cyan-800/50 dark:text-gray-300/50">( {{ cycle.name }} )</span>
    </section>

    <section :class="[classInfo.infoSection, 'mb-2']"> 
        <section :class="[classInfo.sectionborder, 'grid grid-cols-2 md:grid-cols-4 gap-1']">
            <otherBlock
                v-for="(block, index) in infoBlocks"
                :key="index"
                :title="block.title"
                :value="block.value"
                :tooltipContent="block.tooltip"
                :valueTooltip="block.valueTooltip"
                :infoHeader="classInfo.infoHeader"
                :valueClass="block.valueClass"
            />
        </section>
    </section>

    <section :class="[classInfo.infoSection, 'mt-2']" v-if="cycle != null">
        <section class="w-full m-1 p-1 text-left grid grid-cols-2 md:grid-cols-4 gap-1">
            <otherBlock
                v-for="(block, index) in cycleInfoBlocks"
                :key="index"
                :title="block.title"
                :value="block.value"
                :tooltipContent="block.tooltip"
                :valueTooltip="block.valueTooltip"
                :infoHeader="classInfo.infoHeader"
                :valueClass="block.valueClass"
            />
        </section>
    </section>
    <!-- end info section  -->

    <hr-line :color="classInfo.lineClass"></hr-line>

    <!-- progress bar  -->
    <progressInfo
        v-if="cycle != null"
        :name1 = '"Payments"'
        :name3 = '"Welfares"'
        :percent1 = cycle.percent
        :percent3 = '100 - cycle.percent'
    ></progressInfo>
    <!-- end progress bar  -->
</template>

<script setup>
    import { defineProps, reactive, computed, onMounted } from 'vue'
    import otherBlock from './utilities/otherBlock.vue';

    const props = defineProps({
        infosection: {
            type: String,
            required: true,
        },
        infoheader: {
            type: String,
            required: true,
        },
        sectionborder: {
            type: String,
            required: true,
        },
        count: {
            type: String,
            required: true,
        },
        cycle: {
            type: Object,
            required: true,
        },
        paysum: {
            type: String,
            required: true,
        },
        avg: {
            type: String,
            required: true,
        },
        members: {
            type: String,
            required: true,
        }
    });

    const classInfo = reactive({
        // main progress bar 
        infoSection: '',
        infoHeader: '',
        lineClass: '',

        infoSectionInfo: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        infoHeaderInfo: 'text-cyan-900 dark:text-cyan-300 mb-2 md:text-xl sm:text-md md:text-left sm:text-left font-normal underline tracking-tight uppercase',
        lineClassInfo: 'border-info-500/50',

        infoSection100: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-emerald-500 p-1 overflow-hidden bg-emerald-400/10 dark:bg-emerald-400/10',
        infoHeader100: 'text-emerald-300 mb-2 md:text-2xl sm:text-xl md:text-left sm:text-left font-normal underline tracking-tight uppercase',
        lineClassInfo: 'border-emerald-500/50',

        infoSectionZero: 'w-full mx-2 mb-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-rose-500 overflow-hidden bg-rose-400/10 dark:bg-rose-400/10',
        infoHeaderZero: 'text-red-300 mb-2 md:text-2xl sm:text-xl md:text-left sm:text-left font-normal underline tracking-tight uppercase',
        lineClassZero: 'border-rose-500/50',

        btn4: "Average amount Contributed per cycle",
        btn3: "Total no of active members",
        btn2: "Total amount contributed in all cycles",
        btn1: "Total no of payment cycles",
        btn5: "No of members who have contributed in this cycle",
        btn6: "This is the amount contributed in this cycle",
        btn7: "Total Welfare Payments",
        btn8: "This is the current cycle"
    })

    const infoBlocks = computed(() => [
        {
            title: 'Cycles No.',
            value: `${props.count} Cycles`,  // replace with dynamic data
            tooltip: 'Total number of cycles',
            valueTooltip:  `${props.count} cycles`,
            valueClass: 'text-blue-700 dark:text-blue-600 uppercase'
        },
        {
            title: 'Total Contributed',
            value: `ksh ${numFormat(props.paysum)}`,  // replace with dynamic data
            tooltip: 'Total contributed amount',
            valueTooltip: `KSH ${Number(props.paysum).toLocaleString()}`,
            valueClass: 'text-green-700 dark:text-green-600 uppercase'
        },
        {
            title: 'Active Members',
            value: `${numFormat(props.members)} Members`,  // replace with dynamic data
            tooltip: 'Total number of active members',
            valueTooltip: `${Number(props.members).toLocaleString()} Members`,
            valueClass: 'text-orange-700 dark:text-orange-600 uppercase'
        },
        {
            title: 'Avg Contribution',
            value: `ksh ${Number(numFormat(props.avg)).toLocaleString()}`,  // replace with dynamic data
            tooltip: 'Average contribution amount',
            valueTooltip: `KSH ${Number(props.avg).toLocaleString()}`,
            valueClass: 'text-purple-700 dark:text-purple-700 uppercase'
        }
    ]);

    const cycleInfoBlocks = computed(() => [
        {
            title: `Current Contributors`,
            value: Number(props.cycle.members_no).toFixed(0)+ ' Members',
            tooltip: 'Total number of members',
            valueTooltip: `${props.cycle.members_no} members`,
            valueClass: 'text-amber-500 dark:text-amber-500 uppercase'
        },
        {
            title: `Current T. Contributed`,
            value: `KSH ${numFormat(props.cycle.payments_total)}`,
            tooltip: 'Total contributed amount',
            valueTooltip: `KSH ${Number(props.cycle.payments_total).toLocaleString()}`,
            valueClass: 'text-purple-700 dark:text-purple-500 uppercase'
        },
        {
            title: `Current Welfares In`,
            value: `KSH ${numFormat(props.cycle.welfaresin_total)}`,
            tooltip: 'Total welfares in',
            valueTooltip: `KSH ${Number(props.cycle.welfaresin_total).toLocaleString()}`,
            valueClass: 'text-red-700 dark:text-red-600 uppercase'
        },
        {
            title: `Current Expenses`,
            value: 'KSH ' +numFormat(props.cycle.expenses_total),
            tooltip: 'Total Expenses',
            valueTooltip: `KSH ${Number(props.cycle.expenses_total).toLocaleString()}`,
            valueClass: 'text-amber-700 dark:text-amber-600 uppercase'
        }
    ]);

    onMounted(() => progressMain())

    function progressMain() {
        let percentMain = Math.floor(props.cycle.percent);

        if (percentMain == 100) {
            classInfo.infoHeader = classInfo.infoHeader100;
            classInfo.infoSection = classInfo.infoSection100;
            classInfo.lineClass = classInfo.lineClass100;
        } else {
            if (percentMain >= 50) {
                classInfo.infoHeader = classInfo.infoHeaderInfo;
                classInfo.infoSection = classInfo.infoSectionInfo;
                classInfo.lineClass = classInfo.lineClassInfo;
            } else {
                classInfo.infoHeader = classInfo.infoHeaderZero;
                classInfo.infoSection = classInfo.infoSectionZero;
                classInfo.lineClass = classInfo.lineClassZero;
            }
        }
    }

    function numFormat(num) {
        if (num < 9999) {
            return Number(num).toFixed(0);
        } else {
            if (num > 999999) {
                let x = Number(num / 1000000).toFixed(2);
                let y = x + ' m';
                return y;
            } else {
                let x = Number(num / 1000).toFixed(1);
                let y = x + ' k';
                return y;
            } 
        }
    }
</script>