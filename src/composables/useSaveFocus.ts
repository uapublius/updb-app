import { onMounted, ref } from "vue";
import { useSearchStore } from "@/store";

export function useSaveFocus() {
  let store = useSearchStore();
  let searchBox = ref(null);

  onMounted(() => {
    if (store.lastFocused) {
      setTimeout(() => {
        let el = searchBox.value.querySelector(`input[name="${store.lastFocused}"]`);
        el.focus();
        el.select();
      }, 0);
    }
  });

  function saveFocus(e) {
    store.lastFocused = e.target.name;
  }

  return { saveFocus, searchBox };
}
