<template>
    <div>
        <toast 
            ref             ="toastNotifyRef"
        ></toast>
        <loading-body
            v-if="isloading == true"
        ></loading-body>
        <div class="container bg-blueGray-50 dark:bg-gray-900 max-h-full" v-else>
            <h2 class="text-black underline uppercase text-5xl my-4">{{ view_name }}.</h2>
            <div class="mb-2 border-b border-gray-200 dark:border-gray-700">
                <div class="sm:hidden">
                    <label for="tabs" class="sr-only uppercase">Select tab</label>
                    <select id="tabs" class="bg-white border-0 border-b border-gray-400 text-black text-base uppercase underline block w-full p-2.5">
                        <option @click="tab1show()" class="uppercase px-2">{{ tab1name }}</option>
                        <option @click="tab2show()" class="uppercase px-2">{{ tab2name }}</option>
                        <option @click="tab3show()" class="uppercase px-2">{{ tab3name }}</option>
                    </select>
                </div>
                <ul class="hidden sm:flex flex-wrap mb-2 text-lg font-medium text-center" :data-tabs-toggle="['#'+this.view_name]">
                    <li class="mr-2">
                        <button :class="[this.btn1class]" :id="[tab1name]" type="button" role="tab" @click="tab1show()">{{ tab1name }}</button>
                    </li>
                    <li class="mr-2">
                        <button :class="[this.btn2class]" :id="[tab2name]" type="button" role="tab" @click="tab2show()">{{ tab2name }}</button>
                    </li>
                    <li class="mr-2">
                        <button :class="[this.btn3class]" :id="[tab3name]" type="button" role="tab" @click="tab3show()">{{ tab3name }}</button>
                    </li>
                </ul>
            </div>
            <div :id="[this.view_name]">
                <div :class="[this.tabBody]" v-if="tab1body">
                    <h2 class="text-black underline uppercase text-3xl my-4">{{ tab1name }}.</h2>
                </div>
                <div :class="[this.tabBody]" v-if="tab2body">
                    <h2 class="text-black underline uppercase text-3xl my-4">{{ tab2name }}.</h2>
                </div>
                <div :class="[this.tabBody]" v-if="tab3body">
                    <h2 class="text-black underline uppercase text-3xl my-4">{{ tab3name }}.</h2>
                </div>
            </div>
        </div>
        <div class=" max-h-full" v-else>
            <div class="mb-2 border-b border-gray-200 dark:border-gray-700">
                <div class="sm:hidden">
                    <label for="tabs" class="sr-only uppercase">Select tab</label>
                    <select id="tabs" class="bg-white border-0 border-b border-gray-400 text-black text-base uppercase underline block w-full p-2.5">
                        <option @click="tab1show()" class="uppercase px-2">{{ tab1name }}</option>
                        <option @click="tab2show()" class="uppercase px-2">{{ tab2name }}</option>
                        <option @click="tab3show()" class="uppercase px-2">{{ tab3name }}</option>
                        <option @click="tab4show()" class="uppercase px-2">{{ tab4name }}</option>
                    </select>
                </div>
                <ul class="hidden sm:flex flex-wrap mb-2 text-lg font-medium text-center" :data-tabs-toggle="['#' + this.view_name]">
                    <li class="mr-2">
                        <button :class="[this.btn1class]" :id="[tab1name]" type="button" role="tab" @click="tab1show()">{{ tab1name }}</button>
                    </li>
                    <li class="mr-2">
                        <button :class="[this.btn2class]" :id="[tab2name]" type="button" role="tab" @click="tab2show()">{{ tab2name }}</button>
                        <span class="bg-blue-100 text-gray-800 text-base font-normal mx-2 px-2.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-gray-300 border-2 border-cyan-900 dark:border-cyan-500">
                            {{ members.length }}
                        </span>
                    </li>
                    <li class="mr-2">
                        <button :class="[this.btn3class]" :id="[tab3name]" type="button" role="tab" @click="tab3show()">{{ tab3name }}</button>
                        <span class="bg-blue-100 text-gray-800 text-base font-normal mx-2 px-2.5 py-0.5 rounded-full dark:bg-teal-900 dark:text-gray-300 border-2 border-teal-900 dark:border-teal-500">
                            {{ cycles.length }}
                        </span>
                    </li>
                    <li class="mr-2">
                        <button :class="[this.btn4class]" :id="[tab4name]" type="button" role="tab" @click="tab4show()">{{ tab4name }}</button>
                    </li>
                </ul>
            </div>
            <div :id="[this.view_name]">
                <div :class="[this.tabBody]" v-if="tab1body">
                    <h2 class="text-black dark:text-gray-300 underline uppercase text-4xl m-4">{{ tab1name }}.</h2>
                    <settingTabs
                        :settings   = settings
                        @reload     = reloadNav
                    ></settingTabs>
                </div>
                <div :class="[this.tabBody]" v-if="tab2body">
                    <h2 class="text-black dark:text-gray-300 underline uppercase text-4xl m-4">{{ tab2name }}.</h2>
                    <memberTabs
                    ></memberTabs>
                </div>
                <div :class="[this.tabBody]" v-if="tab3body">
                    <h2 class="text-black dark:text-gray-300 underline uppercase text-4xl m-4">{{ tab3name }}.</h2>
                    <cycleTabs
                        :current    = current
                        :cycles     = cycles
                        :nextname   = nextname
                        :date       = date
                        :settings   = settings
                    ></cycleTabs>
                </div>
                <div :class="[this.tabBody]" v-if="tab4body">
                    <h2 class="text-black dark:text-gray-300 underline uppercase text-4xl m-4">{{ tab4name }}.</h2>
                    <projectTabs
                    ></projectTabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // import toast                  from '../Components/AlertComponents/toast-simple.vue';

    export default {
        props: [

        ],

        data() {
            return {
                // load 
                isloading: true,

                // page name 
                view_name: "",

                // tabs
                // classes
                activeTab: 'inline-block p-4 py-3 border-b-2 border-blue-700 uppercase text-blue-700',
                inactiveTab: 'inline-block p-4 py-3 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 uppercase',
                tabBody: 'bg-white dark:bg-gray-800 relative flex flex-col min-w-0 break-words w-full mb-6 shadow bg-blueGray-200 border border-cyan-300 dark:border-cyan-600 p-4 py-2 rounded-md',
                btn1class: '',
                btn2class: '',
                btn3class: '',

                // bodies 
                tab1body: true,
                tab2body: false,
                tab3body: false,

                // bodies 
                tab1name: 'Class',
                tab2name: 'Stream',
                tab3name: 'Pupil',
            }
        },

        components: {
            // flash
        },

        beforeMount() {
            this.isloading = true;
            this.getData();
            this.tab1show();
        },

        methods: {
            loaded() {
                this.view_name = this.$route.name;
                this.isloading = false;
            },

            getData() {
                axios.get('/api/getData/Admin')
                    .then(
                    	({data}) => {
                    		// this.inStock        = data[0]
                            // this.outOfStock     = data[1]
                            this.loaded();
                    });
            },

            // show tabs 
            tab1show() {
                this.tab1body     = true;
                this.tab2body     = false;
                this.tab3body     = false;
                this.btn1class    = this.activeTab;
                this.btn2class    = this.inactiveTab;
                this.btn3class    = this.inactiveTab;
            },

            tab2show() {
                this.tab1body     = false;
                this.tab2body     = true;
                this.tab3body     = false;
                this.btn1class    = this.inactiveTab;
                this.btn2class    = this.activeTab;
                this.btn3class    = this.inactiveTab;
            },

            tab3show() {
                this.tab1body     = false;
                this.tab2body     = false;
                this.tab3body     = true;
                this.btn1class    = this.inactiveTab;
                this.btn2class    = this.inactiveTab;
                this.btn3class    = this.activeTab;
            },
        }
    }
</script>