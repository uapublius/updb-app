<template>
  <el-header height="auto" class="p-4">
    <div class="flex align-items-center justify-content-between">
      <div>
        <h1 class="ms-2">Report a UFO Sighting</h1>
        <div class="text-large text-bold text-gray-50">
          Anonymously submit a UFO sighting to the <a
            href="https://www.archive.org/about"
            target="_blank">Internet Archive</a>
        </div>
      </div>
      <div>
        <a
          href="https://www.archive.org/about"
          target="_blank"><img src="../assets/internet-archive.svg" style="height:53px; width:auto;" alt="Internet Archive Logo"></a>  
      </div>
    </div>
  </el-header>

  <div class="page-container p-4">
    <el-card v-if="isSubmitted" shadow="never" :header="`Report ${form.id} Submitted`">
      <div class="text-larger">
        Thank you for your report. After processing, it will be available at <a :href="reportUrl">{{ reportUrl }}</a>
      </div>
    </el-card>

    <el-form v-else :model="form" label-position="top">
      <el-card shadow="never" header="" class="ms-3">
        <div class="text-larger text-green flex justify-content-between">
          <span class="text-bold">Draft Report {{ form.id }}</span> <span v-if="autosaved" class="text-gray-50">Autosaved {{ autosaved.toLocaleDateString() }} {{ autosaved.toLocaleTimeString() }}</span>
        </div>
      </el-card>

      <el-card shadow="never" class="ms-3">
        <template #header>
          Date & Time
          <div class="text-small text-gray-50">Enter the approximate date and time the sighting began.</div>
        </template>

        <el-form-item>
          <el-input
            v-model="form.date"
            name="date"
            class="up-input ms-2"
            placeholder="March 15th at 10pm"
            autocomplete="on"
            clearable
            size="large" />
        </el-form-item>

        <div class="text-green text-bold">
          {{ parsedDate }}
        </div>
      </el-card>

      <el-card header="Location" shadow="never" class="ms-3">
        <el-row :gutter="10">
          <el-col :md="3">
            <el-form-item>
              <el-input
                v-model="form.country"
                name="country"
                class="up-input ms-2"
                placeholder="Country"
                autocomplete="on"
                clearable
                maxlength="2"
                size="large" />
            </el-form-item>
          </el-col>

          <el-col :md="6">
            <el-form-item>
              <el-input
                v-model="form.district"
                name="district"
                class="up-input ms-2"
                placeholder="State/Province/District"
                autocomplete="on"
                clearable
                size="large" />
            </el-form-item>
          </el-col>

          <el-col :md="8">
            <el-form-item>
              <el-input
                v-model="form.city"
                name="city"
                class="up-input ms-2"
                placeholder="City"
                autocomplete="on"
                clearable
                size="large" />
            </el-form-item>
          </el-col>

          <el-col :md="7">
            <el-form-item>
              <el-input
                v-model="form.water"
                name="water"
                class="up-input ms-2"
                placeholder="Water Body"
                autocomplete="on"
                clearable
                size="large" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="never" class="ms-3">
        <template #header>
          Description
          <div class="text-small text-gray-50">
            Describe your sighting. Be as detailed as possible.
          </div>
        </template>

        <div class="text-gray-30 text-bold">Tips</div>

        <div class="text-small text-gray-40 ms-3">
          <div>• Include anything out of the ordinary, even if it doesn't seem related to the sighting.</div>
          <div>• Try to include information about how any witnesses reacted.</div>
          <div class="text-bold">• Do not include any personal information (for example, names or addresses).</div>
        </div>
        {{ uploadHeaders }}
        {{ headers }}
        <el-form-item class="ms-2">
          <el-input
            v-model="form.description"
            type="textarea"
            autofocus
            label="Draft will be automatically saved until you submit your report."
            rows="8" />
        </el-form-item>
      </el-card>

      <el-card shadow="never" class="ms-3">
        <template #header>
          Attachments
          <div class="text-small text-gray-50">
            Upload any relevant pictures, videos, diagrams or handwritten notes.
          </div>
        </template>

        <div class="text-gray-30 text-bold">Tips</div>

        <div class="text-small text-gray-40 ms-3">
          <div>• For video, try to record at least 4K quality at 60fps.</div>
          <div>• Try a slow-motion (a.k.a high framerate) video.</div>
          <div>• Use manual focus set to the furthest focus distance (a.k.a infinity).</div>
          <div>• For luminous objects at night, try manually lowering exposure.</div>
        </div>

        <dropzone
          ref="dz"
          :headers="headers"
          :url="url"
          :license="licenseUrl"
          @error="handleDropError"
          @success="handleDropSuccess" />
      </el-card>

      <el-card shadow="never" class="ms-3">
        <el-form-item class="ms-1">
          <el-checkbox v-model="form.agree">
            I understand my report and attachments will be made public on the <a
              href="https://www.archive.org/about"
              target="_blank">Internet Archive</a>.
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            size="large"
            type="primary"
            :loading="uploading"
            :disabled="!form.agree"
            @click="submitReport">
            {{ submitLabel }}
          </el-button>
        </el-form-item>

        <div v-if="dropzoneErrors.length">
          <el-alert
            v-for="dropzoneError in dropzoneErrors"
            :key="dropzoneError"
            type="error"
            class="archive-error mn-3">
            <span v-html="dropzoneError" />
          </el-alert>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import * as chrono from 'chrono-node';
import {
  ElHeader, ElCard, ElButton, ElInput, ElCheckbox, ElForm, ElFormItem, ElRow, ElCol, ElAlert
} from 'element-plus';
import {  onMounted, reactive, watch} from "vue";
import { useRoute } from 'vue-router';
import { usePageMeta } from '@/composables/usePageMeta';
import { generateRandomID } from '@/util';

let { setPageMeta } = usePageMeta();
let route = useRoute();

let licenseUrl = $ref('https://creativecommons.org/licenses/by/4.0/');
let pageTitle = 'Report a UFO';
let pageDescription = 'Report a UFO';

// TODO - Add autocomplete for location fields
// TODO - Add 503 retry logic
// TODO - Logic when 1 upload works & 1 fails

let form = reactive({
  id: '',
  description: '',
  date: '',
  city: '',
  district: '',
  country: '',
  water: '',
  agree: false
});

let uploading = $ref(false);
let dz = $ref(null);
let dropzoneErrors = $ref([]);
let success = $ref({});
let isSubmitted = $ref(false);
let autosaved = $ref(null);
let uploadUrl = $ref('');
let uploadHeaders = $ref({});

let submitLabel = $computed(() => {
  if (uploading) {
    return "Uploading...";
  }
  else {
    return "Submit Report";
  }
});

let parsed = $computed(() => {
  return chrono.parse(form.date.toString());
});

let parsedDate = $computed(() => {
  let thisFrom = parsed?.[0]?.start;
  return thisFrom?.date().toString();
});

let headers = $computed(() => {
  let headers = {
    'x-archive-meta-date': normalizedDate,
    'x-archive-meta-description': form.description ? `uri(${encodeURI(form.description.trim())})` : undefined,
    'x-archive-meta-city': form.city ? `uri(${encodeURI(form.city.trim())})` : undefined,
    'x-archive-meta-district': form.district ? `uri(${encodeURI(form.district.trim())})` : undefined,
    'x-archive-meta-country': form.country ? `uri(${encodeURI(form.country.trim())})` : undefined,
    'x-archive-meta-water': form.water ? `uri(${encodeURI(form.water.trim())})` : undefined,
    'x-archive-meta-subject': 'UFO; UAP; UPDB; UFO-Sighting',
    'x-archive-meta-licenseurl': licenseUrl,
    ...uploadHeaders
  };

  return headers;
});

let url = $computed(() => {
  return `https://${uploadUrl}/${form.id}`;
});

let reportUrl = $computed(() => {
  return `https://archive.org/details/${form.id}`;
});

let normalizedDate = $computed(() => {
  let value = '';

  if (parsed?.length) {
    let thisFrom = parsed[0].start;
    value += `${thisFrom.get("year")}-`;
    value += `${thisFrom.get("month").toString().padStart(2, '0')}-`;
    value += `${thisFrom.get("day").toString().padStart(2, '0')} `;
    value += `${thisFrom.get("hour").toString().padStart(2, '0')}:`;
    value += `${thisFrom.get("minute").toString().padStart(2, '0')}:`;
    value += `00`;
  }

  return value;
});

setPageMeta(pageTitle, pageDescription);
watch(route, () => setPageMeta(pageTitle, pageDescription), { immediate: true });

onMounted(async () => {
  loadDraft();
  autosaved = new Date();
  await setUploadInfo();
});

watch(form, () => {
  localStorage.setItem('draftReport', JSON.stringify(form));
  autosaved = new Date();
});

async function setUploadInfo() {
  let res = await axios.get("https://updb.app/submission_info");
  console.log(res.headers);
  uploadUrl = res.data;
  let headers = {};
  ['ux-archive-auto-make-bucket', 'ux-archive-interactive-priority', 'ux-archive-queue-derive', 'uauthorization'].forEach(h => (headers[h.substring(1)] = res.headers[h]));
  uploadHeaders = headers;
}

function handleDropSuccess([file]) {
  success[file.name] = true;

  if (!dz.getQueuedFiles().length && !dropzoneErrors.length) {
    localStorage.removeItem('draftReport');
    isSubmitted = true;
  }
}

function handleDropError([file, message]) {
  // TODO - If error is 503, set timeout and display message to user
  dropzoneErrors.push(`<strong>${file.name}</strong>${message}`);
  console.error("error", file.name, message);
}

function loadDraft() {
  if (localStorage.getItem('draftReport')) {
    try {
      let draftReport = JSON.parse(localStorage.getItem('draftReport'));
      for (const val of Object.keys(draftReport)) {
        form[val] = draftReport[val];
      }
    }
    catch (error) {
      console.error(error.message);
    }
  }
  else {
    form.id = generateRandomID(8);
  }
}

async function submitWithoutFile() {
  try {
    await axios.put(url, '', { headers });
    localStorage.removeItem('draftReport');
  }
  catch (error) {
    console.error(error);
  }
  finally {
    uploading = false;
  }
}

function submitWithFile() {
  dz.processQueue();
}

async function submitReport() {
  dropzoneErrors = [];
  success = {};
  uploading = true;

  if (!dz.getAcceptedFiles()?.length) {
    await submitWithoutFile();
  }
  else {
    submitWithFile();
  }
}
</script>
