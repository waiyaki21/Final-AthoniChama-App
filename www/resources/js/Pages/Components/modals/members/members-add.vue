<template>
        <!-- update member modal  -->
    <Modal :show = classInfo.isOpen :maxWidth="classInfo.width">
        <section class="p-2" ref="modalContentRef">
            <!-- Use the ModalHeader component and pass the header text -->
            <ModalHeader :headerText="'Add New Members.'" @close="closeModal"></ModalHeader>

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

        modalCloseBtn: 'cursor-pointer dark:text-cyan-400 text-cyan-500 transition-transform hover:rotate-180 w-6 h-6 hover:w-6 hover:h-6',

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