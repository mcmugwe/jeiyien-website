function unauthorized() {
  return new Response('Administrator login required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Jeiyien Administrator", charset="UTF-8"',
      'Cache-Control': 'no-store'
    }
  });
}

function equal(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

  // Allow local development.
  if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') {
    return next();
  }

  const adminPage = path === '/admin' || path.startsWith('/admin/');
  const writeRequest =
    (path === '/api/content' && method === 'PUT') ||
    (path === '/api/upload' && method === 'POST');
  const optionalAdminRead =
    path === '/api/content' && method === 'GET';

  const headers = new Headers(request.headers);
  headers.delete('x-jeiyien-admin-authenticated');

  const auth = headers.get('Authorization');
  const needsCredentials = adminPage || writeRequest ||
    (optionalAdminRead && !!auth);

  if (needsCredentials) {
    if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD) {
      return new Response('Administrator credentials are not configured.', {
        status: 500
      });
    }

    if (!auth || !auth.startsWith('Basic ')) return unauthorized();

    let supplied;
    try {
      const decoded = atob(auth.slice(6));
      supplied = new TextDecoder().decode(
        Uint8Array.from(decoded, c => c.charCodeAt(0))
      );
    } catch {
      return unauthorized();
    }

    const separator = supplied.indexOf(':');
    if (separator < 0) return unauthorized();

    const username = supplied.slice(0, separator);
    const password = supplied.slice(separator + 1);

    if (!equal(username, env.ADMIN_USERNAME) ||
        !equal(password, env.ADMIN_PASSWORD)) {
      return unauthorized();
    }

    headers.set('x-jeiyien-admin-authenticated', 'true');
  }

  return next(new Request(request, { headers }));
}

