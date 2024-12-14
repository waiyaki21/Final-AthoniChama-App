<template>
        <!-- info section  -->
        <section class="font-normal text-3xl text-cyan-900 dark:text-gray-300 leading-tight uppercase py-1 w-full inline-flex justify-between" preserve-scroll>
            <span class="underline">All Group Members.</span>
        </section>

        <section :class="[classInfo.infoSection]" preserve-scroll> 
            <!-- <section class="w-full m-1 p-1 text-left grid grid-cols-2 md:grid-cols-4 gap-1">
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
            </section> -->
            <section :class="[classInfo.sectionBorder, 'grid grid-cols-2 md:grid-cols-4 gap-1']">
                <a class="block max-w-sm p-2 bg-transparent">
                    <h5 :class="[classInfo.infoHeader]" v-tooltip="$tooltip(classInfo.btn1.toUpperCase(), 'top')">
                        <span>Members No.</span>
                        <info-icon class="flex-shrink-0 inline w-3 h-3 ml-0.5"></info-icon> 
                    </h5>
                    <p class="font-normal text-left text-2xl md:text-3xl text-blue-700 dark:text-blue-600 uppercase">
                        {{ Number(members).toLocaleString() }} Members
                    </p>
                </a>

                <a class="block max-w-sm p-2 bg-transparent">
                    <h5 :class="[classInfo.infoHeader]" v-tooltip="$tooltip(classInfo.btn2.toUpperCase(), 'top')">
                        <span>G.Total Contributed</span>
                        <info-icon class="flex-shrink-0 inline w-3 h-3 ml-0.5"></info-icon> 
                    </h5>
                    <p class="font-normal text-left text-2xl md:text-3xl text-green-700 dark:text-green-600 uppercase" v-tooltip="$tooltip('KSH ' + Number(grandtotal).toLocaleString(), 'top')">
                        <!-- ksh {{ numFormat(paySum) }} -->
                        ksh {{ numFormat(grandtotal) }}
                    </p>
                </a>

                <a class="block max-w-sm p-2 bg-transparent">
                    <h5 :class="[classInfo.infoHeader]" v-tooltip="$tooltip(classInfo.btn3.toUpperCase(), 'top')">
                        <span>Total Welfare</span>
                        <info-icon class="flex-shrink-0 inline w-3 h-3 ml-0.5"></info-icon> 
                    </h5>
                    <p class="font-normal text-left text-2xl md:text-3xl text-cyan-700 dark:text-cyan-600 uppercase" v-tooltip="$tooltip('KSH ' + Number(welfSum).toLocaleString(), 'top')">
                        ksh {{ numFormat(welfSum) }}
                    </p>
                </a>

                <a class="block max-w-sm p-2 bg-transparent">
                    <h5 :class="[classInfo.infoHeader]"  v-tooltip="$tooltip(classInfo.btn4.toUpperCase(), 'top')">
                        <span>Active Members</span>
                        <info-icon class="flex-shrink-0 inline w-3 h-3 ml-0.5"></info-icon> 
                    </h5>
                    <p class="font-normal text-left text-2xl md:text-3xl text-green-700 dark:text-green-600 uppercase">
                        {{ Number(active).toLocaleString() }} Members
                    </p>
                </a>

                <a class="block max-w-sm p-2 bg-transparent">
                    <h5 :class="[classInfo.infoHeader]" v-tooltip="$tooltip(classInfo.btn5.toUpperCase(), 'top')">
                        <span>Inactive Members</span>
                        <info-icon class="flex-shrink-0 inline w-3 h-3 ml-0.5"></info-icon> 
                    </h5>
                    <p class="font-normal text-left text-2xl md:text-3xl text-red-700 dark:text-red-600 uppercase">
                        {{ Number(inactive).toLocaleString() }} Members
                    </p>
                </a>

                <a class="block max-w-sm p-2 bg-transparent">
                    <h5 :class="[classInfo.infoHeader]" v-tooltip="$tooltip(classInfo.btn6.toUpperCase(), 'top')">
                        <span>T. Amount Before</span>
                        <info-icon class="flex-shrink-0 inline w-3 h-3 ml-0.5"></info-icon> 
                    </h5>
                    <p class="font-normal text-left text-2xl md:text-3xl text-purple-700 dark:text-purple-600 uppercase" v-tooltip="$tooltip('KSH ' + Number(amntbefore).toLocaleString(), 'top')">
                        KSH {{ numFormat(amntbefore) }}
                    </p>
                </a>

                <a class="block max-w-sm p-2 bg-transparent">
                    <h5 :class="[classInfo.infoHeader]"  v-tooltip="$tooltip(classInfo.btn7.toUpperCase(), 'top')">
                        <span>T. Welfares In</span>
                        <info-icon class="flex-shrink-0 inline w-3 h-3 ml-0.5"></info-icon> 
                    </h5>
                    <p class="font-normal text-left text-2xl md:text-3xl text-emerald-700 dark:text-emerald-600 uppercase" v-tooltip="$tooltip('KSH ' + Number(welfareIn).toLocaleString(), 'top')">
                        KSH {{ numFormat(welfareIn) }}
                    </p>
                </a>

                <a class="block max-w-sm p-2 bg-transparent">
                    <h5 :class="[classInfo.infoHeader]" v-tooltip="$tooltip(classInfo.btn8.toUpperCase(), 'top')">
                        <span>T. Welfares Owed</span>
                        <info-icon class="flex-shrink-0 inline w-3 h-3 ml-0.5"></info-icon> 
                    </h5>
                    <p class="font-normal text-left text-2xl md:text-3xl text-orange-700 dark:text-orange-600 uppercase" v-tooltip="$tooltip('KSH ' + Number(welfareOwed).toLocaleString(), 'top')">
                        KSH {{ numFormat(welfareOwed) }}
                    </p>
                </a>
            </section>
        </section>
</template>

<script setup>
    import { onMounted, reactive, defineProps, computed } from 'vue';

    const props = defineProps ({
        members : {
            type: String,
            required: true
        },
        paySum : {
            type: String,
            required: true
        },
        welfSum : {
            type: String,
            required: true
        },
        active : {
            type: String,
            required: true
        },
        inactive : {
            type: String,
            required: true
        },
        amntbefore : {
            type: String,
            required: true
        },
        grandtotal : {
            type: String,
            required: true
        },
        welfareIn : {
            type: String,
            required: true
        },
        welfareOwed : {
            type: String,
            required: true
        },
    })

    const classInfo = reactive({

        btn1: 'Total no of payment cycles',
        btn2: 'Total amount contributed in all cycles',
        btn3: 'Total welfare contributed in all cycles',
        btn4: 'Total no of active members',
        btn5: 'Total no of members',
        btn6: 'Total Sum of amount contributed before system start',
        btn7: 'Total Sum of Welfares',
        btn8: 'Total Welfares Owed',

        // main progress bar 
        progressMainBorder: 'border border-cyan-500 p-1 overflow-hidden',
        progressMainClass: 'alerts flex h-6 items-center justify-center rounded-full bg-gradient-to-r from-gray-200 via-cyan-600 to-blue-500 text-sm leading-none',
        infoSection: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-cyan-500 p-1 overflow-hidden bg-cyan-600/10 dark:bg-cyan-600/10',
        infoHeader: 'text-cyan-900 dark:text-cyan-300 mb-1 md:text-xl sm:text-md text-left font-normal underline tracking-tight uppercase',

        progressMainBorder100: 'border border-emerald-500 p-1 overflow-hidden',
        progressMainClass100: 'alerts flex h-1 items-center justify-center rounded-full bg-gradient-to-r from-grey-300 via-emerald-600 to-green-600 text-sm leading-none',
        infoSection100: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-emerald-500 p-1 overflow-hidden bg-emerald-600/10 dark:bg-emerald-600/10',
        infoHeader100: 'text-emerald-300 mb-1 md:text-xl sm:text-md text-left font-normal underline tracking-tight uppercase',

        progressMainBorderZero: 'border border-red-500 p-1 overflow-hidden',
        progressMainClassZero: 'alerts flex h-6 items-center justify-center rounded-full bg-gradient-to-r from-orange-300 via-rose-600 to-red-500 text-sm leading-none',
        infoSectionZero: 'w-full mx-2 mb-1 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-rose-500 overflow-hidden bg-rose-600/10 dark:bg-rose-600/10',
        infoHeaderZero: 'text-red-300 mb-1 md:text-xl sm:text-md text-left font-normal underline tracking-tight uppercase',
    })

    const infoBlocks = computed(() => [
        {
            label: 'Members No.',
            value: `${props.members} Members`,
            tooltipKey: `${classInfo.btn1}`,
            valueText: 'Members',
            colorClass: 'text-blue-700 dark:text-blue-600',
        },
        {
            label: 'G.Total Contributed',
            value: `ksh ${numFormat(props.grandtotal)}`,
            tooltipKey: `${classInfo.btn2}`,
            valueText: 'KSH ',
            colorClass: 'text-green-700 dark:text-green-600',
        },
        {
            label: 'Total Welfare',
            value: `ksh ${numFormat(props.welfSum)}`,
            tooltipKey: `${classInfo.btn3}`,
            valueText: 'KSH ',
            colorClass: 'text-cyan-700 dark:text-cyan-600',
        },
        {
            label: 'Active Members',
            value: `${props.active} Members`,
            tooltipKey: `${classInfo.btn4}`,
            valueText: 'Members',
            colorClass: 'text-green-700 dark:text-green-600',
        },
        {
            label: 'Inactive Members',
            value: `${props.inactive} Members`,
            tooltipKey: `${classInfo.btn5}`,
            valueText: 'Members',
            colorClass: 'text-red-700 dark:text-red-600',
        },
        {
            label: 'T. Amount Before',
            value: `ksh ${numFormat(props.amntbefore)}`,
            tooltipKey: `${classInfo.btn6}`,
            valueText: 'KSH ',
            colorClass: 'text-purple-700 dark:text-purple-600',
        },
        {
            label: 'T. Welfares In',
            value: `ksh ${numFormat(props.welfareIn)}`,
            tooltipKey: `${classInfo.btn7}`,
            valueText: 'KSH ',
            colorClass: 'text-emerald-700 dark:text-emerald-600',
        },
        {
            label: 'T. Welfares Owed',
            value: `ksh ${numFormat(props.welfareOwed)}`,
            tooltipKey: `${classInfo.btn8}`,
            valueText: 'KSH ',
            colorClass: 'text-orange-700 dark:text-orange-600',
        },
    ]);

    onMounted(() => {
        progressMain()
    })

    function progressMain() {
        let percentMain = Math.floor((props.expSum) / props.projectSum * 100);
        switch (true) {
            case (percentMain = 100):
                classInfo.progressMainClass = classInfo.progressMainClass100;
                classInfo.progressMainBorder = classInfo.progressMainBorder100;
                classInfo.infoHeader = classInfo.infoHeader100;
                classInfo.infoSection = classInfo.infoSection100;
                break;
            case (percentMain > 50):
                classInfo.progressMainClass = classInfo.progressMainClass;
                classInfo.progressMainBorder = classInfo.progressMainBorder;
                classInfo.infoHeader = classInfo.infoHeader;
                classInfo.infoSection = classInfo.infoSection;
                break;
            case (percentMain < 50):
                classInfo.progressMainClass = classInfo.progressMainClassZero;
                classInfo.progressMainBorder = classInfo.progressMainBorderZero;
                classInfo.infoHeader = classInfo.infoHeaderZero;
                classInfo.infoSection = classInfo.infoSectionZero;
                break;
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