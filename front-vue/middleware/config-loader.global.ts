export default defineNuxtRouteMiddleware(async () => {
    if (localStorage.getItem('config')) return;
    const res = await fetch('../config.json');
    const data = await res.json();
    localStorage.setItem('config', JSON.stringify(data));
});

