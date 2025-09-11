import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MoviesPage } from '../pages/MoviesPage';
import { Toast } from '../pages/Components';

let loginPage;
let moviesPage;
let toast;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    moviesPage = new MoviesPage(page);
    toast = new Toast(page);
});

test('Deve logar como administrador', async ({ page }) => {
    await loginPage.visit();
    await loginPage.submitLoginForm('admin@zombieplus.com', 'pwd123');
    await moviesPage.isLogged();
});

test('Realiza tentativa de login com senha inválida', async ({ page }) => {
    await loginPage.visit();
    await loginPage.submitLoginForm('admin@zombieplus.com', 'senha123');

    const message = 'Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.';
    await toast.haveText(message);
});

test('Realiza tentativa de login sem preencher o campo e-mail', async ({ page }) => {
    await loginPage.visit();
    await loginPage.submitLoginForm('', 'pwd123');
    await loginPage.alertHaveText('Campo obrigatório');
});

test('Realiza tentativa de login com e-mail inválido', async ({ page }) => {
    await loginPage.visit();
    await loginPage.submitLoginForm('marcos.com', 'pwd123');
    await loginPage.alertHaveText('Email incorreto');
});

test('Realiza tentativa de login sem preencher o campo senha', async ({ page }) => {
    await loginPage.visit();
    await loginPage.submitLoginForm('admin@zombieplus.com', '');
    await loginPage.alertHaveText('Campo obrigatório');
});

test('Realiza tentativa de login sem preencher nenhum campo', async ({ page }) => {
    await loginPage.visit();
    await loginPage.submitLoginForm('', '');
    await loginPage.alertHaveText(['Campo obrigatório', 'Campo obrigatório ']);
});