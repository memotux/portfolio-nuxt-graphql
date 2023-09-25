<script lang="ts" setup>
import type { Projects } from '~/server/types'

const isModalOpen = ref(false)

const { data, refresh, pending, error } = await useAsyncQuery<{ projects: Projects }>(
  getProjects
)

const onModalClose = () => {
  refresh()
  isModalOpen.value = false
}
</script>

<template>
  <QDialog v-model="isModalOpen">
    <FormAddProject @close="onModalClose" />
  </QDialog>
  <h2>
    Projects
    <QBtn
      color="primary"
      class="q-ml-lg"
      @click="isModalOpen = true"
      >Add New Project</QBtn
    >
  </h2>
  <div
    class="q-pa-md flex no-wrap items-center justify-between q-gutter-xl"
    style="overflow-x: auto"
  >
    <QSpinner
      v-if="error || pending || !data?.projects.length"
      size="50px"
      color="secondary"
    />
    <QCard
      v-else
      v-for="project in data.projects"
      :key="project.id"
      class="col-6"
      flat
      bordered
    >
      <QCardSection>
        <h5 class="q-ma-none">{{ project.name }}</h5>
      </QCardSection>
      <QCardSection
        horizontal
        class="items-center q-pa-lg"
      >
        <ProjectStatus
          :status="project.status"
          chip-size="md"
        />
      </QCardSection>
      <QCardActions class="justify-end">
        <QBtn
          :to="`/project/${project.id}`"
          color="secondary"
          icon-right="arrow_right_alt"
          >VIEW</QBtn
        >
      </QCardActions>
    </QCard>
  </div>
</template>
