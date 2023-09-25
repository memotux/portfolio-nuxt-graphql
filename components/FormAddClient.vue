<script lang="ts" setup>
import type { QForm } from 'quasar'
import type { Client } from '~/server/types'

const initValues: Omit<Client, 'id'> = {
  name: '',
  email: '',
  phone: '',
}

const $q = useQuasar()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const formData = reactive(initValues)
const isFormValidated = ref(false)
const formRef = ref<QForm | null>(null)

const { mutate, loading } = useMutation<{ addClient: Client }>(addClient, {
  // update: (cache, { data }) => {
  //   const cachedQuery = cache.readQuery<{ clients: Clients }>({ query: getClients })
  //   if (cachedQuery && data) {
  //     cache.writeQuery({
  //       query: getClients,
  //       data: { clients: [...cachedQuery.clients, data.addClient] },
  //     })
  //   }
  // },
  // updateQueries: {
  //   getClients: ({ clients }, { mutationResult: { data } }) => {
  //     if (!data) return { clients }
  //     return { clients: [...clients, data.addClient] }
  //   },
  // },
})

const phoneRules = [
  (val: string) => (val !== null && val !== '') || 'Please give us your phone!',
  (val: string) => val.length >= 12 || 'Please give us a valid phone number.',
  (val: string) =>
    Boolean(val.match(/^\+[0-9]+$/g)) || "Must start with '+', and only number after.",
]

async function onSubmit() {
  try {
    const res = await mutate({ ...formData })

    if (res?.data?.addClient.id) {
      $q.dialog({
        title: 'Success!',
        message: `Client ${res.data.addClient.name} was created!`,
        ok: 'Continue',
      }).onDismiss(async () => {
        onReset()
        refreshNuxtData()
        emits('close')
      })
    }
  } catch (error) {
    console.error(error)

    $q.notify({
      message: 'Error on creating client.',
      type: 'negative',
      icon: 'error',
      actions: [{ icon: 'close', color: 'white', round: true }],
    })
  }
}
function onReset() {
  formData.email = ''
  formData.name = ''
  formData.phone = ''

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

// onMounted(() => {
//   if (formRef.value) {
//     formRef.value.focus()
//   }
// })
</script>

<template>
  <QCard style="width: 50dvw">
    <QToolbar>
      <QToolbarTitle><h4>Add new Client:</h4></QToolbarTitle>
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
          label="Your name *"
          hint="Name and surname"
          filled
          clearable
          :rules="[(val) => (val && val.length > 3) || 'Please give us your name!']"
        >
          <template #prepend>
            <QIcon name="person" />
          </template>
        </QInput>

        <QInput
          v-model="formData.email"
          name="email"
          type="email"
          label="Your email *"
          filled
          clearable
          :rules="[
            (val) => (val !== null && val !== '') || 'Please give us your email!',
            'email',
          ]"
        >
          <template #prepend>
            <QIcon name="email" />
          </template>
        </QInput>
        <QInput
          v-model="formData.phone"
          label="Your phone *"
          filled
          clearable
          :rules="phoneRules"
        >
          <template #prepend>
            <QIcon name="phone" />
          </template>
        </QInput>

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
