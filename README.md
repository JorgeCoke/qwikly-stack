# Super Qwik Stack ⚡️

Delightful, overpowered, beautifully handcrafted web framework template, built on top of Qwik, seasoned with modern tools.

## What's included?

- Awesome [Qwik City](https://qwik.builder.io/) framework
- [Modular Forms](https://qwik.builder.io/docs/integrations/modular-forms/) typesafe integration
- [Tailwind](https://tailwindcss.com/) of course
- Including [Lucide](https://lucide.dev/) icons
- Authentication with [Lucia Auth v2](https://lucia-auth.com/)
- [Kysely](https://kysely.dev/) SQL builder + SQLite
- Full typesafe development using [zod](https://zod.dev/)
- Automagically [MDX](https://mdxjs.com/) support including plugins
- [ ] TODO: [Stripe](https://stripe.com/) Payments and Subscriptions
- [ ] TODO: Mailer with [Resend](https://resend.com/)
- [Husky](https://github.com/typicode/husky) hooks
- Commit nomenclature rules with [commitizen](https://github.com/commitizen/cz-cli)
- Release management policy with [standard-version](https://github.com/conventional-changelog/standard-version)
- [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) linter and formatter
- [ ] TODO: Including outstanding [Three.JS](https://threejs.org/) scenes
- [ ] TODO: CI/CD with [Github Actions](https://github.com/features/actions)
- Fullstack deployments thanks to [Fly.io](https://fly.io) with [Fastify Adapter](https://qwik.builder.io/docs/deployments/node/#node-middleware)

## Features

- Authentication flow: SignUp + LogIn + Profile + LogOut + ResetPassword
- Payments: One time payment + Recurring Subscription payment
- Admin dashboard: including a "C.R.U.D Users" table
- Terms and conditions (MDX example)

## Set up

```
npm ci                  // Install dependencies
npm run husky:install   // Install Husky hooks
cp .env.example .env    // And fill .env with DEV environment variables if needed
npm db:migrate            // Creates a SQLite db file if not exists, and executes the migrations required to make your database reflect the state of your schemas
npm run db:seed         // It will seed your database with an admin user (Optional) (You can ignore the output message about "import.meta.env")
npm run dev             // Launch project locally (You can use "npm run start" too)
```

## How to run migrations

```
npm run db:migrate
```

## How to deploy to fly.io

- Install fly.io CLI: https://fly.io/docs/hands-on/install-flyctl/
- Create an app: `fly launch`
- Create a volume for SQLite (1 GB): `fly volumes create super_qwik_volume --size 1` (Now you can use "/super_qwik_volume_data/main.db" as DATABASE_URL)
- Create a ".env.prod" file a import your secrets running: `cat .env.prod | fly secrets import`
- Optional: Add public "build env variables" to Dockerfile files before build command (E.g: ENV PUBLIC_STRIPE_PUB="your_key")
- Deploy your app: `fly deploy`
- Visit your newly deployed app running: `fly open`

## Linter & Formatter

```
npm run lint      // Run Eslint
npm run fmt       // Run Prettier
```

## Git Commit with Commitizen

```
git add .          // Add files
npm run cz         // Commit with commitizen
```

## Check vulnerabilities

```
npm run audit       // Run better-npm-audit
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

## Fastify Server

This app has a minimal [Fastify server](https://fastify.io/) implementation. After running a full build, you can preview the build using the command:

```
npm run serve
```

Then visit [http://localhost:3000/](http://localhost:3000/)
