<template>
    <Head title="Profile" />

    <!-- breadcrumb  -->
    <maincrumbs ref = "mainCrumbsRefs" :items = navItems></maincrumbs>
    <!-- end breadcrumb  -->

    <!-- info section  -->
    <section class="font-normal text-3xl text-cyan-900 dark:text-gray-300 uppercase py-1 w-full inline-flex justify-between" preserve-scroll>
        <span class="underline">User Profile.</span>
    </section>

    <div class="max-h-full px-1">
        <div class="mb-1 border-b-base border-gray-200 dark:border-gray-700">
            <div class="sm:hidden px-2 my-1 w-full">
                <label for="tabs" class="text-gray-300 underline uppercase mb-2">Select tab</label>

                <select class="block appearance-none w-full bg-transparent border-b-2 border-gray-400 hover:border-gray-500 p-2 pr-4 rounded-md text-md shadow leading-tight text-white">
                    <option @click="tab1show()" class="uppercase px-2">{{ classInfo.tab1name }}</option>
                    <option @click="tab2show()" class="uppercase px-2">{{ classInfo.tab2name }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4 text-white" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
            <ul class="hidden sm:flex flex-wrap mb-2 text-sm font-medium text-center" :data-tabs-toggle="['#' + classInfo.view_name]">
                <li class="mr-2">
                    <button :class="[classInfo.btn1class]" :id="[classInfo.tab1name]" type="button" role="tab" @click="tab1show()">{{ classInfo.tab1name }}</button>
                </li>
                <li class="mr-2">
                    <button :class="[classInfo.btn2class]" :id="[classInfo.tab2name]" type="button" role="tab" @click="tab2show()">{{ classInfo.tab2name }}</button>
                </li>
            </ul>
        </div>
        <div :id="[classInfo.view_name]">
            <div :class="[classInfo.tabBody]" v-if="classInfo.tab1body">
                <div class="w-full m-1 text-left mx-auto grid grid-cols-2 gap-2">
                    <UpdateProfileInformationForm
                        :must-verify-email="mustVerifyEmail"
                        :status="status"
                        class="col-span-1 rounded-md border-base shadow-md border-cyan-500 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10 h-fit p-2"
                    />

                    <UpdatePasswordForm class="col-span-1 rounded-md border-base shadow-md border-cyan-500 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10 h-fit p-2" @flash = flashShow></UpdatePasswordForm>
                </div>
            </div>
            <div :class="[classInfo.tabBody]" v-if="classInfo.tab2body">
                <div class="p-2 sm:p-1 w-full m-1 text-left mx-auto">
                    <DeleteUserForm class="w-full rounded-md border-base shadow-md border-rose-500 overflow-hidden bg-rose-400/10 dark:bg-rose-400/10 bg-rose-100 dark:bg-rose-800 p-2" />
                </div>
            </div>
        </div>
    </div>
</template> 

<script setup>
    import { reactive, onBeforeMount, computed} from 'vue';
    // profile
    // import DeleteUserForm from './Profile/Partials/DeleteUserForm.vue';
    // import UpdatePasswordForm from './Profile/Partials/UpdatePasswordForm.vue';
    // import UpdateProfileInformationForm from './Profile/Partials/UpdateProfileInformationForm.vue';

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
        activeTab: 'inline-block p-2 border-b-base border-blue-700 uppercase text-blue-700 font-boldened dark:text-blue-700 dark:hover:text-cyan-500',
        inactiveTab: 'inline-block p-2 border-b-base border-transparent hover:text-gray-600 hover:border-gray-300 uppercase font-boldened dark:text-gray-300 dark:hover:text-cyan-300',
        tabBody: 'bg-transparent dark:bg-transparent relative flex flex-col min-w-0 break-words w-full mb-2 p-1 font-boldened',
        btn1class: '',
        btn2class: '',

        // bodies 
        tab1body: true,
        tab2body: false,

        // bodies 
        tab1name: 'Profile Information',
        tab2name: 'Delete User Account',
    })

    const navItems = computed(() => [
        {
            url: '/profile',
            label: 'User Profile',
            active: true,
        },
    ]);

    onBeforeMount(() => {
        tab1show()
    })

    // show tabs 
    function tab1show() {
        classInfo.tab1body     = true;
        classInfo.tab2body     = false;
        classInfo.btn1class    = classInfo.activeTab;
        classInfo.btn2class    = classInfo.inactiveTab;
    }

    function tab2show() {
        classInfo.tab1body     = false;
        classInfo.tab2body     = true;
        classInfo.btn1class    = classInfo.inactiveTab;
        classInfo.btn2class    = classInfo.activeTab;
    }
</script>