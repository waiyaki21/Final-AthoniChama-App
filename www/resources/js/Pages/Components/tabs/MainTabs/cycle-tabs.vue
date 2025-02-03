<template>
    <div class="topToggleCycles flex-col space-y-2" id="cycles" role="tabpanel" aria-labelledby="cycles-tab">
        <viewToggle v-if="isDashboard" :title="'Payment Cycle'" :show="classInfo.viewShow"
            :length="props.cycles.length" @toggle="toggleInfo"></viewToggle>

        <section class="grid grid-cols-1 md:grid-cols-4 gap-1" v-if="classInfo.viewShow">
            <!-- forms  -->
            <cycleform :cycles=props.cycles :nextname=props.nextname :date=props.date :settings=props.settings
                :current=props.current></cycleform>
        </section>

        <hr-line :color="classInfo.viewShow ? 'border-rose-500/50' : 'border-emerald-500/50'"></hr-line>
    </div>
</template>

<script setup>
    import { defineProps, reactive, computed, nextTick } from 'vue';
    import { router }  from '@inertiajs/vue3';
    import {flashShow, scrollToToggle } from '../../../Globals/flashMessages'

    const props = defineProps({
        settings: {
            type: Object,
            required: true,
        },
        current: {
            type: Object,
            required: true,
        },
        cycles: {
            type: Array,
            required: true,
        },
        nextname: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        }
    })

    const classInfo = reactive ({
        viewShow: true,
        headerMain: 'font-normal md:text-2xl text-xl text-cyan-800 dark:text-gray-300 leading-tight uppercase py-1 w-full inline-flex justify-between my-1 hover:text-cyan-500 dark:hover:text-cyan-500 cursor-pointer',
        length: '',
    })

    const isDashboard = computed(() => {
        return router.page.props.route === 'Dashboard';
    })

    function toggleInfo(message, type) {
        classInfo.viewShow = !classInfo.viewShow;

        flashShow(message, type)

        nextTick(() => {
            scrollToToggle('.topToggleCycles')
        });
    }
</script>