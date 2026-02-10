export default async function handler(req, res) {
  const { zodiac } = req.query;

  if (!zodiac) {
    return res.status(400).json({ error: 'Segno mancante' });
  }

  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/horoscope?zodiac=${zodiac}`,
      {
        headers: {
          'X-Api-Key': process.env.API_NINJAS_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Errore API: ${response.status}`);
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Errore interno' });
  }
}
