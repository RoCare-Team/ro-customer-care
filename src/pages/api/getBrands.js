// pages/api/getBrands.js
import { getDBConnection } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const db = await getDBConnection();

    // Fetch all brands with all their page_urls
    const [rows] = await db.execute(`
      SELECT brand, GROUP_CONCAT(page_url) AS page_urls
      FROM page_tb
      GROUP BY brand
    `);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No brands found in database" });
    }

    const formattedRows = rows.map(row => {
      const urlsArray = row.page_urls
        ? row.page_urls.split(",").map(url => url.trim().toLowerCase())
        : [];

      return {
        brand: row.brand,
        page_urls: urlsArray,               // existing array
        main_url: urlsArray[0] || null      // new key: first URL or null
      };
    });

    return res.status(200).json(formattedRows);
  } catch (error) {
    console.error("DB Error:", error);
    return res.status(500).json({
      error: "Database error",
      details: error.message
    });
  }
}
