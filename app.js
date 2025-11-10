
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
    all: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',
    amizade: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>',
    amor_romance: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>',
    carros_motos: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>',
    cidades: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"></path></svg>',
    compra_venda: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.97 1.078h10.428a1 1 0 00.97-1.078l.305-1.222H17a1 1 0 100-2H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path><path d="M..."></path></svg>', // Truncated for brevity
    concursos: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fill-rule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z" clip-rule="evenodd"></path></svg>',
    desenhos_animes: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zM12 11a1 1 0 100-2 1 1 0 000 2zM8 9a1 1 0 112 0 1 1 0 01-2 0zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>',
    divulgacao: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',
    educacao: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>',
    emagrecimento: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.636 6.636a.5.5 0 01.707 0L10 9.293l2.657-2.657a.5.5 0 01.707.707L10.707 10l2.657 2.657a.5.5 0 01-.707.707L10 10.707l-2.657 2.657a.5.5 0 01-.707-.707L9.293 10 6.636 7.343a.5.5 0 010-.707z" clip-rule="evenodd"></path></svg>',
    esportes: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 5.168A1 1 0 008 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z"></path></svg>',
    eventos: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>',
    fas: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    figurinhas_stickers: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    filmes_series: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    frases_mensagens: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    futebol: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    games_jogos: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    ganhar_dinheiro: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    imobiliaria: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    investimentos_financas: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    links: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    memes_engracados: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    moda_beleza: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    musica: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    namoro: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    negocios_empreendedorismo: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    noticias: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    outros: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    politica: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    profissoes: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    receitas: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    redes_sociais: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    religiao: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    shitpost: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
    tecnologia: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M..."></path></svg>', // Truncated
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
