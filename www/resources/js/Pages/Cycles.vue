<template>

    <Head>
        <title>{{ props.route }}</title>
    </Head>

    <!-- breadcrumb  -->
    <maincrumbs ref="mainCrumbsRefs" :items=navItems></maincrumbs>
    <!-- end breadcrumb  -->

    <!-- body section  -->
    <div class="py-2 font-boldened">
        <!-- info section  -->
        <cyclesinfo :infosection=classInfo.infoSection :infoheader=classInfo.infoHeader
            :sectionborder=classInfo.sectionBorder :cycle=classInfo.cycle :count=classInfo.cycles.length :paysum=classInfo.paySum :avg=classInfo.avg :members=classInfo.members></cyclesinfo>
        <!-- end info section  -->

        <!-- cycles tabs  -->
        <div
            class="text-xs font-boldened text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 w-full mb-2 mx-2 p-1 justify-between uppercase lg:hidden inline-flex">
            <ul class="flex flex-wrap -mb-px">
                <li class="me-2">
                    <a :class="[classInfo.tab1]" @click="tabSwitch()">
                        {{ classInfo.tab1Name }}
                        <span
                            class="bg-blue-100 text-gray-800 md:text-xs font-normal mx-1 px-1.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-white border-2 border-cyan-900 dark:border-cyan-500">
                            {{ classInfo.cycles.length }}
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
        <div class="grid grid-cols-1 md:grid-cols-5 gap-1">
            <!-- cycles table  -->
            <cyclestable :cycles=classInfo.cycles :cycleinfo=classInfo.info @flash=flashShow @view=flashShowView @reload=setInfo
                v-if=classInfo.tab1show></cyclestable>
            <!-- cycles table  -->

            <!-- cycles form  -->
            <section
                class="md:col-span-2 col-span-1 bg-cyan-50 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg rounded-md font-boldened border-2 border-cyan-300 dark:border-cyan-700 h-fit"
                v-if=classInfo.tab2show>
                <div class="p-2 w-full">
                    <h3
                        class="font-boldened text-xl md:text-2xl text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1 px-2">
                        Add New cycles.
                    </h3>
                    <!-- cycles form  -->
                    <infocycle :settings=classInfo.settings @reload=resetInfo @loading=flashLoading @flash=flashShow
                        @hide=flashHide @timed=flashTimed @view=flashShowView @allhide=flashAllHide></infocycle>
                </div>
            </section>
            <!-- cycles form  -->
        </div>
        <!-- end table and form  -->
        <hr-line :color="'border-teal-500/50'"></hr-line>
    </div>
    <!-- end body section  -->
</template>

<script setup>
    import { defineProps, reactive, computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

    // Globals 
    import { flashShow, flashLoading, flashTimed, flashShowView, flashHide, flashAllHide, reloadNav, scrollToClass, membersTemp, presetMembers, presetCycles } from '../Pages/Globals/flashMessages';
    import eventBus     from "./Globals/eventBus";

    const props = defineProps({
        name: {
            type: String,
            required: true,
        },
        route: {
            type: String,
            required: true,
        },
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
        // name: '',
        // route: '',
        cycles: [],
        nextname: '',
        date: '',
        paySum: '',
        members: '',
        avg: '',
        cycle: {},
        settings: {},
        info: [],

        isOpen: false,
        modalData: {},

        // delete info 
        isDeleteOpen: false,
        deleteData: {},
        deleteID: '',

        // info: [],

        myDate: new Date().toISOString().slice(0, 10),

        // main progress bar 
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
        setInfo()
        progressMain();

        // Define a map of event handlers for various events
        const eventHandlers = {
            // reloadCycles:                   resetInfo,
            reloadPage:                     resetInfo,
        };

        // Register all event handlers
        Object.entries(eventHandlers).forEach(([event, handler]) => {
            eventBus.on(event, handler);
        });

        // Cleanup event listeners on component unmount
        onBeforeUnmount(() => {
            window.removeEventListener('resize', updateWidth);

            Object.keys(eventHandlers).forEach((event) => {
                eventBus.off(event);
            });
        });
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
        axios.get('/api/getCyclesIndexInfo')
            .then(
                ({ data }) => {
                    updateWidth();

                    // classInfo.info = data[0];
                    // classInfo.name      = data[0];
                    // classInfo.route     = data[1];
                    classInfo.cycles    = data[2];
                    classInfo.nextname  = data[3];
                    classInfo.date      = data[4];
                    classInfo.paySum    = data[5];
                    classInfo.members   = data[6];
                    classInfo.avg       = data[7];
                    classInfo.cycle     = data[8];
                    classInfo.settings  = data[9];
                    classInfo.info      = data[10];

                    reloadNav();

                    if (screenWidth.value >= 1024) {
                        allSwitch();
                    } else {
                        tabSwitch();
                    }
                });
    }

    function resetInfo() {
        axios.get('/api/getCyclesIndexInfo')
            .then(
                ({ data }) => {
                    updateWidth();

                    // classInfo.name      = data[0];
                    // classInfo.route     = data[1];
                    classInfo.cycles    = data[2];
                    classInfo.nextname  = data[3];
                    classInfo.date      = data[4];
                    classInfo.paySum    = data[5];
                    classInfo.members   = data[6];
                    classInfo.avg       = data[7];
                    classInfo.cycle     = data[8];
                    classInfo.settings  = data[9];
                    classInfo.info      = data[10];

                    reloadNav();

                    if (screenWidth.value >= 1024) {
                        allSwitch();
                    } else {
                        tabSwitch();
                    }
                });
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
        classInfo.infoHeader         = classInfo.infoHeader;
        classInfo.infoSection        = classInfo.infoSection;
        classInfo.sectionBorder      = classInfo.sectionBorder;
    }
</script>