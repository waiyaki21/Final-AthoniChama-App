<template>
    <!-- update project modal  -->
    <Modal :show=classInfo.isOpen>
        <section class="p-1">
            <div class="w-full inline-flex justify-between p-1">
                <h2 class="font-boldened text-md md:text-xl text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1 w-full">
                    Edit {{ info.name }} Info.
                </h2>

                <button @click="closeModal" :class="[classInfo.modalCloseBtn]">
                    <svg paymentfill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                        class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="px-0.5 py-1 font-boldened">
                <!-- update project form  -->
                <form @submit.prevent="submitEdit" class="p-2 flex-col grid md:grid-cols-2 grid-cols-1 gap-1">
                    <div class="col-span-1">
                        <InputLabel for="name" value="Project Name" />

                        <TextInput id="name" type="name" v-model="formedit.name" :placeholder="formedit.name" required
                            autofocus />

                        <InputError class="mt-2" :message="formedit.errors.name" />
                    </div>

                    <div class="col-span-1">
                        <InputLabel for="target" value="Project Target" />

                        <TextInput id="target" type="number" v-model="formedit.target" :placeholder="formedit.target"
                            required autofocus />

                        <InputError class="mt-2" :message="formedit.errors.target" />
                    </div>

                    <div class="flex items-center justify-start mt-4 col-span-1 md:col-span-2">
                        <SubmitButton @click="submitEdit(classInfo.modalData.id)" :disabled="formedit.processing"
                            :loading="formedit.processing" :success="formedit.wasSuccessful"
                            :failed="formedit.hasErrors" :editting="formedit.isDirty">
                            Update Project
                        </SubmitButton>
                    </div>
                </form>
                <!-- end update project form  -->
            </div>
        </section>
    </Modal>
    <!-- end update project modal  -->
</template>

<script setup>
    import { useForm } from '@inertiajs/vue3';
    import { defineProps, reactive, computed, watch, defineEmits, onMounted, onUnmounted, ref } from 'vue'

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
        // modals 
        isOpen: false,
        modalData: {},

        // delete info 
        isDeleteOpen: false,
        deleteData: {},
        deleteID: '',

        modalCloseBtn: 'cursor-pointer dark:text-cyan-800 text-cyan-500 transition-transform hover:rotate-180 w-6 h-6 hover:w-8 hover:h-8'
    })

    const formedit = useForm({
        name: '',
        target: '',
    })

    function showModal(info) {
        formFields(info);
        classInfo.modalData = info;
        classInfo.isOpen    = props.show;
    }

    function closeModal() {
        classInfo.modalData          = {};
        formedit.name                = '';
        formedit.target              = '';
        clearFields();
        emit('close');
        classInfo.isOpen             = props.show;
    }

    function clearFields() {
        formedit.name       = '';
        formedit.target     = '';
    }

    function formFields(info) {
        formedit.name   = info.name;
        formedit.target = info.target;
    }

    const isSubmitting = ref(false);

    function submitEdit() {
        // Prevent function from running if already submitting
        if (isSubmitting.value) return;

        isSubmitting.value = true; // Set submitting flag to true

        flashShow('Loading Please Wait..', 'loading');

        axios.put('/update/project/' + classInfo.modalData.id, formedit)
            .then(({ data }) => {
                clearFields();
                closeModal();

                emit('hide');
                const message = `Project ${props.info.name} Updated!`;
                const type = 'update';
                flashShow(message, type);
            })
            .catch(error => {
                let time = 5000;
                const message = error.response?.data.message || 'An error occurred';
                const type = 'danger';

                if (error.response?.data.errors) {
                    const errors = error.response.data.errors;

                    // Iterate over the keys of the errors object
                    Object.keys(errors).forEach(key => {
                        errors[key].forEach(errMsg => {
                            time += 1000; // Increase delay
                            emit('flash', errMsg, 'danger'); // Emit flash message
                        });
                    });
                }

                flashShow(message, type);
            })
            .finally(() => {
                isSubmitting.value = false; // Reset the submitting flag after completion
            });
    }

    function flashShow(message, body) {
        emit('reload')
        emit('flash', message, body)
    }
</script>