<template>
    <notifications 
        group='toast'
        position="top right" 
        :classes="[props.class, 'animate__animated animate__slideInDown']"
        :type="props.type"
        @click="props.close">
        <!-- <slot /> -->
        <template slot="body" slot-scope="props" #body="props">
            <div :class="['flex flex-col items-center w-full max-w-md p-2 gap-0.5 text-white rounded-md shadow-sm dark:shadow-sm top-24 z-120 cursor-pointer my-1 my-notification', props.class]">
                <section class="inline-flex gap-1 w-full">
                    <section class="w-[7%]">
                        <bell-icon :class="['w-4 h-4 md:w-5 md:h-5 my-1 md:my-2 text-black dark:text-black animate__animated animate__swing animate__delay-1s animate__infinite']"></bell-icon>
                    </section>

                    <div :class="['pl-2 md:text-base text-sm font-normal uppercase font-boldened text-black dark:text-black whitespace-normal w-full inline-flex justify-start']" v-html="props.item.text"/> 
                </section>
                <!-- <hr-line :color="'text-gray-800 dark:text-gray-800/50 dark:border-gray-800/50 hidden md:block'"></hr-line> -->
                <!-- <div :class="['w-full px-2 justify-between font-normal uppercase font-boldened text-gray-800 dark:text-gray-800 whitespace-normal notification-content sm:inline-flex hidden text-2xs']">
                    <span class="underline text-2xs">{{ $page.component }}</span>
                    <span class="inline-flex"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-2 h-2 md:w-3 md:h-3 mr-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {{ moment().format("ddd, Do/MM/YY HH:MM:SS A") }}</span>
                </div> -->
            </div>
        </template>
    </notifications>

    <notifications 
        group='loading'
        position="top right" 
        :classes="[props.class, 'animate__animated animate__slideInDown']"
        :type="props.type"
        @click="props.close">
        <!-- <slot /> -->
        <template slot="body" slot-scope="props" #body="props">
            <div :class="['flex flex-col items-center w-full max-w-md p-1 gap-0.5 text-white rounded-md shadow-sm dark:shadow-sm top-24 z-120 cursor-pointer my-1 my-notification', props.class]">
                <section class="inline-flex w-full">
                    <section class="w-[7%]">
                        <bell-icon :class="['w-4 h-4 md:w-5 md:h-5 my-1 md:my-2 text-black dark:text-black animate__animated animate__swing animate__delay-1s animate__infinite']"></bell-icon>
                    </section>

                    <div :class="['pl-2 md:pl-4 md:text-base text-sm font-normal uppercase underline font-boldened text-black dark:text-black whitespace-normal notification-title']" v-html="props.item.text"/> 
                </section>
            </div>
        </template>
    </notifications>
</template>

<script setup>
    import { defineProps, watch, computed } from 'vue';
    import { useNotification } from "@kyvg/vue3-notification";
    import moment from 'moment';

    const { notify } = useNotification()

    const props = defineProps({
        message: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        alertshow: {
            type: Boolean,
            required: true,
        },
        class: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        url2: {
            type: String,
            required: true,
        },
        state: {
            type: Object,
            required: true,
        },
        page: {
            type: Boolean,
            required: true,
        },
        time: {
            type: String,
            required: true,
        }
    })

    const type = computed(() => props.alertshow);

    const id = Date.now()

    watch(type, (newValue) => {
        show();
    })

    const loading = computed(() => props.time);

    watch(loading, (newValue) => {
        showLoading();
    })

    function show() {
        notify(
            {
                id,
                title:      props.title,
                text:       props.message,
                duration:   5000,
                type:       props.type,
                max:        5,
                reverse:    true,
                group:      'toast',
                ignoreDuplicates: true,
                closeOnClick: true,
                // clean: true
            }
        );
    }

    function close(id) {
        notify.close(id)
    }

    function showLoading() {
        notify(
            {
                id,
                title:      props.title,
                text:       props.message,
                duration:   60000,
                type:       props.type,
                max:        1,
                reverse:    true,
                group:      'loading',
                ignoreDuplicates: true,
                closeOnClick: true,
                clean: true
            }
        );
    }
</script>

<style scoped>
    .my-notification {
        background: #44a4fc;
        border-bottom: 2px solid #187fe7;
    }
        /* // types (green, amber, red) */
    .my-notification.success {
        background: rgb(14 159 110 / var(--tw-bg-opacity));
        border-bottom-color: rgb(6 95 70 / var(--tw-border-opacity));
    }

    .my-notification.warning {
        background: rgb(255 90 31 / var(--tw-bg-opacity));
        border-bottom-color: rgb(138 44 13 / var(--tw-border-opacity));
    }

    .my-notification.info {
        background-color: rgb(63 131 248 / var(--tw-bg-opacity));
        border-bottom-color: rgb(30 66 159 / var(--tw-border-opacity));
    }

    .my-notification.danger {
        background-color: rgb(240 82 82 / var(--tw-bg-opacity));
        border-bottom-color:rgb(155 28 28 / var(--tw-border-opacity));
    }

    /* .notification-title {
        font-size: 1.2rem;
        font-weight: 300;
    } */

    /* .notification-content {
        font-size: 0.7rem;
    } */

    .vue-notification-group {
        display: block;
        position: fixed;
        z-index: 5000;
        top: 4rem !important;
        right: 2rem !important;
    }
</style>