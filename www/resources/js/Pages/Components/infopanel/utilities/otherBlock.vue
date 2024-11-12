<template>
  <a class="block max-w-sm p-2 bg-transparent">
    <h5 :class="[infoHeader]" v-tooltip="$tooltip(tooltipContent, 'top')">
      <span>{{ title }}</span>
      <info-icon class="flex-shrink-0 inline w-3 h-3 ml-0.5"></info-icon> 
    </h5>
    <p :class="[valueClass, 'font-normal text-left md:text-2xl text-xl']" v-tooltip="$tooltip(valueTooltip, 'top')">
      {{ formattedValue }}
    </p>
  </a>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    title: String,
    value: Number,
    tooltipContent: String,
    valueTooltip: String,
    infoHeader: String,
    valueClass: String
  },
  setup(props) {
    const formattedValue = computed(() => {
      return props.value.toLocaleString();
    });

    const tooltipOptions = computed(() => {
      return {
        content: props.tooltipContent.toUpperCase(),
        placement: 'top',
        trigger: 'hover',
        distance: '10',
        skidding: '0',
        popperClass: 'v-popper__theme-main animate__animated animate__fadeIn'
      };
    });

    return {
      formattedValue,
      tooltipOptions
    };
  }
};
</script>
