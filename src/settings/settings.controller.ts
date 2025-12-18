import {
  Controller,
  Get,
  Patch,
  Body,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

// ✅ Swagger
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";

@ApiTags("Settings")
@Controller("settings")
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  /* ================= GET ALL SETTINGS ================= */
  @ApiOperation({
    summary: "Get application settings",
    description: "Returns profile, store and general settings",
  })
  @Get()
  async getAll() {
    return this.service.getSettings();
  }

  /* ================= UPDATE PROFILE ================= */
  @ApiOperation({
    summary: "Update profile settings",
    description: "Update admin/store owner profile details",
  })
  @ApiBody({
    schema: {
      example: {
        name: "Admin Name",
        email: "admin@example.com",
        phone: "9999999999",
      },
    },
  })
  @Patch("profile")
  async updateProfile(@Body() body: any) {
    return this.service.updateProfile(body);
  }

  /* ================= UPDATE STORE (WITH LOGO UPLOAD) ================= */
  @ApiOperation({
    summary: "Update store settings",
    description: "Update store details and upload store logo",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string", example: "FirstFemale Store" },
        tagline: { type: "string", example: "Fashion for Everyone" },
        logo: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @Patch("store")
  @UseInterceptors(
    FileInterceptor("logo", {
      storage: diskStorage({
        destination: "./uploads/settings",
        filename: (_, file, callback) => {
          const unique =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          callback(null, unique + extname(file.originalname));
        },
      }),
    })
  )
  async updateStore(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    return this.service.updateStore(body, file);
  }

  /* ================= UPDATE GENERAL SETTINGS ================= */
  @ApiOperation({
    summary: "Update general settings",
    description: "Update global application settings",
  })
  @ApiBody({
    schema: {
      example: {
        currency: "INR",
        supportEmail: "support@firstfemale.in",
        maintenanceMode: false,
      },
    },
  })
  @Patch("general")
  async updateGeneral(@Body() body: any) {
    return this.service.updateGeneral(body);
  }
}
