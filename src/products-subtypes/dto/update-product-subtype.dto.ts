import { PartialType } from '@nestjs/mapped-types';
import { CreateProductSubtypeDto } from './create-product-subtype.dto';

export class UpdateProductSubtypeDto extends PartialType(CreateProductSubtypeDto) {}
