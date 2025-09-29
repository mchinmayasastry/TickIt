const API_BASE = '';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const pretty = (obj) => JSON.stringify(obj, null, 2);

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

// Health
$('#btnHealth').addEventListener('click', async () => {
  const el = $('#healthOut');
  el.textContent = 'Loading...';
  try {
    const data = await api('/api/health');
    el.textContent = pretty(data);
  } catch (e) {
    el.textContent = `Error: ${e.message}`;
  }
});

// Knowledge search
$('#formSearch').addEventListener('submit', async (e) => {
  e.preventDefault();
  const q = $('#searchQ').value.trim();
  const list = $('#searchResults');
  list.innerHTML = '<li>Loading...</li>';
  try {
    const results = await api(`/api/knowledge/search?q=${encodeURIComponent(q)}`);
    if (!results.length) {
      list.innerHTML = '<li>No results</li>';
      return;
    }
    list.innerHTML = results
      .map((r) => `<li><strong>${r.title}</strong> <span class="badge">${r.tags.join(', ')}</span><div class="small">${r.content}</div></li>`) 
      .join('');
  } catch (e) {
    list.innerHTML = `<li>Error: ${e.message}</li>`;
  }
});

// Chatbot
$('#formChat').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('#chatMsg').value.trim();
  const create = $('#createTicketChk').checked;
  const out = $('#chatOut');
  out.textContent = 'Thinking...';
  try {
    const data = await api(`/api/chat${create ? '?create=true' : ''}`, {
      method: 'POST',
      body: JSON.stringify({ message: msg }),
    });
    out.textContent = pretty(data);
  } catch (e) {
    out.textContent = `Error: ${e.message}`;
  }
});

// Create Ticket
$('#formTicket').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = $('#ticketTitle').value.trim();
  const description = $('#ticketDesc').value.trim();
  const priority = $('#ticketPriority').value;
  const out = $('#ticketOut');
  out.textContent = 'Submitting...';
  try {
    const data = await api('/api/tickets', {
      method: 'POST',
      body: JSON.stringify({ title, description, priority, source: 'web' }),
    });
    out.textContent = pretty(data);
  } catch (e) {
    out.textContent = `Error: ${e.message}`;
  }
});

// List tickets
$('#btnLoadTickets').addEventListener('click', async () => {
  const list = $('#ticketsList');
  list.innerHTML = '<li>Loading...</li>';
  try {
    const items = await api('/api/tickets');
    if (!items.length) {
      list.innerHTML = '<li>No tickets yet</li>';
      return;
    }
    list.innerHTML = items
      .map((t) => `<li><strong>${t.title}</strong> <span class="badge">${t.status}</span><div class="small">${t.description}</div><div class="small">Category: ${t.category || '—'} | Assignee: ${t.assigneeTeam || '—'}</div></li>`) 
      .join('');
  } catch (e) {
    list.innerHTML = `<li>Error: ${e.message}</li>`;
  }
});
