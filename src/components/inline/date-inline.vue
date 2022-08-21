<template>
  <span>
    {{ formatted }}
  </span>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';

let props = defineProps<{
  date: any;
  format?: string;
}>();

let formatted = $computed(() => {
  if (!props.date) return "–";

  let formatted;

  if (typeof props.date === 'object') {
    formatted = DateTime.fromJSDate(props.date);
  }
  else if (typeof props.date === 'number') {
    formatted = DateTime.fromMillis(props.date);
  }
  else if (typeof props.date === 'string') {
    formatted = DateTime.fromISO(props.date);
  }
  else {
    formatted = props.date;
  }

  let format = props.format ? DateTime[props.format] : DateTime.DATETIME_SHORT;

  return formatted.toLocaleString(format);
});
</script>
