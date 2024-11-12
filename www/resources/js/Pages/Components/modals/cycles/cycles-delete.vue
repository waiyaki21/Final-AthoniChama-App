<template>
    <Modal :show=classInfo.isDeleteOpen>
        <section class="p-2 font-boldened">
            <div class="w-full inline-flex justify-between mb-2 p-1">
                <h2 class="font-normal text-2xl text-red-800 dark:text-red-600 leading-tight uppercase underline py-1 w-full">
                    Delete Cycle: {{ classInfo.deleteData.name }}
                </h2>

                <button @click="closeDelete" :class="[classInfo.modalCloseBtn]">
                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <section class="flex w-full justify-start my-1">
                <h3 class="font-normal sm:text-sm md:text-md text-red-800 dark:text-red-600 leading-tight uppercase underline py-1 w-full decoration-red-900">
                    Are you sure you want to delete {{ classInfo.deleteData.name }}? Deleting a Payment Cycle will in turn delete both payment, welfares, projects & project expense records held within!
                </h3>
            </section>

            <section class="flex w-full justify-start mb-2">
                <h4 class="font-normal text-2xs text-gray-600 dark:text-gray-200 leading-tight uppercase py-1 w-full">
                    (Incase of any accidental deleting of data, contact Waiyaki - 0794967315)
                </h4>
            </section>

            <section class="w-full justify-between space-x-1 grid grid-cols-5 gap-0.5">
                <ActionButton :class="'col-span-4'" buttonClass='submitDanger' @handleClick="deleteInfo" :tooltipText="`Delete Cycle: ${classInfo.deleteData.name}`" :buttonText="`Delete Cycle.`">
                    <delete-icon class="w-4 h-4 md:w-5 md:h-5"></delete-icon>
                </ActionButton>

                <ActionButton :class="'col-span-1'" buttonClass='other' @handleClick="closeDelete" :tooltipText="`Close Delete`" :buttonText="`Close.`">
                    <times-icon class="w-4 h-4 md:w-5 md:h-5"></times-icon>
                </ActionButton>
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
        }
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

        deleteURL: '/delete/cycle/',

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
        let url  = classInfo.deleteURL + classInfo.deleteID;
        let name = classInfo.deleteData.name;

        router.delete(url, {
            method: 'delete',

            onSuccess: () => [
                // flashMessage 
                alerts.flashMessage   = name + ': Payment Cycle Deleted!',
                alerts.alertBody      = 'danger',
                flashShow(alerts.flashMessage, alerts.alertBody),
                emit('reload'),
                closeDelete(),
            ]
        })
    }

    function flashShow(message, body) {
        emit('reload')
        emit('flash', message, body)
    }
</script>