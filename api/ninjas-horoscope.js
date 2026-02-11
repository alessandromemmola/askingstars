// api/ninjas-horoscope.js

export default async function handler(req, res) {
  // Abilita CORS per tutti (importante su Vercel)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gestione OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { zodiac } = req.query;

  if (!zodiac) {
    return res.status(400).json({ error: 'Segno mancante' });
  }

  // Opzionale: validazione semplice (tenere o rimuovere)
  const validSigns = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  if (!validSigns.includes(zodiac.toLowerCase())) {
    return res.status(400).json({ error: 'Segno non valido' });
  }

  try {
    console.log(`Richiesta per zodiac: ${zodiac}`); // per debug nei log Vercel

    const response = await fetch(
      `https://api.api-ninjas.com/v1/horoscope?zodiac=${zodiac.toLowerCase()}`,
      {
        headers: {
          'X-Api-Key': process.env.API_NINJAS_KEY
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Ninjas error ${response.status}: ${errorText}`);
      return res.status(response.status).json({ error: `Errore API Ninjas: ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Errore interno:', err.message);
    return res.status(500).json({ error: 'Errore interno del server' });
  }
}
