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
      <QToolbar>
        <QToolbarTitle
          ><h5>{{ project.name }}</h5></QToolbarTitle
        >
      </QToolbar>
      <QCardSection
        horizontal
        class="justify-between items-center q-pa-lg"
      >
        <p class="q-ma-none">
          Status: <strong>{{ project.status }}</strong>
        </p>
        <QBtn
          :to="`/project/${project.id}`"
          color="secondary"
          icon-right="arrow_right_alt"
          >VIEW</QBtn
        >
      </QCardSection>
    </QCard>
  </div>
</template>
