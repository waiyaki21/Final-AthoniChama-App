<template>
    <div class="flex items-center ml-3 font-boldened">
        <!-- User Info Button -->
        <div class="inline-flex text-gray-900 hover:text-cyan-900 dark:text-gray-100 dark:hover:text-cyan-400">
            <button type="button"
                class="font-boldened px-2 py-1 bg-transparent dark:bg-gray-800 sm:flex hidden text-sm md:text-md hover:underline uppercase font-normal"
                @click="switchDrop">
                <span class="sr-only">Open user menu</span>
                {{ userName }}.
            </button>
            <button type="button" class="bg-transparent dark:bg-gray-800 hidden md:block text-sm uppercase font-normal" @click="switchDrop">
                <user-icon class="w-4 h-4"></user-icon>
            </button>
        </div>

        <!-- Dropdown Menu -->
        <div :class="[classInfo.dropdownActive, 'absolute top-[44px] right-4']" v-if="classInfo.dropdown" @mouseleave="closeDrop">
            <!-- User Info -->
            <div class="px-4 py-3" role="none" v-if="done">
                <Link href="/profile">
                <p class="text-xs text-gray-900 dark:text-white my-1" role="none">
                    {{ userName }}.
                </p>
                <p class="text-xs font-normal text-gray-900 truncate dark:text-gray-300" role="none">
                    {{ userEmail }}.
                </p>
                </Link>
            </div>

            <!-- Dropdown Links -->
            <ul class="py-1 w-full" role="none">
                <li v-if="done">
                    <Link :href="route('Dashboard')" :active="route().current('Dashboard')" :class="[classInfo.linkDrop]"
                        role="menuitem">
                    Dashboard
                    </Link>
                </li>
                <li>
                    <Link href="/settings" :class="[classInfo.linkDrop]" role="menuitem">Settings</Link>
                </li>
                <li v-if="done">
                    <Link href="/profile" :class="[classInfo.linkDrop]" role="menuitem">Profile</Link>
                </li>
                <li>
                    <Link :href="route('logout')" method="post" as="button"
                        :class="[classInfo.linkDrop, 'w-full inline-flex justify-start']" role="menuitem">
                    Sign out
                    </Link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
// import { ref } from 'vue';

// Props
defineProps({
    userName: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean,
        required: true,
    },
    classInfo: {
        type: Object,
        required: true,
    },
});

// Emits
const emit = defineEmits(['dropdown-toggle', 'close']);

// Methods
function switchDrop() {
    emit('dropdown-toggle');
}

function closeDrop() {
    emit('close');
}
</script>
