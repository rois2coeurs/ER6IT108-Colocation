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
        } catch (e) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return navigateTo('/login?redirect=' + to.path);
        }
    }

    await checkLogin();

});