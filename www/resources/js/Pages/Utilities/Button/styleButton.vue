<template>
    <button :class="[setClass(buttonClass)]" v-tooltip="$tooltip(tooltipText, 'top')" @click="handleClick"
        @mouseenter="spanShow = true" @mouseleave="closeSpan" @focus="spanShow = true" @blur="closeSpan">
        <Transition name="fade">
            <span :class="[spanClass]" v-if="spanShow">
                {{ buttonText }}
            </span>
        </Transition>
        <slot></slot>
    </button>
</template>

<style>
/* 1. declare transition */
.fade-move,
.fade-enter-active,
.fade-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
    animations can be calculated correctly. */
.fade-leave-active {
    position: absolute;
}

.alerts {
    display: block;
    animation: grow 1s backwards;
    width: 0%;
}

@keyframes grow {
    0% {
        width: 0%;
    }

    100% {
        width: 100%;
    }
}
</style>

<script>
export default {
    props: {
        buttonClass: {
            type: String,
            required: true
        },
        tooltipText: {
            type: String,
            required: true
        },
        buttonText: {
            type: String,
            required: true
        },
        handleClick: {
            type: Function,
            required: true
        }
    },

    watch: {
        '$props.buttonClass': 'setClass',
    },

    data() {
        return {
            spanShow: false,
            mainClass: '',

            // button options 
            defaultOptions: 'relative inline-flex rounded-full group items-center justify-between mr-1 overflow-hidden text-sm font-normal uppercase boldened focus:ring-1 focus:outline-none px-2 py-1 h-fit md:h-9 whitespace-nowrap',
            spanClass: 'relative px-2 py-0.5 transition-all ease-in duration-75 rounded-full group-hover:bg-opacity-0',

            // rounded classess 
            btnOptions: 'bg-gradient-to-br from-teal-500 to-emerald-500 group-hover:from-teal-500 group-hover:to-emerald-500 hover:text-gray-700 dark:text-white focus:ring-teal-200 dark:focus:ring-teal-800',
            dangerOptions: 'bg-gradient-to-br from-rose-500 to-red-500 group-hover:from-rose-500 group-hover:to-red-500 hover:text-gray-700 dark:text-white focus:ring-rose-200 dark:focus:ring-rose-800',
            infoOptions: 'bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-gray-700 dark:text-white focus:ring-cyan-200 dark:focus:ring-cyan-800',
            warningOptions: 'bg-gradient-to-br from-amber-500 to-orange-500 group-hover:from-amber-500 group-hover:to-orange-500 hover:text-gray-700 dark:text-white focus:ring-amber-200 dark:focus:ring-amber-800',
            darkOptions: 'bg-gradient-to-br from-purple-500 via-cyan-700 to-teal-800 group-hover:from-purple-500 group-hover:via-cyan-700 group-hover:to-teal-800 hover:text-white dark:text-white focus:ring-purple-200 dark:focus:ring-purple-800',
            pinkOptions: 'bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-pink-200 dark:focus:ring-pink-800 hover:text-white dark:text-white',
            smallInfoOptions: 'bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-gray-700 dark:text-white focus:ring-cyan-200 dark:focus:ring-cyan-800',
            lightOptions: 'bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 focus:ring-gray-100 dark:bg-gray-200 dark:text-black dark:border-gray-800 dark:hover:bg-gray-300 dark:hover:border-gray-900 dark:focus:ring-gray-800',
            otherOptions: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800 hover:text-gray-700 dark:text-white',
            purpleOptions: 'bg-gradient-to-br from-purple-500 via-cyan-700 to-teal-800 group-hover:from-purple-500 group-hover:via-cyan-700 group-hover:to-teal-800 hover:text-white dark:text-white focus:ring-purple-200 dark:focus:ring-purple-800',
            redOptions: 'bg-gradient-to-br from-red-500 to-red-800 group-hover:from-red-500 group-hover:to-red-800 hover:text-gray-100 dark:text-white focus:ring-red-200 dark:focus:ring-red-800',

            rosePlugin: 'dark:text-rose-800 dark:hover:text-gray-900 dark:bg-rose-100 dark:hover:bg-red-300 rounded-full text-sm p-2 border-base dark:border-rose-800 border-rose-900 shadow-md mr-0',

            // rectangular classess
            defaultSubmit: 'w-full uppercase focus:ring focus:outline-none font-normal text-sm px-2 py-1 h-9 text-center inline-flex justify-between rounded-md border-base shadow-md boldened whitespace-nowrap',

            submitOptions: 'text-gray-800 hover:text-gray-700 bg-cyan-300 hover:bg-cyan-400 focus:ring-cyan-500 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800 border-cyan-600 hover:border-cyan-700',
            submitSuccess: 'text-green-800 hover:text-green-700 dark:text-green-100 dark:hover:text-green-200 bg-green-300 hover:bg-green-400 focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 border-green-600 hover:border-green-700',
            submitWarning: 'text-orange-800 dark:text-orange-900 hover:text-orange-700 bg-orange-300 hover:bg-orange-400 focus:ring-orange-500 font-normal dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800 border-orange-600 hover:border-orange-700',
            submitDanger: 'text-red-800 hover:text-red-700 dark:text-red-200 dark:hover:text-red-100 bg-red-300 hover:bg-red-400 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800  border-red-600 hover:border-red-700',
            submitOther:'text-gray-900 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800 hover:text-gray-700 dark:text-white border-purple-600 hover:border-purple-700',
        }
    },

    methods: {
        setClass(info) {
            const optionsMap = {
                'success': { class: this.btnOptions, },
                'info': { class: this.infoOptions, },
                'danger': { class: this.dangerOptions, },
                'warning': { class: this.warningOptions, },
                'light': { class: this.lightOptions, },
                'dark': { class: this.darkOptions, },
                'pink': { class: this.pinkOptions, },
                'other': { class: this.otherOptions, },
                'purple': { class: this.purpleOptions, },
                'submit': { class: this.submitOptions, submit: true },
                'submitSuccess': { class: this.submitSuccess, submit: true },
                'submitWarning': { class: this.submitWarning, submit: true },
                'submitDanger': { class: this.submitDanger, submit: true },
                'submitOther': { class: this.submitOther, submit: true },
                'rosePlugin': { class: this.rosePlugin },
                'red': { class: this.redOptions, },
            };

            const selectedOption = optionsMap[info] || { class: '', submit: false };

            this.mainClass = (selectedOption.submit ? this.defaultSubmit : this.defaultOptions) + ' ' + selectedOption.class;

            return this.mainClass;
        },

        handleClick() {
            this.$emit('handleClick');
        },

        closeSpan() {
            setTimeout(() => {
                this.spanShow = false;
            }, 1000);
        }
    }
};
</script>
