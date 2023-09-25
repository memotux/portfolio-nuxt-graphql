<script setup lang="ts">
import { Clients } from '~/server/types'

defineProps<{
  modelValue: { label?: string; value?: string } | null
}>()

defineEmits<{
  (e: 'update:modelValue', value: { label?: string; value?: string } | null): void
}>()

const { data } = await useAsyncQuery<{ clients: Clients }>({
  query: getClients,
  key: 'getClients',
})

const clientOptions = computed(
  () =>
    data.value?.clients.map((client) => ({ label: client.name, value: client.id })) || []
)
</script>

<template>
  <QSelect
    filled
    label="Select a Client *"
    :options="clientOptions"
    :model-value="modelValue"
    @update:model-value="(value) => $emit('update:modelValue', value)"
  >
    <template #prepend>
      <QIcon name="person" />
    </template>
  </QSelect>
</template>
