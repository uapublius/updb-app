import { onMounted, defineComponent, createElementBlock, h } from 'vue';

export default defineComponent({
  name: 'ClientOnly',

  props: ['fallback', 'placeholder', 'placeholderTag', 'fallbackTag'],

  setup(_, { slots }) {
    let mounted = $ref(false);
    onMounted(() => {
      mounted = true;
    });
    return props => {
      if (mounted) {
        return slots.default?.();
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || '';
      const fallbackTag = props.fallbackTag || props.placeholderTag || 'span';
      return createElementBlock(fallbackTag, null, fallbackStr);
    };
  }
});
