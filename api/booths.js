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
    console.log('Fetching from real Notion database...');
    
    const response = await fetch(`https://api.notion.com/v1/databases/209a69bf0cfd80018854e7070284f3c5/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({ 
        page_size: 100,
        sorts: [
          {
            property: "Booth Number",
            direction: "ascending"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Notion API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.results.length} booth records from Notion`);
    
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error fetching from Notion:', error);
    res.status(500).json({ 
      error: 'Failed to fetch booth data', 
      details: error.message 
    });
  }
}
