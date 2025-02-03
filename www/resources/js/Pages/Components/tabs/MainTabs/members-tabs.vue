<template>
    <div class="topToggle flex-col space-y-2" id="member" role="tabpanel" aria-labelledby="member-tab">

        <viewToggle v-if="isDashboard" :title="'Member'" :show="classInfo.viewShow" :length="classInfo.length"
            @toggle="toggleInfo"></viewToggle>

        <section class="grid grid-cols-1 md:grid-cols-5 gap-1" v-if="classInfo.viewShow">
            <!-- table  -->
            <memberstable :members=classInfo.info :loading=classInfo.isLoading @flash=flashShow @hide=flashHide
                @loading=flashLoading @timed=flashTimed @view=flashShowView @reload=getInfo>
            </memberstable>

            <!-- forms  -->
            <membersform :count=classInfo.info.length @reload=getInfo @flash=flashShow @hide=flashHide
                @loading=flashLoading @timed=flashTimed @view=flashShowView></membersform>
        </section>

        <hr-line :color="classInfo.viewShow ? 'border-rose-500/50' : 'border-emerald-500/50'"></hr-line>
    </div>
</template>

<script setup>
    import { reactive, onBeforeMount, defineEmits, ref, nextTick, computed } from 'vue'
    import { router }  from '@inertiajs/vue3';

    import {flashShow, flashLoading, flashTimed, flashShowView, flashHide, reloadMembers, scrollToToggle } from '../../../Globals/flashMessages'

    const props = defineProps({
        route: {
            type: String,
            required: true,
        }
    })

    const isDashboard = computed(() => {
        return router.page.props.route === 'Dashboard';
    })
    
    const classInfo = reactive ({
        routeCheck: false,
        isLoading: false,

        info: [],
        length: '',

        // tabs settings 
        viewShow: true,
        headerMain: 'font-normal md:text-2xl text-xl leading-tight uppercase py-1 w-full inline-flex justify-between my-1 cursor-pointer text-cyan-800 dark:text-gray-300 ',
        headerOn: 'hover:text-emerald-500 dark:hover:text-emerald-500',
        headerOff: 'hover:text-rose-500 dark:hover:text-rose-500',

        link: ''
    })

    onBeforeMount(() => {
        getInfo()
    })

    const emit = defineEmits(['changed', 'flash'])

    function getInfo() {
        classInfo.isLoading = true;
        let link    = 'asc';
        let linkTo  = 'id/';

        axios.get('/api/getMembers/' + linkTo + link)
            .then(
                ({ data }) => {
                    classInfo.info      = data[0];
                    classInfo.length    = data[0].length;
                    classInfo.isLoading = false;
                    emit('changed')
                    reloadMembers();
                });
    }

function toggleInfo(message, type) {
    classInfo.viewShow = !classInfo.viewShow;

    flashShow(message, type)

    nextTick(() => {
        scrollToToggle('.topToggle')
    });
}
</script>