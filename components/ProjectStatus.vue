<script setup lang="ts">
const props = defineProps<{
  status: string
  textTag?: string
  textClass?: string
  chipSize?: string
}>()

const statusIcon = computed(() => {
  switch (props.status) {
    case 'In Progress':
      return ['rotate_right', 'blue']
    case 'Done':
    case 'Completed':
      return ['check_circle', 'green']
    default:
      return ['not_started', 'amber']
  }
})
</script>

<template>
  <component
    :is="props.textTag || 'p'"
    :class="props.textClass || 'q-ma-sm text-h5'"
    >Status:</component
  >
  <QChip
    :size="props.chipSize || 'lg'"
    :icon="statusIcon[0]"
    :color="statusIcon[1]"
  >
    {{ props.status }}
  </QChip>
</template>
