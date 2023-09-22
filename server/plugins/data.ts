import { projects, clients } from "~/server/data";

export default defineNitroPlugin(() => {
  useStorage().setItem('projects', projects)
  useStorage().setItem('clients', clients)
})