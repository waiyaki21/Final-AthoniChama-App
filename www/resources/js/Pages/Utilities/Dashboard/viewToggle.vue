<template>
    <h3 :class="[classInfo.headerMain, show ? classInfo.headerOff : classInfo.headerOn]" @click="toggleInfo"
        preserve-scroll>
        <span>
            <span v-if="show">Showing {{ plural() }}</span>
            <span v-if="!show">View {{ plural() }}</span>
            <span :class="'text-sm ml-2', show ? classInfo.headerOff : classInfo.headerOn">
                ( {{ length }} {{ plural() }} )
            </span>
        </span>

        <button :class="[classInfo.btnMain, show ? classInfo.btnOff : classInfo.btnOn]">
            <down-icon :class="[classInfo.svgMain, show ? classInfo.headerOff : classInfo.headerOn]"
                v-if="!show"></down-icon>
            <up-icon :class="[classInfo.svgMain, show ? classInfo.headerOff : classInfo.headerOn]" v-else></up-icon>
        </button>
    </h3>
</template>

<script setup>
    import { reactive, defineEmits, computed, watch } from 'vue'
    import { pluralCheck } from '../../Globals/flashMessages.js'
    
    const props = defineProps({
        show: {
            type: Boolean,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        length: {
            type: String,
            required: true,
        },
    })

    const classInfo = reactive ({
        // tabs settings 
        viewShow: true,
        headerMain: 'group font-normal md:text-2xl text-xl leading-tight uppercase py-1 w-full inline-flex justify-between my-1.5 cursor-pointer text-cyan-800 dark:text-gray-300',
        svgMain: 'w-3 h-3 md:w-4 md:h-4',
        btnMain: 'cursor-pointer rounded-full p-1 m-0.5 inline-flex justify-center',
        headerOn: 'hover:text-emerald-500 dark:hover:text-emerald-500',
        headerOff: 'hover:text-rose-500 dark:hover:text-rose-500',
        btnOn: 'text-gray-300 group-hover:text-white dark:text-emerald-300 dark:group-hover:text-white bg-transparent dark:bg-transparent dark:group-hover:bg-emerald-700 border-2 border-gray-300 dark:border-emerald-300 dark:group-hover:border-emerald-500',
        btnOff: 'text-gray-300 group-hover:text-white dark:text-rose-300 dark:group-hover:text-white bg-transparent dark:bg-transparent dark:group-hover:bg-rose-700 border-2 border-gray-300 dark:border-rose-300 dark:group-hover:border-rose-500',
    })

    const emit = defineEmits(['toggle'])

    function plural() {
        let info = '';
        info = pluralCheck(props.length, props.title)
        return info;
    }

    function toggleInfo() {
        let message = '';
        let type = '';

        if (props.title === 'Ledger') {
            if (props.show) {
                message = `${plural()} Tab Closed`;
                type = 'times';
            } else {
                message = props.length 
                    ? `Now Showing ${plural()} Tab, ( ${props.length} ${pluralCheck(props.length, 'Cycle')} ) ${plural()} Available for download!`
                    : "No Available Ledgers for download!";
                type = props.length ? 'check' : 'times';
            }
        } else {
            message = props.show ? `${plural()} Tab Closed` : `Now Showing ${plural()} Tab`;
            type = props.show ? 'times' : 'check';
        }

        emit('toggle', message, type);
    }
</script>