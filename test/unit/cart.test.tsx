import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { InternalAxiosRequestConfig } from 'axios';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { CartApi, ExampleApi } from '../../src/client/api';
import { Cart } from '../../src/client/pages/Cart';
import { initStore } from '../../src/client/store';

const basename = '/hw/store';
const api = new ExampleApi(basename);
const cart = new CartApi();

describe('На странице корзина', () => {
	it('при инициализации происходит обращение к localStorage', async () => {
		const getState = jest.spyOn(cart, 'getState');
		const app = (
			<MemoryRouter initialEntries={[basename]} basename={basename}>
				<Provider store={initStore(api, cart)}>
					<Cart />
				</Provider>
			</MemoryRouter>
		);

		render(app);

		await waitFor(() => {
			expect(getState).toHaveBeenCalledTimes(1);
		});
	});
	it('должна отображаться таблица с добавленными в нее товарами', async () => {
		jest.spyOn(cart, 'getState').mockImplementation(() => {
			return { '0': { name: 'Unbranded kogtetochka', count: 1, price: 228 } };
		});
		const app = (
			<MemoryRouter initialEntries={[basename]} basename={basename}>
				<Provider store={initStore(api, cart)}>
					<Cart />
				</Provider>
			</MemoryRouter>
		);

		const { container } = render(app);

		await waitFor(() => {
			const table = container.querySelector('.Cart-Table');
			expect(table).toBeInTheDocument();
		});
	});
	it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
		jest.spyOn(cart, 'getState').mockImplementation(() => {
			return { '0': { name: 'Unbranded kogtetochka', count: 1, price: 228 } };
		});
		const app = (
			<MemoryRouter initialEntries={[basename]} basename={basename}>
				<Provider store={initStore(api, cart)}>
					<Cart />
				</Provider>
			</MemoryRouter>
		);

		const { container } = render(app);

		await waitFor(() => {
			const button = container.querySelector('.Cart button');
			expect(button).toBeInTheDocument();
		});
		const table = container.querySelector('.Cart-Table');
		expect(table).toBeInTheDocument();
		const button = container.querySelector('.Cart button');
		fireEvent.click(button);
		expect(table).not.toBeInTheDocument();
	});
	it('для каждого добавленного товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа в таблице', async () => {
		jest.spyOn(cart, 'getState').mockImplementation(() => {
			return { '0': { name: 'Unbranded kogtetochka', count: 1, price: 228 } };
		});
		const app = (
			<MemoryRouter initialEntries={[basename]} basename={basename}>
				<Provider store={initStore(api, cart)}>
					<Cart />
				</Provider>
			</MemoryRouter>
		);

		const { container } = render(app);

		await waitFor(() => {
			const table = container.querySelector('.Cart-Table');
			expect(table).toBeInTheDocument();
		});
		const [product, price, count, total] = container
			.querySelector('.Cart-Table tbody tr')
			.querySelectorAll('td') as NodeListOf<HTMLTableCellElement>;
		expect(product.textContent).toBe('Unbranded kogtetochka');
		expect(price.textContent).toBe('$228');
		expect(count.textContent).toBe('1');
		expect(total.textContent).toBe('$228');
	});
	it('если корзина пустая, должна отображаться ссылка на каталог товаров', async () => {
		const app = (
			<MemoryRouter initialEntries={[basename]} basename={basename}>
				<Provider store={initStore(api, cart)}>
					<Cart />
				</Provider>
			</MemoryRouter>
		);

		const { container } = render(app);

		await waitFor(() => {
			const link = container.querySelector('.Cart a');
			expect(link.textContent).toBe('catalog');
			expect(link).toBeInTheDocument();
		});
	});

	it('форма отображает подтверждение отправки данных', async () => {
		jest.spyOn(cart, 'getState').mockImplementation(() => {
			return { '0': { name: 'Unbranded kogtetochka', count: 1, price: 228 } };
		});
		jest.spyOn(api, 'checkout').mockImplementation(() => {
			return new Promise(res => {
				res({
					data: { id: 1 },
					status: 200,
					statusText: 'OK',
					headers: {},
					config: {
						headers: {},
					} as InternalAxiosRequestConfig,
				});
			});
		});
		const app = (
			<MemoryRouter initialEntries={[basename]} basename={basename}>
				<Provider store={initStore(api, cart)}>
					<Cart />
				</Provider>
			</MemoryRouter>
		);

		const { container } = render(app);

		await waitFor(() => {
			const checkout = screen.getByText('Checkout');
			expect(checkout).toBeInTheDocument();
		});
		const inputs = container.querySelectorAll('.Form input');
		expect(inputs.length).toBe(2);
		const [name, phone] = inputs;
		const address = container.querySelector('.Form textarea');
		expect(address).toBeInTheDocument();

		fireEvent.change(name, { target: { value: 'Ivan' } });
		fireEvent.change(phone, { target: { value: '89999999999' } });
		fireEvent.change(address, { target: { value: 'my address' } });
		const button = container.querySelector('.Form button');
		expect(button).toBeInTheDocument();
		fireEvent.click(button);
		await waitFor(() => {
			const wellDone = container.querySelector('.alert-heading');
			expect(wellDone).toBeInTheDocument();
			expect(wellDone.textContent).toBe('Well done!');
		});
	});
	it('верстка в подтверждении отправки не изменилась', async () => {
		jest.spyOn(cart, 'getState').mockImplementation(() => {
			return { '0': { name: 'Unbranded kogtetochka', count: 1, price: 228 } };
		});
		jest.spyOn(api, 'checkout').mockImplementation(() => {
			return new Promise(res => {
				res({
					data: { id: 1 },
					status: 200,
					statusText: 'OK',
					headers: {},
					config: {
						headers: {},
					} as InternalAxiosRequestConfig,
				});
			});
		});
		const app = (
			<MemoryRouter initialEntries={[basename]} basename={basename}>
				<Provider store={initStore(api, cart)}>
					<Cart />
				</Provider>
			</MemoryRouter>
		);
		const { asFragment, container } = render(app);

		await waitFor(() => {
			const checkout = screen.getByText('Checkout');
			expect(checkout).toBeInTheDocument();
		});
		const inputs = container.querySelectorAll('.Form input');
		expect(inputs.length).toBe(2);
		const [name, phone] = inputs;
		const address = container.querySelector('.Form textarea');
		expect(address).toBeInTheDocument();

		fireEvent.change(name, { target: { value: 'Ivan' } });
		fireEvent.change(phone, { target: { value: '89999999999' } });
		fireEvent.change(address, { target: { value: 'my address' } });
		const button = container.querySelector('.Form button');
		expect(button).toBeInTheDocument();
		fireEvent.click(button);
		await waitFor(() => {
			const wellDone = container.querySelector('.alert-heading');
			expect(wellDone).toBeInTheDocument();
			expect(wellDone.textContent).toBe('Well done!');
			expect(asFragment()).toMatchSnapshot();
		});
	});
});

afterEach(() => {
	jest.restoreAllMocks();
});
