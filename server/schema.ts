// https://github.com/graphql/graphql-http#create-a-graphql-schema

import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLEnumType } from 'graphql';
import { v4 as uuidv4 } from 'uuid'
import type { Project, Projects, Clients, Client } from "./types";

const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  })
})
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    clientId: { type: GraphQLID },
    client: {
      type: ClientType,
      resolve: async (parent: Project) => {
        return await findItem('clients', 'id', parent.clientId)
      }
    }
  })
})

const NonNullString = new GraphQLNonNull(GraphQLString)
const NonNullID = new GraphQLNonNull(GraphQLID)

const ProjectStatus = new GraphQLEnumType({
  name: 'ProjectStatus',
  values: {
    new: { value: 'Not Started' },
    progress: { value: 'In Progress' },
    completed: { value: 'Completed' },
  }
})

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    clients: {
      type: new GraphQLList(ClientType),
      resolve: async () => await useStorage().getItem<Clients>('clients')
    },
    client: {
      type: ClientType,
      args: { id: { type: NonNullID } },
      async resolve(parent, args: Pick<Client, 'id'>) {
        return await findItem('clients', 'id', args.id)
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve: async () => await useStorage().getItem<Projects>('projects')
    },
    project: {
      type: ProjectType,
      args: { id: { type: NonNullID } },
      resolve: async (parent, args: Pick<Project, 'id'>) => {
        return await findItem('projects', 'id', args.id)
      },
    },
  },
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: { type: NonNullString },
        email: { type: NonNullString },
        phone: { type: NonNullString }
      },
      async resolve(parent, args: Omit<Client, 'id'>) {
        const newClient: Client = {
          ...args,
          id: uuidv4().split('-').pop() as string
        }

        return await setItem('clients', newClient)
      }
    },
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: NonNullID }
      },
      async resolve(parent, args: Pick<Client, 'id'>) {
        return await deleteItem('clients', args.id)
      }
    },
    addProject: {
      type: ProjectType,
      args: {
        name: { type: NonNullString },
        description: { type: NonNullString },
        status: {
          type: ProjectStatus,
          defaultValue: 'Not Started'
        },
        clientId: { type: NonNullID }
      },
      async resolve(parent, args: Omit<Project, 'id'>) {
        const newProject: Project = {
          ...args,
          id: uuidv4().split('-').pop() as string
        }

        return await setItem('projects', newProject)
      }
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: NonNullID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: ProjectStatus,
          defaultValue: 'Not Started'
        },
        clientId: { type: GraphQLID }
      },
      async resolve(parent, args: Project) {

        return await setItem('projects', args, 'update')
      }
    },
    deleteProject: {
      type: ClientType,
      args: {
        id: { type: NonNullID }
      },
      async resolve(parent, args: Pick<Project, 'id'>) {
        return await deleteItem('projects', args.id)
      }
    }
  }
})

export const schema = new GraphQLSchema({
  query,
  mutation
});

async function findItem(type: 'clients' | 'projects', key: 'id' | 'clientId', value: string) {

  const storage: Clients | Projects | null = await useStorage().getItem(type)
  if (storage) {
    return storage.find((i: any) => i[key] === value) || null
  }
  return null
}

async function setItem(type: 'clients' | 'projects', value: Client | Project, action: 'create' | 'update' = 'create') {
  const storage: Clients | Projects | null = await useStorage().getItem(type)

  if (storage) {
    switch (type) {
      case 'clients':
        const clients = storage as Clients
        let currentClient = value as Client

        if (action === 'create') {
          if (clients.find(p => p.email === currentClient.email)) throw createError('Client already exist')

          clients.unshift(currentClient)
        } else {
          const idx = clients.findIndex(item => item.id === currentClient.id)

          if (idx === -1) throw createError('Client does not exist')

          currentClient = {
            ...clients[idx],
            ...currentClient
          }
          clients.splice(idx, 1, currentClient)
        }

        await useStorage().setItem('clients', clients)

        return currentClient
      case 'projects':
        const projects = storage as Projects
        let currentProject = value as Project

        if (action === 'create') {
          if (projects.find(p => p.name === currentProject.name)) throw createError('Project already exist')

          projects.unshift(currentProject)
        } else {
          const idx = projects.findIndex(item => item.id === currentProject.id)

          if (idx === -1) throw createError('Project does not exist')

          currentProject = {
            ...projects[idx],
            ...currentProject
          }
          projects.splice(idx, 1, currentProject)
        }

        await useStorage().setItem('projects', projects)

        return currentProject

      default:
        throw createError({
          statusCode: 403,
          statusMessage: 'Type of Item not valid',
          message: 'Type of Item not valid',
        })

    }
  }
}

async function deleteItem(type: 'clients' | 'projects', id: string) {
  const storage: Clients | Projects | null = await useStorage().getItem(type)

  if (storage) {
    const idx = storage.findIndex(i => i.id === id)
    if (idx !== -1) {
      const [item] = storage.splice(idx, 1)
      await useStorage().setItem(type, storage)

      if (type === 'clients') {
        let projects: Projects | null = await useStorage().getItem('projects')
        if (projects) {
          if (projects.find(p => p.clientId === id)) {
            projects = projects.filter(p => p.clientId !== id)
            await useStorage().setItem('projects', projects)
          }
        }
      }

      return item
    }
    throw createError("Item can't be found.")
  }
  throw createError("Storage it's empty.")
}