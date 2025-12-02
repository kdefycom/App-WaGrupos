
function prosseguirParaDetalhes() {
  renderizarRegras();
  mostrarStep(3);
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
  if (file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      customAlert('A imagem é muito grande. O tamanho máximo é de 5MB.', 'Erro');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      fotoUrl = e.target.result;
      document.getElementById('previewImg').src = fotoUrl;
    };
    reader.readAsDataURL(file);
  }
}

async function enviarGrupo() {
  const nome = document.getElementById('nomeInput').value.trim();
  const descricao = document.getElementById('descInput').value.trim();
  const categoria = document.getElementById('categoriaSelect').value;
  const email = document.getElementById('emailInput').value.trim();

  const regras = REGRAS.filter((_, i) => 
    document.getElementById(`regra${i}`).checked
  );
  
  const tipoEntidade = tipoSelecionado === 'canal_whatsapp' ? 'Canal' : 'Grupo';

  const selectedCategory = CATEGORIES.find(cat => cat.id === categoria);
  const requires_payment = selectedCategory ? selectedCategory.requires_fee || false : false;

  const data = {
    nome,
    link: linkValidado,
    tipo: tipoSelecionado,
    descricao,
    categoria,
    foto_url: fotoUrl,
    email,
    regras: JSON.stringify(regras),
    aprovado: false,
    requires_payment: requires_payment,
    pago: false
  };

  try {
    const resultado = await supabaseFetch('grupos', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    await salvarGrupoLocal({ ...data, id: resultado[0].id });

    await customAlert(`✅ ${tipoEntidade} enviado para análise! Você receberá um email quando for aprovado.`, 'Sucesso');
    window.location.href = '/meus-grupos/';
  } catch (error) {
    await customAlert(`Erro ao enviar ${tipoEntidade.toLowerCase()}: ` + error.message, 'Erro');
  }
}
