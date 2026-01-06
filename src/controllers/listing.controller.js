import prisma from "../../lib/prisma.js";

// function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
//   const R = 6371;
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

export const bulkListingsUpdater = async (req, res) => {
  const email = "seniorfrikkie@gmail.com";
  try {
    const updatedListings = await prisma.listing.updateMany({
      where: { status: "PENDING" },
      data: { ownerId: 3 },
    });
    res
      .status(200)
      .json({ message: "Updated successfully.", count: updatedListings.count });
    console.log(`Updated ${updatedListings.count} listings.`);
  } catch (error) {
    console.error("Failed to update.", error);
    res.status(500).json({ message: "Failed to update listings." });
  }
};

export const getListingsByLocation = async (req, res) => {
  const { location, page = 1, limit = 10 } = req.query;

  if (!location) {
    return res.status(400).json({ message: "Missing location query param" });
  }

  const [userLat, userLon] = location.split(",").map(Number);
  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ message: "Invalid lat/lon format" });
  }

  const take = parseInt(limit, 10);
  const skip = (parseInt(page, 10) - 1) * take;

  try {
    // Fetch total count for pagination
    const totalCountResult = await prisma.$queryRaw`
      SELECT COUNT(*) as total
      FROM Listing l
    `;
    let totalCount = totalCountResult[0]?.total || 0;

    // Convert BigInt to Number safely
    if (typeof totalCount === "bigint") {
      totalCount = Number(totalCount);
    }

    // Fetch listings with distance
    const listings = await prisma.$queryRaw`
      SELECT 
        l.*,
        ST_Distance_Sphere(
          POINT(${userLon}, ${userLat}),
          POINT(l.lng, l.lat)
        ) AS distance
      FROM Listing l
      ORDER BY distance ASC
      LIMIT ${take} OFFSET ${skip};
    `;

    return res.status(200).json({
      listings,
      totalCount,
      page: parseInt(page, 10),
      totalPages: Math.ceil(totalCount / take),
    });
  } catch (err) {
    console.error("Error fetching listings:", err.message);
    return res.status(500).json({ message: "Server error loading listings" });
  }
};

export const getAllListings = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // get ?page=2&limit=10 from URL

  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const listings = await prisma.listing.findMany({
      skip: skip,
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
      include: { openingHours: true },
    });

    const totalCount = await prisma.listing.count();

    return res.status(200).json({
      listings,
      totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server error loading listings" });
  }
};

export const getSpecificListings = async (req, res) => {
  let { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid or missing ids in request body" });
  }

  try {
    const listings = await prisma.listing.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching specific listings:", error.message);
    return res.status(500).json({ message: "Server error loading listings" });
  }
};

export const getListingById = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: Number(id) },
      include: {
        openingHours: true,
        owner: true,
      },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).json({ message: "Server error" });
  }
};
