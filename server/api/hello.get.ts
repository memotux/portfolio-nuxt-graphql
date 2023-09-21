import { createClient } from 'graphql-http';

const client = createClient({
  url: 'http://localhost:3000/api/graphql',
});

export default defineEventHandler(() => {
  return new Promise((resolve, reject) => {
    let result: any;

    client.subscribe(
      { query: 'query {hello}' },
      {
        next: (data) => (result = data),
        error: reject,
        complete: () => resolve(result),
      },
    )
  })
})