// api/ninjas-horoscope.js

export default async function handler(req, res) {
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

  const validSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

  if (!validSigns.includes(sign)) {
    return res.status(400).json({ error: 'Segno non valido' });
  }

  try {
    let horoscopeText = null;
    let source = 'ninjas';

    // 1. Prova Ninjas
    const ninjasUrl = `https://api.api-ninjas.com/v1/horoscope?zodiac=${sign}`;
    const ninjasResponse = await fetch(ninjasUrl, {
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY }
    });

    if (ninjasResponse.ok) {
      const data = await ninjasResponse.json();
      horoscopeText = data.horoscope || "Le stelle sono un po' misteriose oggi...";
    } else {
      console.log(`Ninjas non disponibile (${ninjasResponse.status}), passo a fallback`);

      // 2. Nuovo fallback: Aztro (sempre disponibile, gratuita)
      const aztroUrl = `https://aztro.sameerkumar.website/?sign=${sign}&day=today`;
      const aztroResponse = await fetch(aztroUrl, { method: 'POST' });  // Aztro usa POST

      if (aztroResponse.ok) {
        const json = await aztroResponse.json();
        horoscopeText = json.description || "Le stelle oggi sono silenziose...";
        source = 'aztro';
      } else {
        throw new Error('Entrambe le API hanno fallito');
      }
    }

    return res.status(200).json({
      horoscope: horoscopeText,
      date: new Date().toISOString().split('T')[0],
      sign: sign.charAt(0).toUpperCase() + sign.slice(1),
      source
    });

  } catch (err) {
    console.error('Errore:', err.message);
    return res.status(500).json({ error: 'Errore interno del server' });
  }
}
