<template>
    <div class="p-2 flex-col space-y-2" id="cycles" role="tabpanel" aria-labelledby="cycles-tab">
        <section class="grid grid-cols-1 md:grid-cols-4">
            <!-- forms  -->
            <cycleform
                :cycles     = props.cycles
                :nextname   = props.nextname
                :date       = props.date
                :settings   = props.settings
                :current    = props.current
            ></cycleform>
        </section>
    </div>
</template>

<script setup>
    import { defineProps } from 'vue';

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
</script>