import { PrismaClient, Decimal } from '@prisma/client';

const prisma = new PrismaClient();

// Pre-computed bcrypt hash of "password123" (12 rounds)
const PASSWORD_HASH =
  '$2b$12$LJ3m4ys3Gzf/bGSYhVgfquKvH9cUwBrDSFvWIGDruOGAS1B6Vdzm6';

async function main() {
  console.log('🌱 Seeding database...');

  // ── User ──────────────────────────────────────────────────────────
  const user = await prisma.user.upsert({
    where: { email: 'mark@everafter.dev' },
    update: {},
    create: {
      email: 'mark@everafter.dev',
      passwordHash: PASSWORD_HASH,
      firstName: 'Mark',
      lastName: 'Quieta',
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`  User: ${user.firstName} ${user.lastName} (${user.email})`);

  // ── Wedding ───────────────────────────────────────────────────────
  const wedding = await prisma.wedding.upsert({
    where: { slug: 'mark-and-issa' },
    update: {},
    create: {
      title: "Mark & Issa's Wedding",
      slug: 'mark-and-issa',
      weddingDate: new Date('2025-06-15T00:00:00.000Z'),
      timezone: 'Asia/Manila',
      status: 'DRAFT',
    },
  });
  console.log(`  Wedding: ${wedding.title}`);

  // ── Wedding Member ────────────────────────────────────────────────
  await prisma.weddingMember.upsert({
    where: {
      weddingId_userId: { weddingId: wedding.id, userId: user.id },
    },
    update: {},
    create: {
      weddingId: wedding.id,
      userId: user.id,
      role: 'COUPLE',
    },
  });
  console.log('  Wedding member: COUPLE');

  // ── Wedding Profile ───────────────────────────────────────────────
  await prisma.weddingProfile.upsert({
    where: { weddingId: wedding.id },
    update: {},
    create: {
      weddingId: wedding.id,
      brideName: 'Issa Reyes',
      groomName: 'Mark Quieta',
      ceremonyName: 'San Agustin Church',
      receptionName: 'Shangri-La BGC',
      weddingHashtag: '#MarkAndIssa2025',
      dressCode: 'Semi-formal',
    },
  });
  console.log('  Wedding profile created');

  // ── Website Settings ──────────────────────────────────────────────
  await prisma.websiteSettings.upsert({
    where: { weddingId: wedding.id },
    update: {},
    create: {
      weddingId: wedding.id,
      theme: 'classic',
    },
  });
  console.log('  Website settings created');

  // ── Guests & RSVPs ────────────────────────────────────────────────
  const guestData = [
    { firstName: 'Ana', lastName: 'Santos', email: 'ana@example.com', group: 'Family', side: 'Bride' },
    { firstName: 'Carlos', lastName: 'Garcia', email: 'carlos@example.com', group: 'Friends', side: 'Groom' },
    { firstName: 'Bea', lastName: 'Cruz', email: 'bea@example.com', group: 'Friends', side: 'Bride' },
    { firstName: 'David', lastName: 'Lim', email: 'david@example.com', group: 'Work', side: 'Groom' },
    { firstName: 'Elena', lastName: 'Tan', email: 'elena@example.com', group: 'Family', side: 'Bride' },
  ];

  // Delete existing guests for this wedding to avoid duplicates on re-run
  await prisma.guest.deleteMany({ where: { weddingId: wedding.id } });

  const guests = [];
  for (const g of guestData) {
    const guest = await prisma.guest.create({
      data: {
        weddingId: wedding.id,
        ...g,
      },
    });
    guests.push(guest);
  }

  // RSVPs: guests[0] & [1] ACCEPTED, guest[2] DECLINED, guests[3] & [4] PENDING (no RSVP)
  await prisma.rSVP.create({
    data: {
      guestId: guests[0].id,
      status: 'ACCEPTED',
      companionCount: 1,
      mealPreference: 'Chicken',
      respondedAt: new Date(),
    },
  });
  await prisma.rSVP.create({
    data: {
      guestId: guests[1].id,
      status: 'ACCEPTED',
      companionCount: 2,
      mealPreference: 'Fish',
      songRequest: 'At Last by Etta James',
      respondedAt: new Date(),
    },
  });
  await prisma.rSVP.create({
    data: {
      guestId: guests[2].id,
      status: 'DECLINED',
      companionCount: 0,
      notes: 'Out of town that weekend',
      respondedAt: new Date(),
    },
  });
  console.log(`  Guests: ${guests.length} created, 3 RSVPs`);

  // ── Budget Categories & Items ─────────────────────────────────────
  await prisma.budgetCategory.deleteMany({ where: { weddingId: wedding.id } });

  const venue = await prisma.budgetCategory.create({
    data: {
      weddingId: wedding.id,
      name: 'Venue',
      sortOrder: 0,
      items: {
        create: [
          {
            vendorName: 'San Agustin Church',
            estimatedCost: new Decimal('50000.00'),
            actualCost: new Decimal('50000.00'),
            amountPaid: new Decimal('50000.00'),
            paymentStatus: 'PAID',
          },
          {
            vendorName: 'Shangri-La BGC',
            estimatedCost: new Decimal('350000.00'),
            actualCost: new Decimal('380000.00'),
            amountPaid: new Decimal('200000.00'),
            paymentStatus: 'PARTIAL',
            dueDate: new Date('2025-05-15'),
          },
        ],
      },
    },
  });

  const catering = await prisma.budgetCategory.create({
    data: {
      weddingId: wedding.id,
      name: 'Catering',
      sortOrder: 1,
      items: {
        create: [
          {
            vendorName: 'Juan Carlo Catering',
            estimatedCost: new Decimal('250000.00'),
            actualCost: new Decimal('250000.00'),
            amountPaid: new Decimal('125000.00'),
            paymentStatus: 'PARTIAL',
            dueDate: new Date('2025-06-01'),
          },
        ],
      },
    },
  });

  const photography = await prisma.budgetCategory.create({
    data: {
      weddingId: wedding.id,
      name: 'Photography',
      sortOrder: 2,
      items: {
        create: [
          {
            vendorName: 'Nice Print Photography',
            estimatedCost: new Decimal('180000.00'),
            actualCost: new Decimal('0.00'),
            amountPaid: new Decimal('0.00'),
            paymentStatus: 'PENDING',
            dueDate: new Date('2025-04-15'),
          },
          {
            vendorName: 'Same-Day Edit Video',
            estimatedCost: new Decimal('80000.00'),
            actualCost: new Decimal('80000.00'),
            amountPaid: new Decimal('80000.00'),
            paymentStatus: 'PAID',
          },
        ],
      },
    },
  });
  console.log('  Budget: 3 categories, 5 items');

  // ── Checklist Items ───────────────────────────────────────────────
  await prisma.checklistItem.deleteMany({ where: { weddingId: wedding.id } });

  const checklistData = [
    { title: 'Book ceremony venue', priority: 'HIGH' as const, completedAt: new Date('2024-12-01') },
    { title: 'Send save-the-dates', priority: 'HIGH' as const, completedAt: new Date('2025-01-15') },
    { title: 'Finalize guest list', priority: 'MEDIUM' as const, completedAt: null },
    { title: 'Order wedding cake', priority: 'MEDIUM' as const, completedAt: null, dueDate: new Date('2025-05-01') },
    { title: 'Plan honeymoon itinerary', priority: 'LOW' as const, completedAt: null, dueDate: new Date('2025-06-01') },
  ];

  for (const item of checklistData) {
    await prisma.checklistItem.create({
      data: {
        weddingId: wedding.id,
        title: item.title,
        priority: item.priority,
        completedAt: item.completedAt,
        dueDate: item.dueDate ?? null,
      },
    });
  }
  console.log('  Checklist: 5 items (2 completed, 3 pending)');

  console.log('\n✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
