import express from 'express';
import request from 'supertest';

import { router } from '../../src/server/routes';

const app = express();
app.use(express.json());
app.use(router);

describe('Проверка api', () => {
	it('запрос checkout', async () => {
		const response = await request(app)
			.post('/api/checkout')
			.send({
				form: { name: '123', phone: '12312312312', address: '1' },
				cart: { '0': { name: 'Bespoke kogtetochka', count: 1, price: 50 } },
			})
			.expect('Content-Type', /json/)
			.expect(200);

		expect(response.body).toStrictEqual({ id: 1 });
	});
	it('запрос products/:id', async () => {
		const response = await request(app)
			.get('/api/products/1')
			.expect('Content-Type', /json/)
			.expect(200);

		expect(response.body.id).not.toBe(0);
	});
});
