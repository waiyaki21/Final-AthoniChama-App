<template>
    <Head title="Register" />

    <div class="text-center my-2">
        <a @click="loginWithGoogle" type="button" class="login-with-google-btn inline-flex justify-between w-full text-base bg-white dark:bg-gray-700 hover:bg-slate-100 dark:hover:bg-gray-900 border-base hover:border-gray-900 dark:border-gray-200 text-black dark:text-white hover:shadow-sm dark:hover:shadow-gray-200/30">
            <img alt="Social Welfare and Contributions Management System Google Auth Login" class="w-5 mr-1" src="/img/google.svg"/>
            Sign in with Google
        </a>
        <span class="text-2xs uppercase underline text-black dark:text-gray-300">or</span>
        <hr-line :color="'border-slate-900 dark:border-slate-200'"></hr-line> 
    </div>

    <form @submit.prevent="submit" class="mb-0">
        <div>
            <InputLabel for="name" value="Name" class="uppercase text-base"/>

            <TextInput
                id="name"
                type="text"
                class="mt-1 block w-full"
                v-model="form.name"
                required
                autofocus
                placeholder="Name"
                autocomplete="on"
            />

            <InputError class="mt-1" :message="form.errors.name" />
        </div>

        <div class="mt-2">
            <InputLabel for="email" value="Email" class="uppercase text-base"/>

            <TextInput
                id="email"
                type="email"
                class="mt-1 block w-full"
                v-model="form.email"
                required
                placeholder="Email"
                autocomplete="on"
            />

            <InputError class="mt-1" :message="form.errors.email" />
        </div>

        <div class="mt-2">
            <InputLabel for="password" value="Password" class="uppercase text-base"/>

            <TextInput
                id="password"
                type="password"
                class="mt-1 block w-full"
                v-model="form.password"
                required
                autocomplete="on"
                placeholder="Enter Password"
            />

            <InputError class="mt-1" :message="form.errors.password"/>
        </div>

        <div class="mt-2">
            <InputLabel for="password_confirmation" value="Confirm Password" class="uppercase text-base"/>

            <TextInput
                id="password_confirmation"
                type="password"
                class="mt-1 block w-full"
                v-model="form.password_confirmation"
                required
                autocomplete="new-password"
                placeholder="Confirm Password"
            />

            <InputError class="mt-1" :message="form.errors.password_confirmation" />
        </div>

        <div class="flex items-center justify-end mt-2">
            <a @click="linkCheck" class="underline text-2xs text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500" v-if="props.users == 0"
            >
                Already registered?
            </a>
            <Link href="/login" class="underline text-2xs text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500" v-else
            >
                Already registered?
            </Link>

            <SubmitButton class="ml-2" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                Register
            </SubmitButton>
        </div>
    </form>

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
</template>

<script setup>
    import InputError from '@/Components/FormComponents/InputError.vue';
    import InputLabel from '@/Components/FormComponents/InputLabel.vue';
    import SubmitButton from '@/Components/FormComponents/SubmitButton.vue';
    import TextInput from '@/Components/FormComponents/TextInput.vue';
    import { Head, Link, router, useForm } from '@inertiajs/vue3';

    import GuestLayout from "../Layouts/GuestLayout.vue";
    import { defineProps, ref, nextTick } from "vue";

    const props = defineProps({
        data: Array,
        users: {
            type: String,
            required: true,
        },
    });

    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = () => {
        form.post(route('register'), {
            onFinish: () => form.reset('password', 'password_confirmation'),
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

    function linkCheck() {
        if (props.users == 0) {
            let message = 'No User Accounts Exist, Create one to proceed!';
            let type = 'info';
            flashShow(message, type);
        } else {
            router.get('/login')
        }
    }

    // Reference for toast notification
    const toastNotificationRef = ref(null);

    // Flash message function
    const flashShow = (info, type) => {
        flashHide();
        nextTick(() => {
            if (toastNotificationRef.value) {
                toastNotificationRef.value.toastOn([info, type]);
            }
        })
    }

    const flashLoading = (info) => {
        flashTimed(info, 'loading', 9999999)
    }

    // Method to trigger a timed flash message
    const flashTimed = (message, type, duration) => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.toastOnTime([message, type, duration]);
        }
    }

    const flashShowView = (message, body, header, url, button, duration, linkState) => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.toastClick([message, body, header, url, button, duration, linkState]);
        }
    }

    // Method to hide the loading flash message after a delay
    const flashHide = () => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.loadHide();
        }
    }

    // Method to hide all messages after a delay
    const flashAllHide = () => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.allHide();
        }
    }
</script>