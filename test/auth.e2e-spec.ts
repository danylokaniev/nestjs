import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Types, disconnect } from 'mongoose';

const loginDto = {
	login: 'TEST-EMAIL@gmail.com',
	password: 'TEST-EMAIL@gmail.com',
};

const wrongLodinDto = {
	login: 'THIS_USER_DOES_NOT_EXIST@gmail.com',
	password: 'TEST-EMAIL@gmail.com',
};

describe('Auth controller (e2e)', () => {
	let app: INestApplication;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/register (POST) success', async done => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.send(loginDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				const passwordHash = body.passwordHash;
				expect(passwordHash).toBeDefined();
				done();
			});
	});

	it('auth/login POST success', async done => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				token = body.access_token;
				expect(token).toBeDefined();
				done();
			});
	});

	it('auth/login POST fail', () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, password: 'wrong_password' })
			.expect(401);
	});

	it('auth/login POST user does not exist', () => {
		return request(app.getHttpServer()).post('/auth/login').send(wrongLodinDto).expect(401);
	});

	it(`auth/login POST fail (password isn't string)`, () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, password: 2123456 })
			.expect(400);
	});

	it(`auth/login POST fail (login isn't string)`, () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, login: 2123456 })
			.expect(400);
	});

	it('auth/login POST fail', () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, password: 'wrong_password' })
			.expect(401);
	});

	it('auth DELETE success', () => {
		return request(app.getHttpServer())
			.delete('/auth')
			.set('Authorization', 'Bearer ' + token)
			.expect(204);
	});

	afterAll(() => {
		disconnect();
	});
});
