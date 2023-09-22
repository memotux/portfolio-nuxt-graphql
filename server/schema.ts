// https://github.com/graphql/graphql-http#create-a-graphql-schema

import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } from 'graphql';
import { projects, clients } from "~/server/data";

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
    client: {
      type: ClientType,
      resolve: (parent) => {
        return clients.find(client => client.id === parent.clientId)
      }
    }
  })
})

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      clients: {
        type: new GraphQLList(ClientType),
        resolve: () => clients
      },
      client: {
        type: ClientType,
        args: { id: { type: GraphQLID } },
        resolve: (parent, args) => {
          return clients.find(client => client.id === args.id)
        },
      },
      projects: {
        type: new GraphQLList(ProjectType),
        resolve: () => projects
      },
      project: {
        type: ProjectType,
        args: { id: { type: GraphQLID } },
        resolve: (parent, args) => {
          return projects.find(project => project.id === args.id)
        },
      },
    },
  }),
});

