export default async function handler(req, res) {
  // Add CORS headers so your frontend can talk to this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/209a69bf0cfd80018854e7070284f3c5/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer secret_TQQbLQPEXIjZpTPmNoJ0NXS0FK872afq2QN7xVW9SQy`,
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
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch booth data' });
  }
}
