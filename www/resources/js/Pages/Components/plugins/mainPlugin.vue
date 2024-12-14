<template>
    <div ref="dialRef" class="fixed group z-10 top-[45%] right-[20px] flex flex-col gap-2">
        <!-- color btn -->
        <button type="button" :class="pluginClass.isLight ? pluginClass.lightClass : pluginClass.darkClass"
            @click="getColor" v-tooltip="$tooltip(`${pluginClass.themeMsg.toUpperCase()} : Alt + T`, 'left')">
            <dark-icon :class="pluginClass.isLight ? pluginClass.colorActive : pluginClass.colorInactive"></dark-icon>
            <light-icon
                :class="!pluginClass.isLight ? pluginClass.colorActive : pluginClass.colorInactive"></light-icon>
        </button>

        <!-- dial btn  -->
        <button type="button" :class="[pluginClass.mainClass]" @click="showDial"
            v-tooltip="$tooltip(pluginClass.btn0.toUpperCase(), 'left')">
            <add-icon class="w-5 h-5 transition-transform group-hover:rotate-90"></add-icon>
            <span class="sr-only">Open actions menu</span>
        </button>

        <div :class="[pluginClass.dialClass, 'animate__animated', animationClass]"
            v-show="pluginClass.dialShow || animationClass === 'animate__fadeOutLeft'">
            <!-- Members  -->
            <button type="button" :class="[pluginClass.btnDropClass]" @click="addMembers"
                v-tooltip="$tooltip(pluginClass.btn1.toUpperCase(), 'left')">
                <span :class="[pluginClass.spanClass1]">
                    <members-icon :class="[pluginClass.svgClass]"></members-icon>
                </span>
            </button>
            <!-- contributions  -->
            <button type="button" :class="[pluginClass.btnDropClass]" @click="addCycles"
                v-tooltip="$tooltip(pluginClass.btn2.toUpperCase(), 'left')">
                <span :class="[pluginClass.spanClass1]">
                    <money-icon :class="[pluginClass.svgClass]"></money-icon>
                </span>
                <span class="sr-only">Add contributions</span>
            </button>
            <!-- upload ledger  -->
            <button type="button" :class="[pluginClass.btnDropClass, 'shadow-md']" @click="addLedger"
                v-tooltip="$tooltip(pluginClass.btn3.toUpperCase(), 'left')">
                <span :class="[pluginClass.spanClass1]">
                    <calendar-icon :class="[pluginClass.svgClass]"></calendar-icon>
                </span>
                <span class="sr-only">Upload ledger</span>
            </button>
            <!-- download  ledger -->
            <a type="button" :class="[pluginClass.btnDropClass]" @click="downloadLedger"
                v-tooltip="$tooltip(pluginClass.btn4.toUpperCase() , 'left')">
                <span :class="[pluginClass.spanClass1]">
                    <downtray-icon :class="[pluginClass.svgClass]"></downtray-icon>
                </span>
                <span class="sr-only">Download Ledger</span>
            </a>
        </div>
    </div>

    <!-- add member modal  -->
    <membersadd :show=formClass.isOpen @close=closeMembers @loading=flashLoading @flash=flashShow @hide=flashHide @timed=flashTimed @view=flashShowView @reload=refresh></membersadd>
    <!-- end add member modal  -->

    <!-- add cycle modal  -->
    <cyclesaddModal :show=formClass.isPaysOpen @close=closeCycle @loading=flashLoading @flash=flashShow @hide=flashHide @timed=flashTimed @view=flashShowView @reload=refresh></cyclesaddModal>
    <!-- end add cycle modal  -->

    <!-- add ledger modal  -->
    <ledgersaddModal :show=formClass.isLedgersOpen @close=closeLedger @loading=flashLoading @flash=flashShow
        @hide=flashHide @timed=flashTimed @view=flashShowView @allhide=flashAllHide @reload=refresh></ledgersaddModal>
    <!-- end add ledger modal  -->

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
</template>

<script setup>
    import { defineProps, reactive, onBeforeMount, onMounted, nextTick, ref, onUnmounted, computed, defineExpose}  from 'vue'

    // props 
    const props = defineProps({
        user: {
            type: Object,
            required: true,
        },
        done: {
            type: Boolean,
            required: true,
        },
    });
    // end props 

    const pluginClass = reactive({
        btn0: 'Shortcuts : Alt + S',
        btn1: 'Add Members : Alt + A',
        btn2: 'Add Monthly Contributions : Alt + M',
        btn3: 'Add Yearly Contributions: Upload a ledger : Alt + L',
        btn4: 'Download Ledger : Alt + D', 

        mainClass: 'flex justify-center items-center w-10 h-10 bg-gray-50 dark:bg-gray-800 dark:hover:bg-cyan-800 border-base border-cyan-800 dark:border-cyan-600 dark:hover:border-gray-900 text-cyan-900 hover:text-gray-900 dark:text-cyan-300 dark:hover:text-gray-900 rounded-xl shadow-md',
        dialClass: 'flex hidden flex-col items-center my-1 gap-2',
        dialClassActive: 'flex flex-col items-center my-1 gap-2',
        dialShow: true,

        spanClass1: 'h-5 w-5',
        btnDropClass: 'flex justify-center items-center w-10 h-10 bg-gray-50 dark:bg-gray-800 border-base border-cyan-800 dark:border-cyan-600 text-cyan-300 hover:text-cyan-500 rounded-xl shadow-md hover:rounded-xl',
        svgClass: 'flex-shrink-0 w-5 h-5 text-cyan-500 transition duration-75 dark:text-cyan-300 group-hover:text-cyan-900 dark:group-hover:text-cyan-300',
        tooltipClass: 'inline-block absolute invisible z-10 py-2 px-3 w-auto text-sm uppercase font-semibold text-cyan-300 hover:text-cyan-500 bg-cyan-800 dark:bg-cyan-800 rounded-lg shadow-md opacity-0 transition-opacity duration-300 tooltip border-2 border-cyan-300 dark:border-cyan-300 whitespace-nowrap',
        modalCloseBtn: 'cursor-pointer dark:text-cyan-800 text-cyan-500 transition-transform hover:rotate-180 w-6 h-6 hover:w-10 hover:h-10',

        isLight: false,

        colorActive: 'w-5 h-5',
        colorInactive: 'hidden w-5 h-5',

        lightClass: 'text-cyan-100 bg-cyan-800 hover:bg-cyan-700 rounded-xl text-sm p-2 border-base border-cyan-100 shadow-md',
        darkClass: 'dark:text-cyan-800 dark:hover:text-gray-900 dark:bg-cyan-100 dark:hover:bg-cyan-300 rounded-xl text-sm p-2 border-base dark:border-cyan-900 shadow-md',
        themeMsg: 'Switch Theme',
        theme: ''
    })

    const formClass = reactive({
        // members form info 
        isOpen      : false,

        // cycle form info 
        isPaysOpen      : false,

        // ledgers info
        isLedgersOpen   : false,
    })
    // end data 

    // Reference for the div element
    const dialRef = ref(null);

    const handleClickOutside = (event) => {
        // Check if the click is outside the element
        if (dialRef.value && !dialRef.value.contains(event.target)) {
            closeDial();
        }
    };

    // Add event listener on mount and remove it on unmount
    onMounted(() => {
        document.addEventListener('click', handleClickOutside);
        getInfo()
        setDark()
    })

    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
    })

    // Computed property to handle the dynamic animation classes
    const animationClass = computed(() => {
        return pluginClass.dialShow ? 'animate__fadeInRight' : 'animate__fadeOutLeft';
    });

    onBeforeMount(() => {
        getInfo()
        showDial()
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

    const flashLoading = (info) => {
        flashTimed(info, 'loading', 9999999)
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

    // dial settings 
    function showDial() {
        pluginClass.dialShow = !pluginClass.dialShow;
        if (pluginClass.dialShow == true) {
            pluginClass.dialClass = pluginClass.dialClassActive;
        } else {
            pluginClass.dialClass = pluginClass.dialClass;
        }
    }

    function closeDial() {
        pluginClass.dialShow = false;
    }
    // end dial settings 

    // month cycle modal 
    function addCycles() {
        showDial();
        formClass.isPaysOpen = !formClass.isPaysOpen;
    }

    function closeCycle() {
        formClass.isPaysOpen = false;
    }
    // end month cycle modal 

    // members modal 
    function addMembers() {
        showDial();
        formClass.isOpen = !formClass.isOpen;
    }

    function closeMembers() {
        formClass.isOpen      = false;
    }
    // end members modal 

    // ledgers modal 
    function addLedger() {
        formClass.isLedgersOpen = !formClass.isLedgersOpen;
    }

    function closeLedger() {
        formClass.isLedgersOpen = false;
    }

    function downloadLedger() {
        closeDial();

        let url     = '/download/ledger';
        let header  = `Download Full Ledger!`;
        let button  = `Download Ledger`;
        let message = `Download a full ledger report consisting of all payment cycles this year?`;

        flashShowView(message, 'info', header, url, button, 15000, false);
    }

    async function refresh() {
        try {
            // Await the Axios GET request
            await axios.get('/reload/everything');

        } catch (error) {
            // Show an error flash message if the reload fails
            flashTimed(`Reload failed.`, 'danger', 10000);
        }
    }
    // end ledgers modal

    // Expose showDial so it can be accessed by the parent component
    defineExpose({
        showDial,
        addLedger,
        addMembers,
        addCycles,
        downloadLedger,
        getColor
    });
</script>