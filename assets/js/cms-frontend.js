(async function(){
 try{
  const res=await fetch('cms/api.php?action=public'); if(!res.ok)return; const data=await res.json();
  const active=(data.banners||[]).find(b=>b.active);
  if(active){const hero=document.querySelector('#hero>img');if(hero){hero.src=active.image;hero.alt=active.alt||'Jeiyien Trading Company Limited';}}
  const grid=document.querySelector('#portfolio .isotope-container');
  if(grid){
   const labels={road:'ROAD WORKS',building:'BUILDING & CONSTRUCTION',water:'WATER & DRAINAGE',cabro:'CABRO PAVING'};
   const filters={road:'filter-app',building:'filter-product',water:'filter-branding',cabro:'filter-books'};
   grid.innerHTML=(data.projects||[]).map(p=>{
    const img=p.image||'';const title=p.title||'Project';const desc=p.description||'';const id=p.id||'';
    const gallery=(p.gallery||[]).map(src=>`<a class="glightbox visually-hidden" data-gallery="portfolio-${id}" href="${src}" title="${title}"></a>`).join('');
    return `<div class="col-lg-4 col-md-6 portfolio-item isotope-item ${filters[p.category]||'filter-product'}" data-project="${id}">
      <div class="portfolio-content h-100"><span class="portfolio-category-badge">${labels[p.category]||'PROJECT'}</span>
      <img alt="${(p.alt||title).replace(/"/g,'&quot;')}" class="img-fluid" src="${img}" loading="lazy" decoding="async"/>
      <div class="portfolio-info"><h4>${title}</h4><p>${desc}</p>
      <a class="glightbox preview-link" data-gallery="portfolio-${id}" href="${img}" title="${title}"><i class="bi bi-zoom-in"></i></a>${gallery}
      <a aria-label="More about ${title}" class="details-link" href="project-details.html?project=${encodeURIComponent(id)}" title="More about ${title}"><i class="bi bi-link-45deg"></i></a></div></div></div>`;
   }).join('');
   if(window.Isotope){setTimeout(()=>{const el=document.querySelector('.isotope-container');if(el&&el.isotopeInstance){el.isotopeInstance.arrange()}},300);}
  }
 }catch(e){console.warn('Jeiyien CMS content could not be loaded',e)}
})();
