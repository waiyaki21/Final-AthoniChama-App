<template>

    <Head>
        <title>{{ props.route }}</title>
    </Head>

    <!-- breadcrumb  -->
    <maincrumbs ref="mainCrumbsRefs" :items=navItems></maincrumbs>
    <!-- end breadcrumb  -->

    <!-- Contribution documents  -->
    <div class="py-2 font-boldened">
        <div class="w-full m-2 text-left mx-auto p-1 overflow-hidden">
            <h2
                class="font-normal font-boldened text-3xl text-cyan-800 dark:text-cyan-300 leading-tight uppercase underline mb-2">
                ADMIN SETTINGS.
            </h2>

            <!--documents tabs  -->
            <div
                class="text-xs font-boldened text-center text-gray-500 dark:text-gray-400 w-full mb-2 mx-2 p-1 inline-flex justify-between uppercase">
                <ul class="flex flex-row -mb-px overflow-x-scroll hidescroll">
                    <li class="me-2" role="presentation">
                        <button :class="[classInfo.setup ? classInfo.tab1 : classInfo.tabDanger]" id="setup-tab"
                            data-tabs-target="#setup" type="button" role="tab" aria-controls="setup"
                            aria-selected="false" @click="tabSwitch1"
                            v-tooltip="$tooltip(classInfo.setup ? `Update System Settings`: `Enter System Settings`, 'top')">
                            System Settings
                            <!-- <span :class="[classInfo.tab2svg]"> -->
                            <checksolid-icon class="h-5 w-5 ml-1 text-green-600 dark:text-green-200"
                                v-if="classInfo.setup"></checksolid-icon>
                            <timessolid-icon class="h-5 w-5 ml-1 text-red-600 dark:text-red-200"
                                v-else></timessolid-icon>
                            <!-- </span> -->
                        </button>
                    </li>
                    <li class="me-2" role="presentation">
                        <button :class="[classInfo.setup ? classInfo.tab2 : classInfo.tabDanger]" @click="tabSwitch2"
                            v-tooltip="$tooltip(classInfo.setup ? `Enter Group Members` : `Enter System Settings First`, 'top')">
                            Members
                            <span :class="[classInfo.setup ? classInfo.tab2svg : classInfo.svgInactive]">
                                {{ classInfo.membersNo }}
                            </span>
                        </button>
                    </li>
                    <li class="me-2" role="presentation">
                        <button :class="[classInfo.membersNo ? classInfo.tab3 : classInfo.tabDanger]"
                            @click="tabSwitch3"
                            v-tooltip="$tooltip(classInfo.membersNo ? `Enter Payment Cycles` : `Enter Group Members First`, 'top')">
                            Contribution Cycles
                            <span :class="[classInfo.membersNo ? classInfo.tab3svg : classInfo.svgInactive]">
                                {{ classInfo.cyclesNo }}
                            </span>
                        </button>
                    </li>
                    <li class="me-2" role="presentation">
                        <ActionButton buttonClass='danger' @handleClick="handleResetDB"
                            :tooltipText="`Reset the entire system fully?`" :buttonText="`Reset System.`">
                            <delete-icon class="w-4 h-4 md:w-5 md:h-5"></delete-icon>
                        </ActionButton>
                    </li>
                    <li role="presentation">
                        <StyleButton :buttonClass="classInfo.cyclesNo == 0 ? 'warning' : 'success'"
                            class="relative inline-flex rounded-md group items-center justify-between overflow-hidden text-sm md:text-base font-normal uppercase focus:ring-1 focus:outline-none px-2 py-1 md:px-2 whitespace-nowrap"
                            @handleClick="classInfo.cyclesNo == 0 ? finishCycle : getRoute"
                            :tooltipText="classInfo.cyclesNo == 0 ? `Finish Members & Cycles Setup!` : `Dashboard`"
                            :buttonText="classInfo.cyclesNo == 0 ? `Finish Setup!` : `Dashboard`"
                            :class="classInfo.cyclesNo == 0 ? 'cursor-not-allowed opacity-25' : ''">
                            <warningsolid-icon class="w-4 h-4 md:w-5 md:h-5"
                                v-if="classInfo.cyclesNo == 0"></warningsolid-icon>
                            <homesolid-icon class="w-4 h-4 md:w-5 md:h-5" v-else></homesolid-icon>
                        </StyleButton>
                    </li>
                </ul>
            </div>

            <hr-line :color="classInfo.hrClass"></hr-line>
            <!-- tabs body  -->
            <div class="md:my-4 my-2">
                <mainSettingTabs :settings=settings :updated=classInfo.setup @reload=resetInfo @changed=settingsChanged
                    @loading=flashLoading @flash=flashShow @hide=flashHide @timed=flashTimed @view=flashShowView
                    v-if="classInfo.tab1show"></mainSettingTabs>

                <!-- <setmembersTabs :route=props.route @changed=membersChanged @loading=flashLoading @flash=flashShow
                    @hide=flashHide @timed=flashTimed @view=flashShowView v-if="classInfo.tab2show"></setmembersTabs> -->
                <!--main member tabs -->
                <mainMemberTabs :route=props.route @changed=membersChanged @loading=flashLoading @flash=flashShow
                    @hide=flashHide @timed=flashTimed @view=flashShowView v-if="classInfo.tab2show"></mainMemberTabs>
                <!-- end main member tabs  -->

                <mainCycleTabs :route=props.route :current=current :cycles=cycles :nextname=nextname :date=date
                    :settings=settings :show="classInfo.tab3show" @changed=cyclesChanged v-if="classInfo.tab3show">
                </mainCycleTabs>
            </div>

            <!-- <hr-line v-if="!classInfo.tab2show" :color="classInfo.hrClass"></hr-line> -->
        </div>
        <!-- end documents panel -->
    </div>
    <!--end Contribution documents  -->
</template>

<script setup>
    import { router } from "@inertiajs/vue3";
    import { defineProps, reactive, onMounted, onBeforeUnmount, computed} from "vue";
    import { resetDB, fullResetCycles, fullResetMembers, fullResetUsers }      from "./Methods/resetDB";

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
        current: {
            type: Object,
            required: true,
        },
        cycles: {
            type: Array,
            required: true,
        },
        members: {
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
        finance: {
            type: Object,
            required: true,
        },
        settings: {
            type: Object,
            required: true,
        },
        projects: {
            type: Object,
            required: true,
        },
        updated: {
            type: Boolean,
            required: true,
        },
    })

    const navItems = computed(() => [
        {
            url: '/settings',
            label: 'Admin Settings',
            active: true,
        },
    ])

    const classInfo = reactive ({
        isOpen: false,
        modalData: {},

        // delete info 
        isDeleteOpen: false,
        deleteData: {},
        deleteID: '',

        info: [],

        // tabs 
        tabActive: 'inline-flex p-2 border rounded-lg uppercase hover:text-blue-600 border-blue-400 hover:border-blue-600 dark:hover:text-blue-300 dark:text-blue-600 cursor-pointer bg-blue-300 dark:bg-blue-300/10 whitespace-nowrap',
        tabInactive: 'inline-flex p-2 border rounded-lg uppercase hover:text-teal-600 border-teal-400 hover:border-teal-600 dark:hover:text-teal-300 dark:text-teal-600 cursor-pointer bg-teal-300 dark:bg-teal-300/10 whitespace-nowrap',
        tabDanger: 'inline-flex p-2 border rounded-lg uppercase hover:text-red-600 border-red-400 hover:border-red-600 dark:hover:text-red-300 dark:text-red-600 cursor-not-allowed bg-red-300 dark:bg-red-300/10 whitespace-nowrap opacity-75',
        tabReset: 'inline-flex p-2 border rounded-lg uppercase hover:text-red-600 border-red-500 hover:border-red-600 dark:hover:text-red-500 dark:text-red-600 cursor-pointer bg-red-300 dark:bg-red-300/10 whitespace-nowrap',
        tabInfo: 'inline-flex p-2 border rounded-lg uppercase hover:text-cyan-600 border-cyan-400 hover:border-cyan-600 dark:hover:text-cyan-300 dark:text-cyan-600 cursor-not-allowed bg-cyan-300 dark:bg-cyan-300/10 whitespace-nowrap',
        tabSuccess: 'inline-flex p-2 border rounded-lg uppercase hover:text-green-600 border-green-400 hover:border-green-600 dark:hover:text-green-300 dark:text-green-600 cursor-pointer bg-green-300 dark:bg-green-300/10 whitespace-nowrap',

        btn1: 'Reset the system fully! All Information will be deleted',
        btn2: 'Go to dashboard!',
        btn3: 'Finish setup!',

        tab1: '',
        tab2: '',
        tab3: '',
        tab1show: true,
        tab2show: false,
        tab3show: false,

        tab2svg: '',
        tab3svg: '',

        svgActive: 'bg-blue-100 text-gray-800 text-xs font-normal ml-1 px-1 rounded-full dark:bg-cyan-900 dark:text-gray-300 border border-cyan-900 dark:border-cyan-500',
        svgInactive: 'bg-red-100 text-gray-800 text-xs font-normal ml-1 px-1 rounded-full dark:bg-red-900 dark:text-gray-300 border border-red-900 dark:border-red-500',
        svgSuccess: 'bg-green-100 text-gray-800 text-xs font-normal ml-1 px-1 rounded-full dark:bg-green-900 dark:text-gray-300 border border-green-900 dark:border-green-500',

        hrClass: 'border-teal-800 dark:border-teal-300 my-1',

        setup: true,
        membersNo: '',
        cyclesNo: '',
        projectsNo: '',
    })

    onMounted(() => {
        setInfo()
        tabSwitch1()

        // Define a map of event handlers for various events
        const eventHandlers = {
            reloadMembers:                  resetInfo,
            reloadCycles:                   resetInfo,
            reloadPage:                     resetInfo,
        };

        // Register all event handlers
        Object.entries(eventHandlers).forEach(([event, handler]) => {
            eventBus.on(event, handler);
        });

        // Cleanup event listeners on component unmount
        onBeforeUnmount(() => {
            Object.keys(eventHandlers).forEach((event) => {
                eventBus.off(event);
            });
        });
    });

    function setInfo() {
        classInfo.info = props.cycles;
        axios.get('/api/getSettings')
            .then(
                ({ data }) => {
                    classInfo.setup         = data[0];
                    classInfo.membersNo     = data[1];
                    classInfo.cyclesNo      = data[2];
                    classInfo.projectsNo    = data[3];

                    // check if temps are needed 
                    templateCheck();
                });
    }

    async function resetInfo() {
        axios.get('/api/getSettings')
            .then(
                ({ data }) => {
                    classInfo.setup         = data[0];
                    classInfo.membersNo     = data[1];
                    classInfo.cyclesNo      = data[2];
                    classInfo.projectsNo    = data[3];

                    // check if temps are needed 
                    templateCheck();

                    // reload all 
                    reloadNav();
                });
    }

    function settingsChanged() {
        setInfo();
    }

    function templateCheck() {
        if (classInfo.membersNo == 0 && classInfo.tab2show) {
            presetMembers();
        }

        if (classInfo.cyclesNo == 0 && classInfo.tab3show) {
            presetCycles();
        }
    }

    // function membersTemplate() {
    //     if (classInfo.membersNo == 0 && classInfo.tab2show) {
    //         presetMembers();
    //     }
    // }

    // function cyclesTemplate() {
    //     if (classInfo.membersNo != 0 && classInfo.cyclesNo == 0) {
    //         presetCycles();
    //     }
    // }

    function tabSwitch(tabNumber, hrClass) {
        resetTabClass();

        // Set the appropriate tab to active and show
        classInfo[`tab${tabNumber}show`] = true;
        // classInfo[`tab${tabNumber}`] = classInfo.tabActive;
        // settings tab 
        if (classInfo.setup) {
            classInfo.tab1 = classInfo.tabSuccess;
        } else {
            classInfo.tab1 = classInfo.tabInactive;
        }

        // members tab 
        if (classInfo.membersNo != 0) {
            classInfo.tab2 = classInfo.tabSuccess;
            classInfo.tab2svg = classInfo.svgSuccess;
        } else {
            classInfo.tab2 = classInfo.tabInactive;
            classInfo.tab2svg = classInfo.svgActive;
        }

        // cycles tab 
        if (classInfo.cyclesNo != 0) {
            classInfo.tab3 = classInfo.tabSuccess;
            classInfo.tab3svg = classInfo.svgSuccess;
        } else {
            classInfo.tab3 = classInfo.tabInactive;
            classInfo.tab3svg = classInfo.svgActive;
        }
        classInfo.hrClass = hrClass;

        settingsChanged();
        scrollToClass();
        // console.log('scroll 1');
    }

    function resetTabClass() {
        ['tab1', 'tab2', 'tab3'].forEach(tab => {
            classInfo[tab] = classInfo.tabInactive;
            classInfo[`${tab}show`] = false;
        });

        classInfo.hrClass = 'border-rose-800 dark:border-rose-300 my-1';
        classInfo.tab2svg = classInfo.svgActive;
        classInfo.tab3svg = classInfo.svgActive;
    }

    function tabSwitch1() {
        tabSwitch(1, 'border-teal-800 dark:border-teal-300 my-1');
    }

    function tabSwitch2() {
        if (classInfo.setup) {
            // Scroll to the top of the page
            tabSwitch(2, 'border-emerald-800 dark:border-emerald-300 my-1');
            templateCheck();
            setTimeout(() => {
                scrollToClass()
                // console.log('scroll 2');
            }, 100);
        } else {
            let message   = 'Enter new System Settings To Proceeed!';
            let type      = 'danger';
            flashShow(message, type);
            classInfo.hrClass        = 'border-emerald-800 dark:border-emerald-300 my-1';
        }
    }

    function tabSwitch3() {
        if (classInfo.membersNo != 0) {
            tabSwitch(3, 'border-amber-800 dark:border-amber-300 my-1');
        } else {
            let message   = 'Enter new Members To Proceeed!';
            let type      = 'danger';
            flashShow(message, type);
        } 
    }

    function finishCycle() {
        let message   = 'Create a new Payment Cycle To Proceeed!';
        let type      = 'info';
        flashShow(message, type);
    }

    function membersChanged() {
        setInfo();
        // if (classInfo.membersNo != 0) {
        //     tabSwitch2()
        // } else {
        //     tabSwitch1()
        // }
        if (classInfo.membersNo != 0) {
            if (classInfo.tab2show) {
                classInfo.tab2 = classInfo.tabActive;
                classInfo.tab2svg = classInfo.svgActive;
            } else {
                classInfo.tab2 = classInfo.tabSuccess
                classInfo.tab2svg = classInfo.svgActive;
            }
        } else {
            if (classInfo.tab2show) {
                classInfo.tab2 = classInfo.tabActive;
                classInfo.tab2svg = classInfo.svgActive;
            } else {
                classInfo.tab2 = classInfo.tabDanger;
                classInfo.tab2svg = classInfo.svgInactive;
            }
        }
    }

    function cyclesChanged() {
        setInfo();
        // if (classInfo.cyclesNo != 0) {
        //     tabSwitch3();
        // } else {
        //     if (classInfo.membersNo != 0) {
        //         tabSwitch2()
        //     } else {
        //         if (classInfo.setup) {
        //             tabSwitch2();
        //         } else {
        //             tabSwitch1();
        //         }
        //     }
        // }
        // this.membersCount = members.length;
        if (classInfo.cyclesNo != 0) {
            // console.log('cycles main check success');
            if (classInfo.tab3show) {
                classInfo.tab3 = classInfo.tabActive;
                classInfo.tab3svg = classInfo.svgActive;
            } else {
                classInfo.tab3 = classInfo.tabSuccess;
                classInfo.tab3svg = classInfo.svgActive;
            }
        } else {
            if (classInfo.tab3show) {
                classInfo.tab3 = classInfo.tabActive;
                classInfo.tab3svg = classInfo.svgActive;
            } else {
                classInfo.tab3 = classInfo.tabInactive;
                classInfo.tab3svg = classInfo.svgInactive;
            }
        }
    }

    function getRoute() {
        let url = '/dashboard';

        router.get(url);
    } 

    async function getRegister() {
        let url = '/register';

        router.get(url);
    }

    // reset DB to the ./Methods/ResetDB.js
    async function handleResetDB() {
        await resetDB(flashShow, resetInfo, () =>
            fullResetCycles(flashShow, flashLoading, flashHide, resetInfo, () =>
                fullResetMembers(flashShow, flashLoading, flashHide, resetInfo, () =>
                    fullResetUsers(flashShow, flashLoading, flashHide, resetInfo, getRegister, reloadNav, classInfo),
                    reloadNav,
                    classInfo
                ),
                reloadNav,
                classInfo
            )
        );
    }
</script>