import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // ================= ADMIN =================

  async getAll(query: any) {
    const { page = 1, limit = 10, status, minAmount, maxAmount } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    if (minAmount || maxAmount) {
      where.totalAmount = {};
      if (minAmount) where.totalAmount.gte = Number(minAmount);
      if (maxAmount) where.totalAmount.lte = Number(maxAmount);
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          user: true,
          items: { include: { product: true ,
            size: true,
           } },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      total,
      pages: Math.ceil(total / limit),
      page: Number(page),
    };
  }

  async getOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { user: true, items: { include: { product: true, size: true } } },
    });

    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  // ================= ADMIN STATUS UPDATE =================
  async updateStatus(orderId: number, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException("Order not found");

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  // ================= CREATE ORDER (COD / RAZORPAY) =================
  async createOrder(userId: number, address: any) {
    const cart = await this.prisma.cartItem.findMany({
  where: { userId },
  include: {
    product: true,
    size: true, // ✅ IMPORTANT
  },
});


    if (!cart.length) {
      throw new BadRequestException("Cart is empty");
    }

    const total = cart.reduce(
      (sum, i) => sum + Number(i.product.price) * i.quantity,
      0
    );

    const order = await this.prisma.$transaction(async (tx) => {
      // 1️⃣ Create order (ALWAYS PENDING)
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount: total,
          status: OrderStatus.PENDING,
          address,
          items: {
  create: cart.map((i) => {
    const price = Number(i.product.price);

    let finalPrice = price;
    let originalPrice = price;

    if (i.product.discountType === "PERCENT") {
      finalPrice =
        price - (price * Number(i.product.discountValue)) / 100;
    }

    if (i.product.discountType === "FLAT") {
      finalPrice =
        price - Number(i.product.discountValue);
    }

    finalPrice = Math.max(0, Math.round(finalPrice));

    return {
      productId: i.productId,
      sizeId: i.sizeId ?? null,
      quantity: i.quantity,
      price: finalPrice,
      originalPrice,
      discountType: i.product.discountType,
      discountValue: i.product.discountValue,
    };
  }),
},

        },
      });

      // 2️⃣ ATOMIC STOCK DECREMENT (CRITICAL FIX)
for (const item of cart) {
  if (item.sizeId) {
    // 🔥 SIZE STOCK
    const updated = await tx.productSize.updateMany({
      where: {
        id: item.sizeId,
        stock: { gte: item.quantity },
      },
      data: {
        stock: { decrement: item.quantity },
      },
    });

    if (updated.count === 0) {
      throw new BadRequestException(
        `${item.product.title} (${item.size?.size}) is out of stock`
      );
    }
  } else {
    // 🔥 NORMAL PRODUCT STOCK
    const updated = await tx.product.updateMany({
      where: {
        id: item.productId,
        stock: { gte: item.quantity },
      },
      data: {
        stock: { decrement: item.quantity },
      },
    });

    if (updated.count === 0) {
      throw new BadRequestException(
        `${item.product.title} is out of stock`
      );
    }
  }
}

      // 3️⃣ Clear cart
      await tx.cartItem.deleteMany({ where: { userId } });

      return order;
    });

    return { orderId: order.id };
  }

  // ================= USER =================

  async getMyOrders(userId: number, page = 1, limit = 5) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        include: { items: { include: { product: true , size: true, } } },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      orders,
      page,
      pages: Math.ceil(total / limit),
      total,
    };
  }

  async getMyOrderById(orderId: number, userId: number) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: { include: { product: true, size: true } } },
    });

    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  // ================= CANCEL =================
  async cancelOrder(orderId: number, userId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new NotFoundException("Order not found");
    if (order.userId !== userId)
      throw new BadRequestException("Unauthorized");

    // ❌ FIXED: only PENDING allowed
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        "Order cannot be cancelled after confirmation"
      );
    }

    await this.prisma.$transaction(async (tx) => {
      // restore stock
      for (const item of order.items) {
  if (item.sizeId) {
    await tx.productSize.update({
      where: { id: item.sizeId },
      data: { stock: { increment: item.quantity } },
    });
  } else {
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }
}


      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });
    });

    return { success: true };
  }

  // ================= REORDER =================
  async reorder(orderId: number, userId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.userId !== userId)
      throw new NotFoundException("Order not found");

    for (const item of order.items) {
  if (item.sizeId) {
    const size = await this.prisma.productSize.findUnique({
      where: { id: item.sizeId },
    });

    if (!size || size.stock < item.quantity) {
      throw new BadRequestException(
        `${item.productId} size is out of stock`
      );
    }
  } else {
    const product = await this.prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product || product.stock < item.quantity) {
      throw new BadRequestException(
        `${product?.title} is out of stock`
      );
    }
  }
}


    await this.prisma.cartItem.deleteMany({ where: { userId } });

    await this.prisma.cartItem.createMany({
  data: order.items.map((i) => ({
    userId,
    productId: i.productId,
    sizeId: i.sizeId ?? null,
    quantity: i.quantity,
  })),
});


    return { success: true };
  }
}
