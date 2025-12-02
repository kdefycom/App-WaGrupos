function getCategoryName(id) { if (typeof CATEGORIES === 'undefined' || !id) return 'Outros'; const category = CATEGORIES.find(cat => cat.id === id); return category ? category.name : id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' ');}

function renderizarGrupo(grupo) {
    let actionButtonHTML = '';
    let statusInfoHTML = '';

    const isReprovado = grupo.mensagem_admin && grupo.mensagem_admin.toLowerCase().includes('reprovado');

    if (grupo.aprovado) {
        if (grupo.requires_payment && !grupo.pago) {
            actionButtonHTML = `<button class=\"btn-large btn-pagar\" onclick=\"window.location.href = '/payment/?group_id=${grupo.id}\'">PAGAR TAXA DE LIBERAÇÃO</button>`;
            statusInfoHTML = `<div class=\"payment-notice\">Este grupo pertence a uma categoria especial. Para publicá-lo, é necessário efetuar o pagamento da taxa de moderação. <a href=\"/legal/categorias/\">Saiba mais</a>.</div>`;
        } else {
            const starIcon = `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\"/></svg>`;
            const vipButtonHTML = `<button class=\"btn-vip\" onclick=\"alertVip('${grupo.id}')\">
                                ${starIcon}
                                <span>Super VIP</span>
                               </button>`;

            let mainActionHTML;
            if (podeImpulsionar(grupo)) {
                mainActionHTML = `<button class=\"btn-impulsionar\" onclick=\"impulsionar(event, '${grupo.id}')\">🚀 IMPULSIONAR</button>`;
            } else {
                mainActionHTML = `<div class=\"boost-timer\" data-group-id=\"${grupo.id}\">⏰ Carregando...</div>`;
            }

            actionButtonHTML = `
            <div class=\"action-buttons-container\">
                ${mainActionHTML}
                ${vipButtonHTML}
            </div>
            `;
        }
    } else if (isReprovado) {
       actionButtonHTML = `<button class=\"btn-large btn-reprovado\" disabled>REPROVADO</button>`;
       const motivo = grupo.mensagem_admin.substring(grupo.mensagem_admin.indexOf(':') + 1).trim();
       if (motivo) {
         statusInfoHTML = `<div class=\"status-info-reprovado\"><strong>Motivo:</strong> ${escapeHTML(motivo)}</div>`;
       }
    } else {
      actionButtonHTML = `<button class=\"btn-large\" disabled>EM ANÁLISE</button>`;
      if (grupo.mensagem_admin && grupo.mensagem_admin.toLowerCase().includes('reanálise')) {
        statusInfoHTML = `<div class=\"status-info-analise\">${escapeHTML(grupo.mensagem_admin)}</div>`;
      }
    }

    const tipoEntidade = grupo.tipo === 'canal_whatsapp' ? 'canal' : 'grupo';
    const editIcon = `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"/><path d=\"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z\"/></svg>`;
    const trashIcon = `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"3 6 5 6 21 6\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/><line x1=\"10\" y1=\"11\" x2=\"10\" y2=\"17\"/><line x1=\"14\" y1=\"11\" x2=\"14\" y2=\"17\"/></svg>`;

    return `
      <div class=\"grupo-item\" id=\"grupo-${grupo.id}\">
        <span class=\"grupo-id\">#${grupo.id}</span>
        <div class=\"card-actions\">
           <button class=\"icon-btn edit-btn\" onclick=\"editarGrupo('${grupo.id}')\" title=\"Editar ${tipoEntidade}\">${editIcon}</button>
           <button class=\"icon-btn remove-btn\" onclick=\"removerGrupo('${grupo.id}')\" title=\"Remover ${tipoEntidade}\">${trashIcon}</button>
        </div>
        <div class=\"grupo-foto-container\">
          <img src=\"${grupo.foto_url || 'https://via.placeholder.com/1600x900/1A1A1A/FFFFFF?text=Sem+Imagem'}\" class=\"grupo-foto\">
        </div>
        <div class=\"grupo-info\">
          <div class=\"grupo-titulo\">${escapeHTML(grupo.nome)}</div>
          <div class=\"grupo-desc\">${escapeHTML(grupo.descricao || 'Sem descrição.')}</div>
          <div class=\"grupo-details\">
            <strong>CATEGORIA:</strong> ${getCategoryName(grupo.categoria)} • <strong>TIPO:</strong> ${grupo.tipo}
          </div>
          <div class=\"card-footer-action\">
            ${actionButtonHTML}
          </div>
          ${statusInfoHTML}
        </div>
      </div>
    `;
}

async function removerGrupo(id) {
    const grupo = meusGrupos.find(g => g.id === id);
    if (!grupo) {
      customAlert('Você não tem permissão para remover este grupo.', 'Erro');
      return;
    }

    const tipoEntidade = grupo.tipo === 'canal_whatsapp' ? 'canal' : 'grupo';
    const confirm = await customConfirm(`Tem certeza que deseja apagar este ${tipoEntidade}?`, 'Confirmar Exclusão');
    if (!confirm) return;

    try { 
      await removerGrupoLocal(id);
      
      await supabaseFetch(`grupos?id=eq.${id}`, { 
        method: 'PATCH',
        body: JSON.stringify({ solicitou_exclusao: true, mensagem_admin: 'Usuário solicitou a exclusão.' }) 
      }); 
      
      await customAlert('Sua solicitação de exclusão foi enviada ao administrador. O grupo já foi removido da sua lista.', 'Sucesso');
      
      carregarMeusGrupos(); 

    } catch (error) {
        console.error("Erro ao solicitar exclusão:", error);
        await customAlert('Ocorreu um erro ao enviar sua solicitação. Tente novamente.', 'Erro');
    }
}
