// scripts/seedOpeningHours.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

async function main() {
  const data = [];

  for (let listingId = 1; listingId <= 15; listingId++) {
    for (const day of DAYS) {
      if (day === "SATURDAY" || day === "SUNDAY") {
        data.push({
          listingId,
          day,
          isClosed: true,
        });
      } else {
        data.push({
          listingId,
          day,
          opensAt: "09:00",
          closesAt: "17:00",
        });
      }
    }
  }

  await prisma.openingHour.createMany({
    data,
    skipDuplicates: true, // avoids conflicts with @@unique(listingId, day)
  });

  console.log("Opening hours seeded successfully");
}

main()
  .catch((err) => {
    console.error("Error seeding opening hours:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
