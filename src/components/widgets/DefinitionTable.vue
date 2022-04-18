<template>
  <table class="definition-table">
    <slot />
  </table>
</template>

<style lang="scss">
@import "../../style/_vars.scss";

table.definition-table {
  width: 100%;
  border-collapse: collapse;
}

.definition-table td {
  padding: 5px 0;
}

.definition-table td:first-child {
  font-weight: 600;
  color: $color-gray-60;
  padding-right: 10px;
  white-space: nowrap;
  width: 1%;
}

.definition-table tr:last-child {
  border-bottom: none;
}
</style>
