import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReviewDto } from "./dto/create-review.dto";

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /* -------- CREATE REVIEW -------- */
  async createReview(userId: number, dto: CreateReviewDto) {
    // 1️⃣ Validate order
    const order = await this.prisma.order.findFirst({
      where: {
        id: dto.orderId,
        userId,
        status: "DELIVERED",
      },
      include: { items: true },
    });

    if (!order) {
      throw new ForbiddenException("Order not eligible for review");
    }

    // 2️⃣ Validate product exists in order
    const hasProduct = order.items.some(
      (item) => item.productId === dto.productId
    );

    if (!hasProduct) {
      throw new ForbiddenException("Product not in this order");
    }

    // 3️⃣ Prevent duplicate review
    const exists = await this.prisma.review.findFirst({
      where: {
        userId,
        productId: dto.productId,
        orderId: dto.orderId,
      },
    });

    if (exists) {
      throw new BadRequestException("Review already submitted");
    }

    // 4️⃣ Create review
    return this.prisma.review.create({
  data: {
    rating: dto.rating,
    comment: dto.comment,
    user: { connect: { id: userId } },
    product: { connect: { id: dto.productId } },
    order: { connect: { id: dto.orderId } },
  },
});

  }

  /* -------- GET PRODUCT REVIEWS -------- */
  async getProductReviews(productId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) /
      (reviews.length || 1);

    return {
      averageRating: Number(avg.toFixed(1)),
      total: reviews.length,
      reviews,
    };
  }
getAll() {
  return this.prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true },
      },
      product: {
        select: { id: true, title: true },
      },
    },
  });
}

async getAllPaginated(page = 1, limit = 5) {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    this.prisma.review.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
        product: {
          select: { id: true, title: true },
        },
      },
    }),
    this.prisma.review.count(),
  ]);

  return {
    data: reviews,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
}


}
