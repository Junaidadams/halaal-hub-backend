import axios from "axios";
export const searchBusiness = async (req, res) => {
  const { q } = req.query;

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q,
          format: "json",
        },
        headers: {
          "User-Agent": "HalaalHub/1.0 (junaidadams117@gmail.com)",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Error proxying Nominatim request:", err.message);
    res.status(500).json({ message: "Failed to search business" });
  }
};
