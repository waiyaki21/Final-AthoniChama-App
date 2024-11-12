<template>
    <!-- upload sheet & form -->
    <div :class="[]">
        <h3 :class="[classInfo.mainHeader]">
            {{ classInfo.tabheader }}
        </h3>
 
        <form @submit.prevent="submitSheet" class="p-0 space-y-2">
            <div class="flex-col items-center justify-center w-full space-y">    
                <InputLabel for="year" value="Select Cycle Year" class="w-full"/>
                
                <div class="w-full grid grid-cols-4 gap-2">
                    <select id="year" v-model="classInfo.year" name="year" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-1">
                        <option :value="moment().year() + 2">{{ moment().year() + 2}}</option>
                        <option :value="moment().year() + 1">{{ moment().year() + 1}}</option>
                        <option :value="moment().year()" selected>{{ moment().year() }}</option>
                        <option :value="moment().year() - 1">{{ moment().year() - 1}}</option>
                        <option :value="moment().year() - 2">{{ moment().year() - 2}}</option>
                    </select>

                    <a :href="'/download/template/cycle/' + classInfo.year" type="button" :class="downloadState">
                        Download {{ classInfo.year }} Template
                        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 ml-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </a>
                </div>
            </div>
            
            <div class="flex justify-center w-full flex-col">
                <InputLabel for="excel" value="Excel sheet upload"/>

                <label for="dropzone-file" :class="[classInfo.labelClass]">
                    <div class="flex flex-col items-center justify-center py-2">
                        <svg :class="[classInfo.labelSvg]" aria-hidden="true" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p :class="[classInfo.labelText]">
                            <span class="font-normal underline">Click to upload</span>
                                or drag and drop
                        </p>
                        <p :class="[classInfo.labelText]">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
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
                <button :class="[submitState]" @click.once="handleclick" v-if="!classInfo.ledger_exist">
                    Upload cycles Excelsheet
                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"  v-if = "!classInfo.isLoading">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>

                    <loading v-else
                    ></loading>
                </button>
                <button :class="[submitState]" @click="submitFalse" v-else>
                    Ledger Year Already Exists
                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </button>
            </div>
        </form>

        <!-- <loading v-else
        ></loading> -->

        <hr class="w-[80%] text-gray-800 dark:text-gray-300/30 my-2 mx-auto border-t-4 dark:border-gray-300/30">
    </div>
    <!-- end upload sheet & form -->
</template>

<script setup>
    import { router }   from '@inertiajs/vue3';
    import moment       from 'moment';
    import { reactive, defineEmits, computed } from 'vue';

    const classInfo = reactive ({
        mainHeader: 'font-boldened text-gray-800 dark:text-gray-300 leading-tight uppercase underline pb-1 md:text-3xl text-2xl',

        year: moment().year(),
        isLoading: false,
        
        // template btns 
        templateInactive: 'text-white bg-gradient-to-r from-rose-500 to-red-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm px-4 py-3 text-center me-2 inline-flex justify-center uppercase col-span-3',
        templateActive: 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-base px-4 py-3 text-center me-2 inline-flex justify-center uppercase col-span-3',
        labelActive: 'flex flex-col items-center justify-center w-full h-[15rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600',
        labelInactive: 'flex flex-col items-center justify-center w-full h-[15rem] border-2 border-red-400 border-dashed rounded-lg bg-red-400 dark:bg-red-700 dark:border-red-600 dark:hover:border-red-500 dark:hover:bg-red-600 text-black cursor-not-allowed',
        SubmitActive: 'text-white bg-gradient-to-br from-cyan-600 to-green-500 hover:bg-gradient-to-bl focus:ring focus:outline-none focus:ring-blue-300 dark:focus:ring-green-800 font-medium rounded-lg text-base px-4 py-2.5 text-center mr-2 mb-2 uppercase inline-flex justify-between w-full',
        SubmitWarning: 'text-white bg-gradient-to-br from-orange-600 to-orange-500 hover:bg-gradient-to-bl focus:ring focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 font-medium rounded-lg text-base px-4 py-2.5 text-center mr-2 mb-2 uppercase inline-flex justify-between w-full cursor-pointer',
        labelClass: '',
        labelNormal: 'text-xs text-gray-500 dark:text-gray-400',
        labelDanger: 'text-xs text-gray-900 dark:text-gray-900',
        labelText: '',
        svgNormal: 'w-8 h-8 mb-4 text-gray-500 dark:text-gray-400',
        svgDanger: 'w-8 h-8 mb-4 text-gray-900 dark:text-gray-900',
        labelSvg: '',
        downloadBtn: '',
        SubmitBtn: '',

        clicked: false,

        // excel data 
        excel_file: '',
        fileSelected: '',

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
        upload_info: '',

        // exist records 
        exist            : false,
        ledger_exist     : false,
        members_existing : '',
        members_left     : '',
        members_count    : '',
        newMembers       : []
    })

    // computed 
    const downloadState = computed(() => {
        if (!classInfo.exist) {
            classInfo.downloadBtn       = classInfo.templateActive;
            classInfo.labelText         = classInfo.labelNormal;
            classInfo.labelClass        = classInfo.labelActive;
            classInfo.labelSvg          = classInfo.svgNormal;
            check();
            return classInfo.downloadBtn;
        } else {
            classInfo.downloadBtn   = classInfo.templateInactive;
            classInfo.labelText     = classInfo.labelDanger;
            classInfo.labelClass    = classInfo.labelInactive;
            classInfo.labelSvg      = classInfo.svgDanger;
            return classInfo.downloadBtn;
        }
    })

    const submitState = computed(() => {
        if (classInfo.ledger_exist) {
            classInfo.SubmitBtn = classInfo.SubmitWarning;
            return classInfo.SubmitBtn;
        } else {
            classInfo.SubmitBtn = classInfo.SubmitActive;
            return classInfo.SubmitBtn;
        }
    })

    const emit = defineEmits(['flash','loading'])

    // check year 
    function check() {
        axios.get('/ledger/excel/exist/'+ classInfo.year)
            .then(
                ({ data }) => {
                    classInfo.ledger_exist   = data[2];
                    classInfo.flashMessage   = data[1];
                    classInfo.alertBody      = 'info';
                    emit('flash', classInfo.flashMessage, classInfo.alertBody);  
                });
    }

    // upload sheet 
    function handleclick() {
        if (!classInfo.clicked) {
            classInfo.clicked = true;
        }
    }

    // on file change 
    function onChangeFile(event) {
        classInfo.fileSelected   = event.target.files.length;
        classInfo.excel_file     = event.target.files[0];
        classInfo.upload_info    = event.target.files[0].name;
        // console.log('Uploaded sheet', classInfo.excel_file, classInfo.fileSelected);

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

        axios.post('/members/excel/exist/', data, config)
            .then(
                ({ data }) => {
                    classInfo.members_existing = data[0];
                    classInfo.members_left     = data[1];
                    classInfo.members_count    = data[0] + data[1];
                    if (data[0] > 0) {
                        classInfo.exist = true;

                        if (data[1] > 0) {
                            // flashMessage 
                            classInfo.flashMessage   = classInfo.members_existing + ' existing members and ' + classInfo.members_left +' New Member(s)!';
                            classInfo.alertBody      = 'info';
                            emit('flash', classInfo.flashMessage, classInfo.alertBody);
                        } else {
                            // flashMessage 
                            classInfo.flashMessage = 'NOTE! '+ classInfo.members_existing + ' existing members information will be updated with the current sheet information!';
                            classInfo.alertBody = 'danger';  
                            emit('flash', classInfo.flashMessage, classInfo.alertBody); 
                        }                                
                    } else {
                        classInfo.exist = false;
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
        classInfo.isLoading = true;
        if (classInfo.fileSelected != 1) {
            // flashMessage 
            classInfo.flashMessage   = 'Upload 1(One) file at a time!';
            classInfo.alertBody      = 'info';
            flashInfo(classInfo.flashMessage, classInfo.alertBody);
            classInfo.isLoading = false;
        } else {
            flashTimed();

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }

            let file     = classInfo.excel_file;
            let fileData = file;
            let data     = new FormData();
            data.append('excel', fileData);
            axios.post('/import/cycles/excel/'+classInfo.year, data, config)
                .then(
                    ({ data }) => {
                        clearFile();
                        flashUpload();
                        let url = '/cycles';
                        router.get(url);
                        classInfo.isLoading = false;
                    })
                .catch(function (err) {
                    flashUploadFail();
                    classInfo.isLoading = false;
                });
        }
    }

    function flashInfo(message, type) {
        classInfo.flashMessage   = message;
        classInfo.alertType      = type;
        emit('flash', classInfo.flashMessage, classInfo.alertType);
    }

    function flashTimed() {
        // flashMessage 
        classInfo.flashMessage   = 'Loading! Please Wait';
        emit('loading');
    }

    function flashUpload() {
        classInfo.flashMessage   = 'File Upload Successful!';
        classInfo.alertType      = 'success';
        emit('flash', classInfo.flashMessage, classInfo.alertType);
    }

    function flashUploadFail() {
        classInfo.flashMessage   = 'File Upload Failed!';
        classInfo.alertType      = 'danger';
        emit('flash', classInfo.flashMessage, classInfo.alertType);
    }
</script>