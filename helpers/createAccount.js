import { faker } from '@faker-js/faker';

export default async function createAccount(page) {
    const user = {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    // fill form
    await page.fill('input[name="name"]', user.name);
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);

    // submit form
    await page.click('button[type="submit"]');

    // await "Bienvenue" text
    await page.waitForSelector('text=Bienvenue');

    // if new version is available click on update 
    if (await page.isVisible('text=Une nouvelle version est disponible')) {
        await page.click('text=Mettre à jour');
        await page.waitForSelector('text=Bienvenue');
    }

    // click on logout button
    await page.click('text=Déconnexion');

    return user;
}