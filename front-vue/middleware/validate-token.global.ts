export default defineNuxtRouteMiddleware(async to => {
  // Si on est sur les pages de login ou register, pas besoin de vérification
  if (to.path === '/login' || to.path === '/register') {
    return;
  }
  
  // Vérifier la présence du token
  if (!localStorage.getItem('token')) {
    return navigateTo('/login?redirect=' + to.path);
  }
  
  const {$apiClient} = useNuxtApp();
  
  // Vérifier si l'utilisateur est en mode admin coloc
  const isAdminColocMode = localStorage.getItem('admin_coloc_id') !== null;
  
  // Vérifier si l'utilisateur est un admin
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.is_admin === true;
  
  // Rediriger les admins vers la page d'admin sauf s'ils sont en mode admin coloc
  // ou s'ils sont déjà sur la page admin
  if (isAdmin && !isAdminColocMode && to.path !== '/admin') {
    return navigateTo('/admin');
  }
  
  // Vérifier la validité du token
  try {
    const res = await $apiClient.get("/validate");
    if (!res || !res.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('admin_coloc_id');
      return navigateTo('/login?redirect=' + to.path);
    }
  } catch (e) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin_coloc_id');
    return navigateTo('/login?redirect=' + to.path);
  }
});