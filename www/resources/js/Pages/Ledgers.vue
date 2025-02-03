<template>
    <Head>
        <title>{{ $page.props.route }}</title>
    </Head>

    <!-- breadcrumb  -->
    <maincrumbs ref = "mainCrumbsRefs" :items = navItems></maincrumbs>
    <!-- end breadcrumb  -->

    <!-- header  -->
    <ledgerInfo :header="header.name"></ledgerInfo>

    <mainLedgerTabs :cycleinfo=info @loading=flashLoading @flash=flashShow @hide=flashHide @timed=flashTimed
            @view=flashShowView></mainLedgerTabs>
</template>

<script setup>
    import { reactive, defineProps, computed } from 'vue';

    // Globals 
    import { flashShow, flashLoading, flashTimed, flashShowView, flashHide } from '../Pages/Globals/flashMessages';

    const header = reactive({
        'name': 'View Ledgers',
    })

    const props = defineProps({
        info: {
            type: Array,
            required: true,
        },
    });

    const navItems = computed(() => [
        {
            url: '/ledgers',
            label: 'Ledgers',
            active: true,
        },
    ]);
</script>
