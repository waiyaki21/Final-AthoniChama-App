<template>
    <Head>
        <title>{{ props.route }}</title>
    </Head>

    <!-- breadcrumb  -->
    <maincrumbs ref = "mainCrumbsRefs" :items = navItems></maincrumbs>
    <!-- end breadcrumb  -->

    <!-- body section  -->
    <div class="py-2 font-boldened">
        <!-- info section  -->
        <cyclesinfo
            :infosection    = classInfo.infoSection
            :infoheader     = classInfo.infoHeader
            :sectionborder  = classInfo.sectionBorder
            :cycle          = props.cycle
            :count          = props.cycles.length
            :paysum         = props.paySum
            :avg            = props.avg
            :members        = props.members
        ></cyclesinfo>
        <!-- end info section  -->

        <!-- cycles tabs  -->
        <div class="text-xs font-boldened text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 w-full mb-2 mx-2 p-1 justify-between uppercase lg:hidden inline-flex">
            <ul class="flex flex-wrap -mb-px">
                <li class="me-2">
                    <a :class="[classInfo.tab1]" @click="tabSwitch()">
                        {{ classInfo.tab1Name }}
                        <span
                            class="bg-blue-100 text-gray-800 md:text-xs font-normal mx-1 px-1.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-white border-2 border-cyan-900 dark:border-cyan-500">
                            {{ props.cycles.length }}
                        </span>
                    </a>
                </li>

                <li class="me-2">
                    <a :class="[classInfo.tab2]" @click="tabSwitch2()">
                        {{ classInfo.tab2Name }}
                    </a>
                </li>
            </ul>
        </div>
        <!-- end cycles tabs  -->

        <hr-line :color="'border-teal-500/50'"></hr-line>

        <!-- table and forms  -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-1">
            <!-- cycles table  -->
            <cyclestable
                :cycles         = classInfo.info
                :cycleinfo      = info
                @flash          = flashShow
                @view           = flashShowView
                @reload         = setInfo
                v-if            = classInfo.tab1show
            ></cyclestable>
            <!-- cycles table  -->

            <!-- cycles form  -->
            <section class="col-span-2 bg-cyan-50 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg rounded-md font-boldened border-2 border-cyan-300 dark:border-cyan-700 h-fit" v-if = classInfo.tab2show>
                <div class="p-2 w-full">
                    <h3 class="font-boldened text-xl md:text-2xl text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1 px-2">
                        Add New cycles.
                    </h3>
                    <!-- cycles form  -->
                    <infocycle
                        :settings   = props.settings
                        @reload     = setInfo
                        @loading    = flashLoading 
                        @flash      = flashShow
                        @hide       = flashHide 
                        @timed      = flashTimed 
                        @view       = flashShowView 
                        @allhide    = flashAllHide
                    ></infocycle>
                </div>
            </section>
            <!-- cycles form  -->
        </div>
        <!-- end table and form  -->
        <hr-line :color="'border-teal-500/50'"></hr-line>
    </div>
    <!-- end body section  -->

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
</template>

<script setup>
    import { defineProps, reactive, computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

    const props = defineProps({
        name: {
            type: String,
            required: true,
        },
        route: {
            type: String,
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
        },
        paySum: {
            type: String,
            required: true,
        },
        members: {
            type: String,
            required: true,
        },
        avg: {
            type: String,
            required: true,
        },
        cycle: {
            type: Object,
            required: true,
        },
        settings: {
            type: Object,
            required: true,
        },
        info: {
            type: Array,
            required: true
        }
    });

    const navItems = computed(() => [
        {
            url: '/cycles',
            label: 'Payment Cycles',
            active: true,
        },
    ]);

    // classes 
    const classInfo = reactive({
        isOpen: false,
        modalData: {},

        // delete info 
        isDeleteOpen: false,
        deleteData: {},
        deleteID: '',

        info: [],

        myDate: new Date().toISOString().slice(0, 10),

        // main progress bar 
        progressMainBorder: 'border border-cyan-500 p-1 overflow-hidden',
        progressMainClass: 'alerts flex h-6 items-center justify-center rounded-full bg-gradient-to-r from-gray-200 via-cyan-400 to-blue-500 text-base leading-none',
        infoSection: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        infoHeader: 'text-cyan-300 mb-2 sm:text-base text-xl text-left font-normal underline tracking-tight uppercase',
        sectionBorder: 'w-full inline-flex justify-between m-1 p-1 text-left border-b-2 border-cyan-500',

        // tabs 
        tabActive: 'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-sky-500 dark:border-blue-500 text-xs md:text-sm cursor-pointer',
        tabInactive: 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-50 text-xs md:text-sm cursor-pointer',
        tab1: '',
        tab2: '',
        tab1show: true,
        tab2show: false,
        tab1Name: 'Cycles Info',
        tab2Name: 'Enter Cycles',
    })

    const screenWidth = ref(window.innerWidth);

    const updateWidth = () => {
        screenWidth.value = window.innerWidth;
    };

    onMounted(() => {
        window.addEventListener('resize', updateWidth);
        setInfo();
        progressMain();
    });

    onUnmounted(() => {
        window.removeEventListener('resize', updateWidth);
    });

    // Watch screenWidth and update the active tab based on its value
    watch(screenWidth, (newWidth) => {
        if (newWidth > 1024) {
            allSwitch();
        } else {
            tabSwitch();
        }
    });

    function setInfo() {
        updateWidth();
        
        classInfo.info = props.cycles;

        if (screenWidth.value >= 1024) {
            allSwitch();
        } else {
            tabSwitch();
        }
    }

    function resetTabClass() {
        classInfo.tab1 = classInfo.tabInactive;
        classInfo.tab2 = classInfo.tabInactive;
    }

    function allSwitch() {
        resetTabClass();
        classInfo.tab1show = true;
        classInfo.tab2show = true;

        classInfo.tab1     = classInfo.tabActive;
        classInfo.tab2     = classInfo.tabActive;
    }
    
    function tabSwitch() {
        resetTabClass();
        classInfo.tab1show = true;
        classInfo.tab2show = false;

        classInfo.tab1     = classInfo.tabActive;
    }

    function tabSwitch2() {
        resetTabClass();
        classInfo.tab1show = false;
        classInfo.tab2show = true;

        classInfo.tab2     = classInfo.tabActive;
    }

    function progressMain() {
        classInfo.progressMainClass  = classInfo.progressMainClass;
        classInfo.progressMainBorder = classInfo.progressMainBorder;
        classInfo.infoHeader         = classInfo.infoHeader;
        classInfo.infoSection        = classInfo.infoSection;
        classInfo.sectionBorder      = classInfo.sectionBorder;
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
</script>