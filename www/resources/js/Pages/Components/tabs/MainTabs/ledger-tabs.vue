<template>
    <div class="topToggleLedgers flex-col space-y font-boldened">
        <viewToggle v-if="isDashboard" :title="'Ledger'" :show="classInfo.viewShow" :length="props.cycleinfo[6]"
            @toggle="toggleInfo"></viewToggle>

        <div class="flex-col space-y" v-if="classInfo.viewShow">
            <section
                :class="['w-full m-2 text-left mx-auto rounded-xl border-2 shadow-md overflow-hidden', !classInfo.noCycles ? 'border-cyan-500 p-2 bg-cyan-400/10 dark:bg-cyan-800/10' : 'border-rose-500 p-2 bg-gray-rose/10 dark:bg-rose-800/10']">
                <p
                    :class="['text-sm my-1 font-sans uppercase text-center', !classInfo.noCycles ? 'text-cyan-300 dark:text-cyan-300' : 'text-red-300 dark:text-red-300']">
                    <span class="underline font-medium">Welcome to the ledgers tab!</span>
                </p>
                <p :class="['text-md my-1 font-boldened uppercase text-center underline underline-offset-8 decoration-2 tracking-wide', !classInfo.noCycles ? 'text-blue-300 dark:text-blue-300 decoration-cyan-300 dark:decoration-cyan-300' : 'text-red-300 dark:text-red-300 decoration-rose-300 dark:decoration-rose-300']"
                    v-html="!classInfo.noCycles ? 'Download a ledgers: Yearly, Monthly or Within any duration.' : 'Unfortunately you have not created any payment cycles so as to view any ledgers.'">
                </p>
            </section>

            <section class="grid grid-cols-1 lg:grid-cols-5 gap-1" v-if="!classInfo.noCycles">
                <div
                    class="m-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-2 border-cyan-600 dark:border-cyan-600 h-fit col-span-1 lg:col-span-2">
                    <ol class="relative border-s border-gray-200 dark:border-gray-700 py-1 mx-2">
                        <div class="mb-1 ms-2">
                            <h3 :class="[classInfo.headerClass]">
                                <span class="underline">Select Ledger Timeframe</span>
                            </h3>
                            <p class="mb-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                                Get access to all information stored in the system till now in excel form.
                            </p>
                            <span class="w-full inline-flex justify-between text-gray-500 uppercase my-0.5 text-sm">
                                <span>from: <u>{{ classInfo.startName }}</u></span>
                                <span>to: <u>{{ classInfo.endName }}</u></span>
                            </span>
                            <section class="grid grid-cols-2 md:grid-cols-1 w-full gap-2 my-2">
                                <div class="w-full flex-col space-y col-span-1 md:col-span-1">
                                    <label for="year" value="Select Start"
                                        class="w-full text-gray-300 underline uppercase">Start Month</label>
                                    <select id="start" v-model="classInfo.start" name="start"
                                        :class="classInfo.selectClass">
                                        <option v-for="(month, index) in reversedCycleMonths" :value="month.id"
                                            class="uppercase my-1">
                                            {{ index + 1 }}. {{ month.month }} {{ month.year }}
                                        </option>
                                    </select>
                                </div>

                                <div class="w-full flex-col space-y col-span-1 md:col-span-1">
                                    <label for="end" value="Select End"
                                        class="w-full text-gray-300 underline uppercase">End Month</label>
                                    <select id="end" v-model="classInfo.end" name="end" :class="classInfo.selectClass">
                                        <option v-for="(month, index) in classInfo.endMonths" :value="month.id"
                                            class="uppercase my-1">
                                            {{ classInfo.endMonths.length - index }}. {{ month.month }} {{ month.year }}
                                        </option>
                                    </select>
                                </div>
                            </section>
                            <section class="w-full inline-flex my-0.5">
                                <a :class="[isFilled ? classInfo.btnSelect : classInfo.btnDanger]"
                                    @click="isFilled ? downloadMonths(classInfo.start, classInfo.end) : getAlert()">
                                    <span
                                        v-html="isFilled ? `Download ${classInfo.countNo} ${pluralCheck(classInfo.countNo, 'month')} Ledger`: `Select ${pluralCheck(classInfo.countNo, 'month')}`"></span>
                                    <downtray-icon
                                        class="w-3 h-3 md:w-4 md:h-4 me-2.5 whitespace-nowrap"></downtray-icon>
                                </a>
                            </section>
                        </div>
                    </ol>
                </div>
                <div
                    class="m-1 p-2 py-4 rounded-lg bg-gray-50 dark:bg-gray-800 border-2 border-cyan-600 dark:border-cyan-600 h-fit col-span-1 lg:col-span-3">
                    <ol class="relative border-s border-gray-200 dark:border-gray-700 p-2 mx-2">
                        <div class="my-2 ms-2">
                            <h3 :class="[classInfo.headerClass]">
                                <span class="underline">Complete Ledger</span>
                                <span
                                    class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Full</span>
                            </h3>
                            <ActionButton :buttonClass="'info'" :tooltipText="`Download Full Ledger`"
                                :buttonText="`Download Full Ledger`" class="rounded-md shadow-md w-full font-boldened"
                                @handleClick="downloadLedger">
                                <downtray-icon class="w-4 h-4 md:w-6 md:h-6"></downtray-icon>
                            </ActionButton>
                        </div>
                        <div class="my-2 ms-2">
                            <h3 :class="[classInfo.headerOption]">
                                <span>
                                    <u>Ledgers By Year</u>
                                    <span class="text-2xs ml-2 text-gray-300/50 dark:text-gray-300/50">
                                        ( {{ props.cycleinfo[0].length }} {{ pluralCheck(props.cycleinfo[0].length, 'year') }} )
                                    </span>
                                </span>
                            </h3>

                            <section class="flex-col w-full py-3 space-y rounded-lg">
                                <Dropdown :name="'Download Ledger By Year'" :downloadsyear=props.cycleinfo[0]>
                                </Dropdown>
                            </section>
                        </div>
                        <div class="my-2 ms-2">
                            <h3 :class="[classInfo.headerOption]">
                                <span>
                                    <u>Ledgers By Months</u>
                                    <span class="text-2xs ml-2 text-gray-300/50 dark:text-gray-300/50">
                                        (Past {{ props.cycleinfo[1].length }} {{ pluralCheck(classInfo.countNo, 'month') }} )
                                    </span>
                                </span>
                            </h3>

                            <section class="flex-col w-full py-3 space-y rounded-lg">
                                <Dropdown :name="'Download Ledger By Month'" :downloadsmonth=props.cycleinfo[1]>
                                </Dropdown>
                            </section>
                        </div>
                    </ol>
                </div>
            </section>
        </div>
        <hr-line :color="classInfo.viewShow ? 'border-cyan-500/50' : 'border-emerald-500/50'"></hr-line>
    </div>
</template>
 
<script setup>
    import { reactive, onBeforeMount, defineProps, computed, watch, nextTick } from 'vue'
    import { router }  from '@inertiajs/vue3';
    import { flashShow, flashShowView, scrollToToggle, pluralCheck} from '../../../Globals/flashMessages'

    const props = defineProps({
        cycleinfo: {
            type: Array,
            required: true,
        }
    })

    const classInfo = reactive({
        btnSelect: 'inline-flex items-center p-2 text-sm md:text-base font-normal text-gray-900 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring focus:outline-none focus:ring-cyan-200 focus:text-blue-700 dark:bg-cyan-400 dark:text-gray-800 dark:border-gray-900 dark:hover:text-black dark:hover:bg-cyan-700 dark:focus:ring-cyan-700 uppercase w-full justify-between my-2',
        btnDanger: 'inline-flex items-center p-2 text-sm md:text-base font-normal text-red-900 bg-white border-2 border-red-200 rounded-lg hover:bg-red-100 hover:text-red-700 focus:z-10 focus:ring focus:outline-none focus:ring-red-200 focus:text-blue-700 dark:bg-red-700 dark:text-gray-900 dark:border-gray-900 dark:hover:text-black dark:hover:bg-red-800 dark:focus:ring-red-700 uppercase w-full justify-between my-2 cursor-not-allowed',
        spanClass: 'absolute flex items-center justify-center w-2 h-2 md:w-3 md:h-3 bg-blue-100 rounded-full -start-2.5 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900',
        svgClass: 'w-3 h-3 text-blue-800 dark:text-blue-300',
        headerClass: 'inline-flex items-center mb-1 text-md md:text-xl font-normal uppercase text-gray-900 dark:text-white dark:hover:text-cyan-500 justify-between w-full hover:cursor-pointer',
        headerOption: 'inline-flex items-center mb-1 text-md md:text-xl font-normal uppercase text-gray-900 dark:text-white dark:hover:text-cyan-500 justify-between w-full hover:cursor-pointer',
        headerMain: 'font-normal md:text-2xl text-xl text-cyan-800 dark:text-gray-300 leading-tight uppercase py-1 w-full inline-flex justify-between my-1 hover:text-cyan-500 dark:hover:text-cyan-500 cursor-pointer',
        selectClass: 'bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full',
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
        if (classInfo.start && classInfo.end) {
            classInfo.filled = true;
            return classInfo.filled;
        } else {
            classInfo.filled = false;
            return classInfo.filled;
        }  
    })

    const isDashboard = computed(() => {
        return router.page.props.route === 'Dashboard';
    })

    function setInfo() {
        classInfo.cycleYears    = props.cycleinfo[0]
        classInfo.cycleMonths   = props.cycleinfo[1]
        classInfo.endMonths     = props.cycleinfo[1]
        classInfo.firstMonth    = props.cycleinfo[2]
        classInfo.lastMonth     = props.cycleinfo[3]
        classInfo.startName     = props.cycleinfo[4]
        classInfo.endName       = props.cycleinfo[5]
        classInfo.countNo       = props.cycleinfo[6]

        if (props.cycleinfo[6] == 0) {
            classInfo.noCycles = true;
        } else {
            classInfo.noCycles = false;
        }
    }

    const reversedCycleMonths = computed(() => {
        return [...classInfo.cycleMonths].reverse();
    })

    // START MONTH
    // Computed property to find the selected month based on classInfo.start
    const selectedStart = computed(() => {
        return classInfo.cycleMonths.find(month => month.id === classInfo.start);
    });
    // Watcher for classInfo.start changes
    watch(() => classInfo.start,(newStart) => {
            if (selectedStart.value) {
                classInfo.endMonths = classInfo.cycleMonths.filter(month => month.id > selectedStart.value.id);
                checkStart(selectedStart.value);
            }
        }
    )
    function checkStart(month) {
        classInfo.endMonths = classInfo.cycleMonths.filter(month => month.id > classInfo.start);
        classInfo.startName = month.name;

        classInfo.countNo   = isFilled ? classInfo.endMonths.length + 1 : classInfo.endMonths.length

        let body = classInfo.endMonths.length == 0 ? 'file' : 'fileOk';
        let message = `Starting Month: ${month.name}! ${classInfo.countNo} ${pluralCheck(classInfo.countNo, 'month')} available for the ledger!`;
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
    // Computed property to find the selected month based on classInfo.end
    const selectedEnd = computed(() => {
        return classInfo.cycleMonths.find(month => month.id === classInfo.end);
    });
    // Watcher for classInfo.end changes
    watch(() => classInfo.end,(newEnd) => {
            if (selectedEnd.value) {
                checkEnd(selectedEnd.value);
            }
        }
    )
    function checkEnd(month) {
        let finalMonths = classInfo.endMonths.filter(month => month.id < classInfo.end);
        classInfo.endName  = month.name;
        // classInfo.countNo  = finalMonths.length + 2

        classInfo.countNo   = isFilled ? finalMonths.length + 2 : finalMonths.length + 1

        let body = classInfo.countNo == 0 ? 'file' : 'fileOk';
        let message = `Ending Month: ${month.name}! ${classInfo.countNo} ${pluralCheck(classInfo.countNo, 'month')} in the ledger!`;
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

        if (classInfo.start === '' && classInfo.end === '') {
            message = "Select Opening and Ending Months!";
        } else if (classInfo.start === '' && classInfo.end !== '') {
            message = "Select An Opening Month!";
        } else if (classInfo.start !== '' && classInfo.end === '') {
            message = "Select An Ending Month!";
        } else {
            return; // Exit if both start and end are selected
        }
        
        flashShow(message, body);
    }

    function toggleInfo(message, type) {
        classInfo.viewShow = !classInfo.viewShow;

        flashShow(message, type)

        nextTick(() => {
            scrollToToggle('.topToggleLedgers')
        });
    }

    function downloadMonths(start, end) {
        let url     = '/download/ledger/'+ start + '/' + end;
        let header  = `${classInfo.startName} - ${classInfo.endName} Ledger!`;
        let button  = `Download Ledger`;
        let message = `Download a monthly ledger report consisting of all payment cycles from ${classInfo.startName} to ${classInfo.endName}?`;

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
</script>