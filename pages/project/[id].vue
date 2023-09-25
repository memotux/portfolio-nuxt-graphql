<script lang="ts" setup>
import type { Client, Project } from '~/server/types'

const route = useRoute()

const { data, error, refresh } = await useAsyncQuery<{
  project: Project & { client: Client }
}>(getProject, {
  id: route.params.id,
})

if (!data.value?.project || error.value) {
  console.error(error.value)

  throw createError({
    statusCode: 404,
    statusMessage: 'Project Not Found.',
  })
}
const $q = useQuasar()
const isModalOpen = ref(false)

const { mutate } = useMutation<{ deleteProject: Pick<Project, 'id'> }>(deleteProject)

useSeoMeta({
  title: () => data.value.project.name,
})

function onDeleteProject() {
  $q.dialog({
    title: 'Delete Project?',
    message: `Are you sure you want project "${data.value.project.name}" deleted?`,
    ok: true,
    cancel: true,
    color: 'negative',
    persistent: true,
  }).onOk(async () => {
    const res = await mutate({ id: data.value.project.id })

    if (res?.errors) {
      console.error(res.errors)

      $q.notify({
        message: `Errors on deleting project!`,
        type: 'negative',
        icon: 'warning',
        iconSize: '2rem',
        closeBtn: true,
      })
    }

    if (res?.data?.deleteProject?.id) {
      useRouter().replace('/')
      $q.notify({
        message: `Project ${data.value.project.name} deleted!`,
        type: 'negative',
        icon: 'warning',
        iconSize: '2rem',
        actions: [{ icon: 'close', color: 'yellow' }],
      })
    } else {
      $q.notify({
        message: `Project not deleted!`,
        type: 'negative',
        icon: 'warning',
        iconSize: '2rem',
        closeBtn: true,
      })
    }
  })
}
function onUpdateProject() {
  isModalOpen.value = false
  refresh()
}
</script>

<template>
  <QDialog v-model="isModalOpen">
    <FormUpdateProject
      :project="data.project"
      @close="onUpdateProject"
    />
  </QDialog>
  <div style="max-width: 50dvw; margin: 1rem auto">
    <h1>{{ data.project.name }}</h1>
    <p>{{ data.project.description }}</p>
    <QCard
      flat
      class="q-my-lg"
    >
      <QCardSection
        horizontal
        class="q-pa-md items-center"
      >
        <ProjectStatus :status="data.project.status" />
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

    <div class="flex justify-between q-my-lg">
      <QBtn
        color="secondary"
        @click="isModalOpen = true"
        >Update Project</QBtn
      >
      <QBtn
        color="negative"
        @click="onDeleteProject"
        >Delete Project</QBtn
      >
    </div>
  </div>
</template>
