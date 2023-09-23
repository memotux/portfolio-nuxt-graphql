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