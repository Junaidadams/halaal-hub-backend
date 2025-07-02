import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 👇 Workaround for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, "..", "data", "listings.json");

  const rawData = fs.readFileSync(filePath);
  const listings = JSON.parse(rawData);

  for (const listing of listings) {
    await prisma.listing.create({
      data: {
        name: listing.name,
        description: listing.description,
        detailedDescription: listing.detailedDescription,
        lat: listing.lat,
        lng: listing.lng,
        address: listing.address,
        googlePlaceLink: listing.googlePlaceLink,
        imageUrl: listing.imageUrl,
        category: listing.category,
        certifiedBy: listing.certifiedBy,
        isCertified: listing.isCertified,
        stars: listing.stars,
        phone: listing.phone,
        email: listing.email,
        website: listing.website,
      },
    });
  }

  console.log("✅ Listings seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
