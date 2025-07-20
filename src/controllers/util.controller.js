import axios from "axios";

export const searchOSM = async (req, res) => {
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

export const searchBusiness = async (req, res) => {
  const { q } = req.query;

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q,
          format: "json",
          countrycodes: "za",
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

export const getAddressFromGeocode = async (req, res) => {
  const { query } = req.query;
  console.log("Received geocode request:");
  if (!query) {
    console.error("Missing 'query' parameter");
    return res.status(400).json({ message: "Missing 'query' parameter" });
  }

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,
          format: "json",
          countrycodes: "za",
          addressdetails: 1,
          limit: 5,
        },
        headers: {
          "User-Agent": "HalaalHub/1.0 (junaidadams117@gmail.com)",
        },
      }
    );
    console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Geocoding error:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to fetch geocoding results" });
  }
};

export const reportIssue = async (req, res) => {
  const { summary, description, page } = req.body;

  if (!summary || !description || !page) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Here you would typically save the issue to a database or send an email
  console.log("Issue reported:", { summary, description, page });

  return res.status(200).json({ message: "Issue reported successfully" });
};
