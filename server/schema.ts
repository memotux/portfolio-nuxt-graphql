// https://github.com/graphql/graphql-http#create-a-graphql-schema

import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLEnumType } from 'graphql';
import { v4 as uuidv4 } from 'uuid'
import { Project, Projects, Clients, Client } from "./types";

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

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    clients: {
      type: new GraphQLList(ClientType),
      resolve: async () => await useStorage().getItem<Clients>('clients')
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
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
      args: { id: { type: GraphQLID } },
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
        id: { type: new GraphQLNonNull(GraphQLID) }
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
          type: new GraphQLNonNull(new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            }
          })),
          defaultValue: 'Not Started'
        },
        clientId: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, args: Omit<Project, 'id'>) {
        const newProject: Project = {
          ...args,
          id: uuidv4().split('-').pop() as string
        }

        return await setItem('projects', newProject)
      }
    },
    deleteProject: {
      type: ClientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
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

async function setItem(type: 'clients' | 'projects', value: Client | Project) {
  const storage: Clients | Projects | null = await useStorage().getItem(type)

  if (storage) {
    switch (type) {
      case 'clients':
        if ((storage as Clients).find(item => item.email === (value as Client).email)) {
          return null
        }
        (storage as Clients).push(value as Client)
        await useStorage().setItem('clients', storage)
        return value
      case 'projects':
        if ((storage as Projects).find(item => item.name === (value as Project).name)) {
          return null
        }
        (storage as Projects).push(value as Project)
        await useStorage().setItem('projects', storage)
        return value

      default:
        return null
    }
  }
}

async function deleteItem(type: 'clients' | 'projects', id: string) {
  const storage: Clients | Projects | null = await useStorage().getItem(type)

  if (storage) {
    const idx = storage.findIndex(i => i.id === id)
    if (idx !== -1) {
      const item = storage.splice(idx, 1).pop() || null
      if (item) {
        await useStorage().setItem(type, storage)
        return item
      }
      return null
    }
    return null
  }
  return null
}