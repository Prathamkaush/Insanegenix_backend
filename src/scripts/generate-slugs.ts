import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const products = await prisma.product.findMany({
    where: {
      slug: null
    }
  });

  console.log(`Found ${products.length} products without slugs`);

  for (const product of products) {
    const slug = generateSlug(product.title);
    await prisma.product.update({
      where: { id: product.id },
      data: { slug }
    });
    console.log(`Updated product ${product.id}: ${product.title} -> ${slug}`);
  }

  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());