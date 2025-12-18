import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Put,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { JwtAuthGuard } from "../auth/strategies/jwt-auth.guard";
import { AdminGuard } from "src/auth/admin.guard";

// ✅ Swagger imports
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ================= CREATE PRODUCT =================
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create a new product (Admin)" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Product data with up to 4 images",
    schema: {
      type: "object",
      properties: {
        title: { type: "string", example: "Women Jeans" },
        price: { type: "number", example: 1999 },
        stock: { type: "number", example: 50 },
        categoryId: { type: "number", example: 1 },
        typeId: { type: "number", example: 2 },
        subtypeId: { type: "number", example: 3 },
        image1: { type: "string", format: "binary" },
        image2: { type: "string", format: "binary" },
        image3: { type: "string", format: "binary" },
        image4: { type: "string", format: "binary" },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Admin authentication required" })
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: join(process.cwd(), "uploads", "products"),
          filename: (_, file, callback) => {
            const unique =
              Date.now() + "-" + Math.round(Math.random() * 1e9);
            callback(null, unique + extname(file.originalname));
          },
        }),
      }
    )
  )
  create(@UploadedFiles() files: any, @Body() body: any) {
    return this.productsService.create(body, files);
  }

  // ================= LIST PRODUCTS =================
  @ApiOperation({ summary: "Get all products (Search, filter, sort)" })
  @ApiQuery({ name: "search", required: false })
  @ApiQuery({ name: "sort", required: false })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "limit", required: false })
  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  // ================= ADMIN LOW STOCK =================
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get low stock products (Admin)" })
  @ApiQuery({
    name: "threshold",
    required: false,
    description: "Stock threshold (default: 5)",
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get("admin/low-stock")
  getLowStock(@Query("threshold") threshold?: string) {
    return this.productsService.getLowStock(
      threshold ? Number(threshold) : 5
    );
  }

  // ================= GET BY ID OR SLUG =================
  @ApiOperation({ summary: "Get product by ID or slug" })
  @ApiParam({
    name: "identifier",
    description: "Product ID (number) or slug (string)",
  })
  @Get(":identifier")
  async findOneOrBySlug(@Param("identifier") identifier: string) {
    const numericId = Number(identifier);
    if (!isNaN(numericId)) {
      return this.productsService.findOne(numericId);
    }
    return this.productsService.findBySlug(identifier);
  }

  // ================= UPDATE PRODUCT =================
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update product (Admin)" })
  @ApiConsumes("multipart/form-data")
  @ApiParam({ name: "id", type: Number })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: join(process.cwd(), "uploads", "products"),
          filename: (_, file, callback) => {
            const unique =
              Date.now() + "-" + Math.round(Math.random() * 1e9);
            callback(null, unique + extname(file.originalname));
          },
        }),
      }
    )
  )
  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFiles() files: any,
    @Body() body: any
  ) {
    return this.productsService.update(id, body, files);
  }

  // ================= DELETE PRODUCT =================
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete product (Admin)" })
  @ApiParam({ name: "id", type: Number })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  // ================= UPDATE STOCK =================
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update product stock (Admin)" })
  @ApiParam({ name: "id", type: Number })
  @ApiBody({
    schema: {
      example: { stock: 100 },
    },
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(":id/stock")
  updateStock(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { stock: number }
  ) {
    return this.productsService.updateStock(id, body.stock);
  }

  // ================= UPDATE DISCOUNT =================
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update product discount (Admin)" })
  @ApiParam({ name: "id", type: Number })
  @ApiBody({
    schema: {
      example: {
        discountType: "PERCENT",
        discountValue: 20,
      },
    },
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(":id/discount")
  updateDiscount(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { discountType?: string; discountValue?: number }
  ) {
    return this.productsService.updateDiscount(id, body);
  }
}
