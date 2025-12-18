import { Test, TestingModule } from '@nestjs/testing';
import { ProductSubtypesController } from './products-subtypes.controller';

describe('ProductsSubtypesController', () => {
  let controller: ProductSubtypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductSubtypesController],
    }).compile();

    controller = module.get<ProductSubtypesController>(ProductSubtypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
