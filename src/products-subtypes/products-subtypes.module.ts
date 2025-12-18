import { Module } from '@nestjs/common';
import { ProductSubtypesController } from './products-subtypes.controller';
import { ProductSubtypesService } from './products-subtypes.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProductSubtypesController],
  providers: [ProductSubtypesService]
})
export class ProductsSubtypesModule {}
