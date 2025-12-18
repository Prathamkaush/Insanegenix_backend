import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number | null, dto: CreateFeedbackDto) {
    return this.prisma.feedback.create({
      data: {
        message: dto.message,
        page: dto.page,
        userId: userId,
      },
    });
  }

  async getAll(page = 1, limit = 5) {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.prisma.feedback.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    }),
    this.prisma.feedback.count(),
  ]);

  return {
    data,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

}