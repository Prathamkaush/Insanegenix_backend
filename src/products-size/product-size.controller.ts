import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { ProductSizeService } from "./product-size.service";
import { JwtAuthGuard } from "../auth/strategies/jwt-auth.guard";
import { AdminGuard } from "../auth/admin.guard";

// ✅ Swagger imports
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";

@ApiTags("Product Sizes")
@Controller("product-sizes")
export class ProductSizeController {
  constructor(private service: ProductSizeService) {}

  // ================= SET / UPDATE SIZES =================
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Set product sizes and stock (Admin)",
    description:
      "Creates or replaces all sizes for a product. Existing sizes will be overwritten.",
  })
  @ApiParam({
    name: "productId",
    type: Number,
    description: "Product ID",
  })
  @ApiBody({
    description: "Array of sizes with stock",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          size: {
            type: "string",
            example: "M",
          },
          stock: {
            type: "number",
            example: 20,
          },
        },
        required: ["size", "stock"],
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Admin authentication required" })
  @ApiBadRequestResponse({ description: "Invalid product or size data" })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(":productId")
  setSizes(
    @Param("productId", ParseIntPipe) productId: number,
    @Body() sizes: { size: string; stock: number }[]
  ) {
    return this.service.setSizes(productId, sizes);
  }

  // ================= GET SIZES =================
  @ApiOperation({
    summary: "Get sizes for a product",
    description: "Returns all available sizes with stock for a product",
  })
  @ApiParam({
    name: "productId",
    type: Number,
    description: "Product ID",
  })
  @Get(":productId")
  getSizes(@Param("productId", ParseIntPipe) productId: number) {
    return this.service.getSizes(productId);
  }
}
