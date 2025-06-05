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
              title: [{ plain_text: '100' }]  // String/title field
            },
            'Status': {
              status: { name: 'sold' }  // Status field
            },
            'Contact Verified': {
              relation: [{ id: 'some-id' }]  // Relation field - we'll ignore for now
            }
          }
        },
        {
          properties: {
            'Booth Number': {
              title: [{ plain_text: '101' }]
            },
            'Status': {
              status: { name: 'available' }
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
