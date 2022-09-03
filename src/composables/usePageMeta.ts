import { inject } from "vue";
import { useRoute } from "vue-router";
import { HeadTags } from "@/types/types";

export function usePageMeta() {
  let route = useRoute();
  let meta = inject("meta") as HeadTags;

  function setPageMeta(title: string, description = title) {
    if (!import.meta.env.SSR) {
      document.title = title;
    }

    meta.title = title;
    meta.meta["og:title"] = { content: title };
    meta.meta["twitter:title"] = { content: title };

    meta.meta.description = { content: description };
    meta.meta["og:description"] = { content: description };
    meta.meta["twitter:description"] = { content: description };

    meta.meta["og:url"] = { content: "https://updb.app" + route.fullPath };
    meta.meta["twitter:url"] = { content: "https://updb.app" + route.fullPath };
  }

  return { setPageMeta };
}
