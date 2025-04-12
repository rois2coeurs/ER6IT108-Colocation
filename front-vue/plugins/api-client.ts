// front-vue/plugins/api-client.ts
import {defineNuxtPlugin} from '#app';

class ApiClient {
    private readonly baseUrl: string;

    constructor() {
        const {api_url} = JSON.parse(localStorage.getItem('config') || '{}');
        this.baseUrl = api_url ? api_url : 'http://localhost:8090';
    }

    private async request(method: string, path: string, data: any = null) {
        if (!localStorage.getItem('token')) {
            window.location.href = '/login';
            throw new Error('No token found in localStorage');
        }

        const options: RequestInit = {
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

    async get(path: string) {
        return this.request('GET', path);
    }

    async post(path: string, data: any) {
        return this.request('POST', path, data);
    }

    async put(path: string, data: any) {
        return this.request('PUT', path, data);
    }

    async delete(path: string) {
        return this.request('DELETE', path);
    }
}

export default defineNuxtPlugin(() => {
    return {
        provide: {
            apiClient: new ApiClient(),
        },
    };
});