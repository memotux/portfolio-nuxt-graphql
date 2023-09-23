// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  imports: {
    dirs: ['graphql/*.{ts,js,mjs,mts}']
  },
  modules: ["@nuxtjs/apollo", "nuxt-quasar-ui"],
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'http://localhost:3000/api/graphql'
      }
    },
  },
  quasar: {
    plugins: ['Dialog', 'Notify'],
    config: {
      dark: true
    },
  }
})