// functions/oroscopo.js
export default async (request) => {
  const { searchParams } = new URL(request.url);
  const segno = searchParams.get('segno');
  const day = searchParams.get('day') || 'TODAY';

  if (!segno) {
    return new Response(JSON.stringify({ error: 'Parametro segno mancante' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const apiUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${segno}&day=${day}`;
    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',       // Abilita CORS per tutti (o specifica il tuo dominio)
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'API non disponibile', details: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};