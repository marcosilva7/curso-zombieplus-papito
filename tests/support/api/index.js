

export class Api {
    constructor(request) {
        this.request = request;
        this.token = '';
    }

    async setToken() {
        const response = await this.request.post('http://localhost:3333/sessions', {
            data: {
                email: 'admin@zombieplus.com',
                password: 'pwd123'
            }
        });
        expect(response.ok()).toBeTruthy();
        const body = JSON.parse(await response.text());
        this.token = body.token;
    }

    async postMovie(movie) {
        const response = await this.request.post('http://localhost:3333/movies', {
            headers: {
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*',
                Authorization: `Bearer ${this.token}`
            },
            multipart: {
                title: movie.title,
                overview: movie.overview,
                company_id: movie.company_id,
                year: movie.year,
                feature: movie.feature,
                cover: movie.cover
            }
        });
    }
}