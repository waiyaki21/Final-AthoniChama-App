<script setup>
import { useForm } from '@inertiajs/vue3';
import { nextTick, ref } from 'vue';

const confirmingUserDeletion = ref(false);
const passwordInput = ref(null);

const form = useForm({
    password: '',
});

const confirmUserDeletion = () => {
    confirmingUserDeletion.value = true;

    nextTick(() => passwordInput.value.focus());
};

const deleteUser = () => {
    form.delete(route('profile.destroy'), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value.focus(),
        onFinish: () => form.reset(),
    });
};

const closeModal = () => {
    confirmingUserDeletion.value = false;

    form.reset();
};
</script>

<template>
    <section class="space-y-6">
        <header class="font-boldened my-4">
            <p class="mt-1 text-sm text-rose-600 dark:text-rose-300 w-full inline-flex justify-between">
                <span class="m-2 text-xl md:text-3xl mx-auto uppercase underline font-boldened">Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.</span>
            </p>
        
            <hr-line class="border-rose-800 dark:border-rose-300"></hr-line>

            <button type="button" class="text-white bg-gradient-to-r from-rose-600 to-red-500 hover:bg-gradient-to-l focus:ring-1 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-md px-4 py-2.5 text-center mb-2 uppercase inline-flex justify-between w-full shadow-md my-2" @click="confirmUserDeletion">
                Delete Account
                <delete-icon class="w-6 h-6 ml-4 text-white"></delete-icon>
            </button>

        </header>

        <Modal :show="confirmingUserDeletion" @close="closeModal">
            <div class="px-2 py-4 font-boldened">
                <h2 class="text-2xl uppercase underline mb-2 font-normal text-red-600 dark:text-red-600">
                    Are you sure you want to delete your account?
                </h2>

                <hr-line class="border-red-800 dark:border-red-600"></hr-line>

                <p class="mt-1 text-sm flex-col space-y-2 text-red-600 dark:text-red-600 m-2 gap-2">
                    - Once your account is deleted, all of its resources and data will be permanently deleted. <br> - Please
                    enter your password to confirm you would like to permanently delete your account.
                </p>

                <hr-line class="border-red-800 dark:border-red-600"></hr-line>

                <div class="mt-2">
                    <InputLabel for="password" value="Password" class="sr-only text-white uppercase hover:underline text-sm"/>

                    <TextInput
                        id="password"
                        ref="passwordInput"
                        v-model="form.password"
                        type="password"
                        class="mt-1 block w-full"
                        placeholder="Password"
                        @keyup.enter="deleteUser"
                    />

                    <InputError :message="form.errors.password" class="mt-2 uppercase text-sm" />
                </div>

                <section class="w-full justify-between space-x-1 grid grid-cols-5 gap-0.5 mt-2">
                    <ActionButton :class="'col-span-4'" buttonClass='submitDanger' @handleClick="deleteUser" :tooltipText="`Delete User Account?`" :buttonText="`Delete Account.`">
                        <delete-icon class="w-4 h-4 md:w-5 md:h-5"></delete-icon>
                    </ActionButton>

                    <ActionButton :class="'col-span-1'" buttonClass='other' @handleClick="closeModal" :tooltipText="`Close Delete`" :buttonText="`Close.`">
                        <times-icon class="w-4 h-4 md:w-5 md:h-5"></times-icon>
                    </ActionButton>
                </section>
            </div>
        </Modal>
    </section>
</template>
