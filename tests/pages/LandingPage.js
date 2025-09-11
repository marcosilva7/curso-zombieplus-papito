import { expect } from '@playwright/test';

export class LandingPage {

    constructor(page) {
        this.page = page;
    }
    
    async visit() {
        await this.page.goto('http://localhost:3000/');
    }

    async openLeadModal() {
        /*
            * Usando XPath
            * await page.click('//button[text()="Aperte o play... se tiver coragem"]');
        */
        await this.page.getByRole('button', { name: /Aperte o play/ }).click();
        await expect(this.page.getByTestId('modal').getByRole('heading'))
            .toHaveText('Fila de espera');
    }

    async submitLeadForm(name, email) {
        await this.page.locator('#name').fill(name);
        await this.page.locator('#email').fill(email); 
        // //button[t ext()="Quero entrar na fila!"]
        await this.page.getByTestId('modal')
            .getByText('Quero entrar na fila!')
            .click();
    }

    async alertHaveText(target) {
        await expect(this.page.locator('.alert'))
            .toHaveText(target);
    };
};