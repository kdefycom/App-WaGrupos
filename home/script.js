
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
    
    renderCategories(); // Renderiza as categorias primeiro
    loadGroups(); // Carrega os grupos
    updateActiveFilters(); // Atualiza os filtros ativos na UI
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
        STATE[key] = null; // Desmarca a categoria
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
    showLoading(true);
    const { data, count } = await fetchData();
    showLoading(false);

    STATE.totalItems = count;

    if (data && data.length > 0) {
        renderGroups(data);
    } else {
        showEmptyMessage();
    }
    updatePagination();
    updateSectionTitle();
}

async function fetchData() {
    const startIndex = (STATE.currentPage - 1) * STATE.itemsPerPage;
    
    let query = `aprovado=eq.true&tipo=eq.${STATE.currentGroupType}`;
    if (STATE.currentCategory) {
        query += `&categoria=eq.${STATE.currentCategory}`;
    }
    if (STATE.searchFilter) {
        query += `&or=(nome.ilike.*${encodeURIComponent(STATE.searchFilter)}*,descricao.ilike.*${encodeURIComponent(STATE.searchFilter)}*)`;
    }

    // Combina as buscas de VIP e não-VIP em uma só com ordenação
    const finalQuery = `grupos?${query}&order=vip.desc,created_at.desc&limit=${STATE.itemsPerPage}&offset=${startIndex}`;

    try {
        // Faz a busca dos dados e a contagem total em paralelo
        const [data, countResponse] = await Promise.all([
            supabaseFetch(finalQuery),
            supabaseFetch(`grupos?${query}&select=count`, { count: 'exact' })
        ]);
        return { data: data, count: countResponse.count };
    } catch (error) {
        console.error('Erro ao buscar grupos:', error);
        showErrorMessage();
        return { data: [], count: 0 };
    }
}

function updateUrlAndReload(reloadViews = true) {
    const params = new URLSearchParams();
    if (STATE.currentPage > 1) params.set('page', STATE.currentPage);
    if (STATE.currentGroupType !== 'whatsapp') params.set('type', STATE.currentGroupType);
    if (STATE.currentCategory) params.set('category', STATE.currentCategory);
    if (STATE.searchFilter) params.set('q', STATE.searchFilter);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    // Usa replaceState para não poluir o histórico do navegador com cada filtro
    history.pushState({}, '', newUrl);

    if(reloadViews){
        loadGroups();
        updateActiveFilters();
    }
}
