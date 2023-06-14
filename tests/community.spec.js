const { test, expect } = require('@playwright/test');
import { faker } from '@faker-js/faker';
import goToRegistrationPage from '../helpers/goToRegistrationPage';
import createAccount from '../helpers/createAccount';
import connectToAccount from '../helpers/connectToAccount';
import createCommunity from '../helpers/createCommunity';

const BASE_URL = 'https://beta.bank-paradise.fr';

test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
});

test.describe('Bank Paradise Community', () => {

    test('should create a community', async ({ page }) => {
        await goToRegistrationPage(page);

        // create account
        const user = await createAccount(page);

        // connect To Account
        await connectToAccount(page, user);

        // click on "Créer une communautée"
        await page.click('text=Créer une communauté');

        // await input[placeholder="Nom de la communauté"]
        await page.waitForSelector('input[placeholder="Nom de la communauté"]');
        await page.fill('input[placeholder="Nom de la communauté"]', faker.internet.userName());

        // select in selector "Devise" "EUR"
        await page.selectOption('select[name="currency"]', 'EUR');

        // write community description
        await page.fill('input[name="description"]', faker.lorem.paragraph());

        // submit form
        await page.click('button[type="submit"]');

        // await "COMPTE <username>" text
        await page.waitForSelector(`text=COMPTE ${user.name}`);

        // create screenshot
        await page.screenshot({ path: `./screenshots/community/create-community.png` });
    });

    test('should receive invitation to join community', async ({ page }) => {
        await goToRegistrationPage(page);

        // create admin account
        const userAdmin = await createAccount(page);

        // connect To Account
        await connectToAccount(page, userAdmin);
        // create community
        const communityName = await createCommunity(page, userAdmin);
        await page.click('text=Déconnexion');

        // await "Connexion" text
        await page.waitForSelector('text=Connexion');
        await goToRegistrationPage(page);
        // create user to invite
        const userDefault = await createAccount(page);

        // connect with user admin
        await connectToAccount(page, userAdmin);

        // go to admin panel
        await page.click('text=Staff');

        // go to invitation page
        await page.click('text=Invitation');

        // invite user
        await page.fill('input[type="email"]', userDefault.email);
        await page.click('button[type="submit"]');
        // await "Invitation envoyé !" text
        await page.waitForSelector('text=Invitation envoyé !');
        await page.goto(BASE_URL);
        // logout and connect with userDefault
        await page.click('text=Déconnexion');

        await connectToAccount(page, userDefault);

        // check if invitation is present
        await page.waitForSelector(`text=${communityName}`);

        // create screenshot of invitation
        await page.screenshot({ path: `./screenshots/community/invitation.png` });

        // join community (click on second button)
        await page.click('button:nth-of-type(2)');

        // await "Bonjour <username>" text
        await page.waitForSelector(`text=Bonjour ${userDefault.name}`);
    });
});



