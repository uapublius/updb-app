<template>
  <header class="pn-2 pw-2 pe-3">
    <div class="flex align-items-end justify-content-between w-100">
      <div class="ms-2">
        <h1 class="gradient-text"><a href="/" title="Home">UPDB</a></h1>
      </div>

      <div class="hide-narrow header-tabs flex justify-content-end align-items-end">
        <div><router-link to="/reports">Reports</router-link></div>
        <div><router-link to="/about">About</router-link></div>
        <div><router-link to="/changelog">Changelog</router-link></div>
      </div>

      <div class="icon-links flex align-items-center justify-content-end ms-2">
        <a
          target="_blank"
          title="Download database in postgreSQL format."
          href="https://github.com/uapublius/updb-importers/raw/main/db/phenomenon.sql.gz"
        >
          <icon name="download" />
          <div>Dataset (SQL)</div>
        </a>

        <client-only>
          <a title="uapublius@protonmail.com" href="mailto:uapublius@protonmail.com?subject=UPDB">
            <icon name="envelope" style="padding-top: 1px" />
            <div>Contact</div>
          </a>
        </client-only>

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

    <div class="show-narrow header-tabs flex justify-content-center">
      <div><router-link to="/reports">Reports</router-link></div>
      <div><router-link to="/about">About</router-link></div>
      <div><router-link to="/changelog">Changelog</router-link></div>
    </div>
  </header>
</template>

<style>
h1 {
  white-space: nowrap;
}

.header-tabs {
}

.header-tabs > div a.router-link-active {
  background: #fff;
  color: initial;
}

.header-tabs > div a {
  white-space: nowrap;
  padding: 0 0.75em;
  text-decoration: none;
  color: #ddd;
  line-height: 2rem;
}
</style>
