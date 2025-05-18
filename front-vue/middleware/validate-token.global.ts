export default defineNuxtRouteMiddleware(async to => {
    if (to.path === '/login' || to.path === '/register') {
        return;
    }
    if (!localStorage.getItem('token')) {
        return navigateTo('/login?redirect=' + to.path);
    }
    const {$apiClient} = useNuxtApp();

    async function checkLogin() {
        try {
            const res = await $apiClient.get("/validate");
            if (!res || !res.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return navigateTo('/login?redirect=' + to.path);
            }
            
            // Si l'utilisateur est un admin alors le redirige vers la page d'admin
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.is_admin && to.path !== '/admin' && !isAdminColocMode()) {
                return navigateTo('/admin');
            }
        } catch (e) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return navigateTo('/login?redirect=' + to.path);
        }
    }
    
    function isAdminColocMode() {
        return localStorage.getItem('admin_real_user') !== null;
    }

    await checkLogin();
});