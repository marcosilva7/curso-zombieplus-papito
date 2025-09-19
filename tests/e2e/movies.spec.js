import { expect, test } from '../support';

const data = require('../support/fixtures/movies.json');
const {executeSQL} = require ('../support/database.js');

test.beforeAll(async () => {
    await executeSQL(`DELETE FROM movies`);
});

test ('Deve cadastrar um novo filme', async ({ page }) => {
    const movie = data.create;

    await page.login.do('admin@zombieplus.com', 'pwd123');

    await page.movies.create(movie);
    await page.toast.containText('Cadastro realizado com sucesso!');
});

test ('Realiza tentativa de cadastrar com o mesmo título', async ({ page, request }) => {
    const movie = data.duplicate;
    await request.api.setToken()

    await page.login.do('admin@zombieplus.com', 'pwd123');

    await page.movies.create(movie);
    await page.movies.create(movie);
    
    await page.toast.containText('Este conteúdo já encontra-se cadastrado no catálogo');
});

test ('Realiza tentativa de cadastrar filme sem preencher campos obrigatórios', async ({ page }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123');
    await page.movies.goForm();
    await page.movies.submit();

    await page.movies.alertHaveText([
        'Por favor, informe o título.', 
        'Por favor, informe a sinopse.', 
        'Por favor, informe a empresa distribuidora.', 
        'Por favor, informe o ano de lançamento.']);
});