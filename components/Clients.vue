<script lang="ts" setup>
import type { QTableProps } from 'quasar'
import type { Clients } from '~/server/types'

useSeoMeta({
  title: 'Clients',
  description: "Company's Clients",
})

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
  <div class="q-pa-md">
    <QTable
      row-key="name"
      :rows="data.clients"
      :columns="columns"
      :loading="!error && !data?.clients"
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
          />
        </QTd>
      </template>
    </QTable>
  </div>
</template>
