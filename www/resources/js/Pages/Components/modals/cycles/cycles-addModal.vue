<template>
    <!-- update cycle modal  -->
    <Modal :show=classInfo.isOpen>
        <section class="p-2">
            <div class="w-full inline-flex justify-between mb-1">
                <h2
                    class="font-boldened text-2xl text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-2 w-full">
                    Add Monthly Contributions. 
                </h2>

                <button @click="closeModal" :class="[classInfo.modalCloseBtn]">
                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-full h-full">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <maincycle-form :show=props.show :info=props.info @close=closeModal @loading=flashLoading @flash=flashShow @hide=flashHide @timed=flashTimed @view=flashShowView @reload=refresh
            ></maincycle-form>
        </section>
    </Modal>
    <!-- end update cycle modal  -->
</template>

<script setup>
    import { defineProps, reactive, computed, watch, defineEmits, onMounted, onUnmounted } from 'vue'

    import moment                    from 'moment';
    import { router, useForm }       from '@inertiajs/vue3';

    const emit = defineEmits(['reload', 'close', 'view', 'flash', 'timed', 'hide', 'loading', 'allhide']);

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

    onMounted(() => {
        document.addEventListener('keydown', closeOnEscape);
    })

    onUnmounted(() => {
        document.removeEventListener('keydown', closeOnEscape);
    })

    const classInfo = reactive({
        // modals 
        isOpen: false,
        modalData: {},

        modalCloseBtn: 'cursor-pointer dark:text-cyan-800 text-cyan-500 transition-transform hover:rotate-180 w-6 h-6 hover:w-8 hover:h-8',
    })

    // open modal 
    function showModal(info) {
        classInfo.modalData = info;
        classInfo.isOpen    = props.show;
    }

    // close modal 
    function closeModal() {
        classInfo.modalData = {};
        emit('close');
        classInfo.isOpen = props.show;
    }

    function refresh() {
        emit('reload');
    }

    function flashShow(message, body) {
        emit('flash', message, body)
    }

    function flashLoading(message) {
        emit('loading', message)
    }

    function flashHide() {
        emit('hide')
    }

    function flashAllHide() {
        emit('allhide')
    }

    function flashTimed(message, body, duration) {
        emit('timed', message, body, duration)
    }

    function flashShowView(message, body, header, url, button, duration, linkState) {
        emit('view', message, body, header, url, button, duration, linkState);
    }
</script>