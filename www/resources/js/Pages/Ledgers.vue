<template>
    <Head>
        <title>{{ $page.props.route }}</title>
    </Head>

    <!-- breadcrumb  -->
    <maincrumbs ref = "mainCrumbsRefs" :items = navItems></maincrumbs>
    <!-- end breadcrumb  -->

    <!-- header  -->
    <ledgerInfo :header="header.name"></ledgerInfo>

    <ledgerTab @flash-show="flashShow" :cycleinfo=info></ledgerTab>

    <!-- flash alert  -->
    <alert
        :alertshow  = alerts.alertShow
        :message    = alerts.flashMessage
        :class      = alerts.alertBody
        :type       = alerts.alertType
        :title      = alerts.alertType
        :time       = alerts.alertDuration
    ></alert>
</template>

<script setup>
    import { reactive, defineProps, computed } from 'vue';

    const header = reactive({
        'name': 'View Ledgers',
    })

    const props = defineProps({
        info: {
            type: Array,
            required: true,
        },
    });

    // alerts classes 
    const alerts = reactive({
        alertShow: false,
        alertType: '',
        alertDuration: 15000,
        flashMessage: '',
        alertBody: 'border-b-[4px] border-gray-500 shadow-gray-900 dark:shadow-gray-900 bg-gray-100 dark:bg-gray-500',
        alertSuccess: 'border-b-[4px] border-emerald-800 dark:border-emerald-800 shadow-green-900 dark:shadow-green-900 bg-green-100 dark:bg-green-500',
        alertInfo: 'border-b-[4px] border-blue-800 dark:border-blue-800 shadow-blue-900 dark:shadow-blue-900 bg-blue-100 dark:bg-blue-500',
        alertWarning: 'border-b-[4px] border-orange-800 dark:border-orange-800 shadow-orange-900 dark:shadow-orange-900 bg-orange-100 dark:bg-orange-500',
        alertDanger: 'border-b-[4px] border-red-800 dark:border-red-800 shadow-red-900 dark:shadow-red-900 bg-red-100 dark:bg-red-500',
    })

    const navItems = computed(() => [
        {
            url: '/ledgers',
            label: 'Ledgers',
            active: true,
        },
    ]);

    function flashShow(message, body) {
        alerts.flashMessage = message;

        if (body == 'success') {
            alerts.alertBody = alerts.alertSuccess;
        }
        if (body == 'info') {
            alerts.alertBody = alerts.alertInfo;
        }
        if (body == 'warning') {
            alerts.alertBody = alerts.alertWarning;
        }
        if (body == 'danger') {
            alerts.alertBody = alerts.alertDanger;
        }

        alerts.alertShow = !alerts.alertShow;
    }
</script>
