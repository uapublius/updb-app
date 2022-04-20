<template>
  <div class="flex align-items-center justify-content-end w-100">
    <div>
      <h1 class="gradient-text"><a href="/">UPDB</a></h1>
    </div>

    <div class="flex align-items-center justify-content-end w-100">
      <a
        class="flex feedback-link hide-narrow"
        target="_blank"
        href="https://github.com/uapublius/updb-importers/raw/main/db/phenomenon.sql.gz"
      >
        <icon-download />
        Database
      </a>

      <a
        class="flex feedback-link"
        title="uapublius@protonmail.com"
        href="mailto:uapublius@protonmail.com?subject=UPDB"
      >
        <icon-envelope style="padding-top: 1px" />
        <div>Contact</div>
      </a>

      <a class="flex feedback-link" target="_blank" href="/docs">
        <icon-book />
        Docs
      </a>

      <a
        class="flex feedback-link"
        target="_blank"
        href="https://github.com/uapublius?tab=repositories&q=&type=source&language=&sort="
      >
        <icon-github />
        GitHub
      </a>

      <a class="flex feedback-link" target="_blank" href="https://twitter.com/uapublius">
        <icon-twitter />
        Twitter
      </a>
    </div>

    <!-- <div>
        <input
          type="search"
          placeholder="Search..."
          v-model="currentSearch"
          @search="handleSearch"
          @keyup.enter="handleSearch"
        />
      </div> -->
  </div>
</template>

<style lang="scss">
@import "../style/_vars.scss";

.feedback-link,
.feedback-link:visited {
  color: $color-gray-50;
  font-size: 13px;
  text-decoration: none;
  line-height: 1;
  margin: 0 0 0 1rem;

  &:hover {
    text-decoration: underline;
  }

  svg {
    height: 12px;
    width: auto;
    margin-right: 4px;
    padding-right: 1px;
    fill: $color-gray-50;
  }
}
</style>
