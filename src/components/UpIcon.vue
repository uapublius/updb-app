<template>
  <div class="up-icon flex flex-center" :class="`up-icon-${name}`">
    <component :is="`up-icon-${name}`" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UpIcon",

  props: {
    // The filename of the icon without the .svg extension
    name: {
      type: String,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped>
svg {
  width: auto;
  height: 100%;
}
</style>
