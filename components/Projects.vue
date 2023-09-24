<script lang="ts" setup>
import type { Projects } from '~/server/types'

const { data } = await useAsyncQuery<{ projects: Projects }>(getProjects)
</script>

<template>
  <h2>Projects</h2>
  <div class="q-pa-md flex items-center justify-between q-gutter-xl">
    <QSpinner
      v-if="!data?.projects.length"
      size="50px"
      color="secondary"
    />
    <QCard
      v-else
      v-for="project in data.projects"
      :key="project.id"
      class="col"
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
