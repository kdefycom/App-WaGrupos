
import { setupDOM, openBoostPopup, showLoading, showError, openEditModal, fecharModalEdicao, getEditFormDetails, setSaveButtonState } from './modules/dom.js';
import { renderGroupList } from './modules/render.js';
import { fetchAndSyncGroups, boostGroup, requestGroupDeletion, updateGroup } from './modules/api.js';

let meusGrupos = [];
const gruposListaEl = document.getElementById('gruposLista');

document.addEventListener('DOMContentLoaded', () => {
    setupDOM({ handleAction });
    carregarMeusGrupos();
});

async function carregarMeusGrupos() {
    showLoading(gruposListaEl);
    try {
        meusGrupos = await fetchAndSyncGroups();
        renderGroupList(gruposListaEl, meusGrupos);
    } catch (error) {
        console.error("Erro ao carregar grupos:", error);
        showError(gruposListaEl, "Não foi possível carregar. Tente recarregar a página.");
    }
}

async function handleAction(action, id, event) {
    const grupo = meusGrupos.find(g => g.id === id);
    if (!grupo && action !== 'salvar') return;

    switch (action) {
        case 'impulsionar':
            await handleBoost(id, event.target);
            break;
        case 'remover':
            await handleRemove(id, grupo);
            break;
        case 'editar':
            openEditModal(grupo);
            break;
        case 'salvar':
            await handleSave();
            break;
    }
}

async function handleBoost(id, button) {
    button.disabled = true;
    button.textContent = 'IMPULSIONANDO...';
    try {
        await boostGroup(id);
        openBoostPopup();
        await carregarMeusGrupos(); 
    } catch {
        button.disabled = false;
        button.textContent = '🚀 IMPULSIONAR';
    }
}

async function handleRemove(id, grupo) {
    const tipoEntidade = grupo.tipo === 'canal_whatsapp' ? 'canal' : 'grupo';
    const confirm = await customConfirm(`Tem certeza que deseja apagar este ${tipoEntidade}?`, 'Confirmar Exclusão');
    if (!confirm) return;

    try {
        await requestGroupDeletion(id);
        await customAlert('Sua solicitação de exclusão foi enviada ao administrador. O grupo já foi removido da sua lista.', 'Sucesso');
        await carregarMeusGrupos();
    } catch (error) {
        console.error("Erro ao solicitar exclusão:", error);
        await customAlert('Ocorreu um erro ao enviar sua solicitação. Tente novamente.', 'Erro');
    }
}

async function handleSave() {
    const { id, link, base64, prefix } = getEditFormDetails();
    const grupo = meusGrupos.find(g => g.id === id);
    if (!grupo) return;

    let foto_final = grupo.foto_url;
    const mudouFoto = base64 !== "" && (prefix + base64) !== grupo.foto_url;
    const mudouLink = link !== grupo.link;

    if (!mudouFoto && !mudouLink) {
        await customAlert("Nenhuma alteração foi feita.", "Aviso");
        return;
    }

    if (mudouFoto) foto_final = prefix + base64;
    
    setSaveButtonState(true);

    try {
        await updateGroup(id, {
            foto_url: foto_final,
            link: link,
            aprovado: false,
            mensagem_admin: 'Grupo em reanálise após edição.'
        });
        fecharModalEdicao();
        await customAlert("Alterações enviadas para análise. Aguarde a aprovação.", "Sucesso");
        setTimeout(carregarMeusGrupos, 500);
    } finally {
        setSaveButtonState(false);
    }
}
