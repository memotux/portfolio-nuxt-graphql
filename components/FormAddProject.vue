<script lang="ts" setup>
import type { QForm } from 'quasar'
import type { Clients, Project } from '~/server/types'

const initValues: Omit<Project, 'id'> = {
  name: '',
  description: '',
  status: '',
  clientId: '',
}

const statusOptions = [
  { label: 'In Progress', value: 'progress' },
  { label: 'Not Started', value: 'new' },
  { label: 'Completed', value: 'completed' },
]

const $q = useQuasar()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const formData = reactive(initValues)
const isFormValidated = ref(false)
const formRef = ref<QForm | null>(null)

const { data } = useAsyncQuery<{ clients: Clients }>(getClients)

const { mutate, loading } = useMutation<{ addProject: Project }>(addProject, {
  // update: (cache, { data }) => {
  //   const cachedQuery = cache.readQuery<{ projects: Projects }>({ query: getProjects })

  //   if (cachedQuery && data) {
  //     cache.writeQuery({
  //       query: getProjects,
  //       data: { projects: [...cachedQuery.projects, data.addProject] },
  //     })
  //   }
  // },
  updateQueries: {
    getProjects: ({ projects }, { mutationResult: { data } }) => {
      if (!data) return { projects }

      return { projects: [...projects, data.addProject] }
    },
  },
})

const clientOptions = computed(
  () =>
    data.value?.clients.map((client) => ({ label: client.name, value: client.id })) || []
)

async function onSubmit() {
  try {
    const res = await mutate({ ...formData })

    if (res?.data?.addProject.id) {
      $q.dialog({
        title: 'Success!',
        message: `Project ${res.data.addProject.name} was created!`,
        ok: 'Continue',
      }).onDismiss(async () => {
        onReset()
        emits('close')
      })
    }
  } catch (error) {
    console.error(error)

    $q.notify({
      message: 'Error on creating project.',
      type: 'negative',
      icon: 'error',
      actions: [{ icon: 'close', color: 'white', round: true }],
    })
  }
}
function onReset() {
  formData.description = ''
  formData.name = ''
  formData.status = ''
  formData.clientId = ''

  formRef.value?.resetValidation()
}

watch(
  formData,
  async () => {
    console.log('validating data')

    if (formRef.value) {
      isFormValidated.value = await formRef.value.validate(false)
    }
  },
  { deep: true }
)
</script>

<template>
  <QCard style="width: 50dvw">
    <QToolbar>
      <QToolbarTitle><h4>Add New Project:</h4></QToolbarTitle>
      <QBtn
        icon="close"
        color="negative"
        round
        dense
        unelevated
        v-close-popup
        :disable="loading"
      />
    </QToolbar>
    <QCardSection>
      <QForm
        ref="formRef"
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <QInput
          v-model="formData.name"
          name="name"
          label="Project name *"
          filled
          clearable
          :rules="[
            (val) => (val && val.length > 3) || 'Please provide your project name!',
          ]"
        >
          <template #prepend>
            <QIcon name="business_center" />
          </template>
        </QInput>

        <QInput
          v-model="formData.description"
          name="description"
          type="textarea"
          label="Your project description *"
          filled
          clearable
          counter
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Please provide a project description!',
          ]"
        >
          <template #prepend>
            <QIcon name="description" />
          </template>
        </QInput>

        <div>
          <p class="q-ma-none text-sm">Project Status</p>
          <QOptionGroup
            v-model="formData.status"
            name="status"
            :options="statusOptions"
            color="primary"
            inline
          />
        </div>

        <QSelect
          filled
          v-model="formData.clientId"
          :options="clientOptions"
          label="Select a Client..."
        >
          <template #prepend>
            <QIcon name="person" />
          </template>
        </QSelect>

        <div class="flex justify-between items-center">
          <QBtn
            label="Submit"
            type="submit"
            color="primary"
            :flat="!isFormValidated"
            :disable="!isFormValidated"
          />
          <QBtn
            label="Reset"
            type="reset"
            color="primary"
            class="q-ml-sm"
            outline
          />
          <QBtn
            label="Cancel"
            type="button"
            color="negative"
            class="q-ml-auto"
            flat
            v-close-popup
          />
        </div>
      </QForm>
    </QCardSection>
  </QCard>
</template>
