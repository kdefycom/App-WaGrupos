    let tipoSelecionado = '';
    let linkValidado = '';
    let fotoUrl = 'https://via.placeholder.com/300';

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
    });

    function popularCategorias() {
      const select = document.getElementById('categoriaSelect');
      if (!select || typeof CATEGORIES === 'undefined') {
        console.error('Elemento select ou array de CATEGORIAS não encontrado.');
        return;
      }

      select.innerHTML = ''; // Limpa as opções estáticas

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
      let tipoTexto = '';
      switch (tipo) {
        case 'whatsapp':
          tipoTexto = 'WhatsApp';
          break;
        case 'telegram':
          tipoTexto = 'Telegram';
          break;
        case 'instagram':
          tipoTexto = 'Instagram';
          break;
        case 'canal_whatsapp':
          tipoTexto = 'Canal do WhatsApp';
          break;
      }
      document.getElementById('tipoTexto').textContent = tipoTexto;
      mostrarStep(2);
    }

    async function validarLink() {
      const link = document.getElementById('linkInput').value.trim();
      const alert = document.getElementById('alert');

      if (!link) {
        alert.innerHTML = '<div class="alert alert-error">Por favor, cole o link.</div>';
        return;
      }

      let isValid = false;
      switch (tipoSelecionado) {
        case 'whatsapp':
          isValid = link.startsWith('https://chat.whatsapp.com/');
          break;
        case 'telegram':
          isValid = link.startsWith('https://t.me/');
          break;
        case 'instagram':
          isValid = link.startsWith('https://www.instagram.com/') || link.startsWith('https://instagram.com/');
          break;
        case 'canal_whatsapp':
          isValid = link.startsWith('https://whatsapp.com/channel/');
          break;
      }

      if (!isValid) {
        alert.innerHTML = `<div class="alert alert-error">Link de ${tipoSelecionado} inválido.</div>`;
        return;
      }

      try {
        const grupos = await supabaseFetch(`grupos?link=eq.${encodeURIComponent(link)}`);
        if (grupos.length > 0) {
          alert.innerHTML = '<div class="alert alert-error">Este link já foi cadastrado!</div>';
          return;
        }

        alert.innerHTML = '<div class="alert alert-success">✓ Link válido! Carregando preview...</div>';
        linkValidado = link;

        setTimeout(() => {
          renderizarRegras();
          mostrarStep(3);
        }, 1000);

      } catch (error) {
        alert.innerHTML = '<div class="alert alert-error">Erro ao validar link. Tente novamente.</div>';
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
      if (file) {
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

      if (!nome || !categoria || !email) {
        alert('Por favor, preencha todos os campos obrigatórios (*)');
        return;
      }

      const regras = REGRAS.filter((_, i) => 
        document.getElementById(`regra${i}`).checked
      );

      const grupo = {
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
          body: JSON.stringify(grupo)
        });

        await salvarGrupoLocal({ ...grupo, id: resultado[0].id });

        alert('✅ Grupo enviado para análise! Você receberá um email quando for aprovado.');
        window.location.href = '/meus-grupos/';
      } catch (error) {
        alert('Erro ao enviar grupo: ' + error.message);
      }
    }
