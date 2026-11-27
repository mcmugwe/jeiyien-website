export function requireAccess(request) {
  const hostname = new URL(request.url).hostname;

  // Allow local Wrangler development.
  if (hostname === '127.0.0.1' || hostname === 'localhost') {
    return null;
  }

  // Production requests must be authenticated by the middleware.
  if (request.headers.get('x-jeiyien-admin-authenticated') !== 'true') {
    return json({error:'Administrator login required'},401);
  }

  return null;
}

export const json=(data,status=200)=>new Response(JSON.stringify(data),{
 status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}
});
