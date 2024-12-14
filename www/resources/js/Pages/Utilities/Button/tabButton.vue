<template>
    <button :class="[this.defaultOptions, setClass(buttonClass)]" v-tooltip="$tooltip(tooltipText, 'top')" @click="handleClick">
        <span :class="[spanClass]">
            {{ buttonText }}
        </span>
        <slot></slot>
    </button>
</template>

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
            mainClass: '',

            // button options 
            defaultOptions: 'relative inline-flex rounded-full group items-center justify-between mr-0 overflow-hidden text-sm font-normal uppercase boldened focus:ring-1 focus:outline-none pl-2 pr-1 py-1',
            spanClass: 'relative px-1 py-1 transition-all ease-in duration-75 rounded-full group-hover:bg-opacity-0',

            // rounded classess 
            btnOptions: 'text-gray-900 bg-gradient-to-br from-teal-500 to-emerald-500 group-hover:from-teal-500 group-hover:to-emerald-500 hover:text-gray-700 dark:text-white focus:ring-teal-200 dark:focus:ring-teal-800',
            dangerOptions: 'text-gray-900 bg-gradient-to-br from-rose-500 to-red-500 group-hover:from-rose-500 group-hover:to-red-500 hover:text-gray-700 dark:text-white focus:ring-rose-200 dark:focus:ring-rose-800',
            infoOptions: 'text-gray-900 bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-gray-700 dark:text-white focus:ring-cyan-200 dark:focus:ring-cyan-800',
            warningOptions: 'text-gray-900 bg-gradient-to-br from-amber-500 to-orange-500 group-hover:from-amber-500 group-hover:to-orange-500 hover:text-gray-700 dark:text-white focus:ring-amber-200 dark:focus:ring-amber-800',
            darkOptions: 'text-gray-900 bg-gradient-to-br from-purple-500 via-cyan-700 to-teal-800 group-hover:from-purple-500 group-hover:via-cyan-700 group-hover:to-teal-800 hover:text-white dark:text-white focus:ring-purple-200 dark:focus:ring-purple-800',
            pinkOptions: 'text-gray-900 bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-pink-200 dark:focus:ring-pink-800 hover:text-white dark:text-white',
            smallInfoOptions: 'text-gray-900 bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-gray-700 dark:text-white focus:ring-cyan-200 dark:focus:ring-cyan-800',
            lightOptions: 'text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 focus:ring-gray-100 dark:bg-gray-200 dark:text-black dark:border-gray-800 dark:hover:bg-gray-300 dark:hover:border-gray-900 dark:focus:ring-gray-800',
            otherOptions: 'text-gray-900 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800 hover:text-gray-700 dark:text-white',
            purpleOptions: 'text-gray-900 bg-gradient-to-br from-purple-500 via-cyan-700 to-teal-800 group-hover:from-purple-500 group-hover:via-cyan-700 group-hover:to-teal-800 hover:text-white dark:text-white focus:ring-purple-200 dark:focus:ring-purple-800',
            transparentOptions: 'text-gray-900 bg-white dark:bg-transparent hover:text-black dark:text-white',

            // rectangular classess
            submitOptions: 'w-full uppercase text-gray-800 hover:text-gray-700 bg-cyan-300 hover:bg-cyan-400 focus:ring focus:outline-none focus:ring-cyan-500 font-normal text-xl px-2 py-1 h-12 text-center inline-flex justify-between dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800 uppercase rounded-md border-base hover:border-[2.1px] border-cyan-600 hover:border-cyan-700 shadow-md boldened',
            submitSuccess: 'w-full uppercase text-green-800 hover:text-green-700 dark:text-green-100 dark:hover:text-green-200 bg-green-300 hover:bg-green-400 focus:ring focus:outline-none focus:ring-green-500 font-normal text-xl px-2 py-1 h-12 text-center inline-flex justify-between dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 uppercase rounded-md border-base border-green-600 hover:border-green-700 shadow-md boldened',
            submitWarning: 'w-full uppercase text-orange-800 dark:text-orange-900 hover:text-orange-700 bg-orange-300 hover:bg-orange-400 focus:ring focus:outline-none focus:ring-orange-500 font-normal font-normal text-xl px-2 py-1 h-12 text-center inline-flex justify-between dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800 uppercase rounded-md border-base border-orange-600 hover:border-orange-700 shadow-md boldened',
            submitDanger: 'w-full uppercase text-red-800 hover:text-red-700 dark:text-red-200 dark:hover:text-red-100bg-red-300 hover:bg-red-400 focus:ring focus:outline-none focus:ring-red-500 font-normal text-xl px-2 py-1 h-12 text-center inline-flex justify-between dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 uppercase rounded-md border-base border-red-600 hover:border-red-700 shadow-md boldened',
        }
    },

    methods: {
        setClass(info) {
            // let info = buttonClass;

            switch (true) {
                case (info == 'success'):
                    this.mainClass = this.btnOptions;
                    break;
                case (info == 'info'):
                    this.mainClass = this.infoOptions;
                    break;
                case (info == 'danger'):
                    this.mainClass = this.dangerOptions;
                    break;
                case (info == 'warning'):
                    this.mainClass = this.warningOptions;
                    break;
                case (info == 'light'):
                    this.mainClass = this.lightOptions;
                    break;
                case (info == 'dark'):
                    this.mainClass = this.darkOptions;
                    break;
                case (info == 'pink'):
                    this.mainClass = this.pinkOptions;
                    break;
                case (info == 'other'):
                    this.mainClass = this.otherOptions;
                    break;
                case (info == 'purple'):
                    this.mainClass = this.purpleOptions;
                    break;
                case (info == 'transparent'):
                    this.mainClass = this.transparentOptions;
                    break;
                case (info == 'submit'):
                    this.mainClass = this.submitOptions;
                    break;
                case (info == 'submitSuccess'):
                    this.mainClass = this.submitSuccess;
                    break;
                case (info == 'submitWarning'):
                    this.mainClass = this.submitWarning;
                    break;
                case (info == 'submitDanger'):
                    this.mainClass = this.submitDanger;
                    break;
            }

            return this.mainClass;
        },

        handleClick() {
            this.$emit('handleClick');
        }
    }
};
</script>
