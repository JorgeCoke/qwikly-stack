# Super Qwik Stack ⚡️

Delightful, overpowered, beautifully handcrafted web framework template, built on top of Qwik, seasoned with modern tools.

## What's included?

- [Qwik City](https://qwik.builder.io/) framework
- [Qwik Icons](https://qwik.builder.io/docs/integrations/icons/) included
- [Modular Forms](https://qwik.builder.io/docs/integrations/modular-forms/) integration
- [Tailwind](https://tailwindcss.com/) of course
- [Lucia Auth](https://lucia-auth.com/) v2
- [Kysely](https://kysely.dev/) + SQLite
- [Zod](https://zod.dev/) validation
- [MDX](https://qwik.builder.io/docs/guides/mdx/) support
- SignUp + LogIn + LogOut flow
- CRUD users example

## Set up

```
npm ci          // Install dependencies
npm db:reset    // Clean and executes the migrations required to make your database reflect the state of your schemas
npm run serve   // Launch project locally
```

---

## Project Structure

This project is using Qwik with [QwikCity](https://qwik.builder.io/qwikcity/overview/). QwikCity is just an extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory-based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs](https://qwik.builder.io/qwikcity/routing/overview/) for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more info.

## Add Integrations and deployment

Use the `npm run qwik add` command to add additional integrations. Some examples of integrations includes: Cloudflare, Netlify or Express Server, and the [Static Site Generator (SSG)](https://qwik.builder.io/qwikcity/guides/static-site-generation/).

```shell
npm run qwik add # or `yarn qwik add`
```

## Development

Development mode uses [Vite's development server](https://vitejs.dev/). The `dev` command will server-side render (SSR) the output during development.

```shell
npm start # or `yarn start`
```

> Note: during dev mode, Vite may request a significant number of `.js` files. This does not represent a Qwik production build.

## Preview

The preview command will create a production build of the client modules, a production build of `src/entry.preview.tsx`, and run a local server. The preview server is only for convenience to preview a production build locally and should not be used as a production server.

```shell
npm run preview # or `yarn preview`
```

## Production

The production build will generate client and server modules by running both client and server build commands. The build command will use Typescript to run a type check on the source code.

```shell
npm run build # or `yarn build`
```
