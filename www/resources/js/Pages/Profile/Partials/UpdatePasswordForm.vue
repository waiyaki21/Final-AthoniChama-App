<script setup>
import { useForm } from '@inertiajs/vue3';
import { ref, computed, defineEmits } from 'vue';

const emit = defineEmits(['flash']);

const passwordInput = ref(null);
const currentPasswordInput = ref(null);

const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});

// Computed property to check if passwords match
const passwordMatchError = computed(() => {
    if (form.password && form.password_confirmation) {
        let message = '';
        if (form.password === form.password_confirmation) {
           message = 'Passwords Match';
           return message;
        } else {
           message = 'Passwords Do not Match';
           return message;
        }
    }
});

const passwordMatchCheck = computed(() => {
    if (form.password && form.password_confirmation) {
        return form.password === form.password_confirmation
            ? true
            : false;
    }
    return false;
});

const updatePassword = () => {
    form.put(route('password.update'), {
        preserveScroll: true,
        onSuccess: () => form.reset(),
        onError: () => {
            if (form.errors.password) {
                form.reset('password', 'password_confirmation');
                passwordInput.value.focus();
            }
            if (form.errors.current_password) {
                form.reset('current_password');
                currentPasswordInput.value.focus();
            }
        },
    });
};
</script>

<template>
    <section> 
        <header class="font-boldened">
            <h2 class="text-2xl font-medium text-gray-900 dark:text-gray-300 uppercase underline">Update Password</h2>

            <p class="mt-1 text-xs text-gray-600 dark:text-gray-300">
                Ensure your account is using a long, random password to stay secure.
            </p>
        </header>

        <form @submit.prevent="updatePassword" class="my-1 space-y font-boldened grid grid-cols-2 gap-2">
            <div class="col-span-2">
                <InputLabel for="current_password" value="Current Password"/>

                <TextInput
                    id="current_password"
                    ref="currentPasswordInput"
                    v-model="form.current_password"
                    type="password"
                    autocomplete="current-password"
                />

                <InputError :message="form.errors.current_password" class="mt-2" />
            </div>

            <div class="col-span-1">
                <InputLabel for="password" value="New Password"/>

                <TextInput
                    id="password"
                    ref="passwordInput"
                    v-model="form.password"
                    type="password"
                    autocomplete="new-password"
                />

                <InputError :message="form.errors.password" class="mt-2" />
            </div>

            <div class="col-span-1">
                <InputLabel for="password_confirmation" value="Confirm Password"/>

                <TextInput
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    type="password"
                    autocomplete="new-password"
                />

                <InputError :message="passwordMatchCheck ? form.errors.password_confirmation : passwordMatchError" class="mt-2" />
            </div>

            <div class="col-span-2 flex items-center gap-4 my-1">
                <SubmitButton :disabled="form.processing" :loading="form.processing" :success="form.wasSuccessful"
                    :failed="form.hasErrors" :editting="form.isDirty">
                    Update Password.
                </SubmitButton>

                <Transition
                    enter-active-class="transition ease-in-out"
                    enter-from-class="opacity-0"
                    leave-active-class="transition ease-in-out"
                    leave-to-class="opacity-0"
                >
                    <p v-if="form.recentlySuccessful" class="text-sm text-gray-600 dark:text-white">Saved.</p>
                </Transition>
            </div>
        </form>
    </section>
</template>
