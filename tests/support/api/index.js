require ('dotenv').config();
import { expect } from '@playwright/test';

export class Api {
    constructor(request) {
        this.baseApi = process.env.BASE_API;
        this.request = request;
        this.token = '';
    }

    async setToken() {
        const response = await this.request.post(this.baseApi + '/sessions', {
            data: {
                email: 'admin@zombieplus.com',
                password: 'pwd123'
            }
        });
        expect(response.ok()).toBeTruthy();
        const body = JSON.parse(await response.text());
        this.token = body.token;
    }

    async newLead(name, email) {
        const newLead = await this.request.post(this.baseApi + '/leads', {
            data: {
                name: name,
                email: email
            }
        });
        expect(newLead.ok()).toBeTruthy();
    }

    async postMovie(movie) {
        await this.setToken();

        const response = await this.request.post(this.baseApi + '/movies', {
            headers: {
                Authorization: `Bearer ${this.token}`,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            multipart: {
                title: movie.title,
                overview: movie.overview,
                company_id: '3a856563-c987-405c-88e0-b0307472222e',
                release_year: movie.release_year,
                featured: movie.featured,
            }
        });
    }

    async postSerie(tvshow) {
        await this.setToken();

        const response = await this.request.post(this.baseApi + '/tvshows', {
            headers: {
                Authorization: `Bearer ${this.token}`,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            multipart: {
                title: tvshow.title,
                overview: tvshow.overview,
                company_id: '3a856563-c987-405c-88e0-b0307472222e',
                release_year: tvshow.release_year,
                seasons: tvshow.season.toString(),
                featured: tvshow.featured
            }
        })
    }
}