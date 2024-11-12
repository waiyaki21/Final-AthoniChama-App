<template>
    <Modal :show=classInfo.isOpen :maxWidth="classInfo.width">
        <section class="p-2 font-boldened">
            <div class="w-full inline-flex justify-between mb-0.5 p-1">
                <h2 class="font-normal text-2xl text-orange-800 dark:text-orange-600 leading-tight uppercase underline py-1 w-full">
                    Switch Active State.
                </h2>

                <button @click="closeModal" :class="[classInfo.modalCloseBtn]">
                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- member status -->
            <section class="font-normal leading-tight uppercase py-0.5 w-full inline-flex justify-between font-boldened my-1">
                <span class="text-gray-800 dark:text-gray-300 md:text-md sm:text-base">MEMBER STATE:</span>

                <span :class="classInfo.successBadge" v-if="classInfo.modalData.active">
                    ACTIVE
                </span>
                <span :class="classInfo.failBadge" v-else>
                    INACTIVE
                </span>
            </section>
            <!-- end member status -->

            <section class="flex w-full justify-start my-1">
                <h3 :class="classInfo.amberBadge">
                    Are you sure you want to switch {{ classInfo.modalData.name }}'s active state?
                </h3>
            </section>

            <section class="w-full justify-between space-x-1 grid grid-cols-5 gap-0.5">
                <ActionButton :class="'col-span-4'" :buttonClass="!classInfo.modalData.active ? 'submitSuccess' : 'submitDanger'" @handleClick="activeInfo" :tooltipText="!classInfo.modalData.active ?  `Switch Active` : `Switch Inactive`" :buttonText="!classInfo.modalData.active ?  `Activate Member` : `Deactivate Member`">
                    <checksolid-icon class="w-5 h-5 md:w-6 md:h-6" v-if="!classInfo.modalData.active"></checksolid-icon>
                    <timessolid-icon class="w-5 h-5 md:w-6 md:h-6" v-else></timessolid-icon>
                </ActionButton>

                <ActionButton :class="'col-span-1'" buttonClass='other' @handleClick="closeDelete" :tooltipText="`Close Delete`" :buttonText="`Close.`">
                    <times-icon class="w-4 h-4 md:w-5 md:h-5"></times-icon>
                </ActionButton>
            </section>
        </section>
    </Modal>
</template>

<script setup>
    import { defineProps, reactive, computed, watch, defineEmits, onMounted, onUnmounted } from 'vue'

    const emit = defineEmits(['reload', 'close', 'flash', 'hide'])

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
        showModal(props.info);
    })

    const closeOnEscape = (e) => {
        if (e.key === 'Escape' && props.show) {
            closeModal();
        }
    };

    onMounted(() => document.addEventListener('keydown', closeOnEscape));
    onUnmounted(() => document.removeEventListener('keydown', closeOnEscape));

    // classes 
    const classInfo = reactive({
        // width 
        width: 'lg',
        // active info 
        isOpen: false,
        modalData: {},
        modalID: '',

        modalURL: '/active/member/',

        modalCloseBtn: 'cursor-pointer dark:text-orange-500 text-orange-500 transition-transform hover:rotate-180 w-6 h-6 hover:w-8 hover:h-8',

        amberBadge : 'text-black dark:text-black md:text-md text-sm border dark:border-orange-900 border-black bg-orange-600 rounded-md shadow-md py-1 px-2 my-auto',
        successBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-green-900 border-black bg-green-400 rounded-md shadow-md py-1 px-2 my-auto',
        infoBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-cyan-900 border-black bg-cyan-400 rounded-md shadow-md py-1 px-2 my-auto',
        failBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-red-900 border-black bg-red-500 rounded-md shadow-md py-1 px-2 my-auto',
    })

    function showModal(info) {
        classInfo.modalData   = info;
        classInfo.modalID     = info.id;
        classInfo.isOpen = props.show;
    }

    function closeModal() {
        classInfo.modalData   = {};
        classInfo.modalID     = '';
        emit('close');
        classInfo.isOpen = props.show;
    }

    function activeInfo() {
        let url  = classInfo.modalURL + classInfo.modalID;
        let name = classInfo.modalData.name;

        axios.get(url)
            .then(
                ({ data }) => {
                    // set info 
                    classInfo.modalData = data;

                    // toast
                    if (classInfo.modalData.active) {
                        let state = name + 'Member Active';
                        let type  = 'success';
                        flashShow(state, type);
                    } else {
                        let state = name + 'Member Anactive';
                        let type  = 'danger';
                        flashShow(state, type);
                    }

                    setTimeout(() => {
                        closeModal();
                    }, 1500);
                });
    }

    function flashShow(message, body) {
        emit('reload')
        emit('flash', message, body)
    }
</script>