<template>
  <header class="app-header pn-1 pw-2 pe-3">
    <div class="flex align-items-end justify-content-between w-100">
      <div class="flex">
        <h1 class="gradient-text ms-1"><a href="/" title="Home">UPDB</a></h1>

        <div class="hide-narrow header-tabs flex justify-content-end align-items-end pw-3">
          <div>
            <router-link to="/reports">Reports</router-link>
          </div>
          <div>
            <router-link to="/documents">Documents</router-link>
          </div>
          <div>
            <router-link to="/news">News</router-link>
          </div>
          <div>
            <router-link to="/about">About</router-link>
          </div>
          <div>
            <router-link to="/download">Download</router-link>
          </div>
        </div>
      </div>

      <div class="icon-links flex align-items-center justify-content-end ms-2">
        <a target="_blank" title="Download source code for UPDB app and data processing tools"
          href="https://github.com/uapublius?tab=repositories&q=&type=source&language=&sort=">
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
      <div>
        <router-link to="/reports">Reports</router-link>
      </div>
      <div>
        <router-link to="/documents">Documents</router-link>
      </div>
      <div>
        <router-link to="/news">News</router-link>
      </div>
      <div>
        <router-link to="/about">About</router-link>
      </div>
    </div>
  </header>
</template>
