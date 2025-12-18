import { Injectable, NotFoundException  } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ContactReason } from "@prisma/client";

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

async createContact(input: {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  reason?: ContactReason;
  userId?: number | null;
  orderId?: number | null;
}) {
  const { userId, orderId, ...rest } = input;

  return this.prisma.contact.create({
    data: {
      ...rest,

      ...(userId
        ? { user: { connect: { id: userId } } }
        : {}),

      ...(orderId
        ? { order: { connect: { id: orderId } } }
        : {}),
    },
  });
}
  async getAllContacts(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.contact.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          order: true,
        },
      }),
      this.prisma.contact.count(),
    ]);

    return {
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getById(id: number) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: {
        user: true,
        order: true,
      },
    });

    if (!contact) throw new NotFoundException("Contact not found");
    return contact;
  }

  async delete(id: number) {
    return this.prisma.contact.delete({
      where: { id },
    });
  }
}
