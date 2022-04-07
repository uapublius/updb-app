<template>
  <div
    :style="childStyle"
    :data-min-size="child.minSize"
    :data-uplayout-name="child.name"
    class="d-grid overflow-hidden h-100 w-100"
    :class="classForChild"
  >
    <div v-if="!child.panes" class="up-layout-pane h-100 w-100 overflow-auto">
      <slot :name="child.name" class="overflow-auto" />
    </div>

    <template v-for="(grandChild, idx) in child.panes" :key="grandChild.name">
      <!-- eslint-disable-next-line -->
      <up-layout-child :child="grandChild">
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </up-layout-child>

      <div
        v-if="child.panes[idx + 1]"
        :key="grandChild.name + 'gutter'"
        :class="gutterClass(grandChild, child.direction)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UpLayoutChild",

  props: {
    child: Object
  },

  computed: {
    classForChild() {
      if (this.child && this.child.name) {
        return `up-pane-${this.child.name}`;
      }

      return "";
    },

    childStyle() {
      if (!this.child.sizes || !this.child.sizes.length || !this.child.direction) {
        return;
      }

      let sizes = [];

      for (let idx = 0; idx < this.child.sizes.length; idx++) {
        const size = this.child.sizes[idx];

        if (this.child.panes[idx].hidden) {
          sizes.push(0);
        } else {
          sizes.push(size);
        }

        sizes.push("0");
      }

      sizes.pop();

      return `grid-template-${this.child.direction}s: ${sizes.join(" ")}`;
    }
  },

  methods: {
    gutterClass(child, direction) {
      let className = `up-gutter up-gutter-${child.name} up-gutter-${direction}`;

      if (child.resizable === false) {
        className += " up-gutter-no-resize";
      }

      return className;
    }
  }
});
</script>

<style lang="scss" scoped>
@import "../style/utilities.scss";
@import "../style/split-grid.scss";
</style>
