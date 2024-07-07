import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Application } from '../../src/client/Application';
import { CartApi, ExampleApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';

const basename = '/hw/store';
const api = new ExampleApi(basename);
const cart = new CartApi();

describe('В шапке', () => {
	it('отображаются ссылки на страницы магазина и ссылка на корзину', async () => {
		const app = (
			<MemoryRouter initialEntries={[basename]} basename={basename}>
				<Provider store={initStore(api, cart)}>
					<Application />
				</Provider>
			</MemoryRouter>
		);

		const { container } = render(app);
		const header = container.querySelector('.navbar');
		const links = header.querySelectorAll('.nav-link');
		// страницы магазина
		expect(links[0]).toHaveAttribute('href', '/hw/store/catalog');
		expect(links[1]).toHaveAttribute('href', '/hw/store/delivery');
		expect(links[2]).toHaveAttribute('href', '/hw/store/contacts');
		// корзина
		expect(links[3]).toHaveAttribute('href', '/hw/store/cart');
	});

	it('название магазина — ссылка на главную страницу', async () => {
		const app = (
			<MemoryRouter initialEntries={[basename]} basename={basename}>
				<Provider store={initStore(api, cart)}>
					<Application />
				</Provider>
			</MemoryRouter>
		);

		const { container } = render(app);
		const header = container.querySelector('.navbar');
		const title = header.querySelector('.Application-Brand');
		expect(title).toHaveAttribute('href', '/hw/store');
	});

	it('рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async () => {
		jest.spyOn(cart, 'getState').mockImplementation(() => {
			return {
				'0': { name: 'Gorgeous kogtetochka', count: 2, price: 798 },
				'1': { name: 'Modern kogtetochka', count: 1, price: 290 },
				'2': { name: 'Generic kogtetochka', count: 1, price: 31 },
			};
		});

		const app = (
			<MemoryRouter initialEntries={[basename]} basename={basename}>
				<Provider store={initStore(api, cart)}>
					<Application />
				</Provider>
			</MemoryRouter>
		);

		const { container } = render(app);
		await waitFor(async () => {
			const carts = container.querySelectorAll('.navbar-nav .nav-link');
			const cartText = carts[carts.length - 1].textContent;
			expect(cartText).toBe('Cart (3)');
		});
	});
});
