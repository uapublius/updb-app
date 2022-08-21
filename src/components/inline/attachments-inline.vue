<template>
  <span
    class="flex-inline align-items-center"
    title="Attachments">
    <icon-paperclip class="me-1" />
    {{ attachments.length }}
  </span>
</template>

<script setup lang="ts">
import { Attachment } from '@/models';

defineProps<{
  attachments: Attachment[];
}>();
</script>
