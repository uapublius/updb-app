<template>
  <div class="attachment-inline ms-1">
    <div>
      <div class="flex ms-2">
        <el-select
          v-model="videoFilter"
          clearable
          placeholder="Adjustment"
          class="me-3">
          <el-option value="soft-light" label="Soft light" />
          <el-option value="overlay" label="Overlay" />
          <el-option value="plus-lighter" label="Plus lighter" />
          <el-option value="difference" label="Difference" />
        </el-select>
        <el-slider v-if="videoFilter" v-model="videoFilterAmount" label="Amount" />
      </div>
      <div class="flex video-container">
        <a
          v-if="isImage"
          :title="title"
          :href="archiveUrl"
          target="_blank">
          <img :src="archiveUrl">
        </a>
        <div v-else-if="isVideo">
          <video controls preload="metadata" :src="archiveUrl" />
        </div>
        <div v-if="videoFilter" class="video-filter" :style="{ 'mix-blend-mode': videoFilter, 'background-color': `hsl(0,0%,${videoFilterAmount}%)` }" />
      </div>
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
import { ElIcon, ElSelect, ElOption, ElSlider } from 'element-plus';

let props = defineProps<{
  url: any;
}>();

let archiveUrl = $ref("https://web.archive.org/web/" + props.url);
let videoFilter = $ref("");
let videoFilterAmount = $ref(50);

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
  width: 100%;
  height: auto;
}

.video-container {
  position: relative;
}

.video-filter {
  width: 100%;
  height: 100%;
  background: #eee;
  position: absolute;
  top: 0;
  mix-blend-mode: multiply;
  pointer-events: none;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>