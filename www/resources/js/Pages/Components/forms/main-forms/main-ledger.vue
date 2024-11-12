<template>
    <form @submit.prevent="submitLedgerForm" class="p-0 space-y-2">
        <div class="flex-col items-center justify-center w-full space-y">
            <InputLabel for="year" value="Select Cycle Year" class="w-full" />

            <div class="w-full grid grid-cols-4 gap-2">
                <select id="year" v-model="classInfo.year" name="year"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-1 shadow-md">
                    <option :value="moment().year() + 2">{{ moment().year() + 2 }}</option>
                    <option :value="moment().year() + 1">{{ moment().year() + 1 }}</option>
                    <option :value="moment().year()" selected>{{ moment().year() }}
                    </option>
                    <option :value="moment().year() - 1">{{ moment().year() - 1 }}</option>
                    <option :value="moment().year() - 2">{{ moment().year() - 2 }}</option>
                </select>

                <ActionButton :class="'col-span-3'" :buttonClass="!classInfo.ledger_exist ? 'other' : 'danger'"
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
                    @change="onChangeFileLedgers" />
            </label>
        </div>

        <section class="w-full inline-flex justify-start my-1 px-2 md:px-8" v-if="isFilled"
            @click="classInfo.isInfo = !classInfo.isInfo">
            <span :class="['text-center text-gray-900 dark:text-white inline-flex justify-between gap-2 w-full']">
                <span :class="[classInfo.isInfo ? classInfo.failBadgeLg : classInfo.successBadgeLg]"
                    v-html="classInfo.isInfo ? `Close Spreadsheet Info.` : `Show Spreadsheet Info.`"></span>
                <span class="my-auto cursor-pointer">
                    <checksolid-icon v-if="!classInfo.isInfo" class="w-6 h-6 text-emerald-500 my-auto mx-auto"
                        v-tooltip="$tooltip('Show File Info', 'left')"></checksolid-icon>
                    <timessolid-icon v-else class="w-6 h-6 text-rose-500 my-auto mx-auto"
                        v-tooltip="$tooltip('Close File Info', 'left')"></timessolid-icon>
                </span>
            </span>
        </section>

        <section
            class="grid grid-cols-4 md:grid-cols-5 gap-1 my-1 border-base border-green-900 dark:border-green-900 rounded-md px-1 py-2 dark:bg-green-600 shadow-xl"
            v-if="isFilled & classInfo.isInfo">

            <span
                :class="[classInfo.infoBadge, 'col-span-4 md:col-span-5 inline-flex justify-center gap-2 w-full text-2xs']"
                v-tooltip="$tooltip('File Info', 'top')">
                {{ classInfo.upload_info }}
                <download-icon class="my-auto w-4 h-4 text-teal-800 dark:text-teal-500 ml-1"></download-icon>
            </span>

            <hr-line :color="'col-span-4 md:col-span-5 border-green-100 dark:border-green-900'"></hr-line>

            <span :class="[classInfo.failBadge, 'col-span-1']"
                v-tooltip="$tooltip('Existing Members in the spreadsheet', 'top')">
                {{ classInfo.members_existing }} Members
            </span>

            <span :class="[classInfo.infoBadge, 'col-span-1']"
                v-tooltip="$tooltip('New Members in the spreadsheet', 'top')" v-if="classInfo.members_left > 0">
                {{ classInfo.members_left }} New
            </span>

            <span :class="[classInfo.purpleBadge, 'col-span-1']"
                v-tooltip="$tooltip('Total Contributions in the spreadsheet', 'top')">
                KSH {{ Number(classInfo.totalPay).toLocaleString() }}
            </span>

            <span :class="[classInfo.successBadge, 'col-span-1']"
                v-tooltip="$tooltip('Total Welfares In Amnt in the spreadsheet', 'top')" v-if="classInfo.totalIn > 0">
                KSH {{ Number(classInfo.totalIn).toLocaleString() }}
            </span>

            <span :class="[classInfo.warnBadge, 'col-span-1']"
                v-tooltip="$tooltip('Total Welfare Owed till April in the spreadsheet', 'top')">
                KSH {{ Number(classInfo.totalOwe).toLocaleString() }}
            </span>

            <span :class="[classInfo.failBadge, 'col-span-1']"
                v-tooltip="$tooltip('Total Welfare Owed from May in the spreadsheet', 'top')">
                KSH {{ Number(classInfo.totalOweMay).toLocaleString() }}
            </span>

            <span
                :class="[classInfo.infoBadge, 'col-span-4 md:col-span-5 inline-flex justify-center gap-2 w-full text-2xs']"
                v-tooltip="$tooltip('Total Investment', 'top')">
                Total Investment - KSH {{ Number(classInfo.totalInv).toLocaleString() }}
                <money-icon class="my-auto w-4 h-4 text-teal-800 dark:text-teal-500 ml-1"></money-icon>
            </span>
        </section>

        <div class="flex items-center justify-start mt-4">

            <button :class="[isFilled ? submitState : [submitState, 'cursor-not-allowed']]"
                @click.once="isFilled ? handleclick : errorCheck">
                <span v-if="!classInfo.ledger_exist">Upload {{ classInfo.year }} ledger Excelsheet</span>
                <span v-else>Ledger Year {{ classInfo.year }} Already Exists</span>
                <submit-icon class="w-6 h-6" v-if="!classInfo.isLoading"></submit-icon>
                <loading-icon class="w-6 h-6 animate-spin" v-else></loading-icon>
            </button>
        </div>
    </form>

    <hr-line :color="'border-cyan-500/50 dark:border-cyan-500/50'"></hr-line>
</template>

<script setup>
    import { reactive, computed, watch, defineEmits, onMounted, onUnmounted } from 'vue'
    import { useForm }      from '@inertiajs/vue3';
    import moment           from 'moment';

    import { useFileUploadLedgers, onSubmitSheetAsync, onCheckCycleInfo, onPostContributionsAsync, onSubmitLedgerAsync } from '../../../Methods/postMethods.js'

    const emit  = defineEmits(['reload', 'close', 'view', 'flash', 'timed', 'hide', 'loading', 'allhide'])

    const form = useForm({
        name: '',
        month: '',
        year: '',
    })

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
        isInfo: false,
        hasFile: false,
        
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

    watch(() => classInfo.year, (newYear, oldYear) => {
        if (newYear !== oldYear) {
            check(); // Call check when the year changes
        }
    })

    watch(() => classInfo.fileSelected, (newValue) => {
        // If fileSelected is not an empty string, set hasFile to true
        classInfo.hasFile = newValue !== ''
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

    onMounted(() => {
        // setInfo()
        clearAll();
    })

    onUnmounted(() => {
        clearAll();
    })

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

    // on file change Use the composable function and pass the flash methods
    const { onChangeFileLedgers } = useFileUploadLedgers(classInfo, pluralCheck, {
        flashShow, flashMessages, flashLoading, loadingOn, loadingOk, loadingError, clearAll
    });

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

    // Function to post or update payment cycles
    const { submitLedgerAsync } = onSubmitLedgerAsync(classInfo, {
        flashShow, flashTimed, flashHide, loadingError,
        // Function to post or update contributions for a given cycle
        postContributionsAsync: onPostContributionsAsync(classInfo, {
            flashTimed, flashShow,
            // Function to update all cycle info & finances
            checkCycleInfo: onCheckCycleInfo({ flashTimed }).checkCycleInfo,
            loadingError, flashAllHide
        }).postContributionsAsync
    });

    // Main function: submit/update members
    // Computed property to filter members based on sheetFilter
    const sheetMembers = computed(() => {
        let tempMembers = classInfo.allMembers;
        return tempMembers;
    })
    const { submitSheetAsync } = onSubmitSheetAsync(classInfo, form, false, sheetMembers, {
        flashShow, flashTimed, flashHide, refresh, getAllMembers, clearAll
    })

    // submit cycle spreadsheet 
    // const submitLedgerAsync = async () => {
    //     if (confirm(classInfo.confirmText)) {
    //         flashHide();
    //         // Loop through each month in the contributions
    //         for (const [month, contributions] of Object.entries(classInfo.monthsInfo)) {
    //             // get remaining Months per each loop 
    //             const remainingMonths = Object.keys(classInfo.monthsInfo).length - Object.keys(classInfo.monthsInfo).indexOf(month) - 1;

    //             // start flash 
    //             let newMessage = '';
    //             newMessage = `${month} Processing, ${remainingMonths} ${pluralCheck(remainingMonths, 'month')}, Please Wait....`
    //             flashTimed(newMessage, 'loading', 20000);
                
    //             try {
    //                 // Send the POST request for each cycle
    //                 const { data } = await axios.post(`/import/ledger/cycles/modal/${month}/${classInfo.year}`)

    //                 classInfo.cycleID     = data.id;
    //                 classInfo.cycleName   = data.name;

    //                 // post the contributions in the cycle 
    //                 await postContributionsAsync(classInfo.cycleID, classInfo.cycleName, contributions)

    //                 // Array to hold messages
    //                 let messages = [];
                    
    //                 // Helper function to generate message info
    //                 const createMessage = (info, type, delay, duration) => ({
    //                     info,
    //                     type,
    //                     delay,
    //                     duration
    //                 });

    //                 // Simplified messages array creation
    //                 messages.push(
    //                     createMessage(
    //                         `${data.message}, Upload Success`,
    //                         data.type, 
    //                         1500, 
    //                         30000
    //                     )
    //                 );

    //                 // end flash 
    //                 await flashMessages(messages);
    //             } catch (error) {
    //                 loadingError();
    //                 if (error.response.data.errors) {
    //                     let errors = error.response.data.errors.excel;
    //                     errors.forEach(error => {
    //                         flashShow(error, 'danger');
    //                     });
    //                 }
    //             }
    //         }
    //     } else {
    //         flashHide();
    //         flashShow('Ledger Upload Cancelled', 'danger');
    //     }
    // };

    // // Function to post contributions for a given cycle
    // const postContributionsAsync = async (id, name, contributions) => {
    //     try {
    //         // Notification for starting the process
    //         flashTimed(`${name} Payments processing, please wait...`, 'loading', 2000);

    //         // Iterate over contributions and post them sequentially
    //         for (const { name: memberName, telephone, member_id, pay_id, amount, exist } of contributions) {
    //             const contributionData = {
    //                 name: memberName,
    //                 telephone,
    //                 member_id,
    //                 pay_id,
    //                 amount,
    //                 exist
    //             };
 
    //             // Send POST request for each contribution
    //             const { data } = await axios.post(`/import/ledger/payments/${id}`, contributionData);
    //             flashTimed(data.message, data.type, 1500);
    //         }

    //     } catch (error) {
    //         // Handle errors after the entire loop
    //         loadingError();
    //         if (error.response?.data?.errors) {
    //             error.response.data.errors.excel.forEach(err => flashTimed(err, 'danger', 30000));
    //         } else {
    //             flashTimed(`Failed to post payments for ${name}.`, 'danger', 30000);
    //         }
    //     }
    // };

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