import Razorpay from "razorpay";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PaymentsService {
  private razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  createOrder(amount: number) {
    return this.razorpay.orders.create({
      amount: amount * 100, // INR → paise
      currency: "INR",
      receipt: "order_" + Date.now(),
    });
  }
}
