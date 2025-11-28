
function escapeHTML(str) {
    if (str === null || str === undefined) {
        return '';
    }
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(String(str)));
    return p.innerHTML;
}

function createAlert(message, title = 'Aviso', confirmText = 'OK') {
    return new Promise((resolve) => {
        const existingAlert = document.querySelector('.custom-alert-overlay');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertOverlay = document.createElement('div');
        alertOverlay.className = 'custom-alert-overlay';

        const alertBox = document.createElement('div');
        alertBox.className = 'custom-alert-box';

        const alertTitle = document.createElement('div');
        alertTitle.className = 'custom-alert-title';
        alertTitle.textContent = title;

        const alertMessage = document.createElement('div');
        alertMessage.className = 'custom-alert-message';
        alertMessage.textContent = message;

        const alertButtons = document.createElement('div');
        alertButtons.className = 'custom-alert-buttons';

        const confirmButton = document.createElement('button');
        confirmButton.className = 'custom-alert-button primary';
        confirmButton.textContent = confirmText;

        alertButtons.appendChild(confirmButton);
        alertBox.appendChild(alertTitle);
        alertBox.appendChild(alertMessage);
        alertBox.appendChild(alertButtons);
        alertOverlay.appendChild(alertBox);
        document.body.appendChild(alertOverlay);

        window.getComputedStyle(alertOverlay).opacity;
        alertOverlay.classList.add('active');

        const closeAlert = () => {
            alertOverlay.classList.remove('active');
            alertOverlay.addEventListener('transitionend', () => {
                if (alertOverlay.parentElement) {
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

        const alertTitle = document.createElement('div');
        alertTitle.className = 'custom-alert-title';
        alertTitle.textContent = title;

        const alertMessage = document.createElement('div');
        alertMessage.className = 'custom-alert-message';
        alertMessage.textContent = message;

        const alertButtons = document.createElement('div');
        alertButtons.className = 'custom-alert-buttons';

        const secondaryButton = document.createElement('button');
        secondaryButton.className = 'custom-alert-button secondary';
        secondaryButton.textContent = cancelText;

        const primaryButton = document.createElement('button');
        primaryButton.className = 'custom-alert-button primary';
        primaryButton.textContent = confirmText;

        alertButtons.appendChild(secondaryButton);
        alertButtons.appendChild(primaryButton);
        alertBox.appendChild(alertTitle);
        alertBox.appendChild(alertMessage);
        alertBox.appendChild(alertButtons);
        alertOverlay.appendChild(alertBox);
        document.body.appendChild(alertOverlay);

        window.getComputedStyle(alertOverlay).opacity;
        alertOverlay.classList.add('active');

        const close = (value) => {
            alertOverlay.classList.remove('active');
            alertOverlay.addEventListener('transitionend', () => {
                if (alertOverlay.parentElement) {
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
window.escapeHTML = escapeHTML;
