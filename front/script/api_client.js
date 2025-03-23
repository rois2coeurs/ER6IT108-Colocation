export class ApiClient {
    constructor(baseUrl = "http://localhost:8090", redirect = "login.html") {
        this.baseUrl = baseUrl;
        this.redirect =  redirect;
    }

    async request(method, path, data = null) {
        if (!localStorage.getItem('token')) {
            window.location.href = this.redirect;
            return;
        }
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        return await fetch(`${this.baseUrl}${path}`, options);
    }

    async get(path) {
        return this.request('GET', path);
    }

    async post(path, data) {
        return this.request('POST', path, data);
    }

    async put(path, data) {
        return this.request('PUT', path, data);
    }

    async delete(path) {
        return this.request('DELETE', path);
    }
}