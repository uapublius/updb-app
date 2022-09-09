<template>
  <el-main class="px-4">
    <el-row :gutter="20">
      <el-col :md="16">
        <el-card
          shadow="never"
          class="ms-3">
          <div class="ms-3">
            <h1 class="bg-highlight-vivid text-larger py-1">
              UPDB is an open database of unexplained phenomena (UFO/UAP) reports.
            </h1>
          </div>

          <div class="ms-3">
            Data previously buried away in <strong>disparate documents, dead websites, spreadsheets and PDFs</strong>
            can now be viewed
            together in a <strong>unified format</strong>.
          </div>

          <div class="ms-4">
            <ul>
              <li>• UPDB does not contain any exclusive, private, or classified data</li>
              <li>• UPDB does not vouch for the accuracy or truthfulness of any reports</li>
              <li>
                • The only criterion for a report to be included in UPDB is that it's been listed in a
                public UAP/UFO database
              </li>
            </ul>
          </div>

          <div itemscope itemtype="https://schema.org/WebSite">
            <meta itemprop="url" content="https://updb.app/">
            <form
              itemprop="potentialAction"
              itemscope
              itemtype="https://schema.org/SearchAction"
              action="/reports/search"
              method="get">
              <meta itemprop="target" content="https://updb.app/reports/search?keyword={keyword}">
              <input
                class="me-1"
                itemprop="query-input"
                type="text"
                name="keyword"
                required>
              <input type="submit" value="Search UFO Reports">
            </form>
          </div>
        </el-card>

        <el-card
          shadow="never"
          header="Newsletter"
          class="ms-3">
          <newsletter />
        </el-card>

        <el-card
          shadow="never"
          header="Goals"
          class="ms-3">
          <ul>
            <li>
              • Enable <a
                href="https://mrcloudsclass.com/attachments/article/9/3%20Types%20of%20Investigations.pdf"
                target="_blank">
                <strong>comparative scientific investigation</strong>
              </a> of unexplained phenomena, by offering open data in a unified format
            </li>
            <li>• <strong>Preserve and honor</strong> the decades of research and data collection on this topic</li>
            <li>• Develop tools and techniques for individuals with ongoing repeated experiences</li>
            <li>
              • Document any potential crimes against the universal human right of individual sovereignty,
              for current and future generations
            </li>
          </ul>
        </el-card>

        <el-card
          shadow="never"
          header="Sources"
          class="ms-3">
          <div>
            <strong>UPDB data comes from the following sources.</strong> Thank you to these organizations and their
            staff for helping to
            build an open and public
            record of unexplained phenomena.
          </div>

          <div
            v-for="source in sourceCounts"
            :key="source.id"
            class="mn-3">
            <div class="text-larger">
              {{ source.name }} ({{ source.count.toLocaleString()
              }})
            </div>
            <div v-html="descriptions[source.id]?.provenance" />
          </div>
        </el-card>

        <el-card
          shadow="never"
          header="Notes"
          class="ms-3">
          <ul class="mn-1">
            <li>
              • Locations & dates are parsed and converted into a common schema before being added to
              the database
            </li>
            <li>• Locations are parsed into: city, district, country, water body, other</li>
            <li>
              • Dates are always assumed to be in the local time of the report location and are stored
              without timezone
            </li>
            <li>
              • Reports without dates, or with unparseable dates, are not included in the database
            </li>
          </ul>
        </el-card>

        <el-card
          shadow="never"
          header="Technical"
          class="ms-3">
          <ul>
            <li>
              • <a
                href="https://github.com/uapublius/updb-scrapers"
                target="_blank">updb-scrapers</a>
              CLI scripts to crawl and download reports from sources
            </li>
            <li>
              • <a
                href="https://github.com/uapublius/updb-importers"
                target="_blank">updb-importers</a>
              Script for reading downloaded/OCRed data, cleaning/parsing, then inserting into the
              database
            </li>
            <li>
              • <a
                href="https://github.com/uapublius/updb-app"
                target="_blank">updb-app</a>
              Vue SSR frontend for website
            </li>
            <li>
              • <a
                href="https://postgrest.org/"
                target="_blank">postgREST</a>
              Serves RESTful API to the app from the databases
            </li>
            <li>
              • OCR for the document database is a <strong>custom ML-backed solution that produces better
                results than industry-standard Tesseract</strong>.
            </li>
            <li>
              • <strong>Multi-language OCR of over 500,000 document pages took ~6 CPU-months</strong> on a 3.2 GHz
              8-Core
              Intel Xeon W (~3 weeks wall time).
            </li>
            <li>
              • Report bodies and document OCR results are indexed using postgresql's FTS capabilities,
              which powers the report & document searches
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :md="8">
        <el-card
          shadow="never"
          header="Contact"
          class="ms-3">
          <client-only>
            Publius &lt;<a href="mailto:uapublius@protonmail.com">uapublius@protonmail.com</a>&gt;
          </client-only>

          <figure class="mn-4 ms-2">
            <div class="inline-block text-center">
              <a
                href="https://twitter.com/uapublius"
                target="_blank">
                <img src="../assets/publius.jpg">
              </a>
              <figcaption class="mn-1">&nbsp;&nbsp;Publius Valerius Poplicola (died 503 BC)</figcaption>
            </div>
          </figure>
        </el-card>

        <el-card
          shadow="never"
          header="Links"
          class="ms-3">
          <a
            class="flex-inline align-items-center"
            target="_blank"
            title="Download source code for UPDB app and data processing tools"
            href="https://github.com/uapublius?tab=repositories&q=&type=source&language=&sort=">
            <icon-github />
            <span class="mw-1">GitHub</span>
          </a>
          <br>
          <a
            class="flex-inline align-items-center"
            target="_blank"
            href="https://twitter.com/uapublius">
            <icon-twitter />
            <span class="mw-1">Twitter</span>
          </a>
        </el-card>

        <el-card
          shadow="never"
          header="Dedications"
          class="ms-3">
          <ul>
            <li title="Computer scientist, go figure.">• Jacques Vallée</li>
            <li title="For the awesome bumper music.">• George Knapp</li>
            <li title="And his cute dog.">• Garry Nolan</li>
            <li title="For the Tom DeLonge impression.">• Ross Coulthart</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script setup lang="ts">
import axios from "axios";
import {
 ElMain, ElCard, ElRow, ElCol
} from 'element-plus';
import { watch } from "vue";
import { useRoute } from "vue-router";
import { usePageMeta } from "@/composables/usePageMeta";

const API_REPORTS = import.meta.env.VITE_API_REPORTS;

let { setPageMeta } = usePageMeta();
let route = useRoute();

let phenomainon =
  'Downloaded from <a href="https://www.phenomainon.com/data" target="_blank">phenomAInon</a> on 2022-05-08, case details parsed by Publius.';

let descriptions = $ref({
  1: { provenance: "Scraped and parsed by Publius from mufoncms.com." },
  2: { provenance: "Scraped and parsed by Publius from nuforc.org." },
  3: {
    provenance: `List imported from
          <a target="_blank" href="https://www.nicap.org/NSID/NSID_DBListingbyDate.pdf">
            https://www.nicap.org/NSID/NSID_DBListingbyDate.pdf
          </a>. Individual case details parsed from nicap.org mirror scraped by Publius.`
  },
  4: { provenance: "Scraped and parsed by Publius from Internet Archive mirror of ufodna.com." },
  5: { provenance: phenomainon },
  6: { provenance: phenomainon },
  7: { provenance: phenomainon },
  8: { provenance: phenomainon },
  9: { provenance: phenomainon },
  10: { provenance: phenomainon },
  11: { provenance: phenomainon },
  12: { provenance: phenomainon }
});

let sourceCounts = $ref([]);

try {
  let { data } = await axios.get(API_REPORTS + "/source_view");
  data = data.sort((a, b) => b.count - a.count);
  sourceCounts = data;
}
 catch (error) {
  console.error(error.message);
}

let title = 'Unidentified Phenomena Database | UFO Map, Search Engine, and Database';
let description = 'Search Engine and Map for UFO Sightings, Reports, and Documents – including UAP, tic-tacs, orbs, and other unexplained phenomena.';

setPageMeta(title, description);

watch(route, async () => {
  setPageMeta(title, description);
}, { immediate: true });
</script>
