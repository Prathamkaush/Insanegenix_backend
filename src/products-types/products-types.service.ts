import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';

@Injectable()
export class ProductTypesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateProductTypeDto) {
    return this.prisma.productType.create({
      data: {
        name: dto.name,
        category: {
          connect: { id: dto.categoryId },
        },
      },
    });
  }

  findAll(categoryId?: number) {
  return this.prisma.productType.findMany({
    where: categoryId ? { categoryId } : undefined,
    orderBy: { id: 'asc' },
    include: {
      subtypes: {
        orderBy: { id: 'asc' },
      },
    },
  });
}


  async findOne(id: number) {
    const type = await this.prisma.productType.findUnique({
      where: { id },
    });

    if (!type) {
      throw new NotFoundException('Product type not found');
    }

    return type;
  }

  async update(id: number, dto: UpdateProductTypeDto) {
    await this.findOne(id);

    return this.prisma.productType.update({
      where: { id },
      data: {
        name: dto.name,
        categoryId: dto.categoryId,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.productType.delete({
      where: { id },
    });
  }
}
