<script setup>
defineProps({
    infoBlocks: Array,
    classInfo: Object,
    numFormat: Function
});
</script>

<template>
    <section :class="[classInfo.infoSection]">
        <section
            :class="['w-full justify-between m-1 p-1 text-left space-x font-boldened grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-1']"
        >
            <a v-for="(item, index) in infoBlocks" :key="index" class="block max-w-sm p-2 bg-transparent">
                <h5 :class="[classInfo.infoHeader, 'text-sm md:text-md']" :title="item.title">
                    <span>{{ item.label }}</span>
                    <info-icon class="flex-shrink-0 inline md:w-4 md:h-4 md:ml-1 w-3 h-3 ml-0.5"></info-icon>
                </h5>
                <p :class="classInfo.subHeader" :title="item.value">
                    <small v-if="item.prefix">{{ item.prefix }}</small>
                    {{ numFormat(item.value) }}
                    <span v-if="item.suffix">{{ item.suffix }}</span>
                </p>
            </a>
        </section>
    </section>
</template>
