<script lang="ts" setup>
import type { QTableProps } from 'quasar'
import type { Clients } from '~/server/types'

const { data, error } = await useAsyncQuery<{ clients: Clients }>(gql`
  query getClients {
    clients {
      id
      name
      email
      phone
    }
  }
`)

if (error.value) {
  console.error(error.value)

  throw createError({
    statusMessage: error.value.message,
    statusCode: 401,
  })
}

const columns: QTableProps['columns'] = [
  { name: 'name', label: 'Name', field: 'name', align: 'center' },
  { name: 'email', label: 'Email', field: 'email', align: 'center' },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'center' },
  { name: 'del', label: 'Delete', field: 'del', align: 'center' },
]
</script>

<template>
  <div
    v-if="error"
    class="flex justify-center items-center"
  >
    <QCircularProgress
      indeterminate
      rounded
      size="50px"
      color="secondary"
      class="q-ma-md"
    />
  </div>
  <div
    v-else
    class="q-pa-md"
  >
    <QTable
      row-key="name"
      :rows="data.clients"
      :columns="columns"
    >
      <template #body-cell-del="props">
        <QTd :props="props">
          <QBtn
            size="md"
            icon="delete"
            color="negative"
            round
          />
        </QTd>
      </template>
    </QTable>
  </div>
</template>
