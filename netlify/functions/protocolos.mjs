import { getStore } from '@netlify/blobs';

// Contraseña que protege la escritura (debe coincidir con la de la app)
const PASSWORD = 'QUIROFANO1';

export default async (req) => {
  const store = getStore('protocolos');

  if (req.method === 'GET') {
    const data = await store.get('data', { type: 'json' });
    return Response.json(data ?? null);
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    let body;
    try { body = await req.json(); } catch { return new Response('Bad request', { status: 400 }); }
    if (!body || body.password !== PASSWORD) {
      return new Response('Unauthorized', { status: 401 });
    }
    if (!body.data || typeof body.data !== 'object') {
      return new Response('Invalid data', { status: 400 });
    }
    await store.setJSON('data', body.data);
    return Response.json({ ok: true });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config = { path: '/api/protocolos' };
