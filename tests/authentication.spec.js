// @ts-check
const { test, expect } = require('@playwright/test');
import { faker } from '@faker-js/faker';
import existingUser from '../utils/user';
import goToRegistrationPage from '../helpers/goToRegistrationPage';
import createAccount from '../helpers/createAccount';

const BASE_URL = 'https://beta.bank-paradise.fr';

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
});

test.describe('Bank Paradise Authentication', () => {

  // create a account
  test('should create a account', async ({ page }) => {
    await goToRegistrationPage(page);

    // fill form
    await page.fill('input[name="name"]', faker.internet.displayName());
    await page.fill('input[name="email"]', faker.internet.email());
    await page.fill('input[name="password"]', faker.internet.password());

    // submit form
    await page.click('button[type="submit"]');

    // await "Bienvenue" text
    await page.waitForSelector('text=Bienvenue');

    // if new version is available click on update 
    if (await page.isVisible('text=Une nouvelle version est disponible')) {
      await page.click('text=Mettre à jour');
      await page.waitForSelector('text=Bienvenue');
    }

    // create screenshot
    await page.screenshot({ path: `./screenshots/auth/register-success.png` });
  });

  test('should create a account with name already taken', async ({ page }) => {

    await goToRegistrationPage(page);

    // fill form
    await page.fill('input[name="name"]', existingUser.name);
    await page.fill('input[name="email"]', faker.internet.email());
    await page.fill('input[name="password"]', faker.internet.password());

    // submit form
    await page.click('button[type="submit"]');

    // await "Pseudo déjà utilisé" text
    await page.waitForSelector('text=Pseudo déjà utilisé');

    // create screenshot
    await page.screenshot({ path: `./screenshots/auth/register-name-already-taken.png` });
  });

  test('should create a account with email already taken', async ({ page }) => {

    await goToRegistrationPage(page);

    // fill form
    await page.fill('input[name="name"]', faker.internet.userName());
    await page.fill('input[name="email"]', existingUser.email);
    await page.fill('input[name="password"]', faker.internet.password());

    // submit form
    await page.click('button[type="submit"]');

    // await "Adresse email déjà utilisée" text
    await page.waitForSelector('text=Adresse email déjà utilisée');

    // create screenshot
    await page.screenshot({ path: `./screenshots/auth/register-email-already-taken.png` });
  });

  test('should login with existing account', async ({ page }) => {
    await goToRegistrationPage(page);

    // create account
    const user = await createAccount(page);

    // complete login form
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);

    // submit form
    await page.click('button[type="submit"]');
    await page.waitForSelector('text=Bienvenue');

    // create screenshot
    await page.screenshot({ path: `./screenshots/auth/login-success.png` });
  });

  test('should login with wrong password', async ({ page }) => {
    await goToRegistrationPage(page);

    // create account
    const user = await createAccount(page);

    // complete login form
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', faker.internet.password());

    // submit form
    await page.click('button[type="submit"]');
    await page.waitForSelector('text=Identifiants invalides');

    // create screenshot
    await page.screenshot({ path: `./screenshots/auth/login-wrong-password.png` });
  });

  test('should logout', async ({ page }) => {
    await goToRegistrationPage(page);

    // create account
    const user = await createAccount(page);

    // complete login form
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);

    // submit form
    await page.click('button[type="submit"]');
    await page.waitForSelector('text=Bienvenue');

    // click on logout button
    await page.click('text=Déconnexion');

    // await "Connexion" text
    await page.waitForSelector('text=Connexion');

    // create screenshot
    await page.screenshot({ path: `./screenshots/auth/logout-success.png` });
  });
});

