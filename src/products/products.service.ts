import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ----------------------------------
  // SLUG HELPER
  // ----------------------------------
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // ----------------------------------
  // FINAL PRICE HELPER
  // ----------------------------------
  private getFinalPrice(product: any) {
    if (!product.discountType || !product.discountValue) {
      return product.price;
    }

    if (product.discountType === "PERCENT") {
      return (
        product.price -
        (product.price * product.discountValue) / 100
      );
    }

    if (product.discountType === "FLAT") {
      return product.price - product.discountValue;
    }

    return product.price;
  }

  // ----------------------------------
  // CREATE PRODUCT
  // ----------------------------------
async create(body: any, files: any) {
  const images = {
    img1: files?.image1?.[0]?.filename || null,
    img2: files?.image2?.[0]?.filename || null,
    img3: files?.image3?.[0]?.filename || null,
    img4: files?.image4?.[0]?.filename || null,
  };

  const price = Number(body.price);

  // ✅ PARSE SIZES
  let sizes: { size: string; stock: number }[] = [];

  try {
    sizes = body.sizes ? JSON.parse(body.sizes) : [];
  } catch {
    throw new BadRequestException("Invalid sizes format");
  }

  if (!Array.isArray(sizes) || sizes.length === 0) {
    throw new BadRequestException("At least one size is required");
  }

  // ✅ UNIQUE SLUG
  const baseSlug = this.generateSlug(body.title);
  const exists = await this.prisma.product.findUnique({
    where: { slug: baseSlug },
  });

  const slug = exists ? `${baseSlug}-${Date.now()}` : baseSlug;

  // ✅ TRANSACTION (IMPORTANT)
  return this.prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        title: body.title,
        slug,
        description: body.description || "",
        price,
        stock: Number(body.stock),
        categoryId: Number(body.categoryId),
        typeId: Number(body.typeId),
        subtypeId: Number(body.subtypeId),
        ...images,
      },
    });

    // ✅ SAVE SIZES
    await tx.productSize.createMany({
      data: sizes.map((s) => ({
        productId: product.id,
        size: s.size,
        stock: s.stock,
      })),
    });

    return product;
  });
}


  // ----------------------------------
  // FIND ALL (FILTER + PAGINATION)
  // ----------------------------------
  async findAll(query: any) {
    const {
      page,
      limit,
      categoryId,
      typeId,
      subtypeId,
      minPrice,
      maxPrice,
      sort,
      stock,
      search,
    } = query;

    const where: any = { AND: [] };

    if (categoryId) where.AND.push({ categoryId: Number(categoryId) });
    if (typeId) where.AND.push({ typeId: Number(typeId) });
    if (subtypeId) where.AND.push({ subtypeId: Number(subtypeId) });

    if (minPrice || maxPrice) {
      where.AND.push({
        price: {
          ...(minPrice ? { gte: Number(minPrice) } : {}),
          ...(maxPrice ? { lte: Number(maxPrice) } : {}),
        },
      });
    }

    if (stock === "in") where.AND.push({ stock: { gt: 0 } });
    if (stock === "out") where.AND.push({ stock: 0 });

    if (search) {
      where.AND.push({
        OR: [
          { title: { contains: search } },
          {
            description: {
              contains: search,
            },
          },
        ],
      });
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "low_to_high") orderBy = { price: "asc" };
    if (sort === "high_to_low") orderBy = { price: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };

    const take = limit ? Number(limit) : undefined;
    const skip =
      page && take ? (Number(page) - 1) * take : undefined;

    const products = await this.prisma.product.findMany({
      where,
      orderBy,
      take,
      skip,
      select: {
  id: true,
  title: true,
  slug: true,
  price: true,
  discountType: true,
  discountValue: true,
  stock: true,
  img1: true,
  img2: true,
  img3: true,
  img4: true,

  sizes: {
    select: {
      id: true,
      size: true,
      stock: true,
      price: true,
    },
  },

  category: true,
  type: true,
  subtype: true,
  createdAt: true,
},
    });

    const total = await this.prisma.product.count({ where });

    const mapped = products.map((p) => ({
      ...p,
      finalPrice: this.getFinalPrice(p),
    }));

    return {
      products: mapped,
      total,
      page: page ? Number(page) : 1,
      pages: take ? Math.ceil(total / take) : 1,
    };
  }

  // ----------------------------------
  // FIND ONE BY ID
  // ----------------------------------
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        price: true,
        discountType: true,
        discountValue: true,
        stock: true,
        img1: true,
        img2: true,
        img3: true,
        img4: true,
        sizes: {
          select: {
            id: true,
            size: true,
            stock: true,
            price: true,
          },
        },
        category: true,
        type: true,
        subtype: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!product) throw new NotFoundException("Product not found");

    return {
      ...product,
      finalPrice: this.getFinalPrice(product),
    };
  }

  // ----------------------------------
  // FIND BY SLUG
  // ----------------------------------
  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        price: true,
        discountType: true,
        discountValue: true,
        stock: true,
        img1: true,
        img2: true,
        img3: true,
        img4: true,
        sizes: {
          select: {
            id: true,
            size: true,
            stock: true,
            price: true,
          },
        },
        category: true,
        type: true,
        subtype: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!product) throw new NotFoundException("Product not found");

    return {
      ...product,
      finalPrice: this.getFinalPrice(product),
    };
  }

  // ----------------------------------
  // UPDATE PRODUCT
  // ----------------------------------
  async update(id: number, body: any, files: any) {
    await this.findOne(id);

    const images: any = {};

    if (files?.image1?.[0]) images.img1 = files.image1[0].filename;
    if (files?.image2?.[0]) images.img2 = files.image2[0].filename;
    if (files?.image3?.[0]) images.img3 = files.image3[0].filename;
    if (files?.image4?.[0]) images.img4 = files.image4[0].filename;

    for (let i = 1; i <= 4; i++) {
      if (body[`remove_image_${i}`] === "true") {
        images[`img${i}`] = null;
      }
    }

    const data: any = {};

    if (body.title !== undefined) {
      data.title = body.title;
      data.slug = this.generateSlug(body.title);
    }

    if (body.description !== undefined)
      data.description = body.description;
    if (body.price !== undefined)
      data.price = Number(body.price);
    if (body.stock !== undefined)
      data.stock = Number(body.stock);

    if (body.discountType !== undefined)
      data.discountType = body.discountType;

    if (body.discountValue !== undefined)
      data.discountValue = Number(body.discountValue);

    if (body.categoryId !== undefined)
      data.categoryId = Number(body.categoryId);
    if (body.typeId !== undefined)
      data.typeId = Number(body.typeId);
    if (body.subtypeId !== undefined)
      data.subtypeId = Number(body.subtypeId);

    Object.assign(data, images);

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  // ----------------------------------
  // DELETE PRODUCT
  // ----------------------------------
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.cartItem.deleteMany({
      where: { productId: id },
    });

    await this.prisma.orderItem.deleteMany({
      where: { productId: id },
    });

    await this.prisma.review.deleteMany({
      where: { productId: id },
    });

    return this.prisma.product.delete({
      where: { id },
    });
  }

  // ----------------------------------
  // UPDATE STOCK
  // ----------------------------------
  async updateStock(productId: number, stock: number) {
    if (stock < 0) {
      throw new BadRequestException(
        "Stock cannot be negative"
      );
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: { stock },
    });
  }

// ----------------------------------
// UPDATE DISCOUNT
// ----------------------------------

  async updateDiscount(
  id: number,
  body: { discountType?: string; discountValue?: number }
) {
  const product = await this.prisma.product.findUnique({ where: { id } });

  if (!product) throw new NotFoundException("Product not found");

  const { discountType, discountValue } = body;

  if (!discountType || discountValue == null) {
    return this.prisma.product.update({
      where: { id },
      data: {
        discountType: null,
        discountValue: null,
      },
    });
  }

  if (discountType === "PERCENT" && discountValue > 100) {
    throw new BadRequestException("Discount percent cannot exceed 100");
  }

  if (discountType === "FLAT" && discountValue >= Number(product.price)) {
    throw new BadRequestException("Flat discount must be less than price");
  }

  return this.prisma.product.update({
    where: { id },
    data: {
      discountType,
      discountValue,
    },
  });
}


  // ----------------------------------
  // LOW STOCK
  // ----------------------------------
  async getLowStock(threshold = 5) {
    return this.prisma.product.findMany({
      where: {
        stock: { lte: threshold },
      },
      select: {
        id: true,
        title: true,
        stock: true,
      },
      orderBy: {
        stock: "asc",
      },
    });
  }
}
