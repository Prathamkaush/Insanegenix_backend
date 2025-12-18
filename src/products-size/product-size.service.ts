import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProductSizeService {
  constructor(private prisma: PrismaService) {}

  async setSizes(
    productId: number,
    sizes: { size: string; stock: number }[]
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    await this.prisma.productSize.deleteMany({
      where: { productId },
    });

    return this.prisma.productSize.createMany({
      data: sizes.map((s) => ({
        productId,
        size: s.size,
        stock: s.stock,
      })),
    });
  }

  async getSizes(productId: number) {
    return this.prisma.productSize.findMany({
      where: { productId },
      orderBy: { size: "asc" },
    });
  }
}
