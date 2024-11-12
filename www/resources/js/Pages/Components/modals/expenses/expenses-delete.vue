<template>
    <Modal :show=classInfo.isDeleteOpen>
        <section class="p-2 font-boldened">
            <div class="w-full inline-flex justify-between mb-2 p-2">
                <h2
                    class="font-normal text-2xl text-red-800 dark:text-red-600 leading-tight uppercase underline py-1 w-full">
                    Delete Expense: {{ props.name }}
                </h2>

                <button @click="closeDelete" :class="[classInfo.modalCloseBtn]">
                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <section class="flex w-full justify-start my-1">
                <h3
                    class="font-normal text-2xl text-red-800 dark:text-red-600 leading-tight uppercase underline py-1 w-full decoration-red-900">
                    Are you sure you want to delete this expense of ksh {{ Number(props.info.amount).toLocaleString() }}?
                </h3>
            </section>

            <section class="flex w-full justify-start mb-2">
                <h4 class="font-normal text-xs text-gray-600 dark:text-gray-200 leading-tight uppercase py-1 w-full">
                    (Incase of any accidental deleting of data, contact Waiyaki - 0794967315)
                </h4>
            </section>

            <section class="inline-flex w-full justify-between space-x-1">
                <button
                    class="w-3/5 focus:outline-none text-white bg-red-700 hover:bg-red-600 focus:ring-1 focus:ring-red-300 font-medium rounded text-base px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer uppercase shadow hover:shadow-md dark:border-2 dark:border-red-900"
                    @click="deleteInfo">
                    Yes, Delete !
                </button>
                <button type="button"
                    class="w-2/5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium rounded text-base px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 shadow hover:shadow-md dark:border dark:border-blue-900 uppercase"
                    @click="closeDelete">
                    No
                </button>
            </section>
        </section>
    </Modal>

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
    import { defineProps, reactive, computed, watch, defineEmits, onMounted, onUnmounted } from 'vue'
    import { router } from '@inertiajs/vue3';

    const emit = defineEmits(['reload', 'close'])

    const props = defineProps({
        info: {
            type: Object,
            required: true,
        },
        show : {
            type: Boolean,
            required:true
        },
        name : {
            type: String,
            required: true
        }, 
        amount: {
            type: String,
            required: true
        }, 
    });

    const type = computed(() => props.show);

    watch(type, (newValue) => {
        classInfo.isOpen = props.show;
        showDelete(props.info);
    })

    const closeOnEscape = (e) => {
        if (e.key === 'Escape' && props.show) {
            closeDelete();
        }
    };

    onMounted(() => document.addEventListener('keydown', closeOnEscape));
    onUnmounted(() => document.removeEventListener('keydown', closeOnEscape));

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

    // classes 
    const classInfo = reactive({
        // delete info 
        isDeleteOpen: false,
        deleteData: {},
        deleteID: '',

        deletePayURL: '/delete/expense/',

        modalCloseBtn: 'cursor-pointer dark:text-red-800 text-red-500 transition-transform hover:rotate-180 w-6 h-6 hover:w-8 hover:h-8'
    })

    function showDelete(info) {
        classInfo.deleteData   = info;
        classInfo.deleteID     = info.id;
        classInfo.isDeleteOpen = props.show;
    }

    function closeDelete() {
        classInfo.deleteData   = {};
        classInfo.deleteID     = '';
        emit('close');
        classInfo.isDeleteOpen = props.show;
    }

    function deleteInfo() {
        let url  = classInfo.deletePayURL + classInfo.deleteID;
        let amnt = Number(props.info.amount).toLocaleString()

        router.delete(url, {
            method: 'delete',

            onSuccess: () => [
                closeDelete(),

                // flashMessage 
                alerts.flashMessage   = props.name + ' '+ 'Ksh '+ amnt +' Expense Deleted!',
                alerts.alertBody      = 'danger',
                flashShow(alerts.flashMessage, alerts.alertBody),
                emit('reload')
            ]
        })
    }

    function flashShow(message, body) {
        alerts.flashMessage   = message;
        alerts.alertType = body;
        if (body == 'success') {
            alerts.alertBody = alerts.alertSuccess; 
        } 
        if(body == 'info') {
            alerts.alertBody = alerts.alertInfo;
        } 
        if(body == 'warning') {
            alerts.alertBody = alerts.alertWarning;
        } 
        if(body == 'danger') {
            alerts.alertBody = alerts.alertDanger; 
        }

        alerts.alertShow      = !alerts.alertShow;
    }
</script>