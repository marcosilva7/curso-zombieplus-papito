import { test, expect } from '../support';
import { faker } from '@faker-js/faker';

test('Deve cadastrar um lead na fila de espera', async ({ page }) => {
  const name = faker.person.fullName();
  const email = faker.internet.email();

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(name, email);

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!';
  await page.toast.containText(message);

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

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(name, email);

  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.';
  await page.toast.containText(message);
});

test('Deve realizar tentiva de cadastro com e-mail inválido', async ({ page }) => {
  const name = 'Lead Teste';
  const email = 'marcosemail.com';

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(name, email);

  await page.leads.alertHaveText('Email incorreto');
});

test('Deve realizar tentiva de cadastro com campo nome em branco', async ({ page }) => {
  const email = 'marcosemail@gmail.com';

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm('', email);

  await page.leads.alertHaveText('Campo obrigatório');
});

test('Deve realizar tentiva de cadastro com campo e-mail em branco', async ({ page }) => {
  const name = 'Lead Teste';

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(name, '');

  await page.leads.alertHaveText('Campo obrigatório');
});

test('Deve realizar tentiva de cadastro com todos os campos em branco', async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm('', '');

  await page.leads.alertHaveText(['Campo obrigatório', 'Campo obrigatório']);
});