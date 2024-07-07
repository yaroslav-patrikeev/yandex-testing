describe('на странице с подробной информацией', () => {
	it('отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"', async ({
		browser,
	}) => {
		await browser.url('http://localhost:3000/hw/store/catalog/0');
		const fields = await Promise.all([
			await browser.$('.ProductDetails-Name').getText(),
			await browser.$('.ProductDetails-Description').getText(),
			await browser.$('.ProductDetails-Price').getText(),
		]);
		const [color, material] = await browser.$$('dl dd').map(el => el.getText());
		expect(fields[0]).not.toBe('');
		expect(fields[1]).not.toBe('');
		expect(fields[2]).not.toBe('');
		expect(color).not.toBe('');
		expect(material).not.toBe('');
	});
	it('если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество"', async ({
		browser,
	}) => {
		await browser.url('http://localhost:3000/hw/store/catalog/0');
		const button = await browser.$('.ProductDetails-AddToCart');
		await button.click();
		await button.click();
		await browser.url('http://localhost:3000/hw/store/cart');
		const count = await (await browser.$('.Cart-Count')).getText();
		expect(count).toBe('2');
	});
});
