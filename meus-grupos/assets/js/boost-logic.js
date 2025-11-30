function podeImpulsionar(grupo) { if (!grupo.ultimo_boost) return true; const duasHoras = 2 * 60 * 60 * 1000; return Date.now() - new Date(grupo.ultimo_boost).getTime() > duasHoras; }
  
async function impulsionar(event, id) { 
    const button = event.target; 
    button.disabled = true; 
    button.textContent = 'IMPULSIONANDO...'; 
    try { 
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

    const endTime = new Date(grupo.ultimo_boost).getTime() + 2 * 60 * 60 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const remainingTime = endTime - now;

      if (remainingTime <= 0) {
        clearInterval(activeTimers[grupo.id]);
        delete activeTimers[grupo.id];
        // Adiciona um pequeno delay para evitar recarregamentos múltiplos e rápidos
        setTimeout(() => {
           // Apenas recarrega se o botão de impulsionar ainda não apareceu
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
