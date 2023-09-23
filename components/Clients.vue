<script lang="ts" setup>
import type { QTableProps } from 'quasar'
import type { Client, Clients } from '~/server/types'
import type { FetchResult } from '@apollo/client'

const $q = useQuasar()

useSeoMeta({
  title: 'Clients',
  description: "Company's Clients",
})

const {
  result,
  loading: isQueryLoading,
  error,
  refetch,
} = useQuery<{ clients: Clients }>(getClients)

const { mutate, loading: isMutationLoading } = useMutation<{ deleteClient: Client }>(
  deleteClient
)

if (error.value) {
  console.error(error.value)

  throw createError({
    statusMessage: error.value.message,
    statusCode: 400,
  })
}

const columns: QTableProps['columns'] = [
  { name: 'name', label: 'Name', field: 'name', align: 'center' },
  { name: 'email', label: 'Email', field: 'email', align: 'center' },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'center' },
  { name: 'del', label: 'Delete', field: 'del', align: 'center' },
]

async function onDeleteClient(client: Client) {
  let res: FetchResult<{ deleteClient: Client }> | null

  $q.dialog({
    title: 'Confirm',
    message: `Would you like to delete ${client.name}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    res = await mutate({ id: client.id })

    console.log(res)

    if (res?.errors) {
      console.error(res.errors)

      throw createError({
        statusCode: 400,
        statusMessage: res.errors.map((e: any) => e.message).join('\n'),
      })
    }

    if (res?.data?.deleteClient.id) {
      $q.dialog({
        title: 'Deleted!',
        message: `Client ${res.data.deleteClient.name} was deleted!`,
      }).onDismiss(async () => {
        await refetch()
      })
    }
  })
}
</script>

<template>
  <div class="q-pa-md">
    <QTable
      row-key="name"
      :rows="result?.clients || []"
      :columns="columns"
      :loading="isQueryLoading || isMutationLoading"
    >
      <template v-slot:loading>
        <QInnerLoading
          showing
          size="50px"
          color="secondary"
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
