import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  const products = await prisma.product.findMany();

  for (const p of products) {
    if (!p.slug) {
      const slug = slugify(p.title) + "-" + p.id;

      await prisma.product.update({
        where: { id: p.id },
        data: { slug }
      });

      console.log(`Added slug for ID ${p.id}: ${slug}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
