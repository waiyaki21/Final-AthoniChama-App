<script setup>
    import { reactive, onBeforeMount } from 'vue';

    defineProps({
        mustVerifyEmail: {
            type: Boolean,
        },
        status: {
            type: String,
        },
    });

    const classInfo = reactive({
        // load 
        isloading: true,

        // page name 
        view_name: "profile_settings",

        // tabs
        // classes
        activeTab: 'inline-block p-4 py-3 border-b-2 border-blue-700 uppercase text-blue-700 font-boldened dark:text-blue-700 dark:hover:text-cyan-500',
        inactiveTab: 'inline-block p-4 py-3 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 uppercase font-boldened dark:text-gray-300 dark:hover:text-cyan-300',
        tabBody: 'bg-transparent dark:bg-transparent relative flex flex-col min-w-0 break-words w-full mb-4 p-2 font-boldened',
        btn1class: '',
        btn2class: '',
        btn3class: '',

        // bodies 
        tab1body: true,
        tab2body: false,
        tab3body: false,

        // bodies 
        tab1name: 'Profile Information',
        tab2name: 'Password Update',
        tab3name: 'Delete User Account',
    })

    onBeforeMount(() => {
        tab1show()
    })

    // show tabs 
    function tab1show() {
        classInfo.tab1body     = true;
        classInfo.tab2body     = false;
        classInfo.tab3body     = false;
        classInfo.btn1class    = classInfo.activeTab;
        classInfo.btn2class    = classInfo.inactiveTab;
        classInfo.btn3class    = classInfo.inactiveTab;
    }

    function tab2show() {
        classInfo.tab1body     = false;
        classInfo.tab2body     = true;
        classInfo.tab3body     = false;
        classInfo.btn1class    = classInfo.inactiveTab;
        classInfo.btn2class    = classInfo.activeTab;
        classInfo.btn3class    = classInfo.inactiveTab;
    }

    function tab3show() {
        classInfo.tab1body     = false;
        classInfo.tab2body     = false;
        classInfo.tab3body     = true;
        classInfo.btn1class    = classInfo.inactiveTab;
        classInfo.btn2class    = classInfo.inactiveTab;
        classInfo.btn3class    = classInfo.activeTab;
    }
</script>

<template>
    <Head title="Profile" />

    <profilecrumbs></profilecrumbs>

    <section class="flex flex-col col-span-2 px-4 mb-4 w-full">
        <h2 class="font-normal font-boldened text-[3.5rem] text-black dark:text-cyan-300 leading-tight uppercase underline mb-2">
            User Profile.
        </h2>
        <!-- <span class="text-gray-500 md:text-base sm:text-sm uppercase underline">Update {{ $page.props.auth.user.name }} Profile</span> -->
    </section>

    <div class="max-h-full px-2">
        <div class="mb-2 border-b border-gray-200 dark:border-gray-700">
            <div class="sm:hidden px-2 my-2 w-full">
                <label for="tabs" class="text-gray-300 underline uppercase mb-4">Select tab</label>

                <select class="block appearance-none w-full bg-transparent border-b-2 border-gray-400 hover:border-gray-500 p-2 pr-8 rounded-md text-xl shadow leading-tight text-white">
                    <option @click="tab1show()" class="uppercase px-2">{{ classInfo.tab1name }}</option>
                    <option @click="tab2show()" class="uppercase px-2">{{ classInfo.tab2name }}</option>
                    <option @click="tab3show()" class="uppercase px-2">{{ classInfo.tab3name }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4 text-white" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
            <ul class="hidden sm:flex flex-wrap mb-2 text-lg font-medium text-center" :data-tabs-toggle="['#' + classInfo.view_name]">
                <li class="mr-2">
                    <button :class="[classInfo.btn1class]" :id="[classInfo.tab1name]" type="button" role="tab" @click="tab1show()">{{ classInfo.tab1name }}</button>
                </li>
                <li class="mr-2">
                    <button :class="[classInfo.btn2class]" :id="[classInfo.tab2name]" type="button" role="tab" @click="tab2show()">{{ classInfo.tab2name }}</button>
                </li>
                <li class="mr-2">
                    <button :class="[classInfo.btn3class]" :id="[classInfo.tab3name]" type="button" role="tab" @click="tab3show()">{{ classInfo.tab3name }}</button>
                </li>
            </ul>
        </div>
        <div :id="[classInfo.view_name]">
            <div :class="[classInfo.tabBody]" v-if="classInfo.tab1body">
                <h2 class="text-black dark:text-gray-300 underline uppercase text-4xl my-1 mx-4">{{ classInfo.tab1name }}.</h2>
                <div class="p-4 sm:p-8 bg-white dark:bg-gray-800 sm:rounded-lg w-full m-1 text-left mx-auto rounded-xl border-2 shadow-md border-cyan-500 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10 h-fit">
                    <UpdateProfileInformationForm
                        :must-verify-email="mustVerifyEmail"
                        :status="status"
                        class="w-full"
                    />
                </div>
            </div>
            <div :class="[classInfo.tabBody]" v-if="classInfo.tab2body">
                <h2 class="text-black dark:text-gray-300 underline uppercase text-4xl my-1 mx-4">{{ classInfo.tab2name }}.</h2>
                <div class="p-4 sm:p-8 bg-white dark:bg-gray-800 sm:rounded-lg w-full m-1 text-left mx-auto rounded-xl border-2 shadow-md border-cyan-500 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10">
                    <UpdatePasswordForm class="w-full" />
                </div>
            </div>
            <div :class="[classInfo.tabBody]" v-if="classInfo.tab3body">
                <h2 class="text-black dark:text-gray-300 underline uppercase text-4xl my-1 mx-4">{{ classInfo.tab3name }}.</h2>
                <div class="p-4 sm:p-8 bg-white dark:bg-gray-800 sm:rounded-lg w-full m-1 text-left mx-auto rounded-xl border-2 shadow-md border-cyan-500 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10">
                    <DeleteUserForm class="w-full" />
                </div>
            </div>
        </div>
    </div>
</template>
