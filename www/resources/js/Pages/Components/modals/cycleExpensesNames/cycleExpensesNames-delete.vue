<template>
    <Modal :show=classInfo.isDeleteOpen>
        <section class="p-2 font-boldened">
            <div class="w-full inline-flex justify-between mb-2 p-1">
                <h2 class="font-normal text-2xl text-red-800 dark:text-red-600 leading-tight uppercase underline py-1 w-full">
                    Delete Expense Type: {{ info.name }}
                </h2>

                <button @click="closeDelete" :class="[classInfo.modalCloseBtn]">
                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <section class="flex w-full justify-start my-1">
                <h3 class="font-normal sm:text-sm md:text-md text-red-800 dark:text-red-600 leading-tight uppercase underline py-1 w-full decoration-red-900">
                    Are you sure you want to delete Cycle Expense Type: {{ info.name }}?
                </h3>
            </section>

            <section class="flex w-full justify-start mb-2">
                <h4 class="font-normal text-2xs text-gray-600 dark:text-gray-200 leading-tight uppercase py-1 w-full">
                    (Incase of any accidental deleting of data, contact Waiyaki - 0794967315)
                </h4>
            </section>

            <section class="w-full justify-between space-x-1 grid grid-cols-5 gap-0.5">
                <ActionButton :class="'col-span-4'" buttonClass='submitDanger' @handleClick="deleteInfo" :tooltipText="`Delete Expense Type: ${classInfo.deleteData.name}`" :buttonText="`Delete Expense Type.`">
                    <delete-icon class="w-4 h-4 md:w-5 md:h-5"></delete-icon>
                </ActionButton>

                <ActionButton :class="'col-span-1'" buttonClass='other' @handleClick="closeDelete" :tooltipText="`Close Delete`" :buttonText="`Close.`">
                    <times-icon class="w-4 h-4 md:w-5 md:h-5"></times-icon>
                </ActionButton>
            </section>
        </section>
    </Modal>
</template>

<script setup>
    import { defineProps, reactive, computed, watch, defineEmits, onMounted, onUnmounted, ref } from 'vue'

    const emit = defineEmits(['reload', 'close', 'flash'])

    const props = defineProps({
        info: {
            type: Object,
            required: true,
        },
        show : {
            type: Boolean,
            required:true
        }, 
    });

    const type = computed(() => props.show);

    watch(type, (newValue) => {
        classInfo.isDeleteOpen = props.show;
        showDelete(props.info);
    })

    const closeOnEscape = (e) => {
        if (e.key === 'Escape' && props.show) {
            closeDelete();
        }
    };

    onMounted(() => document.addEventListener('keydown', closeOnEscape));
    onUnmounted(() => document.removeEventListener('keydown', closeOnEscape));

    // classes 
    const classInfo = reactive({
        // delete info 
        isDeleteOpen: false,
        deleteData: {},
        deleteID: '',

        deleteURL: '/delete/cycleExpenseName/',
        deleteCycleURL: '/delete/cycle/cycleExpenseName/',

        modalCloseBtn: 'cursor-pointer dark:text-red-800 text-red-500 transition-transform hover:rotate-180 w-6 h-6 hover:w-8 hover:h-8'
    })

    function showDelete(info) {
        classInfo.deleteData   = info;
        classInfo.deleteID     = info.id;
        classInfo.isDeleteOpen = props.show;
    }

    function closeDelete() {
        classInfo.deleteData   = {};
        classInfo.deleteID     = '';
        emit('close');
        classInfo.isDeleteOpen = props.show;
    }

    const isDeleting = ref(false);

    function deleteInfo() {
        let url = '';
        if (route().current() == 'View Cycle Payments') {
            url  = classInfo.deleteURL + classInfo.deleteID;
        } else {
            url  = classInfo.deleteCycleURL + classInfo.deleteID;
        }
        let name = classInfo.deleteData.name;

        // Prevent function from running if already submitting
        if (isDeleting.value) return;

        isDeleting.value = true; // Set submitting flag to true

        flashShow('Loading Please Wait..', 'loading');

        axios.delete(url)
            .then(({ data }) => {
                closeDelete();

                emit('hide');
                const message = data[0];
                const type = data[1];
                emit('reload');
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
                isDeleting.value = false; // Reset the submitting flag after completion
            });
    }

    // function deleteInfo() {
    //     let url = '';
    //     if (route().current() == 'View Cycle Payments') {
    //         url  = classInfo.deleteURL + classInfo.deleteID;
    //     } else {
    //         url  = classInfo.deleteCycleURL + classInfo.deleteID;
    //     }
    //     let name = classInfo.deleteData.name +' KSH '+ Number(classInfo.deleteData.amount).toLocaleString();

    //     let message = '';
    //     let type = '';

    //     router.delete(url, {
    //         method: 'delete',

    //         onSuccess: () => [
    //             // flashMessage 
    //             message   = 'Expense Type '+ name +' Deleted!',
    //             type      = 'danger',
    //             flashShow(message, type),
    //             emit('reload'),
    //             closeDelete(),
    //         ]
    //     })
    // }

    function flashShow(message, body) {
        emit('flash', message, body)
    }
</script>