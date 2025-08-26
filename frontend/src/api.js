const fromWindow = (typeof window !== 'undefined' && window.__APP_CONFIG__ && window.__APP_CONFIG__.API_BASE) || null;
const fromVite = import.meta.env.VITE_API_BASE_URL;
const API_BASE = fromWindow || fromVite || 'http://localhost:8000';

async function handle(resp) {
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || resp.statusText);
  }
  if (resp.status === 204) return null;
  return await resp.json();
}

export async function addBook(payload) {
  return handle(await fetch(`${API_BASE}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }));
}

export async function getBook(id) {
  return handle(await fetch(`${API_BASE}/books/${encodeURIComponent(id)}`));
}

export async function deleteBook(id) {
  return handle(await fetch(`${API_BASE}/books/${encodeURIComponent(id)}`, { method: 'DELETE' }));
}

export async function editBook(id, patch) {
  return handle(await fetch(`${API_BASE}/books/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  }));
}