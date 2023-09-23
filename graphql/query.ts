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