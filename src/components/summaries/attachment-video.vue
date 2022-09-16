<template>
  <div itemscope itemprop="VideoObject" itemtype="https://schema.org/VideoObject">
    <meta itemprop="uploadDate" :content="date">
    <meta itemprop="contentUrl" :content="archiveUrl">
    <meta itemprop="thumbnailUrl" content="https://updb.app/play-icon.png">
    <video
      controls
      preload="metadata"
      :src="archiveUrl" />
    <div v-if="videoFilter" class="video-filter" :style="videoFilterStyle" />

    <div>
      <el-icon :size="16" class="me-1 text-gray-60">
        <Link />
      </el-icon>
      <a :href="archiveUrl" target="_blank">
        <span itemprop="name"><span class="hidden">{{ id }} </span>{{ label }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Link } from '@element-plus/icons-vue';
import { ElIcon } from 'element-plus';

let props = defineProps<{
  id: string;
  url: string;
  date: string;
  label: string;
  videoFilter: string;
  videoFilterAmount: number;
}>();

let archiveUrl = $ref("https://web.archive.org/web/" + props.url);

let videoFilterStyle = $computed(() => {
  return {
    'mix-blend-mode': props.videoFilter,
    'background-color': `hsl(0,0%,${props.videoFilterAmount}%)`
  } as any;
});
</script>
