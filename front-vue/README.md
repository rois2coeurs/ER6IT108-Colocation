# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

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
pnpm dev

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
pnpm build

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
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Technologies utilisées

### Frontend
- **Vue.js / Nuxt.js 3** - Framework JavaScript progressif pour la construction d'interfaces utilisateur
- **TypeScript** - Surensemble de JavaScript ajoutant des types statiques
- **Nuxt Icon** - Intégration d'icônes
- **Nuxt Fonts** - Gestion des polices d'écriture

### Backend
- **Bun.js** - Runtime JavaScript
- **TypeScript** - Pour du backend
- **PostgreSQL** - Système de gestion de base de données relationnelle

### Outils de développement
- **Docker** - Pour la BD
- **Git/GitHub** - Gestion des versions et surtout les issues qu'il manque à Thor

    
## Structure du projet

ER6IT108-COLLOCATION/
├── back/
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── houseShareRoutes.ts
│   │   ├── purchaseRoutes.ts
│   │   ├── transferRoutes.ts
│   │   ├── usersRoutes.ts
│   │   └── sharedFundRoutes.ts
│   ├── helpers/
│   │   ├── authHelper.ts
│   │   └── tokenHelper.ts
│   ├── errors/
│   │   ├── SafeDisplayError.ts
│   │   └── UnauthorizedError.ts
│   ├── sql/
│   │   ├── migrations/
│   │   │   ├── 1_Creation.sql
│   │   │   ├── 2_Triggers.sql
│   │   │   ├── 3_FixHouseShare.sql
│   │   │   ├── 4_HouseShareTriggers.sql
│   │   │   └── 5_PurchaseHouseShare.sql
│   │   ├── deleter.sql
│   │   └── seeder.sql
│   └── tests/
│       ├── database.test.ts
│       └── tokenHelper.test.ts
└── front-vue/
    ├── components/
    │   ├── App/
    │   │   ├── Footer.vue
    │   │   ├── Header.vue
    │   │   └── NavBar.vue
    │   ├── Form/
    │   │   ├── ErrorBox.vue
    │   │   └── Input.vue
    │   ├── AdvancedTable.vue
    │   ├── Button.vue
    │   ├── Card.vue
    │   ├── Loader.vue
    │   └── Modal.vue
    ├── layouts/
    │   ├── auth.vue
    │   └── default.vue
    ├── middleware/
    │   ├── config-loader.global.ts
    │   └── validate-token.global.ts
    ├── pages/
    │   ├── house_share/
    │   │   ├── [id].vue
    │   │   └── index.vue
    │   ├── shared_fund/
    │   │   └── [id].vue
    │   ├── index.vue
    │   ├── login.vue
    │   ├── purchase.vue
    │   ├── register.vue
    │   ├── transfer.vue
    │   └── user.vue
    ├── plugins/
    │   └── api-client.ts
    ├── types/
    │   ├── house_share.d.ts
    │   ├── member.d.ts
    │   ├── purchase.d.ts
    │   └── transfer.d.ts
    └── utils/
        ├── get-form-data.ts
        └── get-user-id.ts
