const API_KEY = "23BBCE8145B2BFB9F407C265BD82A7498F19DD90371D53CD34743E12E9F300BE";
const API_URL = "https://sinuze-api.onrender.com";

// Globals to store payment details
let currentGroupId = null;
let currentAmount = 0;
let currentDescription = '';
let paymentId = null;
let timerInterval = null;

// Carrega o HTML do modal na página
async function loadPaymentModal() {
    try {
        const response = await fetch('assets/payment/payment-modal.html');
        if (!response.ok) throw new Error('Failed to load payment modal HTML');
        const html = await response.text();
        document.body.insertAdjacentHTML('beforeend', html);
        initializePaymentEventListeners();
    } catch (error) {
        console.error("Error loading payment modal:", error);
    }
}

function initializePaymentEventListeners() {
    const overlay = document.getElementById('paymentOverlay');
    const closeBtn = document.getElementById('closePaymentModal');
    const payWithPixBtn = document.getElementById('payWithPixBtn');
    const payWithCardBtn = document.getElementById('payWithCardBtn');
    const pixForm = document.getElementById('pix-form');
    const copyPayloadBtn = document.getElementById('copyPayloadBtn');

    if (!overlay) {
        console.error("Payment modal elements not found. Initialization failed.");
        return;
    }

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePaymentPopup();
        }
    });

    closeBtn.addEventListener('click', closePaymentPopup);
    payWithPixBtn.addEventListener('click', () => showStep('payment-form-step'));
    payWithCardBtn.addEventListener('click', () => alert('Em breve!'));
    pixForm.addEventListener('submit', handlePixFormSubmit);
    copyPayloadBtn.addEventListener('click', copyPixPayload);
}

function showStep(stepId) {
    ['payment-method-step', 'payment-form-step', 'payment-result-step'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.style.display = 'none';
    });
    const stepEl = document.getElementById(stepId);
    if(stepEl) stepEl.style.display = 'block';
}

// Parâmetros simplificados: não precisa mais do 'purchaseType'
function openPaymentPopup(groupId, amount, description) {
    currentGroupId = groupId;
    currentAmount = amount;
    currentDescription = description;
    
    document.getElementById('pix-form').reset();
    document.getElementById('payment-status').textContent = 'Aguardando pagamento...';
    document.getElementById('payment-status').style.color = 'var(--payment-modal-text)';

    document.getElementById('paymentOverlay').classList.add('active');
    const modalTitle = document.querySelector('#payment-method-step h2');
    if (modalTitle) {
        modalTitle.textContent = `Pagamento para ${description}`;
    }
    showStep('payment-method-step');
}

function closePaymentPopup() {
    stopTimer();
    document.getElementById('paymentOverlay').classList.remove('active');
    currentGroupId = null;
    currentAmount = 0;
    currentDescription = '';
    paymentId = null;
}

async function handlePixFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('payer-name').value;
    const doc = document.getElementById('payer-document').value;
    const email = document.getElementById('payer-email').value;
    const phone = document.getElementById('payer-phone').value;

    if (!name || !doc || !email) {
        alert("Por favor, preencha nome, CPF e email.");
        return;
    }

    createPixPayment(name, doc, email, phone);
}

async function createPixPayment(name, doc, email, phone) {
    const body = {
        total_amount: currentAmount,
        name,
        document: doc,
        email,
        phone,
        product_name: `${currentDescription} - #${currentGroupId}`,
        description: `Pagamento referente a: ${currentDescription} para o grupo ${currentGroupId}`
    };

    try {
        const res = await fetch(`${API_URL}/criar-pagamento`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (!res.ok || !data.id) {
            const errorMsg = data.message || 'Erro ao criar o pagamento.';
            throw new Error(errorMsg);
        }
        
        paymentId = data.id;
        displayPixInfo(data.qr_base64, data.pix_payload);
        startTimer();
        waitForPaymentConfirmation();
    } catch (error) {
        console.error('Erro no pagamento PIX:', error);
        alert(`Não foi possível gerar o PIX: ${error.message}. Tente novamente.`);
    }
}

function displayPixInfo(qrBase64, payload) {
    document.getElementById('qr-code-container').innerHTML = `<img src="${qrBase64}" alt="PIX QR Code">`;
    document.getElementById('pix-payload').textContent = payload;
    showStep('payment-result-step');
}

function startTimer() {
    stopTimer();
    let timeLeft = 180;
    const timerElement = document.getElementById('payment-timer');

    timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        timerElement.textContent = `Tempo restante: ${minutes}:${seconds}`;

        if (timeLeft <= 0) {
            stopTimer();
            timerElement.textContent = "Tempo esgotado!";
            document.getElementById('payment-status').textContent = 'Pagamento cancelado.';
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

async function waitForPaymentConfirmation() {
    if (!paymentId) return;

    const overallTimeout = setTimeout(() => {
        clearInterval(checkInterval);
    }, 185000);

    const checkInterval = setInterval(async () => {
        if (!paymentId) {
            clearInterval(checkInterval);
            clearTimeout(overallTimeout);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/check-payment/${paymentId}`, {
                headers: { "x-api-key": API_KEY }
            });
            const data = await res.json();

            if (data.status === "PAID") {
                clearInterval(checkInterval);
                clearTimeout(overallTimeout);
                stopTimer();
                handleSuccessfulPayment();
            } else if (data.status === "CANCELLED" || data.status === "EXPIRED") {
                clearInterval(checkInterval);
                clearTimeout(overallTimeout);
                stopTimer();
                document.getElementById('payment-status').textContent = 'Pagamento cancelado ou expirado.';
            }
        } catch (error) {
            console.error('Erro ao verificar pagamento:', error);
        }
    }, 5000);
}

async function handleSuccessfulPayment() {
    document.getElementById('payment-status').textContent = 'Pagamento Confirmado! Liberando grupo...';
    document.getElementById('payment-status').style.color = 'var(--action-green)';

    try {
        // Chama o backend para validar e aplicar a compra.
        const response = await fetch(`${API_URL}/confirmar-compra-e-ativar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY 
            },
            body: JSON.stringify({
                paymentId: paymentId,
                purchaseType: 'release', // Lógica simplificada: é sempre 'release'
                groupId: currentGroupId
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Falha ao liberar o grupo no servidor.');
        }

        document.getElementById('payment-status').textContent = result.message;

        setTimeout(() => {
            closePaymentPopup();
            carregarMeusGrupos();
        }, 2500);

    } catch (error) {
        console.error('Erro ao liberar o grupo:', error);
        alert(`Pagamento confirmado, mas houve um erro na liberação: ${error.message}. Entre em contato com o suporte.`);
        document.getElementById('payment-status').textContent = "Erro na liberação.";
        document.getElementById('payment-status').style.color = "var(--action-red)";
    }
}

function copyPixPayload() {
    const payload = document.getElementById('pix-payload').textContent;
    navigator.clipboard.writeText(payload).then(() => {
        const btn = document.getElementById('copyPayloadBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Copiado!';
        setTimeout(() => { btn.textContent = originalText; }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        alert('Não foi possível copiar o código.');
    });
}

// Inicia o carregamento do modal quando o script for lido
document.addEventListener('DOMContentLoaded', loadPaymentModal);
