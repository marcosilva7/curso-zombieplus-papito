import { test } from '../support';

const data = require('../support/fixtures/tvshows.json');
const admin = require('../support/fixtures/adminAccess.json');

const {executeSQL} = require ('../support/database.js');

test.beforeAll(async () => {
    await executeSQL(`DELETE FROM tvshows`);
});

test ('Deve cadastrar uma nova série', async ({ page }) => {
    const tvshow = data.create; 

    await page.login.do(admin.email, admin.password);
    await page.series.create(tvshow);
    await page.popup.haveText(`A série '${tvshow.title}' foi adicionada ao catálogo.`);
});

test ('Realiza remoção de uma série', async ({page, request}) => {
    const tvshow = data.to_remove;

    await request.api.postSerie(tvshow);
    
    await page.login.do(admin.email, admin.password);

    await page.series.remove(tvshow.title);
    await page.popup.haveText('Série removida com sucesso.');
});

test ('Realiza tentativa de cadastrar com o mesmo título', async ({ page, request }) => {
    const tvshow = data.duplicate;
    await request.api.postSerie(tvshow);
    
    await page.login.do(admin.email, admin.password);

    await page.series.create(tvshow);    
    await page.popup.haveText(`O título '${tvshow.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`);
});

test ('Realiza tentativa de cadastrar série sem preencher campos obrigatórios', async ({ page }) => {
    await page.login.do(admin.email, admin.password);

    await page.series.accessRoute();
    await page.series.goForm();
    await page.series.submit();

    await page.series.alertHaveText([
        'Campo obrigatório', 
        'Campo obrigatório', 
        'Campo obrigatório', 
        'Campo obrigatório',
        'Campo obrigatório (apenas números)']);
});

test ('Realiza busca de séries que possuem o termo "zumbi"', async ({ page, request }) => {
    const tvshows = data.search;

    tvshows.data.forEach(async (series) => {
        await request.api.postSerie(series);
    });

    await page.login.do(admin.email, admin.password);
    await page.series.accessRoute();
    await page.series.search(tvshows.input);

    await page.series.tableHave(tvshows.outputs);
});