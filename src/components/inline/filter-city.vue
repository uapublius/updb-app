<template>
  <el-autocomplete
    :fetch-suggestions="querySearchCity"
    highlight-first-item
    clearable
    name="city"
    :trigger-on-focus="false"
    value-key="city"
    placeholder="City/Town"
    size="large" />
</template>

<script setup lang="ts">
import axios from 'axios';
import { ElAutocomplete } from 'element-plus';

const API_REPORTS = import.meta.env.VITE_API_REPORTS;

let props = defineProps<{
  country?: string;
  district?: string;
}>();

function querySearchCity(queryString: string, cb: (arg: any) => void) {
  let isUk = props.country === 'GB';

  if (queryString.length < 3 || !props.district || !props.country) return cb([]);
  if (!props.district && !isUk) return cb([]);

  queryString = queryString.toUpperCase();

  axios.get(API_REPORTS + "/report_count_by_location", {
    params: {
      select: 'city',
      order: 'count.desc',
      city: `like.${queryString.toUpperCase()}*`,
      country: `eq.${props.country}`,
      district: isUk ? undefined : `eq.${props.district.toUpperCase()}`,
      limit: 100
    }
  }).then(({ data }) => {
    cb(data);
  });
}
</script>  