<template>
    <!-- update cycle modal  -->
    <Modal :show=classInfo.isOpen>
        <section class="p-1 font-boldened">
            <div class="w-full inline-flex justify-between mb-2 p-1">
                <h2 class="font-normal text-2xl text-gray-800 dark:text-gray-100 leading-tight uppercase underline py-1 w-full">
                    Edit Cycle {{ classInfo.modalData.name }}
                </h2>

                <button @click="closeModal" :class="[classInfo.modalCloseBtn]">
                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="p-1 font-boldened">
                <!-- update cycle form  -->
                <form @submit.prevent="submitEdit" class="p-1 flex-col">
                    <section class="grid grid-cols-3 gap-1">
                        <div class="w-full col-span-3">
                            <InputLabel for="name" value="name" />

                            <TextInput id="name" type="name" v-model="formedit.name" :placeholder="formedit.name" required
                                autofocus />

                            <InputError class="mt-2" :message="formedit.errors.name" />
                        </div>

                        <div class="w-full col-span-1">
                            <InputLabel for="date" value="date" />

                            <TextInput id="date" type="text" v-model="formedit.date" :placeholder="formedit.date"
                                @focus="(formedit.date = formedit.date)" required autofocus />

                            <InputError class="mt-2" :message="formedit.errors.date" />
                        </div>

                        <div class="w-full col-span-1">
                            <InputLabel for="amount" value="Amount Per Person" />

                            <TextInput id="amount" type="number" v-model="formedit.amount" :placeholder="formedit.amount"
                                required autofocus />

                            <InputError class="mt-2" :message="formedit.errors.amount" />
                        </div>

                        <div class="w-full col-span-1">
                            <InputLabel for="welfare_amnt" value="Welfare Amount Per Person" />

                            <TextInput id="welfare_amnt" type="number" v-model="formedit.welfare_amnt" required autofocus />

                            <InputError class="mt-2" :message="formedit.errors.welfare_amnt" />
                        </div>

                        <div class="w-full col-span-3 flex items-center justify-start mt-4">
                            <SubmitButton @click="submitEdit(classInfo.modalData.id)" :disabled="formedit.processing"
                                :loading="formedit.processing" :success="formedit.wasSuccessful"
                                :failed="formedit.hasErrors" :editting="formedit.isDirty">
                                Update Cycle
                            </SubmitButton>
                        </div>
                    </section>
                </form>
                <!-- end update cycle form  -->
            </div>
        </section>
    </Modal>
    <!-- end update cycle modal  -->
</template>

<script setup>
    import { useForm } from '@inertiajs/vue3';
    import { defineProps, reactive, computed, watch, defineEmits, onMounted, onUnmounted } from 'vue'

    //moment 
    import moment           from 'moment';

    const emit = defineEmits(['reload', 'close', 'flash'])

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
        date: '',
        amount: '',
        welfare_amnt: ''
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
        formedit.name = '';
        formedit.date = '';
        formedit.amount = '';
        formedit.welfare_amnt = '';
    }

    function formFields(info) {
        formedit.name               = info.name;
        formedit.date               = moment(info.date).format("DD/MM/YYYY");
        formedit.amount             = info.amount;
        formedit.welfare_amnt       = info.welfare_amnt;
    }

    function submitEdit(id) {
        let url         = '/update/cycle/' + id;
        let name        = formedit.name;
        let message     = '';
        let type        = '';

        formedit.put(url, {
            onFinish: () => [
                clearFields(),
            ],

            onSuccess: () => [
                message = name + ': Payment Cycle Editted!',
                type = 'update',
                flashShow(message, type),
                closeModal(),
                // emit('reload')
            ],

            onError: () => [
                message = 'Failed! Try Again',
                type = 'danger',
                flashShow(message, type),
            ]
        });
    }

    function flashShow(message, body) {
        emit('reload')
        emit('flash', message, body)
    }
</script>