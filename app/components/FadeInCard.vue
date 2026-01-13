<template>
  <div
    ref="card"
    :class="[
      visible ? 'fade-in' : 'opacity-0 translate-y-5',
      'transition-all ease-out',
      props.customClass,
    ]"
    :style="{ transitionDelay: delay, transitionDuration: duration }"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  delay: {
    type: String,
    default: '0s',
  },
  duration: {
    type: String,
    default: '800ms',
  },
  customClass: {
    type: String,
    default: '',
  },
})

const card = ref(null)
const visible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.1 }
  )

  observer.observe(card.value)
})
</script>

<style scoped>
.fade-in {
  opacity: 1;
  transform: translateY(0);
}
.opacity-0 {
  opacity: 0;
}
.translate-y-5 {
  transform: translateY(20px);
}
</style>
