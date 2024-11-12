<template>
    <!-- header  -->
    <section
        class="font-normal text-cyan-800 dark:text-gray-300 leading-tight uppercase py-1 grid grid-cols-1 md:grid-cols-6">
        <section class="flex flex-col col-span-1 md:col-span-3 w-full">
            <span class="inline-flex justify-start gap-1">
                <span class="underline text-xl md:text-2xl">{{ props.cycle.name }}.</span>
            </span>
            <section class="font-normal text-md leading-tight uppercase p-1 w-full inline-flex justify-start gap-1">
                <span :class="classInfo.successBadge">
                    {{ moment(props.cycle.created_at).format("ddd, Do-MM-YY") }}
                </span>

                <span :class="classInfo.successBadge" v-if="percent == 100">
                    Completed
                </span>
                <span :class="classInfo.purpleBadge" v-if="percent > 100">
                    Completed & Surpassed
                </span>
                <span :class="classInfo.infoBadge" v-if="percent < 100">
                    Ongoing
                </span>
                <span :class="classInfo.failBadge" v-if="percent == 0">
                    Not Started
                </span>
            </section>
        </section> 

        <div class="inline-flex rounded-md shadow-sm gap-1 justify-start md:justify-end col-span-1 md:col-span-3" role="group">
            <!-- edit  -->
            <button type="button" class="inline-flex items-center p-1 text-xs font-normal text-cyan-900 bg-transparent rounded-md hover:text-gray-500 focus:z-10 dark:text-cyan-700 dark:hover:text-cyan-600" v-tooltip="$tooltip(classInfo.btn1.toUpperCase(),'top')"
                @click="showCycle(props.cycle)">
                <edit-icon :class="[classInfo.svgClass]"></edit-icon>
            </button>
            <!-- delete  -->
            <button type="button" class="inline-flex items-center p-1 text-xs font-normal text-red-900 bg-transparent rounded-md hover:text-gray-500 focus:z-10 dark:text-red-700 dark:hover:text-red-600" v-tooltip="$tooltip(classInfo.btn2.toUpperCase(), 'top')"
                @click="showCycleDelete(props.cycle)">
                <delete-icon :class="[classInfo.svgClass]"></delete-icon>
            </button>
            <!-- download items  -->
            <ledgerDrop @click='classInfo.selected = true' @all=downloadAllSheet @down="downloadSheet"
                @active="downloadActiveSheet" :cycle="props.cycle"
                v-tooltip="$tooltip(classInfo.btn3.toUpperCase(), 'top')">
            </ledgerDrop>
            <!-- template  -->
            <StyleButton :class="'p-0.5 h-fit my-auto rounded-lg hover:shadow-xl'"
                :buttonClass="'info'"
                @handleClick="$downloadFile('/download/template/' + cycle.id)"
                :tooltipText="`Download ${cycle.name} Monthly Template`"
                :buttonText="`Download ${cycle.name} Template.`">
                <downtray-icon :class="['w-5 h-5 flex-shrink-0']"></downtray-icon>
            </StyleButton>
        </div>
    </section>
    <!-- end header  -->

    <!-- progress bar  -->
    <progressInfo :name1='"Payments"' :name2='"Welfares"' :name3='"Welfares Owed"' :percent1=paidPercent
        :percent2=welfInPercent :percent3=welfOwedPercent></progressInfo>
    <!-- end progress bar  -->
</template>

<script setup>
    import { reactive, defineProps , computed, defineEmits, onMounted} from 'vue';
    
    //moment 
    import moment from 'moment';

    const props = defineProps({
        cycle: {
            type: Object,
            required: true,
        },
        border: {
            type: Array,
            required: true,
        },
        class: {
            type: Array,
            required: true,
        },
        percent: {
            type: String,
            required: true,
        },
    })

    const emit = defineEmits(['editCycle', 'deleteCycle', 'view'])

    const classInfo = reactive ({
        progressMainWelf: 'alerts flex h-6 items-center justify-center rounded-r-full bg-gradient-to-r from-gray-300 via-teal-500 to-emerald-800 text-sm leading-none',
        svgClass: 'md:w-8 md:h-8 w-6 h-6',

        btn1: 'Update Payment Cycle',
        btn2: 'Delete Payment Cycle',
        btn3: 'Download Payment Cycle Excelsheet',

        title1: '',
        title2: '',
        title3: '',

        flashMessage: '',
        alertType: '',

        selected: false,

        svgClass: 'md:w-6 md:h-6 w-6 h-6',

        successBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-green-900 border-black bg-green-400 rounded-md shadow-md py-1 px-2 my-auto',
        purpleBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-purple-900 border-black bg-purple-400 rounded-md shadow-md py-1 px-2 my-auto',
        infoBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-cyan-900 border-black bg-cyan-400 rounded-md shadow-md py-1 px-2 my-auto',
        failBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-red-900 border-black bg-rose-400 rounded-md shadow-md py-1 px-2 my-auto',
    })

    onMounted(() => {
        set()
    })

    const mainTotal = computed(() => {
        const paymentsTotal = parseFloat(props.cycle.payments_total) || 0; // Fallback to 0 if NaN
        const welfaresInTotal = parseFloat(props.cycle.welfaresin_total) || 0; // Fallback to 0 if NaN
        const welfaresOwedTotal = parseFloat(props.cycle.welfaresowed_total) || 0; // Fallback to 0 if NaN

        return (paymentsTotal + welfaresInTotal + welfaresOwedTotal).toFixed(2);
    });

    const paidPercent = computed(() => {
        if (mainTotal.value == 0) {
            return 0;
        } else {
            const paymentsTotal = parseFloat(props.cycle.payments_total) || 0; // Fallback to 0 if NaN
            return ((paymentsTotal / mainTotal.value) * 100).toFixed(2);
        }
    });

    const welfInPercent = computed(() => {
        if (mainTotal.value == 0) {
            return 0;
        } else {
            const welfaresInTotal = parseFloat(props.cycle.welfaresin_total) || 0; // Fallback to 0 if NaN
            return ((welfaresInTotal / mainTotal.value) * 100).toFixed(2);
        }
    });

    const welfOwedPercent = computed(() => {
        if (mainTotal.value == 0) {
            return 0;
        } else {
            const welfaresOwedTotal = parseFloat(props.cycle.welfaresowed_total) || 0; // Fallback to 0 if NaN
            return ((welfaresOwedTotal / mainTotal.value) * 100).toFixed(2);
        }
    });

    function set() {
        classInfo.title1 = `Total Payment : ${Number(paidPercent).toFixed(1)}% - KSH ${props.cycle.payments_total}`,
        classInfo.title2 = `Total Welfare : ${Number(welfInPercent).toFixed(1)}% - KSH ${props.cycle.welfaresin_total}`,
        classInfo.title3 = `Total Welfare Owed : ${Number(welfOwedPercent).toFixed(1)}% - KSH ${props.cycle.welfaresowed_total}`
    }

    function downloadSheet(cycle) {
        let url     = '/download/current/' + cycle.id;
        let header  = cycle.name +' Paid Members Only!';
        let button  = `Paid Members Sheet`;
        let body    = 'info';
        let message = 'Download ' + cycle.name +' With Paid Members Only Excelsheet!';

        emit('view', message, body, header, url, button, 15000, false);
    }

    function downloadActiveSheet(cycle) {
        let url     = '/download/current/active/' + cycle.id;
        let header  = cycle.name +' Active Members Only!';
        let button  = `Active Members Sheet`;
        let body    = 'info';
        let message = 'Download ' + cycle.name +' With Active Members Only Excelsheet!';

        emit('view', message, body, header, url, button, 15000, false);
    }

    function downloadAllSheet(cycle) {
        let url     = '/download/current/all/' + cycle.id;
        let header  = cycle.name +' All Members!';
        let button  = `All Members Sheet`;
        let body    = 'info';
        let message = 'Download ' + cycle.name +' With All Members Excelsheet!';

        emit('view', message, body, header, url, button, 15000, false);
    }

    function showCycle(cycle) {
        emit('editCycle', cycle);
    }

    function showCycleDelete(cycle) {
        emit('deleteCycle', cycle);
    }
</script>