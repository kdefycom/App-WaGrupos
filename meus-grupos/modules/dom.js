
let boostPopupOverlay, boostPopup, closePopupButton;
let editModalOverlay, saveEditBtn;
let state = {};

function setupDOM(initialState) {
    state = initialState;
    setupSidebar();
    setupModal();
    setupBoostPopup();
    setupImagePreviewHidden();
    setupEventListeners();
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
    editModalOverlay = document.getElementById('editModalOverlay');
    const cancelBtn = document.getElementById('cancelEdit');
    saveEditBtn = document.getElementById('saveEdit');

    editModalOverlay.addEventListener('click', (e) => {
        if (e.target === editModalOverlay) fecharModalEdicao();
    });
    cancelBtn.addEventListener('click', fecharModalEdicao);
}

function setupBoostPopup() {
    boostPopupOverlay = document.getElementById('boost-popup-overlay');
    boostPopup = document.getElementById('boost-popup');
    closePopupButton = document.getElementById('close-popup');

    if (boostPopupOverlay && boostPopup && closePopupButton) {
        closePopupButton.addEventListener('click', closeBoostPopup);
        boostPopupOverlay.addEventListener('click', (event) => {
            if (event.target === boostPopupOverlay) closeBoostPopup();
        });
    }
}

function openBoostPopup() {
    if (boostPopupOverlay) boostPopupOverlay.style.display = 'flex';
}

function closeBoostPopup() {
    if (boostPopupOverlay) boostPopupOverlay.style.display = 'none';
}

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

function fecharModalEdicao() {
    editModalOverlay.style.display = 'none';
}

function showLoading(element) {
    element.innerHTML = '<p style="text-align:center; color: var(--text-secondary);">Carregando seus grupos...</p>';
}

function showError(element, message) {
    element.innerHTML = `<div class="empty"><h3 style="color:var(--text-primary);">Ocorreu um erro</h3><p style="color:var(--text-secondary);">${message}</p></div>`;
}

function openEditModal(grupo) {
    const tipoEntidade = grupo.tipo === 'canal_whatsapp' ? 'Canal' : 'Grupo';
    document.getElementById('editModalTitle').textContent = `Editar ${tipoEntidade}`;
    document.getElementById('editFotoLabel').textContent = `Foto do ${tipoEntidade}`;
    document.getElementById('editLinkLabel').textContent = `Link do ${tipoEntidade}`;

    document.getElementById('editGroupId').value = grupo.id;
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
    editModalOverlay.style.display = 'flex';
}

function setupEventListeners() {
    document.getElementById('gruposLista').addEventListener('click', (e) => {
        const button = e.target.closest('button[data-action]');
        if (!button) return;
        const { action, id } = button.dataset;
        state.handleAction(action, id, e);
    });

    saveEditBtn.addEventListener('click', () => {
        const id = document.getElementById('editGroupId').value;
        state.handleAction('salvar', id);
    });
}

function getEditFormDetails() {
    const id = document.getElementById('editGroupId').value;
    const link = document.getElementById('editLink').value.trim();
    const preview = document.getElementById('editFotoPreview');
    const base64 = preview.dataset.base64 || "";
    const prefix = preview.dataset.prefix || "";
    return { id, link, base64, prefix };
}

function setSaveButtonState(isSaving) {
    if(isSaving) {
        saveEditBtn.textContent = 'Salvando...';
        saveEditBtn.disabled = true;
    } else {
        saveEditBtn.textContent = 'Salvar Alterações';
        saveEditBtn.disabled = false;
    }
}

export {
    setupDOM, openBoostPopup, closeBoostPopup, showLoading, showError,
    openEditModal, fecharModalEdicao, getEditFormDetails, setSaveButtonState
};
