document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('deletePromptOverlay');
    const confirmInput = document.getElementById('deleteConfirmInput');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    const sidebarClearButton = document.querySelector('.sidebar .danger');

    if (!overlay || !confirmInput || !confirmBtn || !cancelBtn || !sidebarClearButton) {
        console.error('Elementos do pop-up de exclusão não encontrados.');
        return;
    }

    sidebarClearButton.setAttribute('onclick', 'showDeletePrompt()');

    window.showDeletePrompt = () => {
        confirmInput.value = '';
        confirmBtn.disabled = true;
        overlay.classList.add('active');
        confirmInput.focus();
    };

    const hideDeletePrompt = () => {
        overlay.classList.remove('active');
    };

    confirmInput.addEventListener('input', () => {
        confirmBtn.disabled = confirmInput.value.trim().toLowerCase() !== 'delete';
    });

    cancelBtn.addEventListener('click', hideDeletePrompt);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
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

function clearAllCookies() {
    console.log("Iniciando a limpeza de cookies...");
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie = name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    console.log("Limpeza de cookies concluída.");
}

async function clearAllLocalData() {
    try {
        console.log("Iniciando a exclusão de todos os dados locais...");

        // 1. Fechar a conexão ativa com o banco de dados
        if (window.closeDatabase) {
            window.closeDatabase();
        } else {
            console.warn('Função window.closeDatabase() não encontrada.');
        }

        // 2. Apagar o banco de dados IndexedDB
        const dbName = 'kdefy_grupos'; // Nome correto do banco de dados
        await new Promise((resolve, reject) => {
            // Delay para garantir que a conexão foi fechada antes de apagar
            setTimeout(() => {
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
                    console.warn('A exclusão do banco de dados está bloqueada. Feche outras abas.');
                    alert('Não foi possível apagar os dados. Por favor, feche TODAS as outras abas deste site e tente novamente.');
                    reject('Exclusão bloqueada');
                };
            }, 100); // 100ms de espera
        });

        // 3. Limpar o LocalStorage
        localStorage.clear();
        console.log("LocalStorage limpo.");

        // 4. Limpar o SessionStorage
        sessionStorage.clear();
        console.log("SessionStorage limpo.");

        // 5. Limpar os Cookies
        clearAllCookies();

        // 6. Informar o usuário e recarregar a página
        alert('Todos os dados locais foram apagados com sucesso. A página será recarregada.');
        location.reload();

    } catch (error) {
        console.error("Falha ao tentar limpar os dados locais:", error);
        alert('Ocorreu um erro ao tentar apagar os dados. Verifique o console para mais detalhes.');
    }
}
