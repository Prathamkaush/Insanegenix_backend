import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { ProductTypesService } from "./products-types.service";
import { CreateProductTypeDto } from "./dto/create-product-type.dto";
import { UpdateProductTypeDto } from "./dto/update-product-type.dto";
import { JwtAuthGuard } from "../auth/strategies/jwt-auth.guard";
import { AdminGuard } from "../auth/admin.guard";

// ✅ Swagger
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";

@ApiTags("Product Types")
@Controller("product-types")
export class ProductTypesController {
  constructor(
    private readonly productTypesService: ProductTypesService
  ) {}

  // ================= CREATE =================
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Create product type (Admin)",
    description: "Creates a new product type under a category",
  })
  @ApiBody({ type: CreateProductTypeDto })
  @ApiUnauthorizedResponse({ description: "Admin authentication required" })
  @ApiBadRequestResponse({ description: "Invalid product type data" })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() dto: CreateProductTypeDto) {
    return this.productTypesService.create(dto);
  }

  // ================= LIST =================
  @ApiOperation({
    summary: "Get all product types",
    description: "Optionally filter product types by category",
  })
  @ApiQuery({
    name: "categoryId",
    required: false,
    type: Number,
    description: "Filter product types by category ID",
  })
  @Get()
  findAll(@Query("categoryId") categoryId?: string) {
    const cid = categoryId ? parseInt(categoryId, 10) : undefined;
    return this.productTypesService.findAll(cid);
  }

  // ================= GET ONE =================
  @ApiOperation({
    summary: "Get product type by ID",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Product type ID",
  })
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.productTypesService.findOne(id);
  }

  // ================= UPDATE =================
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Update product type (Admin)",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Product type ID",
  })
  @ApiBody({ type: UpdateProductTypeDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateProductTypeDto
  ) {
    return this.productTypesService.update(id, dto);
  }

  // ================= DELETE =================
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Delete product type (Admin)",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Product type ID",
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.productTypesService.remove(id);
  }
}
