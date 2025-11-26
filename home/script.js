let currentFetchController = null;

const STATE = {
    currentCategory: null,
    currentGroupType: 'whatsapp',
    categoriasExpandidas: false,
    currentPage: 1,
    itemsPerPage: 25,
    searchFilter: '',
    totalItems: 0,
};

document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    setupEventListeners();
});

function initializePage() {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page'), 10);
    const type = params.get('type');
    const category = params.get('category');
    const search = params.get('q');

    STATE.currentPage = page > 0 ? page : 1;
    if (type && ['whatsapp', 'telegram', 'instagram', 'canal_whatsapp'].includes(type)) {
        STATE.currentGroupType = type;
    }
    if (category) {
        STATE.currentCategory = category;
    }
    if (search) {
        document.getElementById('searchInput').value = search;
        STATE.searchFilter = search;
    }
    
    renderCategories();
    loadGroups();
    updateActiveFilters();
}

function setupEventListeners() {
    document.getElementById('whatsappFilter').addEventListener('click', () => setFilter('currentGroupType', 'whatsapp'));
    document.getElementById('telegramFilter').addEventListener('click', () => setFilter('currentGroupType', 'telegram'));
    document.getElementById('instagramFilter').addEventListener('click', () => setFilter('currentGroupType', 'instagram'));
    document.getElementById('whatsappChannelFilter').addEventListener('click', () => setFilter('currentGroupType', 'canal_whatsapp'));

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', () => setSearch(searchInput.value));
    searchInput.addEventListener('keyup', e => {
        if (e.key === 'Enter') setSearch(searchInput.value);
    });
    
    document.getElementById('showMoreCategories').addEventListener('click', () => {
        STATE.categoriasExpandidas = !STATE.categoriasExpandidas;
        renderCategories();
    });
    
    setupSidebar();
}

function setFilter(key, value) {
    STATE.currentPage = 1;
    if (key === 'currentCategory' && STATE[key] === value) {
        STATE[key] = null;
    } else {
        STATE[key] = value;
    }
    updateUrlAndReload();
}

function setSearch(query) {
    STATE.currentPage = 1;
    STATE.searchFilter = query;
    updateUrlAndReload();
}

function changePage(newPage) {
    const totalPages = Math.ceil(STATE.totalItems / STATE.itemsPerPage);
    if (newPage > 0 && newPage <= totalPages) {
        STATE.currentPage = newPage;
        updateUrlAndReload(false); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

async function loadGroups() {
    if (currentFetchController) {
        currentFetchController.abort();
    }
    currentFetchController = new AbortController();
    const signal = currentFetchController.signal;

    showLoading(true);

    try {
        const { data, count } = await fetchData(signal);

        if (signal.aborted) {
            console.log("Fetch aborted, skipping UI update.");
            return;
        }

        STATE.totalItems = count || 0;

        if (data && data.length > 0) {
            renderGroups(data);
        } else {
            showEmptyMessage();
        }
        updatePagination();
        updateSectionTitle();

    } catch (error) {
        if (error.name !== 'AbortError') {
            showErrorMessage();
        }
    } finally {
        if (!signal.aborted) {
            showLoading(false);
        }
    }
}

async function fetchData(signal) {
    const startIndex = (STATE.currentPage - 1) * STATE.itemsPerPage;
    
    let query = `aprovado=eq.true&tipo=eq.${STATE.currentGroupType}`;
    if (STATE.currentCategory) {
        query += `&categoria=eq.${STATE.currentCategory}`;
    }
    if (STATE.searchFilter) {
        query += `&or=(nome.ilike.*${encodeURIComponent(STATE.searchFilter)}*,descricao.ilike.*${encodeURIComponent(STATE.searchFilter)}*)`;
    }

    const finalQuery = `grupos?${query}&order=vip.desc,created_at.desc&limit=${STATE.itemsPerPage}&offset=${startIndex}`;

    try {
        const [data, countResponse] = await Promise.all([
            supabaseFetch(finalQuery, { signal }),
            supabaseFetch(`grupos?${query}&select=count`, { count: 'exact', signal })
        ]);
        return { data, count: countResponse.count };
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Fetch aborted');
        } else {
            console.error('Erro ao buscar grupos:', error);
        }
        throw error;
    }
}

function updateUrlAndReload(reloadViews = true) {
    const params = new URLSearchParams();
    if (STATE.currentPage > 1) params.set('page', STATE.currentPage);
    if (STATE.currentGroupType !== 'whatsapp') params.set('type', STATE.currentGroupType);
    if (STATE.currentCategory) params.set('category', STATE.currentCategory);
    if (STATE.searchFilter) params.set('q', STATE.searchFilter);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.pushState({}, '', newUrl);

    if(reloadViews){
        loadGroups();
        updateActiveFilters();
    }
}