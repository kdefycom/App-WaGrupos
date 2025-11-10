
// Configuração Supabase
const SUPABASE_URL = 'https://aqyaxfrukssndxgctukf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeWF4ZnJ1a3NzbmR4Z2N0dWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY0MTYsImV4cCI6MjA3Nzg4MjQxNn0.fqP4BfoGBr-A8piJevWto3DnJByYvLxB9gudq81KvJw';

// --- LISTA CENTRALIZADA DE CATEGORIAS E ÍCONES ---
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

const ICONS = {
  all: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M4 4h3v3H4V4zm0 5h3v3H4V9zm0 5h3v3H4v-3zm5-10h3v3H9V4zm0 5h3v3H9V9zm0 5h3v3H9v-3zm5-10h3v3h-3V4zm0 5h3v3h-3V9zm0 5h3v3h-3v-3z"/></svg>',
  amizade: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM4 16a4 4 0 118-1H4z"/></svg>',
  amor_romance: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.344l1.172-1.172a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/></svg>',
  carros_motos: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 11l1-4h12l1 4H3zm1 2a1 1 0 100 2h1a1 1 0 100-2H4zm10 0a1 1 0 100 2h1a1 1 0 100-2h-1zM6 7l2-3h4l2 3H6z"/></svg>',
  cidades: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 3h5v4h4V3h5v14H3V3zm2 2v10h2V5H5zm6 4v6h2V9h-2z"/></svg>',
  compra_venda: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2H3V4zm0 4h16v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm3 2v4h2v-4H6zm6 0v4h2v-4h-2z"/></svg>',
  concursos: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1h3v14H6V4h3V3a1 1 0 011-1zM8 6v2h4V6H8zm0 4v2h4v-2H8z"/></svg>',
  desenhos_animes: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM7 8a1 1 0 110 2 1 1 0 010-2zm6 0a1 1 0 110 2 1 1 0 010-2zm-6 4a5 5 0 006 0H7z"/></svg>',
  divulgacao: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 8l10-5v14L3 12V8zm11 1h3v2h-3V9z"/></svg>',
  educacao: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l8 4-8 4-8-4 8-4zm0 6l5.5-2.75V10L10 12l-5.5-2V5.25L10 8z"/></svg>',
  emagrecimento: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 2c3 3 3 13 0 16-3-3-3-13 0-16z"/></svg>',
  esportes: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 5h3l-4 6H7l4-6z"/></svg>',
  eventos: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M6 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H8V2H6zm0 6h8v2H6V8z"/></svg>',
  fas: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 3l2 4 4 .5-3 3 1 4-4-2-4 2 1-4-3-3 4-.5 2-4z"/></svg>',
  figurinhas_stickers: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a1 1 0 00-1 1v12a1 1 0 001 1h8l5-5V4a1 1 0 00-1-1H4zm8 10h3l-3 3v-3z"/></svg>',
  filmes_series: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M4 4h12v12H4V4zm2 2v2h2V6H6zm0 4v2h2v-2H6zm6 0v2h2v-2h-2z"/></svg>',
  frases_mensagens: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a2 2 0 012-2h10a2 2 0 012 2v10l-3-2H5a2 2 0 01-2-2V4z"/></svg>',
  futebol: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm2 4l2 3-2 3H8L6 9l2-3h4z"/></svg>',
  games_jogos: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M5 7a2 2 0 00-2 2v4a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2H5zm1 3h2v1H6v-1zm6 0h2v1h-2v-1z"/></svg>',
  ganhar_dinheiro: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 4v1.5h2v2h-2v1h2v2h-2V14H9v-1.5H7v-2h2v-1H7v-2h2V6h2z"/></svg>',
  imobiliaria: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 3l7 6v8h-4v-4H7v4H3V9l7-6z"/></svg>',
  investimentos_financas: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 10h2v6H3v-6zm4-4h2v10H7V6zm4 2h2v8h-2V8zm4-4h2v12h-2V4z"/></svg>',
  links: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M7 7h6v2H7V7zm-1 3h8v2H6v-2zm-1 3h10v2H5v-2z"/></svg>',
  memes_engracados: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-3 6h2v2H7V8zm4 0h2v2h-2V8zm-4 3a3 3 0 006 0H7z"/></svg>',
  moda_beleza: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a3 3 0 013 3v4a3 3 0 11-6 0V5a3 3 0 013-3zM7 14h6v4H7v-4z"/></svg>',
  musica: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M14 3v10.56A4 4 0 1112 13V7l-4 1V3l6-1z"/></svg>',
  namoro: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M3.5 7a3.5 3.5 0 017 0 3.5 3.5 0 017 0c0 3.75-7 8-7 8s-7-4.25-7-8z"/></svg>',
  negocios_empreendedorismo: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v5H3V4zm0 7h14v5a1 1 0 01-1 1H4a1 1 0 01-1-1v-5z"/></svg>',
  noticias: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M4 3h12v14H4V3zm2 2v2h8V5H6zm0 4v2h8V9H6zm0 4v2h5v-2H6z"/></svg>',
  outros: '<svg fill="currentColor" viewBox="0 0 20 20"><circle cx="6" cy="10" r="2"/><circle cx="10" cy="10" r="2"/><circle cx="14" cy="10" r="2"/></svg>',
  politica: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l6 5v11H4V7l6-5zM6 9v7h2V9H6zm6 0v7h2V9h-2z"/></svg>',
  profissoes: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 8l7-4 7 4v2H3V8zm0 3h14v5H3v-5z"/></svg>',
  receitas: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M5 3h10v2H5V3zm0 4h10v10H5V7zm2 2v6h6V9H7z"/></svg>',
  redes_sociais: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm3 2v2h6V5H7zm0 4v2h6V9H7zm0 4v2h6v-2H7z"/></svg>',
  religiao: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M9 2h2v3h3v2h-3v11H9V7H6V5h3V2z"/></svg>',
  shitpost: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 3a4 4 0 013 7H7a4 4 0 013-7zM5 11h10v5H5v-5z"/></svg>',
  tecnologia: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M4 5h12v10H4V5zm2 2v6h8V7H6z"/></svg>'
};

// Helper para fazer requisições
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

// IndexedDB para grupos do usuário
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
