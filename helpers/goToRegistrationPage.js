const { expect } = require('@playwright/test');

export default async function goToRegistrationPage(page) {
    await page.click('text=Inscription');
    expect(page.url()).toBe("https://beta.bank-paradise.fr/auth/register");
}

