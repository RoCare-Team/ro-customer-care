// pages/api/getBrands.js
import { getDBConnection } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") 
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const db = await getDBConnection();

    // Select brand and a representative page_url for that brand
    const [rows] = await db.execute(`
      SELECT brand, MIN(page_url) AS page_url
      FROM page_tb
      GROUP BY brand
    `);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No brands found in database" });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error("DB Error:", error);
    return res.status(500).json({ error: "Database error", details: error.message });
  }
}
