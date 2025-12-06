function escapeHTML(str) {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
}

function renderGroups(grupos) {
    const container = document.getElementById('grupos');
    container.innerHTML = grupos.map(grupo => {
        const placeholderImg = 'https://via.placeholder.com/300x320.png?text=Sem+Imagem';
        const buttonText = grupo.tipo === 'canal_whatsapp' ? 'Ver Canal' : 'Entrar no Grupo';
        
        const nomeSeguro = escapeHTML(grupo.nome);
        const descricaoSegura = escapeHTML(grupo.descricao || 'Este grupo não possui uma descrição.');

        return `
          <div class="grupo-card ${grupo.vip ? 'vip' : ''}">
            <div class="card-image-container">
              <img src="${escapeHTML(grupo.foto_url || placeholderImg)}" alt="Imagem do grupo ${nomeSeguro}" class="grupo-img" onerror="this.onerror=null;this.src='${placeholderImg}';">
              ${grupo.vip ? '<div class="vip-star">⭐</div>' : ''}
            </div>
            <div class="card-content">
              <span class="card-category">${getCategoryName(grupo.categoria)}</span>
              <h3 class="grupo-title" title="${nomeSeguro}">${nomeSeguro}</h3>
              <p class="grupo-desc">${descricaoSegura}</p>
              <a href="/grupo/?id=${grupo.id}" class="card-button">${buttonText}</a>
            </div>
          </div>
        `;
    }).join('');
}

function updatePagination() {
    const totalPages = Math.ceil(STATE.totalItems / STATE.itemsPerPage);
    const paginationContainer = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }

    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = `
        <button id="prevPage" ${STATE.currentPage === 1 ? 'disabled' : ''}>Anterior</button>
        <span class="page-info">Página ${STATE.currentPage} de ${totalPages}</span>
        <button id="nextPage" ${STATE.currentPage === totalPages ? 'disabled' : ''}>Próxima</button>
    `;

    document.getElementById('prevPage').addEventListener('click', () => changePage(STATE.currentPage - 1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(STATE.currentPage + 1));
}

function renderCategories() {
    const container = document.getElementById('categoriesBar');
    const showMoreBtn = document.getElementById('showMoreCategories');
    container.innerHTML = '';

    const allCat = createCategoryElement(null, 'Todos', ICONS.all);
    container.appendChild(allCat);

    const limit = STATE.categoriasExpandidas ? CATEGORIES.length : 5;
    
    if (CATEGORIES.length > 5) {
        showMoreBtn.style.display = 'inline-block';
        showMoreBtn.textContent = STATE.categoriasExpandidas ? 'Mostrar Menos' : 'Mostrar Mais';
    } else {
        showMoreBtn.style.display = 'none';
    }

    CATEGORIES.slice(0, limit).forEach(cat => {
        const item = createCategoryElement(cat.id, cat.name, ICONS[cat.id] || ICONS.outros);
        container.appendChild(item);
    });
    updateActiveFilters();
}

function createCategoryElement(id, name, icon) {
    const item = document.createElement('a');
    item.className = 'category-item';
    item.href = 'javascript:void(0)';
    item.innerHTML = `<div class="category-icon">${icon}</div><span>${escapeHTML(name)}</span>`;
    item.onclick = () => setFilter('currentCategory', id);
    return item;
}

function updateActiveFilters() {
    const typeMap = {
        todos: 'allFilter',
        whatsapp: 'whatsappFilter',
        telegram: 'telegramFilter',
        instagram: 'instagramFilter',
        canal_whatsapp: 'whatsappChannelFilter'
    };

    document.querySelectorAll('.type-filter-btn').forEach(el => {
        el.classList.remove('active');
    });

    const activeFilterId = typeMap[STATE.currentGroupType];
    if (activeFilterId) {
        const activeButton = document.getElementById(activeFilterId);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    document.querySelectorAll('.category-item').forEach(el => {
        el.classList.remove('active');
    });

    const categoryItems = Array.from(document.querySelectorAll('.category-item'));
    const activeCategoryIndex = CATEGORIES.slice(0, STATE.categoriasExpandidas ? CATEGORIES.length : 5).findIndex(c => c.id === STATE.currentCategory);

    let elementToActivate;
    if (STATE.currentCategory === null) {
        elementToActivate = categoryItems[0]; // "Todos"
    } else if (activeCategoryIndex !== -1) {
        elementToActivate = categoryItems[activeCategoryIndex + 1];
    }

    if (elementToActivate) {
        elementToActivate.classList.add('active');
    } else if (categoryItems.length > 0) {
        // Fallback to "Todos" if the active category is not in the visible list
        categoryItems[0].classList.add('active');
    }
}

function getCategoryName(id) {
    const category = CATEGORIES.find(cat => cat.id === id);
    return category ? category.name : 'Outros';
}

function updateSectionTitle() {
    const titles = {
        todos: 'Grupos em Destaque',
        whatsapp: 'Grupos de WhatsApp em Destaque',
        telegram: 'Grupos de Telegram em Destaque',
        instagram: 'Grupos de Instagram em Destaque',
        canal_whatsapp: 'Canais do WhatsApp em Destaque'
    };
    const title = document.getElementById('sectionTitle');
    title.textContent = titles[STATE.currentGroupType] || 'Grupos em Destaque';
    title.style.opacity = 1;
}

function showLoading(isLoading) {
    document.getElementById('loading').style.display = isLoading ? 'block' : 'none';
    if(isLoading) {
        document.getElementById('grupos').innerHTML = '';
        document.getElementById('pagination').style.display = 'none';
    }
}

function showEmptyMessage() {
    const container = document.getElementById('grupos');
    if (STATE.searchFilter) {
        const searchTerm = document.createElement('span');
        searchTerm.style.color = '#2C2C2C';
        searchTerm.textContent = `"${escapeHTML(STATE.searchFilter)}"`;

        container.innerHTML = `<div class="empty">Nenhum resultado para a busca por: </div>`;
        container.firstChild.appendChild(searchTerm);
    } else {
        container.innerHTML = '<div class="empty">Nenhum grupo encontrado com os filtros selecionados.</div>';
    }
}

function showErrorMessage() {
    document.getElementById('grupos').innerHTML = '<div class="empty">Ocorreu um erro ao buscar os grupos. Tente novamente mais tarde.</div>';
}

function setupSidebar() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    toggle.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
}
