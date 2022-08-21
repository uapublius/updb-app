<template>
  <div class="inline-block">
    <form
      method="post"
      accept-charset="UTF-8"
      action="https://www.aweber.com/scripts/addlead.pl">
      <input
        type="hidden"
        name="meta_web_form_id"
        value="1098544828">
      <input
        type="hidden"
        name="meta_split_id"
        value="">
      <input
        type="hidden"
        name="listname"
        value="awlist6264652">
      <input
        id="redirect_edc3ccfecfea81a5b400cf8ea56d6486"
        type="hidden"
        name="redirect"
        :value="value">
      <input
        type="hidden"
        name="meta_adtracking"
        value="UPDB_Newsletter">
      <input
        type="hidden"
        name="meta_message"
        value="1001">
      <input
        type="hidden"
        name="meta_required"
        value="email">
      <input
        type="hidden"
        name="meta_tooltip"
        value="">

      <div v-if="hasSignedUp">Newsletter subscription successful.</div>
      <div v-else>
        <div class="ms-2">Subscribe to the low-traffic announcements newsletter.</div>

        <input
          id="awf_field-114058979"
          placeholder="Email"
          required
          autofocus
          type="email"
          name="email"
          value="">
        <input
          name="submit"
          class="submit mw-1"
          type="submit"
          value="Subscribe">
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
let value = $ref("");
let hasSignedUp = $ref(false);

onMounted(() => {
  value = document.location + "#signedup";
  hasSignedUp = document.location.href.endsWith("#signedup");
});
</script>
