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

export const searchAddress = async (req, res) => {
  const { q } = req.query;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=za&q=${encodeURIComponent(
        q
      )}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
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
          "User-Agent": "EatHalal/1.0 (junaidadams117@gmail.com)",
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

  if (!query) {
    console.error("Missing 'query' parameter");
    return res.status(400).json({ message: "Missing 'query' parameter" });
  }

  // --- STEP 1: Normalize user query ---
  const normalizeQuery = (q) => {
    let text = q.trim().toLowerCase();

    // Smart "gordons bay" → "gordon's bay"
    text = text.replace(/(\w+)s (\w+)/g, "$1's $2");

    return text;
  };

  const normalizedQuery = normalizeQuery(query);

  // Helper: perform a Nominatim request
  const nominatimSearch = async (q) => {
    return axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q,
        format: "json",
        countrycodes: "za",
        addressdetails: 1,
        limit: 5,
        osm_tag: "place:city,place:town,place:village,place:suburb",
      },
      headers: {
        "User-Agent": "HalaalHub/1.0 (junaidadams117@gmail.com)",
      },
    });
  };

  try {
    // --- STEP 2: Perform two searches (raw + normalized) ---
    const [rawRes, normalizedRes] = await Promise.all([
      nominatimSearch(query),
      normalizedQuery !== query
        ? nominatimSearch(normalizedQuery)
        : Promise.resolve({ data: [] }),
    ]);

    // --- STEP 3: Merge and dedupe results ---
    const combined = [...rawRes.data, ...normalizedRes.data];

    const unique = [];
    const seen = new Set();

    for (const item of combined) {
      const key = `${item.lat}-${item.lon}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }

    // --- STEP 4: Filter for administrative places only ---
    const allowedTypes = ["city", "town", "village", "suburb", "hamlet"];
    const filtered = unique.filter(
      (r) => r.class === "place" && allowedTypes.includes(r.type)
    );

    // --- STEP 5: Fallback (avoid returning empty) ---
    const finalResults = filtered.length > 0 ? filtered : unique;

    console.log("Final geocode results:", finalResults);

    return res.status(200).json(finalResults);
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

export const suggestFeature = async (req, res) => {
  const { summary, description } = req.body;

  if (!summary || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Here you would typically save the feature suggestion to a database or send an email
  console.log("Feature suggested:", { summary, description });

  return res
    .status(200)
    .json({ message: "Feature suggestion submitted successfully" });
};
