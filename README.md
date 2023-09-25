# Portfolio Nuxt 3 GraphQL

## Server Side

- Use `graphql-http` to create `/api/graphql.post` endpoint.
- `/server/plugins/data` seed dummy data to Nuxt `useStorage` layer for "database" like system.

## Client Side

- Use Nuxt module `nuxt-apollo` for client petitions.
- Use Nuxt `useAsyncData` cache system with `useAsyncQuery` to `refreshNuxtData`.
- use Nuxt module `nuxt-quasar-ui` for UI Framework.

## Template

For application model, I use [Traversy Media](https://github.com/bradtraversy/project-mgmt-graphql) [GraphQL Crash Course with Full Stack MERN Project](https://youtu.be/BcLNfwF04Kw?si=uXXRlWSsdhOoRUyY), refactoring all component logic to VueJS and NuxtJS ecosystem.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
