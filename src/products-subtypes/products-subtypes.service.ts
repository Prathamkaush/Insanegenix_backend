import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductSubtypeDto } from './dto/create-product-subtype.dto';
import { UpdateProductSubtypeDto } from './dto/update-product-subtype.dto';

@Injectable()
export class ProductSubtypesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateProductSubtypeDto) {
    return this.prisma.productSubtype.create({
      data: {
        name: dto.name,
        type: {
          connect: { id: dto.typeId },
        },
      },
    });
  }

  findAll(typeId?: number) {
    return this.prisma.productSubtype.findMany({
      where: typeId ? { typeId } : undefined,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const subtype = await this.prisma.productSubtype.findUnique({
      where: { id },
    });

    if (!subtype) {
      throw new NotFoundException('Product subtype not found');
    }

    return subtype;
  }

  async update(id: number, dto: UpdateProductSubtypeDto) {
    await this.findOne(id);

    return this.prisma.productSubtype.update({
      where: { id },
      data: {
        name: dto.name,
        typeId: dto.typeId,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.productSubtype.delete({
      where: { id },
    });
  }
}
