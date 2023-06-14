
export default async function connectToAccount(page, user) {
    // complete login form
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);

    // submit form
    await page.click('button[type="submit"]');

    // if button "Déconnexion" is visible, it means that the login was successful
    await page.waitForSelector('text=Déconnexion');
}