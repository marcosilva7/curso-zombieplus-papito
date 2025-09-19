import { expect } from '@playwright/test';

export class Movies {
    constructor(page){
        this.page = page;
    }

    async goForm(){
        /*
        * ^ -> Começa com a string
        * $ -> Termina com a string
        * * -> Contém a string
        */
        await this.page.locator('a[href$="register"]').click();
    }

    async submit(){
        await this.page.getByRole('button', {name: 'Cadastrar'}).click();
    }

    async create(movie){
        await this.goForm();

        await this.page.fill('#title', movie.title);
        // Utilizando getByLabel para pegar o campo pelo label
        // await this.page.getByLabel('Titulo do filme').fill(title);

        await this.page.fill('#overview', movie.overview);

        await this.page.locator('#select_company_id .react-select__indicator').click();
        // Caso precise debugar o html
        const html = await this.page.content();
        console.log(html);
        await this.page.locator('.react-select__option')
            .filter({ hasText: movie.company })
            .click();
        

        await this.page.locator('#select_year .react-select__indicator').click();
        await this.page.locator('.react-select__option')
            .filter({ hasText: movie.release_year })
            .click();

        await this.page.locator('input[name="cover"]')
            .setInputFiles('tests/support/fixtures' + movie.cover)

        if (movie.feature){
            await this.page.locator('.featured .react-switch').click();
        }

        await this.submit();
    }

    async alertHaveText(target) {
        await expect(this.page.locator('.alert'))
            .toHaveText(target);
    };
}