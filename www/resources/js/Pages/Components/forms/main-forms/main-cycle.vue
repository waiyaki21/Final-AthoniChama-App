<template>
    <div class="font-boldened">
        <ActionButton :class="'col-span-2 w-full mt-1 py-1.5'"
            :buttonClass="classInfo.month ? 'other' : 'danger'"
            @handleClick="classInfo.month ? downloadTemplate(): downladFalse()"
            :tooltipText="`Download ${classInfo.month} ${classInfo.year} Monthly Template`"
            :buttonText="`Download ${classInfo.month} ${classInfo.year} Template.`">
            <download-icon class="w-4 h-4 md:w-5 md:h-5"></download-icon>
        </ActionButton>
        
        <hr-line :color="classInfo.month ? 'border-purple-500 dark:border-purple-500' : 'border-rose-500 dark:border-rose-500'"></hr-line>

        <!-- update cycle form  -->
        <form @submit.prevent="submitLedgerForm" class="p-0 space-y-2" enctype="multipart/form-data">
            <div class="flex-col items-center justify-center w-full space-y-1"> 
                <div class="items-center justify-center w-full grid grid-cols-2 gap-2"> 
                    <section class="col-span-1">
                        <InputLabel for="year" value="Select Cycle year" class="w-full"/>

                        <select id="year" v-model="classInfo.year" name="year"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-md w-full" @click="classInfo.yearTrue = true" required>
                            <option :value="moment().year() + 2">{{ moment().year() + 2}}</option>
                            <option :value="moment().year() + 1">{{ moment().year() + 1}}</option>
                            <option :value="moment().year()" selected>{{ moment().year() }}
                            </option>
                            <option :value="moment().year() - 1">{{ moment().year() - 1}}</option>
                            <option :value="moment().year() - 2">{{ moment().year() - 2}}</option>
                        </select>
                    </section>
                    <section class="col-span-1">
                        <InputLabel for="month" value="Select Cycle Month" class="w-full"/>

                        <select id="month" v-model="classInfo.month" name="month"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-md w-full" @change="check()" required>
                            <option :value="month.toUpperCase()" v-for="month in months">
                                {{ month.toUpperCase() }}
                            </option>
                        </select>
                    </section>
                </div>
            </div>

            <hr-line :color="'border-yellow-300 dark:border-yellow-300'"></hr-line>
            
            <div class="flex justify-center w-full flex-col">
                <!-- <InputLabel for="excel" value="Excel sheet upload"/> -->

                <label for="dropzone-file" :class="[classInfo.label, labelState, 'shadow-md']">
                    <div class="flex flex-col items-center justify-center py-2 dark:text-white text-black">
                        <cloud-icon class="w-8 h-8 mb-2"></cloud-icon>
                        <p class="mb-1 text-2xs"><span class="font-normal underline">Click to upload</span></p>
                        <p class="text-2xs">XLS, XLXS (MAX. 5MB)</p>
                    </div>
                    <input type="file" id="excel" name="excel" ref="excel"
                        class="my-2 overflow-hidden whitespace-nowrap w-[90%] text-2xs dark:text-white text-black border border-cyan-700 dark:border-cyan-700 rounded-xl"
                        @change="onChangeFile" required/>
                </label>

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

                    <span :class="[classInfo.successBadge, 'col-span-1']" v-tooltip="$tooltip('Total Welfares In Amnt in the spreadsheet', 'top')">
                        KSH {{ Number(classInfo.totalIn).toLocaleString() }}
                    </span>

                    <span :class="[classInfo.warnBadge, 'col-span-1']" v-tooltip="$tooltip('Total Welfare Owed in the spreadsheet', 'top')">
                        KSH {{ Number(classInfo.totalOwe).toLocaleString() }}
                    </span>
                </section>
            </div> 

            <div class="flex items-center justify-start mt-4">
                <button :class="[isFilled ? submitState : [submitState, 'cursor-not-allowed']]" @click.once="isFilled ? handleclick : errorCheck">
                    Upload {{ classInfo.month }} {{ classInfo.year }} Cycle Spreadsheet
                    <submit-icon class="w-6 h-6" v-if="!classInfo.isLoading"></submit-icon>
                    <loading-icon class="w-6 h-6 animate-spin" v-else></loading-icon>
                </button>
            </div>
        </form>
        <!-- end update cycle form  -->

        <hr-line :color="isFilled ? 'border-cyan-500 dark:border-cyan-300' : 'border-rose-500 dark:border-rose-500'"></hr-line>
    </div>
</template>

<script setup>
    import { defineProps, reactive, computed, defineEmits, onMounted, onUnmounted, watch } from 'vue'

    import moment                    from 'moment';
    import { useForm }       from '@inertiajs/vue3';

    const emit = defineEmits(['reload', 'close', 'view', 'flash', 'timed', 'hide', 'loading', 'allhide']);

    // import { useFileUpload, onSubmitSheetAsync, onSubmitLedgerAsync, onPostContributionsAsync, onCheckCycleInfo } from '../../../Methods/postMethods.js'

    import { useFileUpload, onSubmitSheetAsync, onCheckCycleInfo, onPostContributionsAsync, onSubmitLedgerAsync } from '../../../Methods/postMethods.js'

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

    const form = useForm({
        name: '',
        month: '',
        year: '',
    })

    onMounted(() => {
        clearAll();
    })

    onUnmounted(() => {
        clearAll();
    })

    const classInfo = reactive({
        newCycle   : {},

        year: moment().year(),
        month: '',

        monthTrue: false,
        yearTrue: true,
        filled: false,
        isInfo: true,
        hasFile: false,
        
        // label classes 
        labelActive: 'flex flex-col items-center justify-center w-full h-[10rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600',
        labelInactive: 'flex flex-col items-center justify-center w-full h-[10rem] border-2 border-red-400 border-dashed rounded-lg bg-red-400 dark:bg-red-700 dark:border-red-600 dark:hover:border-red-500 dark:hover:bg-red-600 text-black cursor-not-allowed',

        SubmitActive: 'text-white bg-gradient-to-br from-cyan-600 to-green-500 hover:bg-gradient-to-bl focus:ring focus:outline-none focus:ring-blue-300 dark:focus:ring-green-800 font-normal rounded-lg text-md py-2 px-2.5 text-center mb-1 uppercase inline-flex justify-between w-full shadow-md',
        SubmitInactive: 'text-white bg-gradient-to-br from-rose-600 to-red-500 hover:bg-gradient-to-bl focus:ring focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-normal rounded-lg text-md py-2 px-2.5 text-center mb-1 uppercase inline-flex justify-between w-full shadow-md cursor-not-allowed disabled',
        
        SubmitBtn: '',

        label: 'flex flex-col items-center justify-center w-full h-fit border-2 border-dashed rounded-lg cursor-pointer',
        labelClass: '',
        labelDef: 'border-gray-300 bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600',
        labelInfo: 'border-cyan-300 bg-cyan-50 dark:hover:bg-cyan-800 dark:bg-cyan-700 hover:bg-cyan-100 dark:border-cyan-600 dark:hover:border-cyan-500 dark:hover:bg-cyan-600',
        labelDanger: 'border-red-300 bg-red-50 dark:hover:bg-red-800 dark:bg-red-700 hover:bg-red-100 dark:border-red-600 dark:hover:border-red-500 dark:hover:bg-red-600',
        labelLoading: 'border-orange-300 bg-orange-50 dark:hover:bg-orange-800 dark:bg-orange-700 hover:bg-orange-100 dark:border-orange-600 dark:hover:border-orange-500 dark:hover:bg-orange-600',
        labelSuccess: 'border-green-300 bg-green-50 dark:hover:bg-green-800 dark:bg-green-700 hover:bg-green-100 dark:border-green-600 dark:hover:border-green-500 dark:hover:bg-green-600',

        // loading state 
        templateLoading: 'text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 font-normal rounded-lg text-sm px-4 py-3 text-center inline-flex justify-center uppercase cursor-pointer w-full',
        SubmitLoading: 'text-white bg-gradient-to-br from-orange-600 to-orange-500 hover:bg-gradient-to-bl focus:ring focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 font-normal rounded-lg text-md py-2 px-2.5 text-center mb-1 uppercase inline-flex justify-between w-full shadow-md cursor-not-allowed disabled',
        labelLoading: 'text-2xs text-orange-900 dark:text-orange-900',
        uploadLoading: 'flex flex-col items-center justify-center w-full h-[10rem] border-2 border-orange-400 border-dashed rounded-lg bg-orange-400 dark:bg-orange-700 dark:border-orange-600 dark:hover:border-orange-500 dark:hover:bg-orange-600 text-black cursor-not-allowed',

        // danger state
        SubmitDanger: 'text-white bg-gradient-to-br from-red-600 to-red-500 hover:bg-gradient-to-bl focus:ring focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-normal rounded-lg text-md py-2 px-2.5 text-center mb-1 uppercase inline-flex justify-between w-full shadow-md cursor-not-allowed disabled',

        clicked: false,

        isLoading: false,
        loadingPercent: 0,

        // excel data 
        excel_file: '',
        fileSelected: '',

        // file data 
        file_name : '',
        file_size : '',
        upload_info : '',

        // exist records 
        exist            : false,
        cycle_exist      : false,
        members_existing : '',
        members_left     : '',
        members_count    : '',
        oldMembers       : [],
        newMembers       : [],
        allMembers       : [],
        monthsCount      : '',
        monthsInfo       : [],
        monthsExpIn      : [],
        monthsExpOwed    : [],
        expInCount       : '',
        expOweCount      : '',
        totalPay         : '',
        totalIn          : '',
        totalOwe         : '',
        confirmText      : '',

        hasErrors: false,

        successBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-green-900 border-black bg-green-400 rounded-md shadow-md py-1 px-2 my-auto w-full justify-center inline-flex cursor-pointer',
        purpleBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-purple-900 border-black bg-purple-400 rounded-md shadow-md py-1 px-2 my-auto w-full justify-center inline-flex cursor-pointer',
        infoBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-cyan-900 border-black bg-cyan-400 rounded-md shadow-md py-1 px-2 my-auto w-full justify-center inline-flex cursor-pointer',
        failBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-red-900 border-black bg-rose-400 rounded-md shadow-md py-1 px-2 my-auto w-full justify-center inline-flex cursor-pointer',
        warnBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-yellow-900 border-black bg-yellow-300 rounded-md shadow-md py-1 px-2 my-auto w-full justify-center inline-flex cursor-pointer',

        successBadgeLg : 'text-black dark:text-black md:text-sm text-xs uppercase underline border dark:border-green-900 border-black bg-green-400 rounded-md shadow-md py-1 px-2 my-auto w-full justify-center inline-flex cursor-pointer text-center w-full',
        failBadgeLg : 'text-black dark:text-black md:text-sm text-xs uppercase underline border dark:border-red-900 border-black bg-rose-400 rounded-md shadow-md py-1 px-2 my-auto w-full justify-center inline-flex cursor-pointer text-center w-full',
    })

    // computed 
    const submitState = computed(() => {
        if (classInfo.isLoading) {
           classInfo.SubmitBtn = classInfo.SubmitLoading;
            return classInfo.SubmitBtn; 
        } else {
            if (!classInfo.filled) {
                classInfo.SubmitBtn = classInfo.SubmitInactive;
                return classInfo.SubmitBtn;
            } else {
                classInfo.SubmitBtn = classInfo.SubmitActive;
                return classInfo.SubmitBtn;
            }    
        }
    })

    const labelState = computed(() => {
        if (classInfo.isLoading) {
           classInfo.labelClass = classInfo.labelLoading;
            return classInfo.labelClass; 
        } else {
            if (!classInfo.filled) {
                classInfo.labelClass = classInfo.labelDanger;
                return classInfo.labelClass;
            } else {
                classInfo.labelClass = classInfo.labelInfo;
                return classInfo.labelClass;
            }    
        }
    })

    const months = computed(() => {
        // Get the current month using moment
        const currentMonthIndex = moment().month(); // Month is 0-indexed in moment (0 = January)
        
        // Array to hold the list of months starting from the current one
        const monthsArray = [];

        // Loop through 12 months starting from the current month
        for (let i = 0; i < 12; i++) {
            // Use moment's month manipulation to get the correct month name
            monthsArray.push(moment().month(currentMonthIndex + i).format('MMMM'));
        }

        return monthsArray;
    });

    watch(() => classInfo.fileSelected, (newValue) => {
        // If fileSelected is not an empty string, set hasFile to true
        classInfo.hasFile = newValue !== ''
    })

    // Computed property to check if month and year are filled
    const isFilled = computed(() => {
        // Check if month and year and file are not empty
        if (classInfo.month && classInfo.year && classInfo.fileSelected) {
            classInfo.filled = true;
            return classInfo.filled;
        } else {
            classInfo.filled = false;
            return classInfo.filled;
        }  
    })
    // end computed 

    // loading state 
    function loadingOn() {
        classInfo.isLoading     = true;
        classInfo.SubmitBtn     = classInfo.SubmitWarning;
        classInfo.labelClass    = classInfo.labelLoading;
        classInfo.loadingPercent = 0;
        // flashTimed('Loading, Please Wait...', 'loading', 30000);
    }

    function loadingOk() {
        classInfo.isLoading     = false;
        classInfo.hasErrors     = false;
        classInfo.labelClass    = classInfo.labelInfo;
        classInfo.SubmitBtn     = classInfo.SubmitActive;
        setTimeout(() => {
            classInfo.loadingPercent = 0;
        }, 10000);
    }

    function loadingError() {
        classInfo.isLoading = false;
        classInfo.hasErrors = true;
        classInfo.labelClass    = classInfo.labelDanger;
        classInfo.SubmitBtn     = classInfo.SubmitDanger;
        setTimeout(() => {
            clearAll()
            loadingOk()
        }, 20000);
    }
    // end loading state 

    function downloadTemplate() {
        let url     = '/download/template/cycle/' + classInfo.month +'/'+ classInfo.year;
        let header  = classInfo.month +' '+ classInfo.year +' Template!';
        let button  = `Download Template`;
        let body    = 'download';
        let message = 'Download ' + classInfo.month +' '+ classInfo.year +' Template! With all Members';

        flashShowView(message, body, header, url, button, 15000, false);
    }

    // false download 
    function downladFalse() {
        let message   = 'Fill in The Month & Try Again!';
        let type      = 'danger';
        flashShow(message, type);
    }

    // false submit 
    function errorCheck() {
        if (classInfo.cycle_exist) {
            let message   = classInfo.month + ' '+ classInfo.year +' already exists and will be updated!';
            let type      = 'warning';
            flashShow(message, type);
        }

        if (!classInfo.month) {
            let message   = 'Enter a month!';
            let type      = 'warning';
            flashShow(message, type);
        }

        if (!classInfo.year) {
            let message   = 'Select a year!';
            let type      = 'warning';
            flashShow(message, type);
        }

        if (!classInfo.fileSelected) {
            let message   = 'Upload a spreadsheet!';
            let type      = 'warning';
            flashShow(message, type);
        }
    }

    // upload sheet 
    function handleclick() {
        if (!classInfo.clicked) {
            classInfo.clicked = true;
        }
    }

    function check() {
        if (classInfo.month) {
            loadingOn();
            axios.get('/cycle/exist/' + classInfo.month + '/'+ classInfo.year)
                .then(
                    ({ data }) => {
                        if (data[0] > 0) {
                            classInfo.cycle_exist    = true;
                            // reset
                            // classInfo.month          = '';
                            classInfo.monthTrue      = true;
                            // flashMessage 
                            let message   = data[1];
                            let type      = 'danger';
                            flashShow(message, type);
                            loadingOk();
                        } else {
                            classInfo.cycle_exist    = false;

                            classInfo.monthTrue = true;
                            // flashMessage 
                            let message   = data[1];
                            let type      = 'success';
                            flashShow(message, type);
                            loadingOk();
                        }
                    });
        } else {
            // reset
            classInfo.month          = '';
            classInfo.monthTrue      = false;
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
    const { onChangeFile } = useFileUpload(classInfo, pluralCheck, {
        clearFile,
        flashTimed,
        flashHide,
        flashShow,
        flashMessages,
        loadingOn,
        loadingOk,
        loadingError
    });

    async function submitLedgerForm() {
        await flashAllHide();
        await flashShow(`Submitting New Members & Updating Existing Members!`, `info`) 

        classInfo.confirmText = `All existing members will be updated and new Members will added, ready?`;
        await submitSheetAsync();

        await flashShow(`Submitting New Payment Cycles & Updating Existing Payment Cycles!`, `info`) 
        classInfo.confirmText = `All existing payment cycles will be updated and new payment cycles will added, ready?`;
        await submitLedgerAsync();

        await getAllCycles(classInfo.cycleID, classInfo.cycleName);
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

    // const checkCycleInfo = async (id) => {
    //     try {
    //         // Send the GET request for cycle info
    //         const response = await axios.get(`/update/cycle/info/${classInfo.cycleID}`);

    //         // Destructure the info object safely
    //         const info = response.data || {}; // Fallback to an empty object if info is undefined

    //         // Check if info has the expected properties
    //         if (info[0] && info[1]) {
    //             flashTimed(`${info[0]}`, info[1], 40000);
    //         } else {
    //             console.error('Unexpected response structure:', info);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching cycle info:', error);
    //         flashTimed('Failed to update cycle info', 'danger', 40000);
    //     }
    // }

    // toast view to go to all members page 
    function getAllMembers() {
        // if (parentName == 'Modal') {
        //     emit('close');
        // }
        let url     = '/members';
        let header  = `View All Members!`;
        let button  = `All Members`;
        let body    = 'success';
        let message = `Click to view all members`;

        flashShowView(message, body, header, url, button, 15000, true);
    }

    // clear info 
    // clear form fields only 
    function clearFields() {
        form.name               = '';
        form.month              = '';
        form.year               = '';
    }

    // clear file uploads only 
    function clearFile() {
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
        classInfo.expInCount        = '';
        classInfo.expOweCount       = '';
        classInfo.totalPay          = '';
        classInfo.totalIn           = '';
        classInfo.totalOwe          = '';
    }

    // clear all info 
    function clearAll() {
        clearFields();
        clearFile();
        classInfo.year           = moment().year();
        classInfo.month          = '';
        classInfo.isLoading = false;
    }

    function refresh() {
        emit('reload');
    }

    function getAllCycles(id, name) {
        flashAllHide();
        let url     = '/cycle/'+id;
        let header  = 'View Payment Cycles';
        let button  = 'View '+ name;
        let body    = 'success';
        let message = 'View ' + name + ' Cycle!';

        flashShowView(message, body, header, url, button, 15000, true);
        emit('close');
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