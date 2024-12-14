<template>
    <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">

        <nav class="fixed top-0 z-50 w-full bg-white border-b-2 border-cyan-200 dark:bg-gray-800 dark:border-cyan-700 shadow-md">
            <div class="px-2 py-1 lg:px-5 lg:pl-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center justify-start">
                        <button data-drawer-target="sidebar-button" data-drawer-toggle="sidebar-button" aria-controls="sidebar-button" type="button" class="inline-flex items-center p-1 mt-1 ms-1 text-xs text-gray-500 hover:text-cyan-700 sm:hidden rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:text-cyan-700 dark:hover:bg-gray-700">
                            <span class="sr-only">Open sidebar</span>
                            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                            </svg>
                        </button>
                        <a :href="route('Dashboard')" :active="route().current('Dashboard')" class="flex ml-2 md:mr-24 cursor-pointer font-boldened dark:text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-600">
                            <span class="self-center text-md font-normal md:text-xl whitespace-nowrap uppercase border-b-2 border-cyan-300 hover:border-cyan-600">
                                {{ $page.props.setting.shortname }}
                                <span class="self-center text-sm opacity-90 font-normal sm:text-sm text-rose-600 dark:text-rose-500 whitespace-nowrap uppercase">v{{ version }}</span>
                            </span>
                        </a>
                    </div>
                    <div class="flex items-center">
                        <div class="flex items-center ml-3 font-boldened">
                            <div class="inline-flex text-gray-900 hover:text-cyan-900 dark:text-gray-100 dark:hover:text-cyan-400 ">
                                <button type="button" class="font-sans px-2 py-1 bg-transparent dark:bg-gray-800 sm:flex hidden text-sm md:text-md hover:underline uppercase font-normal" @click="switchDrop()">
                                    <span class="sr-only">Open user menu</span>
                                    {{ $page.props.auth.user.name }}.
                                </button>
                                <button type="button" class="bg-gray-800 hidden md:block text-sm uppercase font-normal" @click="switchDrop()">
                                    <user-icon class="w-4 h-4"></user-icon>
                                </button>
                            </div>
                            <div :class="[classInfo.dropdownActive, 'absolute top-[44px] right-4']" v-if="classInfo.dropdown" @mouseleave="closeDrop">
                                <div class="px-4 py-3" role="none" v-if="$page.props.done">
                                    <Link href="/profile">
                                        <p class="text-xs text-gray-900 dark:text-white my-1" role="none">
                                        {{ $page.props.auth.user.name }}.
                                        </p>
                                        <p class="text-xs font-normal text-gray-900 truncate dark:text-gray-300" role="none">
                                        {{ $page.props.auth.user.email }}.
                                        </p>
                                    </Link>
                                </div>
                                <ul class="py-1 w-fit" role="none">
                                    <li>
                                        <Link :href="route('Dashboard')" :active="route().current('Dashboard')" :class="[classInfo.linkDrop]" role="menuitem"  v-if="$page.props.done">Dashboard</Link>
                                    </li>
                                    <li>
                                        <Link href="/settings" :class="[classInfo.linkDrop]" role="menuitem">Settings</Link>
                                    </li>
                                    <li>
                                        <Link href="/profile" :class="[classInfo.linkDrop]" role="menuitem"  v-if="$page.props.done">Profile</Link>
                                    </li>
                                    <li>
                                        <Link :href="route('logout')" method="post" as="button" :class="[classInfo.linkDrop, ' w-full inline-flex justify-start']" role="menuitem">Sign out</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <section class="inline-flex justify-normal w-full bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
            <!-- Sidenav -->
            <sidenav
                :user   = $page.props.auth.user
                :done   = $page.props.done
                :show   = classInfo.showBtn
                :link   = props.urlPrev
                @size   = widthCheck
                @full   = fullCheck
                @flash  = flashShow
            ></sidenav>
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
                        <mainplugin
                            :user               = $page.props.auth.user
                            :done               = $page.props.done
                            ref                 = "pluginRef"
                        ></mainplugin>
                        <!-- end plugins -->
                        <slot />
                    </main>
                </div>
            </div>
        </section>
    </div>

    <!-- update payment modal  -->
    <!-- <autoSetup
        :show   = !$page.props.done
        :name   = classInfo.modalName
        @close  = closeModal
    ></autoSetup> -->
    <!-- end update payment modal  -->

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
</template>

<script setup>
    import  sidenav     from "../Navs/sideNav.vue";
    import  mainplugin  from "../Components/plugins/mainPlugin.vue";
    import  packageJson from "../../../../package.json";
    import { reactive, defineProps, ref, nextTick, onMounted, onBeforeUnmount } from "vue";

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
        dropdownActive: 'z-50 my-4 text-sm list-none bg-white divide-y divide-gray-100 rounded shadow-md dark:bg-gray-700 dark:divide-gray-600 uppercase font-boldened block border border-cyan-800 dark:border-cyan-300',
        dropdownInactive: 'z-50 hidden my-4 text-sm list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 uppercase font-boldened',

        complete: '',

        linkDrop: 'block p-2 text-xs md:text-sm text-gray-700 hover:text-cyan-500 dark:text-gray-100 dark:hover:text-cyan-500 hover:underline uppercase cursor-pointer'
    })

    // alerts classes 
    const alerts = reactive({
        alertShow: false,
        alertType: '',
        alertDuration: 15000,
        flashMessage: '',
        alertBody: 'border-b-[4px] border-gray-500 shadow-gray-900 dark:shadow-gray-900 bg-gray-100 dark:bg-gray-500',
        alertSuccess: 'border-b-[4px] border-emerald-800 dark:border-emerald-800 shadow-green-900 dark:shadow-green-900 bg-green-100 dark:bg-green-500',
        alertInfo: 'border-b-[4px] border-blue-800 dark:border-blue-800 shadow-blue-900 dark:shadow-blue-900 bg-blue-100 dark:bg-blue-500',
        alertWarning: 'border-b-[4px] border-orange-800 dark:border-orange-800 shadow-orange-900 dark:shadow-orange-900 bg-orange-100 dark:bg-orange-500',
        alertDanger: 'border-b-[4px] border-red-800 dark:border-red-800 shadow-red-900 dark:shadow-red-900 bg-red-100 dark:bg-red-500',
    })

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
        window.addEventListener('keydown', handleKeydown);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeydown);
    });
</script>