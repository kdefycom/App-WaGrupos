let paymentId = null;
let countdown = 300;
let timerInterval = null;

function startTimer() {
    const timerElement = document.getElementById("timer");
    timerInterval = setInterval(async () => {
        countdown--;
        
        const minutes = Math.floor(countdown / 60);
        const seconds = countdown % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        timerElement.innerText = `O pagamento expira em ${timeString}`;

        if (countdown <= 0) {
            clearInterval(timerInterval);
            timerElement.innerText = "Pagamento expirado.";

            const cancelBtn = document.getElementById("cancelBtn");
            if(cancelBtn && !cancelBtn.disabled){
                cancelBtn.classList.add("disabled");
                cancelBtn.disabled = true;

                if(paymentId){
                    await fetch(`http://localhost:3000/cancelar/${paymentId}`, { method: "GET" });
                }
            }
        }
    }, 1000);
}

document.getElementById("payBtn").onclick = async () => {
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const total_amount = 9.90;

    if(!nome || !cpf || !email){
        alert("Preencha todos os campos!");
        return;
    }

    document.getElementById("pre-checkout").style.display = 'none';
    document.getElementById("result").style.display = 'block';

    const res = await fetch("http://localhost:3000/criar-pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name: nome, 
            email: email, 
            total_amount: total_amount,
            product_name: "grupo categoria paga",
            description: "Pagamento via PIX - KDEFY GRUPOS LTDA",
            document: cpf
        })
    });

    const data = await res.json();
    if(!data || !data.id){
        alert("Erro ao criar pagamento.");
        document.getElementById("pre-checkout").style.display = 'block';
        document.getElementById("result").style.display = 'none';
        return;
    }

    paymentId = data.id;

    const pixPayload = data.pix_payload;
    const qrUrl = `http://localhost:3000/qr/${paymentId}`;

    document.getElementById("result").innerHTML = `
    <div class="card qr-section">
        <div class="header-title">
            <span>MM</span> 
            KDEFY GRUPOS LTDA
        </div>

        <h2>Pague R$ 9,90 via Pix</h2>
        <div class="vencimento" id="vencimento-qr">O pagamento expira em 05:00</div>

        <p style="font-weight: 500; margin-top: 30px;">Para pagar, escolha uma destas opções:</p>
        
        <div class="qr-code-box">
            <p style="font-size: 14px; color: #555; margin-bottom: 5px;">Código QR</p>
            <img src="${qrUrl}" alt="QR Code Pix">
        </div>

        <div class="pix-code-label">Código de pagamento</div>
        <div class="copy-field">
            <div class="copy-field-text">${pixPayload}</div>
            <div class="copy-icon" onclick="copyPayload()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></div>
        </div>

        <div class="instrucoes-title">Como pagar?</div>

        <div class="instrucoes-number">
            <span>1</span> <div>Entre no app ou site do seu banco e escolha a opção de pagamento via Pix.</div>
        </div>

        <div class="instrucoes-number">
            <span>2</span> <div>Escaneie o código QR ou copie e cole o código de pagamento.</div>
        </div>

        <div class="instrucoes-number">
            <span>3</span> <div>Pronto! O pagamento será creditado na hora e você receberá um e-mail de confirmação.</div>
        </div>
        
        <div class="pix-limit-info">
            O Pix tem um limite diário de transferências. Para mais informações, por favor, consulte seu banco.
        </div>

        <div class="detalhes-compra">
            <div class="detalhes-compra-header">
                <span class="icon">🧾</span>
                Detalhes da sua compra
            </div>
            <div class="detalhe-linha">
                <span>grupo categoria paga</span>
                <span>R$ 9,90</span>
            </div>
            <div class="detalhe-linha total">
                <span>Total</span>
                <span>R$ 9,90</span>
            </div>
        </div>

        <button id="cancelBtn" onclick="cancelPayment()">Cancelar Pagamento</button>
    </div>
    `;

    // Atualiza o elemento do timer para o novo local
    document.getElementById("timer").remove();
    document.getElementById("vencimento-qr").id = "timer";
    
    countdown = 300;
    clearInterval(timerInterval);
    startTimer();
};

function copyPayload() {
    const text = document.querySelector(".copy-field-text").innerText;
    navigator.clipboard.writeText(text);
    alert("Código Pix copiado!");
}

async function cancelPayment() {
    if (!paymentId) return;
    const cancelBtn = document.getElementById("cancelBtn");

    if (!cancelBtn || cancelBtn.disabled) return;

    await fetch(`http://localhost:3000/cancelar/${paymentId}`, { method: "GET" });

    cancelBtn.innerText = "Pagamento Cancelado";
    cancelBtn.classList.add("disabled");
    cancelBtn.disabled = true;

    clearInterval(timerInterval);
    document.getElementById("timer").innerText = "Pagamento cancelado.";
}
