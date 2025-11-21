
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

export async function salvarGrupoLocal(grupo) {
  await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['grupos'], 'readwrite');
    const store = transaction.objectStore('grupos');
    const request = store.put(grupo);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function buscarGruposLocais() {
  await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['grupos'], 'readonly');
    const store = transaction.objectStore('grupos');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function removerGrupoLocal(id) {
  await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['grupos'], 'readwrite');
    const store = transaction.objectStore('grupos');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function limparIndexDB() {
  await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['grupos'], 'readwrite');
    const store = transaction.objectStore('grupos');
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
