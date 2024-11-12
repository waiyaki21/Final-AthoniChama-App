<template>
    <div ref="dialRef" class="fixed group z-10 top-[45%] right-[20px] flex flex-col gap-2">
        <!-- color btn -->
        <button type="button" :class="pluginClass.isLight ? pluginClass.lightClass : pluginClass.darkClass"
            @click="getColor" v-tooltip="$tooltip(pluginClass.themeMsg.toUpperCase(), 'left')">
            <dark-icon :class="pluginClass.isLight ? pluginClass.colorActive : pluginClass.colorInactive"></dark-icon>
            <light-icon :class="!pluginClass.isLight ? pluginClass.colorActive : pluginClass.colorInactive"></light-icon>
        </button>
    </div>

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
</template>

<script setup>
    import { defineProps, reactive ,onBeforeMount, onMounted, nextTick, ref, computed, defineExpose }  from 'vue'

    const pluginClass = reactive({
        isLight: false,
        colorActive: 'w-5 h-5',
        colorInactive: 'hidden w-5 h-5',
        lightClass: 'text-cyan-100 bg-cyan-800 hover:bg-cyan-700 rounded-xl text-sm p-2 border-base border-cyan-100 shadow-md',
        darkClass: 'dark:text-cyan-800 dark:hover:text-gray-900 dark:bg-cyan-100 dark:hover:bg-cyan-300 rounded-xl text-sm p-2 border-base dark:border-cyan-900 shadow-md',
        themeMsg: 'Select Theme',
        theme: ''
    })
    // end data 

    // Reference for the div element
    const dialRef = ref(null);

    // Add event listener on mount and remove it on unmount
    onMounted(() => {
        getInfo()
        setDark()
    })

    onBeforeMount(() => {
        getInfo()
    })

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

    function getInfo() {
        // Change the icons inside the button based on previous settings
        if (localStorage.getItem('color-theme') === 'dark') {
            pluginClass.isLight = false;
            pluginClass.theme = 'dark';
            pluginClass.themeMsg = 'Switch Light Theme';
            setDark();
        } else {
            pluginClass.isLight = true;
            pluginClass.theme = 'light';
            pluginClass.themeMsg = 'Switch Dark Theme';
            setLight();
        }

        if (pluginClass.theme == '' || localStorage.getItem('color-theme') === 'light' || localStorage.getItem('color-theme') === '') {
            getColor();
        }
    }

    function setDark() {
        if (localStorage.getItem('color-theme') === 'dark') {
            if (!document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
                pluginClass.theme = 'dark';
                pluginClass.themeMsg = 'Select Light Theme';
            }
        }
    }

    function setLight() {
        if (localStorage.getItem('color-theme') === 'light') {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
                pluginClass.theme = 'light';
                pluginClass.themeMsg = 'Select Dark Theme';
            }
        }
    }

    function getColor() {
        pluginClass.isLight = !pluginClass.isLight;

        // if set via local storage previously
        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
                pluginClass.theme = 'dark';
                pluginClass.themeMsg = 'Select Light Theme';
                flashAllHide();
                flashShow(`${pluginClass.theme.toUpperCase()} THEME ACTIVATED!`, 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
                pluginClass.theme = 'light';
                pluginClass.themeMsg = 'Select Dark Theme';
                flashAllHide();
                flashShow(`${pluginClass.theme.toUpperCase()} THEME ACTIVATED!`, 'light');
            }
        // if NOT set via local storage previously
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
                pluginClass.theme = 'light';
                pluginClass.themeMsg = 'Select Dark Theme';
                flashAllHide();
                flashShow(`${pluginClass.theme.toUpperCase()} THEME ACTIVATED!`, 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
                pluginClass.theme = 'dark';
                pluginClass.themeMsg = 'Select Light Theme';
                flashAllHide();
                flashShow(`${pluginClass.theme.toUpperCase()} THEME ACTIVATED!`, 'dark');
            }
        }
    }

    // Expose showDial so it can be accessed by the parent component
    defineExpose({
        getColor
    });
</script>