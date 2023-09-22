// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/apollo", "nuxt-quasar-ui"],
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'http://localhost:3000/api/graphql'
      }
    },
  },
  quasar: {
    config: {
      dark: true
    }
  }
})