<template>
    <!-- <GuestLayout> -->

        <Head title="Log in" />

        <div v-if="status" class="mb-2 font-medium text-sm text-green-600">
            {{ status }}
        </div>

        <div class="text-center my-2">
            <a @click="loginWithGoogle" type="button"
                class="login-with-google-btn inline-flex justify-between w-full text-base bg-white dark:bg-gray-700 hover:bg-slate-100 dark:hover:bg-gray-900 border-base hover:border-gray-900 dark:border-gray-200 text-black dark:text-white hover:shadow-sm dark:hover:shadow-gray-200/30">
                <img alt="Social Welfare and Contributions Management System Google Auth Login" class="w-5 mr-1"
                    src="/img/google.svg" />
                Sign in with Google
            </a>
            <span class="text-2xs uppercase underline text-black dark:text-gray-300">or</span>
            <hr-line :color="'border-slate-900 dark:border-slate-200'"></hr-line>
        </div>

        <form @submit.prevent="submit">
            <div>
                <InputLabel for="email" value="Email" class="uppercase text-sm" />

                <TextInput id="email" type="email" class="mt-1 block w-full" v-model="form.email" required autofocus
                    autocomplete="username" />

                <InputError class="mt-1" :message="form.errors.email" />
            </div>

            <div class="mt-2">
                <InputLabel for="password" value="Password" class="uppercase text-sm" />

                <TextInput id="password" type="password" class="mt-1 block w-full" v-model="form.password" required
                    autocomplete="current-password" />

                <InputError class="mt-1" :message="form.errors.password" />
            </div>

            <div class="block mt-2">
                <label class="flex items-center">
                    <Checkbox name="remember" v-model:checked="form.remember" />
                    <span
                        class="ml-2 my-1 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-200">Remember
                        me</span>
                </label>
            </div>

            <div class="flex items-center justify-end mt-2">
                <Link v-if="canResetPassword" @click="linkCheck" :href="route('password.request')"
                    class="underline text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
                Forgot your password?
                </Link>

                <SubmitButton class="ml-2" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                    Log in
                </SubmitButton>
            </div>
        </form>

        <div class="flex items-center justify-end mt-2">
            <Link :href="'/register'"
                class="underline text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
            Register An Account
            </Link>
        </div>
    <!-- </GuestLayout> -->
</template>

<script setup>
    import Checkbox from '@/Components/Checkbox.vue';
    import InputError from '@/Components/FormComponents/InputError.vue';
    import InputLabel from '@/Components/FormComponents/InputLabel.vue';
    import SubmitButton from '@/Components/FormComponents/SubmitButton.vue';
    import TextInput from '@/Components/FormComponents/TextInput.vue';
    import { Head, Link, useForm } from '@inertiajs/vue3';

    import GuestLayout from "../Layouts/GuestLayout.vue";
    import { reactive, ref } from 'vue';

    const emit = defineEmits(['flash'])

    defineProps({
        canResetPassword: {
            type: Boolean,
        },
        status: {
            type: String,
        },
        users: {
            type: String,
            required: true,
        },
        data: Array
    });

    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = () => {
        form.post(route('login'), {
            onFinish: () => form.reset('password'),
        });
    };

    defineOptions({
        layout: (h, page) => h(GuestLayout, { data: page.props.data }, {
            default: () => page
        }),
    });

    function loginWithGoogle() {
        // Redirect to the Google authentication route
        window.location.href = '/auth/google';
    }
</script>
