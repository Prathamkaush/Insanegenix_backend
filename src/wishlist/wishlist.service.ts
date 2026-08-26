import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { calculateFinalPrice } from "../utils/pricing";

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
const items = await this.prisma.wishlist.findMany({
where: { userId },
orderBy: { createdAt: "desc" },
include: {
product: {
select: {
id: true,
title: true,
slug: true,
img1: true,
price: true,
discountType: true,
discountValue: true,
stock: true,
},
},
size: {
select: {
id: true,
size: true,
stock: true,
},
},
},
});

return items.map((item) => {
const finalPrice = calculateFinalPrice(
item.product.price,
item.product.discountType,
item.product.discountValue
);

return {
...item,
product: {
...item.product,
finalPrice, // 🔥 COMPUTED, NOT STORED
},
};
});
}

}


