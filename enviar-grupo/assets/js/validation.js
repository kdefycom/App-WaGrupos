
async function validarLinkEProsseguir() {
  const link = document.getElementById('linkInput').value.trim();
  const alertDiv = document.getElementById('alert');
  alertDiv.className = 'alert'; // Limpa classes de cor
  const validarLinkBtn = document.getElementById('validarLinkBtn');


  if (!link) {
    alertDiv.innerHTML = 'Por favor, insira um link.';
    alertDiv.className = 'alert alert-error';
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

  validarLinkBtn.disabled = true;
  validarLinkBtn.textContent = 'Aguarde...';

  try {
    const baseLink = link.split('?')[0];
    const grupos = await supabaseFetch(`grupos?link=like.${encodeURIComponent(baseLink)}*`);

    if (grupos.length > 0) {
      alertDiv.innerHTML = 'Este link já foi cadastrado!';
      alertDiv.className = 'alert alert-error';
      validarLinkBtn.disabled = false;
      validarLinkBtn.textContent = '🔄 Validar Link';
      return;
    }

    linkValidado = link;

    if (tipoSelecionado === 'whatsapp' || tipoSelecionado === 'telegram') {
        const endpoint = tipoSelecionado === 'whatsapp' ? 'whatsapp/group' : 'telegram';
        try {
            const response = await fetch(`https://vpi-staw.onrender.com/${endpoint}?link=${encodeURIComponent(link)}`);
            if (response.ok) {
                const data = await response.json();
                if(data.nome_do_grupo) {
                    document.getElementById('nomeInput').value = data.nome_do_grupo;
                }
                if(data.url_foto) {
                    document.getElementById('previewImg').src = data.url_foto;
                    fotoUrl = data.url_foto; // CORREÇÃO FINAL
                }
            } else {
                console.error('Falha ao buscar dados da API: ' + response.statusText);
            }
        } catch (error) {
            console.error('Erro ao chamar a API: ' + error);
        }
    }

    prosseguirParaDetalhes();

  } catch (error) {
    console.error("Erro ao validar link: ", error);
    alertDiv.innerHTML = 'Erro ao verificar o link.';
    alertDiv.className = 'alert alert-error';
  } finally {
    validarLinkBtn.disabled = false;
    validarLinkBtn.textContent = '🔄 Validar Link';
  }
}
