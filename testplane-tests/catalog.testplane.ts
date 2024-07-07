describe('На странице каталог', () => {
	it('у первого товара есть название, цена и ссылка на страницу с подробной информацией о товаре', async ({
		browser,
	}) => {
		await browser.url('http://localhost:3000/hw/store/catalog');
		const responses = await Promise.all([
			(await browser.$('.Catalog .ProductItem-Name')).getText(),
			await browser.$('.Catalog .ProductItem-Price').getText(),
			await browser.$('.Catalog .ProductItem-DetailsLink').getText(),
		]);

		expect(responses[0]).not.toBe('');
		expect(responses[1]).not.toBe('');
		expect(responses[2]).not.toBe('');
	});
});
