<script lang="ts" setup>
import type { QTableProps } from 'quasar'
import type { Client, Clients } from '~/server/types'

const {
  data: result,
  pending: isQueryLoading,
  error,
} = await useAsyncQuery<{ clients: Clients }>({
  query: getClients,
  key: 'getClients',
})

if (error.value) {
  console.error(error.value)

  throw createError({
    statusMessage: error.value.message,
    statusCode: 400,
  })
}

const $q = useQuasar()

const isModalAddClientOpen = ref(false)

const { mutate, loading: isMutationLoading } = useMutation<{ deleteClient: Client }>(
  deleteClient
)

const columns: QTableProps['columns'] = [
  { name: 'name', label: 'Name', field: 'name', align: 'center' },
  { name: 'email', label: 'Email', field: 'email', align: 'center' },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'center' },
  { name: 'del', label: 'Delete', field: 'del', align: 'center' },
]

async function onDeleteClient(client: Client) {
  isMutationLoading.value = true

  $q.dialog({
    title: 'Confirm delete Client',
    message: `Would you like to delete client: ${client.name}?`,
    cancel: true,
    persistent: true,
    position: 'top',
  })
    .onOk(async () => {
      try {
        const res = await mutate({ id: client.id })

        if (res?.data?.deleteClient.id) {
          $q.dialog({
            title: 'Deleted!',
            message: `Client ${res.data.deleteClient.name} was deleted!`,
            ok: 'Continue',
          }).onDismiss(() => {
            refreshNuxtData(['getClients', 'getProjects'])
            isMutationLoading.value = false
          })
        }
      } catch (error) {
        console.error(error)

        $q.notify({
          message: 'Error on deleting client.',
          type: 'negative',
          icon: 'error',
          actions: [{ icon: 'close', color: 'white', round: true }],
        })
      }
    })
    .onCancel(() => {
      isMutationLoading.value = false
    })
}
</script>

<template>
  <h2>Clients</h2>
  <div class="q-pa-md">
    <QDialog v-model="isModalAddClientOpen">
      <FormAddClient @close="isModalAddClientOpen = false" />
    </QDialog>

    <QTable
      row-key="name"
      :rows="result?.clients || []"
      :columns="columns"
      :loading="isQueryLoading || isMutationLoading"
      :pagination="{ rowsPerPage: 10 }"
    >
      <template #loading>
        <QInnerLoading
          showing
          size="50px"
          color="secondary"
        />
      </template>
      <template #top>
        <QBtn
          color="primary"
          icon="person_add"
          label="Add new client"
          class="offset-10 col-2"
          @click="isModalAddClientOpen = true"
        />
      </template>
      <template #body-cell-del="props">
        <QTd :props="props">
          <QBtn
            size="md"
            icon="delete"
            color="negative"
            round
            @click="onDeleteClient(props.row)"
          />
        </QTd>
      </template>
    </QTable>
  </div>
</template>
