import { defineUserConfig } from 'vuepress';
import type { DefaultThemeOptions } from 'vuepress';

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'en-US',
  title: 'UPDB',
  theme: '@vuepress/theme-default',
  themeConfig: {
    repo: 'https://github.com/uapublius',
    editLink: false
  },
  base: '/docs/',
  dest: 'dist/docs/'
});
