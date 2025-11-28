
async function supabaseFetch(url, options = {}) {
    const headers = {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6YW15eGxuZXVrcGJpcWtvZ3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NzExNDUsImV4cCI6MjAxMTI0NzE0NX0.9PZtDEp59YroS3SsW0N1p-t5S3o_p4J6llb8W2v2_2Y',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6YW15eGxuZXVrcGJpcWtvZ3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NzExNDUsImV4cCI6MjAxMTI0NzE0NX0.9PZtDEp59YroS3SsW0N1p-t5S3o_p4J6llb8W2v2_2Y',
        'Content-Type': 'application/json'
    };
    const response = await fetch(`https://zzamyxlneukpbiqkogth.supabase.co/rest/v1/${url}`, { ...options, headers });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
}

async function buscarGruposLocais() {
    return JSON.parse(localStorage.getItem('meusGrupos') || '[]');
}

async function salvarGrupoLocal(grupo) {
    const grupos = await buscarGruposLocais();
    const index = grupos.findIndex(g => g.id === grupo.id);
    if (index > -1) {
        grupos[index] = { ...grupos[index], ...grupo };
    } else {
        grupos.push(grupo);
    }
    localStorage.setItem('meusGrupos', JSON.stringify(grupos));
}

async function removerGrupoLocal(id) {
    let grupos = await buscarGruposLocais();
    grupos = grupos.filter(g => g.id !== id);
    localStorage.setItem('meusGrupos', JSON.stringify(grupos));
}

async function fetchAndSyncGroups() {
    const gruposLocais = await buscarGruposLocais();
    if (gruposLocais.length === 0) return [];

    const ids = gruposLocais.map(g => g.id);
    const gruposAPI = await supabaseFetch(`grupos?id=in.(${ids.join(',')})`);
    
    const idsAPI = new Set(gruposAPI.map(g => g.id));
    const gruposSincronizados = [];

    for (const grupoLocal of gruposLocais) {
        if (idsAPI.has(grupoLocal.id)) {
            const apiData = gruposAPI.find(g => g.id === grupoLocal.id);
            gruposSincronizados.push({ ...grupoLocal, ...apiData });
        } else {
            await removerGrupoLocal(grupoLocal.id);
        }
    }
    return gruposSincronizados.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

async function boostGroup(id) {
    return await supabaseFetch(`grupos?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ultimo_boost: new Date().toISOString() })
    });
}

async function requestGroupDeletion(id) {
    await removerGrupoLocal(id);
    return await supabaseFetch(`grupos?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ solicitou_exclusao: true, mensagem_admin: 'Usuário solicitou a exclusão.' })
    });
}

async function updateGroup(id, data) {
    const [updatedGroup] = await supabaseFetch(`grupos?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
    await salvarGrupoLocal(updatedGroup);
    return updatedGroup;
}

export { fetchAndSyncGroups, boostGroup, requestGroupDeletion, updateGroup, buscarGruposLocais, salvarGrupoLocal, removerGrupoLocal };
