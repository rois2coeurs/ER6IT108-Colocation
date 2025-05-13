<template>
  <NuxtLayout title="Acceuil">
    <Card title="Bienvenue dans l'application de Colocation" icon="mdi:home-group" :display-button="false">
      <template #default>
        <p class="intro-text">Simplifiez la gestion de votre colocation: partagez les dépenses, suivez les versements et organisez vos achats.</p>
        
        <h3 class="section-title">Nos fonctionnalités</h3>
        
        <div class="feature-section">
          <h4>Accueil</h4>
          <p>
            La page d'accueil vous présente l'ensemble des fonctionnalités disponibles dans l'application et sert de point d'entrée pour les nouveaux utilisateurs.
            Cette page vous donne une vue d'ensemble sur les différentes sections de l'application pour faciliter votre navigation.
          </p>
        </div>
        
        <div class="feature-section">
          <h4>Colocation</h4>
          <p>
            Gérez facilement votre espace de vie partagé avec vos colocataires.
            Cette page vous permet de créer une nouvelle colocation, de rejoindre une colocation existante, ou de gérer votre colocation actuelle.
          </p>  
        </div>
        
        <div class="feature-section">
          <h4>Cagnotte</h4>
          <p>Mettez en place un système de cagnotte commune pour financer vos achats partagés. Dans cette section, vous pouvez créer une cagnotte, suivre le solde actuel, ajouter des fonds et visualiser l'historique complet des contributions de chaque membre de la colocation (contributions qui sont par ailleurs datées).</p>
        </div>
        
        <div class="feature-section">
          <h4>Versement</h4>
          <p>Effectuez et suivez les transferts d'argent entre colocataires. Cette fonctionnalité vous permet d'envoyer de l'argent à vos colocataires, de garder une trace de tous les versements effectués, et de consulter votre historique personnel de transactions pour une meilleure gestion de vos finances.</p>
        </div>
        
        <div class="feature-section">
          <h4>Paiement</h4>
          <p>
            Enregistrez et gérez tous vos achats liés à la colocation. Cette section vous permet de déclarer un nouvel achat, d'utiliser la cagnotte commune pour les dépenses partagées, et de visualiser l'historique complet de tous les achats effectués par l'ensemble des colocataires 
            (n'hésitez pas à utiliser le petit bouton en haut à droite de "Historique de vos achats" pour rechercher avec filtre et ordre personnalisés).</p>
        </div>
      </template>
    </Card>
    
    <Card title="Technologies utilisées" icon="mdi:code-tags" :display-button="false">
      <template #default>
        <div class="tech-section">
          <h4>Frontend</h4>
          <ul>
            <li><strong>Vue.js / Nuxt.js 3</strong> - Framework JavaScript progressif pour la construction d'interfaces utilisateur</li>
            <li><strong>TypeScript</strong> - Surensemble de JavaScript ajoutant des types statiques</li>
            <li><strong>Nuxt Icon</strong> - Intégration d'icônes</li>
            <li><strong>Nuxt Fonts</strong> - Gestion des polices d'écriture</li>
          </ul>
        </div>
        
        <div class="tech-section">
          <h4>Backend</h4>
          <ul>
            <li><strong>Bun.js</strong> - Runtime JavaScript</li>
            <li><strong>TypeScript</strong> - Pour du backend</li>
            <li><strong>PostgreSQL</strong> - Système de gestion de base de données relationnelle</li>
          </ul>
        </div>
        
        <div class="tech-section">
          <h4>Outils de développement</h4>
          <ul>
            <li><strong>Docker</strong> - Pour la BD</li>
            <li><strong>Git/GitHub</strong> - Gestion des versions et surtout les issues qu'il manque à Thor</li>
          </ul>
        </div>
      </template>
    </Card>
    
    <Card title="Structure du projet" icon="mdi:folder-outline" :display-button="false">
      <template #default>
        <pre class="structure">

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

        </pre>
        <p>À la date du 13 mai 2025.</p>
      </template>
    </Card>
  </NuxtLayout>
</template>

<script setup lang="ts">
// No specific logic needed for the home page but it's a good place to put some global setup if needed, comme ça c'est fait
</script>

<style scoped>
.intro-text {
  font-size: 18px;
  margin-bottom: 25px;
  color: #071013;
}

.section-title {
  font-size: 20px;
  margin-bottom: 15px;
  color: #EB5160FF;
  border-bottom: 1px solid #f1f1f1;
  padding-bottom: 5px;
}

.feature-section {
  margin-bottom: 20px;
}

.feature-section h4 {
  font-size: 18px;
  margin-bottom: 5px;
  color: #071013;
}

.tech-section {
  margin-bottom: 20px;
}

.tech-section h4 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #071013;
}

.tech-section ul {
  padding-left: 20px;
}

.tech-section li {
  margin-bottom: 5px;
}

.structure {
  font-family: monospace;
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  font-size: 14px;
}
</style>