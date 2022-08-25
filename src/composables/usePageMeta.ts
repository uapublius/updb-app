import { inject } from "vue";
import { useRoute } from "vue-router";
import { HeadTags } from "@/types/types";

export function usePageMeta() {
  let route = useRoute();
  let meta = inject("meta") as HeadTags;

  function setPageMeta(title: string, description?: string) {
    if (!import.meta.env.SSR) {
      document.title = title;
    }

    meta.title = title;
    meta.meta["og:title"] = { content: title };
    meta.meta["twitter:title"] = { content: title };

    if (description) {
      meta.meta.description = { content: description || title };
      meta.meta["og:description"] = { content: description || title };
      meta.meta["twitter:description"] = { content: description || title };
    }

    meta.meta["og:url"] = { content: "https://updb.app" + route.fullPath };
    meta.meta["twitter:url"] = { content: "https://updb.app" + route.fullPath };
  }

  return { setPageMeta };
}
