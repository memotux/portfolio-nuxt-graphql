<script lang="ts" setup>
import type { Client, Project } from '~/server/types'

const route = useRoute()

const { data, error } = await useAsyncQuery<{ project: Project & { client: Client } }>(
  getProject,
  {
    id: route.params.id,
  }
)

if (!data.value?.project || error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Project Not Found.',
  })
}

useSeoMeta({
  title: () => data.value.project.name,
})

const statusIcon = computed(() => {
  switch (data.value.project.status) {
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
  <div style="max-width: 50dvw; margin: 1rem auto">
    <h1>{{ data.project.name }}</h1>
    <p>{{ data.project.description }}</p>
    <QCard
      flat
      class="q-my-lg"
    >
      <QCardSection
        horizontal
        class="items-center"
      >
        <h5 class="q-ma-md">Status:</h5>
        <QChip
          size="lg"
          :icon="statusIcon[0]"
          :color="statusIcon[1]"
        >
          {{ data.project.status }}
        </QChip>
      </QCardSection>
    </QCard>
    <QList
      bordered
      separator
      class="rounded-borders q-myLg"
    >
      <QToolbar>
        <QToolbarTitle>Client Information:</QToolbarTitle>
      </QToolbar>
      <QItem class="q-my-sm">
        <QItemSection avatar>
          <QAvatar
            color="primary"
            text-color="white"
            icon="perm_identity"
          />
        </QItemSection>

        <QItemSection>
          <QItemLabel>{{ data.project.client.name }}</QItemLabel>
        </QItemSection>
      </QItem>
      <QItem class="q-my-sm">
        <QItemSection avatar>
          <QAvatar
            color="primary"
            text-color="white"
            icon="email"
          />
        </QItemSection>

        <QItemSection>
          <QItemLabel>{{ data.project.client.email }}</QItemLabel>
        </QItemSection>
      </QItem>
      <QItem class="q-my-sm">
        <QItemSection avatar>
          <QAvatar
            color="primary"
            text-color="white"
            icon="phone"
          />
        </QItemSection>

        <QItemSection>
          <QItemLabel>{{ data.project.client.phone }}</QItemLabel>
        </QItemSection>
      </QItem>
    </QList>
  </div>
</template>
