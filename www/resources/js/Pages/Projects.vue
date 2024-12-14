<template>
    <Head>
        <title>{{ props.route }}</title>
    </Head>

    <!-- breadcrumb  -->
    <maincrumbs ref = "mainCrumbsRefs" :items = navItems></maincrumbs>
    <!-- end breadcrumb  -->

    <!-- body section  -->
    <div class="py-2 font-boldened">
        <!-- info options  -->
        <projectinfo
            :expSum         = props.expSum
            :projectSum     = props.projectSum
            :projectNo      = props.projects.length
            :completed      = props.completed
            :totalPercent   = props.totalPercent
            :paySum         = props.paySum
            :balance        = props.balance
            :percent        = percent
        ></projectinfo>
        <!--end info options  -->

        <!-- table and form  -->
        <!-- <div class="p-2 w-full grid grid-cols-1 md:grid-cols-3 gap-1"> -->
            <!-- projects table  -->
            <projecttable
                :ref      = "tableRefs"
                :projects = props.projects
                @show     = showProject
                @delete   = showDelete
                @flash    = flashShow 
                @hide     = flashHide
            ></projecttable>
            <!--end projects table  -->
        <!-- </div> -->
        <!-- end table and form  -->
    </div>
    <!-- end body section  -->

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
</template>

<script setup>
    import { Head } from '@inertiajs/vue3';
    import { computed, reactive, onMounted, ref} from 'vue';

    const props = defineProps({
        name: {
            type: String,
            required: true,
        },
        route: {
            type: String,
            required: true,
        },
        projects: {
            type: Array,
            required: true,
        },
        expSum: {
            type: String,
            required: true,
        },
        paySum: {
            type: String,
            required: true,
        },
        balance: {
            type: String,
            required: true,
        },
        completed: {
            type: String,
            required: true,
        },
        projectSum: {
            type: String,
            required: true,
        },
        totalPercent: {
            type: String,
            required: true,
        },
    })

    const classInfo = reactive({
        info: [],
    })

    onMounted(() => {
        setInfo();
    })

    const navItems = computed(() => [
        {
            url: '/projects',
            label: 'Projects',
            active: true,
        }
    ])

    const percent = computed(() => {
        if (props.projectSum == 0) {
            return 0;
        } else {
            return Math.floor(( props.expSum) /  props.projectSum * 100);
        }
    })

    function setInfo() {
        classInfo.info = props.projects;
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

    const flashLoading = (info) => {
        flashTimed(info, 'loading', 9999999)
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

    // Method to hide the loading flash message after a delay
    const flashHide = () => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.loadHide();
        }
    }

    // Method to hide all messages after a delay
    const flashAllHide = () => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.allHide();
        }
    }
</script>
