<template>
  <div class="p-2 max-width">
    <div class="my-3">
      <strong class="bg-highlight-vivid">
        UPDB is a meta-database of reports & documents about unexplained phenomena.
      </strong>
    </div>

    <div class="ms-3">
      <strong>
        Data previously buried away in disparate documents, spreadsheets, PDFs, and long-dead
        websites can now be viewed together in a unified date & location format.
      </strong>
    </div>

    <div class="ms-3">
      <em>
        <ul>
          <li>UPDB does not contain any exclusive, private, or classified data</li>
          <li>UPDB does not vouch for the accuracy or truthfulness of any reports</li>
          <li>
            The only criterion for a report to be included in UPDB is that it's been listed in a
            public UAP/UFO database
          </li>
        </ul>
      </em>
    </div>

    <h2 class="mn-3 ms-2">Goals</h2>

    <ul class="ms-3">
      <li>
        Shift unexplained phenomena research from a
        <a
          href="https://mrcloudsclass.com/attachments/article/9/3%20Types%20of%20Investigations.pdf"
          target="_blank"
        >
          descriptive to a comparative investigation
        </a>
      </li>
      <li>Preserve and honor the decades of research and data collection on this topic</li>
      <li>Create open data and tools for unexplained phenomena research</li>
      <li>Develop tools and techniques for individuals with ongoing repeated experiences</li>
      <li>
        Document any potential crimes against the universal human right of individual sovereignty,
        for current and future generations
      </li>
    </ul>

    <h2 id="sources" class="mn-3 ms-2">Sources</h2>

    <div>
      Thank you to these organizations and their staff for helping to build an open and public
      record of unexplained phenomena.
    </div>

    <div v-for="source in sourceCounts" class="my-3">
      <div>
        <h4>
          {{ source.name }} (<a :href="hrefForSource(source)" target="_blank">{{ source.count.toLocaleString() }}</a>)
        </h4>
      </div>
      <div v-html="descriptions[source.id]?.provenance" />
    </div>

    <h2 class="mn-3 ms-2">Notes</h2>

    <div class="mn-1 ms-3">
      <div>
        <ul class="mn-1">
          <li>
            Locations & dates are parsed and converted into a common schema before being added to
            the database
          </li>
          <li>Locations are parsed into: city, district, country, water body, other</li>
          <li>
            Dates are always assumed to be in the local time of the report location and are stored
            without timezone
          </li>
          <li>
            Reports without dates, or with unparseable dates, are not included in the database
          </li>
        </ul>
      </div>
    </div>

    <h2 class="mn-3 ms-2">Technical</h2>

    <div class="mn-2 ms-3">
      <div>
        <ul>
          <li>
            <a href="https://github.com/uapublius/updb-scrapers" target="_blank">updb-scrapers</a>
            CLI scripts to crawl and download reports from sources
          </li>
          <li>
            <a href="https://github.com/uapublius/updb-importers" target="_blank">updb-importers</a>
            Script for reading downloaded/OCRed data, cleaning/parsing, then inserting into the
            database
          </li>
          <li>
            <a href="https://github.com/uapublius/updb-app" target="_blank">updb-app</a>
            Vue SSR frontend for website
          </li>
          <li>
            <a href="https://postgrest.org/" target="_blank">postgREST</a>
            Serves RESTful API to the app from the databases
          </li>
          <li>
            OCR for the document database is a custom ML-backed program that reads documents and
            ouputs JSON that updb-importers then reads
          </li>
          <li>
            Multi-language OCR of over 500,000 document pages took ~6 CPU-months on a 3.2 GHz 8-Core
            Intel Xeon W (~3 weeks wall time). UPDB's OCR solution produces better results than
            Tesseract, compare some source documents to see for yourself.
          </li>
          <li>
            Report bodies and document OCR results are indexed using postgresql's FTS capabilities,
            which powers the report & document searches
          </li>
        </ul>
      </div>
    </div>

    <h2 class="ms-1">Dedications</h2>

    <ul class="ms-3">
      <li title="Computer scientist, go figure.">Jacques Vallée</li>
      <li title="For the awesome bumper music.">George Knapp</li>
      <li title="And his cute dog.">Garry Nolan</li>
      <li title="For the Tom DeLonge impression.">Ross Coulthart</li>
    </ul>

    <h2 class="mn-3 ms-2">Contact</h2>

    <client-only>
      Publius &lt;<a href="mailto:uapublius@protonmail.com">uapublius@protonmail.com</a>&gt;
    </client-only>

    <figure class="mn-4 ms-2">
      <div class="inline-block text-center">
        <a href="https://twitter.com/uapublius" target="_blank">
          <img src="../assets/publius.jpg" style="height: 359px" />
        </a>
        <figcaption class="mn-1">&nbsp;&nbsp;Publius Valerius Poplicola (died 503 BC)</figcaption>
      </div>
    </figure>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
let route = useRoute();
let meta = inject("meta") as HeadTags;

function setMeta() {
  let title = "UPDB | About";
  meta.title = title;
  meta.meta["og:title"] = { content: title };
  meta.meta["twitter:title"] = { content: title };
  meta.meta["og:url"] = { content: "https://updb.app" + route.fullPath };
  meta.meta["twitter:url"] = { content: "https://updb.app" + route.fullPath };
}

setMeta();

let phenomainon =
  'Downloaded from <a href="https://www.phenomainon.com/data" target="_blank">phenomAInon</a> on 2022-05-08, case details parsed by Publius.';

let descriptions = ref({
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

let sourceCounts = ref([]);

let hrefForSource = function (source) {
  return `/reports?filters=0%255Bfield%255D=source%260%255Btype%255D=in%260%255Bvalue%255D%255B0%255D=${source.id}`;
};

onMounted(async () => {
  let { data } = await axios.get("/api/reports/source_view");
  data = data.sort((a, b) => b.count - a.count);
  sourceCounts.value = data;
});
</script>

<style scoped>
h4 {
  line-height: 1.1;
}
</style>
