import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/strategies/jwt-auth.guard";
import { PaymentsService } from "./payments.service";
import { PrismaService } from "../prisma/prisma.service";
import { OrderStatus } from "@prisma/client";

// ✅ Swagger imports
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@ApiTags("Payments")
@ApiBearerAuth("JWT-auth")
@Controller("payments")
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly prisma: PrismaService
  ) {}

  // ================= CREATE RAZORPAY ORDER =================

  @ApiOperation({
    summary: "Create Razorpay order",
    description:
      "Creates a Razorpay payment order for a pending user order",
  })
  @ApiBody({
    schema: {
      example: {
        orderId: 123,
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      "orderId missing | Invalid order | Order already processed",
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @UseGuards(JwtAuthGuard)
  @Post("razorpay/create-order")
  async createRazorpayOrder(
    @Req() req,
    @Body() body: { orderId: number }
  ) {
    if (!body?.orderId) {
      throw new BadRequestException("orderId is required");
    }

    const order = await this.prisma.order.findUnique({
      where: { id: body.orderId },
    });

    if (!order || order.userId !== req.user.id) {
      throw new BadRequestException("Invalid order");
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException("Order already processed");
    }

    const razorpayOrder = await this.paymentsService.createOrder(
      Number(order.totalAmount)
    );

    await this.prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: Number(order.totalAmount),
      key: process.env.RAZORPAY_KEY_ID,
    };
  }

  // ================= VERIFY PAYMENT =================

  @ApiOperation({
    summary: "Verify Razorpay payment",
    description:
      "Verifies Razorpay payment signature and confirms the order",
  })
  @ApiBody({
    schema: {
      example: {
        razorpay_order_id: "order_Nx123abc",
        razorpay_payment_id: "pay_Nx456xyz",
        razorpay_signature: "generated_signature_here",
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      "Invalid signature | Order not found | Unauthorized | Already processed",
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @UseGuards(JwtAuthGuard)
  @Post("razorpay/verify")
  async verifyPayment(@Req() req, @Body() body) {
    const crypto = require("crypto");

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expected !== razorpay_signature) {
      throw new BadRequestException("Invalid signature");
    }

    const order = await this.prisma.order.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!order) {
      throw new BadRequestException("Order not found");
    }

    if (order.userId !== req.user.id) {
      throw new BadRequestException("Unauthorized payment verification");
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException("Order already processed");
    }

    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.CONFIRMED,
        paymentId: razorpay_payment_id,
        paidAt: new Date(),
      },
    });

    return { success: true, orderId: order.id };
  }

  // ================= PAYMENT FAILURE =================

  @ApiOperation({
    summary: "Handle Razorpay payment failure",
    description:
      "Marks payment as failed and allows retry for pending orders",
  })
  @ApiBody({
    schema: {
      example: {
        orderId: 123,
        reason: "Payment cancelled by user",
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      "Invalid order | Unauthorized | Order already processed",
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @UseGuards(JwtAuthGuard)
  @Post("razorpay/failure")
  async paymentFailed(
    @Req() req,
    @Body() body: { orderId: number; reason?: string }
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: body.orderId },
    });

    if (!order || order.userId !== req.user.id) {
      throw new BadRequestException("Invalid order");
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException("Order already processed");
    }

    // Optional: store failure reason later
    return {
      success: false,
      message: "Payment failed. You can retry or contact support.",
    };
  }
}
