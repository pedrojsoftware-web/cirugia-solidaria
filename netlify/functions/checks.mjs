import { getStore } from '@netlify/blobs';

// Estado compartido de las casillas de verificación (checklist).
// La lectura y escritura son abiertas (marcar/desmarcar no requiere contraseña).

export default async (req) => {
  const store = getStore('checks');

  if (req.method === 'GET') {
    const data = await store.get('data', { type: 'json' });
    return Response.json(data ?? {});
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    let body;
    try { body = await req.json(); } catch { return new Response('Bad request', { status: 400 }); }
    if (!body || typeof body.checks !== 'object' || Array.isArray(body.checks)) {
      return new Response('Invalid data', { status: 400 });
    }
    await store.setJSON('data', body.checks);
    return Response.json({ ok: true });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config = { path: '/api/checks' };
