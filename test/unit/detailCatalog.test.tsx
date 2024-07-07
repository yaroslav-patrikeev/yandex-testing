import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { InternalAxiosRequestConfig } from 'axios';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { CartApi, ExampleApi } from '../../src/client/api';
import { Application } from '../../src/client/Application';
import { initStore } from '../../src/client/store';

const basename = '/hw/store';
const api = new ExampleApi(basename);
const cart = new CartApi();

beforeEach(() => {
	jest.spyOn(api, 'getProductById').mockImplementation(() => {
		return new Promise(res => {
			res({
				data: {
					id: 0,
					name: 'Unbranded kogtetochka',
					description: 'Really Recycled kogtetochka for Chartreux',
					price: 55,
					color: 'green',
					material: 'Granite',
				},
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
		return {
			'0': { name: 'Rustic kogtetochka', count: 1, price: 731 },
		};
	});
});

describe('На странице c подробной информацией', () => {
	it('отображается сообщение, если товар добавлен в корзину', async () => {
		const app = (
			<MemoryRouter
				initialEntries={[`${basename}/catalog/0`]}
				basename={basename}
			>
				<Provider store={initStore(api, cart)}>
					<Application />
				</Provider>
			</MemoryRouter>
		);

		render(app);

		await waitFor(() => {
			const inCart = screen.getByText('Item in cart');
			expect(inCart).toBeInTheDocument();
		});
	});
	it('при каждом нажатии на кнопку данные добавляются в localStorage', async () => {
		const setState = jest.spyOn(cart, 'setState');
		const app = (
			<MemoryRouter
				initialEntries={[`${basename}/catalog/0`]}
				basename={basename}
			>
				<Provider store={initStore(api, cart)}>
					<Application />
				</Provider>
			</MemoryRouter>
		);

		render(app);
		await waitFor(() => {
			expect(screen.getByText('Add to Cart')).toBeInTheDocument();
		});
		const button = screen.getByText('Add to Cart');
		fireEvent.click(button);
		fireEvent.click(button);
		fireEvent.click(button);
		expect(setState).toHaveBeenCalledTimes(3);
	});
	it('верстка не изменилась', async () => {
		const app = (
			<MemoryRouter
				initialEntries={[`${basename}/catalog/0`]}
				basename={basename}
			>
				<Provider store={initStore(api, cart)}>
					<Application />
				</Provider>
			</MemoryRouter>
		);
		const { asFragment } = render(app);
		await waitFor(() => {
			expect(screen.getByText('Add to Cart')).toBeInTheDocument();
		});

		expect(asFragment()).toMatchSnapshot();
	});
});

afterEach(() => {
	jest.restoreAllMocks();
});
