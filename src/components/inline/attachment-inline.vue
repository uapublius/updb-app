<template>
  <div class="attachment-inline ms-1">
    <div>
      <a
        v-if="isImage"
        :title="title"
        :href="archiveUrl"
        target="_blank">
        <img :src="archiveUrl">
      </a>
      <video
        v-else-if="isVideo"
        controls
        preload="metadata"
        :src="archiveUrl" />
    </div>
    <div class="flex align-items-start lineheight-1 mn-1 ms-4">
      <el-icon
        :size="16"
        class="me-1 text-gray-60">
        <Link />
      </el-icon>
      <a
        :title="title"
        :href="archiveUrl"
        target="_blank">{{ labelForAttachment(url) }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Link } from '@element-plus/icons-vue';
import { ElIcon } from 'element-plus';

let props = defineProps<{
  url: any;
}>();

let archiveUrl = $ref("https://web.archive.org/web/" + props.url);

let title = $computed(() => {
  let title = `Original: ${props.url}`;
  if (archiveUrl) title += `\n\nMirrored: ${archiveUrl}`;
  return title;
});

let isImage = $computed(() => {
  return ['jpg', 'png', 'jpeg', 'gif', 'webp']
    .some(extension => archiveUrl?.toLowerCase().endsWith(extension));
});

let isVideo = $computed(() => {
  return ['mp4', 'mpv', 'mov', 'webm']
    .some(extension => archiveUrl?.toLowerCase().endsWith(extension));
});

function labelForAttachment(attachment: string) {
  let attachmentUrl = new URL(attachment);
  let urlParts = attachmentUrl.pathname.split("/");
  return urlParts[urlParts.length - 1];
}
</script>

<style>
.attachment-inline video,
.attachment-inline img {
  max-height: 90vh;
}
</style>