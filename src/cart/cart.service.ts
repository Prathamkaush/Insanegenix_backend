import { Injectable, NotFoundException , BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // GET /cart
  async getCart(userId: number) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true,
        size: true,
       },
    });

    return { items };
  }

  // POST /cart/add
async addToCart(
  userId: number,
  productId: number,
  sizeId?: number
) 

{

  const product = await this.prisma.product.findUnique({
    where: { id: productId },
    include: { sizes: true },
  });

  if (!product) {
    throw new BadRequestException("Product not found");

  }

  // ✅ If product has sizes → sizeId is mandatory
  if (product.sizes.length > 0 && !sizeId) {
    throw new BadRequestException("Please select a size");
  }

  let availableStock: number;

  // ✅ SIZE-BASED STOCK (PRIMARY PATH)
  if (sizeId) {
    const size = await this.prisma.productSize.findUnique({
      where: { id: sizeId },
    });

    if (!size || size.productId !== productId) {
      throw new BadRequestException("Invalid size selected");
    }

    availableStock = size.stock;
  }
  // ✅ SIMPLE PRODUCT (NO SIZES)
  else {
    availableStock = product.stock;
  }

  if (availableStock < 1) {
    throw new BadRequestException("Out of stock");
  }

  // ✅ UNIQUE CART ITEM = user + product + size
  const existing = await this.prisma.cartItem.findFirst({
    where: {
      userId,
      productId,
      sizeId: sizeId ?? null,
    },
  });

  if (existing) {
    if (existing.quantity + 1 > availableStock) {
      throw new BadRequestException("Not enough stock");
    }

    return this.prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + 1 },
    });
  }

  return this.prisma.cartItem.create({
    data: {
      userId,
      productId,
      sizeId: sizeId ?? null,
      quantity: 1,
    },
  });
}

  // PUT /cart/:id  (update quantity)
  async updateQuantity(id: number, quantity: number, userId: number) {
  if (quantity < 1) {
    throw new BadRequestException("Quantity must be at least 1");
  }

  const item = await this.prisma.cartItem.findUnique({
    where: { id },
    include: {
      product: true,
      size: true,
    },
  });

  if (!item || item.userId !== userId) {
    throw new NotFoundException("Cart item not found");
  }

  const availableStock = item.size
    ? item.size.stock
    : item.product.stock;

  if (quantity > availableStock) {
    throw new BadRequestException("Not enough stock available");
  }

  return this.prisma.cartItem.update({
    where: { id },
    data: { quantity },
  });
}


  // DELETE /cart/:id
  async removeItem(id: number, userId: number) {
    const item = await this.prisma.cartItem.findUnique({ where: { id } });

    if (!item || item.userId !== userId) {
      throw new NotFoundException("Item not found");
    }

    await this.prisma.cartItem.delete({ where: { id } });
    return { success: true };
  }
}
