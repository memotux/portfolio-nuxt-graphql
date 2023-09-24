import type { DocumentNode } from "graphql";

export const getClients: DocumentNode = gql`
  query getClients {
    clients {
      id
      name
      email
      phone
    }
  }
`

export const getProjects: DocumentNode = gql`
  query getProjects {
    projects {
      id
      name
      status
    }
  }
`

export const getProject: DocumentNode = gql`
  query getProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      client {
        id
        name
        email
        phone
      }
    }
  }
`