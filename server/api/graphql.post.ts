// https://github.com/graphql/graphql-http#start-the-server

import { createHandler } from 'graphql-http/lib/use/http';
import { schema } from '@/server/schema';

// Create the GraphQL over HTTP Node request handler
const handler = createHandler({ schema });

export default defineEventHandler((event) => {
  return handler(event.node.req, event.node.res)
})