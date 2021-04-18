import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { getModelToken } from 'nestjs-typegoose';
import { ReviewModel } from './review.model';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
	let service: ReviewService;
	const exec = { exec: jest.fn() };
	const reviewRepositoryFactory = () => ({
		find: () => exec,
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReviewService,
				{
					useFactory: reviewRepositoryFactory,
					provide: getModelToken('ReviewModel'),
				},
			],
		}).compile();

		service = module.get<ReviewService>(ReviewService);
	});

	it('findbyProductId working', async () => {
		const id = new Types.ObjectId().toHexString();
		reviewRepositoryFactory()
			.find()
			.exec.mockReturnValue([{ productId: id }]);

		const res = await service.findbyProductId(id);
		expect(res[0].productId).toBe(id);
	});
});
