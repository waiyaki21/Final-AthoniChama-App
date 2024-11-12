<template>
    <section :class="[classInfo.infosection, 'col-span-1 font-boldened w-full overflow-y-scroll h-auto max-h-[760px] md:h-fit']"> 
        <section :class="[classInfo.sectionborder, 'md:flex-col grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 md:grid-rows-1']">
            <a v-for="(block, index) in cycleInfoBlocks" :key="index" :class="[classInfo.tagClass]">
                <h5 :class="[classInfo.header]" v-tooltip="$tooltip(block.tooltip, 'right')">
                    <span>{{ block.title }}</span>
                    <info-icon :class="[classInfo.svgClass]"></info-icon>
                </h5>
                <p :class="['font-normal text-left text-xl md:text-3xl uppercase textScroll', block.textClass]">
                    {{ block.value }}
                </p>
            </a>
        </section>

        <hr-line :color="'border-emerald-500/50'"></hr-line>
    </section>
</template>

<script setup>
    import { defineProps, reactive, computed } from 'vue'
    //moment 
    // import moment from 'moment';
    const props = defineProps({
        cycle: {
            type: Object,
            required: true,
        }
    });

    // Computed array for all the sections
    const cycleInfoBlocks = computed(() => [
        // {
        //     title: 'Date',
        //     label: 'Cycle Payment Date',
        //     tooltip: 'Cycle Payment Date',
        //     value: moment(props.cycle.created_at).format('ddd, Do/MM/YY'),
        //     textClass: 'text-blue-700 dark:text-blue-600'
        // },
        {
            title: 'Total Paid',
            label: 'Total amount expected during this cycle',
            tooltip: `KSH ${numFormat(props.cycle.payments_total)}`,
            value: `ksh ${numFormat(props.cycle.payments_total)}`,
            textClass: 'text-amber-500 dark:text-amber-500'
        },
        {
            title: 'Total Welfares In',
            label: 'Total amount contributed in this cycle',
            tooltip: `KSH ${numFormat(props.cycle.welfaresin_total)}`,
            value: `ksh ${numFormat(props.cycle.welfaresin_total)}`,
            textClass: 'text-purple-700 dark:text-purple-600'
        },
        {
            title: 'Total Welfares Owed',
            label: 'Total amount owed in this cycle',
            tooltip: `KSH ${numFormat(props.cycle.welfaresowed_total)}`,
            value: `ksh ${numFormat(props.cycle.welfaresowed_total)}`,
            textClass: 'text-red-700 dark:text-red-600'
        },
        {
            title: 'Members',
            label: 'Members',
            tooltip: 'Members who have paid',
            value: `${numFormat(props.cycle.members_no)} Paid`,
            textClass: 'text-gray-700 dark:text-gray-300'
        },
        {
            title: 'Payments No.',
            label: 'Total No. of Payments in this cycle',
            tooltip: `${numFormat(props.cycle.payments_count)} Payments`,
            value: `${numFormat(props.cycle.payments_count)} Payments`,
            textClass: 'text-purple-500 dark:text-purple-500'
        },
        {
            title: 'Welfare No.',
            label: 'Total No. of Welfare Payments in this cycle',
            tooltip: `${numFormat(props.cycle.welfares_count)} Welfares`,
            value: `${numFormat(props.cycle.welfares_count)} Welfares`,
            textClass: 'text-rose-700 dark:text-rose-600'
        },
        {
            title: 'Projects No.',
            label: 'Total No. of Projects in this cycle',
            tooltip: `${numFormat(props.cycle.projects_count)} Projects`,
            value: `${numFormat(props.cycle.projects_count)} Projects`,
            textClass: 'text-amber-700 dark:text-amber-600'
        },
        {
            title: 'Total Expenses',
            label: 'Total Amount of Project Expenses in this cycle',
            tooltip: `KSH ${numFormat(props.cycle.expenses_total)}`,
            value: `KSH ${numFormat(props.cycle.expenses_total)}`,
            textClass: 'text-teal-700 dark:text-teal-600'
        }
    ]);

    function numFormat(num) {
        if (num < 99999) {
            return Number(num).toLocaleString();
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

    const classInfo = reactive({ 
        header: 'text-cyan-900 dark:text-cyan-300 my-4 sm:text-xs md:text-md text-left font-normal underline tracking-tight uppercase',
        subheader: 'font-normal text-left text-xl md:text-3xl uppercase textScroll',
        sectionborder: 'w-full flex-col justify-between m-1 p-1 text-left',
        infosection: 'm-1 text-left mx-auto rounded-xl border-2 shadow-md border-2 border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        svgClass: 'flex-shrink-0 inline w-5 h-5 sm:w-3 sm:h-3 ml-1',
        tagclass: 'block max-w-sm p-0 bg-transparent row-span-1 col-span-1'
    })
</script>