import {json, requireAccess} from '../_auth.js';
export async function onRequest({request,env}) {
 const hostname = new URL(request.url).hostname;
 const admin = hostname === '127.0.0.1' || hostname === 'localhost' || request.headers.get('x-jeiyien-admin-authenticated') === 'true';
 if(request.method==='GET') {
  const projectSql = admin
   ? 'SELECT id,title,description,category,location,year,duration,image,alt,gallery_json,published FROM projects ORDER BY sort_order, updated_at DESC'
   : 'SELECT id,title,description,category,location,year,duration,image,alt,gallery_json,published FROM projects WHERE published=1 ORDER BY sort_order, updated_at DESC';
  const [p,b]=await Promise.all([
   env.DB.prepare(projectSql).all(),
   env.DB.prepare('SELECT id,image,alt,active FROM banners ORDER BY sort_order').all()
  ]);
  return json({projects:(p.results||[]).map(x=>({...x,gallery:JSON.parse(x.gallery_json||'[]'),published:!!x.published})),
   banners:(b.results||[]).map(x=>({...x,active:!!x.active}))});
 }
 const denied=requireAccess(request);if(denied)return denied;
 if(request.method!=='PUT')return json({error:'Method not allowed'},405);
 const body=await request.json().catch(()=>null);
 if(!body||!Array.isArray(body.projects)||!Array.isArray(body.banners))return json({error:'Invalid content payload'},400);
 const batch=[env.DB.prepare('DELETE FROM projects'),env.DB.prepare('DELETE FROM banners')];
 for(let i=0;i<body.projects.length;i++){
  const p=body.projects[i]; if(!p.id||!p.title||!p.image)return json({error:'Every project needs an ID, title and image'},400);
  batch.push(env.DB.prepare(`INSERT INTO projects(id,title,description,category,location,year,duration,image,alt,gallery_json,published,sort_order,updated_at)
   VALUES(?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`)
   .bind(String(p.id),String(p.title),String(p.description||''),String(p.category||'road'),String(p.location||''),String(p.year||''),String(p.duration||''),String(p.image),String(p.alt||''),JSON.stringify(Array.isArray(p.gallery)?p.gallery:[]),p.published===false?0:1,i));
 }
 for(let i=0;i<body.banners.length;i++){const b=body.banners[i];batch.push(env.DB.prepare('INSERT INTO banners(id,image,alt,active,sort_order) VALUES(?,?,?,?,?)').bind(String(b.id||`banner-${i+1}`),String(b.image),String(b.alt||''),b.active?1:0,i));}
 await env.DB.batch(batch);
 return json({ok:true});
}

