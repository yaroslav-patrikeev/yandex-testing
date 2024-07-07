import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Form } from '../../src/client/components/Form';

describe('В форме в корзине', () => {
	const onSubmitMock = jest.fn();
	const basename = '/hw/store';
	beforeEach(() => {
		onSubmitMock.mockClear();
	});

	it('поле имя корректно валидируется', async () => {
		render(
			<MemoryRouter initialEntries={[basename]} basename={basename}>
				<Form onSubmit={onSubmitMock} />
			</MemoryRouter>
		);

		const nameInput = screen.getByLabelText('Name');
		fireEvent.change(nameInput, { target: { value: '' } });
		fireEvent.click(screen.getByText('Checkout'));

		await waitFor(() => {
			expect(nameInput).toHaveClass('is-invalid');
			expect(screen.getByText('Please provide your name')).toBeVisible();
			expect(onSubmitMock).not.toHaveBeenCalled();
		});

		fireEvent.change(nameInput, { target: { value: 'Ivan' } });
		fireEvent.click(screen.getByText('Checkout'));

		await waitFor(() => {
			expect(nameInput).not.toHaveClass('is-invalid');
			expect(onSubmitMock).not.toHaveBeenCalled();
		});
	});

	it('поле телефон корректно валидируется', async () => {
		render(
			<MemoryRouter initialEntries={[basename]} basename={basename}>
				<Form onSubmit={onSubmitMock} />
			</MemoryRouter>
		);

		const phoneInput = screen.getByLabelText('Phone');
		fireEvent.change(phoneInput, { target: { value: 'invalid_phone' } });
		fireEvent.click(screen.getByText('Checkout'));

		await waitFor(() => {
			expect(phoneInput).toHaveClass('is-invalid');
			expect(screen.getByText('Please provide a valid phone')).toBeVisible();
			expect(onSubmitMock).not.toHaveBeenCalled();
		});

		fireEvent.change(phoneInput, { target: { value: '89999999999' } });
		fireEvent.click(screen.getByText('Checkout'));

		await waitFor(() => {
			expect(phoneInput).not.toHaveClass('is-invalid');
			expect(onSubmitMock).not.toHaveBeenCalled();
		});
	});

	it('поле адрес корректно валидируется', async () => {
		render(
			<MemoryRouter initialEntries={[basename]} basename={basename}>
				<Form onSubmit={onSubmitMock} />
			</MemoryRouter>
		);

		const addressInput = screen.getByLabelText('Address');
		fireEvent.change(addressInput, { target: { value: '' } });
		fireEvent.click(screen.getByText('Checkout'));

		await waitFor(() => {
			expect(addressInput).toHaveClass('is-invalid');
			expect(screen.getByText('Please provide a valid address')).toBeVisible();
			expect(onSubmitMock).not.toHaveBeenCalled();
		});

		fireEvent.change(addressInput, { target: { value: 'my address' } });
		fireEvent.click(screen.getByText('Checkout'));

		await waitFor(() => {
			expect(addressInput).not.toHaveClass('is-invalid');
			expect(onSubmitMock).not.toHaveBeenCalled();
		});
	});
});
