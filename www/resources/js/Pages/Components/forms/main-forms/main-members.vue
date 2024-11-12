<template>
    <!-- add members tabs  -->
    <div class="max-h-full">
        <div class="mb-1 border-b border-gray-200 dark:border-gray-700">
            <!-- tabs  -->
            <ul class="inline-flex flex-wrap mb-1 text-sm font-medium text-center overflow-x-scroll whitespace-nowrap" :data-tabs-toggle="['#' + classInfo.view_name]">
                <li class="mr-2">
                    <button :class="[classInfo.btn1class]" :id="[classInfo.tab1name]" type="button" role="tab" @click="showTab(1)">{{ classInfo.tab1name }}</button>
                </li>
                <li class="mr-2">
                    <button :class="[classInfo.btn2class]" :id="[classInfo.tab2name]" type="button" role="tab" @click="showTab(2)">{{ classInfo.tab2name }}</button>
                </li>
                <li class="mr-2">
                    <button :class="[classInfo.btn3class]" :id="[classInfo.tab3name]" type="button" role="tab" @click="showTab(3)" v-if="isFilled">
                        {{ classInfo.tab3name }}
                        <span class="bg-blue-100 text-gray-800 text-xs font-normal mx-1 px-1.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-gray-300 border-2 border-cyan-900 dark:border-cyan-500">
                            {{ classInfo.oldMembers.length + classInfo.newMembers.length}}
                        </span>
                    </button>
                </li>
            </ul>
        </div>
        <!-- tabs body  -->
        <div :id="[classInfo.view_name]">
            <div :class="[classInfo.tabBody]" v-if="classInfo.tab1body">
                <div class="w-full m-1 text-left mx-auto overflow-hidden  h-fit">
                    <ActionButton :class="[classInfo.templateActive, 'w-full uppercase']" buttonClass='info' @handleClick="$downloadFile('/download/template/members')"
                        :tooltipText="`Download Members Template Usable for data entry`"
                        :buttonText="`Download Template.`">
                        <download-info class="w-6 h-6 ml-2"></download-info>
                    </ActionButton>

                    <hr-line :color="'border-cyan-500/50 dark:border-cyan-500/50'"></hr-line>

                    <form @submit.prevent="classInfo.hasFile ? submitSheetAsync : flashShow('Upload a file', 'info')" @drop.prevent="getDrop" class="p-0" v-if = "!classInfo.isLoading">                
                        <div class="flex items-center justify-center w-full flex-col">
                            <label for="dropzone-file" :class="[classInfo.label, classInfo.labelClass]">
                                <div class="flex flex-col items-center justify-center py-2">
                                    <cloud-icon class="w-8 h-8 mb-2 dark:text-white text-black"></cloud-icon>
                                    <p class="mb-1 text-2xs dark:text-white text-black"><span class="font-normal mb-0.5">Click to upload</span></p>
                                    <p class="text-xs dark:text-white text-black">XLS, XLXS (MAX. 5MB)</p>
                                </div>
                                <input type="file" id="excel" name="excel" ref="excel"
                                class="my-2 overflow-hidden whitespace-nowrap w-[90%] text-2xs dark:text-white text-black border-base border-cyan-700 dark:border-cyan-700 rounded-xl" @change="onChangeFileMembers" />
                            </label>
                        </div> 

                        <span :class="['inline-flex text-2xs p-1 text-teal-800 dark:text-teal-500 w-full justify-center my-0.5 rounded-md gap-2']" v-if="classInfo.fileSelected != 0">
                            <download-icon class="my-auto w-4 h-4 text-teal-800 dark:text-teal-500 ml-1"></download-icon>
                            <p class="text-sm py-1 underline uppercase">
                                {{ classInfo.upload_info }}
                            </p>
                        </span>

                        <div class="flex items-center justify-start my-2" v-if="!isFilled">
                            <button
                                :class="[
                                    'text-white font-medium rounded-lg px-4 py-2.5 text-center mb-1 uppercase inline-flex justify-between w-full text-md bg-gradient-to-br from-rose-500 to-red-800 hover:bg-gradient-to-bl focus:ring-red-300 dark:focus:ring-red-800'
                                ]"
                                @click.once="flashShow('Upload a file', 'danger')" v-if="!classInfo.hasFile">
                                <span>Select a Members Excelsheet</span>
                                <submit-icon class="w-6 h-6"></submit-icon>
                            </button>

                            <button
                                :class="[
                                    'text-white font-medium rounded-lg px-4 py-2.5 text-center mb-1 uppercase inline-flex justify-between w-full text-md',
                                    classInfo.exist 
                                    ? 'bg-gradient-to-br from-rose-500 to-red-800 hover:bg-gradient-to-bl focus:ring-red-300 dark:focus:ring-red-800'
                                    : 'bg-gradient-to-br from-cyan-600 to-green-500 hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-green-800'
                                ]"
                                @click.once="classInfo.hasFile ? handleclick : flashShow('Upload a file', 'danger')" v-else>
                                <span v-if="!classInfo.exist">Upload Members Excelsheet</span>
                                <span v-else>Members Already Exist</span>
                                <submit-icon class="w-6 h-6"></submit-icon>
                            </button>
                        </div>

                        <div class="flex items-center justify-start my-2" v-else>
                            <section class="w-full justify-between gap-2 grid grid-cols-2">
                                <ActionButton class="col-span-2" buttonClass='submitSuccess' @handleClick="submitSheetStyle(0)"
                                    :tooltipText="`Submit Spreadsheet to Update Existing Members & Enter New Members if any`"
                                    :buttonText="`Submit Spreadsheet.`">
                                    <submit-icon class="w-4 h-4 md:w-5 md:h-5"></submit-icon>
                                </ActionButton>

                                <ActionButton :class="parentName == 'Modal' ? 'col-span-1' : 'col-span-2'" buttonClass='submitWarning' @handleClick="submitSheetStyle(1)"
                                    :tooltipText="`Update Existing Members ${classInfo.oldMembers.length}`"
                                    :buttonText="`Update ${classInfo.oldMembers.length} Existing Members.`"
                                    v-if="classInfo.oldMembers.length > 0">
                                    <edit-icon class="w-4 h-4 md:w-5 md:h-5"></edit-icon>
                                </ActionButton>

                                <ActionButton :class="parentName == 'Modal' ? 'col-span-1' : 'col-span-2'" buttonClass='submitOther' @handleClick="submitSheetStyle(2)"
                                    :tooltipText="`Add New Members ${classInfo.newMembers.length}`"
                                    :buttonText="`Enter ${classInfo.newMembers.length} New Members.`"
                                    v-if="classInfo.newMembers.length > 0">
                                    <star-icon class="w-4 h-4 md:w-5 md:h-5"></star-icon>
                                </ActionButton>
                            </section>
                            
                        </div>
                    </form>

                    <loading v-else
                    ></loading>
                </div>
            </div>
            <div :class="[classInfo.tabBody]" v-if="classInfo.tab2body">
                <div class="w-full m-1 text-left mx-auto overflow-hidden">
                    <!-- members form  -->
                    <form @submit.prevent="submit" class="grid grid-cols-2 md:grid-cols-2 gap-1">
                        <div class="col-span-2">
                            <InputLabel for="name" value="Member Name" />

                            <TextInput id="name" type="name" v-model="form.name" :placeholder="form.name" autofocus />

                            <InputError class="mt-2" :message="form.errors.name" />
                        </div>

                        <div :class="parentName == 'Modal' ? 'col-span-1' : 'col-span-2'">
                            <InputLabel for="telephone" value="Member Phonenumber" />

                            <TextInput id="telephone" type="name" v-model="form.telephone" :placeholder="form.telephone"
                                autofocus />

                            <InputError class="mt-2" :message="form.errors.telephone" />
                        </div>

                        <div :class="parentName == 'Modal' ? 'col-span-1' : 'col-span-2'">
                            <InputLabel for="amount_before" value="T.Contributions Before" />

                            <TextInput id="amount_before" type="name" v-model="form.amount_before"
                                :placeholder="form.amount_before" autofocus />

                            <InputError class="mt-2" :message="form.errors.amount_before" />
                        </div>

                        <div :class="parentName == 'Modal' ? 'col-span-1' : 'col-span-2'">
                            <InputLabel for="welfare_before" value="T.Welfare Before" />

                            <TextInput id="welfare_before" type="name" v-model="form.welfare_before"
                                :placeholder="form.welfare_before" autofocus />

                            <InputError class="mt-2" :message="form.errors.welfare_before" />
                        </div>

                        <div :class="parentName == 'Modal' ? 'col-span-1' : 'col-span-1'">
                            <InputLabel for="welfareowed_before" value="T.Welfare Owed Before (APRIL 2024)" />

                            <TextInput id="welfareowed_before" type="number" v-model="form.welfareowed_before"
                                :placeholder="form.welfareowed_before" autofocus />

                            <InputError class="mt-2" :message="form.errors.welfareowed_before" />
                        </div>

                        <div :class="parentName == 'Modal' ? 'col-span-1' : 'col-span-1'">
                            <InputLabel for="welfare_owing_may" value="T.Welfare Owed After (MAY 2024)" />

                            <TextInput id="welfare_owing_may" type="number" v-model="form.welfare_owing_may" :placeholder="form.welfare_owing_may" autofocus />

                            <InputError class="mt-2" :message="form.errors.welfare_owing_may" />
                        </div>

                        <div class="col-span-2">
                            <InputLabel for="active" value="Member Active" />

                            <select id="active" v-model="form.active" name="active"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full">
                                <option :value="1">
                                    <span>Active</span>
                                </option>
                                <option :value="0">
                                    <span>Inactive</span>
                                </option>
                            </select>
                        </div>

                        <div class="flex items-center justify-start mt-4 w-full col-span-2 md:col-span-2">
                            <SubmitButton :class="[{ 'opacity-25': form.processing }, 'w-full']"
                                :disabled="form.processing">
                                Submit Member
                            </SubmitButton>
                        </div>
                    </form>
                </div>
            </div>
            <div :class="[classInfo.tabBody]" v-if="classInfo.tab3body">
                <div class="w-full m-1 text-left mx-auto overflow-hidden">
                    <section class="flex flex-col w-full">
                        <span class="inline-flex justify-start gap-1">
                            <span class="underline text-xl md:text-2xl text-gray-800 dark:text-gray-300 uppercase">Excel Sheet Stats.</span>
                        </span>
                        <section class="font-normal text-md leading-tight uppercase p-1 w-full inline-flex justify-start gap-1">
                            <span :class="classInfo.infoBadge" @click="allSheet(0)">
                                All Members ( {{ Number(classInfo.oldMembers.length + classInfo.newMembers.length).toLocaleString() }} ).
                            </span>
                            <span :class="classInfo.successBadge" @click="allSheet(1)">
                                Existing Members ( {{ classInfo.oldMembers.length }} ).
                            </span>
                            <span :class="classInfo.failBadge" @click="allSheet(2)">
                                New Members ( {{ classInfo.newMembers.length }} ).
                            </span>
                        </section>
                    </section>

                    <ul class="w-full divide-y divide-gray-200 dark:divide-gray-700 overflow-y-scroll h-auto max-h-[20rem]">
                        <li class="pb-3 sm:pb-4" v-for="(member) in sheetMembers">
                            <div class="flex items-center gap-2 rtl:space-x-reverse">
                                <div class="flex-shrink-0">
                                    <checksolid-icon class="w-6 h-6 me-2 text-green-500 dark:text-green-400 flex-shrink-0" v-tooltip="$tooltip('Member Exists', 'right')" v-if="member.exists"></checksolid-icon>
                                    <timessolid-icon class="w-6 h-6 me-2 text-red-500 dark:text-red-400 flex-shrink-0" v-tooltip="$tooltip('Member Does Not Exist', 'right')" v-else></timessolid-icon>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p :class="['text-sm md:text-md font-normal uppercase truncate hover:cursor-pointer hover:underline', member.exists ? 'text-emerald-900 dark:text-emerald-400 hover:text-emerald-500' : 'text-red-900 dark:text-red-400 hover:text-rose-500']" @click="member.exists ? getRoute(member): flashShow(`This Member doesn't exist`, 'info')">
                                        {{ member.name }}
                                    </p>
                                    <p class="text-2xs md:text-xs text-gray-500 truncate dark:text-gray-400">
                                        {{ member.telephone }}
                                    </p>
                                </div>
                                <div :class="[classInfo.memInfo, member.exists ? 'text-emerald-900 dark:text-emerald-400' : 'text-red-900 dark:text-red-400']">
                                    ${{ Number(member.amount_before).toLocaleString() }}
                                </div>
                                <div :class="[classInfo.memInfo, member.exists ? 'text-emerald-900 dark:text-emerald-400' : 'text-red-900 dark:text-red-400']">
                                    ${{ Number(member.welfare_before).toLocaleString() }}
                                </div>
                                <div :class="[classInfo.memInfo, member.welfare_owing_may ? 'text-teal-900 dark:text-teal-400' : 'text-orange-900 dark:text-orange-400']">
                                    ${{ Number(member.welfare_owing_may).toLocaleString() }}
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useForm, router } from '@inertiajs/vue3';
    import { onBeforeMount, reactive, computed, defineEmits, onMounted, onUnmounted, ref, getCurrentInstance, watch } from 'vue'

    import { useFileUploadMembers, onSubmitSheetAsync } from '../../../Methods/postMethods.js'

    const emit = defineEmits(['reload', 'close', 'view', 'flash', 'timed', 'hide'])

    onBeforeMount(() => {
        clearAll();
        showTab(2);
    })

    onMounted(() => {
        clearAll();
        showTab(2);

        const instance = getCurrentInstance()
        const parentName = instance?.parent?.type?.name

        if (parentName == 'BaseTransition' || parentName == 'Transition') {
            const parentName = 'Modal'
            console.log('Parent component name:', parentName)
        } else {
            const parentName = 'Regular' 
            console.log('Parent component name:', parentName)
        }
    })

    onUnmounted(() => {
        clearAll();
    })

    // classes 
    const classInfo = reactive({
        isLoading: false,
        filled: false,

        modalCloseBtn: 'cursor-pointer dark:text-cyan-800 text-cyan-500 transition-transform hover:rotate-180 w-6 h-6 hover:w-8 hover:h-8',

        info: [],
        countNo: '',
        newMember: {},
        oldMembers: [],
        newMembers: [],
        allMembers: [],

        infoSection: 'w-full m-2 p-2 text-left mx-auto border-2 shadow-md border border-cyan-500 p-1 overflow-hidden ',
        infoHeader: 'text-cyan-300 mb-1 text-md text-left font-normal underline tracking-tight uppercase',
        borderClass: 'overflow-hidden font-boldened flex-col space-y-1 justify-between p-0 md:m-2 sm:m-0.5 sm:my-0.5 rounded-lg bg-gray-300 dark:bg-gray-800/50 shadow-md border-[3px] border-cyan-300 dark:border-cyan-700',
        mainHeader: 'font-boldened text-xl text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1',
        
        // template btns 
        templateInactive: 'text-white bg-gradient-to-r from-rose-500 to-red-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-xs px-4 py-2.5 text-center me-2 mb-1 inline-flex justify-between cursor-not-allowed',
        templateActive: 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm md:text-md p-2 text-center me-2 mb-1 inline-flex justify-between',
        label: 'flex flex-col items-center justify-center w-full h-fit border-2 border-dashed rounded-lg cursor-pointer',
        labelClass: '',
        labelDef: 'border-gray-300 bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500',
        labelInfo: 'border-cyan-300 bg-cyan-50 dark:hover:bg-cyan-600/80 dark:bg-cyan-800/80 hover:bg-cyan-100 dark:border-cyan-600 dark:hover:border-cyan-500 dark:hover:bg-cyan-600',
        labelDanger: 'border-red-300 bg-red-50 dark:hover:bg-red-600/80 dark:bg-red-800/80 hover:bg-red-100 dark:border-red-600 dark:hover:border-red-500 dark:hover:bg-red-600',
        labelLoading: 'border-orange-300 bg-orange-50 dark:hover:bg-orange-600/80 dark:bg-orange-800/80 hover:bg-orange-100 dark:border-orange-600 dark:hover:border-orange-500 dark:hover:bg-orange-600',
        labelSuccess: 'border-green-300 bg-green-50 dark:hover:bg-green-600/50 dark:bg-green-800/80 hover:bg-green-100 dark:border-green-600 dark:hover:border-green-500 dark:hover:bg-green-600',

        successBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-green-900 border-black bg-green-400 rounded-md shadow-md py-1 px-2 my-auto hover:cursor-pointer',
        infoBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-cyan-900 border-black bg-cyan-400 rounded-md shadow-md py-1 px-2 my-auto hover:cursor-pointer',
        failBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-red-900 border-black bg-rose-400 rounded-md shadow-md py-1 px-2 my-auto hover:cursor-pointer',

        memInfo: 'inline-flex items-center text-sm md:text-base font-normal md:font-semibold md:border-r-base md:mr-2 md:pr-2 md:border-white/20',

        clicked: false,

        // exist records 
        exist: false,
        members_existing : '',
        members_left     : '',
        members_count    : '',

        // excel data 
        excel_file: '',
        fileSelected: '',
        hasFile: false,

        // text
        confirmText: '',

        // page name 
        view_name: "add_members",

        // tabs
        // classes
        activeTab: 'inline-block p-0.5 border-b-base border-blue-700 uppercase text-blue-700 font-boldened dark:text-blue-700 dark:hover:text-cyan-500 text-xs md:text-base',
        inactiveTab: 'inline-block p-0.5 border-b-base border-transparent hover:text-gray-600 hover:border-gray-300 uppercase font-boldened dark:text-gray-300 dark:hover:text-cyan-300 text-xs md:text-base',
        tabBody: 'relative flex flex-col min-w-0 break-words w-full mb-1 font-boldened',
        btn1class: '',
        btn2class: '',
        btn3class: '',

        // bodies 
        tab1body: false,
        tab2body: true,
        tab3body: false,

        // bodies 
        tab1name: 'Upload Sheet',
        tab2name: 'Enter Member',
        tab3name: 'Sheet Info',

        file_size: '',
        file_name: '',
        upload_info: '',

        modalName: '',
        modalLists: [],
    })

    const form = useForm({
        name: '',
        telephone: '',
        amount_before: '0',
        welfare_before: '0',
        welfareowed_before: '0',
        welfare_owing_may: '0',
        active: 1,
    })

    const isFilled = computed(() => {
        // Check if file is not empty
        if (classInfo.fileSelected) {
            classInfo.filled = true;
            return classInfo.filled;
        } else {
            classInfo.filled = false;
            return classInfo.filled;
        }  
    })

    watch(() => classInfo.fileSelected, (newValue) => {
        // If fileSelected is not an empty string, set hasFile to true
        classInfo.hasFile = newValue !== ''
    })

    // Create a ref to track which members to show (0 = all, 1 = existing, 2 = new)
    const sheetFilter = ref(0);

    // Method to update sheetFilter based on user selection
    function allSheet(filterType) {
        sheetFilter.value = filterType;
    }

    // Computed property to filter members based on sheetFilter
    const sheetMembers = computed(() => {
        let tempMembers = classInfo.allMembers;

        if (tempMembers) {
            // Filter based on sheetFilter (0 = all, 1 = existing, 2 = new)
            if (sheetFilter.value === 1) {
                return tempMembers.filter(member => member.exists === true); // Only existing members
            } else if (sheetFilter.value === 2) {
                return tempMembers.filter(member => member.exists === false); // Only new members
            }
            return tempMembers; // Show all members
        }
        return [];
    })

    function getRoute(member) {
        // create url 
        let url = `/member/${member.id}`;
        // toast Notification 
        flashShow(`Now Showing ${member.name}`, 'info')
        // router 
        router.get(url);
        // close modal 
        if (parentName == 'Modal') {
            emit('close');
        }
    }

    // tabs 
    // show tabs 
    function showTab(tabIndex) {
        classInfo.tab1body = tabIndex === 1;
        classInfo.tab2body = tabIndex === 2;
        classInfo.tab3body = tabIndex === 3;

        classInfo.btn1class = tabIndex === 1 ? classInfo.activeTab : classInfo.inactiveTab;
        classInfo.btn2class = tabIndex === 2 ? classInfo.activeTab : classInfo.inactiveTab;
        classInfo.btn3class = tabIndex === 3 ? classInfo.activeTab : classInfo.inactiveTab;

        if (tabIndex === 1) {
            setInfo();  // Call `setInfo` only when tab1 is shown, based on your initial logic
        }
    }

    // submit form 
    function submit() {
        let url = '/member/';
        let name = form.name;
        let message = '';
        let type = '';

        axios.post(url, form)
            .then(
                ({ data }) => {
                    message = `New member: ${name} Added!`
                    type = 'success'
                    flashShow(message, type)
                    getNewMember()
                    clearAll();
                })
            .catch(error => {
                let time = 5000;

                console.log(error.response.data.errors);
                let message = error.response.data.message;
                let type = 'danger';

                if (error.response.data.errors) {
                    let errors = error.response.data.errors;

                    // Iterate over the keys of the errors object
                    Object.keys(errors).forEach(key => {
                        errors[key].forEach(errMsg => {
                            time += 1000; // Increase delay
                            // flashMessage 
                            emit('timed', errMsg, 'danger', time);
                        });
                    });
                }

                flashShow(message, type);
            });
    }

    // regulate uploads & prevent double requests of upload sheet 
    function handleclick() {
        if (!classInfo.clicked) {
            classInfo.clicked = true;
        }
    }

    // on file change 
    function getDrop(event) {
        console.log(event);
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

    // on file selection 
    // Use the composable function and pass the flash methods
    const { onChangeFileMembers } = useFileUploadMembers(classInfo, pluralCheck, {
        clearAll,
        flashTimed,
        flashHide,
        flashShow,
        flashMessages,
    });

    function submitSheetStyle(id) {
        allSheet(id)

        if (id == 0 || id == null) {
           flashShow(`Submitting New Members & Updating Existing Members!`, `info`) 
           classInfo.confirmText = `All existing members will be updated and new Members will added, ready?`;
           submitSheetAsync();
        }

        if (id == 1) {
            flashShow(`Updating Existing Members!`, `info`) 
            classInfo.confirmText = `All existing members will be updated, ready?`;
            submitSheetAsync();
        }

        if (id == 2) {
            flashShow(`Submitting New Members!`, `info`) 
            classInfo.confirmText = `All new Members will added, ready?`;
            submitSheetAsync();
        }
    }

    // Main function: submit/update members
    const { submitSheetAsync } = onSubmitSheetAsync(classInfo, form, true, sheetMembers, {
        flashShow, flashTimed, flashHide, refresh, getAllMembers, clearAll
    });

    function refresh() {
        emit('reload');
    }

    // get members info 
    // get number of members if upload sheet is clicked
    function setInfo() {
        let link = 'desc';
        let linkTo = 'id/';

        axios.get('/api/getMembers/' + linkTo + link)
            .then(
                ({ data }) => {
                    classInfo.countNo = data[1];
                    let messages = [
                        {
                            'info': `Spreadsheets can be used to add new members!`,
                            'delay': 100,
                            'type': 'warn',
                            'duration': 100000
                        },
                        {
                            'info': `Spreadsheets can be used to update existing members!`,
                            'delay': 1100,
                            'type': 'info',
                            'duration': 100000
                        }
                    ];
                    if (classInfo.countNo > 0 && !classInfo.fileSelected) {
                        flashMessages(messages);
                    }
                });
    }

    // toast notifications if upload sheet is clicked 
    function flashMessages(messages) {
        messages.forEach(message => {
            setTimeout(() => {
                flashTimed(message.info, message.type, message.duration);
            }, message.delay);
        });
    }

    // get the new member info with a toast view to go to page 
    function getNewMember() {
        axios.get('/api/getMember/new')
            .then(
                ({ data }) => {
                    classInfo.newMember = data[0];
                    let name            = data[0].name;
                    if (parentName == 'Modal') {
                        emit('close');
                    }

                    let url     = '/member/'+ data[0].id;
                    let header  = 'New Member: '+ name +'!';
                    let button  = 'View Member';
                    let body    = 'info';
                    let message = `Click to view all new member: ${name}`;

                    flashShowView(message, body, header, url, button, 15000, true);
                });
    }

    // toast view to go to all members page 
    function getAllMembers() {
        if (parentName == 'Modal') {
            emit('close');
        }
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
        form.telephone          = '';
        form.amount_before      = '0';
        form.welfare_before     = '0';
        form.welfareowed_before = '0';
        form.welfare_owing_may  = '0';
        form.active             = 1;
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
        classInfo.labelClass         = classInfo.labelDef;
    }

    // clear all info 
    function clearAll() {
        clearFields();
        clearFile();
        classInfo.isLoading = false;
    }

    // flash messages 
    function flashShow(message, body) {
        emit('flash', message, body)
    }

    function flashLoading(message) {
        classInfo.isLoading      = true;
        emit('timed', message, 'warning', 100000000)
    }

    function flashHide() {
        emit('hide')
    }

    function flashTimed(message, body, duration) {
        emit('timed', message, body, duration)
    }

    function flashShowView(message, body, header, url, button, duration, linkState) {
        emit('view', message, body, header, url, button, duration, linkState);
    }
</script>