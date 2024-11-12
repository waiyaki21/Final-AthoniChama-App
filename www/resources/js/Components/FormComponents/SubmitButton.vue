<script setup>
    import { defineProps, watch, computed, onMounted, reactive } from 'vue';

    const props = defineProps({
        loading: {
            type: Boolean,
            required: true,
        },
        success: {
            type: Boolean,
            required: true,
        },
        failed: {
            type: Boolean,
            required: true,
        },
        editting: {
            type: Boolean,
            required: true,
        },
        // errors: {
        //     type: String,
        //     required: true
        // }
    });

    const info = reactive({
        btnClass: '',
        normal: 'text-white bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:bg-gradient-to-l focus:ring-1 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-md p-2 text-center mb-1 uppercase inline-flex justify-between w-full shadow-md',
        loading: 'text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-1 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-md p-2 text-center mb-1 uppercase inline-flex justify-between w-full opacity-75 cursor-not-allowed shadow-md',
        failed: 'text-white bg-gradient-to-r from-rose-600 to-red-500 hover:bg-gradient-to-l focus:ring-1 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-md p-2 text-center mb-1 uppercase inline-flex justify-between w-full shadow-md',
        success: 'text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:bg-gradient-to-l focus:ring-1 focus:outline-none focus:ring-emerald-300 dark:focus:ring-emerald-800 font-medium rounded-lg text-md p-2 text-center mb-1 uppercase inline-flex justify-between w-full shadow-md',

        svgIcon: '',
        svgSize: 'h-5 w-5',
        svgNormal: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round"d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>',
        svgLoading: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 animate-spin"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>',
        svgFailed: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round"d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>',
        svgSuccess: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round"d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>',

    })

    const type1 = computed(() => props.loading);
    const type2 = computed(() => props.success);
    const type3 = computed(() => props.failed);
    const type4 = computed(() => props.editting);

    watch(type1, (normalValue) => {
        if (props.loading) {
            info.btnClass   = info.loading;
            info.svgIcon    = info.svgLoading;
        } else {
            if (props.failed) {
                info.btnClass = info.failed;
                info.svgIcon = info.svgFailed;
            } else {
                if (props.success) {
                    info.btnClass = info.success;
                    info.svgIcon = info.svgSuccess;
                } else {
                    setNormal()
                }
            }
        }
    })

    watch(type2, (successValue) => {
        if (props.success) {
            info.btnClass = info.success;
            info.svgIcon  = info.svgSuccess;
            setTimeout(() => {
                setNormal()
            }, 30000);
        }
    })

    watch(type3, (failedValue) => {
        // console.log('failed');
        if (props.failed) {
            info.btnClass = info.failed;
            info.svgIcon = info.svgFailed; 
        }
    })

    watch(type4, (edittingValue) => {
        // console.log('editting');
        if (props.editting) {
            setNormal()
        } else {
            if (props.failed) {
                info.btnClass = info.failed;
                info.svgIcon = info.svgFailed;
            } else {
                setNormal()
            }
        }
    })

    onMounted(() => {
        setNormal();
    })

    function setNormal() {
        resetClasses()
        info.btnClass = info.normal;
        info.svgIcon  = info.svgNormal; 
    }

    function resetClasses() {
        info.btnClass = '';
        info.svgIcon  = ''; 
    }
</script>

<template>
    <button :class="[info.btnClass]">
        <slot />

        <div :class="[info.svgSize]" v-html="info.svgIcon"></div>
    </button>
</template>
