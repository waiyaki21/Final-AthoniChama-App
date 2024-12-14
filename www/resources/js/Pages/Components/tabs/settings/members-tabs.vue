<template>
    <div class="flex-col space-y-2" id="member" role="tabpanel" aria-labelledby="member-tab">

        <section class="grid grid-cols-1 md:grid-cols-5 gap-1">
            <!-- table  -->
            <memberstable :members=classInfo.info :loading=classInfo.isLoading :height=sectionHeight @flash=flashShow
                @hide=flashHide @loading=flashLoading @timed=flashTimed @view=flashShowView @reload=getInfo>
            </memberstable>

            <!-- forms  -->
            <membersform :count=classInfo.info.length @reload=getInfo @flash=flashShow @hide=flashHide
                @loading=flashLoading @timed=flashTimed @view=flashShowView></membersform>
        </section>

        <hr-line :color="'border-emerald-500/50'"></hr-line>
    </div>

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
</template>

<script setup>
    import { reactive, onBeforeMount, defineEmits, ref, nextTick } from 'vue'

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

        infoSection: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        infoHeader: 'text-cyan-300 mb-2 text-2xl text-left font-normal underline tracking-tight uppercase',
        borderClass: 'border-[3px] border-cyan-600 dark:border-cyan-700',
        mainHeader: 'font-boldened text-2xl text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1',

        // tabs settings 
        viewShow: false,
        headerMain: 'font-normal text-[1.95rem] text-cyan-800 dark:text-gray-300 leading-tight uppercase py-1 w-full inline-flex justify-between my-1 hover:text-cyan-500 dark:hover:text-cyan-500 cursor-pointer',

        link: ''
    })

    onBeforeMount(() => {
        getInfo()
    })

    const emit = defineEmits(['changed'])

    function getInfo() {
        classInfo.isLoading = true;
        let link    = 'asc';
        let linkTo  = 'id/';

        axios.get('/api/getMembers/' + linkTo + link)
            .then(
                ({ data }) => {
                    classInfo.info      = data[0];
                    classInfo.isLoading = false;
                    emit('changed')
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