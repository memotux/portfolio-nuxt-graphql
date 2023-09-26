// https://github.com/graphql/graphql-http#start-the-server

import { createHandler } from 'graphql-http';
import { schema } from '@/server/schema';

// Create the GraphQL over HTTP Node request handler
const handler = createHandler({ schema });

export default defineEventHandler(async (event) => {
  // if (!req.url.startsWith('/graphql')) {
  //   return res.writeHead(404).end();
  // }

  try {
    // process token, authenticate user and attach it to the request
    // req.userId = await getUserFromCookies(req.headers.cookie);
    // // or
    // req.userId = await getUserFromAuthorizationHeader(
    //   req.headers.authorization,
    // );

    // respond with 401 if the user was not authenticated
    // if (!req.userId) {
    //   return res.writeHead(401, 'Unauthorized').end();
    // }

    const [body, init] = await handler({
      url: event.path,
      method: event.method,
      headers: getRequestHeaders(event),
      body: () => readBody(event),
      raw: event.node.req,
      context: event.context
    });
    setHeaders(event, { status: init.status, 'status-text': init.statusText, ...init.headers, })
    return body
  } catch (err) {
    console.error(err)

    throw createError({
      statusCode: 500,
      statusMessage: (err as Error)?.message || 'Error on GraphQL Request'
    })
  }
})