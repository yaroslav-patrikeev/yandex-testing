import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';
import { InternalAxiosRequestConfig } from 'axios';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { CartApi, ExampleApi } from '../../src/client/api';
import { Catalog } from '../../src/client/pages/Catalog';
import { initStore } from '../../src/client/store';

const basename = '/hw/store';
const api = new ExampleApi(basename);
const cart = new CartApi();

describe('На странице каталог', () => {
	it('отображается сообщение, если товар добавлен в корзину', async () => {
		jest.spyOn(api, 'getProducts').mockImplementation(() => {
			return new Promise(res => {
				res({
					data: [{ id: 0, name: 'Unbranded kogtetochka', price: 228 }],
					status: 200,
					statusText: 'OK',
					headers: {},
					config: {
						headers: {},
					} as InternalAxiosRequestConfig,
				});
			});
		});
		jest.spyOn(cart, 'getState').mockImplementation(() => {
			return { '0': { name: 'Unbranded kogtetochka', count: 1, price: 228 } };
		});
		const app = (
			<MemoryRouter initialEntries={[basename]} basename={basename}>
				<Provider store={initStore(api, cart)}>
					<Catalog />
				</Provider>
			</MemoryRouter>
		);

		render(app);

		await waitFor(() => {
			const inCart = screen.getByText('Item in cart');
			expect(inCart).toBeInTheDocument();
		});
	});
});

afterEach(() => {
	jest.restoreAllMocks();
});
