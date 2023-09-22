<script setup lang="ts">
const { data } = await useAsyncQuery(
  gql`
    query {
      project(id: 1) {
        name
        client {
          name
        }
      }
    }
  `
)

console.log(data.value)
</script>

<template>
  <pre>
    {{ data }}
  </pre>
</template>
