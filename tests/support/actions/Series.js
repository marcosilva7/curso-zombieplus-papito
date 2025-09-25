import { expect } from '@playwright/test';

export class Series {
    constructor(page){
        this.page = page;
    }

    async accessRoute(){
        await this.page.goto('/admin/tvshows');
    }

    async goForm(){
        await this.page.locator('a[href="/admin/tvshows/register"]').click();
    }

    async submit(){
        await this.page.getByRole('button', {name: 'Cadastrar'}).click();
    }

    async create(tvshow){
        await this.accessRoute();
        await this.goForm();

        await this.page.fill('#title', tvshow.title);
        await this.page.fill('#overview', tvshow.overview);

        await this.page.locator('#select_company_id .react-select__indicator').click();
        await this.page.locator('.react-select__option')
            .filter({ hasText: tvshow.company })
            .click();
        
        await this.page.locator('#select_year .react-select__indicator').click();
        await this.page.locator('.react-select__option')
            .filter({ hasText: tvshow.release_year })
            .click();
        
        await this.page.locator('#seasons').fill(tvshow.season.toString());

        await this.page.locator('input[name="cover"]')
            .setInputFiles('tests/support/fixtures' + tvshow.cover);

        if (tvshow.featured){
            await this.page.locator('.featured .react-switch').click();
        }

        await this.submit();
    }

    async remove(title){
        await this.accessRoute();

        await this.page.getByRole('row', { name: title }).getByRole('button').click();
        await this.page.click('.confirm-removal');
    }

    async alertHaveText(target) {
        await expect(this.page.locator('.alert'))
            .toHaveText(target);
    };

    async tableHave(count) {
        const rows = this.page.getByRole('row');
        await expect(rows).toContainText(count);
    };

    async search(text) {
        await this.page.getByPlaceholder('Busque pelo nome').fill(text);
        await this.page.click('.actions button[type="submit"]');
    };
}