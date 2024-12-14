<template>
    <!-- header  -->
    <section class="font-normal text-cyan-800 dark:text-gray-300 leading-tight uppercase py-1 grid grid-cols-2 md:grid-cols-6">
        <section class="flex flex-col col-span-1 md:col-span-3 w-full">
            <span class="inline-flex justify-start gap-1">
                <span class="underline text-xl md:text-2xl">ALL PROJECTS.</span>
            </span>
            <section class="font-normal text-md leading-tight uppercase p-1 w-full inline-flex justify-start gap-1">
                <span :class="classInfo.successBadge">
                    ADMIN
                </span>
            </section>
        </section>
    </section>
    <!-- end header  -->
 
    <!-- info panel  -->
    <section :class="[classInfo.infoSection]"> 
        <section class="w-full m-1 p-1 text-left grid grid-cols-2 md:grid-cols-4 gap-1">
            <otherBlock
                v-for="(block, index) in projectInfoBlocks"
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

    <!-- progress bar  -->
    <progressInfo
        :name1 = '"Payments"'
        :name3 = '"Balances"'
        :percent1 = totalPercent
        :percent3 = '100 - totalPercent'
    ></progressInfo>
    <!-- end progress bar  -->
</template>

<script setup>
    import { defineProps, reactive, onMounted, computed } from 'vue'
    import otherBlock from './utilities/otherBlock.vue';

    const props = defineProps({
        expSum: {
            type: String,
            required: true
        },
        projectSum: {
            type: String,
            required: true
        },
        projectNo: {
            type: String,
            required: true
        },
        completed: {
            type: String,
            required: true
        },
        totalPercent: {
            type: String,
            required: true
        },
        paySum: {
            type: String,
            required: true
        },
        balance: {
            type: String,
            required: true
        },
        percent: {
            type: String,
            required: true
        },
    })

    const classInfo = reactive ({
        progressMainBorder: '',
        progressMainClass: '',
        infoSection: '',
        infoHeader: '',

        // main progress bar 
        progressMainBorderInfo: 'border border-cyan-500 p-1 overflow-hidden',
        progressMainClassInfo: 'alerts flex h-6 items-center justify-center rounded-full bg-gradient-to-r from-gray-200 via-cyan-400 to-blue-500 text-base leading-none',
        infoSectionInfo: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        infoHeaderInfo: 'text-cyan-900 dark:text-cyan-300 mb-2 md:text-xl text-md md:text-left sm:text-left font-normal underline tracking-tight uppercase',

        progressMainBorder100: 'border border-emerald-500 p-1 overflow-hidden',
        progressMainClass100: 'alerts flex h-1 items-center justify-center rounded-full bg-gradient-to-r from-grey-300 via-emerald-400 to-green-600 text-base leading-none',
        infoSection100: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-emerald-500 p-1 overflow-hidden bg-emerald-400/10 dark:bg-emerald-400/10',
        infoHeader100: 'text-emerald-300 mb-2 md:text-xl text-md md:text-left sm:text-left font-normal underline tracking-tight uppercase',

        progressMainBorderZero: 'border border-red-500 p-1 overflow-hidden',
        progressMainClassZero: 'alerts flex h-6 items-center justify-center rounded-full bg-gradient-to-r from-orange-300 via-rose-400 to-red-500 text-base leading-none',
        infoSectionZero: 'w-full mx-2 mb-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-rose-500 overflow-hidden bg-rose-400/10 dark:bg-rose-400/10',
        infoHeaderZero: 'text-red-300 mb-2 md:text-xl text-md md:text-left sm:text-left font-normal underline tracking-tight uppercase',

        btn1: "Total no of projects",
        btn2: "Total no of completed projects" ,
        btn3: "Total no of incomplete / ongoing projects",
        btn4: "Completion of Projects as a Percentage",
        btn5: "This is the amount total contributed by members monthly",
        btn6: "This is the amount needed by uncompleted projects",
        btn7: "This is the amount already used by projects",
        btn8: "Amount needed to complete the projects",

        successBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-green-900 border-black bg-green-400 rounded-md shadow-md py-1 px-2 my-auto'
    })

    onMounted(() => {
        progressMain()
    })

    const projectInfoBlocks  = computed(() => [
        {
            title: 'Project No.',
            value: Number(props.projectNo).toLocaleString(),
            tooltip: 'Total number of projects',
            valueTooltip: `${props.projectNo} Projects`,
            valueClass: 'text-blue-700 dark:text-blue-600 uppercase'
        },
        {
            title: 'Completed',
            value: Number(props.completed).toLocaleString(),
            tooltip: 'Completed projects',
            valueTooltip: `${props.completed} Projects`,
            valueClass: 'text-green-700 dark:text-green-600 uppercase'
        },
        {
            title: 'Ongoing',
            value: Number(props.projectNo - props.completed).toLocaleString(),
            tooltip: 'Ongoing projects',
            valueTooltip: `${props.projectNo - props.completed} Projects`,
            valueClass: 'text-orange-700 dark:text-orange-600 uppercase'
        },
        {
            title: '% Paid',
            value: Number(props.totalPercent).toLocaleString(),
            tooltip: 'Total percentage paid',
            valueTooltip: `${props.totalPercent}% Paid`,
            valueClass: 'text-red-700 dark:text-red-600 uppercase'
        },
        {
            title: 'T. Contributions',
            value: numFormat(props.paySum),
            tooltip: 'Total contributions',
            valueTooltip: `KSH ${Number(props.paySum).toLocaleString()}`,
            valueClass: 'text-green-700 dark:text-green-600 uppercase'
        },
        {
            title: 'T. Targets',
            value: numFormat(props.projectSum),
            tooltip: 'Total targets',
            valueTooltip: `KSH ${Number(props.projectSum).toLocaleString()}`,
            valueClass: 'text-purple-700 dark:text-purple-500 uppercase'
        },
        {
            title: 'Expenses',
            value: numFormat(props.expSum),
            tooltip: 'Total expenses',
            valueTooltip: `KSH ${Number(props.expSum).toLocaleString()}`,
            valueClass: 'text-amber-500 dark:text-amber-500 uppercase'
        },
        {
            title: 'Balances',
            value: numFormat(props.balance),
            tooltip: 'Balance remaining',
            valueTooltip: `KSH ${Number(props.balance).toLocaleString()}`,
            valueClass: 'text-red-700 dark:text-red-600 uppercase'
        }
    ])

    function progressMain() {
        let percentMain = Math.floor((props.expSum) / props.projectSum * 100);
        
        if (percentMain == 100) {
            classInfo.progressMainClass = classInfo.progressMainClass100;
            classInfo.progressMainBorder = classInfo.progressMainBorder100;
            classInfo.infoHeader = classInfo.infoHeader100;
            classInfo.infoSection = classInfo.infoSection100;
        } else {
            if (percentMain >= 50) {
                // No change needed since classInfo already holds these values
                classInfo.progressMainClass = classInfo.progressMainClassInfo;
                classInfo.progressMainBorder = classInfo.progressMainBorderInfo;
                classInfo.infoHeader = classInfo.infoHeaderInfo;
                classInfo.infoSection = classInfo.infoSectionInfo;
            } else {
                classInfo.progressMainClass = classInfo.progressMainClassZero;
                classInfo.progressMainBorder = classInfo.progressMainBorderZero;
                classInfo.infoHeader = classInfo.infoHeaderZero;
                classInfo.infoSection = classInfo.infoSectionZero;
            }
        }
    }

    function numFormat(num) {
        if (num < 9999) {
            return num;
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