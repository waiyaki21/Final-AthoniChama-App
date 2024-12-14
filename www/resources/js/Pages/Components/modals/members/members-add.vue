<template>
        <!-- update member modal  -->
    <Modal :show = classInfo.isOpen :maxWidth="classInfo.width">
        <section class="p-2" ref="modalContentRef">
            <div class="w-full inline-flex justify-between mb-1 p-2">
                <h2 class="font-boldened sm:text-sm md:text-xl text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1 w-full">
                    Add New Members.
                </h2>

                <button @click="closeModal" :class="[classInfo.modalCloseBtn]">
                    <svg paymentfill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- add members tabs  -->
            <mainmembers-form
                @close      = closeModal
                @reload     = refresh
                @flash      = flashShow
                @hide       = flashHide
                @loading    = flashLoading
                @timed      = flashTimed
                @view       = flashShowView
            ></mainmembers-form>

            <hr-line :color="'border-teal-500/50 dark:border-teal-500/50'"></hr-line>
            <!-- end enter members form  -->
        </section>
    </Modal>
    <!-- end update member modal  -->
</template>

<script setup>
    import { defineProps, reactive, computed, watch, defineEmits, onMounted, onUnmounted } from 'vue'

    const emit = defineEmits(['reload', 'close', 'view', 'flash', 'timed', 'hide'])

    const props = defineProps({
        show : {
            type: Boolean,
            required:true
        }
    });

    onMounted(() => {
        document.addEventListener('keydown', closeOnEscape)
    })

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

    // const modalContentRef = ref(null); // Reference to modal content

    // Handle click event on the modal wrapper
    // const handleClickOutside = (event) => {
    //     if (modalContentRef.value && !modalContentRef.value.contains(event.target)) {
    //         closeModal();
    //     }
    // };

    // onMounted(() => {
    //     document.addEventListener('click', handleClickOutside);
    // })

    // onUnmounted(() => {
    //     document.removeEventListener('click', handleClickOutside);
    // })

    onUnmounted(() => document.removeEventListener('keydown', closeOnEscape));

    // classes 
    const classInfo = reactive({
        // width 
        width: '2xl',
        // modals 
        isOpen: false,
        isDupOpen: false,
        modalData: {},

        isLoading: false,

        modalCloseBtn: 'cursor-pointer dark:text-cyan-800 text-cyan-500 transition-transform hover:rotate-180 w-6 h-6 hover:w-8 hover:h-8',

        clicked: false,

        // exist records 
        exist: false,
        members_existing : '',
        members_left     : '',
        members_count    : '',

        modalName: '',
        modalLists: [],
    })

    // Modal show 
    function showModal(info) {
        classInfo.modalData = info;
        classInfo.isOpen    = props.show;
    }

    // Modal Close 
    function closeModal() {
        classInfo.modalData = {};
        emit('close');
        classInfo.isOpen = props.show;
    }

    function refresh() {
        emit('reload');
    }

    // flash messages 
    function flashShow(message, body) {
        emit('flash', message, body)
    }

    function flashLoading(message) {
        classInfo.isLoading      = true;
        emit('timed', message, 'warning', 100000000)
    }

    function flashHide() {
        emit('hide')
    }

    function flashTimed(message, body, duration) {
        emit('timed', message, body, duration)
    }

    function flashShowView(message, body, header, url, button, duration, linkState) {
        emit('view', message, body, header, url, button, duration, linkState);
    }
</script>