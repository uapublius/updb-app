<template>
  <span
    class="flex-inline align-items-center"
    title="Attachments">
    <icon-paperclip class="me-1" />
    <span>
      {{ attachments.length }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { Attachment } from '@/models';

defineProps<{
  attachments: Attachment[];
}>();
</script>
