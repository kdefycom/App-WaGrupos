
    let currentCategory = null;
    let currentGroupType = 'whatsapp';
    let categoriasExpandidas = false;
    let currentPage = 1;
    let itemsPerPage = 25;
    let todosGruposCache = [];

    document.addEventListener('DOMContentLoaded', () => {
      setupSidebar();
      renderizarCategorias();
      setupFilters();
      carregarGrupos();
      setupSearch();
      document.getElementById('showMoreCategories').addEventListener('click', toggleCategorias);
    });

    function setupSidebar() {
      const toggle = document.getElementById('menuToggle');
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      toggle.addEventListener('click', () => { sidebar.classList.add('active'); overlay.classList.add('active'); });
      overlay.addEventListener('click', () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); });
    }
    
    function setupFilters() {
        const whatsappBtn = document.getElementById('whatsappFilter');
        const telegramBtn = document.getElementById('telegramFilter');
        const instagramBtn = document.getElementById('instagramFilter');
        const whatsappChannelBtn = document.getElementById('whatsappChannelFilter');

        whatsappBtn.addEventListener('click', () => filterByType('whatsapp', whatsappBtn));
        telegramBtn.addEventListener('click', () => filterByType('telegram', telegramBtn));
        instagramBtn.addEventListener('click', () => filterByType('instagram', instagramBtn));
        whatsappChannelBtn.addEventListener('click', () => filterByType('canal_whatsapp', whatsappChannelBtn));
    }

    function filterByType(type, element) {
        currentGroupType = type;
        currentPage = 1;
        document.querySelectorAll('.type-filter-btn').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
        const title = document.getElementById('sectionTitle');
        switch (type) {
            case 'whatsapp':
                title.textContent = 'Grupos de WhatsApp em Destaque';
                break;
            case 'telegram':
                title.textContent = 'Grupos de Telegram em Destaque';
                break;
            case 'instagram':
                title.textContent = 'Perfis do Instagram em Destaque';
                break;
            case 'canal_whatsapp':
                title.textContent = 'Canais do WhatsApp em Destaque';
                break;
        }
        carregarGrupos(document.getElementById('searchInput').value, currentCategory);
    }

    function setupSearch(){
      const searchButton = document.getElementById('searchButton');
      const searchInput = document.getElementById('searchInput');
      searchButton.addEventListener('click', () => { currentPage = 1; carregarGrupos(searchInput.value, currentCategory); });
      searchInput.addEventListener('keyup', e => { if(e.key === 'Enter') { currentPage = 1; carregarGrupos(searchInput.value, currentCategory); } });
    }

    function renderizarCategorias() {
      const container = document.getElementById('categoriesBar');
      const showMoreBtn = document.getElementById('showMoreCategories');
      container.innerHTML = '';

      const allCat = createCategoryElement(null, 'Todos', ICONS.all);
      allCat.classList.add('active');
      container.appendChild(allCat);

      const limit = categoriasExpandidas ? CATEGORIES.length : 8;
      
      if (CATEGORIES.length > 8) {
          showMoreBtn.style.display = 'inline-block';
          showMoreBtn.textContent = categoriasExpandidas ? 'Mostrar Menos Categorias' : 'Mostrar Mais Categorias';
      } else {
          showMoreBtn.style.display = 'none';
      }

      CATEGORIES.slice(0, limit).forEach(cat => {
          const item = createCategoryElement(cat.id, cat.name, ICONS[cat.id] || ICONS.outros);
          container.appendChild(item);
      });
    }

    function toggleCategorias() {
        categoriasExpandidas = !categoriasExpandidas;
        renderizarCategorias();
    }

    function createCategoryElement(id, name, icon) {
        const item = document.createElement('a');
        item.className = 'category-item';
        item.href = 'javascript:void(0)';
        item.innerHTML = `<div class="category-icon">${icon}</div><span>${name}</span>`;
        item.onclick = () => filterByCategory(id, item);
        return item;
    }

    function filterByCategory(categoryId, element) {
      currentCategory = categoryId;
      currentPage = 1;
      document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
      element.classList.add('active');
      carregarGrupos(document.getElementById('searchInput').value, currentCategory);
    }
    
    async function limparDados() {
      if (confirm('Tem certeza que deseja limpar os dados de grupos salvos localmente?')) {
        await limparIndexDB();
        alert('Dados limpos com sucesso!');
        location.reload();
      }
    }

    function getCategoryName(id) {
      if (typeof CATEGORIES === 'undefined') return id;
      const category = CATEGORIES.find(cat => cat.id === id);
      return category ? category.name : (id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Outros');
    }

    async function carregarGrupos(filtro = '', categoria = null) {
      const loading = document.getElementById('loading');
      const container = document.getElementById('grupos');
      loading.style.display = 'block';
      container.innerHTML = '';
      document.getElementById('pagination').style.display = 'none';

      try {
        let baseQuery = `aprovado=eq.true&tipo=eq.${currentGroupType}`;
        if (categoria) baseQuery += `&categoria=eq.${categoria}`;
        if (filtro) baseQuery += `&or=(nome.ilike.*${filtro}*,descricao.ilike.*${filtro}*)`;
        
        const [gruposVip, gruposNormais] = await Promise.all([
          supabaseFetch(`grupos?${baseQuery}&vip=eq.true&order=posicao_vip.asc.nullslast`),
          supabaseFetch(`grupos?${baseQuery}&vip=eq.false&order=created_at.desc`)
        ]);
        
        todosGruposCache = [...gruposVip, ...gruposNormais];
        loading.style.display = 'none';
        
        if (todosGruposCache.length === 0) {
          container.innerHTML = '<div class="empty">Nenhum grupo encontrado.</div>';
        } else {
          renderizarPagina();
          setupPagination();
        }
      } catch (error) {
        loading.style.display = 'none';
        container.innerHTML = '<div class="empty">Ocorreu um erro ao buscar os grupos.</div>';
      }
    }

    function renderizarPagina() {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const gruposPagina = todosGruposCache.slice(startIndex, endIndex);
      renderizarGrupos(gruposPagina);
      atualizarPaginacao();
    }

    function setupPagination() {
      const totalPages = Math.ceil(todosGruposCache.length / itemsPerPage);
      const paginationContainer = document.getElementById('pagination');
      
      if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
      }

      paginationContainer.style.display = 'flex';
      paginationContainer.innerHTML = `
        <button id="prevPage">Anterior</button>
        <span class="page-info">Página <span id="currentPageNum">${currentPage}</span> de <span id="totalPages">${totalPages}</span></span>
        <button id="nextPage">Próxima</button>
      `;

      document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderizarPagina();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });

      document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderizarPagina();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    function atualizarPaginacao() {
      const totalPages = Math.ceil(todosGruposCache.length / itemsPerPage);
      const currentPageNum = document.getElementById('currentPageNum');
      const totalPagesSpan = document.getElementById('totalPages');
      const prevBtn = document.getElementById('prevPage');
      const nextBtn = document.getElementById('nextPage');

      if (currentPageNum) currentPageNum.textContent = currentPage;
      if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
      if (prevBtn) prevBtn.disabled = currentPage === 1;
      if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    }

    function renderizarGrupos(grupos) {
      const container = document.getElementById('grupos');
      container.innerHTML = grupos.map(grupo => {
        const placeholderImg = 'https://via.placeholder.com/300x320.png?text=Sem+Imagem';
        const buttonText = grupo.tipo === 'canal_whatsapp' ? 'Ver Canal' : 'Entrar no Grupo';
        return `
          <div class="grupo-card ${grupo.vip ? 'vip' : ''}">
            <div class="card-image-container">
              <img src="${grupo.foto_url || placeholderImg}" alt="Imagem do grupo ${grupo.nome}" class="grupo-img" onerror="this.onerror=null;this.src='${placeholderImg}';">
              ${grupo.vip ? '<div class="vip-star">⭐</div>' : ''}
            </div>
            <div class="card-content">
              <span class="card-category">${getCategoryName(grupo.categoria)}</span>
              <h3 class="grupo-title" title="${grupo.nome}">${grupo.nome}</h3>
              <p class="grupo-desc">${grupo.descricao || 'Este grupo não possui uma descrição.'}</p>
              <a href="${grupo.link}" target="_blank" class="card-button">${buttonText}</a>
            </div>
          </div>
        `;
      }).join('');
    }
