
function getCategoryName(id) {
    if (typeof CATEGORIES === 'undefined' || !id) return 'Outros';
    const category = CATEGORIES.find(cat => cat.id === id);
    return category ? category.name : id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' ');
}

function podeImpulsionar(grupo) {
    if (!grupo.ultimo_boost) return true;
    const duasHoras = 2 * 60 * 60 * 1000;
    return Date.now() - new Date(grupo.ultimo_boost).getTime() > duasHoras;
}

function tempoRestante(grupo) {
    if (!grupo.ultimo_boost) return '0min';
    const duasHoras = 2 * 60 * 60 * 1000;
    const passado = Date.now() - new Date(grupo.ultimo_boost).getTime();
    const restante = duasHoras - passado;
    const minutos = Math.ceil(restante / 60000);
    return `${minutos}min`;
}

function escapeHTML(str) {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
}

export { getCategoryName, podeImpulsionar, tempoRestante, escapeHTML };
