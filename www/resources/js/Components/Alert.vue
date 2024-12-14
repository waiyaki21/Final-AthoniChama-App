<script setup>
    import { computed, onMounted, onUnmounted, watch } from 'vue';

    const props = defineProps({
        show: {
            type: Boolean,
            default: false,
        },
        maxWidth: {
            type: String,
            default: 'lg',
        },
        closeable: {
            type: Boolean,
            default: true,
        },
        bg: {
            type: String,
            required: true
        }
    });

    const emit = defineEmits(['close']);

    watch(
        () => props.show,
        () => {
            if (props.show) {
                // document.body.style.overflow = 'hidden';
            } else {
                // document.body.style.overflow = null;
            }
        }
    );

    const close = () => {
        if (props.closeable) {
            emit('close');
        }
    };

    const closeOnEscape = (e) => {
        if (e.key === 'Escape' && props.show) {
            close();
        }
    };

    onMounted(() => document.addEventListener('keydown', closeOnEscape));

    onUnmounted(() => {
        document.removeEventListener('keydown', closeOnEscape);
        // document.body.style.overflow = null;
    });

    const maxWidthClass = computed(() => {
        return {
            sm: 'sm:max-w-sm',
            md: 'sm:max-w-md',
            lg: 'sm:max-w-lg',
            xl: 'sm:max-w-xl',
            '2xl': 'sm:max-w-2xl',
        }[props.maxWidth];
    });
</script>

<script>
    export default {
        data() {
            return {
                info:       '',
                warning:    '',
                danger:     '',
                success:    '',
                class:      '',
            }
        },

        mounted() {
            this.change();
        },

        methods: {
            change() {
                this.class = this.$props.bg;
            }
        }
    }
</script>

<template>
    <!-- <Teleport to="body"> -->
        <Transition leave-active-class="duration-200">
            <div v-show="show" :class="['flex items-center p-4 mb-2 text-base text-gray-800 border-2 border-black rounded-lg dark:text-black dark:border-black absolute max-w-lg z-[49] top-[5rem] right-4 font-boldened', this.class]">
                <Transition enter-active-class="ease-out duration-300"
                    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200"
                    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                    <div v-show="show" class="flex">
                        <slot />
                    </div>
                </Transition>
            </div>
        </Transition>
    <!-- </Teleport> -->
</template>
