export async function GET() {
  try {
    const response = await fetch('https://waterpurifierservicecenter.in/customer/app/lead_cancel_reason.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    return Response.json({
      success: true,
      reasons: data.reasons || data || [],
    });

  } catch (error) {
    console.error('Error fetching cancel reasons:', error);
    
    // Return fallback reasons if API fails
    return Response.json({
      success: false,
      error: error.message,
      reasons: [
        { id: 1, reason: "Changed my mind" },
        { id: 2, reason: "Found a better service provider" },
        { id: 3, reason: "Emergency came up" },
        { id: 4, reason: "Technical issues" },
        { id: 5, reason: "Price concerns" },
        { id: 6, reason: "Other" }
      ]
    }, { status: 200 });
  }
}