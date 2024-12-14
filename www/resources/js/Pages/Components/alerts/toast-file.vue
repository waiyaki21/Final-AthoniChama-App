<template>
    <notifications 
        group='file'
        position="top left" 
        width="500px"
        :classes="[props.class,'animate__animated animate__slideInDown']"
        :type="props.type">
        <slot />
        <template #body="props">
            <div :class="['flex flex-col items-center w-full max-w-md p-2 space-y-2 text-white divide-x divide-black rounded-md shadow-sm dark:shadow-sm top-24 dark:divide-black z-120 cursor-pointer my-2 my-notification', props.class]" @click="props.close">
                <section class="inline-flex w-full">
                    <section class="w-[7%]">
                        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" :class="['w-8 h-8 my-2 text-black dark:text-black animate__animated animate__swing animate__delay-1s animate__infinite']">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
                        </svg>
                    </section>

                    <div :class="['pl-4 text-base font-normal uppercase underline font-boldened text-black dark:text-black whitespace-normal notification-title']" v-html="props.item.text"/> 
                </section>
                <section class="w-full inline-flex justify-start space-x-1 px-2 pt-2">
                    <div class="w-3/4">
                        <button @click="goTo(url)" :class="[classInfo.btnLink]" v-if="!state">
                            {{ link }}
                        </button>
                        <a :href="url" :class="[classInfo.btnLink]" v-else>
                            {{ link }}
                        </a>
                    </div>
                    <div class="w-1/4">
                        <a @click="props.close" :class="[classInfo.btnClose]">
                            Close
                        </a> 
                    </div>
                </section>
                <hr class="w-[90%] text-gray-800 dark:text-gray-300/30 my-2 mx-auto border-t-[2.5px] dark:border-gray-300/30">
                <div :class="['w-full inline-flex px-2 justify-between font-normal uppercase font-boldened text-gray-800 dark:text-gray-800 whitespace-normal notification-content']">
                    <span class="underline">{{ $page.component }}</span>
                    <span class="inline-flex"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {{ moment().format("ddd, Do/MM/YY HH:MM:SS A") }}</span>
                </div>
            </div>
        </template>
    </notifications>
</template>

<script setup>
    import { defineProps, watch, computed, reactive } from 'vue';
    import { useNotification } from "@kyvg/vue3-notification";
    import moment from 'moment';
    import { router } from '@inertiajs/vue3';

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
        alertshowview: {
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

    const classInfo = reactive ({
        fileLink    : false, 
        btnLink     : 'text-black dark:text-black bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 font-normal rounded-lg px-5 py-2.5 text-center uppercase inline-flex w-full mb-2 justify-center font-normal text-base font-boldened border-2 border-gray-800 dark:border-gray-800',
        btnClose    : 'focus:outline-none text-black dark:text-black bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-normal rounded-lg px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 uppercase w-full inline-flex justify-center font-normal text-base font-boldened border-2 border-gray-800 dark:border-gray-800',
        link: ''
    })

    const type = computed(() => props.alertshowview);

    watch(type, (newValue) => {
        show(Date.now());
    })

    function show(id) {
        classInfo.link = props.link
        classInfo.url = props.url
        notify(
            {
                id,
                title:      props.title,
                text:       props.message,
                duration:   35000,
                type:       props.type,
                max:        10,
                reverse:    true,
                group:      'file',
                ignoreDuplicates: true,
            }
        );
    }

    function goTo(url) {
        router.visit(url, { method: 'get' })
        notify().close()
    }
</script>

<style scoped>
    .my-notification {
        background: #44a4fc;
        border-bottom: 4px solid #187fe7;
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

    .notification-title {
        font-size: 1.2rem
    }

    .notification-content {
        font-size: 0.7rem;
    }

    .vue-notification-group {
        display: block;
        position: fixed;
        z-index: 5000;
        top: 4rem !important;
        right: 2rem !important;
    }
</style>