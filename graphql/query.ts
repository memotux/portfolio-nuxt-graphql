export const getClients: string = gql`
  query getClients {
    clients {
      id
      name
      email
      phone
    }
  }
`