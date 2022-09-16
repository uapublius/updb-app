<template>
  <div>
    <div class="dropzone text-gray-40">
      <div class="dz-message my-2">
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>

        <div class="el-upload__text">
          <div class="el-upload__text ms-3">
            Drop files here or <em>click to upload</em>
          </div>

          <ul @click.stop>
            <li>
              Your attachments will be uploaded to the 
              <a href="https://www.archive.org/about" target="_blank">Internet
                Archive</a>, and given a <a :href="license" target="_blank">Creative
                Commons</a> license.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue';
import { Dropzone } from "dropzone";
import { ElIcon } from 'element-plus';
import { onMounted, onUnmounted } from "vue";
import { onBeforeRouteLeave } from 'vue-router';
import "dropzone/dist/dropzone.css";

let props = defineProps<{
  headers: Record<string, string>,
  url: string,
  license: string;
}>();

let emit = defineEmits(['error', 'uploadprogress', 'complete', 'success']);

let dropzone = $ref({} as any);

defineExpose({
  getAcceptedFiles,
  getQueuedFiles,
  processQueue
});

onMounted(() => {
  dropzone = createDropzone();

  dropzone.on("uploadprogress", (...args) => emit("uploadprogress", args));
  dropzone.on("error", (...args) => emit("error", args));
  dropzone.on("complete", (...args) => emit("complete", args));
  dropzone.on("success", (...args) => emit("success", args));

  dropzone.on("success", () => {
    if (dropzone.getQueuedFiles().length) {
      dropzone.processQueue();
    }
  });
});

onUnmounted(() => {
  dropzone?.destroy?.();
});

onBeforeRouteLeave(() => {
  dropzone?.destroy?.();
});

function getAcceptedFiles() {
  return dropzone?.getAcceptedFiles();
}

function getQueuedFiles() {
  return dropzone?.getQueuedFiles();
}

function processQueue() {
  return dropzone?.processQueue();
}

function createDropzone() {
  return new Dropzone(".dropzone", {
    url(files) {
      return `${props.url}/${files?.[0]?.name}`;
    },
    headers: props.headers,
    method: 'PUT',
    parallelUploads: 1,
    maxFilesize: 5000,
    createImageThumbnails: true,
    autoProcessQueue: false,
    addRemoveLinks: true
  });
}

</script>
  
<style>
.dropzone {
  border: 2px dashed hsl(0, 1%, 80%);
}

.dz-message .el-icon--upload {
  font-size: 67px;
  color: hsl(0, 1%, 80%);
  line-height: 50px;
}

.dz-message .el-upload__text em {
  color: var(--el-color-primary);
  font-style: normal;
}

.archive-error error>* {
  display: block;
}
</style>