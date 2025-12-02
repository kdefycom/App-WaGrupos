function podeImpulsionar(grupo) {
    if (!grupo.ultimo_boost) return true;
    const cooldown = 120 * 60 * 1000; // 120 minutos

    // FIX: Garante que a data do banco de dados seja tratada como UTC.
    // Adiciona 'Z' ao final da string de data para que o JavaScript a interprete como UTC,
    // evitando a conversão para o fuso horário local do navegador.
    let ultimoBoostStr = grupo.ultimo_boost.replace(' ', 'T');
    if (!ultimoBoostStr.endsWith('Z')) {
        ultimoBoostStr += 'Z';
    }
    const ultimoBoostTime = new Date(ultimoBoostStr).getTime();

    return Date.now() - ultimoBoostTime > cooldown;
}
  
async function impulsionar(event, id) { 
    const button = event.target; 
    button.disabled = true; 
    button.textContent = 'IMPULSIONANDO...'; 
    try { 
        // new Date().toISOString() já está no formato UTC correto (com 'Z' no final).
        await supabaseFetch(`grupos?id=eq.${id}`, { 
            method: 'PATCH', 
            body: JSON.stringify({ ultimo_boost: new Date().toISOString() }) 
        }); 
        openBoostPopup(); 
        carregarMeusGrupos(); 
    } catch { 
        button.disabled = false; 
        button.textContent = '🚀 IMPULSIONAR'; 
    } 
}

function startCountdown(grupo) {
    const timerElement = document.querySelector(`.boost-timer[data-group-id="${grupo.id}"]`);
    if (!timerElement) return;

    // FIX: Garante que a data do banco de dados seja tratada como UTC.
    let ultimoBoostStr = grupo.ultimo_boost.replace(' ', 'T');
    if (!ultimoBoostStr.endsWith('Z')) {
        ultimoBoostStr += 'Z';
    }
    const endTime = new Date(ultimoBoostStr).getTime() + 120 * 60 * 1000; // 120 minutos

    const updateTimer = () => {
      const now = Date.now();
      const remainingTime = endTime - now;

      if (remainingTime <= 0) {
        clearInterval(activeTimers[grupo.id]);
        delete activeTimers[grupo.id];
        
        setTimeout(() => {
           if (document.querySelector(`.boost-timer[data-group-id="${grupo.id}"]`)) {
              carregarMeusGrupos();
           }
        }, 1000);
        return;
      }

      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      timerElement.innerHTML = `⏰ ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    if (activeTimers[grupo.id]) {
      clearInterval(activeTimers[grupo.id]);
    }
    
    updateTimer(); 
    activeTimers[grupo.id] = setInterval(updateTimer, 1000);
}
