import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { JwtAuthGuard } from "../auth/strategies/jwt-auth.guard";
import { AdminGuard } from "../auth/admin.guard";

// ✅ Swagger imports
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ---------------- CREATE CATEGORY (ADMIN) ----------------
  @ApiOperation({
    summary: "Create a category (Admin only)",
  })
  @ApiBearerAuth("JWT-auth")
  @ApiBody({ type: CreateCategoryDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Admin access required" })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  // ---------------- GET ALL CATEGORIES ----------------
  @ApiOperation({
    summary: "Get all categories",
  })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  // ---------------- GET CATEGORY BY ID ----------------
  @ApiOperation({
    summary: "Get category by ID",
  })
  @ApiParam({
    name: "id",
    description: "Category ID",
    example: 1,
  })
  @ApiBadRequestResponse({ description: "Invalid category ID" })
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  // ---------------- UPDATE CATEGORY (ADMIN) ----------------
  @ApiOperation({
    summary: "Update category (Admin only)",
  })
  @ApiBearerAuth("JWT-auth")
  @ApiParam({
    name: "id",
    description: "Category ID",
    example: 1,
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Admin access required" })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(id, dto);
  }

  // ---------------- DELETE CATEGORY (ADMIN) ----------------
  @ApiOperation({
    summary: "Delete category (Admin only)",
  })
  @ApiBearerAuth("JWT-auth")
  @ApiParam({
    name: "id",
    description: "Category ID",
    example: 1,
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Admin access required" })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
