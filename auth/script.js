async function login() {
  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const loginError = document.getElementById('loginError');
  loginError.textContent = '';

  if (!email || !password) {
    loginError.textContent = 'Por favor, preencha email e senha.';
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    loginError.textContent = 'Email ou senha incorretos.';
    console.error('Login error:', error.message);
    return;
  }

  location.reload();
}

async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

async function fetchAsAdmin(endpoint, options = {}) {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    console.error('Não está autenticado.');
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    document.body.classList.remove('admin-view');
    throw new Error('Sessão de administrador inválida ou expirada.');
  }

  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...options.headers
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Erro na requisição de admin');
  }
  return response.json();
}

async function carregarGrupos() {
  try {
    const grupos = await fetchAsAdmin('grupos?order=created_at.desc');
    
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
    const errorElement = document.getElementById('gruposLista');
    errorElement.textContent = error.message;
    errorElement.style.textAlign = 'center';
    errorElement.style.padding = '40px';
    errorElement.style.color = '#aaa';
  }
}

async function aprovar(id) {
  if (!confirm('Aprovar este grupo?')) return;
  try {
    await fetchAsAdmin(`grupos?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ aprovado: true, mensagem_admin: null })
    });
    alert('Grupo aprovado!');
    carregarGrupos();
  } catch (error) {
    alert('Erro: ' + error.message);
  }
}

async function pagar(id) {
  if (!confirm('Marcar este grupo como pago?')) return;
  try {
    await fetchAsAdmin(`grupos?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ requer_pagamento: true, aprovado: true })
    });
    alert('Grupo marcado como pago e aprovado!');
    carregarGrupos();
  } catch (error) {
    alert('Erro: ' + error.message);
  }
}

async function reprovar(id) {
  const motivo = prompt('Motivo da reprovação:');
  if (!motivo) return;
  try {
    await fetchAsAdmin(`grupos?id=eq.${id}`, {
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
    await fetchAsAdmin(`grupos?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ vip, posicao_vip: vip ? Date.now() : null })
    });
    alert(vip ? 'Grupo agora é VIP!' : 'VIP removido!');
    carregarGrupos();
  } catch (error) {
    alert('Erro: ' + error.message);
  }
}

async function deletarGrupo(id) {
  if (!confirm('DELETAR permanentemente este grupo?')) return;
  try {
    await fetchAsAdmin(`grupos?id=eq.${id}`, { method: 'DELETE' });
    alert('Grupo deletado!');
    carregarGrupos();
  } catch (error) {
    alert('Erro: ' + error.message);
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
    const solicitouExclusao = grupo.solicitou_exclusao;

    let statusBadge = '';
    if (solicitouExclusao) {
        statusBadge = `<span class="status-badge status-exclusao">EXCLUSÃO SOLICITADA</span>`;
    } else if (grupo.aprovado) {
        statusBadge = `<span class="status-badge status-aprovado">Aprovado</span>`;
    } else if (isReprovado) {
        statusBadge = `<span class="status-badge status-reprovado">Reprovado</span>`;
    } else {
        statusBadge = `<span class="status-badge status-pendente">Pendente</span>`;
    }

    let adminActionsHTML = '';
    if (solicitouExclusao) {
        adminActionsHTML = `<button class="btn btn-danger" onclick="deletarGrupo('${grupo.id}')">Deletar</button>`;
    } else {
        let otherActions = '';
        if (isPendente) {
            if (pagos.includes(grupo.categoria)) {
                otherActions = `<button class="btn btn-success" onclick="pagar('${grupo.id}')">Pago</button>`;
            } else {
                otherActions = `<button class="btn btn-success" onclick="aprovar('${grupo.id}')">Aprovar</button>`;
            }
            otherActions += ` <button class="btn btn-warning" onclick="reprovar('${grupo.id}')">Reprovar</button>`;
        } else if (grupo.aprovado) {
            otherActions = grupo.vip 
                ? `<button class="btn btn-warning" onclick="toggleVip('${grupo.id}', false)">Remover VIP</button>`
                : `<button class="btn btn-warning" onclick="toggleVip('${grupo.id}', true)">⭐ Tornar VIP</button>`;
        }
        adminActionsHTML = `
            ${otherActions}
            <button class="btn btn-danger" onclick="deletarGrupo('${grupo.id}')">Deletar</button>
        `;
    }
    
    const motivoHTML = isReprovado 
        ? `<div class="status-info-reprovado"><strong>Motivo:</strong> ${escapeHTML(grupo.mensagem_admin.substring(grupo.mensagem_admin.indexOf(':') + 1).trim())}</div>` 
        : '';
    
    const exclusaoHTML = solicitouExclusao
        ? `<div class="status-info-exclusao"><strong>Aviso:</strong> O usuário solicitou a exclusão deste grupo.</div>`
        : '';

    const pagoHTML = grupo.requer_pagamento ? `<span class="status-badge status-pago">Grupo Pago</span>` : '';

    return `
      <div class="grupo-item ${solicitouExclusao ? 'grupo-solicitou-exclusao' : ''}" id="grupo-${grupo.id}">
        ${statusBadge}
        ${pagoHTML}
        <div class="grupo-foto-container">
          <img src="${escapeHTML(grupo.foto_url) || 'https://via.placeholder.com/1600x900/1A1A1A/FFFFFF?text=Sem+Imagem'}" class="grupo-foto">
        </div>
        <div class="grupo-info">
          <div class="grupo-titulo">${escapeHTML(grupo.nome)}</div>
          <div class="grupo-details">
            <span><strong>CATEGORIA:</strong> ${escapeHTML(getCategoryName(grupo.categoria))}</span>
            <span><strong>TIPO:</strong> ${escapeHTML(grupo.tipo)}</span>
            <span><strong>EMAIL:</strong> ${escapeHTML(grupo.email)}</span>
          </div>
          <div class="grupo-desc">${escapeHTML(grupo.descricao) || 'Sem descrição.'}</div>
          <a href="${escapeHTML(grupo.link)}" target="_blank" class="grupo-link">${escapeHTML(grupo.link)}</a>
          
          <div class="card-footer-action-admin">
             ${adminActionsHTML}
          </div>
          ${motivoHTML}
          ${exclusaoHTML}
        </div>
      </div>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    const supabaseUrl = 'https://aqyaxfrukssndxgctukf.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeWF4ZnJ1a3NzbmR4Z2N0dWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY0MTYsImV4cCI6MjA3Nzg4MjQxNn0.fqP4BfoGBr-A8piJevWto3DnJByYvLxB9gudq81KvJw';
    window.supabase = supabase.createClient(supabaseUrl, supabaseKey);

    const { data: { session } } = await window.supabase.auth.getSession();
    
    if (session) {
        document.body.classList.add('admin-view');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        carregarGrupos();
    } else {
        document.body.classList.remove('admin-view');
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminPanel').style.display = 'none';
    }
});
