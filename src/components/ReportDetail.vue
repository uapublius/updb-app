<template>
  <div v-show="report.date" class="p-sm">
    <div class="report-detail-header flex flex-space flex-middle flex-wide">
      <h2 class="m-s-sm">
        <a :href="permalink" target="_blank">{{ report.source }} {{ report.source_id }}</a>
      </h2>

      <div class="m-s-sm">
        <button @click="() => $emit('download')" class="m-e-sm m-s-xxs m-n-xxs">
          Download (CSV)
        </button>

        <button @click="handleCopyLink" class="m-e-sm m-s-xxs m-n-xxs">
          <template v-if="copiedLink">Copied</template>
          <template v-else>Copy Link</template>
        </button>

        <button @click="handleCopyText" class="m-e-sm m-s-xxs m-n-xxs">
          <template v-if="copiedText">Copied</template>
          <template v-else>Copy Text</template>
        </button>
      </div>
    </div>

    <div class="m-s-sm flex flex-wide">
      <div class="p-e-med">
        <DefinitionTable>
          <tr v-if="report.date">
            <td>Date</td>
            <td>
              {{ report.date }}
            </td>
          </tr>

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

          <tr
            v-if="report.attachments && report.attachments.length"
            label="Attachments"
            class-name="p-w-xxs"
          ></tr>
        </DefinitionTable>
      </div>

      <div class="p-e-med">
        <h6 class="m-n-xs m-s-xs">References</h6>

        <ul class="m-s-sm">
          <li
            class="m-s-xs"
            v-for="reference in report.references"
            v-html="lf2br(linkify(reference))"
          />
        </ul>

        <h6 class="m-n-xs m-s-xs">Attachments</h6>

        <div class="m-s-sm">
          <div v-for="(attachment, idx) in report.attachments">
            <a
              class="p-e-xs m-e-xs attachment-link"
              :title="urlForAttachment(attachment)"
              :href="`https://web.archive.org/web/${attachment}`"
              target="_blank"
            >
              <span>{{ nameForAttachment(attachment) }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <h6 class="m-n-sm m-s-xs">Report</h6>

    <div v-if="report.description" class="bg-highlight d-inline-block p-z">
      <pre class="body-text p-sm" v-html="body"></pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { DateTime } from "luxon";
import { ReportFormatted } from "../types";
import { isMobile, lf2br, linkify } from "../lib/util";

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

    nameForAttachment(attachment) {
      let foo = new URL(attachment);
      let fooParts = foo.pathname.split("/");
      return fooParts[fooParts.length - 1];
    },

    urlForAttachment(attachment) {
      let prefixes = ["http://www.nicap.org", "http://www.mufoncms.com"];
      if (prefixes.some(prefix => attachment.startsWith(prefix))) {
        return `https://web.archive.org/web/${attachment}`;
      }

      return attachment;
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
pre {
  line-height: 1.5;
}

.attachment-link {
  &:hover {
    background-color: rgb(236, 238, 240);
  }
}
</style>
