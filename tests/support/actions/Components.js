import { expect } from '@playwright/test';

export class Popup {
    constructor(page) {
        this.page = page;
    };

    async haveText(message) {
        const popup = this.page.locator('.swal2-html-container');
        await expect(popup).toHaveText(message);
        await this.confirm();
       
        /*
        * not.toBeVisible e toBeHidden
        * A diferença entre eles é que o toBeHidden verifica também o HTML, se o elemento está no DOM ou não
        * Já o not.toBeVisible verifica se o elemento não está visível, seja porque está invisível ou porque não está no DOM
        */
    };
    
    async confirm() {
        const btnConfirm = this.page.locator('.swal2-confirm');
        await btnConfirm.click();
    };
}