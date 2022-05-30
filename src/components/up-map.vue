<template>
  <div class="w-100 h-100">
    <div class="w-100 h-100 position-relative">
      <div class="w-100 h-100" ref="el" />
      <div v-if="selectedLocations" id="features" class="p-2">
        <div v-for="selectedReports in selectedReportsByLocation" class="ms-2">
          <div>{{ locationSummaryForReport(selectedReports.location) }}</div>
          <div v-for="report in selectedReports.reports" class="mw-2">
            {{ report.date }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMap } from "@/lib/map/create";
import { reportsForLocation } from "@/lib/map/data";
import { computed, onMounted, ref } from "vue";

let { createMap, selectedLocations } = useMap();
let el = ref(null);

function locationSummaryForReport(report) {
  if (!report) return "–";

  let locationFields = ["city", "district", "country", "water", "other"];
  let loc = [];

  for (const locationField of locationFields) {
    if (report[locationField]) loc.push(report[locationField]);
  }

  return loc.join(", ");
}

onMounted(async () => {
  createMap(el.value, [-79.4, 48], 9);
});

// Turns the objected indexed by location/report into sorted
// list for display
let selectedReportsByLocation = computed(() => {
  let selectedReports = [];

  for (const location of selectedLocations.value.sort((a, b) => a - b)) {
    let reportsForLoc: any[] = reportsForLocation(location);
    if (reportsForLoc) {
      let reports = Object.values(reportsForLoc).sort((a, b) => a.date < b.date ? 1 : -1);

      selectedReports.push({
        location: {
          city: reports[0].city,
          district: reports[0].district,
          country: reports[0].country,
          water: reports[0].water,
          other: reports[0].other,
        },
        reports
      });
    }
    else {
      console.log('No reports in this location?', location);
    }
  }

  return selectedReports;
});
</script>

<style>
#features {
  position: absolute;
  white-space: pre-wrap;
  top: 0;
  right: 0;
  bottom: 0;
  width: 35%;
  overflow: auto;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-weight: bold;
}
</style>