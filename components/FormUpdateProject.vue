<script lang="ts" setup>
import type { QForm } from 'quasar'
import type { ProjectResult, Project } from '~/server/types'

const props = defineProps<{ project: ProjectResult }>()

const statusOptions = [
  { label: 'Not Started', value: 'new' },
  { label: 'In Progress', value: 'progress' },
  { label: 'Completed', value: 'completed' },
]

const initValues: Omit<Project, 'id' | 'clientId'> & {
  clientId: { label?: string; value?: string } | null
} = {
  name: props.project.name,
  description: props.project.description,
  status: statusOptions.find((s) => s.label === props.project.status)?.value || 'new',
  clientId: { label: props.project.client.name, value: props.project.client.id },
}

const $q = useQuasar()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const formData = reactive(initValues)
const isFormValidated = ref(false)
const formRef = ref<QForm | null>(null)

const { mutate, loading } = useMutation<{ updateProject: Project }>(updateProject)

async function onSubmit() {
  if (!formData.clientId) return
  loading.value = true

  $q.dialog({
    title: 'Update Project?',
    message: `Are you sure you want project "${props.project.name}" modified?`,
    ok: true,
    cancel: true,
    color: 'secondary',
    persistent: true,
  }).onOk(async () => {
    const res = await mutate({
      ...formData,
      id: props.project.id,
      clientId: formData.clientId?.value || props.project.client.id,
    })

    if (res?.errors) {
      console.error(res.errors)
      $q.notify({
        message: `Errors on updating project!`,
        caption: 'Confirm if project was successful updated, or try again.',
        type: 'negative',
        icon: 'warning',
        iconSize: '2rem',
        closeBtn: true,
      })
      loading.value = false
      emits('close')
    }

    if (res?.data?.updateProject?.id) {
      $q.notify({
        message: `Project ${props.project.name} updated!`,
        type: 'secondary',
        icon: 'verified',
        iconSize: '2rem',
        actions: [{ icon: 'close', color: 'yellow' }],
      })
      loading.value = false
      emits('close')
    } else {
      $q.notify({
        message: `Project not updated. Please try again.`,
        type: 'negative',
        icon: 'warning',
        iconSize: '2rem',
        closeBtn: true,
      })
      loading.value = false
      emits('close')
    }
  })
}
function onReset() {
  formData.description = ''
  formData.name = ''
  formData.status = ''
  formData.clientId = null

  formRef.value?.resetValidation()
}

watch(
  formData,
  async () => {
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
      <QToolbarTitle><h4>Update Project:</h4></QToolbarTitle>
      <QBtn
        icon="close"
        color="negative"
        round
        dense
        unelevated
        v-close-popup
      />
    </QToolbar>
    <QCardSection>
      <QForm
        ref="formRef"
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
        :disable="loading"
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
          label="Project description *"
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

        <div class="flex items-center">
          <p class="q-ma-none text-sm">Project Status *</p>
          <QOptionGroup
            v-model="formData.status"
            name="status"
            :options="statusOptions"
            color="primary"
            inline
          />
        </div>

        <SelectClients v-model="formData.clientId" />

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
