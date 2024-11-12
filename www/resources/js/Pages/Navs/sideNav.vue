<template>
    <!-- Sidenav -->
    <aside id="sidebar-button"
        :class="['fixed top-[60px] mt-2 left-1 z-40 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-transparent dark:bg-transparent', info.sideWidth]"
        aria-label="Sidebar" v-show="info.closeNavBar">
        <div class="h-[90vh] py-2 pl-2 w-full overflow-y-scroll relative font-boldened space-y-2 flex-col hidescroll">
            <ul :class="props.done ? info.classList : info.settingsList">
                <li class="relative"
                    v-tooltip="$tooltip('Return Back','right')"
                    v-if="info.reloadBtn && props.done">
                    <Link :class="props.done ? info.linkClass : info.settingsClass" @click="getRoute(info.reloadLink)"
                        as="button">
                    <span :class="props.done ? info.spanClass1 : info.settingsClass1">
                        <right-arrow class="w-5 h-5"></right-arrow>
                    </span>
                    <span :class="props.done ? info.spanClass2 : info.settingsClass2" v-if="info.spanShow">Return
                        Back</span>
                    </Link>
                </li>
                <li class="relative"
                    v-tooltip="$tooltip('Reload View', 'right')"
                    v-if="!info.reloadBtn && props.done">
                    <Link :class="props.done ? info.linkClass : info.settingsClass" @click="getRoute(info.reloadLink)"
                        as="button">
                        <span :class="props.done ? info.spanClass1 : info.settingsClass1">
                            <loading-icon class="w-5 h-5"></loading-icon>
                        </span>
                        <span :class="props.done ? info.spanClass2 : info.settingsClass2" v-if="info.spanShow">Reload</span>
                    </Link>
                </li>
                <li class="relative" v-for="link in links"
                    v-tooltip="$tooltip(title(link.header), 'right')">
                    <a :class="props.done ? info.linkClass : info.settingsClass" @click="getRoute(link.link)">
                        <span :class="props.done ? info.spanClass1 : info.settingsClass1">
                            <!-- <div :class="[info.svgSize]" v-html="link.icon" @click="getRoute(link.link)"></div> -->
                            <!-- icons  -->
                            <component
                                :is     = "link.icon"
                                :class  = "info.svgSize"
                                v-if    = "link.icon"
                                @click="getRoute(link.link)"
                            ></component>
                        </span>
                        <span :class="props.done ? info.spanClass2 : info.settingsClass2" v-if="info.spanShow"
                            @click="getRoute(link.link)">
                            {{link.header}}
                        </span>
                        <div :class="info.badgeClass"
                            v-if="link.badge && link.header == 'Members' && info.membersNo > 0">
                            <span>{{ info.membersNo }}</span>
                        </div>
                        <div :class="info.badgeClass" v-if="link.badge && link.header == 'Cycles' && info.cyclesNo > 0">
                            <span>{{ info.cyclesNo }}</span>
                        </div>
                        <div :class="info.badgeClass" v-if="link.badge && link.header == 'Projects' && info.projectsNo > 0">
                            <span>{{ info.projectsNo }}</span>
                        </div>
                    </a>
                </li>
            </ul>
            <ul :class="props.done ? info.classList : info.settingsList">
                <li class="relative"
                    v-tooltip="$tooltip('Log Out', 'right')">
                    <Link :class="[info.linkClass]" :href="route('logout')" method="post" as="button">
                        <span :class="props.done ? info.spanClass1 : info.settingsClass1">
                            <logout-icon :class="[info.svgSize]"></logout-icon>
                        </span>
                        <span :class="props.done ? info.spanClass2 : info.settingsClass2" v-if="info.spanShow">Logout</span>
                    </Link>
                </li>
                <li class="relative" v-tooltip="$tooltip('Database Backup', 'right')">
                    <a :class="props.done ? info.linkClass : info.settingsClass" @click="toggle(), flashShow('Database Backing Up', 'file')" href="/DBbackup">
                        <span :class="props.done ? info.spanClass1 : info.settingsClass1">
                            <download-info :class="[info.svgSize]"></download-info>
                        </span>
                        <span :class="props.done ? info.spanClass2 : info.settingsClass2" v-if="info.spanShow">
                            DB Backup
                        </span>
                    </a>
                </li>
                <li class="relative" v-tooltip="$tooltip(!info.spanShow ? 'Expand Sidebar' : 'Close Sidebar', 'right')">
                    <a :class="props.done ? info.linkClass : info.settingsClass" @click="toggle()">
                        <span :class="props.done ? info.spanClass1 : info.settingsClass1">
                            <expand-icon :class="[info.svgSize]" v-if="!info.spanShow"></expand-icon>
                            <inward-icon :class="[info.svgSize]" v-else></inward-icon>
                        </span>
                        <span :class="props.done ? info.spanClass2 : info.settingsClass2" v-if="info.spanShow" v-html="!info.spanShow ? 'Expand' : 'Close'"></span>
                    </a>
                </li>
            </ul>
        </div>
    </aside>
    <!-- End Sidenav-->
</template>

<script setup>
    import { router } from '@inertiajs/vue3';
    import { onMounted, onUnmounted, reactive, defineProps, ref, defineEmits } from 'vue';

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

    const emit = defineEmits(['size','full','flash'])

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

        tooltipClass: 'inline-block absolute invisible z-10 py-2 px-3 w-auto text-sm uppercase font-semibold text-cyan-300 hover:text-cyan-500 bg-cyan-800 dark:bg-cyan-800 rounded-lg shadow-md opacity-0 transition-opacity duration-300 tooltip border-2 border-cyan-300 dark:border-cyan-300 whitespace-nowrap',

        linkClass: 'mt-1 flex h-10 cursor-pointer items-center truncate w-full p-2 text-gray-900 outline-none transition duration-300 ease-linear hover:text-cyan-600 hover:outline-none focus:bg-transparent focus:outline-none active:bg-transparent active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:focus:text-emerald-800 dark:hover:text-cyan-600 md:text-xl text-md hover:underline uppercase',
        settingsClass: 'mt-1 flex h-10 cursor-not-allowed items-center truncate w-full p-2 text-red-600 outline-none transition duration-300 ease-linear hover:text-red-600 hover:outline-none focus:bg-transparent focus:outline-none active:bg-transparent active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-red-300 dark:focus:text-red-800 dark:hover:text-red-600 md:text-xl text-md hover:underline uppercase',

        spanClass1      : 'mr-1 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-gray-900 dark:[&>svg]:text-gray-300 dark:hover:[&>svg]:text-cyan-600',

        spanClass2      : 'group-[&[data-te-sidenav-slim-collapsed=' + 'true' + ']]:data-[te-sidenav-slim=' + 'false' + ']:hidden',

        svgSize: 'h-5 w-5',

        settingsClass1      : 'mr-1 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-red-800 dark:[&>svg]:text-red-300 dark:hover:[&>svg]:text-red-600',

        settingsClass2      : 'group-[&[data-te-sidenav-slim-collapsed=' + 'true' + ']]:data-[te-sidenav-slim=' + 'false' + ']:hidden',

        spanClassDrop: 'absolute right-0 ml-auto mr-[0.5rem] transition-transform duration-300 ease-linear motion-reduce:transition-none [&>svg]:text-gray-600 dark:[&>svg]:text-gray-300',

        linkDrop: 'h-5 items-center cursor-pointer truncate w-full py-4 pl-[3.4rem] pr-6 text-[0.85rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-transparent my-1 hover:text-inherit hover:outline-none focus:bg-transparent focus:text-inherit focus:outline-none active:bg-transparent active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:text-emerald-600 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10 inline-flex justify-between w-full',

        spanClass3: 'ml-2 inline-block whitespace-nowrap rounded-[0.27rem] bg-emerald-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.85em] font-normal leading-none text-emerald-700',

        badgeClass: 'absolute inline-flex items-center justify-center w-6 h-6 text-xs font-normal text-black bg-cyan-100 border-2 border-cyan-500 rounded-full -top-2 -end-2 dark:border-cyan-900 right-1 px-1',

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
        projectsNo: 0
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
        window.addEventListener('resize', () => { getWindowWidth() })

        getWindowWidth()

        getBackLink()

        axios.get('/api/urlPrev')
            .then(({ data }) => {
                    info.membersNo   = data[2];
                    info.cyclesNo    = data[3];
                    info.projectsNo  = data[4];
                });
    })

    onUnmounted(() => {
        window.removeEventListener('resize', () => { getWindowWidth() })
    })

    function toggle() {
        info.spanShow = !info.spanShow;
        spanVisible();
    }

    function title(a) {
        if (props.done) {
            return a.toUpperCase();
        } else {
            let x = 'View Disabled ,Complete All Settings';
            return x;
        }
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

    function getBackLink() {
        let link = info.reloadLink
        // console.log(route().current());
			
        if (link == 'empty' || route().current() == 'Dashboard') {
            info.reloadBtn     = false;
            info.reloadLink    = '/dashboard';
        } else {
            info.reloadBtn     = true;
            info.reloadLink    = link;
        }
    }

    function getUrl() {
        axios.get('/api/urlPrev')
            .then(({ data }) => {
                    info.reloadState = data[0];
                    info.reloadLink  = data[1];
                    info.membersNo   = data[2];
                    info.cyclesNo    = data[3];
                    info.projectsNo  = data[4];
                    getBackLink();    
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

        getBackLink()
    }

    function getRoute(url) {
        if (info.spanShow == true) {
            toggle();
        }

        if (props.done) {
            router.visit(url, { 
                preserveScroll: true 
            });
        } else {
            let flashMessage = 'Other Views Disabled ,Complete All Settings!';
            let alertBody    = 'danger';
            emit('flash', flashMessage, alertBody);
        }

        getUrl();
    }

    function flashShow(message, type) {
        emit('flash', message, type)
    }
</script>