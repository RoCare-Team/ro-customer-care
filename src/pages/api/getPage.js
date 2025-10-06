// pages/api/getPage.js
import { getDBConnection } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { page_url } = req.query; // get page_url from query string
    if (!page_url) {
      return res.status(400).json({ message: 'page_url is required' });
    }

    const db = await getDBConnection();

    // Fetch row based on page_url
    // *** CORRECTION: Changed table name from 'pages' to 'page_tb' based on the image. ***
    const [rows] = await db.execute(
      'SELECT * FROM page_tb WHERE page_url = ? LIMIT 1',
      [page_url]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.status(200).json(rows[0]); // return single page data
  } catch (error) {
    console.error('DB Error:', error.message);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
}