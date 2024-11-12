<template>
    <Head>
        <title>{{ props.route }}</title>
    </Head>

    <!-- breadcrumb  -->
    <maincrumbs ref = "mainCrumbsRefs" :items = navItems></maincrumbs>
    <!-- end breadcrumb  -->

    <!-- Contribution documents  -->
    <div class="py-2 font-boldened">
        <!-- info panel  -->
        <dashboardinfo
            :finance        = finance
        ></dashboardinfo>
        <!-- end info panel  -->
 
        <hr-line :color="'text-red-800 dark:text-red-500/50 dark:border-red-500/50'"></hr-line>

        <ledgerTabs
            :cycleinfo      = info
            @loading        = flashLoading
            @flash          = flashShow
            @hide           = flashHide
            @timed          = flashTimed
            @view           = flashShowView
        ></ledgerTabs>

        <membersTabs
            :route          = props.route
            @loading        = flashLoading
            @flash          = flashShow
            @hide           = flashHide
            @timed          = flashTimed
            @view           = flashShowView
        ></membersTabs>

        <cycleTabs
            :current    = current
            :cycles     = cycles
            :nextname   = nextname
            :date       = date
            :settings   = settings
            @loading        = flashLoading
            @flash          = flashShow
            @hide           = flashHide
            @timed          = flashTimed
            @view           = flashShowView
        ></cycleTabs>
    </div>
    <!--end Contribution documents  -->

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
</template>

<script setup>
    import { defineProps, computed, nextTick, ref } from 'vue';

    const props = defineProps({
        name: {
            type: String,
            required: true,
        },
        route: {
            type: String,
            required: true,
        },
        settings: {
            type: Object,
            required: true,
        },
        current: {
            type: Object,
            required: true,
        },
        cycles: {
            type: Array,
            required: true,
        },
        nextname: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        finance: {
            type: Object,
            required: true,
        },
        info: {
            type: Array,
            required: true
        }
    })

    const navItems = computed(() => []);

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
        let duration    = 9999999;
        flashTimed(info, type , duration)
    }

    // Method to trigger a timed flash message
    const flashTimed = (message, type, duration) => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.toastOnTime([message, type, duration]);
        }
    }

    const flashShowView = (message, body, header, url, button, duration) => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.toastClick([message, body, header, url, button, duration]);
        }
    }

    const flashHide = () => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.loadHide();
        }
    }
</script>