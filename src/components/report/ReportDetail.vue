<template>
  <div class="ps-4">
    <div class="flex report-detail-header justify-content-between align-items-center w-100">
      <div class="flex align-items-center">
        <h2 class="ms-1">
          <a :href="permalink" target="_blank">{{ report.source }} {{ report.source_id }}</a>
        </h2>

        <div class="action-links ms-1 mw-4">
          <a @click="() => $emit('download')" class="action-link me-3">Download (CSV)</a>

          <a @click="handleCopyLink" class="action-link me-3">
            <template v-if="copiedLink">Copied</template>
            <template v-else>Copy Link</template>
          </a>

          <a @click="handleCopyText" class="action-link me-3">
            <template v-if="copiedText">Copied</template>
            <template v-else>Copy Text</template>
          </a>
        </div>
      </div>

      <a class="icon-close" @click="$emit('close')">
        <icon-chevron-down />
      </a>
    </div>

    <div class="report-detail-fields ms-1 w-100">
      <div class="pe-2">
        <DefinitionTable>
          <tr v-if="report.date">
            <td>Date</td>
            <td>
              {{ report.date }}
            </td>
          </tr>

          <!-- <tr v-if="report.date_detail">
            <td>Date Notes</td>
            <td>
              {{ report.date_detail }}
            </td>
          </tr> -->

          <tr>
            <td>Source</td>
            <td>{{ report.source }}</td>
          </tr>

          <tr>
            <td>Source ID</td>
            <td>{{ report.source_id }}</td>
          </tr>

          <tr v-if="report.city">
            <td>City</td>
            <td>
              {{ report.city }}
            </td>
          </tr>

          <tr v-if="report.district">
            <td>
              <div>District</div>
            </td>
            <td>
              {{ report.district }}
            </td>
          </tr>

          <tr v-if="report.country">
            <td>Country</td>
            <td>
              {{ report.country }}
            </td>
          </tr>
        </DefinitionTable>
      </div>

      <div class="pe-2">
        <h6 v-if="report.references" class="ms-1 mn-2">References</h6>

        <ul class="break-all ms-1">
          <li
            class="ms-1"
            v-for="reference in report.references"
            v-html="lf2br(linkify(reference))"
          />
        </ul>

        <h6 v-if="attachments?.length" class="ms-1 mn-2">Attachments</h6>

        <div class="break-all ms-1">
          <li class="ms-1" v-for="attachment in attachments">
            <a
              class="p-e-xs m-e-xs attachment-link"
              :title="attachment"
              :href="attachment"
              target="_blank"
            >
              <span>{{ labelForAttachment(attachment) }}</span>
            </a>
          </li>
        </div>
      </div>
    </div>

    <h6 v-if="report.description" class="ms-2 mn-3">Report</h6>

    <div v-if="report.description" class="bg-highlight inline-block p-1">
      <pre class="p-1" v-html="body"></pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { DateTime } from "luxon";
import { ReportFormatted } from "../../types";
import { isMobile, lf2br, linkify } from "../../lib/util";

export default defineComponent({
  props: {
    report: {
      type: Object as PropType<ReportFormatted>,
      required: true
    },
    permalink: {
      type: String,
      required: true
    },
    attachments: {
      type: Array as PropType<string[]>,
      required: true
    }
  },

  emits: ["download", "copy-text", "copy-link", "close"],

  data() {
    return {
      copiedText: false,
      copiedLink: false
    };
  },

  computed: {
    body() {
      let body = this.report.description?.trim();
      return linkify(body);
    },

    direction() {
      return isMobile ? "vertical" : "horizontal";
    },

    date() {
      if (!this.row.date) return "–";
      return DateTime.fromISO(this.row.date).toLocaleString(DateTime.DATETIME_SHORT);
    }
  },

  methods: {
    linkify,

    lf2br,

    labelForAttachment(attachment: string) {
      let attachmentUrl = new URL(attachment);
      let urlParts = attachmentUrl.pathname.split("/");
      return urlParts[urlParts.length - 1];
    },

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
@import "../../style/_vars.scss";

pre {
  line-height: 1.5;
}

.attachment-link {
  &:hover {
    background-color: rgb(236, 238, 240);
  }
}

.icon-close {
  margin: -0.5em;

  &:hover {
    background-color: $color-gray-95;
  }

  svg {
    fill: $color-gray-60;
    height: 2.3em;
    width: 2.9em;
    padding: 0.3em 0.9em 0em;
  }
}
</style>
