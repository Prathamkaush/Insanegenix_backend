import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string; // e.g. "Ethnic", "Western", "Party Wear"

  @IsInt()
  categoryId: number; // FK to Category
}
