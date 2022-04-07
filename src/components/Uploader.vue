<template>
  <div>
    <!-- <ul>
      <li v-for="file in files">{{ file.name; }} - Error: {{ file.error; }}, Success: {{ file.success; }}</li>
    </ul>
    <vue-upload-component
      ref="upload"
      v-model="files"
      post-action="/post.method"
      put-action="http://s3.us.archive.org/sam-s3-test-08/demo-intro-to-k.pdf"
      @input-file="inputFile"
      @input-filter="inputFilter"
    >Upload file</vue-upload-component>
    <button v-show="!upload || !upload.active" type="button" @click.prevent="upload.active = true">Start upload</button>
    <button v-show="upload && upload.active" type="button" @click.prevent="upload.active = false">Stop upload</button>-->
  </div>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
// import VueUploadComponent, { VueUploadItem } from 'vue-upload-component';

// let files = ref([]);
// let key = "";
// let secret = "";

// let ud: VueUploadItem = null;
// let upload = ref(ud);

// function inputFile(newFile: VueUploadItem, oldFile: VueUploadItem) {
//   if (newFile && oldFile && !newFile.active && oldFile.active) {
//     // Get response data
//     console.log('response', newFile.response);
//     if (newFile.xhr) {
//       //  Get the response status code
//       console.log('status', newFile.xhr.status);
//     }
//   }
// }

// function inputFilter(newFile, oldFile, prevent) {
//   if (newFile && !oldFile) {
//     // Filter non-image file
//     if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
//       return prevent();
//     }
//   }

//   // Create a blob field
//   newFile.blob = '';
//   let URL = window.URL || window.webkitURL;
//   if (URL && URL.createObjectURL) {
//     newFile.blob = URL.createObjectURL(newFile.file);
//   }
// }
</script>
