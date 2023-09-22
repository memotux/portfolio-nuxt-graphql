<script setup lang="ts">
// const { data } = await useAsyncQuery(
//   gql`
//     mutation {
//       addClient(name: "Romeo Mendez", email: "romeo@tux.sv", phone: "+50371231234") {
//         name
//         id
//       }
//     }
//   `
// )

// const { data } = await useAsyncQuery(
//   gql`
//     mutation {
//       addProject(
//         name: "Mobile App 2"
//         description: "This is the description"
//         status: new
//         clientId: "72bee50cb9d2"
//       ) {
//         name
//         id
//       }
//     }
//   `
// )

// const { data } = await useAsyncQuery(gql`
//   query {
//     client(id: 1) {
//       name
//       id
//     }
//   }
// `)
// const { data } = await useAsyncQuery(gql`
//   query {
//     clients {
//       name
//       id
//     }
//   }
// `)
// const { data } = await useAsyncQuery(gql`
//   query {
//     projects {
//       name
//       id
//       client {
//         id
//         name
//       }
//     }
//   }
// `)

// console.log(data.value)
</script>

<template>
  <NuxtLayout>
    <h1>Home</h1>
  </NuxtLayout>
</template>
