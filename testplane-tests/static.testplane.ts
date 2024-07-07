describe('Статическое содержимое у', () => {
	beforeEach(async ({ browser }) => {
		await browser.setWindowSize(1200, 800);

		await browser.execute(() => {
			const style = document.createElement('style');
			style.innerHTML = `
        * {
          transition: none !important;
          animation: none !important;
        }
      `;
			document.head.appendChild(style);
		});
	});
	it('главная', async ({ browser }) => {
		await browser.url('http://localhost:3000/hw/store');
		const homePage = await browser.$('.Home');
		await homePage.waitForDisplayed();
		await homePage.assertView('plain', {
			captureElementFromTop: true,
		});
	});
	it('условия доставки', async ({ browser }) => {
		await browser.url('http://localhost:3000/hw/store/delivery');
		const deliveryPage = await browser.$('.Delivery');
		await deliveryPage.waitForDisplayed();
		await deliveryPage.assertView('plain', {
			captureElementFromTop: true,
		});
	});
	it('контакты', async ({ browser }) => {
		await browser.url('http://localhost:3000/hw/store/contacts');
		const contactPage = await browser.$('.Contacts');
		await contactPage.waitForDisplayed();
		await contactPage.assertView('plain', {
			captureElementFromTop: true,
		});
	});
});
