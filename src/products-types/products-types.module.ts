import { Module } from '@nestjs/common';
import { ProductTypesController } from './products-types.controller';
import { ProductTypesService } from './products-types.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProductTypesController],
  providers: [ProductTypesService]
})
export class ProductsTypesModule {}
