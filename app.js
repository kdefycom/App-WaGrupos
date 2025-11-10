
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
  amizade: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>`,
  amor_e_romance: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
  carros_e_motos: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 11l1.5-4.5C6.9 5.6 7.9 5 9 5h6c1.1 0 2.1.6 2.5 1.5L19 11v5c0 .6-.4 1-1 1h-1a2 2 0 01-4 0H8a2 2 0 01-4 0H3c-.6 0-1-.4-1-1v-5h3zm2.5-5L6 11h12l-1.5-5h-9z"/></svg>`,
  cidades: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 8h2v-6H3v6zm4 0h2V3H7v18zm4 0h2v-4h-2v4zm4 0h2V8h-2v13zm4 0h2v-9h-2v9z"/></svg>`,
  compra_e_venda: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-2-.9-2-2V6H3V4h2.2l.8-2h12l.8 2H21v2h-2v10c0 1.1-.9 2-2 2H7zm0-2h10V6H7v10z"/></svg>`,
  concursos: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4.5L18 22l-6-4-6 4 1.5-8.5L2 9h7z"/></svg>`,
  desenhos_e_animes: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-2 7a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2zm-2 8c-2.3 0-4.3-1.5-5-3.5h10c-.7 2-2.7 3.5-5 3.5z"/></svg>`,
  divulgacao: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h2v16H4V4zm4 3h2v10H8V7zm4-3h2v16h-2V4zm4 5h2v6h-2V9z"/></svg>`,
  educacao: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-5.1V17h2V9L12 3zm0 13l-8-4.5V14l8 4.5 8-4.5v-2.5L12 16z"/></svg>`,
  emagrecimento_e_perda_de_peso: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9 9 0 00-9 9c0 4.97 9 11 9 11s9-6.03 9-11a9 9 0 00-9-9zm0 11a2 2 0 110-4 2 2 0 010 4z"/></svg>`,
  esportes: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z"/></svg>`,
  eventos: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg>`,
  fas: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4.5L18 22l-6-4-6 4 1.5-8.5L2 9h7z"/></svg>`,
  figurinhas_e_stickers: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 2h16c1.1 0 2 .9 2 2v16l-4-4H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2z"/></svg>`,
  filmes_e_series: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm3 3l7 3.5-7 3.5V9z"/></svg>`,
  frases_e_mensagens: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`,
  futebol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3 7l-3-2-3 2 1 3h4l1-3z"/></svg>`,
  games_e_jogos: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 8h12l3 8H3l3-8zm5 6h2v2h-2v-2zm-3 0h2v2H8v-2z"/></svg>`,
  ganhar_dinheiro: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm.5 17v2h-1v-2c-1.4-.1-2.5-1.1-2.5-2.5h1c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.6-.4-1.1-1-1.4L10 13c-.9-.4-1.5-1.3-1.5-2.3 0-1.4 1.1-2.4 2.5-2.5V6h1v2.2c1.4.1 2.5 1.1 2.5 2.5h-1c0-.8-.7-1.5-1.5-1.5S11 9.9 11 10.7c0 .6.4 1.1 1 1.4l1.5.6c.9.4 1.5 1.3 1.5 2.3 0 1.4-1.1 2.4-2.5 2.5z"/></svg>`,
  imobiliairia: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 9h-3v9h-4v-6H10v6H6v-9H3l9-9z"/></svg>`,
  investimentos_e_financas: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17h2v-7H3v7zm4 0h2v-4H7v4zm4 0h2V7h-2v10zm4 0h2v-2h-2v2zm4 2H3v2h18v-2z"/></svg>`,
  links: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6 13.4a5 5 0 010-7.07l1.4-1.4a5 5 0 017.07 7.07l-1.4 1.4-1.4-1.4 1.4-1.4a3 3 0 00-4.24-4.24l-1.4 1.4a3 3 0 000 4.24l-1.43 1.44zM7.05 17.66a5 5 0 010-7.07l1.4-1.4 1.4 1.4-1.4 1.4a3 3 0 004.24 4.24l1.4-1.4a3 3 0 000-4.24l1.43-1.43a5 5 0 010 7.07l-1.4 1.4a5 5 0 01-7.07 0l-1.4-1.4z"/></svg>`,
  memes: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM8 10h2v2H8v-2zm6 0h2v2h-2v-2zm-6 4h8a4 4 0 01-8 0z"/></svg>`,
  moda_e_beleza: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 2l1 5h4l1-5h2v7l-3 8v5H10v-5L7 9V2h2z"/></svg>`,
  musica: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/></svg>`,
  namoro: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
  negocios_e_empresas: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 22V10h16v12H4zm8-10h2v2h-2v-2zm-6 6h12v2H6v-2zM2 8V4h20v4H2z"/></svg>`,
  noticias: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2z"/></svg>`,
  outros: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>`,
  politica: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 9l11 7 11-7-11-7zm0 9L5.5 9 12 5l6.5 4L12 11zm-9 4h18v2H3v-2z"/></svg>`,
  profissoes: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>`,
  receitas: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10v2H7V2zm0 4h10v16H7V6zm2 2v12h6V8H9z"/></svg>`,
  redes_sociais: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 10h2v6h-2v-6zm-2-4h2v2h-2V8z"/></svg>`,
  religiao: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2h2v4h4v2h-4v4h-2V8H7V6h4V2zM5 20h14v2H5v-2z"/></svg>`,
  shitpost: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-4 8h2v2H8v-2zm6 0h2v2h-2v-2zm-5 4h6a3 3 0 01-6 0z"/></svg>`,
  tecnologia: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 2h6v2h3a2 2 0 012 2v12a2 2 0 01-2 2h-3v2H9v-2H6a2 2 0 01-2-2V6a2 2 0 012-2h3V2zm0 4H6v12h12V6h-3V4H9v2z"/></svg>`,
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
