<template>
    <!-- Sidenav -->
    <aside id="sidebar-button"
        :class="['fixed top-[49px] left-1 z-40 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-transparent dark:bg-transparent', info.sideWidth]"
        aria-label="Sidebar" v-show="info.closeNavBar">
        <div class="h-[90vh] pt-2 pb-6 pl-2 w-full overflow-y-scroll relative font-boldened space-y-2 flex-col hidescroll">
            <ul :class="info.setupDone ? info.classList : info.settingsList">
                <!-- <li class="relative"
                    v-tooltip="$tooltip('Return Back','right')"
                    v-if="info.reloadBtn && info.setupDone">
                    <Link :class="info.setupDone ? info.linkClass : info.settingsClass" @click="getRoute(info.reloadLink)"
                        as="button">
                    <span :class="info.setupDone ? info.svgSpanClass : info.svgSettingsClass">
                        <left-arrow class="w-5 h-5"></left-arrow>
                    </span>
                    <span :class="info.setupDone ? info.headerSpanClass : info.headerSettingsClass" v-if="info.spanShow">Return
                        Back</span>
                    </Link>
                </li>
                <li class="relative"
                    v-tooltip="$tooltip('Reload View', 'right')"
                    v-if="!info.reloadBtn && info.setupDone">
                    <Link :class="info.setupDone ? info.linkClass : info.settingsClass" @click="getRoute(info.reloadLink)"
                        as="button">
                        <span :class="info.setupDone ? info.svgSpanClass : info.svgSettingsClass">
                            <loading-icon class="w-5 h-5"></loading-icon>
                        </span>
                        <span :class="info.setupDone ? info.headerSpanClass : info.headerSettingsClass" v-if="info.spanShow">Reload</span>
                    </Link>
                </li> -->
                <li class="relative" v-for="link in links"
                    v-tooltip="$tooltip(title(link), 'right')">
                    <a :class="info.setupDone ? info.linkClass : info.settingsClass" @click="getRoute(link.link)">
                        <span :class="info.setupDone ? info.svgSpanClass : info.svgSettingsClass">
                            <!-- icons  -->
                            <component
                                :is     = "link.icon"
                                :class  = "info.svgSize"
                                v-if    = "link.icon"
                                @click  = "getRoute(link.link)"
                            ></component>
                        </span>
                        <span :class="info.setupDone ? info.headerSpanClass : info.headerSettingsClass" v-if="info.spanShow"
                            @click="getRoute(link.link)">
                            {{link.header}}
                        </span>
                        <div :class="info.membersNo > 0 ? info.badgeClass : info.badgeSettingsClass" v-if="link.badge && link.header == 'Members' && !info.spanShow">
                            <span>{{ info.membersNo }}</span>
                        </div>
                        <div :class="info.cyclesNo > 0 ? info.badgeClass : info.badgeSettingsClass" v-if="link.badge && link.header == 'Cycles' && !info.spanShow">
                            <span>{{ info.cyclesNo }}</span>
                        </div>
                        <div :class="info.projectsNo > 0 ? info.badgeClass : info.badgeSettingsClass" v-if="link.badge && link.header == 'Projects' && !info.spanShow">
                            <span>{{ info.projectsNo }}</span>
                        </div>
                    </a>
                </li>
            </ul>
            <ul :class="info.classList">
                <li class="relative"
                    v-tooltip="$tooltip('SIGN OUT', 'right')">
                    <Link :class="[info.linkClass]" :href="route('logout')" method="post" as="button">
                        <span :class="[info.svgSpanClass]">
                            <logout-icon :class="[info.svgSize]"></logout-icon>
                        </span>
                        <span :class="[info.headerSpanClass]" v-if="info.spanShow">Logout</span>
                    </Link>
                </li>
                <li class="relative" v-tooltip="$tooltip('DATABASE BACKUP', 'right')">
                    <a :class="[info.linkClass]" @click="toggle(), flashShow('Database Backing Up', 'file')" href="/DBbackup">
                        <span :class="[info.svgSpanClass]">
                            <download-info :class="[info.svgSize]"></download-info>
                        </span>
                        <span :class="[info.headerSpanClass]" v-if="info.spanShow">
                            DB Backup
                        </span>
                    </a>
                </li>
                <li class="relative" v-tooltip="$tooltip(!info.spanShow ? 'EXPAND SIDEBAR' : 'CLOSE SIDEBAR', 'right')">
                    <a :class="[info.linkClass]" @click="toggle()">
                        <span :class="[info.svgSpanClass]">
                            <expand-icon :class="[info.svgSize]" v-if="!info.spanShow"></expand-icon>
                            <inward-icon :class="[info.svgSize]" v-else></inward-icon>
                        </span>
                        <span :class="[info.headerSpanClass]" v-if="info.spanShow" v-html="!info.spanShow ? 'Expand' : 'Close'"></span>
                    </a>
                </li>
            </ul>
        </div>
    </aside>
    <!-- End Sidenav-->
</template>

<script setup>
    import { router } from '@inertiajs/vue3';
    import { onMounted, onBeforeUnmount, reactive, defineProps, ref, defineEmits, defineExpose } from 'vue';
    import eventBus     from "../Globals/eventBus";
    import { flashShow } from '../Globals/flashMessages';

    const props = defineProps({
        show: {
            type: Boolean,
            required: true
        },
        done: {
            type: Boolean,
            required: true
        },
        link: {
            type: String,
            required: true
        },
    })

    const emit = defineEmits(['size','full', 'done'])

    const info = reactive ({
        // windowWidthTest: ''
        windowWidth     : '',
        sideBarClass    : '',

        // classes 
        reloadBtn       : false,
        reloadLink      : '',
        reloadState     : false,

        classList: 'space-y-2 font-normal relative bg-gray-50 dark:bg-gray-800 border-2 border-cyan-800 w-full dark:border-cyan-600 rounded-md shadow-md py-1',
        settingsList: 'space-y-2 font-normal relative bg-rose-100 dark:bg-rose-900/50 border-2 border-rose-800 w-full dark:border-rose-600 rounded-md shadow shadow-rose-500/40 py-1',

        linkClass: 'mt-1 flex h-10 cursor-pointer items-center truncate w-full p-2 text-gray-900 outline-none transition duration-300 ease-linear hover:text-cyan-600 hover:outline-none focus:bg-transparent focus:outline-none active:bg-transparent active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:focus:text-emerald-800 dark:hover:text-cyan-600 md:text-xl text-md hover:underline uppercase group',
        settingsClass: 'mt-1 flex h-10 cursor-not-allowed items-center truncate w-full p-2 text-red-600 outline-none transition duration-300 ease-linear hover:text-red-600 hover:outline-none focus:bg-transparent focus:outline-none active:bg-transparent active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-red-300 dark:focus:text-red-800 dark:hover:text-red-600 md:text-xl text-md hover:underline uppercase group',

        svgSpanClass      : 'mr-1 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-gray-900 dark:[&>svg]:text-gray-300 dark:group-hover:[&>svg]:text-cyan-600',
        headerSpanClass      : 'group-[&[data-te-sidenav-slim-collapsed=' + 'true' + ']]:data-[te-sidenav-slim=' + 'false' + ']:hidden w-full inline-flex justify-start ms-3',

        svgSize: 'h-5 w-5 md:h-6 md:w-6',

        svgSettingsClass      : 'mr-1 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-red-800 dark:[&>svg]:text-red-300 dark:group-hover:[&>svg]:text-red-600',
        headerSettingsClass      : 'group-[&[data-te-sidenav-slim-collapsed=' + 'true' + ']]:data-[te-sidenav-slim=' + 'false' + ']:hidden w-full inline-flex justify-start ms-3',

        badgeClass: 'absolute inline-flex items-center justify-center w-5 h-5 text-sm font-normal text-black bg-cyan-100 border shadow-sm border-cyan-500 rounded-full -top-0.5 -end-2 dark:border-cyan-900 right-1 px-1',
        badgeSettingsClass: 'absolute inline-flex items-center justify-center w-5 h-5 text-sm font-normal text-black bg-rose-100 border shadow-sm border-rose-500 rounded-full -top-0.5 -end-2 dark:border-rose-900 right-1 px-1',

        ordersList       : [],

        isVisible       : true,

        link1: '/dashboard',
        link2: '/members',
        link3: '/cycles',
        link4: '/ledgers',
        link5: '/projects',
        link6: '/settings',
        link7: '/profile',

        // links: [],

        setting: {},
        version: '',

        navLinkActive: 'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group uppercase underline',
        navLinkInactive: 'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group uppercase underline cursor-not-allowed',
        navLink: 'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group uppercase underline',

        spanShow: false,
        close: false,
        sideWidth: '',

        closeNavBar: true,

        // badges 
        membersNo: 0,
        cyclesNo: 0,
        projectsNo: 0,

        clicked: false,
        setupDone: true
    })

    const links =  [
        { 
            id: 1, 
            header: 'Dashboard',  
            info:   'Dashboard',   
            link:   info.link1 , 
            icon:   'home-icon',
            badge:  false,
        },
        { 
            id: 2, 
            header: 'Members',    
            info:   'View All Members',     
            link:   info.link2, 
            icon:   'members-icon',
            badge:  true,
            count:  info.membersNo
        },
        { 
            id: 3, 
            header: 'Cycles',      
            info:   'View All Cycles',      
            link:   info.link3, 
            icon:   'clock-icon',
            badge:  true,
            count:  info.cyclesNo
        },
        { 
            id: 4, 
            header: 'Ledgers',     
            info:   'View All Ledgers',     
            link:   info.link4 , 
            icon:   'calendar-icon',
            badge:  false,
        },
        { 
            id: 5, 
            header: 'Projects',    
            info:   'View All Projects',    
            link:   info.link5, 
            icon:   'chart-icon',
            badge:  true,
            count:  info.projectsNo
        },
        { 
            id: 6, 
            header: 'Settings',    
            info:   'View All Settings',    
            link:   info.link6 , 
            icon:   'settings-icon',
            badge:  false,
        },
        { 
            id: 7, 
            header: 'Profile',     
            info:   'View User Profile',     
            link:   info.link7 , 
            icon:   'user-icon',
            badge:  false,
        }
    ]

    onMounted(() => {
        window.addEventListener('resize', getWindowWidth);
        getWindowWidth();
        // getBackLink();
        getUrl();

        // Define a map of event handlers for various events
        const eventHandlers = {
            reloadNav:                  getUrl
        };

        // Register all event handlers
        Object.entries(eventHandlers).forEach(([event, handler]) => {
            eventBus.on(event, handler);
        });

        // Cleanup event listeners on component unmount
        onBeforeUnmount(() => {
            window.removeEventListener('resize', getWindowWidth)
            Object.keys(eventHandlers).forEach((event) => {
                eventBus.off(event);
            });
        });
    })

    function toggle() {
        info.spanShow = !info.spanShow;
        spanVisible();
    }

    function title(link) {
        let text = '';
        if (info.setupDone) {
            text = link.header.toUpperCase();
        } else {
            text = 'View Disabled ,Complete All Settings';
        }

        return text;
    }

    function closeNav() {
        info.closeNavBar = !info.closeNavBar

        if (info.closeNavBar) {
            info.sideWidth = 'w-[0px]';
            emit('size', 'sm:ml-2')
            emit('full', info.closeNavBar);
        } else {
            info.spanShow = false;
            info.sideWidth = 'w-fit';
            emit('size', 'sm:ml-4')
            emit('full', info.closeNavBar);
        }
    }

    // function getBackLink() {
    //     let link = info.reloadLink
    //     // console.log(route().current());
			
    //     if (link == 'empty' || route().current() == 'Dashboard') {
    //         info.reloadBtn     = false;
    //         info.reloadLink    = '/dashboard';
    //     } else {
    //         info.reloadBtn     = true;
    //         info.reloadLink    = link;
    //     }

    //     info.clicked = !info.clicked;

    //     // doneFlash(info.clicked);
    // }

    function getUrl() {
        axios.get('/api/urlPrev')
            .then(({ data }) => {
                    info.reloadState = data[0];
                    info.reloadLink  = data[1];
                    info.membersNo   = data[2];
                    info.cyclesNo    = data[3];
                    info.projectsNo  = data[4];
                    info.setupDone   = data[5];
                    // getBackLink();   
                    
                    if (!data[5]) {
                        let flashMessage = 'Complete All Settings!';
                        let alertBody    = 'danger';
                        flashShow(flashMessage, alertBody);

                        otherFlash();
                    }

                    emit('done', data[5])
                });
    }

    function spanVisible() {
        if (info.spanShow) {
            info.sideWidth = 'w-64';
            emit('size', 'sm:ml-64')
        } else {
            info.sideWidth = 'w-fit';
            emit('size', 'sm:ml-14')
        }
    }
    
    function getWindowWidth() {
        info.windowWidth = ref(window.innerWidth)
        
        const x = info.windowWidth;
        
        switch (true) {
            case (x < 640):
                // console.log('small mobile');
                info.spanShow = false;
                info.close = true;
                spanVisible();
                break;
            case (x < 1024):
                // console.log('medium laptop');
                info.spanShow = false;
                info.close = false;
                spanVisible();
                break;
            case (x > 2400):
                // console.log('large screen');
                info.spanShow = true;
                info.close = false;
                spanVisible();
                break;
        }

        // getBackLink()
    }

    function getRoute(url) {
        // console.log(url);
        
        if (info.spanShow == true) {
            toggle();
        }

        if (info.setupDone) {
            router.visit(url, { 
                preserveScroll: true 
            });
        } else {
            let flashMessage = 'Other views disabled ,Complete All Settings!';
            let alertBody    = 'danger';
            flashShow(flashMessage, alertBody);

            otherFlash();
        }

        getUrl();
    }

    function doneFlash(clicked) {
        if (!info.setupDone && clicked) {
            let flashMessage = 'Complete All Settings!';
            let alertBody    = 'danger';
            flashShow(flashMessage, alertBody);

            otherFlash();
        }
    }

    function otherFlash() {
        setTimeout(() => {
            if (info.membersNo == 0) {
                let flashMessage = '(0) Members, Enter Members!';
                let alertBody = 'danger';
                flashShow(flashMessage, alertBody);
            }
        }, 1000);

        setTimeout(() => {
            if (info.cyclesNo == 0) {
                let flashMessage = '(0) Payment Cycles, Create Payment Cycles!';
                let alertBody = 'danger';
                flashShow(flashMessage, alertBody);
            }
        }, 1500);
    }

    // Expose the function
    defineExpose({
        getUrl,
    });
</script>