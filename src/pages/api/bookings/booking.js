export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_no, status } = req.body;

    // Forward to external API
    const formData = new URLSearchParams();
    formData.append('user_no', user_no);
    if (status) formData.append('status', status);

    const externalApiResponse = await fetch(
      'https://www.waterpurifierservicecenter.in/customer/app/all_complaints_mb.php',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      }
    );

    if (!externalApiResponse.ok) {
      throw new Error(`External API error: ${externalApiResponse.status}`);
    }

    const data = await externalApiResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Booking API error:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
}
