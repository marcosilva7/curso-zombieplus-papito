import { test } from '../support';

test('Deve logar como administrador', async ({ page }) => {
    await page.login.visit();
    await page.login.submitLoginForm('admin@zombieplus.com', 'pwd123');
    await page.login.isLogged();
});

test('Realiza tentativa de login com senha inválida', async ({ page }) => {
    await page.login.visit();
    await page.login.submitLoginForm('admin@zombieplus.com', 'senha123');

    const message = 'Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.';
    await page.toast.containText(message);
});

test('Realiza tentativa de login sem preencher o campo e-mail', async ({ page }) => {
    await page.login.visit();
    await page.login.submitLoginForm('', 'pwd123');
    await page.login.alertHaveText('Campo obrigatório');
});

test('Realiza tentativa de login com e-mail inválido', async ({ page }) => {
    await page.login.visit();
    await page.login.submitLoginForm('marcos.com', 'pwd123');
    await page.login.alertHaveText('Email incorreto');
});

test('Realiza tentativa de login sem preencher o campo senha', async ({ page }) => {
    await page.login.visit();
    await page.login.submitLoginForm('admin@zombieplus.com', '');
    await page.login.alertHaveText('Campo obrigatório');
});

test('Realiza tentativa de login sem preencher nenhum campo', async ({ page }) => {
    await page.login.visit();
    await page.login.submitLoginForm('', '');
    await page.login.alertHaveText(['Campo obrigatório', 'Campo obrigatório']);
});