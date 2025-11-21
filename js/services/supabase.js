
export const SUPABASE_URL = 'https://aqyaxfrukssndxgctukf.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeWF4ZnJ1a3NzbmR4Z2N0dWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY0MTYsImV4cCI6MjA3Nzg4MjQxNn0.fqP4BfoGBr-A8piJevWto3DnJByYvLxB9gudq81KvJw';

export async function supabaseFetch(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...options.headers
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro na requisição');
  }
  return response.json();
}
