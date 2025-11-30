document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('deletePromptOverlay');
    const confirmInput = document.getElementById('deleteConfirmInput');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    const sidebarClearButton = document.querySelector('.sidebar .danger'); // O botão original no menu

    if (!overlay || !confirmInput || !confirmBtn || !cancelBtn || !sidebarClearButton) {
        console.error('Elementos do pop-up de exclusão não encontrados. A funcionalidade pode não estar disponível.');
        return;
    }

    // Substitui o onclick antigo pela nova função
    sidebarClearButton.setAttribute('onclick', 'showDeletePrompt()');

    // Mostra o pop-up
    window.showDeletePrompt = () => {
        confirmInput.value = ''; // Limpa o campo ao abrir
        confirmBtn.disabled = true; // Garante que o botão de confirmação comece desabilitado
        overlay.classList.add('active');
        confirmInput.focus(); // Foca no campo de input
    };

    // Esconde o pop-up
    const hideDeletePrompt = () => {
        overlay.classList.remove('active');
    };

    // Lógica do campo de texto para habilitar o botão
    confirmInput.addEventListener('input', () => {
        if (confirmInput.value.trim().toLowerCase() === 'delete') {
            confirmBtn.disabled = false;
        } else {
            confirmBtn.disabled = true;
        }
    });

    // Ações dos botões
    cancelBtn.addEventListener('click', hideDeletePrompt);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) { // Fecha se clicar fora do modal
            hideDeletePrompt();
        }
    });
    confirmBtn.addEventListener('click', () => {
        if (confirmInput.value.trim().toLowerCase() === 'delete') {
            clearAllLocalData();
            hideDeletePrompt();
        }
    });
});

async function clearAllLocalData() {
    try {
        console.log("Iniciando a exclusão de todos os dados locais...");

        // 1. Apagar o banco de dados IndexedDB
        const dbName = 'gruposDB';
        await new Promise((resolve, reject) => {
            const deleteRequest = indexedDB.deleteDatabase(dbName);
            deleteRequest.onsuccess = () => {
                console.log(`Banco de dados '${dbName}' apagado com sucesso.`);
                resolve();
            };
            deleteRequest.onerror = (event) => {
                console.error(`Erro ao apagar o banco de dados '${dbName}':`, event.target.error);
                reject(event.target.error);
            };
            deleteRequest.onblocked = () => {
                // Isso acontece se houver outras conexões abertas com o banco de dados.
                // O ideal é que a aplicação lide com isso, mas para um reset forçado, podemos alertar o usuário.
                console.warn('A exclusão do banco de dados está bloqueada. Tente fechar outras abas desta aplicação.');
                alert('Não foi possível apagar os dados pois há outra aba do site aberta. Por favor, feche todas as abas e tente novamente.');
                reject('Exclusão bloqueada');
            };
        });

        // 2. Limpar o LocalStorage (opcional, mas bom para uma limpeza completa)
        localStorage.clear();
        console.log("LocalStorage limpo.");

        // 3. Limpar o SessionStorage (opcional)
        sessionStorage.clear();
        console.log("SessionStorage limpo.");

        // 4. Informar o usuário e recarregar a página
        alert('Todos os dados locais foram apagados com sucesso. A página será recarregada.');
        location.reload();

    } catch (error) {
        console.error("Falha ao tentar limpar os dados locais:", error);
        alert('Ocorreu um erro ao tentar apagar os dados. Verifique o console para mais detalhes.');
    }
}
