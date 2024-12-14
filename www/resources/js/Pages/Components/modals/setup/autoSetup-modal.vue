<template>
    <Modal :show=classInfo.isOpen>
        <section class="p-2 font-boldened">
            <div class="w-full inline-flex justify-between mb-2 p-2">
                <h2 class="font-normal text-5xl text-red-800 dark:text-red-600 leading-tight uppercase underline py-1 w-full">
                    Automatic Setup.
                </h2>

                <button @click="closeModal" :class="[classInfo.modalCloseBtn]">
                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <section class="flex-col w-full justify-center text-center my-1 bg-cyan-100/10 border border-cyan-500 rounded-lg py-4 shadow-lg font-boldened">
                <h3 class="font-normal sm:text-xl md:text-2xl text-cyan-500 dark:text-cyan-500 uppercase py-1 w-full decoration-cyan-500 underline">
                    Setup 2023 and Current 2024 Information
                </h3>

                <h3 class="font-normal sm:text-base md:text-lg text-gray-800 dark:text-gray-300 uppercase py-1 w-full decoration-gray-300">
                    Automaticaly upload all members, cycles, contributions and welfares upto from Tan 2023 - Jan 2024 
                </h3>
            </section>


            <section class="inline-flex w-full justify-between space-x-1">
                <button class="w-3/5 focus:outline-none text-white bg-teal-700 hover:bg-teal-600 focus:ring-1 focus:ring-teal-300 font-medium rounded-md text-base px-5 py-2.5 mr-2 mb-2 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-900 cursor-pointer uppercase shadow hover:shadow-md dark:border-2 dark:border-teal-900" @click="automaticSetup">
                    <span class="font-medium underline">Automatic Setup</span>
                </button>
                <button type="button" class="w-2/5 text-white bg-blue-700 hover:bg-red-800 focus:ring-1 focus:ring-red-300 font-medium rounded text-base px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-blue-800 shadow hover:shadow-md dark:border dark:border-red-900 uppercase" @click="closeModal">
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

    const emit = defineEmits(['reload', 'close'])

    const props = defineProps({
        show : {
            type: Boolean,
            required:true
        }
    });

    const type = computed(() => props.show);

    watch(type, (newValue) => {
        classInfo.isOpen = props.show;
        showModal();
    })

    const closeOnEscape = (e) => {
        if (e.key === 'Escape' && props.show) {
            closeModal();
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
        alertSuccess: 'border-b-[4px] border-teal-800 dark:border-teal-800 shadow-green-900 dark:shadow-green-900 bg-green-100 dark:bg-green-500',
        alertInfo: 'border-b-[4px] border-blue-800 dark:border-blue-800 shadow-blue-900 dark:shadow-blue-900 bg-blue-100 dark:bg-blue-500',
        alertWarning: 'border-b-[4px] border-orange-800 dark:border-orange-800 shadow-orange-900 dark:shadow-orange-900 bg-orange-100 dark:bg-orange-500',
        alertDanger: 'border-b-[4px] border-red-800 dark:border-red-800 shadow-red-900 dark:shadow-red-900 bg-red-100 dark:bg-red-500',
    })

    // classes 
    const classInfo = reactive({
        // active info 
        isOpen: false,
        modalData: {},
        modalID: '',

        modalURL: '/automatic/setup',

        modalCloseBtn: 'cursor-pointer dark:text-red-800 text-red-500 transition-transform hover:rotate-180 w-6 h-6 hover:w-8 hover:h-8'
    })

    onMounted(() => {
        showModal()
    })

    function showModal() {
        classInfo.isOpen = props.show;
    }

    function closeModal() {
        classInfo.modalData   = {};
        classInfo.modalID     = '';
        emit('close');
        classInfo.isOpen = props.show;
    }

    function automaticSetup() {
        let url  = classInfo.modalURL;

        axios.get(url)
            .then(
                ({ data }) => {
                    closeModal(),

                    // flashMessage 
                    alerts.flashMessage = name + ': Member State Switched!';
                    alerts.alertBody = 'info';
                    flashShow(alerts.flashMessage, alerts.alertBody);
                    emit('reload');
                });
    }

    function flashShow(message, body) {
        alerts.alertType = body;
        alerts.flashMessage   = message;
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