document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const groupId = params.get('id');

  if (!groupId) {
    document.getElementById('group-name').textContent = 'Grupo não encontrado';
    document.title = "Erro | KDefy";
    document.body.classList.remove('loading'); // Remove o loading em caso de erro
    return;
  }

  try {
    // Definir a query correta para os grupos aleatórios
    const randomGroupsQuery = `grupos?id=neq.${groupId}&aprovado=eq.true&or=(requires_payment.eq.false,pago.eq.true)&limit=6&order=ultimo_boost.desc.nullslast,created_at.desc`;

    // Buscar o grupo principal e grupos aleatórios em paralelo
    const [mainGroupData, randomGroupsData] = await Promise.all([
        supabaseFetch(`grupos?id=eq.${groupId}&select=*`), // Busca o grupo da página
        supabaseFetch(randomGroupsQuery) // Busca 6 outros grupos com o filtro correto
    ]);

    // --- PREENCHER DADOS DO GRUPO PRINCIPAL ---
    if (!mainGroupData || mainGroupData.length === 0) {
      document.getElementById('group-name').textContent = 'Grupo não encontrado ou removido.';
      document.title = "Erro | KDefy";
      document.body.classList.remove('loading'); // Remove o loading em caso de erro
      return;
    }

    const group = mainGroupData[0];
    populateGroupDetails(group);

    // --- PREENCHER SEÇÃO "MAIS GRUPOS" ---
    if (randomGroupsData && randomGroupsData.length > 0) {
        renderMoreGroups(randomGroupsData);
    }

    // Remove a classe de loading para mostrar o conteúdo
    document.body.classList.remove('loading');

  } catch (error) {
    console.error('Erro ao buscar detalhes do grupo:', error);
    document.getElementById('group-name').textContent = 'Erro ao carregar o grupo.';
    document.title = "Erro | KDefy";
    // Remove a classe de loading mesmo se der erro, para mostrar a mensagem
    document.body.classList.remove('loading');
  }
});

function populateGroupDetails(group) {
    const tipo = group.tipo.includes('whatsapp') ? 'WhatsApp' : group.tipo.charAt(0).toUpperCase() + group.tipo.slice(1);
    const tipoEntidade = group.tipo === 'canal_whatsapp' ? 'Canal' : 'Grupo';

    // Atualiza o título da página e a meta-descrição (bom para SEO)
    document.title = `${tipoEntidade} ${tipo}: ${group.nome}`;
    document.querySelector('meta[name="description"]').setAttribute("content", group.descricao);

    // Preenche os elementos
    document.getElementById('group-name').textContent = group.nome;
    document.getElementById('group-description').textContent = group.descricao || "Este grupo não forneceu uma descrição.";
    document.getElementById('group-img').src = group.foto_url || 'https://via.placeholder.com/300x169.png?text=Sem+Imagem';
    document.getElementById('group-img').alt = `Imagem do ${tipoEntidade.toLowerCase()} ${group.nome}`;
    document.getElementById('join-button').href = group.link;

    const creationDate = new Date(group.created_at);
    document.getElementById('group-date').textContent = `Enviado em: ${creationDate.toLocaleDateString('pt-BR')}`;

    // Simula visualizações
    const simulatedViews = Math.floor(Math.random() * (2500 - 300 + 1)) + 300;
    document.getElementById('group-views').textContent = `${simulatedViews} visualizações`;

    // Regras do grupo
    const rulesContainer = document.getElementById('rules-container');
    if (group.regras && group.regras.length > 2) { // Verifica se não é um array vazio "[]"
        try {
            const regras = JSON.parse(group.regras);
            if (regras.length > 0) {
                const groupRulesEl = document.getElementById('group-rules');
                groupRulesEl.innerHTML = regras.map(regra => `<li>${escapeHTML(regra)}</li>`).join('');
            } else {
                rulesContainer.style.display = 'none'; // Oculta a seção se não houver regras
            }
        } catch(e) {
            rulesContainer.style.display = 'none'; // Oculta se o JSON for inválido
        }
    } else {
        rulesContainer.style.display = 'none';
    }
}

function renderMoreGroups(grupos) {
    const container = document.getElementById('more-groups-container');
    container.innerHTML = grupos.map(grupo => {
        const placeholderImg = 'https://via.placeholder.com/200x200.png?text=Sem+Imagem';
        const nomeSeguro = escapeHTML(grupo.nome);

        return `
            <a href="/grupo/?id=${grupo.id}" class="grupo-card-small">
                <div class="card-image-container-small">
                    <img src="${escapeHTML(grupo.foto_url || placeholderImg)}" alt="Imagem do grupo ${nomeSeguro}" class="grupo-img-small" onerror="this.onerror=null;this.src='${placeholderImg}';">
                </div>
                <div class="card-content-small">
                    <h3 class="grupo-title-small" title="${nomeSeguro}">${nomeSeguro}</h3>
                </div>
            </a>
        `;
    }).join('');
}

function escapeHTML(str) {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
}
