/* ALERT START */
function createAlert(message, title = 'Aviso', confirmText = 'OK') {
    return new Promise((resolve) => {
        // Remove qualquer alerta existente para evitar duplicatas
        const existingAlert = document.querySelector('.custom-alert-overlay');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertOverlay = document.createElement('div');
        alertOverlay.className = 'custom-alert-overlay';

        const alertBox = document.createElement('div');
        alertBox.className = 'custom-alert-box';

        alertBox.innerHTML = `
            <div class="custom-alert-title">${title}</div>
            <div class="custom-alert-message">${message}</div>
            <div class="custom-alert-buttons">
                <button class="custom-alert-button primary">${confirmText}</button>
            </div>
        `;

        alertOverlay.appendChild(alertBox);
        document.body.appendChild(alertOverlay);
        
        // Força o navegador a aplicar o estilo inicial (opacity 0)
        window.getComputedStyle(alertOverlay).opacity;
        
        // Adiciona a classe 'active' para iniciar a transição
        alertOverlay.classList.add('active');

        const confirmButton = alertBox.querySelector('.primary');

        const closeAlert = () => {
            alertOverlay.classList.remove('active');
            alertOverlay.addEventListener('transitionend', () => {
                if(alertOverlay.parentElement) {
                    alertOverlay.remove();
                }
                resolve(true);
            }, { once: true });
        };

        confirmButton.addEventListener('click', closeAlert);
        alertOverlay.addEventListener('click', (e) => {
            if (e.target === alertOverlay) {
                closeAlert();
            }
        });
    });
}

function createConfirm(message, title = 'Confirmação', confirmText = 'Confirmar', cancelText = 'Cancelar') {
    return new Promise((resolve) => {
        const existingAlert = document.querySelector('.custom-alert-overlay');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertOverlay = document.createElement('div');
        alertOverlay.className = 'custom-alert-overlay';

        const alertBox = document.createElement('div');
        alertBox.className = 'custom-alert-box';

        alertBox.innerHTML = `
            <div class="custom-alert-title">${title}</div>
            <div class="custom-alert-message">${message}</div>
            <div class="custom-alert-buttons">
                <button class="custom-alert-button secondary">${cancelText}</button>
                <button class="custom-alert-button primary">${confirmText}</button>
            </div>
        `;

        alertOverlay.appendChild(alertBox);
        document.body.appendChild(alertOverlay);

        window.getComputedStyle(alertOverlay).opacity;
        alertOverlay.classList.add('active');

        const primaryButton = alertBox.querySelector('.primary');
        const secondaryButton = alertBox.querySelector('.secondary');

        const close = (value) => {
            alertOverlay.classList.remove('active');
            alertOverlay.addEventListener('transitionend', () => {
                 if(alertOverlay.parentElement) {
                    alertOverlay.remove();
                }
                resolve(value);
            }, { once: true });
        };

        primaryButton.addEventListener('click', () => close(true));
        secondaryButton.addEventListener('click', () => close(false));
        alertOverlay.addEventListener('click', (e) => {
            if (e.target === alertOverlay) {
                close(false);
            }
        });
    });
}

// Funções globais para facilitar a chamada
window.customAlert = createAlert;
window.customConfirm = createConfirm;
/* ALERT END */