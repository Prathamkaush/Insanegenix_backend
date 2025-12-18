import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Query,
  Param,
  ParseIntPipe,
  Delete,
} from "@nestjs/common";
import { ContactService } from "./contact.service";
import { JwtAuthGuard } from "../auth/strategies/jwt-auth.guard";
import { AdminGuard } from "../auth/admin.guard";

// ✅ Swagger imports
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from "@nestjs/swagger";

@ApiTags("Contact")
@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // -------- PUBLIC CONTACT FORM --------
  @ApiOperation({
    summary: "Submit contact form (Public)",
    description: "Allows users or guests to submit a contact / support request",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string", example: "Pratham Kaushik" },
        email: { type: "string", example: "user@example.com" },
        phone: { type: "string", example: "9876543210" },
        message: {
          type: "string",
          example: "I need help with my order",
        },
      },
      required: ["name", "email", "message"],
    },
  })
  @Post()
  async create(@Req() req: any, @Body() body: any) {
    return this.contactService.createContact({
      ...body,
      userId: req.user?.id || null,
    });
  }

  // -------- ADMIN: LIST CONTACTS --------
  @ApiOperation({
    summary: "Get all contact submissions (Admin only)",
  })
  @ApiBearerAuth("JWT-auth")
  @ApiQuery({
    name: "page",
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    example: 10,
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Admin access required" })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  getAll(
    @Query("page") page = "1",
    @Query("limit") limit = "10"
  ) {
    return this.contactService.getAllContacts(
      Number(page),
      Number(limit)
    );
  }

  // -------- ADMIN: VIEW SINGLE --------
  @ApiOperation({
    summary: "Get single contact message (Admin only)",
  })
  @ApiBearerAuth("JWT-auth")
  @ApiParam({
    name: "id",
    description: "Contact message ID",
    example: 12,
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Admin access required" })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number) {
    return this.contactService.getById(id);
  }

  // -------- ADMIN: DELETE --------
  @ApiOperation({
    summary: "Delete contact message (Admin only)",
  })
  @ApiBearerAuth("JWT-auth")
  @ApiParam({
    name: "id",
    description: "Contact message ID",
    example: 12,
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Admin access required" })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.contactService.delete(id);
  }
}
