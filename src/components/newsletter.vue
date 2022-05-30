<template>
  <div class="bg-highlight inline-block">
    <form
      method="post"
      class="p-2 d-inline-block"
      accept-charset="UTF-8"
      action="https://www.aweber.com/scripts/addlead.pl"
    >
      <input type="hidden" name="meta_web_form_id" value="1098544828" />
      <input type="hidden" name="meta_split_id" value="" />
      <input type="hidden" name="listname" value="awlist6264652" />
      <input
        type="hidden"
        name="redirect"
        :value="value"
        id="redirect_edc3ccfecfea81a5b400cf8ea56d6486"
      />
      <input type="hidden" name="meta_adtracking" value="UPDB_Newsletter" />
      <input type="hidden" name="meta_message" value="1001" />
      <input type="hidden" name="meta_required" value="email" />
      <input type="hidden" name="meta_tooltip" value="" />

      <div v-if="hasSignedUp">Newsletter subscription successful.</div>
      <div v-else>
        <div class="ms-2">Subscribe to low-traffic announcements newsletter.</div>

        <input
          placeholder="Email"
          required
          autofocus
          id="awf_field-114058979"
          type="email"
          name="email"
          value=""
        />
        <input name="submit" class="submit mw-1" type="submit" value="Subscribe" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
let value = ref(document.location + "#signedup");
let hasSignedUp = ref(document.location.href.endsWith("#signedup"));
</script>
