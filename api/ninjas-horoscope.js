// api/ninjas-horoscope.js

export default async function handler(req, res) {
  // Abilita CORS (importante per chiamate da GitHub Pages)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { zodiac } = req.query;

  if (!zodiac) {
    return res.status(400).json({ error: 'Segno mancante' });
  }

  const sign = zodiac.toLowerCase().trim();

  // Validazione semplice
  const validSigns = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  if (!validSigns.includes(sign)) {
    return res.status(400).json({ error: 'Segno non valido' });
  }

  try {
    // 1. Prova prima con API Ninjas (la tua preferita)
    let horoscopeText = null;
    let source = 'ninjas';

    const ninjasUrl = `https://api.api-ninjas.com/v1/horoscope?zodiac=${sign}`;

    const ninjasResponse = await fetch(ninjasUrl, {
      headers: {
        'X-Api-Key': process.env.API_NINJAS_KEY
      }
    });

    if (ninjasResponse.ok) {
      const data = await ninjasResponse.json();
      horoscopeText = data.horoscope || "Le stelle sono un po' misteriose oggi...";
    } else {
      // Se Ninjas dà errore (es. 400 = non ancora pubblicato)
      console.log(`Ninjas non disponibile (${ninjasResponse.status}), passo a fallback`);

      // 2. Fallback su API alternativa (sempre disponibile)
      const fallbackUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=TODAY`;
      const fallbackResponse = await fetch(fallbackUrl);

      if (fallbackResponse.ok) {
        const json = await fallbackResponse.json();
        horoscopeText = json.data?.horoscope_data || "Le stelle oggi sono silenziose...";
        source = 'fallback';
      } else {
        throw new Error('Entrambe le API hanno fallito');
      }
    }

    // Risposta unificata per il frontend
    return res.status(200).json({
      horoscope: horoscopeText,
      date: new Date().toISOString().split('T')[0],
      sign: sign.charAt(0).toUpperCase() + sign.slice(1),
      source // opzionale: per debug
    });

  } catch (err) {
    console.error('Errore:', err.message);
    return res.status(500).json({ error: 'Errore interno del server' });
  }
}
