import type { DocumentNode } from "graphql";

export const deleteClient: DocumentNode = gql`
  mutation deleteClient($id: ID!) {
    deleteClient(id: $id) {
      id
      name
      email
      phone
    }
  }
`

export const addClient: DocumentNode = gql`
  mutation addClient($name: String!, $email: String!, $phone: String!) {
    addClient(name: $name, email: $email, phone: $phone) {
      id
      name
      email
      phone
    }
  }
`
export const addProject: DocumentNode = gql`
  mutation addProject($name: String!, $description: String!, $status: ProjectStatus!, $clientId: ID!) {
    addProject(name: $name, description: $description, status: $status, clientId: $clientId) {
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
export const updateProject: DocumentNode = gql`
  mutation updateProject($id: ID!, $name: String, $description: String, $status: ProjectStatus, $clientId: ID) {
    updateProject(id: $id, name: $name, description: $description, status: $status, clientId: $clientId) {
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

export const deleteProject: DocumentNode = gql`
  mutation deleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`