import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/strategies/jwt-auth.guard";
import { AdminGuard } from "../auth/admin.guard";

// ✅ Swagger imports
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

@ApiTags("Admin") // 👈 Groups under "Admin" in Swagger
@ApiBearerAuth("JWT-auth") // 👈 Uses Bearer token
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller("admin")
export class AdminController {
  constructor(private adminService: AdminService) {}

  @ApiOperation({
    summary: "Get admin dashboard statistics",
    description: "Returns total users, orders, revenue, products, etc.",
  })
  @Get("stats")
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  @ApiOperation({
    summary: "Get admin dashboard charts data",
    description: "Returns analytics data for charts (orders, revenue, trends)",
  })
  @Get("charts")
  async getCharts() {
    return this.adminService.getChartData();
  }
}
