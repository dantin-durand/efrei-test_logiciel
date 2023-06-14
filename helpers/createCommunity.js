import { faker } from '@faker-js/faker';

export default async function createCommunity(page, user) {
    const communityName = faker.internet.userName();
    // click on "Créer une communautée"
    await page.click('text=Créer une communauté');

    // await input[placeholder="Nom de la communauté"]
    await page.waitForSelector('input[placeholder="Nom de la communauté"]');
    await page.fill('input[placeholder="Nom de la communauté"]', communityName);

    // select in selector "Devise" "EUR"
    await page.selectOption('select[name="currency"]', 'EUR');

    // write community description
    await page.fill('input[name="description"]', faker.lorem.paragraph());

    // submit form
    await page.click('button[type="submit"]');

    // await "COMPTE <username>" text
    await page.waitForSelector(`text=COMPTE ${user.name}`);

    return communityName;
}