<template>
    <!-- update payment modal  -->
    <Modal :show=classInfo.isOpen>
        <section class="p-1">
            <div class="w-full inline-flex justify-between p-1">
                <h2 class="font-boldened text-md md:text-xl text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1 w-full">
                    Edit {{ props.name }}'s Payment
                </h2>

                <button @click="closeModal" :class="[classInfo.modalCloseBtn]">
                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <h2 class="font-sans inline-flex justify-between text-md text-gray-800 dark:text-gray-300 p-2 w-full">
                <span :class="classInfo.successBadge">
                    CYCLE: <u class="font-boldened font-medium uppercase">{{ classInfo.modalData.cycle.name
                        }}</u>
                </span>
                <span :class="classInfo.infoBadge">
                    PAYMENT: <u class="font-boldened font-medium uppercase"> ksh {{ props.payment
                        }}</u>
                </span>
            </h2>

            <div class="px-2 py-1 font-boldened">
                <!-- update payment form  -->
                <form @submit.prevent="submitEdit" class="">
                    <div>
                        <InputLabel for="payment" value="payment" />

                        <TextInput id="payment" type="number" v-model="formedit.payment" :placeholder="formedit.payment"
                            required autofocus @keydown.enter="submitEdit(classInfo.modalData.id)" />

                        <InputError class="mt-2" :message="formedit.errors.payment" />
                    </div>

                    <div class="flex items-center justify-start mt-2">
                        <SubmitButton @click="submitEdit(classInfo.modalData.id)" :disabled="formedit.processing"
                            :loading="formedit.processing" :success="formedit.wasSuccessful"
                            :failed="formedit.hasErrors" :editting="formedit.isDirty">
                            Update Payment
                        </SubmitButton>
                    </div>
                </form>
                <!-- end update payment form  -->
            </div>
        </section>
    </Modal>
    <!-- end update payment modal  -->
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
        },
        name : {
            type: String,
            required: true
        }, 
        payment: {
            type: String,
            required: true
        }, 
        cycle: {
            type: String,
            required: true
        },  
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

        modalCloseBtn: 'cursor-pointer dark:text-cyan-800 text-cyan-500 transition-transform hover:rotate-180 w-6 h-6 hover:w-8 hover:h-8 m-auto',

        successBadge : 'text-black dark:text-black md:text-md text-sm border dark:border-green-900 border-black bg-green-400 rounded-md shadow-md py-1 px-2 my-auto',
        infoBadge : 'text-black dark:text-black md:text-md text-sm border dark:border-cyan-900 border-black bg-cyan-400 rounded-md shadow-md py-1 px-2 my-auto',
    })

    const formedit = useForm({
        payment: '',
    })

    function showModal(info) {
        formFields(info);
        classInfo.modalData = info;
        classInfo.isOpen    = props.show;
    }

    function closeModal() {
        classInfo.modalData          = {};
        formedit.member_id           = '';
        formedit.payment             = '';
        clearFields();
        emit('close');
        classInfo.isOpen            = props.show;
    }

    function clearFields() {
        formedit.member_id           = '';
        formedit.payment             = '';
    }

    function formFields(info) {
        formedit.member_id = info.member_id;
        formedit.payment   = info.payment;
    }

    const isSubmitting = ref(false);

    function submitEdit() {
        // Prevent function from running if already submitting
        if (isSubmitting.value) return;

        isSubmitting.value = true; // Set submitting flag to true

        flashShow('Loading Please Wait..', 'loading');

        axios.put('/update/payment/' + classInfo.modalData.id, formedit)
            .then(({ data }) => {
                clearFields();
                closeModal();

                emit('hide');
                const message = `${props.name} Contribution Updated!`;
                const type = 'success';
                
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