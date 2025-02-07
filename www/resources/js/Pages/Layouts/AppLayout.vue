<template>
    <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">

        <nav
            class="fixed top-0 z-50 w-full bg-white border-b-2 border-cyan-200 dark:bg-gray-800 dark:border-cyan-700 shadow-md">
            <div class="px-2 py-1 lg:px-5 lg:pl-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center justify-start">
                        <button data-drawer-target="sidebar-button" data-drawer-toggle="sidebar-button"
                            aria-controls="sidebar-button" type="button"
                            class="inline-flex items-center p-1 mt-1 ms-1 text-xs text-gray-500 hover:text-cyan-700 sm:hidden rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:text-cyan-700 dark:hover:bg-gray-700">
                            <span class="sr-only">Open sidebar</span>
                            <bars-icon class="w-5 h-5"></bars-icon>
                        </button>
                        <a :href="route('Dashboard')" :active="route().current('Dashboard')"
                            class="flex ml-2 md:mr-24 cursor-pointer font-boldened dark:text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-600">
                            <span
                                class="self-center text-md font-normal md:text-xl whitespace-nowrap uppercase border-b-2 border-cyan-300 hover:border-cyan-600">
                                {{ $page.props.setting.shortname }}
                                <span
                                    class="self-center text-sm opacity-90 font-normal sm:text-sm text-rose-600 dark:text-rose-500 whitespace-nowrap uppercase">v{{
                                    version }}</span>
                            </span>
                        </a>
                    </div>
                    <div class="flex items-center">
                        <UserDropdown 
                            :userName="$page.props.auth.user.name" 
                            :userEmail="$page.props.auth.user.email"
                            :done="classInfo.setup" 
                            :classInfo="classInfo" 
                            @dropdown-toggle="switchDrop"
                            @close="closeDrop" />
                    </div>
                </div>
            </div>
        </nav>

        <section
            class="inline-flex justify-normal w-full bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white mainBody">
            <!-- Sidenav -->
            <sidenav :user=$page.props.auth.user :done=classInfo.setup :show=classInfo.showBtn :link=props.urlPrev
                @size=widthCheck @full=fullCheck @flash=flashShow @done=doneCheck></sidenav>
            <!--End Sidenav -->

            <div :class="['flex min-h-screen bg-transparent dark:bg-transparent w-full', classInfo.bodyWidth]">
                <div class="p-4 mt-8 w-full">
                    <!-- Page Heading -->
                    <header class="text-gray-300" v-if="$slots.header">
                        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            <slot name="header" />
                        </div>
                    </header>

                    <!-- Page Content -->
                    <main>
                        <!-- plugins -->
                        <mainplugin :user=$page.props.auth.user :done=classInfo.setup ref="pluginRef"></mainplugin>
                        <!-- end plugins -->
                        <slot />
                    </main>
                </div>
            </div>
        </section>
    </div>

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
</template>

<script setup>
    import  sidenav     from "../Navs/sideNav.vue";
    import  mainplugin  from "../Components/plugins/mainPlugin.vue";
    import UserDropdown from "../Utilities/Dropdown/userDropdown.vue"
    import  packageJson from "../../../../../package.json";
    import { reactive, defineProps, ref, nextTick, onMounted, onBeforeUnmount } from "vue";
    import { usePage }  from '@inertiajs/vue3';

    const page          = usePage();

    import eventBus     from "../Globals/eventBus";

    const version       = packageJson.version;

    const props = defineProps({
        urlPrev: {
            type: String,
            required: true
        },
    })

    const classInfo = reactive ({
        setup: false,

        setting: {},
        version: '',
        componentKey: false,

        bodyWidth: 'sm:ml-14',
        showBtn: true,
        
        sidebarBtn: '',

        dropdown: false,
        dropdownClass: '',
        dropdownActive: 'z-50 my-4 text-sm list-none bg-white divide-y divide-gray-100 rounded shadow-md dark:bg-gray-700 dark:divide-gray-600 uppercase font-boldened block border border-cyan-800 dark:border-cyan-300 w-24 text-right',
        dropdownInactive: 'z-50 hidden my-4 text-sm list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 uppercase font-boldened',

        complete: '',

        linkDrop: 'w-full inline-flex justify-start p-2 text-xs md:text-sm text-gray-700 hover:text-cyan-500 dark:text-gray-100 dark:hover:text-cyan-500 hover:underline uppercase cursor-pointer'
    })

    // Create a ref to the mainPlugin component
    const pluginRef = ref(null);

    const keyActions = {
        s: 'showDial',
        a: 'addMembers',
        m: 'addCycles',
        l: 'addLedger',
        d: 'downloadLedger',
        t: 'getColor',
    };

    function handleKeydown(event) {
        if (event.altKey && keyActions[event.key]) {
            event.preventDefault();

            const action = keyActions[event.key];
            if (pluginRef.value && typeof pluginRef.value[action] === 'function') {
                pluginRef.value[action]();
            }
        }
    }

    onMounted(() => {
        doneCheck(page.props.done);
        window.addEventListener('keydown', handleKeydown);

        // Define a map of event handlers for various events
        const eventHandlers = {
            flashShow: (data) =>        flashShow(data.info,  data.type),
            flashTimed: (data) =>       flashTimed(data.info, data.type, data.duration),
            flashHide:                  flashHide,
            flashAllHide:               flashAllHide,
            flashView: (() => {
                let isFlashViewHandled = false; // Flag to prevent multiple triggers
                return (data) => {
                    if (isFlashViewHandled) return;
                    isFlashViewHandled = true;

                    const { message, body, header, url, button, duration, linkState } = data;

                    if (page.props.done) {
                        flashShowView(message, body, header, url, button, duration, linkState);
                    } else {
                        flashShow(`Cannot ${linkState ? 'view link' : 'download'} until setup is complete`, 'times');
                    }

                    setTimeout(() => {
                        isFlashViewHandled = false;
                    }, 1000); // Adjust as needed
                };
            })(),
            membersTemplate:                    membersTemplate,
            presetMembersTemplate:              presetMembers,
            presetCyclesTemplate:               presetCycles,
            showAllMembers:                     flashShowMembers,
        };

        // Register all event handlers
        Object.entries(eventHandlers).forEach(([event, handler]) => {
            eventBus.on(event, handler);
        });

        // Cleanup event listeners on component unmount
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', handleKeydown);
            Object.keys(eventHandlers).forEach((event) => {
                eventBus.off(event);
            });
        });
    });

    function doneCheck(a) {
        classInfo.setup = a;
        console.log('done set', classInfo.setup);
    }

    function widthCheck(a) {
        classInfo.bodyWidth = a;
    }

    function fullCheck(a) {
        classInfo.showBtn  = a;
        if (classInfo.showBtn) {
            classInfo.sidebarBtn = 'inline-flex items-center p-2 mt-2 ms-3 text-xs text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600';
        } else {
            classInfo.sidebarBtn = 'inline-flex items-center p-2 mt-2 ms-3 text-xs text-gray-500 sm:hidden rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600';
        }
    }

    function toggle() {
        classInfo.showBtn = !classInfo.showBtn
    }

    function switchDrop() {
        classInfo.dropdown = !classInfo.dropdown
        if (classInfo.dropdown) {
            classInfo.dropdownClass = classInfo.dropdownInactive
        } else {
            classInfo.dropdownClass = classInfo.dropdownActive
        }
    }

    function closeDrop() {
        classInfo.dropdown = false
        if (classInfo.dropdown) {
            classInfo.dropdownClass = classInfo.dropdownInactive
        } else {
            classInfo.dropdownClass = classInfo.dropdownActive
        }
    }

    // Templates
    function membersTemplate() {
        let url     = '/download/template/members';
        let header  = 'Use Empty Members Template!';
        let button  = 'Use Empty Template';
        let body    = 'members';
        let message = `Download this template to fill in Members information!`;

        flashShowView(message, body, header, url, button, 20000, false);
    }

    function presetMembers() {
        let url     = '/preset/template/members/';
        let header  = 'Use Members Preset Template!';
        let button  = 'Use Preset Template';
        let body    = 'newMembers';
        let message = `Use the preset set by the program manufacturer to upload members. This Template has members records till September 2024!`;

        flashShowView(message, body, header, url, button, 20000, false);
    }

    function presetCycles() {
        let url     = '/preset/template/ledgers/';
        let header  = 'Use Ledgers Preset Template!';
        let button  = 'Use Ledger Preset';
        let body    = 'ledger';
        let message = `No ledgers exist in the system yet! Use the preset set by the program manufacturer to upload ledgers. This Template has Ledger records till September 2024!`;

        flashShowView(message, body, header, url, button, 20000, false);
    }

    // toast view to go to all members page 
    function flashShowMembers() {
        let url     = '/members';
        let header  = `View All Members!`;
        let button  = `All Members`;
        let body    = 'success';
        let message = `Click to view all members`;

        flashShowView(message, body, header, url, button, 15000, true);
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

    // Method to trigger a timed flash message
    const flashTimed = (info, type, duration) => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.toastOnTime([info, type, duration]);
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