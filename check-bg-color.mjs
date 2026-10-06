import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking website_settings table...\n');

  const settings = await prisma.websiteSettings.findMany({
    take: 3,
    orderBy: { id: 'desc' },
    include: {
      wedding: {
        select: {
          slug: true,
          title: true,
        }
      }
    }
  });

  if (settings.length === 0) {
    console.log('No website settings found in database.');
    return;
  }

  for (const setting of settings) {
    console.log(`Wedding: ${setting.wedding.title} (/${setting.wedding.slug})`);
    console.log(`  Theme: ${setting.theme}`);
    console.log(`  Background Color: ${setting.backgroundColor ?? 'NOT SET'}`);
    console.log(`  Primary Color: ${setting.primaryColor}`);
    console.log(`  Layout: ${setting.layout}`);
    console.log('---');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
