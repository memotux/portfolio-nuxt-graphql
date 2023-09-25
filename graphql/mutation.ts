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
  mutation addProject($name: String!, $description: String!, $status: String!, $clientId: String!) {
    addProject(name: $name, description: $description, status: $status, clientId: $clientId) {
      id
      name
      description
      status
    }
  }
`