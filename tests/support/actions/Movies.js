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
    
    async search(text) {
        await this.page.getByPlaceholder('Busque pelo nome').fill(text);
        await this.page.click('.actions button[type="submit"]');
    };

    async tableHave(count) {
        const rows = this.page.getByRole('row');
        await expect(rows).toContainText(count);
    };
    
    async remove(title) {
        // xpath: //td[text()="A Noite dos Mortos-Vivos"]/..//button
        await this.page.getByRole('row', {name: title})
            .getByRole('button').click();

        await this.page.click('.confirm-removal')
    };  
    
}