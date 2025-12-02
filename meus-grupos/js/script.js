let meusGrupos = [];
let boostPopupOverlay, boostPopup, closePopupButton;
let activeTimers = {};

document.addEventListener('DOMContentLoaded', () => {
    setupSidebar();
    setupModal();
    setupBoostPopup(); 
    carregarMeusGrupos();
    setupImagePreviewHidden();
});

function clearActiveTimers() {
    for (const groupId in activeTimers) {
      clearInterval(activeTimers[groupId]);
    }
    activeTimers = {};
}

async function carregarMeusGrupos() {
    clearActiveTimers();
    const lista = document.getElementById('gruposLista');
    lista.innerHTML = '<p style="text-align:center; color: var(--text-secondary);">Carregando seus grupos...</p>';
    try {
      const gruposLocais = await buscarGruposLocais();
      
      const emptyStateHTML = `<div class=\"empty\">
            <p style=\"font-size: 60px;\">📭</p>
            <h3 style=\"margin:10px 0; color:var(--text-primary);\">Nenhum grupo enviado ainda</h3>
            <p style=\"color:var(--text-secondary);\">Que tal enviar seu primeiro grupo agora?</p>
            <a href=\"/enviar-grupo/\" class=\"btn btn-send\" style=\"margin-top: 20px;\">➕ Enviar Novo Grupo</a>
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

      // Iniciar contadores para os grupos em cooldown
      meusGrupos.forEach(grupo => {
        if (grupo.aprovado && !podeImpulsionar(grupo)) {
          startCountdown(grupo);
        }
      });

    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
      lista.innerHTML = '<div class=\"empty\"><h3 style=\"color:var(--text-primary);\">Ocorreu um erro</h3><p style=\"color:var(--text-secondary);\">Não foi possível carregar. Tente recarregar a página.</p></div>';
    }
}
