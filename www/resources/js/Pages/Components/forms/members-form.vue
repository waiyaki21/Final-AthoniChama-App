<template>
    <!-- enter members form  -->
    <section :class="[classInfo.borderClass, 'col-span-2 h-fit pb-1']" ref="sectionRef">
        <h3 class="font-boldened flex-col w-full flex p-2">
            <span :class="[classInfo.mainHeader, 'md:text-2xl text-md']">Add Members</span>
        </h3>

        <!-- add members tabs  -->
        <mainmembers-form
            @close      = refresh
            @reload     = refresh
            @flash      = flashShow
            @hide       = flashHide
            @loading    = flashLoading
            @timed      = flashTimed
            @view       = flashShowView
        ></mainmembers-form>
 
        <hr-line :color="'border-teal-500/50 dark:border-teal-500/50'"></hr-line>
        <!-- end upload sheet & form -->
    </section>
    <!-- end enter members form  -->
</template>

<script setup>
    import { defineProps, onBeforeMount, reactive, defineEmits, onMounted, getCurrentInstance } from 'vue'

    const props = defineProps({
        count : {
            type: String,
            required: true
        }
    })

    const emit = defineEmits(['reload', 'close', 'view', 'flash', 'timed', 'hide'])

    onBeforeMount(() => {
    })

    onMounted(() => {
        const instance = getCurrentInstance()
        const parentName = instance?.parent?.type?.name

        if (parentName == 'BaseTransition' || parentName == 'Transition') {
            const parentName = 'Modal'
            // console.log('Parent component name:', parentName)
        } else {
            const parentName = 'Regular' 
            // console.log('Parent component name:', parentName)
        }
    })

    // classes 
    const classInfo = reactive({
        isLoading: false,

        modalCloseBtn: 'cursor-pointer dark:text-cyan-800 text-cyan-500 transition-transform hover:rotate-180 w-6 h-6 hover:w-8 hover:h-8',

        info: [],
        countNo: '',
        newMember: {},
        oldMembers: [],
        newMembers: [],
        allMembers: [],

        infoSection: 'w-full m-2 p-2 text-left mx-auto border-2 shadow-md border border-cyan-500 p-1 overflow-hidden ',
        infoHeader: 'text-cyan-300 mb-1 text-md text-left font-normal underline tracking-tight uppercase',
        borderClass: 'overflow-hidden font-boldened flex-col justify-between p-1 rounded-lg bg-cyan-50 dark:bg-gray-800/50 shadow-md sm:rounded-lg border-base border-cyan-300 dark:border-cyan-700',
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
        tabBody: 'relative flex flex-col min-w-0 break-words w-full mb-1 p-1 font-boldened',
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

    function refresh() {
        emit('reload');
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