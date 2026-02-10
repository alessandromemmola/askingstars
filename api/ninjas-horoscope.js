// api/ninjas-horoscope.js

const zodiacMap = {
  ariete: 'aries',
  toro: 'taurus',
  gemelli: 'gemini',
  cancro: 'cancer',
  leone: 'leo',
  vergine: 'virgo',
  bilancia: 'libra',
  scorpione: 'scorpio',
  sagittario: 'sagittarius',
  capricorno: 'capricorn',
  acquario: 'aquarius',
  pesci: 'pisces'
};

export default async function handler(req, res) {
  const { zodiac: inputZodiac } = req.query;

  if (!inputZodiac) {
    return res.status(400).json({ error: 'Segno mancante' });
  }

  // Mappa segno italiano → inglese
  const zodiac = zodiacMap[inputZodiac.toLowerCase()];

  if (!zodiac) {
    return res.status(400).json({ error: 'Segno non valido' });
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
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Errore API Ninjas: ${response.status} - ${errorText}` });
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Errore interno del server' });
  }
}
