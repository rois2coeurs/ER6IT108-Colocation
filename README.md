# URL du site Web
https://coloc.valentinraillard.fr/

# Login
## Login Admin

## Login Manager

## Login User

# Install and run the web app

## Docker
### Deploy
You need to have Docker and Docker Compose installed on your machine.

You can modify the docker-compose.yml file to change the database name, user, and password or the backend url and all the ports.

By default, the backend is on port 5000 and the frontend on port 3000. (http://localhost:3000)

```bash
docker-compose up -d
```

### Development
There also is a docker-compose.dev.yml file for development.

```bash
docker-compose -f docker-compose.dev.yml up -d
```

# Technologies utilisées

## Frontend
- **Vue.js / Nuxt.js 3** - Framework JavaScript progressif pour la construction d'interfaces utilisateur
- **TypeScript** - Surensemble de JavaScript ajoutant des types statiques

## Backend
- **Bun.js** - Runtime JavaScript
- **TypeScript** - Pour du backend
- **PostgreSQL** - Système de gestion de base de données relationnelle

## Outils de développement
- **Docker** - Pour la BD
- **Git/GitHub** - Gestion des versions et surtout les issues qu'il manque à Thor
