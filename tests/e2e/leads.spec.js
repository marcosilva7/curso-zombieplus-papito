import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

import { LandingPage } from '../pages/LandingPage'; 
import { Toast } from '../pages/Components';


let landingPage;
let toast;

test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page);
  toast = new Toast(page);
});

test('Deve cadastrar um lead na fila de espera', async ({ page }) => {
  const name = faker.person.fullName();
  const email = faker.internet.email();

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm(name, email);

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!';
  await toast.haveText(message);

});

test('Realiza tentativa de cadastro de lead já existente', async ({ page, request }) => {
  const name = faker.person.fullName();
  const email = faker.internet.email();

  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: name,
      email: email
    }
  });
  expect(newLead.ok()).toBeTruthy();

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm(name, email);

  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.';
  await toast.haveText(message);
});

test('Deve realizar tentiva de cadastro com e-mail inválido', async ({ page }) => {
  const name = 'Lead Teste';
  const email = 'marcosemail.com';

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm(name, email);

  await landingPage.alertHaveText('Email incorreto');
});

test('Deve realizar tentiva de cadastro com campo nome em branco', async ({ page }) => {
  const email = 'marcosemail@gmail.com';

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm('', email);

  await landingPage.alertHaveText('Campo obrigatório');
});

test('Deve realizar tentiva de cadastro com campo e-mail em branco', async ({ page }) => {
  const name = 'Lead Teste';

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm(name, '');

  await landingPage.alertHaveText('Campo obrigatório');
});

test('Deve realizar tentiva de cadastro com todos os campos em branco', async ({ page }) => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm('', '');

  await landingPage.alertHaveText(['Campo obrigatório', 'Campo obrigatório']);
});