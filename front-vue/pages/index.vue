<template>
  <NuxtLayout title="Accueil">
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

    <Card title="Explication du bouton" icon="mdi:history" :display-button="false">
      <template #default>
        <p class="intro-text">Un bouton qui en a beaucoup sous le ventre : <Icon name="gridicons:fullscreen"/></p>
        <h3 class="section-title">L'incontournable !</h3>
        
        <div class="feature-section">
          <h4>L'historique de vos paiements à la vitesse de la lumière</h4>
          <p>
            La page des paiements est dotée d'un bouton aux allures de 4 flèches. En cliquant dessus vous vous retrouverez submergé de l'historique complet de vos paiements.
            Ce bouton vous permettra de filtrer et d'arranger l'ordre de vos entrées de paiements en un clin d'œil.
          </p>
        </div>
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