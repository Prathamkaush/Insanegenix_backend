import { Module } from "@nestjs/common";
import { ProductSizeService } from "./product-size.service";
import { ProductSizeController } from "./product-size.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [ProductSizeController],
  providers: [ProductSizeService, PrismaService],
})
export class ProductSizeModule {}
