import { expect } from '@playwright/test';

export class MoviesPage {
    constructor(page){
        this.page = page;
    }

    async isLogged(){
        await this.page.waitForLoadState('networkidle');
        await expect(this.page).toHaveURL(/admin\/movies/);
    }
}