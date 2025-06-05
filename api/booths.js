export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const accessToken = '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';
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28'
  };

  try {
    console.log('Fetching booth data...');
    
    // Step 1: Get booth data
    const boothResponse = await fetch(`https://api.notion.com/v1/databases/209a69bf0cfd80018854e7070284f3c5/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        page_size: 100,
        sorts: [{ property: "Booth Number", direction: "ascending" }]
      })
    });

    if (!boothResponse.ok) {
      throw new Error(`Booth API error: ${boothResponse.status}`);
    }

    const boothData = await boothResponse.json();
    console.log(`Fetched ${boothData.results.length} booths`);

    // Step 2: Enrich with organization data
    const enrichedResults = await Promise.all(
      boothData.results.map(async (booth) => {
        const contactId = booth.properties['Contact Verified']?.relation?.[0]?.id;
        
        if (!contactId) {
          return booth; // No contact, return as-is
        }

        try {
          // Step 2a: Get contact details
          const contactResponse = await fetch(`https://api.notion.com/v1/pages/${contactId}`, {
            headers
          });

          if (!contactResponse.ok) {
            console.warn(`Failed to fetch contact ${contactId}`);
            return booth;
          }

          const contact = await contactResponse.json();
          const orgId = contact.properties['Organization']?.relation?.[0]?.id;

          if (!orgId) {
            return booth; // No organization, return as-is
          }

          // Step 2b: Get organization details
          const orgResponse = await fetch(`https://api.notion.com/v1/pages/${orgId}`, {
            headers
          });

          if (!orgResponse.ok) {
            console.warn(`Failed to fetch organization ${orgId}`);
            return booth;
          }

          const organization = await orgResponse.json();
          const orgName = organization.properties['Organization']?.title?.[0]?.plain_text;

          // Add the organization name to the booth data
          return {
            ...booth,
            _organizationName: orgName || 'Unknown Organization'
          };

        } catch (error) {
          console.warn(`Error enriching booth ${booth.id}:`, error.message);
          return booth;
        }
      })
    );

    console.log('Enriched data with organization names');
    
    res.status(200).json({
      ...boothData,
      results: enrichedResults
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch booth data', 
      details: error.message 
    });
  }
}
