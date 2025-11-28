
import { getCategoryName, podeImpulsionar, tempoRestante, escapeHTML } from './utils.js';

const emptyStateHTML = `
    <div class="empty">
        <p style="font-size: 60px;">📭</p>
        <h3 style="margin:10px 0; color:var(--text-primary);">Nenhum grupo enviado ainda</h3>
        <p style="color:var(--text-secondary);">Que tal enviar seu primeiro grupo agora?</p>
        <a href="/enviar-grupo/" class="btn btn-send" style="margin-top: 20px;">➕ Enviar Novo Grupo</a>
    </div>`;

function renderizarGrupo(grupo) {
    let actionButtonHTML = '';
    let statusInfoHTML = '';

    const isReprovado = grupo.mensagem_admin && grupo.mensagem_admin.toLowerCase().includes('reprovado');

    if (grupo.aprovado) {
        if (podeImpulsionar(grupo)) {
            actionButtonHTML = `<button class="btn-large btn-impulsionar" data-action="impulsionar" data-id="${grupo.id}">🚀 IMPULSIONAR</button>`;
        } else {
            actionButtonHTML = `<div class="boost-timer">⏰ PRÓXIMO BOOST EM ${tempoRestante(grupo)}</div>`;
        }
    } else if (isReprovado) {
        actionButtonHTML = `<button class="btn-large btn-reprovado" disabled>REPROVADO</button>`;
        const motivo = escapeHTML(grupo.mensagem_admin.substring(grupo.mensagem_admin.indexOf(':') + 1).trim());
        if (motivo) {
            statusInfoHTML = `<div class="status-info-reprovado"><strong>Motivo:</strong> ${motivo}</div>`;
        }
    } else {
        actionButtonHTML = `<button class="btn-large" disabled>EM ANÁLISE</button>`;
        if (grupo.mensagem_admin && grupo.mensagem_admin.toLowerCase().includes('reanálise')) {
            statusInfoHTML = `<div class="status-info-analise">${escapeHTML(grupo.mensagem_admin)}</div>`;
        }
    }

    const tipoEntidade = grupo.tipo === 'canal_whatsapp' ? 'canal' : 'grupo';
    const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
    const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;

    return `
        <div class="grupo-item" id="grupo-${grupo.id}">
            <span class="grupo-id">#${grupo.id}</span>
            <div class="card-actions">
                <button class="icon-btn edit-btn" data-action="editar" data-id="${grupo.id}" title="Editar ${tipoEntidade}">${editIcon}</button>
                <button class="icon-btn remove-btn" data-action="remover" data-id="${grupo.id}" title="Remover ${tipoEntidade}">${trashIcon}</button>
            </div>
            <div class="grupo-foto-container">
                <img src="${escapeHTML(grupo.foto_url || 'https://via.placeholder.com/1600x900/1A1A1A/FFFFFF?text=Sem+Imagem')}" class="grupo-foto">
            </div>
            <div class="grupo-info">
                <div class="grupo-titulo">${escapeHTML(grupo.nome)}</div>
                <div class="grupo-desc">${escapeHTML(grupo.descricao || 'Sem descrição.')}</div>
                <div class="grupo-details">
                    <strong>CATEGORIA:</strong> ${getCategoryName(grupo.categoria)} • <strong>TIPO:</strong> ${escapeHTML(grupo.tipo)}
                </div>
                <div class="card-footer-action">
                    ${actionButtonHTML}
                </div>
                ${statusInfoHTML}
            </div>
        </div>
    `;
}

function renderGroupList(element, groups) {
    if (groups.length === 0) {
        element.innerHTML = emptyStateHTML;
    } else {
        element.innerHTML = groups.map(renderizarGrupo).join('');
    }
}

export { renderGroupList };
