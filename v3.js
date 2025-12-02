/**
 * ----------------------------------------------
 *  API de Pagamento v3 - KDefy
 * ----------------------------------------------
 *  - Adicionado suporte para `group_id`.
 *  - Atualiza o status do grupo para `pago: true` no Supabase após confirmação.
 */

const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const QRCode = require("qrcode");

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURAÇÕES DA API DE PAGAMENTO (SUNIZE) ---
const X_API_KEY = "ck_bdf20b49f4705fe7ac368125fcf8785f";
const X_API_SECRET = "cs_27fdd262baf0cc3bc88e28221d7719ae";
const SUNIZE_URL = "https://api.sunize.com.br/v1/transactions";

// --- BANCO DE DADOS DE PAGAMENTOS (sunizev2) ---
const PAYMENT_DB_URL = "https://ijcdtytqqmurfeboolml.supabase.co";
// ATENÇÃO: Use uma chave segura (service_role) em produção para este banco.
const PAYMENT_DB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqY2R0eXRxcW11cmZlYm9vbG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDc2MDEsImV4cCI6MjA4MDE4MzYwMX0.nWhAnsn0nZcqgXBac6NozoY_LD2ZeItYmy8YW_AgIpA";
const API_PASSWORD = "Sinuzev2apipaymentgps11682"; // Senha para proteger updates/selects

// --- BANCO DE DADOS PRINCIPAL (grupos) ---
const GRUPOS_DB_URL = 'https://aqyaxfrukssndxgctukf.supabase.co';
// ATENÇÃO: Use uma chave segura (service_role) em produção para este banco.
const GRUPOS_DB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeWF4ZnJ1a3NzbmR4Z2N0dWtmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjMwNjQxNiwiZXhwIjoyMDc3ODgyNDE2fQ.YOUR_SERVICE_ROLE_KEY'; // <-- SUBSTITUA PELA SUA SERVICE_ROLE KEY


// --- Funções de Banco de Dados (Pagamentos) ---

async function dbInsert(obj) {
    return await fetch(`${PAYMENT_DB_URL}/rest/v1/sunizev2`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": PAYMENT_DB_KEY,
            "Authorization": `Bearer ${PAYMENT_DB_KEY}`,
            "Prefer": "return=minimal"
        },
        body: JSON.stringify(obj)
    });
}

async function dbSelect(id) {
    const r = await fetch(`${PAYMENT_DB_URL}/rest/v1/sunizev2?id=eq.${id}&api_password=eq.${API_PASSWORD}`, {
        headers: { "apikey": PAYMENT_DB_KEY, "Authorization": `Bearer ${PAYMENT_DB_KEY}` }
    });
    const data = await r.json();
    return data[0];
}

async function dbUpdate(id, obj) {
    return await fetch(`${PAYMENT_DB_URL}/rest/v1/sunizev2?id=eq.${id}&api_password=eq.${API_PASSWORD}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "apikey": PAYMENT_DB_KEY,
            "Authorization": `Bearer ${PAYMENT_DB_KEY}`
        },
        body: JSON.stringify(obj)
    });
}

// --- Função de Banco de Dados (Grupos) ---

/**
 * Atualiza o status de um grupo para "pago: true" no banco de dados principal.
 * @param {string} groupId - O ID do grupo a ser atualizado.
 */
async function updateGrupoStatus(groupId) {
    if (!groupId) {
        console.error("updateGrupoStatus: group_id não fornecido.");
        return;
    }

    try {
        const response = await fetch(`${GRUPOS_DB_URL}/rest/v1/grupos?id=eq.${groupId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "apikey": GRUPOS_DB_KEY, // Chave do Supabase de grupos
                "Authorization": `Bearer ${GRUPOS_DB_KEY}`
            },
            body: JSON.stringify({ pago: true })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error(`Falha ao atualizar o grupo ${groupId}:`, error.message);
        } else {
            console.log(`Grupo ${groupId} atualizado para PAGO com sucesso.`);
        }
    } catch (error) {
        console.error("Erro na requisição para atualizar o grupo:", error);
    }
}


// --- Lógica Auxiliar ---

const encontrarPayload = obj => {
    let out = null;
    const scan = o => {
        if (!o || out) return;
        if (typeof o === "string" && o.startsWith("000201")) return (out = o);
        if (typeof o === "object") for (const k in o) scan(o[k]);
    };
    scan(obj);
    return out;
};


// --- ENDPOINTS DA API ---

app.post("/criar-pagamento", async (req, res) => {
    try {
        // Agora recebemos o group_id
        const { total_amount, name, document, email, product_name, description, group_id } = req.body;

        if (!total_amount || !name || !document || !email)
            return res.status(400).json({ error: true, message: "Campos obrigatórios faltando." });

        if (!group_id) {
            return res.status(400).json({ error: true, message: "O ID do grupo (group_id) é obrigatório." });
        }

        const payload = {
            external_id: "ID-" + Date.now(),
            total_amount: Number(total_amount),
            payment_method: "PIX",
            ip: req.ip,
            items: [{
                id: "item-001",
                title: product_name,
                description,
                price: Number(total_amount),
                quantity: 1,
                is_physical: false
            }],
            customer: { name, email, document, document_type: "CPF", phone: "+5511999999999" }
        };

        const { data } = await axios.post(SUNIZE_URL, payload, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": X_API_KEY,
                "x-api-secret": X_API_SECRET
            }
        });

        const pixPayload = encontrarPayload(data);

        await dbInsert({
            id: data.id,
            external_id: payload.external_id,
            total_amount: total_amount,
            status: data.status || "PENDING",
            pix_payload: pixPayload,
            json_data: data,
            api_password: API_PASSWORD,
            group_id: group_id // Salvando o group_id
        });

        res.json({ id: data.id, pix_payload: pixPayload });

    } catch (err) {
        console.error("Erro em /criar-pagamento:", err.response?.data || err.message);
        res.status(400).json({ error: true, message: err.response?.data?.message || err.message });
    }
});

app.get("/aguardar-pagamento/:id", async (req, res) => {
    const id = req.params.id;
    let attempts = 0;
    const maxAttempts = 20; // Espera por 1 minuto (20 * 3s)

    const pagos = ["APPROVED", "PAID", "COMPLETED", "SUCCESS"];
    const cancelados = ["CANCELLED", "EXPIRED"];

    const intervalo = setInterval(async () => {
        attempts++;
        const pagamento = await dbSelect(id);

        if (attempts > maxAttempts) {
             clearInterval(intervalo);
             return res.status(408).json({ success: false, status: "TIMEOUT", message: "Tempo de espera excedido." });
        }

        if (!pagamento) return; // Continua tentando se o pagamento ainda não apareceu

        const status = pagamento.status.toUpperCase();

        if (pagos.includes(status)) {
            clearInterval(intervalo);
            // ATUALIZA O GRUPO ANTES DE RESPONDER AO CLIENTE
            await updateGrupoStatus(pagamento.group_id);
            return res.json({ success: true, status, message: "Pagamento confirmado" });
        }

        if (cancelados.includes(status)) {
            clearInterval(intervalo);
            return res.status(422).json({ success: false, status, message: "Pagamento foi cancelado ou expirou." });
        }

    }, 3000);
});

app.get("/cancelar/:id", async (req, res) => {
    const id = req.params.id;
    const pagamento = await dbSelect(id);

    if (!pagamento)
        return res.status(404).json({ error: true, message: "Pagamento não encontrado." });

    await dbUpdate(id, { status: "CANCELLED", api_password: API_PASSWORD });

    res.json({ success: true, id, status: "CANCELLED", message: "Pagamento cancelado com sucesso." });
});

app.get("/qr/:id", async (req, res) => {
    const id = req.params.id;
    const pagamento = await dbSelect(id);

    if (!pagamento)
        return res.status(404).json({ error: true, message: "Pagamento não encontrado." });

    if (!pagamento.pix_payload)
        return res.status(404).json({ error: true, message: "Payload PIX não encontrado para este pagamento." });

    try {
        const qrCodeDataURL = await QRCode.toDataURL(pagamento.pix_payload);
        const imgBuffer = Buffer.from(qrCodeDataURL.split(",")[1], 'base64');
        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': imgBuffer.length
        });
        res.end(imgBuffer);
    } catch(e) {
        console.error("Erro ao gerar QR Code:", e);
        return res.status(500).json({ error: true, message: "Erro interno ao gerar QR Code." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API v3 rodando na porta ${PORT}`));
