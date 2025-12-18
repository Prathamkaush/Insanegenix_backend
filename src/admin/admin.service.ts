import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      products,
      totalOrders,
      todayOrders,
      revenueAgg,
      todayRevenueAgg,
      recentProducts,
    ] = await Promise.all([
      this.prisma.product.count(),

      this.prisma.order.count(),

      this.prisma.order.count({
        where: {
          createdAt: { gte: today },
        },
      }),

      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
      }),

      this.prisma.order.aggregate({
        where: {
          createdAt: { gte: today },
        },
        _sum: { totalAmount: true },
      }),

      this.prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          price: true,
          img1: true,
        },
      }),
    ]);

    return {
      products,
      totalOrders,
      todayOrders,
      revenue: revenueAgg._sum.totalAmount || 0,
      todayRevenue: todayRevenueAgg._sum.totalAmount || 0,
      recentProducts,
    };
  }
  async getChartData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Last 7 days
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).reverse();

  // Revenue & Orders per day
  const dailyStats = await Promise.all(
    last7Days.map(async (date) => {
      const next = new Date(date);
      next.setDate(date.getDate() + 1);

      const orders = await this.prisma.order.findMany({
        where: {
          createdAt: { gte: date, lt: next },
        },
      });

      return {
        date: date.toLocaleDateString("en-IN", { weekday: "short" }),
        orders: orders.length,
        revenue: orders.reduce(
          (sum, o) => sum + Number(o.totalAmount),
          0
        ),
      };
    })
  );

  // Order status split
  const statusCounts = await this.prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });

  return {
    revenueTrend: dailyStats.map(d => ({
      date: d.date,
      revenue: d.revenue,
    })),
    ordersTrend: dailyStats.map(d => ({
      date: d.date,
      orders: d.orders,
    })),
    orderStatus: statusCounts.map(s => ({
      status: s.status,
      value: s._count,
    })),
  };
}

}
