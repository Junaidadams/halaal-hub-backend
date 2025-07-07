import prisma from "../../lib/prisma.js";

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const getListingsByLocation = async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ message: "Missing location query param" });
  }

  const [userLat, userLon] = location.split(",").map(Number);
  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ message: "Invalid lat/lon format" });
  }

  try {
    const listings = await prisma.$queryRaw`
      SELECT 
        l.*,
        ST_Distance_Sphere(
          POINT(${userLon}, ${userLat}),
          POINT(l.lng, l.lat)
        ) AS distance
      FROM Listing l
      ORDER BY distance ASC;
    `;

    return res.status(200).json(listings);
  } catch (err) {
    console.error("Error fetching listings:", err.message);
    return res.status(500).json({ message: "Server error loading listings" });
  }
};

export const getAllListings = async (req, res) => {
  try {
    const listings = await prisma.listing.findMany();
    return res.status(200).json(listings);
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
