import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async toggleWishlist(userId: number, productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException("Product not found");
    }

    const existing = await this.prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

    // ✅ REMOVE
    if (existing) {
      await this.prisma.wishlist.delete({
        where: { id: existing.id },
      });
      return { wished: false };
    }

    // ✅ ADD
    await this.prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });

    return { wished: true };
  }

  async isWishlisted(userId: number, productId: number) {
    const exists = await this.prisma.wishlist.findFirst({
      where: { userId, productId },
    });

    return {
      wished: !!exists,
      productId,
    };
  }

  async getUserWishlist(userId: number) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            type: true,
            subtype: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
