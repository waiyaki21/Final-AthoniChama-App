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
            :members = classInfo.members.length
            :active  = classInfo.active
            :inactive = classInfo.inactive
            :paySum  = classInfo.paySum
            :welfSum = classInfo.welfSum
            :amntbefore = classInfo.amntbefore
            :grandtotal  = classInfo.grandtotal
            :welfareIn   = classInfo.welfareIn
            :welfareOwed = classInfo.welfareOwed
        ></membersinfo>

        <hr-line :color="'border-emerald-500/50'"></hr-line>

        <mainMemberTabs
            :route=props.route @loading=flashLoading @flash=flashShow
            @hide=flashHide @timed=flashTimed @view=flashShowView
        ></mainMemberTabs>
    </div>
</template>

<script setup>
    import { defineProps, reactive, computed, ref, nextTick, onBeforeUnmount, onMounted } from 'vue'

    // Globals 
    import { flashShow, flashLoading, flashTimed, flashShowView, flashHide } from '../Pages/Globals/flashMessages';
    import eventBus     from "./Globals/eventBus";

    const props = defineProps({
        route: {
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

    // Define the reactive object
    const classInfo = reactive({
        members: [],
        paySum: 0,
        welfSum: 0,
        active: 0,
        inactive: 0,
        grandtotal: 0,
        amntbefore: 0,
        welfareOwed: 0,
        welfareIn: 0,
    });

    // Fetch members info
    const getMembersInfo = async () => {
        try {
            const response = await axios.get('/api/getMembersInfo');
            const data = response.data;

            // Update classInfo with the response data
            classInfo.members = data.members;
            classInfo.paySum = data.paySum;
            classInfo.welfSum = data.welfSum;
            classInfo.active = data.active;
            classInfo.inactive = data.inactive;
            classInfo.user = data.user;
            classInfo.grandtotal = data.grandtotal;
            classInfo.amntbefore = data.amntbefore;
            classInfo.welfareOwed = data.welfareOwed;
            classInfo.welfareIn = data.welfareIn;
        } catch (error) {
            console.error('Error fetching members info:', error);
        }
    };

    // Fetch data on component mount
    onMounted(() => {
        getMembersInfo();

        // Define a map of event handlers for various events
        const eventHandlers = {
            reloadMembers:                     getMembersInfo,
        };

        // Register all event handlers
        Object.entries(eventHandlers).forEach(([event, handler]) => {
            eventBus.on(event, handler);
        });

        // Cleanup event listeners on component unmount
        onBeforeUnmount(() => {
            Object.keys(eventHandlers).forEach((event) => {
                eventBus.off(event);
            });
        });
    });
</script>