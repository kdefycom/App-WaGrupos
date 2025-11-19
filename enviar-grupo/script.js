
    let tipoSelecionado = '';
    let linkValidado = '';
    let fotoFile = null; // Para armazenar o objeto do arquivo da foto
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
      // Adiciona o listener para o input de foto
      document.getElementById('fotoUpload').addEventListener('change', alterarFoto);
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
        case 'whatsapp': tipoTexto = 'Grupo de WhatsApp'; break;
        case 'telegram': tipoTexto = 'Grupo de Telegram'; break;
        case 'instagram': tipoTexto = 'Grupo de Instagram'; break;
        case 'canal_whatsapp': tipoTexto = 'Canal do WhatsApp'; break;
      }
      document.getElementById('tipoTexto').textContent = tipoTexto;
      mostrarStep(2);
    }

    async function validarLinkEmTempoReal() {
      const link = document.getElementById('linkInput').value.trim();
      const alertDiv = document.getElementById('alert');
      const prosseguirBtn = document.getElementById('prosseguirBtn');
      prosseguirBtn.disabled = true;
      alertDiv.className = 'alert';

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
      if (!file) {
        fotoFile = null;
        return;
      }
      fotoFile = file; // Armazena o arquivo para o upload

      // Gera uma pré-visualização para o usuário
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById('previewImg').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    async function uploadFotoParaStorage(file) {
        if (!file) return null;
        
        // As variáveis SUPABASE_URL e SUPABASE_KEY devem estar disponíveis globalmente
        if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_KEY === 'undefined') {
            console.error('As variáveis SUPABASE_URL e SUPABASE_KEY não estão definidas.');
            await customAlert('Erro de configuração: Não foi possível conectar ao serviço de armazenamento.', 'Erro');
            return null;
        }

        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        try {
            const response = await fetch(`${SUPABASE_URL}/storage/v1/object/fotos_grupos/${fileName}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'apikey': SUPABASE_KEY,
                    'Content-Type': file.type,
                },
                body: file
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro desconhecido no upload');
            }

            // Constrói a URL pública da imagem
            const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/fotos_grupos/${fileName}`;
            return publicUrl;

        } catch (error) {
            console.error('Erro ao fazer upload da foto:', error);
            await customAlert(`Houve um erro ao enviar sua foto: ${error.message}`, 'Erro de Upload');
            return null;
        }
    }

    async function enviarGrupo() {
      const enviarBtn = document.querySelector('#step3 .btn-primary');
      enviarBtn.disabled = true;
      enviarBtn.textContent = 'Enviando...';

      const nome = document.getElementById('nomeInput').value.trim();
      const descricao = document.getElementById('descInput').value.trim();
      const categoria = document.getElementById('categoriaSelect').value;
      const email = document.getElementById('emailInput').value.trim();

      if (!nome || !categoria || !email) {
        await customAlert('Por favor, preencha todos os campos obrigatórios (*)', 'Campos Obrigatórios');
        enviarBtn.disabled = false;
        enviarBtn.textContent = '➕ Enviar Grupo';
        return;
      }

      let finalFotoUrl = null;
      if (fotoFile) {
        finalFotoUrl = await uploadFotoParaStorage(fotoFile);
        if (!finalFotoUrl) {
          // Se o upload falhar, interrompe o processo e reativa o botão
          enviarBtn.disabled = false;
          enviarBtn.textContent = '➕ Enviar Grupo';
          return;
        }
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
        foto_url: finalFotoUrl, // Usa a URL do Storage ou null se não houver foto
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

        await customAlert(`✅ ${tipoEntidade} enviado para análise! Você receberá um email quando for aprovado.`, 'Sucesso');
        window.location.href = '/meus-grupos/';
      } catch (error) {
        await customAlert(`Erro ao enviar ${tipoEntidade.toLowerCase()}: ` + error.message, 'Erro');
        // Reativa o botão em caso de falha no envio do grupo
        enviarBtn.disabled = false;
        enviarBtn.textContent = '➕ Enviar Grupo';
      }
    }
