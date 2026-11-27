import {json,requireAccess} from '../_auth.js';

export async function onRequest({request,env}) {
  const denied = requireAccess(request);
  if (denied) return denied;

  if (request.method !== 'POST') {
    return json({error:'Method not allowed'},405);
  }

  const missing = [];

if (!env.CLOUDINARY_CLOUD_NAME) missing.push('CLOUDINARY_CLOUD_NAME');
if (!env.CLOUDINARY_API_KEY) missing.push('CLOUDINARY_API_KEY');
if (!env.CLOUDINARY_API_SECRET) missing.push('CLOUDINARY_API_SECRET');

if (missing.length) {
  return json({
    error: 'Missing Cloudinary configuration',
    missing
  }, 500);
}

  const form = await request.formData();
  const file = form.get('image');

  if (!(file instanceof File)) {
    return json({error:'Choose an image'},400);
  }

  if (file.size > 8 * 1024 * 1024) {
    return json({error:'Image must be 8 MB or smaller'},400);
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ];

  if (!allowedTypes.includes(file.type)) {
    return json({error:'Use JPG, PNG, WEBP or GIF'},400);
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'jeiyien';

  const signatureText =
    `folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;

  const digest = await crypto.subtle.digest(
    'SHA-1',
    new TextEncoder().encode(signatureText)
  );

  const signature = Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2,'0'))
    .join('');

  const uploadForm = new FormData();
  uploadForm.append('file',file);
  uploadForm.append('api_key',env.CLOUDINARY_API_KEY);
  uploadForm.append('timestamp',String(timestamp));
  uploadForm.append('folder',folder);
  uploadForm.append('signature',signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method:'POST',
      body:uploadForm
    }
  );

  const result = await response.json();

  if (!response.ok || !result.secure_url) {
    return json({error:'Cloudinary image upload failed'},502);
  }

  return json({
    ok:true,
    path:result.secure_url
  });
}