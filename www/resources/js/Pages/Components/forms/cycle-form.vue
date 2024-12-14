<template>
    <!-- enter settings info  -->
    <section :class="[classInfo.borderClass]" v-if="props.cycles.length != 0">
        <h3 class="font-boldened  flex-col  w-full flex py-2 px-1">
            <span :class="[classInfo.mainHeader, 'text-xl']">Recent Cycle</span>
        </h3>
        <section class="relative grid grid-cols-2 md:grid-cols-1 gap-1 m-1 overflow-y-scroll sm:h-[350px] md:h-[330px]"
            v-if="props.current != null">
            <div v-for="(item, index) in summaryItems" :key="index"
                class="mb-2 md:mb-4 border-s-base border-gray-200 dark:border-gray-700 pl-2">
                <h3 class="text-sm md:text-md underline font-normal text-gray-900 dark:text-white uppercase">
                    {{ item.title }}
                </h3>
                <p class="text-md md:text-xl font-normal uppercase underline text-cyan-500 dark:text-cyan-400">
                    <small v-if="item.prefix" class="text-md">
                        {{ item.prefix }}
                    </small>
                    {{ item.value }}
                    <span v-if="item.suffix">{{ item.suffix }}</span>
                </p>
            </div>
        </section>
    </section>

    <!-- enter cycles form  -->
    <section :class="[classInfo.borderClass, props.cycles.length == 0 ? 'col-span-4 md:h-fit' : 'col-span-3 md:h-fit']">
        <h3 class="font-boldened  flex-col  w-full flex py-2 px-1">
            <span :class="[classInfo.mainHeader, 'text-xl']">Add Cycles</span>
            <span class="text-xs text-gray-500 dark:text-gray-500/40 mb-0.5" v-if="props.cycles.length != 0">
                (upload an excel sheet to add more cycles)
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-500/40 mb-0.5" v-else>
                (upload an excel sheet to add new cycles)
            </span>
        </h3>
        <!-- cycles forms tabs  -->
        <div
            class="text-xs font-boldened text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 w-full mb-1 mx-2 p-2">
            <ul class="flex flex-wrap -mb-px">
                <li class="me-2">
                    <a :class="[classInfo.tab1]" @click="tabSwitch1()" preserve-scroll>
                        Enter cycles Form.
                    </a>
                </li>
                <li class="me-2" v-if="isDashboard">
                    <a :class="[classInfo.tab2Bad, 'cursor-not-allowed']" @click="cycleAlert()"
                        v-if="props.current != null && isDashboard" preserve-scroll>
                        Upload Sheet.
                    </a>
                    <a :class="[classInfo.tab2]" @click="tabSwitch2()" v-else preserve-scroll>
                        Upload Monthly Sheet.
                    </a>
                </li>
                <li class="me-2" v-else>
                    <a :class="[classInfo.tab3]" @click="tabSwitch3()" preserve-scroll>
                        Upload Ledgers.
                    </a>
                </li>
            </ul>
        </div>
        <!-- end cycles forms tabs  -->

        <!-- upload sheet & form -->
        <div :class="['p-2']">
            <h3 :class="[classInfo.mainHeader, 'text-xl px-2']">
                {{ classInfo.tabheader }}
            </h3>

            <!-- cycles form  -->
            <form @submit.prevent="submit" v-if="classInfo.tab1show">
                <div class="items-center justify-center w-full space-x-2 grid grid-cols-2 md:grid-cols-6">
                    <section class="col-span-1 md:col-span-2 hidden">
                        <div>
                            <InputLabel for="name" value="name" />

                            <TextInput id="name" type="name" v-model="form.name" required autofocus
                                v-if="form.errors.name != null" />

                            <TextInput id="name" type="name" v-model="form.name" required autofocus disabled="true"
                                class="hover:cursor-not-allowed  opacity-50 uppercase" v-else />

                            <InputError class="mt-2" :message="form.errors.name" v-if="form.errors.name != null" />

                            <div v-else>
                                <p class="text-xs pt-2 uppercase text-orange-400">Automatically Set</p>
                            </div>
                        </div>
                    </section>
                    <section class="col-span-1 md:col-span-2">
                        <InputLabel for="month" value="Select Cycle Month" class="w-full" />

                        <div class="inline-flex items-center justify-center w-full space-x-2">
                            <select id="month" v-model="form.month" name="month"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full uppercase shadow"
                                @click="classInfo.monthTrue = true">
                                <option :value="moment().startOf('month').format('MMMM')" selected>{{
                                    moment().startOf('month').format('MMMM') }}</option>
                                <option :value="month.toUpperCase()" v-for="month in months">{{ month.toUpperCase() }}
                                </option>
                            </select>
                        </div>
                    </section>
                    <section class="col-span-1 md:col-span-2">
                        <InputLabel for="year" value="Select Cycle year" class="w-full" />

                        <select id="year" v-model="form.year" name="year"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full shadow"
                            @click="classInfo.yearTrue = true">
                            <option :value="moment().year()" selected>{{ moment().year() }}</option>
                            <option :value="moment().year() + 1">{{ moment().year() + 1 }}</option>
                            <option :value="moment().year() + 2">{{ moment().year() + 2 }}</option>
                            <option :value="moment().year() + 3">{{ moment().year() + 3 }}</option>
                        </select>
                    </section>

                    <div class="col-span-2 md:col-span-2">
                        <InputLabel for="date" value="date" />

                        <TextInput id="date" type="date" v-model="form.date" required autofocus />

                        <InputError class="mt-2" :message="form.errors.date" />
                    </div>

                    <div class="col-span-1 md:col-span-3">
                        <InputLabel for="amount" value="Contribution per Person" />

                        <TextInput id="amount" type="number" v-model="form.amount" autofocus />

                        <InputError class="mt-2" :message="form.errors.amount" />
                    </div>

                    <div class="col-span-1 md:col-span-3">
                        <InputLabel for="welfare_amnt" value="Welfare Amount Per Person" />

                        <TextInput id="welfare_amnt" type="number" v-model="form.welfare_amnt" autofocus />

                        <InputError class="mt-2" :message="form.errors.welfare_amnt" />
                    </div>

                    <div class="col-span-2 md:col-span-6 mt-2">
                        <SubmitButton :disabled="form.processing" :loading="form.processing"
                            :success="form.wasSuccessful" :failed="form.hasErrors" :editting="form.isDirty">
                            Submit Cycle
                        </SubmitButton>
                    </div>
                </div>
            </form>

            <maincycle-form v-if="classInfo.tab2show && isDashboard" @loading=flashLoading @flash=flashShow @hide=flashHide @timed=flashTimed @view=flashShowView @allhide=flashAllHide @reload=refresh></maincycle-form>

            <mainLedger v-if="classInfo.tab3show && !isDashboard" @loading=flashLoading @flash=flashShow @hide=flashHide @timed=flashTimed @view=flashShowView @allhide=flashAllHide @reload=refresh></mainLedger>

            <!-- <hr-line :color="'text-teal-800 dark:text-teal-500/50 dark:border-teal-500/50'"></hr-line> -->
        </div>
        <!-- end upload sheet & form -->
    </section>
    <!-- end enter cycles form  -->

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
</template>

<script setup>
    import { useForm, router } from '@inertiajs/vue3';

    import mainLedger from './main-forms/main-ledger.vue'

    //moment 
    import moment from 'moment';

    import { defineProps, reactive, onMounted, computed, ref, nextTick } from 'vue';
    
    const props = defineProps({
        settings: {
            type: Object,
            required: true,
        },
        current: {
            type: Object,
            required: true,
        },
        cycles: {
            type: Array,
            required: true,
        },
        nextname: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        }
    })

    const summaryItems = computed(() => [
        {
            title: 'Cycle Name',
            value: props.current.name,
        },
        {
            title: 'Members',
            value: `${props.current.members_no} ACTIVE`,
        },
        {
            title: 'T. Contributed.',
            prefix: 'KSH',
            value: Number(props.current.payments_total).toLocaleString(),
        },
        {
            title: 'T. Welfare In.',
            prefix: 'KSH',
            value: Number(props.current.welfaresin_total).toLocaleString(),
        },
        {
            title: 'T. Welfare Owed.',
            prefix: 'KSH',
            value: Number(props.current.welfaresowed_total).toLocaleString(),
        },
        {
            title: 'T. Projects.',
            value: `${Number(props.current.projects.length).toLocaleString()} Projects`,
        },
        {
            title: 'T. Expenses.',
            prefix: 'KSH',
            value: Number(props.current.expenses_total).toLocaleString(),
        },
        {
            title: 'Grand Total.',
            prefix: 'KSH',
            value: Number(props.current.total).toLocaleString(),
        },
        {
            title: 'Created At',
            value: `${moment(props.current.created_at).format("ddd, Do/MM/YY")} : ${moment(props.current.created_at).fromNow()}`,
        }
    ]);

    const months = computed(() => {
        const end   = moment().startOf('year')
        const start = moment().endOf('year')
        // console.log(end, start);
        let results = []
        let current = start
        while (end.format('MMMM YYYY') !== start.format('MMMM YYYY')) {
            results.push(current.format('MMMM'))
            current = current.subtract(1, 'month')
        }
        // need to add current one last time because the loop will have ended when it is equal to the end date, and will not have added it
        results.push(current.format('MMMM'))

        let list = results.reverse();

        return list;
    })

    const getName = computed(() => {
        let month = form.month;
        let year  = form.year;

        let name = month +' '+ year;

        return name;
    })

    const downloadState = computed(() => {
        if (classInfo.month != '' && classInfo.year != '') {
            classInfo.submitBtn = classInfo.templateActive;
            checkExist();
            return classInfo.submitBtn;
        } else {
            classInfo.submitBtn = classInfo.templateInactive;
            return classInfo.submitBtn;
        }
    })

    const form = useForm({
        name: '',
        date: '',
        month: '',
        year: '',
        amount: '',
        welfare_amnt: ''
    })

    const classInfo = reactive({
        isLoading: false,
        info: [],

        infoSection: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        infoHeader: 'text-cyan-300 mb-2 text-2xl text-left font-normal underline tracking-tight uppercase',
        borderClass: 'overflow-hidden font-boldened flex-col space-y-1 justify-between rounded-lg bg-cyan-50 dark:bg-gray-800/50 shadow-md sm:rounded-lg border-[3px] border-cyan-600 dark:border-cyan-700 p-1 m-1',
        mainHeader: 'font-boldened text-xl text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1',
        //         borderClass: 'overflow-hidden font-boldened flex-col  space-y-1 justify-between p-2 md:m-2 sm:m-0.5 sm:my-1 rounded-lg bg-cyan-50 dark:bg-gray-800/50 shadow-md sm:rounded-lg border-[3px] border-cyan-600 dark:border-cyan-700',
        // mainHeader: 'font-boldened text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1 md:text-3xl text-2xl',


        year: moment().year(), 
        monthTrue: false,
        yearTrue: true,
        
        // template btns 
        submitBtn: '',
        templateInactive: 'text-white bg-gradient-to-r from-rose-500 to-red-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-xs p-2 text-center me-2 inline-flex justify-center cursor-not-allowed w-full',
        templateActive: 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm p-2 text-center me-2 inline-flex justify-center uppercase w-full',
        label: 'flex flex-col items-center justify-center w-full h-[15rem] border-2 border-dashed rounded-lg cursor-pointer',
        labelClass: '',
        labelDef: 'border-gray-300 bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600',
        labelInfo: 'border-cyan-300 bg-cyan-50 dark:hover:bg-cyan-800 dark:bg-cyan-700 hover:bg-cyan-100 dark:border-cyan-600 dark:hover:border-cyan-500 dark:hover:bg-cyan-600',
        labelDanger: 'border-red-300 bg-red-50 dark:hover:bg-red-800 dark:bg-red-700 hover:bg-red-100 dark:border-red-600 dark:hover:border-red-500 dark:hover:bg-red-600',
        labelLoading: 'border-orange-300 bg-orange-50 dark:hover:bg-orange-800 dark:bg-orange-700 hover:bg-orange-100 dark:border-orange-600 dark:hover:border-orange-500 dark:hover:bg-orange-600',
        labelSuccess: 'border-green-300 bg-green-50 dark:hover:bg-green-800 dark:bg-green-700 hover:bg-green-100 dark:border-green-600 dark:hover:border-green-500 dark:hover:bg-green-600',

        clicked: false,

        // excel data 
        excel_file: '',
        fileSelected: '',

        // tabs 
        tabActive: 'inline-block p-2 text-blue-600 border-b border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 text-xs cursor-pointer mx-1 uppercase',
        tabInactive: 'inline-block p-2 border-b border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-xs cursor-pointer mx-1 uppercase',
        tabActive100: 'inline-block p-2 text-green-600 border-b border-green-600 rounded-t-lg active dark:text-green-500 dark:border-green-500 text-xs cursor-pointer mx-1 uppercase',
        tabInactive100: 'inline-block p-2 dark:text-teal-300 border-b border-transparent rounded-t-lg hover:text-teal-600 hover:border-teal-300 dark:border-teal-300 dark:hover:border-teal-600 dark:hover:text-teal-600 text-xs cursor-pointer mx-1 uppercase',
        tab1: '',
        tab2: '',
        tab3: '',
        tab2Bad: 'inline-block p-2 border-b border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-xs cursor-not-allowed mx-1 uppercase',
        tab1show: true,
        tab2show: false,
        tab3show: false,
        tabheader: '',

        // alerts
        alertShow: false,
        alertType: '',
        alertDuration: 60000,
        flashMessage: '',
        alertBody: 'border-b-[4px] border-gray-500 shadow-gray-900 dark:shadow-gray-900 bg-gray-100 dark:bg-gray-500',
        alertSuccess: 'border-b-[4px] border-emerald-800 dark:border-emerald-800 shadow-green-900 dark:shadow-green-900 bg-green-100 dark:bg-green-500',
        alertInfo: 'border-b-[4px] border-blue-800 dark:border-blue-800 shadow-blue-900 dark:shadow-blue-900 bg-blue-100 dark:bg-blue-500',
        alertWarning: 'border-b-[4px] border-orange-800 dark:border-orange-800 shadow-orange-900 dark:shadow-orange-900 bg-orange-100 dark:bg-orange-500',
        alertDanger: 'border-b-[4px] border-red-800 dark:border-red-800 shadow-red-900 dark:shadow-red-900 bg-red-100 dark:bg-red-500',

        file_size: '',
        file_name: '',
        upload_info: '',

        // exist records 
        exist: false,
        members_existing : '',
        members_left     : '',
        members_count    : '',

        preset_url       : '/preset/template/ledgers/',
        preset_header    : 'Use Ledgers Preset Template!',
        preset_button    : 'Use Ledger Preset',
        preset_body      : 'ledger',
        preset_message   : `No ledgers exist in the system yet! Use the preset set by the program manufacturer to upload ledgers. This Template has Ledger records till September 2024!`,
    })

    const alerts = reactive({
        // alerts
        alertShow: false,
        alertShowView: false,
        alertDuration: 15000,
        alertType: '',
        flashMessage: '',
        alertBody: 'border-b-[4px] border-gray-500 shadow-gray-900 dark:shadow-gray-900 bg-gray-100 dark:bg-gray-500',
        alertSuccess: 'border-b-[4px] border-emerald-800 dark:border-emerald-800 shadow-green-900 dark:shadow-green-900 bg-green-100 dark:bg-green-500',
        alertInfo: 'border-b-[4px] border-blue-800 dark:border-blue-800 shadow-blue-900 dark:shadow-blue-900 bg-blue-100 dark:bg-blue-500',
        alertWarning: 'border-b-[4px] border-orange-800 dark:border-orange-800 shadow-orange-900 dark:shadow-orange-900 bg-orange-100 dark:bg-orange-500',
        alertDanger: 'border-b-[4px] border-red-800 dark:border-red-800 shadow-red-900 dark:shadow-red-900 bg-red-100 dark:bg-red-500',
        linkName: '',
        linkUrl: '',
        linkState: false,
    })

    onMounted(() => {
        setFields()
        tabSwitch1()
        checkCount()
    })

    const isDashboard = computed(() => {
        return router.page.props.route === 'Dashboard';
    })

    function checkCount() {
        if (!props.cycles && !isDashboard) {
            flashShowView(classInfo.preset_message, classInfo.preset_body, classInfo.preset_header, classInfo.preset_url, classInfo.preset_button, 30000, false);
        }
    }

    // tabs 
    function tabSwitch(tabNumber, tabheader) {
        resetTabClass();

        // Set the appropriate tab to active and show
        classInfo[`tab${tabNumber}show`] = true;
        classInfo[`tab${tabNumber}`] = classInfo.tabActive100;
        classInfo.tabheader = tabheader;
    }

    function resetTabClass() {
        ['tab1', 'tab2', 'tab3'].forEach(tab => {
            classInfo[tab] = classInfo.tabInactive100;
            classInfo[`${tab}show`] = false;
        });
        classInfo.tabheader = 'Enter Cycle Info';
    }

    function tabSwitch1() {
        tabSwitch(1, 'Add Cycle form');
    }

    function tabSwitch2() {
        tabSwitch(2, 'Upload Cycle spreadsheets');
    }

    function tabSwitch3() {
        tabSwitch(3, 'Upload Ledger spreadsheets');
        ledgersTemplate();
    }

    function ledgersTemplate() {
        if (classInfo.tab3show) {
            flashShowView(classInfo.preset_message, classInfo.preset_body, classInfo.preset_header, classInfo.preset_url, classInfo.preset_button, 30000, false);
        }
    }

    function cycleAlert() {
        // alert('Use the regular form to create new payment cycles one at a time or use the plus button at the right to add either members or payments');
        alerts.flashMessage = 'Use the regular form to create new payment cycles one at a time or use the plus button at the right to add either members or payments';
        alerts.alertType    = 'warning';
        flashShow(alerts.flashMessage, alerts.alertType);
    }

    function tabClass() {
        if (props.cycles.length == 0) {
            classInfo.tab1show == true;
            classInfo.tabheader = 'Upload Ledger spreadsheets';
            check();
        } else {
            classInfo.tab1show = false;
            classInfo.tab2 = classInfo.tabActive;
            classInfo.tab1 = classInfo.tabInactive;
            classInfo.tabheader = 'Add Cycle form';
            check();
        }
    }

    function checkExist() {
        axios.get('/cycle/exist/' + form.month + '/' + form.year)
            .then(
                ({ data }) => {
                    if (data[0] > 0) {
                        classInfo.cycle_exist = true;
                        // reset
                        classInfo.month = '';
                        classInfo.monthTrue = false;
                        // flashMessage 
                        alerts.flashMessage = data[1];
                        alerts.alertBody = 'danger';
                        flashShow(alerts.flashMessage, alerts.alertBody);
                    } else {
                        classInfo.cycle_exist = false;
                        // flashMessage 
                        alerts.flashMessage = data[1];
                        alerts.alertBody = 'success';
                        flashShow(alerts.flashMessage, alerts.alertBody);
                    }
                });
    }

    function setFields() {
        form.name            = getName;
        form.date            = new Date().toISOString().slice(0, 10);
        form.month           = moment().startOf("month").format('MMMM');
        form.year            = moment().year();
        form.amount          = props.settings.payment_def;
        form.welfare_amnt    = props.settings.welfare_def;
        classInfo.labelClass = classInfo.labelDef;
    }

    function submit() {
        let url = '/cycle/';
        let name = form.name;

        form.post(url, {
            onFinish: () => setFields(),

            onSuccess: () => [
                alerts.flashMessage = 'New cycle: ' + name + ' Added!',
                alerts.alertType    = 'success',
                flashShow(alerts.flashMessage, alerts.alertType),
            ],

            onError: () => [
                formErrors(form)
                

                // console.log(form.errors),

                // let allErrors = form.errors,

                // allErrors.forEach(error => {
                //     alerts.flashMessage = error,
                //     alerts.alertType    = 'danger',
                //     flashShow(alerts.flashMessage, alerts.alertType),    
                // })
                
            ]
        });
    }

    function formErrors(form) {
        // if (form.hasErrors) {
            if (form.errors.name) {
                alerts.flashMessage = form.errors.name,
                alerts.alertType    = 'danger';
                flashShow(alerts.flashMessage, alerts.alertType); 
            }
            if (form.errors.date) {
                alerts.flashMessage = form.errors.date,
                alerts.alertType    = 'danger';
                flashShow(alerts.flashMessage, alerts.alertType); 
            }
            if (form.errors.amount) {
                alerts.flashMessage = form.errors.amount,
                alerts.alertType    = 'danger';
                flashShow(alerts.flashMessage, alerts.alertType); 
            }
            if (form.errors.welfare_amnt) {
                alerts.flashMessage = form.errors.welfare_amnt,
                alerts.alertType    = 'danger';
                flashShow(alerts.flashMessage, alerts.alertType); 
            }
        // }
    }

    // upload sheet 
    function handleclick() {
        if (!classInfo.clicked) {
            // console.log("click");
            classInfo.clicked = true;
        }
    }

    // on file change 
    function onChangeFile(event) {
        classInfo.labelClass   = classInfo.labelLoading;
        classInfo.fileSelected = event.target.files.length;
        classInfo.excel_file   = event.target.files[0];
        console.log('Uploaded sheet', classInfo.excel_file, classInfo.fileSelected);

        classInfo.file_name      = event.target.files[0].name;
        classInfo.file_size      = Number(event.target.files[0].size/ (1024 * 1024)).toFixed(2);
        classInfo.upload_info    = 'File Name ' + classInfo.file_name + ' ' + classInfo.file_size + ' MBs';

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        let file = event.target.files[0];

        let fileData = file;
        let data    = new FormData();
        data.append('excel', fileData);

        axios.post('/members/excel/exist/', data, config)
            .then(
                ({ data }) => {
                    classInfo.members_existing = data[0];
                    classInfo.members_left     = data[1];
                    classInfo.members_count    = data[0] + data[1];
                    if (data[0] > 0) {
                        if (data[1] > 0) {
                            classInfo.labelClass = classInfo.labelInfo;
                            // flashMessage 
                            alerts.flashMessage   = classInfo.members_existing + ' existing members and ' + classInfo.members_left +' New Member(s)!';
                            alerts.alertBody      = 'info';
                            flashShow(alerts.flashMessage, alerts.alertBody);
                        } else {
                            // flashMessage 
                            alerts.flashMessage = 'NOTE! '+ classInfo.members_existing + ' existing members information will be updated with the current sheet information!';
                            alerts.alertBody = 'danger';  
                            classInfo.labelClass = classInfo.labelInfo;
                            flashShow(alerts.flashMessage, alerts.alertBody); 
                        }  
                    } else {
                        classInfo.exist = false;
                        classInfo.labelClass = classInfo.labelInfo;
                        // flashMessage 
                        alerts.flashMessage = classInfo.members_left + ' new members will be added!!';
                        alerts.alertBody = 'info';
                        flashShow(alerts.flashMessage, alerts.alertBody);
                    }
                })
            .catch(error => {
                if (error.response.data.errors) {
                    let errors = error.response.data.errors.excel;
                    errors.forEach(error => {
                        // flashMessage 
                        alerts.flashMessage = error;
                        alerts.alertBody = 'danger';
                        flashShow(alerts.flashMessage, alerts.alertBody);
                    });
                }
            });
    }

    function clearFile() {
        classInfo.fileSelected   = '';
        classInfo.excel_file     = '';
        classInfo.file_name      = '';
        classInfo.file_size      = '';
        classInfo.upload_info    = '';
        classInfo.labelClass     = classInfo.labelDef;
    }

    // submit product Sheet
    function submitSheet() {
        if (classInfo.fileSelected != 1) {
            // flashMessage 
            alerts.flashMessage   = 'Upload 1(One) file at a time!';
            alerts.alertBody      = 'info';
            flashShow(alerts.flashMessage, alerts.alertBody);
            classInfo.labelClass     = classInfo.labelDanger;
        } else {
            classInfo.isLoading = true;
            alerts.flashMessage   = 'Loading! Please Wait';
            alerts.alertBody      = 'info';
            flashLoading(alerts.flashMessage, alerts.alertBody);
            
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }

            let file     = classInfo.excel_file;
            let fileData = file;
            let data     = new FormData();
            data.append('excel', fileData);
            axios.post('/import/cycles/excel/'+ classInfo.year, data, config)
                .then(
                    ({ data }) => {
                        classInfo.isLoading = false;
                        // flashShowView();
                        flashUpload();
                        classInfo.labelClass    = classInfo.labelSuccess
                        clearFile();
                    })
                .catch (error => {
                    classInfo.labelClass = classInfo.labelDanger;
                    if (error.response.data.errors) {
                        let errors = error.response.data.errors.excel;
                        errors.forEach(error => {
                            // flashMessage 
                            alerts.flashMessage = error;
                            alerts.alertBody = 'danger';
                            flashShow(alerts.flashMessage, alerts.alertBody);
                        });
                    }
                });
        }
    }

    // Reference for toast notification
    const toastNotificationRef = ref(null);

    // Flash message function
    const flashShow = (info, type) => {
        flashHide();
        nextTick(() => {
            if (toastNotificationRef.value) {
                toastNotificationRef.value.toastOn([info, type]);
            }
        })
    }

    const flashLoading = (info) => {
        flashTimed(info, 'loading', 9999999)
    }

    // Method to trigger a timed flash message
    const flashTimed = (message, type, duration) => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.toastOnTime([message, type, duration]);
        }
    }

    const flashShowView = (message, body, header, url, button, duration, linkState) => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.toastClick([message, body, header, url, button, duration, linkState]);
        }
    }

    // Method to hide the loading flash message after a delay
    const flashHide = () => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.loadHide();
        }
    }

    // Method to hide all messages after a delay
    const flashAllHide = () => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.allHide();
        }
    }

    function viewDash() {
        let url = '/dashboard';
        let header = `Settings Complete, View Dashboard!`;
        let button = `View Dashboard`;
        let message = `All Settings Complete , go to dashboard?`;

        flashShowView(message, 'info', header, url, button, 15000, false);
    }

    function flashUpload() {
        let url = '/dashboard';
        router.get(url, {
            onSuccess: () => {
                return Promise.all([
                    alerts.flashMessage   = 'File Upload Successful!',
                    alerts.alertType      = 'success',
                    flashShow(alerts.flashMessage, alerts.alertType),
                    classInfo.labelClass = classInfo.labelInfo
                ])
            },
            onFinish: () => {
                viewDash();
            },
        })
    }
</script>