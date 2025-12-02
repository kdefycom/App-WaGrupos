
function popularCategorias() {
  const select = document.getElementById('categoriaSelect');
  if (!select || typeof CATEGORIES === 'undefined') {
    console.error('Elemento select ou array de CATEGORIAS não encontrado.');
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

function mostrarStep(numero) {
  document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
  document.getElementById(`step${numero}`).classList.add('active');
}

function voltarStep(numero) {
  mostrarStep(numero);
  if (numero === 1) {
    document.getElementById('linkInput').value = '';
    document.getElementById('alert').innerHTML = '';
    document.getElementById('prosseguirBtn').disabled = true;
    linkValidado = '';
  }
}

function escolherTipo(tipo) {
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

function setupCharCounter() {
  const descInput = document.getElementById('descInput');
  const charCounter = document.getElementById('charCounter');
  const maxLength = descInput.maxLength;

  descInput.addEventListener('input', () => {
    const currentLength = descInput.value.length;
    charCounter.textContent = `${currentLength}/${maxLength}`;
    
    if (currentLength > maxLength) {
      charCounter.classList.add('limite-excedido');
    } else {
      charCounter.classList.remove('limite-excedido');
    }
  });
}
