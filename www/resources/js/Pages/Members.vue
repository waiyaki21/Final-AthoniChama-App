<template>
    <Head>
        <title>{{ props.route }}</title>
    </Head>

    <!-- breadcrumb  -->
    <maincrumbs ref = "mainCrumbsRefs" :items = navItems></maincrumbs>
    <!-- end breadcrumb  -->

    <div class="py-2 font-boldened">
        <!-- info panel  -->
        <membersinfo
            :members = members.length
            :active  = active
            :inactive = inactive
            :paySum  = paySum
            :welfSum = welfSum
            :amntbefore = amntbefore
            :grandtotal  = grandtotal
            :welfareIn   = welfareIn
            :welfareOwed = welfareOwed
        ></membersinfo>

        <hr-line :color="'border-emerald-500/50'"></hr-line>

        <membersPageTabs
            :route          = props.route
            :members        = members
            @loading        = flashLoading
            @flash          = flashShow
            @hide           = flashHide
            @timed          = flashTimed
            @view           = flashShowView
        ></membersPageTabs>
    </div>

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
</template>

<script setup>
    import { defineProps, reactive, computed, ref, nextTick } from 'vue'

    const props = defineProps({
        name: {
            type: String,
            required: true,
        },
        route: {
            type: String,
            required: true,
        },
        members: {
            type: Array,
            required: true,
        },
        active: {
            type: String,
            required: true,
        },
        inactive: {
            type: String,
            required: true,
        },
        paySum: {
            type: String,
            required: true,
        },
        welfSum: {
            type: String,
            required: true,
        },
        user: {
            type: Object,
            required: true,
        },
        paySum: {
            type: String,
            required: true,
        },
        welfSum: {
            type: String,
            required: true,
        },
        grandtotal: {
            type: String,
            required: true,
        },
        amntbefore: {
            type: String,
            required: true,
        },
        welfareIn: {
            type: String,
            required: true,
        },
        welfareOwed: {
            type: String,
            required: true,
        },
    });

    const navItems = computed(() => [
        {
            url: '/members',
            label: 'Group Members',
            active: true,
        },
    ]);

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