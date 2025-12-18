import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  // Ensure there is always 1 row
  async getSettings() {
    let settings = await this.prisma.settings.findFirst();

    if (!settings) {
      settings = await this.prisma.settings.create({ data: {} });
    }

    return settings;
  }

  async updateProfile(dto: any) {
    return this.prisma.settings.update({
      where: { id: 1 },
      data: {
        name: dto.name,
        email: dto.email,
      },
    });
  }

  async updateStore(dto: any, file?: Express.Multer.File) {
    return this.prisma.settings.update({
      where: { id: 1 },
      data: {
        storeName: dto.storeName,
        supportEmail: dto.supportEmail,
        supportPhone: dto.supportPhone,
        address: dto.address,
        logo: file ? file.filename : undefined,
      },
    });
  }

  async updateGeneral(dto: any) {
    return this.prisma.settings.update({
      where: { id: 1 },
      data: {
        currency: dto.currency,
        maintenanceMode: dto.maintenanceMode,
      },
    });
  }
}
