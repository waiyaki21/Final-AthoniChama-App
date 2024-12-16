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
                <ul class="flex flex-row -mb-px overflow-x-scroll">
                    <li class="me-2" role="presentation">
                        <button :class="[classInfo.tab1]" id="setup-tab" data-tabs-target="#setup" type="button"
                            role="tab" aria-controls="setup" aria-selected="false" @click="tabSwitch1">
                            System Settings
                            <span :class="[classInfo.tab2svg]">
                                1
                            </span>
                        </button>
                    </li>
                    <li class="me-2" role="presentation">
                        <button :class="[classInfo.tab2]" v-if="classInfo.setup" @click="tabSwitch2">
                            Members
                            <span :class="[classInfo.tab2svg]">
                                {{ classInfo.membersNo }}
                            </span>
                        </button>
                        <button :class="[classInfo.tabDanger, 'cursor-not-allowed opacity-25']" @click="finishSettings"
                            v-else>
                            Members
                            <span :class="[classInfo.tab2svg]">
                                {{ classInfo.membersNo }}
                            </span>
                        </button>
                    </li>
                    <li class="me-2" role="presentation">
                        <button :class="[classInfo.tab3]"  @click="tabSwitch3">
                            Contribution Cycles
                            <span :class="[classInfo.tab3svg]">
                                {{ classInfo.cyclesNo }}
                            </span>
                        </button>
                    </li>
                    <li class="me-2" role="presentation">
                        <ActionButton buttonClass='pink' @handleClick="resetDB"
                            :tooltipText="`Reset the entire system fully?`" :buttonText="`Reset System.`">
                            <warning-icon class="w-4 h-4 md:w-5 md:h-5"></warning-icon>
                        </ActionButton>
                    </li>
                    <li role="presentation">
                        <ActionButton :buttonClass="cycles.length == 0 ? 'danger' : 'purple'"
                            @handleClick="cycles.length == 0 ? finishCycle : getRoute"
                            :tooltipText="cycles.length == 0 ? classInfo.btn2.toUpperCase(): classInfo.btn3.toUpperCase()"
                            :buttonText="cycles.length == 0 ? `Complete Setup!` : `Dashboard`"
                            :class="cycles.length == 0 ? 'cursor-not-allowed opacity-25' : ''">
                            <warningsolid-icon class="w-4 h-4 md:w-5 md:h-5"
                                v-if="cycles.length == 0"></warningsolid-icon>
                            <homesolid-icon class="w-4 h-4 md:w-5 md:h-5" v-else></homesolid-icon>
                        </ActionButton>
                    </li>
                </ul>
            </div>

            <hr-line :color="classInfo.hrClass"></hr-line>
            <!-- tabs body  -->
            <div class="md:my-4 my-2">
                <settingTabs :settings=settings :updated=props.updated @reload=reloadNav @changed=settingsChanged @loading=flashLoading @flash=flashShow @hide=flashHide @timed=flashTimed @view=flashShowView v-if="classInfo.tab1show"></settingTabs>

                <setmembersTabs :route=props.route @changed=membersChanged v-if="classInfo.tab2show"></setmembersTabs>

                <setcycleTabs :route=props.route :current=current :cycles=cycles :nextname=nextname :date=date
                    :settings=settings :show="classInfo.tab3show" @changed=cyclesChanged v-if="classInfo.tab3show">
                </setcycleTabs>
            </div>

            <hr-line v-if="!classInfo.tab2show" :color="classInfo.hrClass"></hr-line>
        </div>
        <!-- end documents panel -->
    </div>
    <!--end Contribution documents  -->

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
</template>

<script setup>
    import { defineProps, reactive, onMounted, computed, ref, nextTick} from "vue";
    import { router } from '@inertiajs/vue3';
    
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
        tabActive: 'inline-flex p-2 border-b-base rounded-t-lg uppercase text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-500 border-blue-600 dark:border-blue-500 whitespace-nowrap',
        tabInactive: 'inline-flex p-2 border-b-base rounded-t-lg uppercase hover:text-gray-600 border-gray-200 hover:border-gray-300 dark:hover:text-teal-300 dark:text-gray-300 cursor-pointer whitespace-nowrap',
        tabDanger: 'inline-flex p-2 border-b-base rounded-t-lg uppercase hover:text-red-600 border-red-400 hover:border-red-600 dark:hover:text-red-300 dark:text-red-600 cursor-not-allowed whitespace-nowrap',
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

        hrClass: 'border-teal-800 dark:border-teal-300 my-1',

        setup: true,
        membersNo: '',
        cyclesNo: '',
        projectsNo: '',
    })

    onMounted(() => {
        setInfo()
        tabSwitch1()
    })

    function setInfo() {
        classInfo.info = props.cycles;
        axios.get('/api/getSettings')
            .then(
                ({ data }) => {
                    classInfo.setup         = data[0];
                    classInfo.membersNo     = data[1];
                    classInfo.cyclesNo      = data[2];
                    classInfo.projectsNo    = data[3];

                    if (classInfo.membersNo == 0) {
                        membersTemplate()
                    }
                });
    }

    function settingsChanged() {
        setInfo();

        // if (classInfo.tab1show) {
        //     classInfo.tab1 = classInfo.tabActive;
        //     classInfo.tab1svg = classInfo.svgActive;
        // } else {
        //     classInfo.tab1 = classInfo.setup ? classInfo.tabSuccess : classInfo.tabDanger;
        //     classInfo.tab1svg = classInfo.setup ? classInfo.svgActive : classInfo.svgInactive;

        //     classInfo.tab2 = classInfo.setup ? classInfo.tabInactive : classInfo.tabDanger;
        //     classInfo.tab2svg = classInfo.setup ? classInfo.svgInactive : classInfo.svgActive;
        // }

        // if (classInfo.tab2show) {
        //     classInfo.tab2 = classInfo.tabActive;
        //     classInfo.tab2svg = classInfo.svgActive;
        // } else {
        //     classInfo.tab2 = classInfo.membersNo != 0 ? classInfo.tabSuccess : classInfo.tabDanger;
        //     classInfo.tab2svg = classInfo.membersNo != 0 ? classInfo.svgActive : classInfo.svgInactive;

        //     classInfo.tab3 = classInfo.membersNo != 0 ? classInfo.tabInactive : classInfo.tabDanger;
        //     classInfo.tab3svg = classInfo.membersNo != 0 ? classInfo.svgInactive : classInfo.svgActive;
        // }

        // if (classInfo.tab3show) {
        //     classInfo.tab3 = classInfo.tabActive;
        //     classInfo.tab3svg = classInfo.svgActive;
        // } else {
        //     classInfo.tab3 = classInfo.cyclesNo != 0 ? classInfo.tabSuccess : classInfo.tabDanger;
        //     classInfo.tab3svg = classInfo.cyclesNo != 0 ? classInfo.svgActive : classInfo.svgInactive;
        // }
    }

    function membersTemplate() {
        if (classInfo.membersNo == 0 && classInfo.tab2show) {
            let url     = '/preset/template/members/';
            let header  = 'Use Members Preset Template!';
            let button  = 'Use Preset Template';
            let body    = 'file';
            let message = `No Members exist in the system use the preset set by the program manufacturer to upload members. This Template has members records till September 2024!`;

            flashShowView(message, body, header, url, button, 30000, false);
        }
    }

    function tabSwitch(tabNumber, hrClass) {
        resetTabClass();

        // Set the appropriate tab to active and show
        classInfo[`tab${tabNumber}show`] = true;
        classInfo[`tab${tabNumber}`] = classInfo.tabActive;
        classInfo.hrClass = hrClass;

        settingsChanged();
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
        // Scroll to the top of the page
    // window.scrollTo({ top: 0, behavior: 'smooth' });
        tabSwitch(2, 'border-emerald-800 dark:border-emerald-300 my-1');
        membersTemplate();
    }

    function tabSwitch3() {
        tabSwitch(3, 'border-amber-800 dark:border-amber-300 my-1');
    }

    function finishSettings() {
        let message   = 'Enter new System Settings To Proceeed!';
        let type      = 'danger';
        flashShow(message, type);
        classInfo.hrClass        = 'border-emerald-800 dark:border-emerald-300 my-1';
    }

    function finishMembers() {
        let message   = 'Enter new Members To Proceeed!';
        let type      = 'warning';
        flashShow(message, type);
    }

    function finishCycle() {
        let message   = 'Create a new Payment Cycle To Proceeed!';
        let type      = 'info';
        flashShow(message, type);
    }

    function reloadNav() {
        // emit('reload');
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

    async function resetInfo() {
        axios.get('/api/getSettings')
            .then(
                ({ data }) => {
                    classInfo.setup         = data[0];
                    classInfo.membersNo     = data[1];
                    classInfo.cyclesNo      = data[2];
                    classInfo.projectsNo    = data[3];

                    if (classInfo.membersNo == 0) {
                        membersTemplate()
                    }
                });
    }

    async function resetDB() {
        const message = `All information will be deleted! User Accounts, Payment Cycles, Members, Contribution Records & Welfare Records. Are you sure you want to delete everything?`;

        if (confirm(message)) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
            await fullResetCycles(); // Wait for the cycles reset to complete
            await resetInfo();
        } else {
            flashShow('Database Reset Cancelled!', 'info');
            // reload info 
            await resetInfo();
        }
    }

    async function fullResetCycles() {
        if (confirm('Are You Sure you want to delete all Payment Cycles with Member Payments, Welfares, Projects & Expenses?')) {
            flashLoading('Deleting all Payment Cycles with Member Payments, Welfares, Projects & Expenses');
            try {
                const { data } = await axios.get('/fullReset/cycles');
                classInfo.setup         = data[0];
                classInfo.membersNo     = data[1];
                classInfo.cyclesNo      = data[2];
                classInfo.projectsNo    = data[3];
                flashHide();
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
                flashShow('All Payment Cycles with Member Payments, Welfares, Projects & Expenses Deleted', 'delete');
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
                await fullResetMembers(); // Wait for the members reset to complete
            } catch (error) {
                console.error('Error resetting payment cycles:', error);
            }
        } else {
            flashShow('Payment Cycles Reset Cancelled!', 'warning');
            // reload info 
            await resetInfo();
        }
    }

    async function fullResetMembers() {
        if (confirm('Are You Sure you want to delete all Members?')) {
            flashLoading('Deleting all Members!');
            try {
                const { data } = await axios.get('/fullReset/members');
                classInfo.setup         = data[0];
                classInfo.membersNo     = data[1];
                classInfo.cyclesNo      = data[2];
                classInfo.projectsNo    = data[3];
                flashHide();
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
                flashShow('All Members Deleted', 'delete');
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
                await fullResetUsers(); // Wait for the users reset to complete
            } catch (error) {
                console.error('Error resetting members:', error);
            }
        } else {
            flashShow('Members Reset Cancelled!', 'warning');
            // reload info 
            await resetInfo();
        }
    }

    async function fullResetUsers() {
        if (confirm('Are You Sure you want to delete all User Accounts, Including yourself?')) {
            flashLoading('Deleting all User Accounts');
            try {
                const { data } = await axios.get('/fullReset/users');
                classInfo.setup         = data[0];
                classInfo.membersNo     = data[1];
                classInfo.cyclesNo      = data[2];
                classInfo.projectsNo    = data[3];
                flashHide();
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
                flashShow('All User Accounts Deleted', 'delete');
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
                await getRegister();
            } catch (error) {
                console.error('Error resetting users:', error);
            }
        } else {
            flashShow('Users Reset Cancelled!', 'warning');
            // reload info 
            await resetInfo();
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
        flashTimed(info, 'loading', 20000)
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
            setTimeout(() => {
                toastNotificationRef.value.loadHide();
            }, 1000);
        }
    }

    // Method to hide all messages after a delay
    const flashAllHide = () => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.allHide();
        }
    }
</script>