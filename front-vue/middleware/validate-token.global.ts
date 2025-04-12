export default defineNuxtRouteMiddleware(async to => {
    if (to.path === '/login' || to.path === '/register') {
        return;
    }
    if (!localStorage.getItem('token')) {
        return navigateTo('/login');
    }
    const {$apiClient} = useNuxtApp();

    async function checkLogin() {
        const res = await $apiClient.get("/validate");
        if (!res || !res.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return navigateTo('/login');
        }
    }

    await checkLogin();

});