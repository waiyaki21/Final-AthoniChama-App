<template>

    <Head>
        <title>{{ props.route }}</title>
    </Head>

    <!-- breadcrumb  -->
    <maincrumbs ref="mainCrumbsRefs" :items=navItems></maincrumbs>
    <!-- end breadcrumb  -->

    <!-- Contribution documents  -->
    <div class="py-2 font-boldened">
        <!-- info panel  -->
        <dashboardinfo :finance=finance></dashboardinfo>
        <!-- end info panel  -->

        <hr-line :color="'text-red-800 dark:text-red-500/50 dark:border-red-500/50'"></hr-line>

        <!--main ledger tabs -->
        <mainLedgerTabs :cycleinfo=info @loading=flashLoading @flash=flashShow @hide=flashHide @timed=flashTimed
            @view=flashShowView></mainLedgerTabs>
        <!--end main ledger tabs -->

        <!--main member tabs -->
        <mainMemberTabs :route=props.route @loading=flashLoading @flash=flashShow @hide=flashHide @timed=flashTimed
            @view=flashShowView></mainMemberTabs>
        <!-- end main member tabs  -->

        <!--main cycle tabs -->
        <mainCycleTabs :current=current :cycles=cycles :nextname=nextname :date=date :settings=settings
            @loading=flashLoading @flash=flashShow @hide=flashHide @timed=flashTimed @view=flashShowView></mainCycleTabs>
        <!--end main cycle tabs -->
    </div>
    <!--end Contribution documents  -->
</template>

<script setup>
    import { defineProps, computed, nextTick, ref } from 'vue';

    // Globals 
    import { flashShow, flashLoading, flashTimed, flashShowView, flashHide } from '../Pages/Globals/flashMessages';

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
</script>