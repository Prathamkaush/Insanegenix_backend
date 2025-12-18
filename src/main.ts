import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS Configuration
  app.enableCors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://yourdomain.com",
    "https://admin.yourdomain.com",
  ],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
});

  // Static file serving
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  app.use('/uploads/products', express.static(join(process.cwd(), 'uploads/products')));

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // ================== SWAGGER ==================
  const config = new DocumentBuilder()
    .setTitle("FirstFemale API")
    .setDescription("E-commerce backend API documentation")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
      },
      "JWT-auth"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  
  const PORT = 3030;
  await app.listen(PORT);
  
  console.log('🚀 Backend running on http://localhost:3030');
  console.log('📦 API Endpoints:');
  console.log('   - POST http://localhost:3030/auth/send-otp');
  console.log('   - POST http://localhost:3030/auth/verify-otp');
  console.log('   - POST http://localhost:3030/cart/add');
  console.log('   - GET  http://localhost:3030/cart');
  console.log('   - POST http://localhost:3030/orders');
}
bootstrap();