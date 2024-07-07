describe('На главной странице', () => {
	it('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер" ', async ({
		browser,
	}) => {
		await browser.url('http://localhost:3000/hw/store');
		await browser.setWindowSize(575, 1024);
		const desktopMenu = await browser.$('.Application-Menu');
		const displayProperty = await desktopMenu.getCSSProperty('display');
		expect(displayProperty.value).toBe('none');
	});
	it('при выборе элемента из меню "гамбургера", меню должно закрываться', async ({
		browser,
	}) => {
		await browser.url('http://localhost:3000/hw/store');
		await browser.setWindowSize(575, 1024);

		const hamburger = await browser.$('.Application-Toggler');
		await hamburger.click();
		let applicationMenuClasses = await browser
			.$('.Application-Menu')
			.getAttribute('class');
		expect(applicationMenuClasses.split(' ')).not.toContain('collapse');
		const link = await browser.$('.Application-Menu .nav-link');
		await link.click();
		applicationMenuClasses = await browser
			.$('.Application-Menu')
			.getAttribute('class');
		expect(applicationMenuClasses.split(' ')).toContain('collapse');
	});
});
