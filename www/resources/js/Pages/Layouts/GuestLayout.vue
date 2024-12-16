<template>
    <div class="min-h-screen flex flex-col sm:justify-center items-center md:pt-1 py-2 px-4 md:px-0 bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white"
        preserve-scroll>
        <section
            class="font-normal leading-tight uppercase inline-flex justify-between flex-col text-start border-base border-cyan-800 bg-cyan-600/20 rounded-md w-full sm:max-w-md p-2 m-1 shadow">
            <span class="inline-flex justify-start gap-2">
                <img src="/favicon.ico"
                    class="w-14 h-14 p-1 rounded-full bg-white/10 border-base border-cyan-500"
                    alt="Social Welfare & Development Managment System Chama Icon">
                <span
                    class="underline text-xl text-cyan-800 dark:text-gray-800 text-cyan-800 dark:text-teal-100 decoration-teal-700 dark:decoration-teal-300 underline-offset-2 font-boldened inline-flex justify-end w-full text-right">
                    Social Welfare & Development Managment System.
                </span>
            </span>
        </section>

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
</template>

<script setup>
    import  guestplugin  from "../Components/plugins/guestPlugin.vue";
    import { ref, onBeforeUnmount, onMounted } from "vue";

    import  packageJson from "../../../../../package.json";
    const version       = packageJson.version;

    // Create a ref to the mainPlugin component
    const pluginRef = ref(null);

    const keyActions = {
        t: 'getColor'
    };

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
    });

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeydown);
    });
</script>
