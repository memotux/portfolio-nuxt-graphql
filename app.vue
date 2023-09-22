<script setup lang="ts">
const { data } = await useAsyncQuery(
  gql`
    query {
      hello
    }
  `
)

console.log(data.value)
</script>

<template>
  <div>
    <NuxtWelcome />
  </div>
</template>
