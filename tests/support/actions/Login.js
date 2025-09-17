import { expect } from '@playwright/test';

export class Login {
    constructor(page) {
        this.page = page;
    }

    async visit (){
        await this.page.goto('http://localhost:3000/admin/login');
        await expect(this.page.locator('.login-form')).toBeVisible();
    }

    async submitLoginForm(email, password) {
        await this.page.fill('input[placeholder="E-mail"]', email);
        await this.page.fill('input[placeholder="Senha"]', password);
        await this.page.click('//button[text()="Entrar"]'); // xpath
        //await page.click('button', { hasText: 'Entrar'});
    }

    async isLogged(){
        await expect(this.page.locator('.logged-user')).toContainText('Olá');
    }    
    
    async alertHaveText(target) {
        const alert = this.page.locator('span[class$=alert]');
        await expect(alert).toHaveText(target);
    };   

    async do(email, password){
        await this.visit();
        await this.submitLoginForm(email, password);
        await this.isLogged();
    }
}
