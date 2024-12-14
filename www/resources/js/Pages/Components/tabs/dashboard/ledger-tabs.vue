<template>
    <div class="p-2 flex-col space-y font-boldened">
        <h3 :class="[classStyle.headerMain]" @click="openView" preserve-scroll>
            <span>
                <span>Ledgers</span>
                <span class="text-xs text-gray-500 dark:text-gray-500 ml-2 md:ml-3">
                    ( Admin )
                </span>
            </span>

            <button class="cursor-pointer text-gray-300 hover:text-white dark:text-cyan-300 dark:hover:text-white bg-transparent dark:bg-transparent dark:hover:bg-cyan-700 border-2 border-gray-300 dark:border-cyan-300 dark:hover:border-cyan-500 rounded-full p-1 md:p-2 m-2 inline-flex justify-center">
                <down-icon class="w-3 h-3 md:w-4 md:h-4 text-gray-300 hover:text-white dark:text-cyan-300 dark:hover:text-white" v-if="!info.viewShow"></down-icon>
                <up-icon class="w-3 h-3 md:w-4 md:h-4 text-gray-300 hover:text-white dark:text-cyan-300 dark:hover:text-white" v-else></up-icon>
            </button>
        </h3>

        <div class="flex-col space-y" v-if="info.viewShow">
            <section class="w-full m-2 text-left mx-auto rounded-xl border-2 shadow-md border-cyan-500 p-2 overflow-hidden bg-gray-400/10 dark:bg-gray-800/10" v-if="!info.noCycles">
                <p class="text-md text-gray-500 dark:text-gray-200 my-1 font-sans">
                    <span class="underline font-medium">Welcome to the ledgers tab</span> from here you can download a full ledger of all the contributions payments, welfare payments , projects and project expenses for each payment cycle.
                </p> 
            </section>

            <section class="w-full m-2 text-left mx-auto rounded-xl border-2 shadow-md border-rose-500 p-2 overflow-hidden bg-gray-rose/10 dark:bg-rose-800/10" v-if="info.noCycles">
                <p class="text-sm text-red-300 dark:text-red-300 my-1 font-sans uppercase text-center">
                    <span class="underline font-medium">Welcome to the ledgers tab!</span>
                </p>
                <p class="text-md text-red-300 dark:text-red-300 my-1 font-boldened uppercase text-center underline  underline-offset-8 decoration-2 decoration-rose-300 dark:decoration-rose-300 tracking-wide">
                    Unfortunately you have not created any payment cycles so as to view any ledgers.
                </p> 
            </section>

            <section class="grid grid-cols-1 lg:grid-cols-5 gap-1" v-if="!info.noCycles">
                <div class="m-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-2 border-cyan-600 dark:border-cyan-600 h-fit col-span-1 lg:col-span-2">
                    <ol class="relative border-s border-gray-200 dark:border-gray-700 py-1 mx-2">
                        <div class="mb-1 ms-2">
                            <h3 :class="[classStyle.headerClass]">
                                <span class="underline">Select Ledger Timeframe</span>
                            </h3>
                            <p class="mb-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                                Get access to all information stored in the system till now in excel form.
                            </p>
                            <span class="w-full inline-flex justify-between text-gray-500 uppercase my-0.5 text-sm"> 
                                <span>from: <u>{{ info.startName }}</u></span> 
                                <span>to: <u>{{ info.endName }}</u></span>
                            </span>
                            <section class="grid grid-cols-2 md:grid-cols-1 w-full gap-2 my-2">
                                <div class="w-full flex-col space-y col-span-1 md:col-span-1">
                                    <label for="year" value="Select Start" class="w-full text-gray-300 underline uppercase">Start Month</label>
                                    <select id="start" v-model="info.start" name="start" class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full">
                                        <option v-for="(month, index) in reversedCycleMonths" :value="month.id" class="uppercase my-1">
                                            {{ index + 1 }}. {{ month.month }} {{ month.year }}
                                        </option>
                                    </select>
                                </div>

                                <div class="w-full flex-col space-y col-span-1 md:col-span-1">
                                    <label for="end" value="Select End" class="w-full text-gray-300 underline uppercase">End Month</label>
                                    <select id="end" v-model="info.end" name="end" class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full">
                                        <option v-for="(month, index) in info.endMonths" :value="month.id" class="uppercase my-1">
                                            {{ info.endMonths.length - index }}. {{ month.month }} {{ month.year }}
                                        </option>
                                    </select>
                                </div>
                            </section>
                            <section class="w-full inline-flex my-0.5">
                                <a :class="[isFilled ? classStyle.btnSelect : [classStyle.btnDanger, 'cursor-not-allowed']]" @click="isFilled ? downloadMonths(info.start, info.end) : getAlert">
                                    <span v-html="isFilled ? `Download ${info.countNo} Months Ledger`: `Select months`"></span>
                                    <downtray-icon class="w-3 h-3 md:w-4 md:h-4 me-2.5 whitespace-nowrap"></downtray-icon>
                                </a>
                            </section>
                        </div> 
                    </ol>
                </div> 
                <div class="m-1 p-2 py-4 rounded-lg bg-gray-50 dark:bg-gray-800 border-2 border-cyan-600 dark:border-cyan-600 h-fit col-span-1 lg:col-span-3">
                    <ol class="relative border-s border-gray-200 dark:border-gray-700 p-2 mx-2">
                        <div class="my-2 ms-2">
                            <h3 :class="[classStyle.headerClass]">
                                <span class="underline">Complete Ledger</span>
                                <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Full</span>
                            </h3>
                            <a :class="[classStyle.btnSelect]" @click="downloadLedger">
                                Download Full Ledger
                                <downtray-icon class="w-3 h-3 md:w-4 md:h-4 me-2.5 whitespace-nowrap"></downtray-icon>
                            </a>
                        </div>
                        <div class="my-2 ms-2">
                            <h3 :class="[classStyle.headerOption]">
                                <span>
                                    <u>Ledgers By Year</u>
                                    <span class="text-2xs ml-2 text-gray-300/50 dark:text-gray-300/50">
                                        ( {{ props.cycleinfo[0].length }} Years )
                                    </span>
                                </span>
                            </h3>

                            <section class="flex-col w-full p-1 space-y rounded-lg bg-gray-50 dark:bg-cyan-600/20 border-2 border-cyan-600 dark:border-cyan-600">
                                <Dropdown 
                                    :name          = "'Download Ledger By Year'"
                                    :downloadsyear = props.cycleinfo[0]
                                ></Dropdown>
                            </section>
                        </div>
                        <div class="my-2 ms-2">
                            <h3 :class="[classStyle.headerOption]">
                                <span>
                                    <u>Ledgers By Months</u>
                                    <span class="text-2xs ml-2 text-gray-300/50 dark:text-gray-300/50">
                                        (Past {{ props.cycleinfo[1].length }} Months )
                                    </span>
                                </span>
                            </h3>

                            <section class="flex-col w-full p-1 space-y rounded-lg bg-gray-50 dark:bg-cyan-600/20 border-2 border-cyan-600 dark:border-cyan-600">
                                <Dropdown 
                                    :name           = "'Download Ledger By Month'"
                                    :downloadsmonth = props.cycleinfo[1]
                                ></Dropdown>
                            </section>
                        </div>
                    </ol>
                </div>
            </section>
        </div>
        <hr-line :color="'border-cyan-500/50'"></hr-line>
    </div>
</template>
 
<script setup>
    import { reactive, onBeforeMount, defineProps, defineEmits, computed, watch } from 'vue'

    const emit = defineEmits(['flash', 'loading', 'view'])

    const props = defineProps({
        cycleinfo: {
            type: Array,
            required: true,
        }
    })

    const classStyle = reactive({
        btnSelect: 'inline-flex items-center p-2 text-sm md:text-base font-normal text-gray-900 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring focus:outline-none focus:ring-cyan-200 focus:text-blue-700 dark:bg-cyan-400 dark:text-gray-800 dark:border-gray-900 dark:hover:text-black dark:hover:bg-cyan-700 dark:focus:ring-cyan-700 uppercase w-full justify-between my-2',
        btnDanger: 'inline-flex items-center p-2 text-sm md:text-base font-normal text-red-900 bg-white border-2 border-red-200 rounded-lg hover:bg-red-100 hover:text-red-700 focus:z-10 focus:ring focus:outline-none focus:ring-red-200 focus:text-blue-700 dark:bg-red-700 dark:text-gray-900 dark:border-gray-900 dark:hover:text-black dark:hover:bg-red-800 dark:focus:ring-red-700 uppercase w-full justify-between my-2 cursor-not-allowed',
        spanClass: 'absolute flex items-center justify-center w-2 h-2 md:w-3 md:h-3 bg-blue-100 rounded-full -start-2.5 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900',
        svgClass: 'w-3 h-3 text-blue-800 dark:text-blue-300',
        headerClass: 'inline-flex items-center mb-1 text-md md:text-xl font-normal uppercase text-gray-900 dark:text-white dark:hover:text-cyan-500 justify-between w-full hover:cursor-pointer',
        headerOption: 'inline-flex items-center mb-1 text-md md:text-xl font-normal uppercase text-gray-900 dark:text-white dark:hover:text-cyan-500 justify-between w-full hover:cursor-pointer',
        headerMain: 'font-normal md:text-2xl text-xl text-cyan-800 dark:text-gray-300 leading-tight uppercase py-1 w-full inline-flex justify-between my-1 hover:text-cyan-500 dark:hover:text-cyan-500 cursor-pointer',
    })

    const info = reactive({
        cycleYears: [],
        cycleMonths: [],
        endMonths: [],
        countNo: '',
        cyclesNo: '',

        noCycles: false,

        lastMonth: {},
        firstMonth: {},

        viewShow: true,
        yearShow: false,
        monthShow: false,

        start: '',
        end: '',
        startName: '',
        endName: '',

        selected: false,
        filled: false
    })

    onBeforeMount(() => [
        setInfo(),
    ])

    const isFilled = computed(() => {
        // Check if year and file are not empty
        if (info.start && info.end) {
            info.filled = true;
            return info.filled;
        } else {
            info.filled = false;
            return info.filled;
        }  
    })

    function setInfo() {
        info.cycleYears    = props.cycleinfo[0]
        info.cycleMonths   = props.cycleinfo[1]
        info.endMonths     = props.cycleinfo[1]
        info.firstMonth    = props.cycleinfo[2]
        info.lastMonth     = props.cycleinfo[3]
        info.startName     = props.cycleinfo[4]
        info.endName       = props.cycleinfo[5]
        info.countNo       = props.cycleinfo[6]

        if (props.cycleinfo[6] == 0) {
            info.noCycles = true;
        } else {
            info.noCycles = false;
        }
    }

    const reversedCycleMonths = computed(() => {
        return [...info.cycleMonths].reverse();
    })

    // utility 
    function pluralCheck(count, name) {
        if (count == 1) {
            let text = `${name}`;
            return text;
        } else {
            let text = `${name}s`;
            return text;
        }
    }

    // START MONTH
    // Computed property to find the selected month based on info.start
    const selectedStart = computed(() => {
        return info.cycleMonths.find(month => month.id === info.start);
    });
    // Watcher for info.start changes
    watch(() => info.start,(newStart) => {
            if (selectedStart.value) {
                info.endMonths = info.cycleMonths.filter(month => month.id > selectedStart.value.id);
                checkStart(selectedStart.value);
            }
        }
    )
    function checkStart(month) {
        info.endMonths = info.cycleMonths.filter(month => month.id > info.start);
        info.startName = month.name;

        info.countNo   = isFilled ? info.endMonths.length + 1 : info.endMonths.length

        let body = info.endMonths.length == 0 ? 'file' : 'fileOk';
        let message = `Starting Month: ${month.name}! ${info.countNo} ${pluralCheck(info.countNo, 'month')} available for the ledger!`;
        flashShow(message, body)

        if (!isFilled) {
            setTimeout(() => {
                let message = "Select an ending month!";
                let body    = 'info';
                flashShow(message, body)
            }, 500);
        } 
    }

    // END MONTH
    // Computed property to find the selected month based on info.end
    const selectedEnd = computed(() => {
        return info.cycleMonths.find(month => month.id === info.end);
    });
    // Watcher for info.end changes
    watch(() => info.end,(newEnd) => {
            if (selectedEnd.value) {
                checkEnd(selectedEnd.value);
            }
        }
    )
    function checkEnd(month) {
        let finalMonths = info.endMonths.filter(month => month.id < info.end);
        info.endName  = month.name;
        // info.countNo  = finalMonths.length + 2

        info.countNo   = isFilled ? finalMonths.length + 2 : finalMonths.length + 1

        let body = info.countNo == 0 ? 'file' : 'fileOk';
        let message = `Ending Month: ${month.name}! ${info.countNo} ${pluralCheck(info.countNo, 'month')} in the ledger!`;
        flashShow(message, body)
    }

    function selectMonths(a) {
        axios.get('/download/ledger/cycle/' + a)
            .then(
                ({ data }) => {
                    let info           = data[0];
                    let flashMessage   = a + ' :Payment Cycles!';
                    let alertBody      = 'info';
                    flashShow(flashMessage, alertBody);
                });
    }

    function getAlert() {
        let message;
        let body = 'danger';

        if (info.start === '' && info.end === '') {
            message = "Select Opening and Ending Months!";
        } else if (info.start === '' && info.end !== '') {
            message = "Select An Opening Month!";
        } else if (info.start !== '' && info.end === '') {
            message = "Select An Ending Month!";
        } else {
            return; // Exit if both start and end are selected
        }

        flashShow(message, body);
    }

    function openView() {
        info.viewShow = !info.viewShow

        if (info.countNo == 0) {
            let message = "No Available Ledgers for download!";
            let body    = 'danger';
            flashShow(message, body)
        } else {
            info.noCycles = false;
            let message = "Welcome! Ledgers Available for download!";
            let body    = 'success';
            flashShow(message, body)
        }
    }

    function downloadMonths(start, end) {
        let url     = '/download/ledger/'+ start + '/' + end;
        let header  = `${info.startName} - ${info.endName} Ledger!`;
        let button  = `Download Ledger`;
        let message = `Download a monthly ledger report consisting of all payment cycles from ${info.startName} to ${info.endName}?`;

        flashShowView(message, 'fileOk', header, url, button, 15000, false);
    }

    function downloadLedger() {
        let url     = '/download/ledger';
        let header  = `Download Full Ledger!`;
        let button  = `Download Ledger`;
        let message = `Download a full ledger report consisting of all payment cycles this year?`;

        flashShowView(message, 'file', header, url, button, 15000, false);
    }
    // end ledgers modal

    function flashShow(message, body) {
        emit('flash', message, body)
    }

    function flashLoading(message) {
        classInfo.isLoading      = true;
        emit('timed', message, 'warning', 100000000)
    }

    function flashShowView(message, body, header, url, button, duration) {
        emit('view', message, body, header, url, button, duration);
    }
</script>