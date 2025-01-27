<template>
    <div class="min-h-screen flex flex-col sm:justify-center items-center md:pt-1 py-2 px-4 md:px-0 bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white"
        preserve-scroll>
        <div class="w-full flex flex-col justify-center text-center">
            <img src="/favicon.ico"
                class="w-14 h-14 p-1 rounded-full bg-white/10 border-base border-cyan-500 justify-center mx-auto"
                :alt="`${fullname} Icon`">
            <span :class="['underline uppercase text-xl md:text-3xl' , classInfo.title]">
                {{ name }}
            </span>
            <span :class="['text-md', classInfo.title]">
                v{{ version }}
            </span>
        </div>

        <span class="text-xl underline text-cyan-800 dark:text-gray-100 mt-1 font-boldened text-center"
            v-html="$page.component === 'Auth/Register' ? 'REGISTER PAGE.' : 'LOGIN PAGE.'">
        </span>

        <div class="w-full sm:max-w-md my-1 p-2 bg-slate-100/50 dark:bg-gray-800/50 border-base border-cyan-600 dark:border-cyan-800 shadow-md overflow-hidden rounded-lg font-boldened"
            preserve-scroll>
            <!-- plugins -->
            <guestplugin ref="pluginRef"></guestplugin>
            <!-- end plugins -->
            <slot />
        </div>
    </div>

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
</template>

<script setup>
    import  guestplugin  from "../Components/plugins/guestPlugin.vue";
    import { ref, onBeforeUnmount, onMounted, reactive } from "vue";

    import  packageJson from "../../../../../package.json";
    const version       = packageJson.version;
    const name          = packageJson.devshortname;

    // Create a ref to the mainPlugin component
    const pluginRef = ref(null);

    const keyActions = {
        t: 'getColor'
    };

    const classInfo = reactive({
        title: 'text-cyan-800 dark:text-gray-800 text-cyan-800 dark:text-teal-100 font-boldened inline-flex justify-center w-full text-right',
    })

    function handleKeydown(event) {
        if (event.altKey && keyActions[event.key]) {
            event.preventDefault();

            const action = keyActions[event.key];
            if (pluginRef.value && typeof pluginRef.value[action] === 'function') {
                pluginRef.value[action]();
            }
        }
    }

    onMounted(() => {
        window.addEventListener('keydown', handleKeydown);
        linkCheck()
    });

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeydown);
    });

    function linkCheck() {
        let message = 'This is an offline app be careful with your password as it cant be reset online but can be reset through profile settings or by contacting the developer!';
        let type = 'warning';
        flashShow(message, type);
    }

    // Reference for toast notification
    const toastNotificationRef = ref(null);

    // Flash message function
    const flashShow = (info, type) => {
        flashHide();
        nextTick(() => {
            if (toastNotificationRef.value) {
                toastNotificationRef.value.toastOn([info, type]);
            }
        })
    }

    const flashLoading = (info) => {
        flashTimed(info, 'loading', 15000)
    }

    // Method to trigger a timed flash message
    const flashTimed = (message, type, duration) => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.toastOnTime([message, type, duration]);
        }
    }

    const flashShowView = (message, body, header, url, button, duration, linkState) => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.toastClick([message, body, header, url, button, duration, linkState]);
        }
    }

    // Method to hide the loading flash message after a delay
    const flashHide = () => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.loadHide();
        }
    }

    // Method to hide all messages after a delay
    const flashAllHide = () => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.allHide();
        }
    }
</script>
