const { file_extension, api_url } = JSON.parse(localStorage.getItem('config'));

export class ApiClient {
    constructor() {
        this.baseUrl = api_url ? api_url : 'https://api.coloc.valentinraillard.fr';
        this.redirect =  file_extension ? "login.html" : "login";
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