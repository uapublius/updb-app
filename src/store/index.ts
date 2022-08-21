import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", {
  state: () => ({
    version: 1,
    lastFocused: "keyword"
  })
});
