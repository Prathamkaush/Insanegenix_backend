import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // ---------------- GET PROFILE ----------------
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException("User not found");

    return { user };
  }

  // ---------------- UPDATE PROFILE ----------------
  async updateProfile(
    userId: number,
    data: { name?: string; email?: string }
  ) {
    // Email uniqueness check
    if (data.email) {
      const existing = await this.prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id: userId },
        },
      });

      if (existing) {
        throw new BadRequestException("Email already in use");
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return {
      message: "Profile updated successfully",
      user,
    };
  }
}
