import axios, { AxiosInstance, AxiosResponse } from 'axios';

const BASE_URL: string = process.env.NODE_ENV === 'production'
    ? '/api/'
    : '//localhost:3030/api/';

const axiosInstance: AxiosInstance = axios.create({
    withCredentials: true
});

export const httpService = {
    async get(endpoint: string, data?: any): Promise<any> {
        return ajax(endpoint, 'GET', data);
    },
    async post(endpoint: string, data?: any): Promise<any> {
        return ajax(endpoint, 'POST', data);
    },
    async put(endpoint: string, data?: any): Promise<any> {
        return ajax(endpoint, 'PUT', data);
    },
    async delete(endpoint: string, data?: any): Promise<any> {
        return ajax(endpoint, 'DELETE', data);
    }
};

async function ajax(endpoint: string, method: string = 'GET', data: any = null): Promise<any> {
    try {
        const res: AxiosResponse = await axiosInstance({
            url: `${BASE_URL}${endpoint}`,
            method,
            data,
            params: (method === 'GET') ? data : null
        });
        return res.data;
    } catch (err) {
        console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data);
        console.dir(err);
        if (err.response && err.response.status === 401) {
            sessionStorage.clear();
            window.location.assign('/');
        }
        throw err;
    }
}


