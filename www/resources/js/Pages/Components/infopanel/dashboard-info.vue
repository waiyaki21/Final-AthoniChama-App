<template> 
    <!-- header  -->
    <section class="font-normal text-3xl text-cyan-900 dark:text-gray-300 leading-tight uppercase py-1 w-full inline-flex justify-between">
        <span class="underline uppercase">Welcome Admin!</span>
    </section>
    <section class="font-normal text-xl text-cyan-900 dark:text-gray-300 leading-tight uppercase py-1 w-full inline-flex justify-between">
        <span class="underline">Dashboard Page.</span>
    </section>

    <!-- info panel  -->
    <section :class="[classInfo.infoSection]"> 
        <section class="w-full m-1 p-1 text-left grid grid-cols-2 md:grid-cols-3 gap-1">
            <infoBlock
                v-for="(block, index) in infoBlocks"
                :key="index"
                :infoHeader="block.infoHeader"
                :title="block.title"
                :label="block.label"
                :value="block.value"
                :suffix="block.suffix"
                :width="block.width"
                :colorClass="block.colorClass"
            ></infoBlock>
        </section>
    </section>

    <!-- progress bar  -->
    <section class="mx-auto my-4">
        <div class="relative mb-2">
            <div class="my-2 flex rounded-full text-xs w-full">
                <div :style="'width:' + finance.percent + '%; min-width: 10px;'" class="alerts bg-gradient-to-r from-green-300 via-green-700 to-green-600 transition-all duration-500 ease-out rounded-full mx-1 border-2 border-green-300 dark:border-green-700 my-1 h-1.5 hover:h-2 cursor-pointer" title="View Money In" @click="classInfo.progressShow = !classInfo.progressShow">
                </div>
                <div :style="'width:' + percent.left + '%; min-width: 10px;'" class="alerts bg-gradient-to-r from-rose-100 via-red-600 to-rose-700 transition-all duration-500 ease-out rounded-full mx-1 border-2 border-red-300 dark:border-rose-700 my-1 h-1.5 hover:h-2 cursor-pointer" title="View Money Out" @click="classInfo.progressShow = !classInfo.progressShow">
                </div>
            </div>
            <div class="mb-2 flex items-center justify-between text-xs">
                <div class="text-green-600 underline uppercase cursor-pointer">Money In: {{ finance.percent }}%</div>
                <div class="text-red-600 underline uppercase cursor-pointer">Money Out: {{ percent.left }}%</div>
            </div>
        </div>
    </section>
    <!-- end progress bar  -->

    <!-- in progress bar  -->
    <!-- <progressInfo
        v-if        = "classInfo.progressShow"
        :name1      = '"Contributions"'
        :name2      = '"Welfares In"'
        :percent1   = classInfo.payPercent
        :percent2   = classInfo.welPercent
    ></progressInfo> -->
    <!-- end in progress bar  -->

    <!-- out progress bar  -->
    <!-- <progressInfo
        v-else
        :name1      = '"Welfares Owed"'
        :name2      = '"Project Expenses"'
        :percent1   = classInfo.owePercent
        :percent2   = classInfo.expPercent
    ></progressInfo> -->
    <!-- end out progress bar  -->
</template>

<script setup>
    import { defineProps, reactive, onMounted, computed } from 'vue'

    const props = defineProps({
        finance: {
            type: Object,
            required: true,
        },
    });

    const percent = reactive({ 
        left: ''
    });

    const classInfo = reactive({
        infoSection: '',
        infoHeader: '',

        // main progress bar 
        infoSectionInfo: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        infoHeaderInfo: 'text-cyan-900 dark:text-cyan-300 mb-2 md:text-xl sm:text-md md:text-left sm:text-left font-normal underline tracking-tight uppercase',

        infoSection100: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-emerald-500 p-1 overflow-hidden bg-emerald-400/10 dark:bg-emerald-400/10',
        infoHeader100: 'text-emerald-300 mb-2 md:text-2xl sm:text-xl md:text-left sm:text-left font-normal underline tracking-tight uppercase',

        infoSectionZero: 'w-full mx-2 mb-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-rose-500 overflow-hidden bg-rose-400/10 dark:bg-rose-400/10',
        infoHeaderZero: 'text-red-300 mb-2 md:text-2xl sm:text-xl md:text-left sm:text-left font-normal underline tracking-tight uppercase',

        payPercent: '',
        welPercent: '',
        owePercent: '',
        expPercent: '',

        progressShow: true
    })

    const infoBlocks = computed(() => [
        {
            title: 'Total Investment',
            label: 'T. Investment',
            value: `ksh ${numFormat(props.finance.money_left)}`,
            suffix: '',
            colorClass: 'text-orange-700 dark:text-orange-600',
            width: 'col-span-1'
        },
        {
            title: 'Total Amount Contributed',
            label: 'T. Contributed.',
            value: `ksh ${numFormat(props.finance.total_pays)}`,
            suffix: '',
            colorClass: 'text-green-700 dark:text-green-600',
            width: 'col-span-1'
        },
        {
            title: 'Total Welfare Amount',
            label: 'T. Welfares',
            value: `ksh ${numFormat(props.finance.total_pays - props.finance.money_left)}`,
            suffix: '',
            colorClass: 'text-purple-700 dark:text-purple-600',
            width: 'col-span-1'
        },
        {
            title: 'Payment Cycles',
            label: 'Payment Cycles',
            value: numFormat(props.finance.cycles_no),
            suffix: 'Cycles.',
            colorClass: 'text-teal-700 dark:text-teal-500',
            width: 'col-span-1'
        },
        {
            title: 'Projects',
            label: 'Projects',
            value: numFormat(props.finance.projects_no),
            suffix: 'Projects.',
            colorClass: 'text-blue-700 dark:text-blue-600',
            width: 'col-span-1'
        },
        {
            title: 'Members',
            label: 'Members',
            value: numFormat(props.finance.members_no),
            suffix: 'Members.',
            colorClass: 'text-red-700 dark:text-red-600',
            width: 'col-span-1'
        }
    ]);

    onMounted(() => progressMain())

    function progressMain() {
        if (props.finance.percent == 0) {
            classInfo.payPercent = '0'
            classInfo.welPercent = '0'
            classInfo.owePercent = '0'
            classInfo.expPercent = '0'
        } else {
            let a = Number(props.finance.total_pays / props.finance.money_left * 100).toFixed(2);
            classInfo.payPercent = a;
            let b = Number(props.finance.welfare_in / props.finance.money_left * 100).toFixed(2);
            classInfo.welPercent = b;
            let c = Number(props.finance.welfare_out / props.finance.money_out * 100).toFixed(2);
            classInfo.owePercent = c;
            let d = Number(props.finance.total_expenses / props.finance.money_out * 100).toFixed(2);
            classInfo.expPercent = d;
        }
        percent.left = Number(100 - props.finance.percent).toLocaleString()

        let percentMain = props.finance.percent;

        if (percentMain == 100) {
            classInfo.infoHeader = classInfo.infoHeader100;
            classInfo.infoSection = classInfo.infoSection100;
        } else {
            if (percentMain >= 50) {
                classInfo.infoHeader = classInfo.infoHeaderInfo;
                classInfo.infoSection = classInfo.infoSectionInfo;
            } else {
                classInfo.infoHeader = classInfo.infoHeaderZero;
                classInfo.infoSection = classInfo.infoSectionZero;
            }
        }
    }

    function numFormat(num) {
        if (num < 49999) {
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
</script>