import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsTypesModule } from './products-types/products-types.module';
import { ProductsSubtypesModule } from './products-subtypes/products-subtypes.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { SettingsModule } from './settings/settings.module';
import { CartModule } from "./cart/cart.module";
import { UsersModule } from "./users/users.module";
import { AdminModule } from './admin/admin.module';
import { ReviewsModule } from "./reviews/reviews.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { PaymentsModule } from "./payment/payments.module";
import { ContactModule } from './contact/contact.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ProductSizeModule } from './products-size/product-size.module';
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
     JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
    PrismaModule,
    OrdersModule,
    AuthModule,
    CartModule,
    UsersModule,
    AdminModule,
    ReviewsModule,
    SettingsModule,
    FeedbackModule,
    ProductsModule,
    CategoriesModule,
    WishlistModule,
    ProductSizeModule,
    ProductsTypesModule,
    ProductsSubtypesModule,
    ContactModule,
    PaymentsModule,
  ],
})
export class AppModule {}
