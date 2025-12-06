document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const groupId = params.get('id');

  const groupNameEl = document.getElementById('group-name');
  const groupImgEl = document.getElementById('group-img');
  const groupDescriptionEl = document.getElementById('group-description');
  const groupDateEl = document.getElementById('group-date');
  const groupViewsEl = document.getElementById('group-views');
  const joinButtonEl = document.getElementById('join-button');
  const groupRulesEl = document.getElementById('group-rules');
  const rulesContainer = document.getElementById('rules-container');

  if (!groupId) {
    groupNameEl.textContent = 'Grupo não encontrado';
    document.title = "Erro | KDefy";
    return;
  }

  try {
    // 1. Buscar os dados do grupo
    const groups = await supabaseFetch(`grupos?id=eq.${groupId}&select=*`);
    
    if (!groups || groups.length === 0) {
      groupNameEl.textContent = 'Grupo não encontrado ou removido.';
      document.title = "Erro | KDefy";
      return;
    }

    const group = groups[0];

    // 2. Preencher a página com os dados
    const tipo = group.tipo.includes('whatsapp') ? 'WhatsApp' : group.tipo.charAt(0).toUpperCase() + group.tipo.slice(1);
    const tipoEntidade = group.tipo === 'canal_whatsapp' ? 'Canal' : 'Grupo';

    document.title = `${tipoEntidade} ${tipo}: ${group.nome}`;
    document.querySelector('meta[name="description"]').setAttribute("content", group.descricao);

    groupNameEl.textContent = group.nome;
    groupDescriptionEl.textContent = group.descricao;
    groupImgEl.src = group.foto_url || 'https://via.placeholder.com/150';
    groupImgEl.alt = `Foto do ${tipoEntidade.toLowerCase()} ${group.nome}`;
    joinButtonEl.href = group.link;

    const creationDate = new Date(group.created_at);
    groupDateEl.textContent = `Criado em: ${creationDate.toLocaleDateString('pt-BR')}`;

    // 3. Regras do grupo
    if (group.regras && group.regras.length > 2) { // Verifica se não é "[]"
        const regras = JSON.parse(group.regras);
        if (regras.length > 0) {
            groupRulesEl.innerHTML = regras.map(regra => `<li>${regra}</li>`).join('');
        } else {
            rulesContainer.style.display = 'none';
        }
    } else {
        rulesContainer.style.display = 'none';
    }
    
    // 4. Simular visualizações
    const simulatedViews = Math.floor(Math.random() * (2500 - 300 + 1)) + 300;
    groupViewsEl.textContent = `${simulatedViews} visualizações`;


  } catch (error) {
    console.error('Erro ao buscar detalhes do grupo:', error);
    groupNameEl.textContent = 'Erro ao carregar o grupo.';
    document.title = "Erro | KDefy";
  }
});

