export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { lead_id, reason, comment } = req.body;

    // Validate required fields
    if (!lead_id || !reason) {
      return res.status(400).json({ success: false, error: 'Lead ID and reason are required' });
    }

    // Prepare form data for the PHP API
    const formData = new FormData();
    formData.append('lead_id', lead_id.toString());
    formData.append('reason', reason);
    formData.append('comment', comment || '');

    const response = await fetch('https://waterpurifierservicecenter.in/customer/app/cancel_complaint_mb.php', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Check if cancellation was successful
    if (data.error === false || data.success === true || data.status === 'success') {
      return res.status(200).json({
        success: true,
        message: data.message || 'Booking cancelled successfully',
        data: data
      });
    } else {
      return res.status(400).json({
        success: false,
        error: data.message || data.error || 'Failed to cancel booking'
      });
    }

  } catch (error) {
    console.error('Error cancelling booking:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
