/* Config Supabase */
const SUPABASE_URL = 'https://aqyaxfrukssndxgctukf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeWF4ZnJ1a3NzbmR4Z2N0dWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY0MTYsImV4cCI6MjA3Nzg4MjQxNn0.fqP4BfoGBr-A8piJevWto3DnJByYvLxB9gudq81KvJw';

/* Lista Categorias */
const CATEGORIES = [
    { id: 'amizade', name: 'Amizade' },
    { id: 'amor_romance', name: 'Amor e Romance' },
    { id: 'carros_motos', name: 'Carros e Motos' },
    { id: 'cidades', name: 'Cidades' },
    { id: 'compra_venda', name: 'Compra e Venda' },
    { id: 'concursos', name: 'Concursos' },
    { id: 'desenhos_animes', name: 'Desenhos e Animes' },
    { id: 'divulgacao', name: 'Divulgação' },
    { id: 'educacao', name: 'Educação' },
    { id: 'emagrecimento', name: 'Emagrecimento' },
    { id: 'esportes', name: 'Esportes' },
    { id: 'eventos', name: 'Eventos' },
    { id: 'fas', name: 'Fãs' },
    { id: 'figurinhas_stickers', name: 'Figurinhas e Stickers' },
    { id: 'filmes_series', name: 'Filmes e Séries' },
    { id: 'frases_mensagens', name: 'Frases e Mensagens' },
    { id: 'futebol', name: 'Futebol' },
    { id: 'games_jogos', name: 'Games e Jogos' },
    { id: 'ganhar_dinheiro', name: 'Ganhar Dinheiro' },
    { id: 'imobiliaria', name: 'Imobiliária' },
    { id: 'investimentos_financas', name: 'Investimentos e Finanças' },
    { id: 'links', name: 'Links' },
    { id: 'memes_engracados', name: 'Memes Engraçados' },
    { id: 'moda_beleza', name: 'Moda e Beleza' },
    { id: 'musica', name: 'Música' },
    { id: 'namoro', name: 'Namoro' },
    { id: 'negocios_empreendedorismo', name: 'Negócios e Empreendedorismo' },
    { id: 'noticias', name: 'Notícias' },
    { id: 'outros', name: 'Outros' },
    { id: 'politica', name: 'Política' },
    { id: 'profissoes', name: 'Profissões' },
    { id: 'receitas', name: 'Receitas' },
    { id: 'redes_sociais', name: 'Redes Sociais' },
    { id: 'religiao', name: 'Religião' },
    { id: 'shitpost', name: 'Shitpost' },
    { id: 'tecnologia', name: 'Tecnologia' }
];

const ICONS = { /* ... (todo o objeto ICONS do código antigo) ... */ };

/* Req */
async function supabaseFetch(endpoint, options = {}) {
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

const DB_NAME = 'kdefy_grupos';
const DB_VERSION = 1;
let db;

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('grupos')) {
        db.createObjectStore('grupos', { keyPath: 'id' });
      }
    };
  });
}

async function salvarGrupoLocal(grupo) {
  await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['grupos'], 'readwrite');
    const store = transaction.objectStore('grupos');
    const request = store.put(grupo);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function buscarGruposLocais() {
  await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['grupos'], 'readonly');
    const store = transaction.objectStore('grupos');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removerGrupoLocal(id) {
  await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['grupos'], 'readwrite');
    const store = transaction.objectStore('grupos');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function limparIndexDB() {
  await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['grupos'], 'readwrite');
    const store = transaction.objectStore('grupos');
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}