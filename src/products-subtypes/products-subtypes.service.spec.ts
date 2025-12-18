import { Test, TestingModule } from '@nestjs/testing';
import { ProductSubtypesService } from './products-subtypes.service';

describe('ProductSubtypesService', () => {
  let service: ProductSubtypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductSubtypesService],
    }).compile();

    service = module.get<ProductSubtypesService>(ProductSubtypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
