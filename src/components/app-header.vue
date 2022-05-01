<template>
  <header class="p-2 pe-3">
    <div class="flex align-items-center justify-content-between w-100">
      <div>
        <h1 class="gradient-text"><a href="/" title="Home">UPDB</a></h1>
      </div>

      <div class="icon-links flex align-items-center justify-content-end">
        <a
          target="_blank"
          title="Download database in postgreSQL format."
          href="https://github.com/uapublius/updb-importers/raw/main/db/phenomenon.sql.gz"
        >
          <icon name="download" />
          <div>Dataset (SQL)</div>
        </a>

        <a title="uapublius@protonmail.com" href="mailto:uapublius@protonmail.com?subject=UPDB">
          <icon name="envelope" style="padding-top: 1px" />
          <div>Contact</div>
        </a>

        <a
          target="_blank"
          title="Download source code for UPDB app and data processing tools"
          href="https://github.com/uapublius?tab=repositories&q=&type=source&language=&sort="
        >
          <icon name="github" />
          <div>GitHub</div>
        </a>

        <a target="_blank" href="https://twitter.com/uapublius">
          <icon name="twitter" />
          <div>Twitter</div>
        </a>
      </div>
    </div>
  </header>
</template>
