
let paymentId = null;
let countdown = 300;
let timerInterval = null;
let groupId = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    groupId = urlParams.get('group_id');
    if (groupId) {
        fetchGrupoData(groupId);
    }
});

async function fetchGrupoData(id) {
    try {
        const [grupo] = await supabaseFetch(`grupos?id=eq.${id}&select=nome`);
        if (grupo) {
            const productNameElement = document.getElementById('productName');
            const productNameHiddenElement = document.getElementById('product_name_hidden');
            if(productNameElement) productNameElement.innerText = `Pagar para liberar: ${grupo.nome}`;
            if(productNameHiddenElement) productNameHiddenElement.value = `Liberação do grupo: ${grupo.nome}`;
        } else {
            console.error('Grupo não encontrado');
            iziToast.error({ title: 'Erro', message: 'Grupo não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao buscar dados do grupo:', error);
        iziToast.error({ title: 'Erro', message: 'Não foi possível carregar os dados do grupo.' });
    }
}

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
    const productName = document.getElementById('product_name_hidden').value || "Pagamento de Taxa de Grupo";

    if(!nome || !cpf || !email){
        iziToast.error({ title: 'Erro', message: 'Preencha todos os campos!', position: 'topCenter' });
        return;
    }
    if (!groupId) {
        iziToast.error({ title: 'Erro', message: 'ID do grupo não encontrado. Não é possível prosseguir.', position: 'topCenter' });
        return;
    }

    document.getElementById("pre-checkout").style.display = 'none';
    document.getElementById("loading").style.display = 'block';

    try {
        const res = await fetch("http://localhost:3000/criar-pagamento", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                name: nome, 
                email: email, 
                total_amount: total_amount,
                product_name: productName,
                description: `Pagamento da taxa para o grupo ID: ${groupId}`,
                document: cpf,
                group_id: groupId
            })
        });

        const data = await res.json();
        document.getElementById("loading").style.display = 'none';

        if(!data || !data.id){
            iziToast.error({ title: 'Erro', message: data.message || 'Erro ao criar pagamento.', position: 'topCenter' });
            document.getElementById("pre-checkout").style.display = 'block';
            return;
        }

        document.getElementById("result").style.display = 'block';
        paymentId = data.id;

        // Inicia a verificação do status do pagamento
        aguardarConfirmacao(paymentId);

        const pixPayload = data.pix_payload;
        const qrUrl = `http://localhost:3000/qr/${paymentId}`;

        document.getElementById("result").innerHTML = `
        <div class="card qr-section">
            <div class="header-title"><span>MM</span> KDEFY GRUPOS LTDA</div>
            <h2 id="productNameResult">Pague R$ 9,90 via Pix</h2>
            <div class="vencimento" id="vencimento-qr">O pagamento expira em 05:00</div>
            <p style="font-weight: 500; margin-top: 30px;">Para pagar, escolha uma destas opções:</p>
            <div class="qr-code-box"><p style="font-size: 14px; color: #555; margin-bottom: 5px;">Código QR</p><img src="${qrUrl}" alt="QR Code Pix"></div>
            <div class="pix-code-label">Código de pagamento</div>
            <div class="copy-field"><div class="copy-field-text">${pixPayload}</div><div class="copy-icon" onclick="copyPayload()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></div></div>
            <div class="instrucoes-title">Como pagar?</div>
            <div class="instrucoes-number"><span>1</span> <div>Entre no app ou site do seu banco e escolha a opção de pagamento via Pix.</div></div>
            <div class="instrucoes-number"><span>2</span> <div>Escaneie o código QR ou copie e cole o código de pagamento.</div></div>
            <div class="instrucoes-number"><span>3</span> <div>Pronto! O pagamento será creditado na hora e você receberá um e-mail de confirmação.</div></div>
            <div class="pix-limit-info">O Pix tem um limite diário de transferências. Para mais informações, por favor, consulte seu banco.</div>
            <div class="detalhes-compra">
                <div class="detalhes-compra-header"><span class="icon">🧾</span> Detalhes da sua compra</div>
                <div class="detalhe-linha"><span>${productName}</span><span>R$ 9,90</span></div>
                <div class="detalhe-linha total"><span>Total</span><span>R$ 9,90</span></div>
            </div>
            <button id="cancelBtn" onclick="cancelPayment()">Cancelar Pagamento</button>
        </div>`;
        document.getElementById('productNameResult').innerText = document.getElementById('productName').innerText;

        document.getElementById("timer").remove();
        document.getElementById("vencimento-qr").id = "timer";
        
        countdown = 300;
        clearInterval(timerInterval);
        startTimer();

    } catch (error) {
        document.getElementById("loading").style.display = 'none';
        document.getElementById("pre-checkout").style.display = 'block';
        iziToast.error({ title: 'Erro', message: 'Ocorreu um erro. Tente novamente.', position: 'topCenter' });
        console.error("Payment creation failed:", error);
    }
};

async function aguardarConfirmacao(paymentId) {
    try {
        const response = await fetch(`http://localhost:3000/aguardar-pagamento/${paymentId}`);
        const data = await response.json();

        if (data.success) {
            clearInterval(timerInterval);
            iziToast.success({
                title: 'Pagamento Confirmado',
                message: 'Seu grupo foi liberado com sucesso!',
                position: 'topCenter',
                timeout: 5000,
                onClosed: () => { window.location.href = '/meus-grupos/'; }
            });
        } else {
            iziToast.error({
                title: 'Pagamento Falhou',
                message: data.message || 'O pagamento não foi confirmado.',
                position: 'topCenter',
                 onClosed: () => { window.location.reload(); }
            });
        }
    } catch (error) {
         iziToast.error({
            title: 'Erro de Comunicação',
            message: 'Não foi possível verificar o status do pagamento. Verifique sua conexão e tente novamente.',
            position: 'topCenter'
        });
    }
}

function copyPayload() {
    const text = document.querySelector(".copy-field-text").innerText;
    navigator.clipboard.writeText(text);
    iziToast.success({ title: 'Copiado!', message: 'Código Pix copiado com sucesso.', position: 'topCenter', timeout: 2000 });
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
