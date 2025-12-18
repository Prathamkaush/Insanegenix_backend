import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductSubtypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string; // e.g. "Kurtis", "Suits", "Sarees"

  @IsInt()
  typeId: number; // FK to ProductType
}
