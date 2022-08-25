<template>
  <el-header
    height="auto"
    class="p-4">
    <h2>Database</h2>
  </el-header>

  <el-main class="px-4">
    <el-row :gutter="20">
      <el-col :md="16">
        <el-card
          shadow="never"
          header="Reports"
          class="ms-3">
          <a
            class="flex-inline align-items-center text-larger"
            target="_blank"
            href="https://web.archive.org/web/https://updb.app/phenomenon.sql.gz">
            <icon-download />
            <div class="mw-1">phenomenon.sql.gz (104 MB)</div>
          </a>
          <p>Download the entire reports database in postgreSQL format.</p>
        </el-card>

        <el-card
          shadow="never"
          header="Document Index"
          class="ms-3">
          <a
            class="flex-inline align-items-center text-larger"
            target="_blank"
            href="https://web.archive.org/web/https://updb.app/phenomenon_docs.sql.gz">
            <icon-download />
            <div class="mw-1">phenomenon_docs.sql.gz (560 MB)</div>
          </a>
          <p>
            Download the document index, containing OCRed text of all documents, in postgreSQL format.
          </p>
        </el-card>
      </el-col>

      <el-col :md="8">
        <el-card
          shadow="never"
          class="ms-3">
          <figure class="text-gray-40 m-0">
            <img src="../assets/pliny.jpg">
            <blockquote class="mn-1">
              &ldquo;Nothing which we can imagine about Nature is incredible.&rdquo;
            </blockquote>
            <figcaption>&nbsp;&nbsp;—Pliny the Elder (23–79 AD)</figcaption>
          </figure>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script setup lang="ts">
import {
 ElHeader, ElMain, ElCard, ElRow, ElCol
} from 'element-plus';
import { usePageMeta } from "@/composables/usePageMeta";
let { setPageMeta } = usePageMeta();

setPageMeta('UPDB | Download');
</script>

<style scoped>
figure {
  color: hsl(0, 1%, 40%);
  line-height: 1;
}
</style>
