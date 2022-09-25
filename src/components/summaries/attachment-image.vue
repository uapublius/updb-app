<template>
  <div itemscope itemprop="ImageObject" itemtype="https://schema.org/ImageObject">
    <meta itemprop="uploadDate" :content="date">
    <meta itemprop="contentUrl" :content="archiveUrl">
    <meta itemprop="thumbnailUrl" :content="archiveUrl">

    <div class="flex align-items-center">
      <a :href="archiveUrl" target="_blank">
        <img :src="archiveUrl">
      </a>

      <div v-if="videoFilter" class="video-filter" :style="videoFilterStyle" />
    </div>

    <div class="hidden" itemprop="description">
      {{ description }}
    </div>

    <div class="hidden" itemprop="name">
      {{ id }} - {{ label }}
    </div>

    <div>
      <el-icon :size="16" class="me-1 text-gray-60">
        <Link />
      </el-icon>
      <a :href="archiveUrl" target="_blank">
        {{ label }}
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
  description: string;
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
