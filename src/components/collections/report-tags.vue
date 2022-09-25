<template>
  <div>
    <div v-if="tags?.length" class="ms-3">
      <el-tag
        v-for="tag in tags"
        :key="tag"
        class="me-2 ms-2 text-larger"
        closable
        round
        :disable-transitions="false"
        size="large"
        @close="removeTag(tag.toString())">
        {{ tag }}
      </el-tag>
    </div>

    <div v-if="inputVisible">
      <el-select
        ref="select"
        v-model="draftTags"
        multiple
        filterable
        remote
        default-first-option
        allow-create
        :reserve-keyword="false"
        class="block w-100 flex-grow me-1 ms-1"
        placeholder="Search Tags..."
        :remote-method="queryTags">
        <el-option
          v-for="item in autocompleteTags"
          :key="item"
          :label="item"
          :value="item" />
      </el-select>

      <el-button class="me-1 flex-shrink" @click="inputVisible = false">Cancel</el-button>

      <el-button
        class="m-0"
        type="primary"
        :disabled="!draftTags.length"
        @click="saveTags">
        Save
      </el-button>
    </div>

    <el-button
      v-else
      type="info"
      plain
      @click="showInput">
      Add Tags
    </el-button>
  </div>
</template>

<script setup lang="ts">
import {
  ElButton, ElTag, ElSelect, ElOption, ElMessage, ElMessageBox
} from 'element-plus';
import { nextTick } from 'vue';
import { ReportView } from '@/models';
import { useTagsStore } from "@/store/tags";
let tagsStore = useTagsStore();

let props = defineProps<{
  report: ReportView;
}>();

let tagCache = {};
let inputVisible = $ref(false);
let select = $ref<InstanceType<typeof ElSelect>>();
let autocompleteTags = $ref([]);
let draftTags = $ref<string[]>([]);

try {
  await tagsStore.fetchTagsForReport(props.report);
}
catch (error) {
  console.error(error);
}

let tags = $computed(() => {
  return tagsStore.tagReports[props.report.id] || [];
});

async function removeTag(tag: string) {
  ElMessageBox.confirm(
    `Are you sure you want to remove the tag "${tag}" from this report?`,
    'Confirm',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        await tagsStore.removeTagFromReport(tag, props.report);
        ElMessage({ type: 'success', message: 'Tag removed' });
      }
      catch (error) {
        ElMessage({ type: 'error', message: 'Error removing tag' });
      }
    });
}

async function showInput() {
  inputVisible = true;
  await nextTick();
  select?.input?.focus();
}

async function saveTags() {
  try {
    await tagsStore.addTagsToReport(draftTags, props.report);
    let s = draftTags.length > 1 ? 's' : '';
    draftTags = [];
    inputVisible = false;
    ElMessage({ type: 'success', message: `Tag${s} added` });
  }
  catch (error) {
    ElMessage({ type: 'error', message: 'Error adding tag' });
  }
}

async function queryTags(queryString: string) {
  if (queryString?.length < 2) {
    autocompleteTags = [];
    return;
  }

  if (tagCache[queryString]) {
    autocompleteTags = tagCache[queryString];
    return;
  }

  try {
    let tags = await tagsStore.searchTags(queryString, props.report);
    tagCache[queryString] = tags;
    autocompleteTags = tags;
  }
  catch (error) {
    ElMessage({ type: 'error', message: 'Error adding tag' });
  }
}
</script>
