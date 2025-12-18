import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

// ✅ Swagger
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Health")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: "API health check",
    description: "Basic endpoint to verify API is running",
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
