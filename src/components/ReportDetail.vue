<template>
  <div v-show="report.date" class="p-sm">
    <el-descriptions size="small" :direction="direction" :column="2" border>
      <template #title>
        <a :href="permalink" target="_blank">{{ report.source }} {{ report.source_id }}</a>
      </template>

      <template #extra>
        <button @click="() => $emit('download')" class="m-e-sm">Download Report (CSV)</button>

        <button @click="handleCopyLink" class="m-e-sm">
          <template v-if="copiedLink">Copied</template>
          <template v-else>Copy Link</template>
        </button>

        <button @click="handleCopyText">
          <template v-if="copiedText">Copied</template>
          <template v-else>Copy Text</template>
        </button>
      </template>

      <el-descriptions-item>
        <template #label>
          <div>
            <up-icon-calendar />
            <span class="m-w-xs">Date</span>
          </div>
        </template>
        <template v-if="report.date">
          {{ report.date }}
        </template>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div>
            <up-icon-books />
            <span class="m-w-xs">Source</span>
          </div>
        </template>
        {{ report.source }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div>
            <up-icon-city />
            <span class="m-w-xs">City</span>
          </div>
        </template>
        <template v-if="report.city">
          {{ report.city }}
        </template>
      </el-descriptions-item>

      <el-descriptions-item label="Source ID">
        {{ report.source_id }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div>
            <up-icon-map />
            <span class="m-w-xs">District</span>
          </div>
        </template>
        <template v-if="report.district">
          {{ report.district }}
        </template>
      </el-descriptions-item>

      <el-descriptions-item />

      <el-descriptions-item>
        <template #label>
          <div>
            <up-icon-globe />
            <span class="m-w-xs">Country</span>
          </div>
        </template>
        <template v-if="report.country">
          {{ report.country }}
        </template>
      </el-descriptions-item>

      <el-descriptions-item
        v-if="report.attachments && report.attachments.length"
        label="Attachments"
        class-name="p-w-xxs"
      >
        <template v-for="(attachment, idx) in report.attachments">
          <a
            class="p-w-xs p-e-xs m-e-xs attachment-link d-inline-flex flex-baseline text-center"
            :title="`https://web.archive.org/web/${attachment}`"
            :href="`https://web.archive.org/web/${attachment}`"
            target="_blank"
          >
            <span>
              {{ idx + 1 }}
            </span>
            <up-icon-external-link style="margin-left: 4px; height: 8px" />
          </a>
        </template>
      </el-descriptions-item>

      <el-descriptions-item
        class-name="bg-highlight p-z valign-top"
        label="Report"
        label-align="top"
        :span="2"
      >
        <template #label>
          <div>
            <up-icon-file-alt />
            <span class="m-w-xs">Report</span>
          </div>
        </template>
        <template v-if="report.description">
          <pre class="body-text p-sm">{{ report.description }}</pre>
        </template>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { DateTime } from "luxon";
import { ReportFormatted } from "../types";
import "element-plus/es/components/descriptions/style/css";
import "element-plus/es/components/descriptions-item/style/css";

let isMobile = navigator.userAgent.includes(" Mobile/");

export default defineComponent({
  props: {
    report: {
      type: Object as PropType<ReportFormatted>,
      required: true
    },
    permalink: {
      type: String,
      required: true
    }
  },

  emits: ["download", "copy-text", "copy-link"],

  data() {
    return {
      copiedText: false,
      copiedLink: false
    };
  },

  computed: {
    direction() {
      return isMobile ? "vertical" : "horizontal";
    },

    date() {
      if (!this.row.date) return "–";
      return DateTime.fromISO(this.row.date).toLocaleString(DateTime.DATETIME_SHORT);
    }
  },

  methods: {
    handleCopyLink() {
      this.copiedLink = true;
      this.$emit("copy-link");
      setTimeout(() => {
        this.copiedLink = false;
      }, 2000);
    },

    handleCopyText() {
      this.copiedText = true;
      this.$emit("copy-text");
      setTimeout(() => {
        this.copiedText = false;
      }, 2000);
    }
  }
});
</script>

<style lang="scss" scoped>
pre {
  white-space: pre-line;
  font: inherit;
}

.el-descriptions__label > div {
  display: flex;
  flex-grow: 0;
  flex-shrink: 1;
  align-items: center;
  align-content: center;
  justify-items: center;

  svg {
    height: 12px;
  }
}

.el-descriptions__cell svg {
  fill: rgb(96, 98, 102);
}

.attachment-link {
  &:hover {
    background-color: rgb(236, 238, 240);
  }
}
</style>
