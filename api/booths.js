export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const testData = {
      results: [
        {
          properties: {
            'Booth Number': {
              title: [{ plain_text: '100' }]  // This should change Booth_100
            },
            'Status': {
              status: { name: 'sold' }
            },
            'Contact Verified': {
              relation: []
            }
          }
        },
        {
          properties: {
            'Booth Number': {
              title: [{ plain_text: '201' }]  // This should change Booth_201 (VitalSource)
            },
            'Status': {
              status: { name: 'available' }  // This should make it available instead of sold
            },
            'Contact Verified': {
              relation: []
            }
          }
        },
        {
          properties: {
            'Booth Number': {
              title: [{ plain_text: '501' }]  // This should change Booth_501 (Login)
            },
            'Status': {
              status: { name: 'available' }  // This should make it available instead of sold
            },
            'Contact Verified': {
              relation: []
            }
          }
        }
      ]
    };
    
    res.status(200).json(testData);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch booth data', details: error.message });
  }
}
