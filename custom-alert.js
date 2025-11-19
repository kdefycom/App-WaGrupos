/* custom-alert.js */

function showCustomModal({ title, message, confirmText = 'OK', cancelText, isConfirmation }) {
  // Evita criar múltiplos modais
  if (document.querySelector('.custom-alert-overlay')) {
    return;
  }

  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';

    const box = document.createElement('div');
    box.className = 'custom-alert-box';

    let content = '';
    if (title) {
        content += `<p class="custom-alert-title">${title}</p>`;
    }
    content += `<p class="custom-alert-message">${message}</p>`;
    
    const buttons = document.createElement('div');
    buttons.className = 'custom-alert-buttons';

    // Botão de Confirmação (OK)
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'custom-alert-button ok';
    if (!isConfirmation) {
        confirmBtn.classList.add('single-ok');
    }
    confirmBtn.textContent = confirmText;
    confirmBtn.onclick = () => {
      closeModal(true);
    };

    buttons.appendChild(confirmBtn);

    // Botão de Cancelar (se for um diálogo de confirmação)
    if (isConfirmation) {
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'custom-alert-button cancel';
      cancelBtn.textContent = cancelText || 'Cancelar';
      cancelBtn.onclick = () => {
        closeModal(false);
      };
      buttons.appendChild(cancelBtn);
    }

    box.innerHTML = content;
    box.appendChild(buttons);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Adiciona a classe para a animação de entrada
    setTimeout(() => overlay.classList.add('visible'), 10);

    function closeModal(value) {
      overlay.classList.remove('visible');
      overlay.addEventListener('transitionend', () => {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
        resolve(value);
      });
    }
  });
}

// Substitui o alert() padrão
window.customAlert = (message, title = 'Aviso') => {
  return showCustomModal({ title, message, isConfirmation: false });
};

// Substitui o confirm() padrão
window.customConfirm = (message, title = 'Confirmação') => {
  return showCustomModal({ title, message, isConfirmation: true });
};
