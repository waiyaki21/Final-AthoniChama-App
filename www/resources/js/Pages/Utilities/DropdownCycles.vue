<script setup>
import { computed, onMounted, onUnmounted, defineEmits, ref } from 'vue';

const emit = defineEmits(['selected'])

const props = defineProps({
    align: {
        type: String,
        default: 'right',
    },
    width: {
        type: String,
        default: '72',
    },
    contentClasses: {
        type: String,
        default: 'py-1 bg-white divide-y divide-gray-100 rounded-lg shadow-md dark:bg-gray-800',
    },
    cycle: {
        type: Object,
        required: true
    },
});

const closeOnEscape = (e) => {
    if (open.value && e.key === 'Escape') {
        open.value = false;
    }
};

onMounted(() => document.addEventListener('keydown', closeOnEscape));
onUnmounted(() => document.removeEventListener('keydown', closeOnEscape));

const listClass = computed(() => {
    let x = 'py-1 text-sm text-gray-700 dark:text-gray-200';
    return x;
});

const selectClass = computed(() => {
    let x = 'block p-2 uppercase dark:hover:text-cyan-600 hover:underline text-sm';
    return x;
});

const widthClass = computed(() => {
    return {
        72: 'w-60',
    }[props.width.toString()];
});

const alignmentClasses = computed(() => {
    if (props.align === 'left') {
        return 'origin-top-left left-0';
    } else if (props.align === 'right') {
        return 'origin-top-right right-0';
    } else {
        return 'origin-top';
    }
});

function downloadAll() {
    emit('all', props.cycle);
}

function downloadActive() {
    emit('active', props.cycle);
}

function download() {
    emit('down', props.cycle);
}

const open = ref(false);
</script>

<template>
    <div class="relative my-auto">
        <button
            class="inline-flex items-center p-1 text-xs font-normal text-amber-500 bg-transparent rounded-md hover:text-gray-500 focus:z-10 dark:text-amber-500 dark:hover:text-amber-500 my-auto" @click="open = !open">
            <download-info :class="'md:w-6 md:h-6 w-6 h-6'"></download-info>
        </button>


        <!-- Full Screen Dropdown Overlay -->
        <div v-show="open" class="fixed inset-0 z-40" @click="open = false"></div>

        <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-show="open" class="absolute z-50 mt-2 rounded-md shadow-lg border-2 border-cyan-500"
                :class="[widthClass, alignmentClasses]" style="display: none" @click="open = false">
                <div class="rounded-md ring-1 ring-black ring-opacity-5" :class="contentClasses">
                    <slot name="content" />
                    <ul :class='listClass'>
                        <li>
                            <a @click="download" :class='selectClass'>Download Paid Members Sheet</a>
                        </li>
                        <li>
                            <a @click="downloadActive" :class='selectClass'>Download Active Members Sheet</a>
                        </li>
                        <li>
                            <a @click="downloadAll" :class='selectClass'>Download All Members Sheet</a>
                        </li>
                    </ul>
                </div>
            </div>
        </Transition>
    </div>
</template>
