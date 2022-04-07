<template>
  <up-layout-child v-if="layoutData" :child="layoutData">
    <!-- UpLayout will create one slot for each pane you define -->
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <!-- @vuese-ignore -->
      <slot :name="name" v-bind="slotData" />
    </template>
  </up-layout-child>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Split from "../vendor/split-grid";
import cloneDeep from "lodash.clonedeep";

export default defineComponent({
  name: "UpLayout",

  props: {
    // The top-level Pane
    layout: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      initialLayout: null,
      layoutData: null
    };
  },

  watch: {
    layout: {
      deep: true,
      handler() {
        this.layoutData = cloneDeep(this.layout);
      }
    },

    layoutData: {
      deep: true,
      handler() {
        this.saveUiState();
      }
    }
  },

  created() {
    this.initialLayout = cloneDeep(this.layout);
    let state = localStorage.getItem("layout");
    state = JSON.parse(state);

    if (!state || typeof state !== "object") {
      this.layoutData = cloneDeep(this.layout);
      this.saveUiState();
    } else {
      this.layoutData = state;
    }

    // @vuese-ignore
    this.$emit("update:layout", this.layoutData);
  },

  async mounted() {
    let rowGutters = [...this.$el.querySelectorAll(".up-gutter-row")].map(gutter => ({
      track: Array.prototype.indexOf.call(gutter.parentNode.children, gutter),
      element: gutter
    }));

    let columnGutters = [...this.$el.querySelectorAll(".up-gutter-column")].map(gutter => ({
      track: Array.prototype.indexOf.call(gutter.parentNode.children, gutter),
      element: gutter
    }));

    // Return the panes before and after this gutter to their default sizes
    for (const gutter of [...this.$el.querySelectorAll(".up-gutter")]) {
      gutter.addEventListener("doubleclick", e => {
        let parent = e.target.parentElement;
        let parentName = parent.dataset.uplayoutName;
        let track = Array.prototype.indexOf.call(e.target.parentNode.children, e.target);
        let leadingIndex = Math.floor(track / 2);
        let trailingIndex = Math.ceil(track / 2);
        let gridTemplate = parent.style.gridTemplateColumns || parent.style.gridTemplateRows;
        let sizes = gridTemplate.split(" ").filter(s => s !== "0px");
        let defaultSizes = this.defaultSizeForTrack(parentName);

        sizes[leadingIndex] = defaultSizes[leadingIndex];
        sizes[trailingIndex] = defaultSizes[trailingIndex];

        if (gutter.classList.contains("up-gutter-row")) {
          parent.style.gridTemplateRows = sizes.join(" 0px ");
        } else {
          parent.style.gridTemplateColumns = sizes.join(" 0px ");
        }

        this.updateLayoutSizes(parentName, this.layoutData, sizes);
        this.$emit("update:layout", this.layoutData);
      });
    }

    let minSizeReducer = (acc, gutter) => {
      let prevPane = gutter.previousElementSibling;

      if (prevPane) {
        let minSize = parseInt(prevPane.dataset.minSize || 0);
        let index = Array.prototype.indexOf.call(prevPane.parentNode.children, prevPane);
        acc[index] = minSize;
      }

      let nextPane = gutter.nextElementSibling;

      if (nextPane) {
        let minSizeNext = parseInt(nextPane.dataset.minSize || 0);
        let indexNext = Array.prototype.indexOf.call(nextPane.parentNode.children, nextPane);

        acc[indexNext] = minSizeNext;
      }

      return acc;
    };

    let columnMinSizes = [...this.$el.querySelectorAll(".up-gutter-column")].reduce(
      minSizeReducer,
      {}
    );
    let rowMinSizes = [...this.$el.querySelectorAll(".up-gutter-row")].reduce(minSizeReducer, {});

    let dragStartCoords = {};

    let onDragStart = (direction, track, element) => {
      let { gridTemplateColumns, gridTemplateRows } = element.parentElement.style;
      let gridTemplate = gridTemplateColumns || gridTemplateRows;
      let sizes = gridTemplate.split(" 0px ");
      let parentName = element.parentElement.dataset.uplayoutName;

      dragStartCoords[parentName] = sizes;

      // Fired when any pane starts dragging
      // @arg direction, track, gutter element
      this.$emit("dragStart", { direction, track, element });
    };

    let onDrag = (direction, track, element, gridTemplateStyle) => {
      addMinimizedMaximizedClasses(direction, track, element);

      // Fired when any pane is dragging
      // @arg direction, track, gutter element, gridTemplateStyle
      this.$emit("drag", {
        direction,
        track,
        element,
        gridTemplateStyle
      });
    };

    let addMinimizedMaximizedClasses = (direction, track, element) => {
      let maximizedClassName = "up-layout-pane-maximized";
      let minimizedClassName = "up-layout-pane-minimized";
      let offsetKey = direction === "column" ? "offsetWidth" : "offsetHeight";
      let parent = element.parentElement;
      let previousPane = element.previousElementSibling;
      let nextPane = element.nextElementSibling;

      if (previousPane && previousPane[offsetKey] === parent[offsetKey]) {
        previousPane.classList.add(maximizedClassName);
      } else if (previousPane.classList.contains(maximizedClassName)) {
        previousPane.classList.remove(maximizedClassName);
      }

      if (previousPane && previousPane[offsetKey] === 0) {
        previousPane.classList.add(minimizedClassName);
      } else if (previousPane.classList.contains(minimizedClassName)) {
        previousPane.classList.remove(minimizedClassName);
      }

      if (nextPane && nextPane[offsetKey] === parent[offsetKey]) {
        nextPane.classList.add(maximizedClassName);
      } else if (nextPane.classList.contains(maximizedClassName)) {
        nextPane.classList.remove(maximizedClassName);
      }

      if (nextPane && nextPane[offsetKey] === 0) {
        nextPane.classList.add(minimizedClassName);
      } else if (nextPane.classList.contains(minimizedClassName)) {
        nextPane.classList.remove(minimizedClassName);
      }
    };

    for (const gutter of rowGutters) {
      addMinimizedMaximizedClasses("row", gutter.track, gutter.element);
    }

    for (const gutter of columnGutters) {
      addMinimizedMaximizedClasses("column", gutter.track, gutter.element);
    }

    let onDragEnd = async (direction, track, element) => {
      // Fired when any pane ends dragging
      // @arg direction, track, gutter element
      this.$emit("dragEnd", { direction, track, element });

      let { gridTemplateColumns, gridTemplateRows } = element.parentElement.style;
      let gridTemplate = gridTemplateColumns || gridTemplateRows;
      let sizes = gridTemplate.split(" 0px ");
      let parentName = element.parentElement.dataset.uplayoutName;
      let pane = this.getPane(parentName, this.layoutData);
      let startCoords = dragStartCoords[parentName];

      for (let idx = 0; idx < pane.panes.length; idx++) {
        const p = pane.panes[idx];
        if (parseFloat(sizes[idx]) < 0.001) {
          this.hidePane(p.name, startCoords[idx]);
        } else {
          this.setPropertyDeep(p.name, this.layoutData.panes, "unhiddenSize", sizes[idx]);
        }

        if (parseFloat(startCoords[idx]) < 0.001) {
          this.showPane(p.name);
        }
      }

      this.updateLayoutSizes(parentName, this.layoutData, sizes);
      this.$emit("update:layout", this.layoutData);
    };

    Split({
      columnGutters,
      rowGutters,
      columnMinSizes,
      rowMinSizes,
      onDragStart,
      onDrag,
      onDragEnd
    });
  },

  methods: {
    showPane(name) {
      this.setPropertyDeep(name, this.layoutData.panes, "hidden", false);
      let paneSize = this.getPaneUnhiddenSize(name, this.layoutData);
      this.setPaneSize(name, paneSize, this.layoutData);
      this.$emit("update:layout", this.layoutData);
      // Fired when pane is shown
      // @arg name
      this.$emit("pane-shown", name);
    },

    hidePane(name, unhiddenSize = this.getPaneSize(name, this.layoutData)) {
      if (parseFloat(unhiddenSize) > 0.001) {
        this.setPropertyDeep(name, this.layoutData.panes, "unhiddenSize", unhiddenSize);
      }
      this.setPropertyDeep(name, this.layoutData.panes, "hidden", true);
      this.setPaneSize(name, 0, this.layoutData);
      this.$emit("update:layout", this.layoutData);
      // Fired when pane is hidden
      // @arg name
      this.$emit("pane-hidden", name);
    },

    loadUiState() {
      let state = localStorage.getItem("layout");
      state = JSON.parse(state);

      // if (!this.$evstore || !this.$evstore.$ui) return;

      if (typeof state === "object") {
        for (const [paneName, paneSizes] of Object.entries(state)) {
          this.updateLayoutSizes(paneName, this.layoutData, paneSizes);
        }
      }
    },

    saveUiState() {
      localStorage.setItem("layout", JSON.stringify(this.layoutData));

      // if (this.$evstore) {
      //   this.$set(this.$evstore.$ui.store, 'layout', this.layoutData);
      // }
    },

    // Keep dom changes in sync with layoutData
    updateLayoutSizes(name, layoutData, sizes, initialSizes) {
      if (layoutData.name === name) {
        layoutData.sizes = sizes;
        return;
      }

      for (let idx = 0; idx < layoutData.panes.length; idx++) {
        let pane = layoutData.panes[idx];
        if (!pane) continue;

        if (pane.name === name) {
          pane.sizes = sizes;
        }

        if (pane.panes) {
          this.updateLayoutSizes(name, pane, sizes, initialSizes);
        }
      }
    },

    defaultSizeForTrack(name, layoutData = this.initialLayout) {
      if (layoutData.name === name) {
        return layoutData.sizes;
      }

      for (let idx = 0; idx < layoutData.panes.length; idx++) {
        let pane = layoutData.panes[idx];
        if (!pane) continue;
        if (pane.name === name) {
          return pane.sizes;
        }
        if (pane.panes) {
          this.defaultSizeForTrack(name, pane);
        }
      }
    },

    getSizesForPanes(layoutData, sizes = {}) {
      sizes[layoutData.name] = layoutData.sizes;

      for (let idx = 0; idx < layoutData.panes.length; idx++) {
        let pane = layoutData.panes[idx];
        if (!pane) continue;
        sizes[pane.name] = pane.sizes;
        if (pane.panes) {
          this.getSizesForPanes(pane, sizes);
        }
      }

      return sizes;
    },

    getPaneUnhiddenSize(name, layoutData) {
      for (let idx = 0; idx < layoutData.panes.length; idx++) {
        let pane = layoutData.panes[idx];
        if (!pane) continue;

        if (pane.name === name) {
          return pane.unhiddenSize;
        }

        if (pane.panes) {
          let res = this.getPaneUnhiddenSize(name, pane);
          if (res) return res;
        }
      }
    },

    setPropertyDeep(name, data, property, value) {
      for (let idx = 0; idx < data.length; idx++) {
        let pane = data[idx];

        if (!pane) continue;

        if (pane.name === name) {
          pane[property] = value;
          // this.$set(pane, property, value);
          return;
        }

        if (pane.panes) {
          this.setPropertyDeep(name, pane.panes, property, value);
        }
      }
    },

    getPane(name, layoutData = this.layoutData) {
      for (let idx = 0; idx < layoutData.panes.length; idx++) {
        let pane = layoutData.panes[idx];
        if (!pane) continue;
        if (pane.name === name) return pane;

        if (pane.panes) {
          let res = this.getPane(name, pane);
          if (res) return res;
        }
      }
    },

    getPaneSize(name, layoutData) {
      for (let idx = 0; idx < layoutData.panes.length; idx++) {
        let pane = layoutData.panes[idx];
        if (!pane) continue;

        if (pane.panes) {
          for (let jdx = 0; jdx < pane.panes.length; jdx++) {
            const innerPane = pane.panes[jdx];
            if (innerPane.name === name) {
              let size = pane.sizes[jdx];
              return size;
            }
          }
        }

        if (pane.panes) {
          let res = this.getPaneSize(name, pane);
          if (res) return res;
        }
      }
    },

    setPaneSize(name, size, layoutData) {
      for (let idx = 0; idx < layoutData.panes.length; idx++) {
        let pane = layoutData.panes[idx];
        if (!pane) continue;

        if (pane.panes) {
          for (let jdx = 0; jdx < pane.panes.length; jdx++) {
            const innerPane = pane.panes[jdx];
            if (innerPane.name === name) {
              pane.sizes[jdx] = size;
              // this.$set(pane.sizes, jdx, size);
            }
          }
        }

        if (pane.panes) {
          this.setPaneSize(name, size, pane);
        }
      }
    }
  }
});
</script>

<style lang="scss" scoped>
@import "../style/utilities.scss";
@import "../style/split-grid.scss";
</style>
