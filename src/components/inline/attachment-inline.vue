<template>
  <div class="attachment-inline ms-1">
    <div class="media-container">      
      <attachment-image
        v-if="isImage"
        :id="id"
        :url="url"
        :description="report.description"
        :date="report.date"
        :label="labelForAttachment(url)"
        :video-filter="videoFilter"
        :video-filter-amount="videoFilterAmount"
      />
      <attachment-video
        v-else-if="isVideo"
        :id="id"
        :url="url"
        :description="report.description"
        :date="report.date"
        :label="labelForAttachment(url)"
        :video-filter="videoFilter"
        :video-filter-amount="videoFilterAmount" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { sources } from '@/enums';
import { ReportView } from '@/models';

let props = defineProps<{
  url: any;
  report: ReportView;
  videoFilter: string;
  videoFilterAmount: number;
}>();

let archiveUrl = $ref("https://web.archive.org/web/" + props.url);

let id = $computed(() => {
  return `${sources[props.report.source]}-${props.report.source_id}`;
});

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

.media-container {
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