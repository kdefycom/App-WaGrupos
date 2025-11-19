
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

    document.addEventListener('DOMContentLoaded', () => {
      popularCategorias();
      document.getElementById('linkInput').addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(validarLinkEmTempoReal, 500);
      });
    });

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

    async function validarLinkEmTempoReal() {
      const link = document.getElementById('linkInput').value.trim();
      const alertDiv = document.getElementById('alert');
      const prosseguirBtn = document.getElementById('prosseguirBtn');
      prosseguirBtn.disabled = true;

      if (!link) {
        alertDiv.innerHTML = '';
        return;
      }

      let isValid = false;
      const tipoTexto = document.getElementById('tipoTexto').textContent || tipoSelecionado;

      const patterns = {
          whatsapp: /^https:\/\/chat\.whatsapp\.com\/[a-zA-Z0-9\\-_?=&]+$/,
          telegram: /^https:\/\/t\.me\/[a-zA-Z0-9_]+$/,
          instagram: /^https:\/\/ig\.me\/j\/[a-zA-Z0-9\\-_=\\/]+$/,
          canal_whatsapp: /^https:\/\/whatsapp\.com\/channel\/[a-zA-Z0-9\\-_]+$/
      };

      const regex = patterns[tipoSelecionado];
      if (regex) {
          isValid = regex.test(link);
      }

      if (!isValid) {
        alertDiv.innerHTML = `<div class=\"alert alert-error\">Link de ${tipoTexto} inválido.</div>`;
        return;
      }

      try {
        const baseLink = link.split('?')[0];
        const grupos = await supabaseFetch(`grupos?link=like.${encodeURIComponent(baseLink)}*`);

        if (grupos.length > 0) {
          alertDiv.innerHTML = '<div class=\"alert alert-error\">Este link já foi cadastrado!</div>';
          return;
        }

        alertDiv.innerHTML = '<div class=\"alert alert-success\">✓ Link válido!</div>';
        linkValidado = link;
        prosseguirBtn.disabled = false;

      } catch (error) {
        alertDiv.innerHTML = '<div class=\"alert alert-error\">Erro ao verificar o link.</div>';
      }
    }

    function prosseguirParaDetalhes() {
      renderizarRegras();
      mostrarStep(3);
    }

    function renderizarRegras() {
      const grid = document.getElementById('regrasGrid');
      grid.innerHTML = REGRAS.map((regra, i) => `
        <div class=\"regra-item\">
          <input type=\"checkbox\" id=\"regra${i}\" checked>
          <label for=\"regra${i}\" style=\"margin: 0;\">${regra}</label>
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
        await customAlert('Por favor, preencha todos os campos obrigatórios (*)', 'Campos Obrigatórios');
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

        await customAlert('✅ Grupo enviado para análise! Você receberá um email quando for aprovado.', 'Sucesso');
        window.location.href = '/meus-grupos/';
      } catch (error) {
        await customAlert('Erro ao enviar grupo: ' + error.message, 'Erro');
      }
    }
