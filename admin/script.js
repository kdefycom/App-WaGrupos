async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const loginError = document.getElementById('loginError');
  loginError.textContent = '';

  if (!username || !password) {
    loginError.textContent = 'Por favor, preencha todos os campos.';
    return;
  }

  try {
    const passwordHash = await sha256(password);
    const admins = await supabaseFetch(
      `admin_users?username=eq.${username}&password_hash=eq.${passwordHash}`
    );

    if (admins.length > 0) {
      sessionStorage.setItem('admin_auth', 'true');
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('adminPanel').style.display = 'block';
      carregarGrupos();
    } else {
      loginError.textContent = 'Usuário ou senha incorretos';
    }
  } catch (error) {
    loginError.textContent = 'Erro ao fazer login. Verifique o console para mais detalhes.';
    console.error('Login error:', error);
  }
}

function logout() {
  sessionStorage.removeItem('admin_auth');
  location.reload();
}

async function carregarGrupos() {
  try {
    const grupos = await supabaseFetch('grupos?order=created_at.desc');
    
    const total = grupos.length;
    const pendentes = grupos.filter(g => !g.aprovado && !(g.mensagem_admin || '').toLowerCase().includes('reprovado')).length;
    const aprovados = grupos.filter(g => g.aprovado).length;
    const vips = grupos.filter(g => g.vip).length;

    document.getElementById('totalGrupos').textContent = total;
    document.getElementById('pendentes').textContent = pendentes;
    document.getElementById('aprovados').textContent = aprovados;
    document.getElementById('vips').textContent = vips;

    renderizarGrupos(grupos);
  } catch (error) {
    console.error('Erro:', error);
    document.getElementById('gruposLista').innerHTML = '<p>Erro ao carregar grupos.</p>';
  }
}

function getCategoryName(id) {
    if (!id) return 'Outros';
    return id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' ');
}

function renderizarGrupos(grupos) {
  const lista = document.getElementById('gruposLista');
  if (grupos.length === 0) {
    lista.innerHTML = '<p style="text-align:center; padding: 40px; color: #aaa;">Nenhum grupo para mostrar.</p>';
    return;
  }

  lista.innerHTML = grupos.map(grupo => {
    const isReprovado = (grupo.mensagem_admin || '').toLowerCase().includes('reprovado');
    const isPendente = !grupo.aprovado && !isReprovado;

    let statusBadge = '';
    if (grupo.aprovado) {
        statusBadge = `<span class="status-badge status-aprovado">Aprovado</span>`;
    } else if (isReprovado) {
        statusBadge = `<span class="status-badge status-reprovado">Reprovado</span>`;
    } else {
        statusBadge = `<span class="status-badge status-pendente">Pendente</span>`;
    }

    let actionButtonsHTML = '';
    if (isPendente) {
        actionButtonsHTML = `
            <button class="btn btn-success" onclick="aprovar('${grupo.id}')">Aprovar</button>
            <button class="btn btn-warning" onclick="reprovar('${grupo.id}')">Reprovar</button>
        `;
    } else if (grupo.aprovado) {
        actionButtonsHTML = grupo.vip 
            ? `<button class="btn btn-warning" onclick="toggleVip('${grupo.id}', false)">Remover VIP</button>`
            : `<button class="btn btn-warning" onclick="toggleVip('${grupo.id}', true)">⭐ Tornar VIP</button>`;
    }
    
    const motivoHTML = isReprovado 
        ? `<div class="status-info-reprovado"><strong>Motivo:</strong> ${grupo.mensagem_admin.substring(grupo.mensagem_admin.indexOf(':') + 1).trim()}</div>` 
        : '';

    return `
      <div class="grupo-item" id="grupo-${grupo.id}">
        ${statusBadge}
        <div class="grupo-foto-container">
          <img src="${grupo.foto_url || 'https://via.placeholder.com/1600x900/1A1A1A/FFFFFF?text=Sem+Imagem'}" class="grupo-foto">
        </div>
        <div class="grupo-info">
          <div class="grupo-titulo">${grupo.nome}</div>
          <div class="grupo-details">
            <span><strong>CATEGORIA:</strong> ${getCategoryName(grupo.categoria)}</span>
            <span><strong>TIPO:</strong> ${grupo.tipo}</span>
            <span><strong>EMAIL:</strong> ${grupo.email}</span>
          </div>
          <div class="grupo-desc">${grupo.descricao || 'Sem descrição.'}</div>
          <a href="${grupo.link}" target="_blank" class="grupo-link">${grupo.link}</a>
          
          <div class="card-footer-action-admin">
             ${actionButtonsHTML}
            <button class="btn btn-danger" onclick="deletarGrupo('${grupo.id}')">Deletar</button>
          </div>
          ${motivoHTML}
        </div>
      </div>
    `;
  }).join('');
}

async function aprovar(id) {
  if (!confirm('Aprovar este grupo?')) return;
  try {
    await supabaseFetch(`grupos?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ aprovado: true, mensagem_admin: null })
    });
    alert('Grupo aprovado!');
    carregarGrupos();
  } catch (error) {
    alert('Erro: ' + error.message);
  }
}

async function reprovar(id) {
  const motivo = prompt('Motivo da reprovação:');
  if (!motivo) return;
  try {
    await supabaseFetch(`grupos?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        aprovado: false, 
        mensagem_admin: 'Reprovado: ' + motivo 
      })
    });
    alert('Grupo reprovado!');
    carregarGrupos();
  } catch (error) {
    alert('Erro: ' + error.message);
  }
}

async function toggleVip(id, vip) {
  try {
    await supabaseFetch(`grupos?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ vip, posicao_vip: vip ? Date.now() : null })
    });
    alert(vip ? 'Grupo agora é VIP!' : 'VIP removido!');
    carregarGrupos();
  } catch (error) {
    try {
        const parsedError = JSON.parse(error.message);
        alert('Erro: ' + parsedError.message);
    } catch (e) {
        alert('Erro: ' + error.message);
    }
  }
}

async function deletarGrupo(id) {
  if (!confirm('DELETAR permanentemente este grupo?')) return;
  try {
    await supabaseFetch(`grupos?id=eq.${id}`, { method: 'DELETE' });
    alert('Grupo deletado!');
    carregarGrupos();
  } catch (error) {
    alert('Erro: ' + error.message);
  }
}

// Verificar se está logado
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('admin_auth') === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        carregarGrupos();
    }
});
