<template>
    <!-- enter cycles form  -->
    <section :class="['overflow-hidden font-boldened flex-col w-3/5 space-y-1 justify-between p-2 m-2 rounded-lg bg-gray-300 dark:bg-gray-800/50 shadow-md sm:rounded-lg h-fit', classInfo.borderClass]">
        <h3 class="font-boldened  flex-col  w-full flex py-2 px-1">
            <span :class="[this.mainHeader, 'text-3xl']">Add Cycles</span>
            <span class="text-xs text-gray-500 dark:text-gray-500/40 mb-0.5" v-if="props.count = 0">
                (upload an excel sheet to add more cycles)
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-500/40 mb-0.5" v-else>
                (upload an excel sheet to add new cycles)
            </span>
        </h3>
        <!-- cycles forms tabs  -->
        <div class="text-sm font-boldened text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 w-full mb-2 mx-2 p-2">
            <ul class="flex flex-wrap -mb-px">
                <li class="me-2">
                    <a :class="[classInfo.tab1Bad]" @click="alert('Create a cycle using the form first')" v-if="props.current != null">
                        Upload Sheet.
                    </a>
                    <a :class="[classInfo.tab1]" @click="tabSwitch()" v-else>
                        Upload Sheet.
                    </a>
                </li>
                <li class="me-2">
                    <a :class="[classInfo.tab2]" @click="tabSwitch()">
                        Enter cycles Form.
                    </a>
                </li>
            </ul>
        </div>
        <!-- end cycles forms tabs  -->

        <!-- upload sheet & form -->
        <div :class="[]">
            <h3 :class="[this.mainHeader]">
                {{ classInfo.tabheader }}
            </h3>

            <form @submit.prevent="submitSheet" class="p-0 space-y-4" v-if="tab1show">
                <div class="flex-col items-center justify-center w-full space-y">    
                    <InputLabel for="year" value="Select Cycle Year" class="w-full"/>
                    
                    <div class="inline-flex items-center justify-center w-full space-x-2">
                        <select id="year" v-model="classInfo.year" name="year" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-1/4">
                            <option :value="moment().year() + 2">{{ moment().year() + 2}}</option>
                            <option :value="moment().year() + 1">{{ moment().year() + 1}}</option>
                            <option :value="moment().year()" selected>{{ moment().year() }}</option>
                            <option :value="moment().year() - 1">{{ moment().year() - 1}}</option>
                            <option :value="moment().year() - 2">{{ moment().year() - 2}}</option>
                        </select>

                        <a :href="'/download/template/cycle/' + classInfo.year" type="button" :class="[this.templateActive, 'w-3/4']">
                            Download {{ classInfo.year }} Template
                            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 ml-2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </a>
                    </div>
                </div>
                
                <div class="flex justify-center w-full flex-col">
                    <InputLabel for="excel" value="Excel sheet upload"/>
                    
                    <label for="dropzone-file" :class="[classInfo.labelClass, 'shadow-md']">
                        <div class="flex flex-col items-center justify-center py-2">
                            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-normal underline">Click to upload</span></p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input type="file" id="excel" name="excel" ref="excel" class="overflow-hidden p-1 whitespace-nowrap w-4/5 text-sm text-center" @change="onChangeFile"/>
                    </label>

                    <span :class="['inline-flex text-xs py-2 px-4 border border-cyan-700 dark:border-cyan-700 bg-sky-600 dark:bg-sky-300 text-gray-300 dark:text-gray-800 w-full justify-center my-2 rounded-md space-x-2']" v-if="classInfo.fileSelected != 0">
                        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-900 dark:text-gray-900 ml-1">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <p class="text-sm py-1">
                            {{ classInfo.upload_info }}
                        </p>
                    </span>
                </div> 

                <div class="flex items-center justify-start mt-4">
                    <button class="text-white bg-gradient-to-br from-cyan-600 to-green-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-green-800 font-medium rounded-lg text-base px-4 py-2.5 text-center mr-2 mb-2 uppercase inline-flex justify-between w-full" @click.once="handleclick">
                        Upload cycles Excelsheet
                        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>

                    </button>
                </div>
            </form>

            <!-- cycles form  -->
            <form @submit.prevent="submit" v-if="!classInfo.tab1show">
                <div>
                    <InputLabel for="name" value="name" />

                    <TextInput id="name" type="name" v-model="form.name" required autofocus />

                    <InputError class="mt-2" :message="form.errors.name" />
                </div>

                <div>
                    <InputLabel for="date" value="date" />

                    <TextInput id="date" type="date" v-model="form.date" required autofocus />

                    <InputError class="mt-2" :message="form.errors.date" />
                </div>

                <div>
                    <InputLabel for="amount" value="Contribution per Person" />

                    <TextInput id="amount" type="number" v-model="form.amount" required autofocus />

                    <InputError class="mt-2" :message="form.errors.amount" />
                </div>

                <div>
                    <InputLabel for="welfare_amnt" value="Welfare Amount Per Person" />

                    <TextInput id="welfare_amnt" type="number" v-model="form.welfare_amnt" required autofocus />

                    <InputError class="mt-2" :message="form.errors.welfare_amnt" />
                </div>

                <div class="flex items-center justify-start mt-4">
                    <SubmitButton :class="[{ 'opacity-25': form.processing}, 'w-full']" :disabled="form.processing">
                        Submit
                    </SubmitButton>
                </div>
            </form>

            <hr class="w-[80%] text-gray-800 dark:text-gray-300/30 my-2 mx-auto border-t-4 dark:border-gray-300/30">

        </div>
        <!-- end upload sheet & form -->
    </section>
    <!-- end enter cycles form  -->
</template>

<script setup>
    import { useForm } from '@inertiajs/vue3';
    import { defineProps, defineEmits, reactive, onMounted } from 'vue'

    // form imports 
    import InputError from '@/Components/FormComponents/InputError.vue';
    import InputLabel from '@/Components/FormComponents/InputLabel.vue';
    import SubmitButton from '@/Components/FormComponents/SubmitButton.vue';
    import TextInput from '@/Components/FormComponents/TextInput.vue';

    import moment from 'moment';

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

    const form = useForm({
        name: '',
        date: '',
        amount: '',
        welfare_amnt: ''
    })

    const classInfo =  reactive({
        info: [],

        infoSection: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        infoHeader: 'text-cyan-300 mb-2 text-2xl text-left font-normal underline tracking-tight uppercase',
        borderClass: 'border-[3px] border-cyan-300 dark:border-cyan-700',
        mainHeader: 'font-boldened text-2xl text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1',

        year: moment().year(),
        
        // template btns 
        templateInactive: 'text-white bg-gradient-to-r from-rose-500 to-red-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm px-4 py-3 text-center me-2 inline-flex justify-center cursor-not-allowed',
        templateActive: 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-base px-4 py-3 text-center me-2 inline-flex justify-center w-3/4 uppercase',
        labelClass: 'flex flex-col items-center justify-center w-full h-[15rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600',

        clicked: false,

        // excel data 
        excel_file: '',
        fileSelected: '',

        // tabs 
        tabActive: 'inline-block p-2 text-blue-600 border-b border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 text-xs cursor-pointer mx-1',
        tabInactive: 'inline-block p-2 border-b border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-xs cursor-pointer mx-1',
        tabActive100: 'inline-block p-2 text-green-600 border-b border-green-600 rounded-t-lg active dark:text-green-500 dark:border-green-500 text-xs cursor-pointer mx-1',
        tabInactive100: 'inline-block p-2 dark:text-teal-300 border-b border-transparent rounded-t-lg hover:text-teal-600 hover:border-teal-300 dark:border-teal-300 dark:hover:border-teal-600 dark:hover:text-teal-600 text-xs cursor-pointer mx-1',
        tab1: '',
        tab2: '',
        tab1Bad: 'inline-block p-2 border-b border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-xs cursor-not-allowed mx-1',
        tab1show: false,
        tab2show: true,
        tabheader: '',

        // alerts
        alertShow: false,
        alertType: '',
        flashMessage: '',
        alertBody: 'border-b-[4px] border-gray-500 shadow-gray-900 dark:shadow-gray-900 bg-gray-100 dark:bg-gray-500',
        alertSuccess: 'border-b-[4px] border-emerald-800 dark:border-emerald-800 shadow-green-900 dark:shadow-green-900 bg-green-100 dark:bg-green-500',
        alertInfo: 'border-b-[4px] border-blue-800 dark:border-blue-800 shadow-blue-900 dark:shadow-blue-900 bg-blue-100 dark:bg-blue-500',
        alertWarning: 'border-b-[4px] border-orange-800 dark:border-orange-800 shadow-orange-900 dark:shadow-orange-900 bg-orange-100 dark:bg-orange-500',
        alertDanger: 'border-b-[4px] border-red-800 dark:border-red-800 shadow-red-900 dark:shadow-red-900 bg-red-100 dark:bg-red-500',

        file_size: '',
        file_name: '',
        upload_info: ''
    })

    const emit = defineEmits(['flash', 'loading'])

    onMounted(() => {
        setFields()
        tabClass()
    })
 
    function tabSwitch() {
        classInfo.tab1show = !classInfo.tab1show;

        tabClass();
    }

    function tabClass() {
        if (props.current == null) {
            classInfo.tab1show == true;
            classInfo.tabheader = 'Upload spreadsheet';
            if (classInfo.tab1show == true) {
                classInfo.tab1 = classInfo.tabActive100;
                classInfo.tab2 = classInfo.tabInactive100;
                classInfo.tabheader = 'Upload spreadsheet';
            } else {
                classInfo.tab2 = classInfo.tabActive100;
                classInfo.tab1 = classInfo.tabInactive100;
                classInfo.tabheader = 'Add Cycle form';
            }
        } else {
            classInfo.tab1show == false;
            if (classInfo.tab1show == true) {
                classInfo.tab1 = classInfo.tabActive;
                classInfo.tab2 = classInfo.tabInactive;
                classInfo.tabheader = 'Upload spreadsheet';
            } else {
                classInfo.tab2 = classInfo.tabActive;
                classInfo.tab1 = classInfo.tabInactive;
                classInfo.tabheader = 'Add Cycle form';
            }
        }
    }

    function setFields() {
        form.name          = props.nextname;
        form.date          = new Date().toISOString().slice(0, 10);
        form.amount        = props.settings.payment_def;
        form.welfare_amnt  = props.settings.welfare_def;
    }

    function clearFields() {
        form.name = '';
        form.telephone = '';
        form.amount_before = '';
        form.welfare_before = '';
    }

    function submit() {
        let url = '/cycle/';
        let name = form.name;

        form.post(url, {
            onFinish: () => clearFields(),

            onSuccess: () => [
                console.log('test'),
                classInfo.flashMessage = 'New cycle: ' + name + ' Added!',
                classInfo.alertType = 'success',
                emit('flash', classInfo.flashMessage, classInfo.alertType),
            ],

            onError: () => [
                // console.log(form.errors),
                classInfo.flashMessage = 'Failed! Try Again',
                classInfo.alertType = 'danger',
                emit('flash', classInfo.flashMessage, classInfo.alertType),
            ]
        });
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
        let data = new FormData();
        data.append('excel', fileData);

        axios.post('/members/excel/exist/', data, config)
            .then(
                ({ data }) => {
                    classInfo.members_existing = data[0];
                    classInfo.members_left = data[1];
                    classInfo.members_count = data[0] + data[1];
                    if (data[0] > 0) {
                        if (data[1] > 0) {
                            classInfo.labelClass = classInfo.labelInfo;
                            // flashMessage 
                            classInfo.flashMessage = classInfo.members_existing + ' existing members and ' + classInfo.members_left + ' New Member(s)!';
                            classInfo.alertBody = 'info';
                            emit('flash', classInfo.flashMessage, classInfo.alertBody);
                        } else {
                            // flashMessage 
                            classInfo.flashMessage = 'NOTE! ' + classInfo.members_existing + ' existing members information will be updated with the current sheet information!';
                            classInfo.alertBody = 'danger';
                            classInfo.labelClass = classInfo.labelInfo;
                            emit('flash', classInfo.flashMessage, classInfo.alertBody);
                        }
                    } else {
                        classInfo.exist = false;
                        classInfo.labelClass = classInfo.labelInfo;
                        // flashMessage 
                        classInfo.flashMessage = classInfo.members_left + ' new members will be added!!';
                        classInfo.alertBody = 'info';
                        emit('flash', classInfo.flashMessage, classInfo.alertBody);
                    }
                });
    }

    function clearFile() {
        classInfo.fileSelected   = '';
        classInfo.excel_file     = '';
        classInfo.file_name      = '';
        classInfo.file_size      = '';
        classInfo.upload_info    = '';
    }

            // submit product Sheet
    function submitSheet() {
        if (classInfo.fileSelected != 1) {
            // flashMessage 
            classInfo.flashMessage   = 'Upload 1(One) file at a time!';
            classInfo.alertBody      = 'border-b-[4px] border-blue-800 dark:border-blue-800 shadow-blue-900 dark:shadow-blue-900 bg-blue-100 dark:bg-blue-500';
            emit('flash', classInfo.flashMessage, classInfo.alertBody);
        } else {

            // flashMessage 
            classInfo.flashMessage   = 'Loading! Please Wait';
            classInfo.alertBody      = 'border-b-[4px] border-blue-800 dark:border-blue-800 shadow-blue-900 dark:shadow-blue-900 bg-blue-100 dark:bg-blue-500';
            emit('flash', classInfo.flashMessage, classInfo.alertBody);
            
            // let existingObj = this;
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }

            let file = classInfo.excel_file;

            // get file name
            let fileName = file.name;
            // get file size
            let fileSize = Number(file.size / 1000000).toFixed(2);
            let fileData = file;
            let data    = new FormData();
            data.append('excel', fileData);
            axios.post('/import/cycles/excel/'+ classInfo.year, data, config)
                .then(
                    ({ data }) => {
                        // this.info = data[0];
                        // console.log(data);
                        cclearFile();
                        cflashUpload();
                    })
                .catch(function (err) {
                    flashUploadFail();
                });
        }
    }

    function flashUpload() {
        classInfo.flashMessage   = 'Upload Successful!';
        classInfo.alertType      = 'success';
        emit('flash', classInfo.flashMessage, classInfo.alertType);
    }

    function flashUploadFail() {
        classInfo.flashMessage   = 'Upload Failed!';
        classInfo.alertType      = 'danger';
        emit('flash', classInfo.flashMessage, classInfo.alertType);
    }
</script>