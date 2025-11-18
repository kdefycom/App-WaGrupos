let tipoSelecionado = '';
let linkValidado = '';
let fotoUrl = 'https://via.placeholder.com/300';
let fotoFile = null; // Variável para guardar o objeto do arquivo

const REGRAS = [
  'Proibido conteúdo pornográfico',
  'Proibido brigas e discussões',
  'Proibido racismo',
  'Proibido assédio',
  'Respeitar LGPD',
  'Proibido spam',
  'Proibido links maliciosos'
];

document.addEventListener('DOMContentLoaded', () => {
  popularCategorias();
  // Adiciona o elemento do spinner ao botão
  document.getElementById('enviarBtn').innerHTML += ' <div class="spinner" id="spinner"></div>';
});

function popularCategorias() {
  const select = document.getElementById('categoriaSelect');
  if (!select || typeof CATEGORIES === 'undefined') {
    console.error('Elemento select ou array de CATEGORIAS não encontrado.');
    return;
  }

  select.innerHTML = ''; // Limpa opções

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

function mostrarStep(numero) {
  document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
  document.getElementById(`step${numero}`).classList.add('active');
}

function voltarStep(numero) {
  mostrarStep(numero);
}

function escolherTipo(tipo) {
  tipoSelecionado = tipo;
  const tipoTextos = {
      'whatsapp': 'WhatsApp',
      'telegram': 'Telegram',
      'canal_whatsapp': 'Canal do WhatsApp',
      'instagram': 'Instagram'
  };
  document.getElementById('tipoTexto').textContent = tipoTextos[tipo] || '';
  mostrarStep(2);
}

async function validarLink() {
  const linkInput = document.getElementById('linkInput');
  const link = linkInput.value.trim();
  const alertDiv = document.getElementById('alert');

  if (!link) {
    alertDiv.innerHTML = '<div class="alert alert-error">Por favor, cole o link.</div>';
    return;
  }
  
  const validacoes = {
      'whatsapp': { prefix: 'https://chat.whatsapp.com/', error: 'Link de WhatsApp inválido. Deve começar com https://chat.whatsapp.com/' },
      'telegram': { prefix: 'https://t.me/', error: 'Link de Telegram inválido. Deve começar com https://t.me/' },
      'canal_whatsapp': { prefix: 'https://whatsapp.com/channel/', error: 'Link de Canal do WhatsApp inválido. Deve começar com https://whatsapp.com/channel/' },
      'instagram': { groupPrefix: 'https://ig.me/j/', error: 'Link de grupo do Instagram inválido. Deve começar com https://ig.me/j/' }
  };

  const { prefix, groupPrefix, error } = validacoes[tipoSelecionado];

  let isValid = link.startsWith(prefix) || (groupPrefix && link.startsWith(groupPrefix));

  if (tipoSelecionado === 'instagram' && !link.startsWith('https://ig.me/j/')) {
      isValid = false;
  }

  if (!isValid) {
      alertDiv.innerHTML = `<div class="alert alert-error">${error}</div>`;
      return;
  }

  try {
    const { data: grupos, error: fetchError } = await supabase
      .from('grupos')
      .select('link')
      .eq('link', link);

    if (fetchError) throw fetchError;

    if (grupos.length > 0) {
      alertDiv.innerHTML = '<div class="alert alert-error">Este link já foi cadastrado!</div>';
      return;
    }

    alertDiv.innerHTML = '<div class="alert alert-success">✓ Link válido! Carregando detalhes...</div>';
    linkValidado = link;

    setTimeout(() => {
      renderizarRegras();
      mostrarStep(3);
    }, 1000);

  } catch (error) {
    console.error('Erro ao validar link:', error);
    alertDiv.innerHTML = `<div class="alert alert-error">Erro ao validar o link: ${error.message}. Tente novamente.</div>`;
  }
}


function renderizarRegras() {
  const grid = document.getElementById('regrasGrid');
  grid.innerHTML = REGRAS.map((regra, i) => `
    <div class="regra-item">
      <input type="checkbox" id="regra${i}" checked>
      <label for="regra${i}" style="margin: 0;">${regra}</label>
    </div>
  `).join('');
}

function alterarFoto() {
  const file = document.getElementById('fotoUpload').files[0];
  if (!file) return;

  fotoFile = file; // Guarda o arquivo para o upload
  
  // Cria uma URL local para o preview da imagem
  const previewUrl = URL.createObjectURL(file);
  document.getElementById('previewImg').src = previewUrl;
}

// --- NOVA FUNÇÃO DE UPLOAD ---
async function uploadFoto() {
    if (!fotoFile) {
        // Se nenhuma foto for selecionada, retorna null.
        return null; 
    }

    const fileExt = fotoFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { data, error } = await supabase.storage
        .from('fotos-grupos')
        .upload(filePath, fotoFile);

    if (error) {
        console.error('Erro no upload da foto:', error);
        throw new Error('Não foi possível fazer o upload da imagem.');
    }

    // Pega a URL pública do arquivo que acabamos de subir
    const { data: publicUrlData } = supabase.storage
        .from('fotos-grupos')
        .getPublicUrl(data.path);

    if (!publicUrlData) {
        throw new Error('Não foi possível obter a URL pública da imagem.');
    }
    
    return publicUrlData.publicUrl;
}


async function enviarGrupo() {
  const enviarBtn = document.getElementById('enviarBtn');
  const spinner = document.getElementById('spinner');

  // Desabilita o botão e mostra o spinner
  enviarBtn.disabled = true;
  spinner.style.display = 'inline-block';

  const nome = document.getElementById('nomeInput').value.trim();
  const descricao = document.getElementById('descInput').value.trim();
  const categoria = document.getElementById('categoriaSelect').value;
  const email = document.getElementById('emailInput').value.trim();

  if (!nome || !categoria || !email) {
    alert('Por favor, preencha todos os campos obrigatórios (*)');
    enviarBtn.disabled = false;
    spinner.style.display = 'none';
    return;
  }
  
  try {
    // Primeiro, faz o upload da foto e pega a URL
    const uploadedFotoUrl = await uploadFoto();
    
    // Usa a URL do upload. Se nenhuma foto foi enviada, mantém a URL placeholder.
    fotoUrl = uploadedFotoUrl || fotoUrl;

    const regras = REGRAS.filter((_, i) => 
      document.getElementById(`regra${i}`).checked
    );

    const grupo = {
      nome,
      link: linkValidado,
      tipo: tipoSelecionado,
      descricao,
      categoria,
      foto_url: fotoUrl, // Usa a nova URL
      email,
      regras: JSON.stringify(regras),
      aprovado: false
    };

    const { data, error } = await supabase
        .from('grupos')
        .insert([grupo])
        .select();

    if (error) throw error;
    
    await salvarGrupoLocal({ ...grupo, id: data[0].id });

    alert('✅ Grupo enviado para análise! Você receberá um email quando for aprovado.');
    window.location.href = '/meus-grupos/';

  } catch (error) {
    console.error('Erro ao enviar grupo:', error);
    alert('Erro ao enviar grupo: ' + error.message);
    
    // Reabilita o botão e esconde o spinner em caso de erro
    enviarBtn.disabled = false;
    spinner.style.display = 'none';
  }
}
