<template> 
    <div id="view-notification" :class="[classInfo.alertClass, props.class, 'flex-col space-y overflow-hidden block z-[120]']" v-show="classInfo.show" role="alert" @click="hide">

        <section class="w-full flex-col gap-1 p-1 sm:mx-1">
            <div class="w-full justify-start mb-1 grid grid-cols-10 gap-2">
                <section class="col-span-1">
                    <download-info :class="[classInfo.svgClass]" v-if="classInfo.fileLink"></download-info>
                    <bell-icon :class="[classInfo.svgClass2]" v-else></bell-icon>
                </section>
                <div :class="[classInfo.textClass, 'col-span-9']">
                    {{ props.message }}
                </div>   
            </div>
        </section>

        <hr-line :color="'border-gray-500/50 hidden md:flex'"></hr-line>

        <section class="w-full grid grid-cols-5 gap-2 p-1 border-l-0 ml-0">
            <div class="col-span-4">
                <button @click="goTo(props.url)" :class="[classInfo.btnLink]" v-if="!classInfo.fileLink" :title="props.link">
                    {{ props.link }}
                </button>
                <a :href="props.url" :class="[classInfo.btnLink]" :title="props.link" v-else>
                    {{ props.link }}
                </a>
            </div>
            <div class="col-span-1 w-full inline-flex justify-end">
                <a @click="hide" :class="[classInfo.btnClose, 'w-full inline-flex justify-center']" title="Close Modal">
                    <span class="my-auto mx-auto">Close</span>
                    <times-icon :class="[classInfo.svgClassClose, 'flex md:hidden']"></times-icon>
                </a> 
            </div>
        </section>
    </div>
</template>

<script setup>
    import { defineProps, reactive, watch, computed } from 'vue';
    import { router } from '@inertiajs/vue3';

    const props = defineProps({
        message: {
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
        }
    })

    const classInfo = reactive ({
        duration    : 20000,
        time        : '',
        show        : false,
        alertClass  : 'fixed inline-flex items-center w-[65%] md:w-full max-w-md text-white divide-x divide-black rounded-md shadow-md dark:shadow-sm right-5 top-24 dark:divide-black z-120 cursor-pointer h-fit',
        textClass   : 'pl-2 md:pl-4 md:text-md text-sm font-normal uppercase underline font-boldened text-black dark:text-black whitespace-normal',
        fileLink    : false, 

        svgClass    : 'w-6 h-6 md:w-8 md:h-8 my-1 md:my-2 text-black dark:text-black animate__animated animate__bounceInLeft mx-auto whitespace-nowrap text-ellipsis',
        svgClass2   : 'w-6 h-6 md:w-8 md:h-8 my-1 md:my-2 text-black dark:text-black animate__animated animate__swing animate__delay-1s animate__infinite mx-auto whitespace-nowrap text-ellipsis',
        svgClassClose   : 'w-4 h-4 md:w-8 md:h-8 my-1 md:my-2 text-black dark:text-black mx-auto whitespace-nowrap text-ellipsis',

        btnLink     : 'text-black dark:text-black bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 font-normal rounded-lg p-0.5 md:p-1 text-center uppercase inline-flex w-full justify-center font-normal text-sm md:text-lg font-boldened border-2 border-gray-800 dark:border-gray-800',
        btnClose    : 'text-black dark:text-black bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-red-200 dark:focus:ring-red-800 font-normal rounded-xl p-0.5 md:p-1 text-center uppercase inline-flex md:w-full w-fit justify-center font-normal text-sm md:text-lg font-boldened border-2 border-gray-800 dark:border-gray-800'
    })

    const type = computed(() => props.alertshowview);

    watch(type, (newValue) => {
        see();
    })

    function hide() {
        classInfo.show = false;
    }

    function see() {
        classInfo.show = true;

        if (props.state) {
            classInfo.fileLink = true;
        } else {
            classInfo.fileLink = false;
        }

        setTimeout(() => {
            hide();
        }, classInfo.duration);
    }

    function goTo(url) {
        router.visit(url, { method: 'get' , preserveScroll: true })
    }
</script>