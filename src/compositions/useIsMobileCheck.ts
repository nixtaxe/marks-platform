import { ref, onMounted, onBeforeUnmount, computed } from '@vue/composition-api'

export default function useIsMobileCheck () {
  const width = ref(window.innerWidth)
  const handleResize = () => (width.value = window.innerWidth)
  onMounted(() => window.addEventListener('resize', handleResize))
  onBeforeUnmount(() => window.removeEventListener('resize', handleResize))
  const isMobile = computed(() => width.value < 600)

  return { isMobile }
}
