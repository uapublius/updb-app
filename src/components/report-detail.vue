<template>
  <div>
    <div class="flex report-detail-header justify-content-between align-items-center w-100 ps-1">
      <div class="flex align-items-center">
        <h3 class="flex align-items-center">
          <a :href="permalink" target="_blank" title="Open report in new window">
            {{ sourceName }} {{ report.source_id }}
          </a>
        </h3>
        <div class="icon-links flex align-items-center">
          <a
            class="mw-2 flex align-items-end"
            @click="copyLink"
            target="_blank"
            title="Copy permalink"
          >
            <icon-copy v-if="!copiedLink" class="mw-2" />
            <span class="mw-1" v-if="copiedLink">Copied Link</span>
            <div v-if="!copiedLink">Copy</div>
          </a>

          <a
            class="mw-2 flex align-items-start twitter-share-button"
            :href="tweetUrl"
            title="Tweet report"
            target="_blank"
          >
            <icon name="twitter" />
            <div>Tweet</div>
          </a>
        </div>
      </div>

      <slot />
    </div>

    <div class="report-detail-fields ms-1 w-100">
      <div class="pe-2">
        <table class="definition-table">
          <tbody>
            <tr v-if="report.date">
              <td title="Date of event in local time">Date</td>
              <td :title="report.date_detail">
                {{ date }}
              </td>
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
          </tbody>
        </table>
      </div>

      <div class="pe-2">
        <h6 v-if="references?.length" class="ms-1 mn-2">
          References
          <small v-if="sourceName === 'MUFON'">
            MUFON membership is required to view mufoncms.com links
          </small>
        </h6>
        <ul class="break-all ms-1">
          <li
            :title="tooltipForReference(reference)"
            class="ms-1"
            v-for="reference in formattedReferences"
            v-html="reference"
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

<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { DateTime } from "luxon";
import { lf2br, linkify } from "@/lib/util";
import { setupStorage } from "@/lib/attachments";
import { sources } from "@/sources";
import iconCopy from "@/assets/icons/copy.svg";

const props = defineProps<{
  report: Report;
  references: string[];
  attachments: string[];
}>();

defineEmits(["close"]);

let copiedLink = ref(false);

onBeforeMount(() => {
  setupStorage();
});

let formattedReferences = computed(() => {
  return props.references.map(r => lf2br(linkify(r)));
});

let sourceName = computed(() => {
  return sources[props.report.source];
});

let permalink = computed(() => {
  return `https://updb.app/report/${props.report.source}-${props.report.source_id}`;
});

let body = computed(() => {
  let body = props.report.description?.trim();
  return linkify(body);
});

let date = computed(() => {
  if (!props.report.date) return "–";
  return DateTime.fromISO(props.report.date).toLocaleString(DateTime.DATETIME_SHORT);
});

function tooltipForReference(reference) {
  if (reference.includes("https://mufoncms.com")) {
    return "MUFON membership is required to view mufoncms.com links";
  }
}

function labelForAttachment(attachment: string) {
  let attachmentUrl = new URL(attachment);
  let urlParts = attachmentUrl.pathname.split("/");
  return urlParts[urlParts.length - 1];
}

let tweetUrl = computed(() => {
  const myUrlWithParams = new URL("https://twitter.com/intent/tweet");

  myUrlWithParams.searchParams.append("text", document.title);
  myUrlWithParams.searchParams.append("url", window.location.href);
  myUrlWithParams.searchParams.append("hashtags", "UFOTwitter,UPDB");

  return myUrlWithParams.href;
});

async function copyLink() {
  copiedLink.value = true;
  await navigator.clipboard.writeText(permalink.value);
  setTimeout(() => {
    copiedLink.value = false;
  }, 3000);
}
</script>
