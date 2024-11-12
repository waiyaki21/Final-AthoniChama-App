<script setup>
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import GuestLayout from "../Layouts/GuestLayout.vue";

defineProps({
    data: Array
});

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.post(route('register/admin'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};

defineOptions({
    layout: (h, page) => h(GuestLayout, { data: page.props.data }, {
        default: () => page
    }),
});
</script>

<template>
    <!-- <GuestLayout> -->
        <Head title="Admin Register" />

        <section class="font-normal leading-tight uppercase py-1 w-full inline-flex justify-between mb-2 flex-col text-start border-b-[5px] border-gray-500">
            <span class="underline text-[6rem] text-cyan-800 dark:text-teal-900 decoration-teal-700 underline-offset-2 font-boldened">Athoni</span>
            <span class="text-[2rem] text-cyan-800 dark:text-gray-800">Development & Welfare.</span>
            <span class="text-[2rem] text-cyan-800 dark:text-gray-800 mt-2 font-boldened">REGISTER ADMIN PAGE.</span>
        </section>

        <form @submit.prevent="submit">
            <div>
                <InputLabel for="name" value="Name" />

                <TextInput
                    id="name"
                    type="text"
                    class="mt-1 block w-full"
                    v-model="form.name"
                    required
                    autofocus
                    autocomplete="name"
                />

                <InputError class="mt-2" :message="form.errors.name" />
            </div>

            <div class="mt-4">
                <InputLabel for="email" value="Email" />

                <TextInput
                    id="email"
                    type="email"
                    class="mt-1 block w-full"
                    v-model="form.email"
                    required
                    autocomplete="username"
                />

                <InputError class="mt-2" :message="form.errors.email" />
            </div>

            <div class="mt-4">
                <InputLabel for="password" value="Password" />

                <TextInput
                    id="password"
                    type="password"
                    class="mt-1 block w-full"
                    v-model="form.password"
                    required
                    autocomplete="new-password"
                />

                <InputError class="mt-2" :message="form.errors.password" />
            </div>

            <div class="mt-4">
                <InputLabel for="password_confirmation" value="Confirm Password" />

                <TextInput
                    id="password_confirmation"
                    type="password"
                    class="mt-1 block w-full"
                    v-model="form.password_confirmation"
                    required
                    autocomplete="new-password"
                />

                <InputError class="mt-2" :message="form.errors.password_confirmation" />
            </div>

            <div class="flex items-center justify-end mt-4">
                <Link
                    :href="route('login')"
                    class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Already registered?
                </Link>

                <PrimaryButton class="ml-4" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                    Register Admin
                </PrimaryButton>
            </div>
        </form>
    <!-- </GuestLayout> -->
</template>
