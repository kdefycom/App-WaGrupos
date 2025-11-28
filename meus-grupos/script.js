
  let meusGrupos = [];
  let boostPopupOverlay, boostPopup, closePopupButton;

  document.addEventListener('DOMContentLoaded', () => {
    setupSidebar();
    setupModal();
    setupBoostPopup(); 
    carregarMeusGrupos();
    setupImagePreviewHidden();
  });

  function setupImagePreviewHidden() {
    const fileInput = document.getElementById("editFotoFile");
    const preview = document.getElementById("editFotoPreview");

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const prefix = base64.substring(0, base64.indexOf(",") + 1);
        const semPrefixo = base64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

        preview.src = base64;
        preview.dataset.prefix = prefix;
        preview.dataset.base64 = semPrefixo;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
  }

  function setupSidebar() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('closeSidebar');
    if (!toggle || !sidebar || !overlay || !closeBtn) return;
    const openMenu = () => { sidebar.classList.add('active'); overlay.classList.add('active'); };
    const closeMenu = () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); };
    toggle.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
  }

  function setupModal() {
    const overlay = document.getElementById('editModalOverlay');
    const cancelBtn = document.getElementById('cancelEdit');
    const saveBtn = document.getElementById('saveEdit');

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) fecharModalEdicao();
    });
    cancelBtn.addEventListener('click', fecharModalEdicao);
    saveBtn.addEventListener('click', salvarEdicao);
  }

  function setupBoostPopup() {
    boostPopupOverlay = document.getElementById('boost-popup-overlay');
    boostPopup = document.getElementById('boost-popup');
    closePopupButton = document.getElementById('close-popup');

    if (boostPopupOverlay && boostPopup && closePopupButton) {
        closePopupButton.addEventListener('click', closeBoostPopup);
        boostPopupOverlay.addEventListener('click', (event) => {
            if (event.target === boostPopupOverlay) {
                closeBoostPopup();
            }
        });
    }
  }

  function openBoostPopup() {
    if (boostPopupOverlay) {
        boostPopupOverlay.style.display = 'flex';
    }
  }

  function closeBoostPopup() {
    if (boostPopupOverlay) {
        boostPopupOverlay.style.display = 'none';
    }
  }

  async function carregarMeusGrupos() {
    const lista = document.getElementById('gruposLista');
    lista.innerHTML = '<p style="text-align:center; color: var(--text-secondary);">Carregando seus grupos...</p>';
    try {
      const gruposLocais = await buscarGruposLocais();
      
      const emptyStateHTML = `<div class="empty">
            <p style="font-size: 60px;">📭</p>
            <h3 style="margin:10px 0; color:var(--text-primary);">Nenhum grupo enviado ainda</h3>
            <p style="color:var(--text-secondary);">Que tal enviar seu primeiro grupo agora?</p>
            <a href="/enviar-grupo/" class="btn btn-send" style="margin-top: 20px;">➕ Enviar Novo Grupo</a>
          </div>`;

      if (gruposLocais.length === 0) {
        lista.innerHTML = emptyStateHTML;
        return;
      }
      
      const ids = gruposLocais.map(g => g.id);
      const gruposAPI = await supabaseFetch(`grupos?id=in.(${ids.join(',')})`);
      
      const idsAPI = new Set(gruposAPI.map(g => g.id));
      const gruposSincronizados = [];
      for (const grupoLocal of gruposLocais) {
        if (idsAPI.has(grupoLocal.id)) {
          const apiData = gruposAPI.find(g => g.id === grupoLocal.id);
          // Prioriza os dados da API sobre os locais para ter o status mais recente
          gruposSincronizados.push({ ...grupoLocal, ...apiData });
        } else {
          await removerGrupoLocal(grupoLocal.id);
        }
      }

      meusGrupos = gruposSincronizados;

      if (meusGrupos.length === 0) {
        lista.innerHTML = emptyStateHTML;
        return;
      }

      lista.innerHTML = meusGrupos
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map(renderizarGrupo)
        .join('');

    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
      lista.innerHTML = '<div class="empty"><h3 style="color:var(--text-primary);">Ocorreu um erro</h3><p style="color:var(--text-secondary);">Não foi possível carregar. Tente recarregar a página.</p></div>';
    }
  }

  function renderizarGrupo(grupo) {
    let actionButtonHTML = '';
    let statusInfoHTML = '';

    const isReprovado = grupo.mensagem_admin && grupo.mensagem_admin.toLowerCase().includes('reprovado');

    if (grupo.aprovado) {
      if (podeImpulsionar(grupo)) {
        actionButtonHTML = `<button class="btn-large btn-impulsionar" onclick="impulsionar(event, '${grupo.id}')">🚀 IMPULSIONAR</button>`;
      } else {
        actionButtonHTML = `<div class="boost-timer">⏰ PRÓXIMO BOOST EM ${tempoRestante(grupo)}</div>`;
      }
    } else if (isReprovado) {
       actionButtonHTML = `<button class="btn-large btn-reprovado" disabled>REPROVADO</button>`;
       const motivo = grupo.mensagem_admin.substring(grupo.mensagem_admin.indexOf(':') + 1).trim();
       if (motivo) {
         statusInfoHTML = `<div class="status-info-reprovado"><strong>Motivo:</strong> ${motivo}</div>`;
       }
    } else {
      actionButtonHTML = `<button class="btn-large" disabled>EM ANÁLISE</button>`;
      if (grupo.mensagem_admin && grupo.mensagem_admin.toLowerCase().includes('reanálise')) {
        statusInfoHTML = `<div class="status-info-analise">${grupo.mensagem_admin}</div>`;
      }
    }

    const tipoEntidade = grupo.tipo === 'canal_whatsapp' ? 'canal' : 'grupo';
    const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
    const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;

    return `
      <div class="grupo-item" id="grupo-${grupo.id}">
        <span class="grupo-id">#${grupo.id}</span>
        <div class="card-actions">
           <button class="icon-btn edit-btn" onclick="editarGrupo('${grupo.id}')" title="Editar ${tipoEntidade}">${editIcon}</button>
           <button class="icon-btn remove-btn" onclick="removerGrupo('${grupo.id}')" title="Remover ${tipoEntidade}">${trashIcon}</button>
        </div>
        <div class="grupo-foto-container">
          <img src="${grupo.foto_url || 'https://via.placeholder.com/1600x900/1A1A1A/FFFFFF?text=Sem+Imagem'}" class="grupo-foto">
        </div>
        <div class="grupo-info">
          <div class="grupo-titulo">${grupo.nome}</div>
          <div class="grupo-desc">${grupo.descricao || 'Sem descrição.'}</div>
          <div class="grupo-details">
            <strong>CATEGORIA:</strong> ${getCategoryName(grupo.categoria)} • <strong>TIPO:</strong> ${grupo.tipo}
          </div>
          <div class="card-footer-action">
            ${actionButtonHTML}
          </div>
          ${statusInfoHTML}
        </div>
      </div>
    `;
  }

  function editarGrupo(id) {
    const grupo = meusGrupos.find(g => g.id === id);
    if (!grupo) return;

    const tipoEntidade = grupo.tipo === 'canal_whatsapp' ? 'Canal' : 'Grupo';

    document.getElementById('editModalTitle').textContent = `Editar ${tipoEntidade}`;
    document.getElementById('editFotoLabel').textContent = `Foto do ${tipoEntidade}`;
    document.getElementById('editLinkLabel').textContent = `Link do ${tipoEntidade}`;

    document.getElementById('editGroupId').value = id;
    document.getElementById('editLink').value = grupo.link || '';

    const preview = document.getElementById('editFotoPreview');

    if (grupo.foto_url) {
      preview.src = grupo.foto_url;

      if (grupo.foto_url.startsWith("data:image")) {
        const prefix = grupo.foto_url.substring(0, grupo.foto_url.indexOf(",") + 1);
        const semPrefixo = grupo.foto_url.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
        preview.dataset.prefix = prefix;
        preview.dataset.base64 = semPrefixo;
      } else {
        preview.dataset.prefix = "";
        preview.dataset.base64 = "";
      }

      preview.style.display = "block";
    } else {
      preview.style.display = "none";
      preview.dataset.prefix = "";
      preview.dataset.base64 = "";
    }

    document.getElementById('editModalOverlay').style.display = 'flex';
  }

  function fecharModalEdicao() {
    document.getElementById('editModalOverlay').style.display = 'none';
  }

  async function salvarEdicao() {
    const id = document.getElementById('editGroupId').value;
    const grupo = meusGrupos.find(g => g.id === id);
    if (!grupo) return;

    const link = document.getElementById('editLink').value.trim();
    const preview = document.getElementById('editFotoPreview');

    const base64 = preview.dataset.base64 || "";
    const prefix = preview.dataset.prefix || "";

    let foto_final = grupo.foto_url;

    const mudouFoto = base64 !== "" && (prefix + base64) !== grupo.foto_url;
    const mudouLink = link !== grupo.link;

    if (!mudouFoto && !mudouLink) {
      await customAlert("Nenhuma alteração foi feita.", "Aviso");
      return;
    }

    if (mudouFoto) foto_final = prefix + base64;

    const saveBtn = document.getElementById('saveEdit');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Salvando...';
    saveBtn.disabled = true;

    try {
      const [updatedGroup] = await supabaseFetch(`grupos?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          foto_url: foto_final,
          link: link,
          aprovado: false,
          mensagem_admin: 'Grupo em reanálise após edição.'
        })
      });

      // Atualiza o grupo localmente também
      await salvarGrupoLocal(updatedGroup);

      fecharModalEdicao();
      await customAlert("Alterações enviadas para análise. Aguarde a aprovação.", "Sucesso");
      setTimeout(() => carregarMeusGrupos(), 500);

    } finally {
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
    }
  }

  function getCategoryName(id) { if (typeof CATEGORIES === 'undefined' || !id) return 'Outros'; const category = CATEGORIES.find(cat => cat.id === id); return category ? category.name : id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' ');}
  function podeImpulsionar(grupo) { if (!grupo.ultimo_boost) return true; const duasHoras = 2 * 60 * 60 * 1000; return Date.now() - new Date(grupo.ultimo_boost).getTime() > duasHoras; }
  function tempoRestante(grupo) { if (!grupo.ultimo_boost) return '0min'; const duasHoras = 2 * 60 * 60 * 1000; const passado = Date.now() - new Date(grupo.ultimo_boost).getTime(); const restante = duasHoras - passado; const minutos = Math.ceil(restante / 60000); return `${minutos}min`; }
  async function impulsionar(event, id) { const button = event.target; button.disabled = true; button.textContent = 'IMPULSIONANDO...'; try { await supabaseFetch(`grupos?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ ultimo_boost: new Date().toISOString() }) }); openBoostPopup(); carregarMeusGrupos(); } catch { button.disabled = false; button.textContent = '🚀 IMPULSIONAR'; } }
  async function removerGrupo(id) {
    const grupo = meusGrupos.find(g => g.id === id);
    if (!grupo) return;

    const tipoEntidade = grupo.tipo === 'canal_whatsapp' ? 'canal' : 'grupo';
    const confirm = await customConfirm(`Tem certeza que deseja apagar este ${tipoEntidade}?`, 'Confirmar Exclusão');
    if (!confirm) return;

    try { 
      await removerGrupoLocal(id); 
      // Não é necessário deletar da API aqui se o admin já o fez, mas mantemos para o usuário poder deletar.
      await supabaseFetch(`grupos?id=eq.${id}`, { method: 'DELETE' }); 
      carregarMeusGrupos(); 
    } catch {}
  }
