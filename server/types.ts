import type { projects, clients } from "~/server/data";

export type Project = typeof projects[0]
export type Projects = typeof projects
export type Client = typeof clients[0]
export type Clients = typeof clients