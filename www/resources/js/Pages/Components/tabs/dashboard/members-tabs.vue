<template>
    <div class="p-2 flex-col space-y-2" id="member" role="tabpanel" aria-labelledby="member-tab">
        <h3 :class="[classInfo.headerMain]" @click="classInfo.viewShow = !classInfo.viewShow" preserve-scroll>
            <span>
                <span>Members</span>
                <span class="text-xs text-gray-500 dark:text-gray-500 ml-4">
                    ( {{ classInfo.info.length }} members )
                </span>
            </span>

            <button class="cursor-pointer text-gray-300 hover:text-white dark:text-cyan-300 dark:hover:text-white bg-transparent dark:bg-transparent dark:hover:bg-cyan-700 border-2 border-gray-300 dark:border-cyan-300 dark:hover:border-cyan-500 rounded-full p-1 md:p-2 m-2 inline-flex justify-center">
                <down-icon class="w-3 h-3 md:w-4 md:h-4 text-gray-300 hover:text-white dark:text-cyan-300 dark:hover:text-white" v-if="!classInfo.viewShow"></down-icon>
                <up-icon class="w-3 h-3 md:w-4 md:h-4 text-gray-300 hover:text-white dark:text-cyan-300 dark:hover:text-white" v-else></up-icon>
            </button>
        </h3> 

        <section class="grid grid-cols-1 md:grid-cols-5 gap-1 auto-cols-max" v-if="classInfo.viewShow">
            <!-- table  -->
            <memberstable
                :members = classInfo.info
                :loading = classInfo.isLoading
                :height  = sectionHeight
                @flash      = flashShow
                @hide       = flashHide
                @loading    = flashLoading
                @timed      = flashTimed
                @view       = flashShowView
                @reload  = getInfo
            ></memberstable>

            <!-- forms  -->
            <membersform
                :count      = classInfo.info.length
                @reload     = getInfo
                @flash      = flashShow
                @hide       = flashHide
                @loading    = flashLoading
                @timed      = flashTimed
                @view       = flashShowView
            ></membersform>
        </section>
 
        <hr-line :color="'border-emerald-500/50'"></hr-line>
    </div>

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
</template>

<script setup>
    import { reactive, defineEmits, onBeforeMount, ref } from 'vue';

    const emit = defineEmits(['changed', 'flash', 'loading', 'view', 'hide', 'timed'])

    const props = defineProps({
        route: {
            type: String,
            required: true,
        }
    })
    
    const classInfo = reactive ({
        routeCheck: false,
        isLoading: false,

        info: [],

        // tabs settings 
        viewShow: true,
        headerMain: 'font-normal md:text-2xl text-xl text-cyan-800 dark:text-gray-300 leading-tight uppercase py-1 w-full inline-flex justify-between my-1 hover:text-cyan-500 dark:hover:text-cyan-500 cursor-pointer',

        link: ''
    })

    onBeforeMount(() => {
        getInfo()
    })

    function getInfo() {
        classInfo.isLoading = true;
        let link    = 'asc';
        let linkTo  = 'id/';

        axios.get('/api/getMembers/' + linkTo + link)
            .then(
                ({ data }) => {
                    classInfo.info      = data[0];
                    classInfo.isLoading = false;
                });
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

    const flashLoading = () => {
        let info        = 'Loading! Please Wait';
        let type        = 'warning';
        let duration    = 60000;
        flashTimed(info, type , duration)
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

    const flashHide = () => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.loadHide();
        }
    }
</script>