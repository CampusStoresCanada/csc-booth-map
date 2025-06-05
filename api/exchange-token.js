export default async function handler(req, res) {
  try {
    const clientId = '209d872b-594c-808c-839c-0037f137c1ff';
    const clientSecret = 'Yr4LzrZejsmnPTXX9RLKoqCieNfrP67UHuyjzPtXBze';
    const code = '0349399f-af2f-45e9-944d-25a20ddde5f5';
    
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://www.campusstores.events/webhook-ack'
      })
    });
    
    const data = await response.json();
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
