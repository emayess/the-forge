const slugify = text => text.replace(/^\s*\d+\.\s*/, '').toLowerCase().replace(/[“”"'’]/g, '').replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
// Fragment links must stay on this page even when event shells use a base URL.
document.querySelectorAll('a[href^="#"]').forEach(a => { a.href = location.pathname + a.getAttribute('href'); });
menuToggle.addEventListener('click', () => { const open = siteNav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(open)); });
siteNav.addEventListener('click', () => { siteNav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); });
menuToggle.addEventListener('keydown', e => { if(e.key === 'Escape') { siteNav.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); } });
function splitPages(markdown) {
  const pages = {};
  const pattern = /<!-- page:([a-z-]+) -->\s*([\s\S]*?)(?=<!-- page:|$)/g;
  for(const match of markdown.matchAll(pattern)) pages[match[1]] = match[2].trim().replace(/\n---\s*$/, '');
  return pages;
}
function sectionGroups(article) {
  const headings = [...article.querySelectorAll(':scope > h2')];
  headings.forEach(heading => {
    const wrapper = document.createElement('section');
    wrapper.className = 'home-section'; wrapper.id = slugify(heading.textContent);
    article.insertBefore(wrapper,heading);
    let node=heading;
    while(node) { const next=node.nextSibling; if(node!==heading && node.nodeType===1 && node.matches('h2')) break; wrapper.appendChild(node); node=next; }
  });
  const eventSection = article.querySelector('#adventures-with-a-purpose');
  if(eventSection) {
    const grid=document.createElement('div');grid.className='event-grid';
    [...eventSection.querySelectorAll('h3')].forEach((heading,index) => {
      const card=document.createElement('div');card.className='event-card';
      let node=heading;
      while(node) { const next=node.nextSibling; if(node!==heading && node.nodeType===1 && node.matches('h3')) break; card.appendChild(node);node=next; }
      const link=card.querySelector('a');
      if(link) { link.className='card-link';link.setAttribute('aria-label',heading.textContent+' — event details'); }
      if(index===0)card.classList.add('kickoff-card');
      const number=document.createElement('span'); number.className='card-number';number.setAttribute('aria-hidden','true');number.textContent=String(index+1).padStart(2,'0');card.prepend(number);
      grid.appendChild(card);
    });
    eventSection.appendChild(grid);
  }
}
function createToc(article) {
  const nav=document.getElementById('tocNav');if(!nav)return;
  const counts={};
  [...article.querySelectorAll('h1,h2,h3')].forEach(h => { const slug=slugify(h.textContent)||'section';counts[slug]=(counts[slug]||0)+1;h.id=slug+(counts[slug]>1?'-'+counts[slug]:''); });
  const level=document.body.dataset.page==='plan'?'h1':'h2';
  [...article.querySelectorAll(level)].forEach(h => {const a=document.createElement('a');a.href=location.pathname+'#'+h.id;a.textContent=h.textContent.replace(/^\d+\.\s*/,'');nav.appendChild(a);});
}
async function loadMarkdown() {
  const article=document.getElementById('content');
  try {
    const response=await fetch('content.md',{cache:'no-cache'});
    if(!response.ok)throw new Error('Content could not be retrieved.');
    const markdown=await response.text();const pages=splitPages(markdown);const page=document.body.dataset.page||'home';
    const collections={about:['vision','identity','bigger-idea'],formation:['rhythm','formation','year','progression'],dads:['dads']};
    let source;
    if(page==='plan') source=markdown.split('<!-- page:home -->')[0];
    else if(collections[page])source=collections[page].map(key=>pages[key]).join('\n\n---\n\n');
    else source=pages[page];
    if(!source)throw new Error('This page could not be found in the working plan.');
    article.innerHTML=DOMPurify.sanitize(marked.parse(source,{gfm:true}));
    if(page==='home') {
      const heading=article.querySelector('h1'),lede=heading?.nextElementSibling;
      document.getElementById('heroTitle').textContent=heading?.textContent||'The Forge';
      document.getElementById('heroLede').textContent=lede?.textContent||'';
      heading?.remove();lede?.remove();sectionGroups(article);
    } else {
      const first=article.querySelector('h1');
      document.title=(first?.textContent.replace(/^\d+\.\s*/,'')||'Working plan')+' | The Forge';
      createToc(article);
    }
    if(location.hash)document.getElementById(location.hash.slice(1))?.scrollIntoView();
  } catch(error) {
    article.innerHTML='<h2>We couldn’t load this page.</h2><p>Please refresh or <a href="content.md">open the Markdown working plan</a>.</p>';
  }
}
loadMarkdown();
