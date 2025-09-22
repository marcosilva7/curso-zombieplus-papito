import { request } from 'http';
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
    await page.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`);
});

test ('Realiza remoção de um filme', async ({page, request}) => {
    const movie = data.to_remove;

    await request.api.postMovie(movie);
    await page.login.do('admin@zombieplus.com', 'pwd123');
  
    await page.movies.remove(movie.title);
    await page.popup.haveText('Filme removido com sucesso.');
});

test ('Realiza tentativa de cadastrar com o mesmo título', async ({ page, request }) => {
    const movie = data.duplicate;
    await request.api.postMovie(movie);

    await page.login.do('admin@zombieplus.com', 'pwd123');
    await page.movies.create(movie);    
    await page.popup.haveText(`O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`);
});

test ('Realiza tentativa de cadastrar filme sem preencher campos obrigatórios', async ({ page }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123');
    await page.movies.goForm();
    await page.movies.submit();

    await page.movies.alertHaveText([
        'Campo obrigatório', 
        'Campo obrigatório', 
        'Campo obrigatório', 
        'Campo obrigatório']);
});

test ('Realiza busca de filmes que possuem o termo "zumbi"', async ({ page, request }) => {
    const movies = data.search;

    movies.data.forEach(async (m) => {
        await request.api.postMovie(m);
    });

    await page.login.do('admin@zombieplus.com', 'pwd123');
    await page.movies.search(movies.input);

    await page.movies.tableHave(movies.outputs);
});