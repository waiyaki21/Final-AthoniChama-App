<template>
    <section :class="[classInfo.infosection, 'col-span-1 font-boldened w-full overflow-y-scroll h-auto max-h-[55.5rem] md:h-fit']"> 
        <section :class="[classInfo.sectionborder, 'md:flex-col grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 md:grid-rows-1']">
            <div v-for="(block, index) in infoBlocks" :key="index">
                <a :class="[classInfo.tagClass]">
                    <h5 :class="[classInfo.header]" :title="block.title" v-tooltip="$tooltip(block.tooltipBtn, 'right')">
                        <span>{{ block.title }}</span>
                        <info-icon :class="[classInfo.svgClass]"></info-icon>
                    </h5>
                    <p :class="[classInfo.subheader, block.colorClass]" v-tooltip="$tooltip(block.tooltip, 'right')">
                        {{ block.value }}
                    </p>
                </a>
            </div>
        </section>

        <hr-line :color="'border-emerald-500/50'"></hr-line>
    </section>
</template>

<script setup>
    import { defineProps, reactive, computed } from 'vue'
    import moment from 'moment';

    const props = defineProps({
        member: {
            type: Object,
            required: true,
        }
    });

    function numFormat(num) {
        if (num < 9999) {
            return Number(num).toLocaleString();
        } else {
            if (num > 999999) {
                let x = Number(num / 1000000).toFixed(2);
                let y = x + ' m';
                return y;
            } else {
                let x = Number(num / 1000).toFixed(1);
                let y = x + 'k';
                return y;
            } 
        }
    }

    const classInfo = reactive({ 
        btn1:   'Total amount contributed',
        btn2:   'Total Welfares In',
        btn3:   'Total Welfares Owed (BEFORE APRIL 24)',
        btn4:   'Total Money Invested',
        btn5:   'Total Percentage Invested',
        btn6:   'Contact Detail',
        btn7:   'Total Duration as a Member',
        btn3:   'Total Welfares Owed (AFTER MAY 24)',

        header: 'text-cyan-900 dark:text-cyan-300 my-4 sm:text-xs md:text-md text-left font-normal underline tracking-tight uppercase',
        subheader: 'font-normal text-left text-xl md:text-3xl uppercase textScroll',
        sectionborder: 'w-full flex-col justify-between m-1 p-1 text-left',
        infosection: 'm-1 text-left mx-auto rounded-xl border-2 shadow-md border-2 border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        svgClass: 'flex-shrink-0 inline w-5 h-5 sm:w-3 sm:h-3 ml-1',
        tagclass: 'block max-w-sm p-0 bg-transparent row-span-1 col-span-1'
    })

    const infoBlocks = computed(() => [
        {
            title: 'Shares Percentage',
            value: `${Number(props.member.total_shares).toFixed(3)}%`,
            colorClass: props.member.total_shares > 1 ? 'text-emerald-700 dark:text-emerald-600' : 'text-rose-700 dark:text-rose-600',
            tooltip: `${Number(props.member.total_shares).toFixed(1)}%`,
            tooltipBtn: classInfo.btn5.toUpperCase(),
        },
        {
            title: 'T. Investment',
            value: `KSH ${numFormat(props.member.total_investment)}`,
            colorClass: 'text-purple-700 dark:text-purple-600',
            tooltip: `KSH ${Number(props.member.total_investment).toLocaleString()}`,
            tooltipBtn: classInfo.btn4.toUpperCase(),
        },
        {
            title: 'T. Contributed',
            value: `KSH ${numFormat(props.member.payments_total)}`,
            colorClass: 'text-amber-700 dark:text-amber-600',
            tooltip: `KSH ${Number(props.member.payments_total).toLocaleString()}`,
            tooltipBtn: classInfo.btn1.toUpperCase(),
        },
        {
            title: 'T. Welfares In',
            value: `KSH ${numFormat(props.member.total_in)}`,
            colorClass: 'text-emerald-700 dark:text-emerald-600',
            tooltip: `KSH ${Number(props.member.total_in).toLocaleString()}`,
            tooltipBtn: classInfo.btn2.toUpperCase(),
        },
        {
            title: 'T. Welfares Owed',
            value: `KSH ${numFormat(props.member.welfare_out)}`,
            colorClass: 'text-indigo-700 dark:text-indigo-600',
            tooltip: `KSH ${Number(props.member.welfare_out).toLocaleString()}`,
            tooltipBtn: classInfo.btn3.toUpperCase(),
        },
        {
            title: 'Contact',
            value: `KSH ${numFormat(props.member.telephone)}`,
            colorClass: 'text-yellow-700 dark:text-yellow-600',
            tooltip: `KSH ${Number(props.member.telephone).toLocaleString()}`,
            tooltipBtn: classInfo.btn6.toUpperCase(),
        },
        {
            title: 'Days Active',
            value: moment(props.member.created_at).fromNow(),
            colorClass: 'text-rose-700 dark:text-rose-600',
            tooltip: moment(props.member.created_at).fromNow(),
            tooltipBtn: classInfo.btn7.toUpperCase(),
        },
        // Add other blocks here...
    ]);
</script>