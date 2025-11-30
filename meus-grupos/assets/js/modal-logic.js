function setupModal() {
    const overlay = document.getElementById('editModalOverlay');
    const cancelBtn = document.getElementById('cancelEdit');
    const saveBtn = document.getElementById('saveEdit');

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) fecharModalEdicao();
    });
    cancelBtn.addEventListener('click', fecharModalEdicao);
    saveBtn.addEventListener('click', salvarEdicao);
}

function editarGrupo(id) {
    const grupo = meusGrupos.find(g => g.id === id);
    if (!grupo) return;

    const tipoEntidade = grupo.tipo === 'canal_whatsapp' ? 'Canal' : 'Grupo';

    document.getElementById('editModalTitle').textContent = `Editar ${tipoEntidade}`;
    document.getElementById('editFotoLabel').textContent = `Foto do ${tipoEntidade}`;
    document.getElementById('editLinkLabel').textContent = `Link do ${tipoEntidade}`;

    document.getElementById('editGroupId').value = id;
    document.getElementById('editLink').value = grupo.link || '';

    const preview = document.getElementById('editFotoPreview');

    if (grupo.foto_url) {
      preview.src = grupo.foto_url;

      if (grupo.foto_url.startsWith("data:image")) {
        const prefix = grupo.foto_url.substring(0, grupo.foto_url.indexOf(",") + 1);
        const semPrefixo = grupo.foto_url.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
        preview.dataset.prefix = prefix;
        preview.dataset.base64 = semPrefixo;
      } else {
        preview.dataset.prefix = "";
        preview.dataset.base64 = "";
      }

      preview.style.display = "block";
    } else {
      preview.style.display = "none";
      preview.dataset.prefix = "";
      preview.dataset.base64 = "";
    }

    document.getElementById('editModalOverlay').style.display = 'flex';
}

function fecharModalEdicao() {
    document.getElementById('editModalOverlay').style.display = 'none';
}

async function salvarEdicao() {
    const id = document.getElementById('editGroupId').value;
    const grupo = meusGrupos.find(g => g.id === id);
    if (!grupo) return;

    const link = document.getElementById('editLink').value.trim();
    const preview = document.getElementById('editFotoPreview');

    const base64 = preview.dataset.base64 || "";
    const prefix = preview.dataset.prefix || "";

    let foto_final = grupo.foto_url;

    const mudouFoto = base64 !== "" && (prefix + base64) !== grupo.foto_url;
    const mudouLink = link !== grupo.link;

    if (!mudouFoto && !mudouLink) {
      await customAlert("Nenhuma alteração foi feita.", "Aviso");
      return;
    }

    if (mudouFoto) foto_final = prefix + base64;

    const saveBtn = document.getElementById('saveEdit');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Salvando...';
    saveBtn.disabled = true;

    try {
      const [updatedGroup] = await supabaseFetch(`grupos?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          foto_url: foto_final,
          link: link,
          aprovado: false,
          mensagem_admin: 'Grupo em reanálise após edição.'
        })
      });

      await salvarGrupoLocal(updatedGroup);

      fecharModalEdicao();
      await customAlert("Alterações enviadas para análise. Aguarde a aprovação.", "Sucesso");
      setTimeout(() => carregarMeusGrupos(), 500);

    } finally {
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
    }
}
