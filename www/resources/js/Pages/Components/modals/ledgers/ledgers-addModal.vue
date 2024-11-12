<template>
    <!-- update cycle modal  -->
    <Modal :show=classInfo.isOpen>
        <section class="p-2">
            <div class="w-full inline-flex justify-between mb-1">
                <h2
                    class="font-boldened text-2xl text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-2 w-full">
                    Upload Yearly Ledger.
                </h2>

                <button @click="closeModal" :class="[classInfo.modalCloseBtn]">
                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="font-boldened">
                <!-- upload sheet & form -->
                <h3 :class="[classInfo.mainHeader]">
                    {{ classInfo.tabheader }}
                </h3>

                <form @submit.prevent="submitLedgerForm" class="p-0 space-y-2">
                    <div class="flex-col items-center justify-center w-full space-y">
                        <InputLabel for="year" value="Select Cycle Year" class="w-full" />

                        <div class="w-full grid grid-cols-4 gap-2">
                            <select id="year" v-model="classInfo.year" name="year"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-1 shadow-md">
                                <option :value="moment().year() + 2">{{ moment().year() + 2}}</option>
                                <option :value="moment().year() + 1">{{ moment().year() + 1}}</option>
                                <option :value="moment().year()" selected>{{ moment().year() }}
                                </option>
                                <option :value="moment().year() - 1">{{ moment().year() - 1}}</option>
                                <option :value="moment().year() - 2">{{ moment().year() - 2}}</option>
                            </select>

                            <ActionButton :class="'col-span-3'"
                                :buttonClass="!classInfo.ledger_exist ? 'other' : 'danger'"
                                @click.prevent="$downloadFile('/download/template/cycle/' + classInfo.year), flashShow('Loading Template, Please Wait...', 'loading')"
                                :tooltipText="`Download ${classInfo.year} Template`"
                                :buttonText="`Download ${classInfo.year} Template.`">
                                <download-icon class="w-4 h-4 md:w-5 md:h-5"></download-icon>
                            </ActionButton>
                        </div>
                    </div>

                    <div class="flex justify-center w-full flex-col">
                        <InputLabel for="excel" value="Excel sheet upload" />

                        <label for="dropzone-file" :class="[classInfo.label, classInfo.labelClass]">
                            <div class="flex flex-col items-center justify-center py-2">
                                <cloud-icon class="w-8 h-8 mb-2 dark:text-white text-black"></cloud-icon>
                                <p class="mb-1 text-2xs"><span class="font-normal underline">Click to upload</span></p>
                                <p class="text-2xs">XLS, XLXS (MAX. 5MB)</p>
                            </div>
                            <input type="file" id="excel" name="excel" ref="excel"
                                class="my-2 overflow-hidden whitespace-nowrap w-[90%] text-2xs dark:text-white text-black border border-cyan-700 dark:border-cyan-700 rounded-xl"
                                @change="onChangeFile" />
                        </label>
                    </div>

                    <section class="w-full inline-flex justify-start my-1 px-2 md:px-8" v-if="isFilled" @click="classInfo.isInfo = !classInfo.isInfo">
                        <span :class="['text-center text-gray-900 dark:text-white inline-flex justify-between gap-2 w-full']">
                            <span :class="[classInfo.isInfo ? classInfo.failBadgeLg : classInfo.successBadgeLg]" v-html="classInfo.isInfo ? `Close Spreadsheet Info.` : `Show Spreadsheet Info.`"></span>
                            <span class="my-auto cursor-pointer">
                                <checksolid-icon v-if="!classInfo.isInfo" class="w-6 h-6 text-emerald-500 my-auto mx-auto" v-tooltip="$tooltip('Show File Info', 'left')"></checksolid-icon>
                                <timessolid-icon v-else class="w-6 h-6 text-rose-500 my-auto mx-auto" v-tooltip="$tooltip('Close File Info', 'left')"></timessolid-icon>
                            </span>
                        </span>
                    </section>

                    <section class="grid grid-cols-4 md:grid-cols-5 gap-1 my-1 border-base border-green-900 dark:border-green-900 rounded-md px-1 py-2 dark:bg-green-600 shadow-xl" v-if="isFilled & classInfo.isInfo">

                        <span :class="[classInfo.infoBadge, 'col-span-4 md:col-span-5 inline-flex justify-center gap-2 w-full text-2xs']" v-tooltip="$tooltip('File Info', 'top')">
                            {{ classInfo.upload_info }}
                            <download-icon
                            class="my-auto w-4 h-4 text-teal-800 dark:text-teal-500 ml-1"></download-icon>
                        </span>

                        <hr-line :color="'col-span-4 md:col-span-5 border-green-100 dark:border-green-900'"></hr-line>

                        <span :class="[classInfo.failBadge, 'col-span-1']" v-tooltip="$tooltip('Existing Members in the spreadsheet', 'top')">
                            {{ classInfo.members_existing }} Members
                        </span>

                        <span :class="[classInfo.infoBadge, 'col-span-1']" v-tooltip="$tooltip('New Members in the spreadsheet', 'top')" v-if="classInfo.members_left > 0">
                            {{ classInfo.members_left }} New
                        </span>

                        <span :class="[classInfo.purpleBadge, 'col-span-1']" v-tooltip="$tooltip('Total Contributions in the spreadsheet', 'top')">
                            KSH {{ Number(classInfo.totalPay).toLocaleString() }}
                        </span>

                        <span :class="[classInfo.successBadge, 'col-span-1']" v-tooltip="$tooltip('Total Welfares In Amnt in the spreadsheet', 'top')" v-if="classInfo.totalIn > 0">
                            KSH {{ Number(classInfo.totalIn).toLocaleString() }}
                        </span>

                        <span :class="[classInfo.warnBadge, 'col-span-1']" v-tooltip="$tooltip('Total Welfare Owed till April in the spreadsheet', 'top')">
                            KSH {{ Number(classInfo.totalOwe).toLocaleString() }}
                        </span>

                        <span :class="[classInfo.failBadge, 'col-span-1']" v-tooltip="$tooltip('Total Welfare Owed from May in the spreadsheet', 'top')">
                            KSH {{ Number(classInfo.totalOweMay).toLocaleString() }}
                        </span>

                        <span :class="[classInfo.infoBadge, 'col-span-4 md:col-span-5 inline-flex justify-center gap-2 w-full text-2xs']" v-tooltip="$tooltip('Total Investment', 'top')">
                            Total Investment - KSH {{ Number(classInfo.totalInv).toLocaleString() }}
                            <money-icon
                            class="my-auto w-4 h-4 text-teal-800 dark:text-teal-500 ml-1"></money-icon>
                        </span>
                    </section>

                    <div class="flex items-center justify-start mt-4">

                        <button :class="[isFilled ? submitState : [submitState, 'cursor-not-allowed']]" @click.once="isFilled ? handleclick : errorCheck">
                            <span v-if="!classInfo.ledger_exist">Upload {{ classInfo.year }} ledger Excelsheet</span>
                            <span v-else>Ledger Year {{ classInfo.year }} Already Exists</span>
                            <submit-icon class="w-6 h-6" v-if="!classInfo.isLoading"></submit-icon>
                            <loading-icon class="w-6 h-6 animate-spin" v-else></loading-icon>
                        </button>
                    </div>
                </form>

                <hr-line :color="'border-cyan-500/50 dark:border-cyan-500/50'"></hr-line>
                <!-- end upload sheet & form -->
            </div>
        </section>
    </Modal>
    <!-- end update cycle modal  -->
</template>

<script setup>
    import { defineProps, reactive, computed, watch, defineEmits, onMounted, onUnmounted, getCurrentInstance } from 'vue'
    import { router, useForm }       from '@inertiajs/vue3';
    import moment           from 'moment';

    const emit  = defineEmits(['reload', 'close', 'view', 'flash', 'timed', 'hide', 'loading', 'allhide'])

    const form = useForm({
        name: '',
        month: '',
        year: '',
    })

    const props = defineProps({
        info: {
            type: Object,
            required: true,
        },
        show : {
            type: Boolean,
            required:true
        }
    });

    const type = computed(() => props.show);

    const classInfo = reactive ({
        // alerts
        alertType: '',
        flashMessage: '',

        // modals 
        isOpen: false,
        modalData: {},

        modalCloseBtn: 'cursor-pointer dark:text-cyan-800 text-cyan-500 transition-transform hover:rotate-180 w-6 h-6 hover:w-8 hover:h-8',

        // form classess 
        mainHeader: 'font-boldened text-gray-800 dark:text-gray-300 leading-tight uppercase underline pb-1 md:text-2xl text-xl',

        year: moment().year(),
        isLoading: false,
        filled: false,
        isInfo: true,
        
        // template btns & classes
        templateInactive: 'text-white bg-gradient-to-r from-rose-500 to-red-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-normal rounded-lg text-sm px-4 py-3 text-center me-2 inline-flex justify-center uppercase col-span-3 shadow-md',
        templateActive: 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-normal rounded-lg text-sm px-4 py-3 text-center me-2 inline-flex justify-center uppercase col-span-3 shadow-md',
        templateLoading: 'text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 font-normal rounded-lg text-sm px-4 py-3 text-center me-2 inline-flex justify-center uppercase col-span-3 shadow-md',
        templateDanger: 'text-white bg-gradient-to-r from-red-500 to-rose-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-normal rounded-lg text-sm px-4 py-3 text-center me-2 inline-flex justify-center uppercase col-span-3 shadow-md',
        label: 'flex flex-col items-center justify-center w-full h-fit border-2 border-dashed rounded-lg cursor-pointer',
        labelActive: 'border-gray-300 bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600',
        labelInactive: 'border-red-400 border-dashed rounded-lg bg-red-400/50 dark:bg-red-700/50 dark:border-red-600 dark:hover:border-red-500 dark:hover:bg-red-600/50 text-black',
        labelLoading: 'border-orange-400 border-dashed rounded-lg bg-orange-400/50 dark:bg-orange-700/50 dark:border-orange-600 dark:hover:border-orange-500 dark:hover:bg-orange-600/50 text-black',
        labelDanger: 'border-red-400 border-dashed rounded-lg bg-red-400/50 dark:bg-red-700/50 dark:border-red-600 dark:hover:border-red-500 dark:hover:bg-red-600/50 text-black',
        SubmitActive: 'text-white bg-gradient-to-br from-cyan-600 to-green-500 hover:bg-gradient-to-bl focus:ring focus:outline-none focus:ring-blue-300 dark:focus:ring-green-800 font-normal rounded-lg text-md py-2 px-2.5 text-center mb-1 uppercase inline-flex justify-between w-full shadow-md',
        SubmitInactive: 'text-white bg-gradient-to-br from-rose-600 to-red-500 hover:bg-gradient-to-bl focus:ring focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-normal rounded-lg text-md py-2 px-2.5 text-center mb-1 uppercase inline-flex justify-between w-full shadow-md cursor-pointer',
        SubmitWarning: 'text-white bg-gradient-to-br from-orange-600 to-orange-500 hover:bg-gradient-to-bl focus:ring focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 font-normal rounded-lg text-md py-2 px-2.5 text-center mb-1 uppercase inline-flex justify-between w-full shadow-md cursor-pointer',
        SubmitLoading: 'text-white bg-gradient-to-br from-orange-600 to-orange-500 hover:bg-gradient-to-bl focus:ring focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 font-normal rounded-lg text-md py-2 px-2.5 text-center mb-1 uppercase inline-flex justify-between w-full shadow-md cursor-not-allowed disabled',
        SubmitDanger: 'text-white bg-gradient-to-br from-red-600 to-red-500 hover:bg-gradient-to-bl focus:ring focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-normal rounded-lg text-md py-2 px-2.5 text-center mb-1 uppercase inline-flex justify-between w-full shadow-md cursor-not-allowed disabled',
        labelClass: '',
        downloadBtn: '',
        SubmitBtn: '',

        clicked: false,

        // excel file data 
        excel_file: '',
        fileSelected: '',
        file_size: '',
        file_name: '',
        upload_info: '',

        // exist and response records 
        exist            : false,
        ledger_exist     : false,
        members_existing : '',
        members_left     : '',
        members_count    : '',
        oldMembers       : [],
        newMembers       : [],
        allMembers       : [],
        monthsInfo       : [],
        monthsCount      : '',
        monthsExpIn      : [],
        monthsExpOwed    : [],
        expInCount       : '',
        expOweCount      : '',
        totalPay         : '',
        totalIn          : '',
        totalOwe         : '',
        totalInv         : '',
        totalOweMay      : '',

        yearCycles       : '',
        currentYear      : true,

        // new info 
        cycleID          : '',
        cycleName        : '',

        loadingPercent   : 0,
        hasErrors        : false,
        confirmText      : '',

        successBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-green-900 border-black bg-green-400 rounded-md shadow-md py-1 px-2 my-auto w-full justify-center inline-flex cursor-pointer',
        purpleBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-purple-900 border-black bg-purple-400 rounded-md shadow-md py-1 px-2 my-auto w-full justify-center inline-flex cursor-pointer',
        infoBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-cyan-900 border-black bg-cyan-400 rounded-md shadow-md py-1 px-2 my-auto w-full justify-center inline-flex cursor-pointer',
        failBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-red-900 border-black bg-rose-400 rounded-md shadow-md py-1 px-2 my-auto w-full justify-center inline-flex cursor-pointer',
        warnBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-yellow-900 border-black bg-yellow-300 rounded-md shadow-md py-1 px-2 my-auto w-full justify-center inline-flex cursor-pointer',

        successBadgeLg : 'text-black dark:text-black md:text-sm text-xs uppercase underline border dark:border-green-900 border-black bg-green-400 rounded-md shadow-md py-1 px-2 my-auto w-full justify-center inline-flex cursor-pointer text-center w-full',
        failBadgeLg : 'text-black dark:text-black md:text-sm text-xs uppercase underline border dark:border-red-900 border-black bg-rose-400 rounded-md shadow-md py-1 px-2 my-auto w-full justify-center inline-flex cursor-pointer text-center w-full',
    })

    watch(type, (newValue) => {
        classInfo.isOpen = props.show;
        showModal(props.info);
    })

    watch(() => classInfo.year, (newYear, oldYear) => {
        if (newYear !== oldYear) {
            check(); // Call check when the year changes
        }
    })

    const isFilled = computed(() => {
        // Check if year and file are not empty
        if (classInfo.year && classInfo.fileSelected) {
            classInfo.filled = true;
            return classInfo.filled;
        } else {
            classInfo.filled = false;
            return classInfo.filled;
        }  
    })

    const closeOnEscape = (e) => {
        if (e.key === 'Escape' && props.show) {
            closeModal();
        }
    }

    onMounted(() => {
        // setInfo()
        clearAll();

        document.addEventListener('keydown', closeOnEscape);
    })

    onUnmounted(() => {
        document.removeEventListener('keydown', closeOnEscape);
        clearAll();
    })

    // open modal 
    function showModal(info) {
        classInfo.modalData = info;
        classInfo.isOpen    = props.show;
    }
 
    // close modal 
    function closeModal() {
        classInfo.modalData = {};
        clearFile();
        emit('close');
        classInfo.isOpen = props.show;
    }

    // computed 
    const downloadState = computed(() => {
        if (!classInfo.ledger_exist) {
            classInfo.downloadBtn       = classInfo.templateActive;
            classInfo.labelClass        = classInfo.labelActive;
            return classInfo.downloadBtn;
        } else {
            classInfo.downloadBtn   = classInfo.templateInactive;
            classInfo.labelClass    = classInfo.labelInactive;
            return classInfo.downloadBtn;
        }
    })

    const submitState = computed(() => {
        if (classInfo.isLoading) {
           classInfo.SubmitBtn = classInfo.SubmitLoading;
            return classInfo.SubmitBtn; 
        } else {
            if (classInfo.hasErrors) {
                classInfo.labelClass    = classInfo.labelDanger;
                classInfo.SubmitBtn     = classInfo.SubmitDanger;
                return classInfo.SubmitBtn;
            } else {
                if (classInfo.ledger_exist) {
                    classInfo.SubmitBtn = classInfo.SubmitLoading;
                    return classInfo.SubmitBtn;
                } else {
                    classInfo.SubmitBtn = classInfo.SubmitActive;
                    return classInfo.SubmitBtn;
                } 
            }
        }
    })

    // check year 
    function check() {
        loadingOn();
        axios.get('/ledger/excel/exist/'+ classInfo.year)
            .then(
                ({ data }) => {
                    classInfo.yearCycles        = data[0];
                    classInfo.flashMessage      = data[1];
                    classInfo.ledger_exist      = data[2];
                    classInfo.currentYear       = data[3];

                    if (data[2]) {
                        classInfo.alertType         = 'warning'; 
                        loadingWarning();
                    } else {
                        classInfo.alertType         = 'info';
                        setTimeout(() => {
                            loadingOk();    
                        }, 1000);
                    }
                    flashTimed(classInfo.flashMessage, classInfo.alertType, 20000);  
                });
    }

    // loading states 
    function loadingOn() {
        classInfo.isLoading     = true;
        classInfo.hasErrors     = false;
        classInfo.SubmitBtn     = classInfo.SubmitWarning;
        classInfo.downloadBtn   = classInfo.templateLoading;
        classInfo.labelClass    = classInfo.labelLoading;
        classInfo.loadingPercent = 0;
        // flashLoading();
    }

    function loadingOk() {
        flashHide();
        classInfo.isLoading     = false;
        classInfo.hasErrors     = false;
        classInfo.downloadBtn   = classInfo.templateLoading;
        classInfo.labelClass    = classInfo.labelInfo;
        classInfo.SubmitBtn     = classInfo.SubmitActive;
        setTimeout(() => {
            classInfo.loadingPercent = 0;
        }, 15000);
    }

    function loadingError() {
        classInfo.isLoading     = false;
        classInfo.hasErrors     = true;
        classInfo.downloadBtn   = classInfo.templateDanger;
        classInfo.labelClass    = classInfo.labelDanger;
        classInfo.SubmitBtn     = classInfo.SubmitDanger;
        setTimeout(() => {
            clearFile()
            loadingOk()
        }, 15000);
    }

    function loadingWarning() {
        classInfo.isLoading     = false;
        classInfo.hasErrors     = true;
        classInfo.downloadBtn   = classInfo.templateLoading;
        classInfo.labelClass    = classInfo.labelLoading;
        classInfo.SubmitBtn     = classInfo.SubmitLoading;
        setTimeout(() => {
            classInfo.ledger_exist = false;
            loadingOk()
        }, 10000);
    }
    // end loading states 

    // upload sheet 
    function handleclick() {
        if (!classInfo.clicked) {
            classInfo.clicked = true;
        }
    }

    // false submit 
    function errorCheck() {
        if (classInfo.ledger_exist) {
            alerts.flashMessage   = classInfo.year +' already exists and will be updated!';
            alerts.alertType      = 'warning';
            flashShow(alerts.flashMessage, alerts.alertType);
        }

        if (!classInfo.year) {
            alerts.flashMessage   = 'Select a year!';
            alerts.alertType      = 'warning';
            flashShow(alerts.flashMessage, alerts.alertType);
        }

        if (!classInfo.fileSelected) {
            alerts.flashMessage   = 'Upload a spreadsheet!';
            alerts.alertType      = 'warning';
            flashShow(alerts.flashMessage, alerts.alertType);
        }
    }

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

    // on file change 
    function onChangeFile(event) {
        flashLoading(`Checking Ledger: Months, Payments, Existing & New Member(s)!`);
        loadingOn();
        classInfo.fileSelected   = event.target.files.length;
        classInfo.excel_file     = event.target.files[0];
        classInfo.upload_info    = event.target.files[0].name;

        classInfo.file_size      = Number(event.target.files[0].size/ (1024 * 1024)).toFixed(2);
        classInfo.upload_info    = 'File Name ' + event.target.files[0].name + ' ' + classInfo.file_size + ' MBs';

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        let file = event.target.files[0];

        let fileData = file;
        let data     = new FormData();
        data.append('excel', fileData);

        axios.post('/ledger/check/excel/'+ classInfo.year, data, config)
            .then(({ data }) => {
                classInfo.members_existing  = data.existing_count;
                classInfo.members_left      = data.new_count;
                classInfo.members_count     = data.existing_count + data.new_count;
                classInfo.oldMembers        = data.existing_members;
                classInfo.newMembers        = data.new_members;
                classInfo.allMembers        = data.all_members;
                classInfo.exist             = data.exist;

                classInfo.monthsInfo        = data.monthly_contributions;
                classInfo.monthsCount       = data.months_count;
                classInfo.totalPay          = data.total_pay;
                classInfo.totalIn           = data.total_in;
                classInfo.totalOwe          = data.total_owe;
                classInfo.totalInv          = data.total_inv;
                classInfo.totalOweMay       = data.total_owemay;

                // totalContributions = memberContributions.reduce((sum, member) => sum + member.total_contributions, 0)

                // Array to hold messages
                let messages = [];
                
                // Helper function to generate message info
                const createMessage = (info, type, delay = 500, duration = 15000) => ({
                    info,
                    type,
                    delay,
                    duration
                });

                messages.push(
                    createMessage(
                        data.existing_count > 0
                            ? `${classInfo.members_existing} existing ${pluralCheck(data.existing_count, 'member')}, in ${classInfo.year} info will be updated!`
                            : `No (0) existing members in the spreadsheet!`,
                        'members', 100, 15000
                    ),
                    createMessage(
                        data.new_count > 0
                            ? `${classInfo.members_left} new ${pluralCheck(data.new_count, 'member')}, in ${classInfo.year} info will be submitted - If No new member exists check spellings on the spreadsheet!`
                            : `No (0) new members in the spreadsheet!`,
                        'newMembers', 150, data.new_count > 0 ? 20000 : 16000
                    ),
                    createMessage(
                        data.months_count > 0
                            ? `UPLOADED: ${classInfo.monthsCount} ${pluralCheck(data.months_count, 'month')} in ${classInfo.year} Spreadsheet!`
                            : `No (0) months in the spreadsheet!`,
                        'info', 200, 17000
                    ),
                    createMessage(
                        data.total_pay > 0
                            ? `Total Contributions - KSH ${Number(classInfo.totalPay).toLocaleString()} in ${classInfo.year} Speadsheet!`
                            : `Total Contributions - No (0) contribution payments in the spreadsheet!`,
                        'success', 250, 18000
                    ),
                    createMessage(
                        data.total_in > 0
                            ? `Total Welfare In - KSH ${Number(classInfo.totalIn).toLocaleString()} in ${classInfo.year} Speadsheet!`
                            : `Total Welfare In - No (0) welfare payments in the spreadsheet!`,
                        'success', 300, 18000
                    ),
                    createMessage(
                        data.total_owe > 0
                            ? `Total Welfare Owed Till April - KSH ${Number(classInfo.totalOwe).toLocaleString()} in ${classInfo.year} Speadsheet!`
                            : `Total Welfare Owed Till April - No (0) owed welfare payments in the spreadsheet!`,
                        'success', 350, 19000
                    ),
                    createMessage(
                        data.total_owemay > 0
                            ? `Total Welfare Owed From May - KSH ${Number(classInfo.totalOweMay).toLocaleString()} in ${classInfo.year} Speadsheet!`
                            : `Total Welfare Owed From May - No (0) owed welfare payments in the spreadsheet!`,
                        'success', 400, 19000
                    ),
                    createMessage(
                        data.total_inv > 0
                            ? `Total Investment - KSH ${Number(classInfo.totalInv).toLocaleString()} in ${classInfo.year} Speadsheet!`
                            : `No (0) Total Investment in the spreadsheet!`,
                        'success', 450, 18000
                    )
                );

                // Simplified messages array creation
                // Loop through months to create dynamic messages
                Object.entries(classInfo.monthsInfo).forEach(([month, contributions], index) => {
                    // Calculate the sum of contributions' amounts for the current month
                    let amountSum = contributions.reduce((total, contribution) => total + contribution.amount, 0);

                    messages.push(
                        createMessage(
                            `${month} ${classInfo.year} - ${contributions.length} ${pluralCheck(contributions.length, 'contribution')}: Ksh ${Number(amountSum).toLocaleString()}.`,
                            'ledger', 
                            3500 + (index * 1000), 
                            20000
                        )
                    );
                });

                // Final Ledger Analysis Complete message
                // messages.push(
                //     createMessage('Ledger Months & Member Analysis Complete', 'info', 4500, 25000)
                // );

                loadingOk();

                flashMessages(messages);
            })
            .catch(error => {
                loadingError();
                if (error.response.data.errors) {
                    let errors = error.response.data.errors.excel;
                    errors.forEach(error => {
                        flashShow(error, 'danger');
                    });
                }
            });
    }

    async function submitLedgerForm() {
        await flashAllHide();
        await flashShow(`Submitting New Members & Updating Existing Members!`, `info`) 

        classInfo.confirmText = `All existing members will be updated and new Members will added, ready?`;
        await submitSheetAsync();

        await flashShow(`Submitting New Payment Cycles & Updating Existing Payment Cycles!`, `info`) 
        classInfo.confirmText = `All existing payment cycles will be updated and new payment cycles will added, ready?`;
        await submitLedgerAsync();

        await getAllCycles(classInfo.year);
    }

    // Main function: submit members
    const submitSheetAsync = async () => {
        if (confirm(classInfo.confirmText)) {
            // Timed flash message
            flashTimed('Ledger Members processing, please wait...', 'loading', 60000);
 
            // Filter out the needed members
            const allMembers = classInfo.allMembers;

            // Loop through each member and await the Axios request
            for (let [index, member] of allMembers.entries()) {
                const remainingMembers  = allMembers.length - index - 1;
                let memberData          = `${member.name}`;

                try {
                    if (member.exists) {
                        form.name               = member.name;
                        form.telephone          = member.telephone;
                        form.amount_before      = member.amount_before;
                        form.welfare_before     = member.welfare_before;
                        form.welfareowed_before = member.welfareowed_before;
                        form.active             = member.active;

                        if (member.welfare_owing_may && classInfo.year >= 2024) {
                            form.welfare_owing_may = member.welfare_owing_may; 
                        }
    
                        // Await the Axios PUT request
                        await axios.put('/update/member/modal/' + member.id, form);

                        // Show a success flash message after the update
                        flashTimed(`${memberData} Updated. (${remainingMembers} members left)`, 'info', 2500);
                    } else {
                        form.name               = member.name;
                        form.telephone          = member.telephone;
                        form.amount_before      = member.amount_before;
                        form.welfare_before     = member.welfare_before;
                        form.welfareowed_before = member.welfareowed_before;
                        form.active             = member.active;

                        if (member.welfare_owing_may && classInfo.year >= 2024) {
                            form.welfare_owing_may = member.welfare_owing_may;
                        }
    
                        // Await the Axios GET request
                        await axios.post('/member', form);

                        // Show a success flash message after the update
                        flashTimed(`${memberData} Added. (${remainingMembers} members left)`, 'success', 1500);
                    }
                } catch (error) {
                    // Show an error flash message if the update fails
                    flashTimed(`${memberData} failed. (${remainingMembers} members left)`, 'danger', 60000);
                }

                // After all members are updated, show a final flash message
                if (remainingMembers === 0) {
                    flashHide();
                    const time = 9 * 90 * 90;
                    setTimeout(() => {
                        flashShow(`Upload Success.`, 'success', time);
                    }, 1000);
                    await refresh(); // Wait for the refresh method to complete
                    await getAllMembers(); // get all members 
                }
            }
        } else {
            flashAllHide();
            flashShow('Upload Cancelled', 'danger');
        }
    };

    // submit cycle spreadsheet 
    const submitLedgerAsync = async () => {
        if (confirm(classInfo.confirmText)) {
            flashHide();
            // Loop through each month in the contributions
            for (const [month, contributions] of Object.entries(classInfo.monthsInfo)) {
                // get remaining Months per each loop 
                const remainingMonths = Object.keys(classInfo.monthsInfo).length - Object.keys(classInfo.monthsInfo).indexOf(month) - 1;

                // start flash 
                let newMessage = '';
                newMessage = `${month} Processing, ${remainingMonths} ${pluralCheck(remainingMonths, 'month')}, Please Wait....`
                flashTimed(newMessage, 'loading', 20000);
                
                try {
                    // Send the POST request for each cycle
                    const { data } = await axios.post(`/import/ledger/cycles/modal/${month}/${classInfo.year}`)

                    classInfo.cycleID     = data.id;
                    classInfo.cycleName   = data.name;

                    // post the contributions in the cycle 
                    await postContributionsAsync(classInfo.cycleID, classInfo.cycleName, contributions)

                    // Array to hold messages
                    let messages = [];
                    
                    // Helper function to generate message info
                    const createMessage = (info, type, delay, duration) => ({
                        info,
                        type,
                        delay,
                        duration
                    });

                    // Simplified messages array creation
                    messages.push(
                        createMessage(
                            `${data.message}, Upload Success`,
                            data.type, 
                            1500, 
                            30000
                        )
                    );

                    // end flash 
                    await flashMessages(messages);
                } catch (error) {
                    loadingError();
                    if (error.response.data.errors) {
                        let errors = error.response.data.errors.excel;
                        errors.forEach(error => {
                            flashShow(error, 'danger');
                        });
                    }
                }
            }
        } else {
            flashHide();
            flashShow('Ledger Upload Cancelled', 'danger');
        }
    };

    // Function to post contributions for a given cycle
    const postContributionsAsync = async (id, name, contributions) => {
        try {
            // Notification for starting the process
            flashTimed(`${name} Payments processing, please wait...`, 'loading', 2000);

            // Iterate over contributions and post them sequentially
            for (const { name: memberName, telephone, member_id, pay_id, amount, exist } of contributions) {
                const contributionData = {
                    name: memberName,
                    telephone,
                    member_id,
                    pay_id,
                    amount,
                    exist
                };

                // Send POST request for each contribution
                const { data } = await axios.post(`/import/ledger/payments/${id}`, contributionData);
                flashTimed(data.message, data.type, 1500);
            }

        } catch (error) {
            // Handle errors after the entire loop
            loadingError();
            if (error.response?.data?.errors) {
                error.response.data.errors.excel.forEach(err => flashTimed(err, 'danger', 30000));
            } else {
                flashTimed(`Failed to post payments for ${name}.`, 'danger', 30000);
            }
        }
    };

    // clear info 
    // clear form fields only 
    function clearFields() {
        form.name               = '';
        form.month              = '';
        form.year               = '';
    }

    // clear file uploads only 
    function clearFile() {
        classInfo.year           = moment().year()
        classInfo.fileSelected   = '';
        classInfo.excel_file     = '';
        classInfo.file_name      = '';
        classInfo.file_size      = '';
        classInfo.upload_info    = '';
        classInfo.members_existing   = '';
        classInfo.members_left       = '';
        classInfo.members_count      = '';
        classInfo.oldMembers         = [];
        classInfo.newMembers         = [];
        classInfo.exist              = false;
        // classInfo.labelClass         = classInfo.labelInfo;
        classInfo.monthsInfo        = [];
        classInfo.monthsCount       = '';
    }

    // clear all info 
    function clearAll() {
        clearFields();
        clearFile();
        classInfo.isLoading = false;
    }

    // flash views 

    // ledgers view 
    function getAllCycles(year) {
        flashAllHide();
        emit('close');
        let url     = '/cycles';
        let header  = 'View '+ year +' Cycles';
        let button  = 'View Cycles';
        let body    = 'success';
        let message = 'View ' + year + ' Uploaded Cycles!';

        flashShowView(message, body, header, url, button, 15000, true);
    }

    // toast view to go to all members page 
    function getAllMembers() {
        let url     = '/members';
        let header  = `View All Members!`;
        let button  = `All Members`;
        let body    = 'success';
        let message = `Click to view all members`;

        flashShowView(message, body, header, url, button, 15000, true);
    }

    function refresh() {
        emit('reload');
    }

    function finished() {
        setTimeout(() => {
            closeModal();
        }, 3000);
    }

    // flash messages 
    function flashMessages(messages) {
        messages.forEach(message => {
            setTimeout(() => {
                flashTimed(message.info, message.type, message.duration);
            }, message.delay);
        });
    }

    function flashShow(message, body) {
        emit('flash', message, body)
    }

    function flashLoading(message) {
        emit('loading', message)
    }

    function flashHide() {
        emit('hide')
    }

    function flashAllHide() {
        emit('allhide')
    }

    function flashTimed(message, body, duration) {
        emit('timed', message, body, duration)
    }

    function flashShowView(message, body, header, url, button, duration, linkState) {
        emit('view', message, body, header, url, button, duration, linkState);
    }
</script>