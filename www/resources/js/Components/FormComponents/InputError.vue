<script setup>
import { defineProps, reactive, watch, computed } from 'vue';

const props = defineProps({
    message: {
        type: String,
    },
});

const type = computed(() => props.message);

watch(type, (newValue) => {
    flashShow();
})

const alerts = reactive({
    // alerts
    alertShow: false,
    alertType: '',
    flashMessage: '',
    alertBody: 'border-b-[4px] border-gray-500 shadow-gray-900 dark:shadow-gray-900 bg-gray-100 dark:bg-gray-500',
    alertDanger: 'border-b-[4px] border-red-800 dark:border-red-800 shadow-red-900 dark:shadow-red-900 bg-red-100 dark:bg-red-500',
})

function flashShow() {
    alerts.flashMessage   = props.message;
    alerts.alertType      = 'danger';
    alerts.alertBody      = alerts.alertDanger; 

    alerts.alertShow      = !alerts.alertShow;
}
</script>

<template>
    <div v-show="props.message">
        <p class="mt-2 text-sm uppercase underline text-red-600 dark:text-red-500">
            {{ props.message }}
        </p>
    </div>

    <!-- flash alert  -->
    <alert
        :alertshow  = alerts.alertShow
        :message    = alerts.flashMessage
        :class      = alerts.alertBody
        :type       = alerts.alertType
        :title      = alerts.alertType
    ></alert>
</template>
