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
        default: '60',
    },
    contentClasses: {
        type: String,
        default: 'py-1 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700',
    },
    name: {
        type: String,
        required: true
    },
    listsyear: {
        type: Array,
        required: true
    },
    listsmonth: {
        type: Array,
        required: true
    },
    downloadsmonth: {
        type: Array,
        required: true
    },
    downloadsyear: {
        type: Array,
        required: true
    }
});

const closeOnEscape = (e) => {
    if (open.value && e.key === 'Escape') {
        open.value = false;
    }
};

onMounted(() => document.addEventListener('keydown', closeOnEscape));
onUnmounted(() => document.removeEventListener('keydown', closeOnEscape));

const listClass = computed(() => {
    let x = 'py-2 text-base text-gray-700 dark:text-gray-200';
    return x;
});

const selectClass = computed(() => {
    let x = 'block px-4 py-2 uppercase dark:hover:text-cyan-600 hover:underline';
    return x;
});

const widthClass = computed(() => {
    return {
        60: 'w-fit',
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

function selected(a) {
    emit('selected',a);
}

const open = ref(false);
</script>

<template>
    <div class="relative">
        <button class="text-white  bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:bg-gradient-to-l focus:ring-1 focus:outline-none focus:ring-blue-300 font-normal rounded-md text-sm p-2 h-auto text-center inline-flex justify-center uppercase dark:focus:ring-blue-800 col-span-1 w-full whitespace-nowrap shadow-md" type="button" @click="open = !open">
            <span class="mr-1 md:hidden">Select </span>
            {{ props.name }} 
            <down-icon class="w-4 h-4 ms-3"></down-icon>
        </button>


        <!-- Full Screen Dropdown Overlay -->
        <div v-show="open" class="fixed inset-0 z-40" @click="open = false"></div>

        <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        > 
            <div
                v-show="open"
                class="absolute z-50 mt-2 rounded-md shadow-lg border-2 border-cyan-500"
                :class="[widthClass, alignmentClasses]"
                style="display: none"
                @click="open = false"
            >
                <div class="rounded-md ring-1 ring-black ring-opacity-5 overflow-y-scroll max-h-[15rem]" :class="contentClasses">
                    <slot name="content" />
                    <ul :class='listClass' v-if="props.listsyear != null">
                        <li v-for="year in props.listsyear">
                            <a @click="selected(year.year)" :class='selectClass'>{{ year.year }}</a>
                        </li>
                    </ul>
                    <ul :class='listClass' v-if="props.listsmonth != null">
                        <li v-for="month in props.listsmonth">
                            <a @click="selected(month.month)" :class='selectClass'>{{ month.month }}</a>
                        </li>
                    </ul>
                    <ul :class='listClass' v-if="props.downloadsmonth != null">
                        <li v-for="(month, index) in props.downloadsmonth">
                            <a :class="selectClass, 'inline-flex justify-between w-full'" :href="'/download/ledger/cycle/'+ month.id">
                                <span class="font-normal justify-between underline inline-flex w-full gap">
                                    {{index + 1}}. {{ month.month }} {{ month.year }} Ledger
                                    <download-icon class="w-2 h-2 md:w-3 md:h-3 mt-1 ml-4 justify-end"></download-icon>
                                </span>
                            </a>
                        </li>
                    </ul>
                    <ul :class='listClass' v-if="props.downloadsyear != null">
                        <li v-for="year in props.downloadsyear">
                            <a :class="selectClass, 'inline-flex justify-between w-full'" :href="'/download/ledger/year/'+ year.year">
                                <span class="font-normal justify-between underline inline-flex w-full gap">
                                    {{ year.year }} Ledger
                                    <download-icon class="w-2 h-2 md:w-3 md:h-3 mt-1 ml-4 justify-end"></download-icon>
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </Transition>
    </div>
</template>
