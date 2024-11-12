<template>
    <!-- update member modal  -->
    <Modal :show=classInfo.isOpen>
        <section class="p-1">
            <div class="w-full inline-flex justify-between p-1">
                <h2 class="font-boldened text-md md:text-xl text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1 w-full">
                    Edit {{ classInfo.modalData.name }} Info.
                </h2>

                <button @click="closeModal" :class="[classInfo.modalCloseBtn]">
                    <svg paymentfill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                        class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="px-2 py-1 font-boldened">
                <!-- update member form  -->
                <form @submit.prevent="submitEdit" class="p-2 flex-col">

                    <section class="grid grid-cols-2 gap-1">
                        <div class="w-full col-span-1 md:col-span-2">
                            <InputLabel for="name" value="name" />

                            <TextInput id="name" type="name" v-model="formedit.name"
                                :placeholder="classInfo.modalData.name" required autofocus />

                            <InputError class="mt-0.5" :message="formedit.errors.name" />
                        </div>

                        <div class="w-full col-span-1">
                            <InputLabel for="telephone" value="telephone" />

                            <TextInput id="telephone" type="name" v-model="formedit.telephone"
                                :placeholder="classInfo.modalData.telephone" required autofocus />

                            <InputError class="mt-0.5" :message="formedit.errors.telephone" />
                        </div>

                        <div class="w-full col-span-1">
                            <InputLabel for="amount_before" value="T.Contributions Before" />

                            <TextInput id="amount_before" type="number" v-model="formedit.amount_before"
                                :placeholder="classInfo.modalData.amount_before" required autofocus />

                            <InputError class="mt-0.5" :message="formedit.errors.amount_before" />
                        </div>

                        <div class="w-full col-span-1">
                            <InputLabel for="welfare_before" value="T.Welfare Before" />

                            <TextInput id="welfare_before" type="number" v-model="formedit.welfare_before"
                                :placeholder="formedit.welfare_before" autofocus />

                            <InputError class="mt-0.5" :message="formedit.errors.welfare_before" />
                        </div>

                        <div class="w-full col-span-1">
                            <InputLabel for="welfareowed_before" value="T.Welfare Owed Before" />

                            <TextInput id="welfareowed_before" type="number" v-model="formedit.welfareowed_before"
                                :placeholder="formedit.welfareowed_before" autofocus />

                            <InputError class="mt-0.5" :message="formedit.errors.welfareowed_before" />
                        </div>

                        <div class="w-full col-span-1 md:col-span-2">
                            <InputLabel for="active" value="Member Active" />

                            <select id="active" v-model="formedit.active" name="active"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full">
                                <option v-if="formedit.active" :value="1">
                                    <span>Active</span>
                                </option>
                                <option v-if="formedit.active" :value="0">
                                    <span>Inactive</span>
                                </option>

                                <option v-if="!formedit.active" :value="0">
                                    <span>Inactive</span>
                                </option>
                                <option v-if="!formedit.active" :value="1">
                                    <span>Active</span>
                                </option>
                            </select>
                        </div>

                        <div class=" col-span-2 flex items-center w-full justify-start mt-2">
                            <SubmitButton @click="submitEdit(classInfo.modalData.id)" :disabled="formedit.processing"
                                :loading="formedit.processing" :success="formedit.wasSuccessful"
                                :failed="formedit.hasErrors" :editting="formedit.isDirty">
                                Update Member
                            </SubmitButton>
                        </div>
                    </section>
                </form>
                <!-- end update member form  -->
            </div>
        </section>
    </Modal>
    <!-- end update member modal  -->
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
        telephone: '',
        amount_before: '',
        welfare_before: '',
        welfareowed_before: '',
        active: '',
    })

    function showModal(info) {
        formFields(info);
        classInfo.modalData = info;
        classInfo.isOpen    = props.show;
    }

    function closeModal() {
        classInfo.modalData = {};
        clearFields();
        emit('close');
        classInfo.isOpen = props.show;
    }

    function clearFields() {
        formedit.name           = '';
        formedit.telephone      = '';
        formedit.amount_before  = '';
        formedit.welfare_before = '';
        formedit.active         = '';
    }

    function formFields(info) {
        formedit.name               = info.name;
        formedit.telephone          = info.telephone;
        formedit.amount_before      = info.amount_before;
        formedit.welfare_before     = info.welfare_before;
        formedit.welfareowed_before = info.welfareowed_before;
        formedit.active             = info.active;
    }

    const isSubmitting = ref(false);

    function submitEdit() {
        // Prevent function from running if already submitting
        if (isSubmitting.value) return;

        isSubmitting.value = true; // Set submitting flag to true

        flashShow('Loading Please Wait..', 'loading');

        axios.put('/update/member/' + classInfo.modalData.id, formedit)
            .then(({ data }) => {
                clearFields();
                closeModal();

                emit('hide');
                const message = `Member ${props.info.name} Updated!`;
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