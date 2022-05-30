import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", {
  state: () => ({
    lastFocused: "keyword",
    keyword: "",
    city: "",
    district: "",
    country: "",
    water: "",
    other: "",
    from: "",
    to: ""
  })
});
