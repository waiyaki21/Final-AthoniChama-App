<script setup>
    // import ApplicationLogo from '@/Components/ApplicationLogo.vue';
    import { Link } from '@inertiajs/vue3';
</script>

<script>
    import  sidenav     from "../Pages/Navs/sideNav.vue";
    import  mainplugin  from "../Pages/Components/plugins/mainPlugin.vue";

    export default {
        data() {
            return {
                setup: false,

                setting: {},
                version: '',
                componentKey: false,

                bodyWidth: 'sm:ml-14',
                showBtn: true,
                test: true,
                sidebarBtn: ''
            }
        },

        components: {
            sidenav,
            mainplugin
        },
        
        methods: {
            getInfo(info, ver) {
                this.setting = info;
                this.version = ver;
            },

            reload() {
                this.componentKey = +1;
            },

            widthCheck(a) {
                this.bodyWidth = a;
            },

            fullCheck(a) {
                this.showBtn  = a;
                if (this.showBtn) {
                    this.sidebarBtn = 'inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600';
                } else {
                    this.sidebarBtn = 'inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 sm:hidden rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600';
                }
            },

            switch() {
                this.showBtn = !this.showBtn
            }
        }
    }
</script>

<template>
    <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">

        <nav class="fixed top-0 z-50 w-full bg-white border-b-2 border-cyan-200 dark:bg-gray-800 dark:border-cyan-700 shadow-md">
            <div class="px-3 py-2 lg:px-5 lg:pl-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center justify-start">
                        <button data-drawer-target="sidebar-button" data-drawer-toggle="sidebar-button" aria-controls="sidebar-button" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 sm:hidden rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                            <span class="sr-only">Open sidebar</span>
                            <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                            </svg>
                        </button>
                        <!-- <button :class="[this.sidebarBtn]" v-if="!showBtn" @click="switch">
                            <span class="sr-only">Open sidebar</span>
                            <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                            </svg>
                        </button> -->
                        <Link :href="route('Dashboard')" :active="route().current('Dashboard')" class="flex ml-2 md:mr-24">
                            <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white hover:text-cyan-600 dark:hover:text-cyan-600 uppercase">
                                {{ $page.props.setting.shortname }}
                                <span class="self-center text-base text-gray-500 dark:text-gray-500 font-semibold sm:text-lg whitespace-nowrap  uppercase">v{{ $page.props.version }}</span>
                            </span>
                        </Link>
                    </div>
                    <div class="flex items-center">
                        <div class="flex items-center ml-3">
                            <div class="inline-flex">
                                <button type="button" class="px-5 py-1 flex bg-gray-800 text-gray-300 hover:text-cyan-400 text-md hover:underline uppercase font-semibold" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                    <span class="sr-only">Open user menu</span>
                                    {{ $page.props.auth.user.name }}.
                                </button>
                            </div>
                            <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 uppercase font-boldened" id="dropdown-user">
                                <div class="px-4 py-3" role="none">
                                    <p class="text-sm text-gray-900 dark:text-white" role="none">
                                    {{ $page.props.auth.user.name }}.
                                    </p>
                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                    {{ $page.props.auth.user.email }}.
                                    </p>
                                </div>
                                <ul class="py-1" role="none">
                                    <li>
                                    <Link href="/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white uppercase" role="menuitem">Dashboard</Link>
                                    </li>
                                    <li>
                                    <Link href="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white uppercase" role="menuitem">Settings</Link>
                                    </li>
                                    <li>
                                    <Link href="/projects" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white uppercase" role="menuitem">Projects</Link>
                                    </li>
                                    <li>
                                    <Link :href="'/logout'" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white uppercase" role="menuitem">Sign out</Link>
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
                :show   = this.showBtn
                @size   = this.widthCheck
                @full   = this.fullCheck
            ></sidenav>
            <!--End Sidenav -->

            <div :class="['flex min-h-screen bg-transparent dark:bg-transparent w-full', this.bodyWidth]">
                <div class="p-4 mt-8 w-full">
                    <!-- Page Heading -->
                    <header class="text-gray-300" v-if="$slots.header">
                        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            <slot name="header" />
                        </div>
                    </header>

                    <!-- Page Content -->
                    <main>
                        <!-- <dial></dial> -->
                        <!-- plugins -->
                        <mainplugin
                            v-bind:user             = "$page.props.auth.user"
                            ref                     = "pluginRef"
                        ></mainplugin>
                        <!-- end plugins -->
                        <slot />
                    </main>
                </div>
            </div>
        </section>
    </div>
</template>
