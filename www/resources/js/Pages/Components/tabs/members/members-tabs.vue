<template>
    <div class="w-full flex-col space-y-2 mt-2">

        <section class="grid grid-cols-1 md:grid-cols-5 gap-2">
            <!-- table  -->
            <memberstable
                :members    = props.members
                :loading    = classInfo.isLoading
                @flash      = flashShow
                @hide       = flashHide
                @loading    = flashLoading
                @timed      = flashTimed
                @view       = flashShowView
                @reload     = getInfo
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
</template>

<script setup>
    import { reactive, defineEmits, onMounted } from 'vue'

    const props = defineProps({
        route: {
            type: String,
            required: true,
        },
        members: {
            type: Array,
            required: true,
        }
    })
    
    const classInfo = reactive ({
        routeCheck: false,
        isLoading: false,

        info: [],

        // tabs settings 
        viewShow: false,
        headerMain: 'font-normal text-[1.95rem] text-cyan-800 dark:text-gray-300 leading-tight uppercase py-1 w-full inline-flex justify-between my-1 hover:text-cyan-500 dark:hover:text-cyan-500 cursor-pointer',

        link: ''
    })

    onMounted(() => {
        setInfo()
    })

    const emit = defineEmits(['changed', 'flash', 'loading', 'view', 'hide', 'timed'])

    function setInfo() {
        classInfo.isLoading = true;
        classInfo.info      = props.members;
    }

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

    function flashShow(message, body) {
        emit('flash', message, body)
        classInfo.isLoading      = false;
    }

    function flashLoading(message) {
        classInfo.isLoading      = true;
        emit('timed', message, 'warning', 100000000)
    }

    function flashHide() {
        emit('hide');
    }

    function flashTimed(message, body, duration) {
        emit('timed', message, body, duration)
    }

    function flashShowView(message, body, header, url, button, duration, linkState) {
        emit('view', message, body, header, url, button, duration, linkState);
    }
</script>