import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/strategies/jwt-auth.guard";

// ✅ Swagger
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
} from "@nestjs/swagger";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  /* ================= GET PROFILE ================= */
  @ApiOperation({
    summary: "Get user profile",
    description: "Returns the authenticated user's profile details",
  })
  @Get("profile")
  getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  /* ================= UPDATE PROFILE ================= */
  @ApiOperation({
    summary: "Update user profile",
    description: "Update name and/or email of the authenticated user",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "Pratham Kaushik",
        },
        email: {
          type: "string",
          example: "pratham@example.com",
        },
      },
    },
  })
  @Patch("profile")
  updateProfile(
    @Req() req: any,
    @Body() body: { name?: string; email?: string }
  ) {
    if (!body.name && !body.email) {
      throw new BadRequestException("Nothing to update");
    }

    return this.usersService.updateProfile(req.user.id, body);
  }
}
