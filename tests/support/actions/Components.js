import { expect } from '@playwright/test';

export class Toast {
    constructor(page) {
        this.page = page;
    }

    async containText(message) {
        const toast = this.page.locator('.toast');

        await expect(toast).toContainText(message);
        await expect(toast).not.toBeVisible({ timeout: 5000 });
       
        /*
        * Foi usado o not.toBeVisible, mas também existe o toBeHidden
        * A diferença entre eles é que o toBeHidden verifica também o HTML, se o elemento está no DOM ou não
        * Já o not.toBeVisible verifica se o elemento não está visível, seja porque está invisível ou porque não está no DOM
        */
    }
}