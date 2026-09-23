
(() => {
  const sidebar = document.getElementById('toc');
  const content = document.getElementById('entries');
  const search = document.getElementById('search');

  const collator = new Intl.Collator('sv', { sensitivity: 'base' });

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function renderEntryCell(text) {
    // glossary.json intentionally allows a few short inline HTML snippets (emphasis only).
    return String(text)
      .replace(/&/g, '&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/&lt;em&gt;/g,'<em>').replace(/&lt;\/em&gt;/g,'</em>');
  }

  function render(items) {
    const sorted = [...items].sort((a,b) => collator.compare(a.swedish,b.swedish));
    sidebar.innerHTML = sorted.map(item => `<a href="#${escapeHtml(item.id)}" data-id="${escapeHtml(item.id)}">${escapeHtml(item.swedish)}</a>`).join('');
    content.innerHTML = sorted.map(item => {
      const rows = item.entries.map(row => `<tr><td>${row.star ? '<span class="star">' : ''}${renderEntryCell(row.english)}${row.star ? '</span>' : ''}</td><td>${renderEntryCell(row.nuance)}</td><td>${renderEntryCell(row.example)}</td></tr>`).join('');
      const notes = (item.notes||[]).map(n => `<div class="notes">${renderEntryCell(n)}</div>`).join('');
      const examples = (item.examples||[]).map(e => `<div class="example">${renderEntryCell(e)}</div>`).join('');
      return `<section id="${escapeHtml(item.id)}" data-swedish="${escapeHtml(item.swedish)}"><h3>${escapeHtml(item.swedish)}</h3>${item.lead ? `<p class="lead">${renderEntryCell(item.lead)}</p>` : ''}<div class="card"><table><thead><tr><th>Engelska</th><th>Nyans</th><th>Exempel</th></tr></thead><tbody>${rows || '<tr><td colspan="3" class="empty">Ingen information.</td></tr>'}</tbody></table>${notes}${examples}</div></section>`;
    }).join('');
    setupObserver();
  }

  function setupObserver() {
    const links = [...sidebar.querySelectorAll('a')];
    const sections = [...content.querySelectorAll('section')];
    const byId = new Map(links.map(a => [a.dataset.id, a]));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { links.forEach(a=>a.classList.remove('active')); byId.get(entry.target.id)?.classList.add('active'); } });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }

  fetch('glossary.json', { cache: 'no-store' })
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(items => {
      render(items);
      search.addEventListener('input', () => {
        const q = search.value.trim().toLocaleLowerCase('sv');
        sidebar.querySelectorAll('a').forEach(a => {
          const item = items.find(x => x.id === a.dataset.id);
          const hay = JSON.stringify(item).toLocaleLowerCase('sv');
          a.style.display = !q || hay.includes(q) ? '' : 'none';
        });
        content.querySelectorAll('section').forEach(section => {
          const item = items.find(x => x.id === section.id);
          const hay = JSON.stringify(item).toLocaleLowerCase('sv');
          section.style.display = !q || hay.includes(q) ? '' : 'none';
        });
      });
    })
    .catch(err => {
      content.innerHTML = `<p class="empty">Kunde inte läsa glossary.json. På GitHub Pages ska filen ligga i samma katalog som index.html.</p>`;
      console.error(err);
    });
})();
