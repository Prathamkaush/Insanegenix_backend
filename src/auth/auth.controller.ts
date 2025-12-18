import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./strategies/jwt-auth.guard";
import { IsString, IsNotEmpty, IsEmail } from "class-validator";

// ✅ Swagger imports
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";

// ---------------- DTOs ----------------
class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  phone: string;
}

class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

class LoginDto {
  email: string;
  password: string;
}

class AdminLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

// ---------------------------------------

@ApiTags("Auth") // 👈 Swagger group
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ---------------- SEND OTP ----------------
  @ApiOperation({
    summary: "Send OTP to phone number",
    description: "Sends OTP for login/signup using phone number",
  })
  @ApiBody({ type: SendOtpDto })
  @ApiBadRequestResponse({ description: "Phone number is required" })
  @Post("send-otp")
  sendOtp(@Body() body: SendOtpDto) {
    if (!body || !body.phone) {
      throw new BadRequestException("Phone number is required");
    }

    return this.authService.sendOtp(body.phone);
  }

  // ---------------- VERIFY OTP ----------------
  @ApiOperation({
    summary: "Verify OTP and login/signup user",
    description: "Verifies OTP and returns JWT token",
  })
  @ApiBody({ type: VerifyOtpDto })
  @ApiBadRequestResponse({ description: "Phone & OTP are required" })
  @Post("verify-otp")
  verifyOtp(@Body() body: VerifyOtpDto) {
    const { phone, otp } = body;

    if (!phone || !otp) {
      throw new BadRequestException("Phone & OTP are required");
    }

    return this.authService.verifyOtp(phone, otp);
  }

  // ---------------- EMAIL/PASSWORD LOGIN ----------------
  @ApiOperation({
    summary: "User login with email & password",
  })
  @ApiBody({ type: LoginDto })
  @ApiUnauthorizedResponse({ description: "Invalid credentials" })
  @Post("login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  // ---------------- ADMIN LOGIN ----------------
  @ApiOperation({
    summary: "Admin login",
    description: "Admin login using email & password",
  })
  @ApiBody({ type: AdminLoginDto })
  @ApiUnauthorizedResponse({ description: "Invalid admin credentials" })
  @Post("admin/login")
  adminLogin(@Body() body: AdminLoginDto) {
    return this.authService.validateAdmin(body.email, body.password);
  }

  // ---------------- USER PROFILE ----------------
  @ApiOperation({
    summary: "Get logged-in user profile",
  })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() req: any) {
    return req.user;
  }
}
