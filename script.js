const slugify = (text) => text
  .replace(/^\s*\d+\.\s*/, '')
  .toLowerCase()
  .replace(/[“”"'’]/g, "")
  .replace(/&/g, "and")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
menuToggle.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
siteNav.addEventListener('click', (e) => {
  if (e.target.matches('a')) {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

function createToc(article) {
  const nav = document.getElementById('tocNav');
  const headings = [...article.querySelectorAll('h1')].filter((h, i) => i > 0);
  nav.innerHTML = '';

  headings.forEach((heading) => {
    if (!heading.id) heading.id = slugify(heading.textContent);
    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent.replace(/^\d+\.\s*/, '');
    nav.appendChild(a);
  });

  const links = [...nav.querySelectorAll('a')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-20% 0px -68% 0px' });
  headings.forEach(h => observer.observe(h));
}

function enhanceContent(article) {
  const allHeadings = article.querySelectorAll('h1,h2,h3');
  allHeadings.forEach(h => { if (!h.id) h.id = slugify(h.textContent); });

  // Style WORK / PROVIDE / PROTECT / LEAD / SERVE sections as grouped cards.
  const themeNames = new Set(['WORK','PROVIDE','PROTECT','LEAD','SERVE']);
  [...article.querySelectorAll('h2')].forEach(h2 => {
    if (themeNames.has(h2.textContent.trim())) {
      const wrapper = document.createElement('section');
      wrapper.className = 'theme-card';
      h2.parentNode.insertBefore(wrapper, h2);
      let node = h2;
      while (node) {
        const next = node.nextSibling;
        if (node !== h2 && node.nodeType === 1 && (node.matches('h2') || node.matches('hr') || node.matches('h1'))) break;
        wrapper.appendChild(node);
        node = next;
      }
    }
  });

  [...article.querySelectorAll('h1')].forEach(h1 => {
    if (/Big Event #/i.test(h1.textContent)) h1.classList.add('event-heading');
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -30px' });
  [...article.children].forEach(el => revealObserver.observe(el));
}

async function loadMarkdown() {
  const article = document.getElementById('content');
  try {
    const response = await fetch('content.md', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();

    marked.use({ gfm: true, breaks: false });
    const unsafeHtml = marked.parse(markdown);
    article.innerHTML = DOMPurify.sanitize(unsafeHtml);

    const vision = [...article.querySelectorAll('blockquote p')][0];
    if (vision) {
      const text = vision.textContent.replace(/^Working vision:\s*/i, '');
      document.getElementById('heroLede').textContent = text;
    }

    enhanceContent(article);
    createToc(article);
  } catch (error) {
    article.innerHTML = `
      <section class="theme-card visible">
        <h2>Unable to load content.md</h2>
        <p>This site reads its content from <strong>content.md</strong>. If you're opening the HTML directly from your computer, run a small local web server or deploy the folder to a static host.</p>
        <p><code>${String(error.message)}</code></p>
      </section>`;
  }
}

const staticReveal = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => staticReveal.observe(el));

loadMarkdown();
