
import { CATEGORIES } from '../utils/constants.js';
import { supabaseFetch } from '../services/supabase.js';
import { salvarGrupoLocal } from '../services/indexedDB.js';

/**
 * @fileoverview Script para a página de envio de grupos.
 * Controla a navegação por etapas, a validação dos campos e o envio final
 * dos dados para o banco de dados.
 */

let tipoSelecionado = '';
let linkValidado = '';
let fotoUrl = 'https://via.placeholder.com/300';
let debounceTimer;

const REGRAS = [
  'Proibido conteúdo pornográfico',
  'Proibido brigas e discussões',
  'Proibido racismo',
  'Proibido assédio',
  'Respeitar LGPD',
  'Proibido spam',
  'Proibido links maliciosos'
];

/**
 * Garante que o DOM esteja totalmente carregado antes de executar o script.
 * Popula as categorias e adiciona um listener para validar o link em tempo real.
 */
document.addEventListener('DOMContentLoaded', () => {
  popularCategorias();
  document.getElementById('linkInput').addEventListener('input', () => {
    clearTimeout(debounceTimer);
    /**
     * O debounce é uma técnica para evitar que a função de validação seja chamada
     * a cada tecla digitada, esperando um breve período (500ms) de inatividade
     * do usuário antes de fazer a verificação.
     */
    debounceTimer = setTimeout(validarLinkEmTempoReal, 500);
  });
});

/**
 * Preenche o <select> de categorias com base na lista `CATEGORIES`.
 */
function popularCategorias() {
  const select = document.getElementById('categoriaSelect');
  if (!select) {
    console.error('Elemento select de categorias não encontrado.');
    return;
  }

  select.innerHTML = ''; 

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Selecione...';
  select.appendChild(defaultOption);

  CATEGORIES.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

/**
 * Controla a visibilidade das etapas do formulário.
 * @param {number} numero - O número do 'step' a ser exibido.
 */
function mostrarStep(numero) {
  document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
  document.getElementById(`step${numero}`).classList.add('active');
}

/**
 * Permite ao usuário retornar a uma etapa anterior do formulário.
 * @param {number} numero - O número do 'step' para o qual voltar.
 */
function voltarStep(numero) {
  mostrarStep(numero);
  if (numero === 1) {
    document.getElementById('linkInput').value = '';
    document.getElementById('alert').innerHTML = '';
    document.getElementById('prosseguirBtn').disabled = true;
    linkValidado = '';
  }
}

/**
 * Define o tipo de grupo (WhatsApp, Telegram, etc.) escolhido pelo usuário.
 * @param {string} tipo - O tipo selecionado.
 */
window.escolherTipo = function(tipo) {
  tipoSelecionado = tipo;
  let tipoTexto = '';
  switch (tipo) {
    case 'whatsapp':
      tipoTexto = 'Grupo de WhatsApp';
      break;
    case 'telegram':
      tipoTexto = 'Grupo de Telegram';
      break;
    case 'instagram':
      tipoTexto = 'Grupo de Instagram';
      break;
    case 'canal_whatsapp':
      tipoTexto = 'Canal do WhatsApp';
      break;
  }
  document.getElementById('tipoTexto').textContent = tipoTexto;
  mostrarStep(2);
}

/**
 * Valida o link inserido pelo usuário em tempo real.
 * Verifica o formato (regex) e consulta o Supabase para ver se o link já existe.
 */
async function validarLinkEmTempoReal() {
  const link = document.getElementById('linkInput').value.trim();
  const alertDiv = document.getElementById('alert');
  const prosseguirBtn = document.getElementById('prosseguirBtn');
  prosseguirBtn.disabled = true;
  alertDiv.className = 'alert'; // Limpa classes de cor

  if (!link) {
    alertDiv.innerHTML = '';
    return;
  }

  let isValid = false;
  const tipoEntidade = tipoSelecionado === 'canal_whatsapp' ? 'Canal' : 'Grupo';
  const placeholderText = document.getElementById('tipoTexto').textContent || `de ${tipoEntidade}`;

  const patterns = {
      whatsapp: /^https:\/\/chat\.whatsapp\.com\/[a-zA-Z0-9\-_?=&]+$/,
      telegram: /^https:\/\/t\.me\/([a-zA-Z0-9_]{5,})$/,
      instagram: /^https:\/\/ig\.me\/j\/[a-zA-Z0-9\-_=\/]+$/,
      canal_whatsapp: /^https:\/\/whatsapp\.com\/channel\/[a-zA-Z0-9\-_]+$/
  };

  const regex = patterns[tipoSelecionado];
  if (regex) {
      isValid = regex.test(link);
  }

  if (!isValid) {
    alertDiv.innerHTML = `Link de ${placeholderText} inválido.`;
    alertDiv.className = 'alert alert-error';
    return;
  }

  try {
    const baseLink = link.split('?')[0];
    const grupos = await supabaseFetch(`grupos?link=like.${encodeURIComponent(baseLink)}*`);

    if (grupos.length > 0) {
      alertDiv.innerHTML = 'Este link já foi cadastrado!';
      alertDiv.className = 'alert alert-error';
      return;
    }

    alertDiv.innerHTML = '✓ Link válido!';
    alertDiv.className = 'alert alert-success';
    linkValidado = link;
    prosseguirBtn.disabled = false;

  } catch (error) {
    alertDiv.innerHTML = 'Erro ao verificar o link.';
    alertDiv.className = 'alert alert-error';
  }
}

/**
 * Avança para a etapa de preenchimento dos detalhes do grupo.
 */
window.prosseguirParaDetalhes = function() {
  renderizarRegras();
  mostrarStep(3);
}

/**
 * Cria e exibe a lista de regras com checkboxes para o usuário.
 */
function renderizarRegras() {
  const grid = document.getElementById('regrasGrid');
  grid.innerHTML = REGRAS.map((regra, i) => `
    <div class="regra-item">
      <input type="checkbox" id="regra${i}" checked>
      <label for="regra${i}" style="margin: 0;">${regra}</label>
    </div>
  `).join('');
}

/**
 * Permite que o usuário selecione uma imagem e exibe um preview.
 */
window.alterarFoto = function() {
  const file = document.getElementById('fotoUpload').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      fotoUrl = e.target.result;
      document.getElementById('previewImg').src = fotoUrl;
    };
    reader.readAsDataURL(file);
  }
}

/**
 * Coleta todos os dados do formulário e os envia para o Supabase.
 */
window.enviarGrupo = async function() {
  const nome = document.getElementById('nomeInput').value.trim();
  const descricao = document.getElementById('descInput').value.trim();
  const categoria = document.getElementById('categoriaSelect').value;
  const email = document.getElementById('emailInput').value.trim();

  if (!nome || !categoria || !email) {
    alert('Por favor, preencha todos os campos obrigatórios (*)');
    return;
  }

  const regras = REGRAS.filter((_, i) => 
    document.getElementById(`regra${i}`).checked
  );
  
  const tipoEntidade = tipoSelecionado === 'canal_whatsapp' ? 'Canal' : 'Grupo';

  const data = {
    nome,
    link: linkValidado,
    tipo: tipoSelecionado,
    descricao,
    categoria,
    foto_url: fotoUrl,
    email,
    regras: JSON.stringify(regras),
    aprovado: false
  };

  try {
    const resultado = await supabaseFetch('grupos', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    await salvarGrupoLocal({ ...data, id: resultado[0].id });

    alert(`✅ ${tipoEntidade} enviado para análise! Você receberá um email quando for aprovado.`);
    window.location.href = '/meus-grupos/';
  } catch (error) {
    alert(`Erro ao enviar ${tipoEntidade.toLowerCase()}: ` + error.message);
  }
}

// Expondo funções para o escopo global para serem acessíveis pelo HTML
window.voltarStep = voltarStep;
