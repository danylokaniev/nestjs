import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
	controllers: [ProductController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: ProductModule,
				schemaOptions: {
					collection: 'Product',
				},
			},
		]),
	],
	providers: [ProductService],
})
export class ProductModule {}